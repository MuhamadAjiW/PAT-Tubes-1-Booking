import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WebhookRegisterRequest } from '../types/WebhookRegisterRequest';
import axios from 'axios';
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from '../middlewares/error-middleware';
import { BadRequestError } from '../types/errors/BadRequestError';
import { App } from '../app';
import { WebhookRepository } from '../repository/webhook-repository';
import { ConflictError } from '../types/errors/ConflictError';
import { UnauthorizedError } from '../types/errors/UnauthorizedError';
import { PaymentController } from './payment-controller';
import { WebhookCoreData, WebhookData } from '../types/WebhookData';
import { WebhookClient } from '../types/WebhookClient';

export class WebhookController{
    app: App;
    webhookRepository: WebhookRepository;
    reservedEndpoints: String[] = ["/test", "/clients", "/events"];

    constructor(app: App){
        this.app = app;
        this.webhookRepository = new WebhookRepository();
        this.refreshWebhooks()
    }

    public static async test(req: Request, res: Response){
        console.log("Registered test webhook triggered");
    }

    testWebhook(){
        return async (req: Request, res: Response) => {            
            console.log("Test webhook triggered");
    
            res.status(StatusCodes.OK).json({
                message: "Webhook test successful",
                valid: true,
                data: null
            });
            return;
        }
    }

    registerClient(){
        return async (req: Request, res: Response) => {
            // TODO:  Verify allowed ip?
            console.log("Webhook registration request received")
            if(!req.ip) throw new BadRequestError("Undefined ip address");
            
            const registered = await this.webhookRepository.getWebhookClientByIp(req.ip);
            if(registered) throw new ConflictError("ip address already registered")
            
            const token = crypto.randomUUID();
            const client = await this.webhookRepository.insertWebhookClient(req.ip, token);
        
            res.status(StatusCodes.CREATED).json({
                message: "Webhook addition successful",
                valid: true,
                data: client
            });
            return;
        }
    }

    registerWebhook(){
        return async (req: Request, res: Response) => {
            let token = req.get("API-Key");
            if(!token) throw new UnauthorizedError("No token provided");            

            let webhookRegisterRequest: WebhookRegisterRequest
            try {
                webhookRegisterRequest = WebhookRegisterRequest.parse(req.body);
            } catch (error) {
                throw new BadRequestError("Bad request parameters");
            }
            
            if(webhookRegisterRequest.endpoint in this.reservedEndpoints) throw new ConflictError("Reserved endpoint");
            if(!req.ip) throw new BadRequestError("Undefined ip address");
            
            const registered = await this.webhookRepository.getWebhookClientByIp(req.ip);
            if(!registered) throw new UnauthorizedError("ip address not registered");
            if(token != registered.token) throw new UnauthorizedError("Bad token");

            const registeredEndpoint = await this.webhookRepository.getWebhookByClintAndEndpoint(registered.client_id, webhookRegisterRequest.endpoint);

            if(registeredEndpoint) throw new ConflictError("This endpoint has already been registered");

            // Register the webhooks
            const handler = this.getHandler(webhookRegisterRequest.eventName);
            const endpoints: String[] = await this.webhookRepository.getWebhookUniqueEndpoints();
            if(!(webhookRegisterRequest.endpoint in endpoints)){
                this.registerBaseWebhook(webhookRegisterRequest.endpoint);
            }
            this.registerMainWebhook({event_name: webhookRegisterRequest.eventName, endpoint: webhookRegisterRequest.endpoint}, registered, handler);
            this.webhookRepository.insertWebhook(webhookRegisterRequest, registered.client_id);
    
            res.status(StatusCodes.CREATED).json({
                message: "Webhook addition successful",
                valid: true,
                data: null
            }).send();
            return;
        }
    }

    private registerBaseWebhook(endpoint: string){
        this.app.server.post( "/webhook" + endpoint,
            async (newreq: Request, newres: Response) => {
                console.log("Webhook base received a call")
                let webhookToken = newreq.get("API-Key");
                if(!webhookToken){
                    newres.status(StatusCodes.UNAUTHORIZED).json({
                        message: "No token provided",
                        valid: false,
                    }).send();
                    return;
                }
                if(!newreq.ip){
                    newres.status(StatusCodes.BAD_REQUEST).json({
                        message: "Undefined ip",
                        valid: false,
                    }).send();
                    return;
                }
                
                let client: WebhookClient = await this.webhookRepository.getWebhookClientByIp(newreq.ip);
                if(!client){
                    newres.status(StatusCodes.UNAUTHORIZED).json({
                        message: "Unregistered client",
                        valid: false,
                    }).send();
                    return;
                }

                const serverUrl = `${newreq.protocol}://${newreq.get('host')}`;
                const forwardEndpoint = "/webhook/" + client.client_id + endpoint;
                const forwardUrl = serverUrl + forwardEndpoint;
                const axiosResponse = await axios.post(forwardUrl, newreq.body, { headers: newreq.headers });

                newres.status(axiosResponse.status).send(axiosResponse.data);
                return;
            }
        );
    }

    private async registerMainWebhook(webhook: WebhookCoreData, client: WebhookClient, handler: CallableFunction){        
        this.app.server.post( "/webhook/" + client.client_id + webhook.endpoint,
            async (newreq: Request, newres: Response) => {
                console.log("Webhook main received a call")
                let webhookToken = newreq.get("API-Key");
                if(!webhookToken){
                    newres.status(StatusCodes.UNAUTHORIZED).json({
                        message: "No token provided",
                        valid: false,
                    }).send();
                    return;
                }
                if(webhookToken != client.token){
                    newres.status(StatusCodes.UNAUTHORIZED).json({
                        message: "Invalid token",
                        valid: false,
                    }).send();
                    return;
                }

                newres.status(StatusCodes.OK).json({
                    message: webhook.event_name + " webhook triggered",
                    valid: true,
                    data: null
                }).send();

                await handler(newreq, newres);
                return;
            }
        );
    }

    private async refreshWebhooks(){
        console.log("Refreshing webhooks")

        const endpoints: string[] = await this.webhookRepository.getWebhookUniqueEndpoints();
        for (const endpoint of endpoints){
            this.registerBaseWebhook(endpoint);
        }

        const webhooks: WebhookData[] = await this.webhookRepository.getWebhookAll();
        for(const webhook of webhooks){
            const handler: CallableFunction = this.getHandler(webhook.event_name);
            const client: WebhookClient = await this.webhookRepository.getWebhookClientById(webhook.client_id);
            this.registerMainWebhook(webhook, client, handler);
        }

        console.log("Webhook refreshed")
    }

    private getHandler(event_name: string): CallableFunction{
        let handler: CallableFunction;
        switch (event_name) {
            case 'test':
                handler = WebhookController.test;
                break;

            case 'payment':
                handler = PaymentController.onPaymentEvent
                break;
        
            default:
                throw new BadRequestError("invalid requested event name")
        }
        return handler;
    }
}
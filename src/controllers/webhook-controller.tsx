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

export class WebhookController{
    webhookRepository: WebhookRepository;
    reservedEndpoints: String[] = ["/test", "/clients", "/events"];

    constructor(){
        this.webhookRepository = new WebhookRepository();
        this.webhookRepository.cleanWebhook()
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

    registerWebhook(app: App){
        return async (req: Request, res: Response) => {
            let token = req.get("API-Key");
            if(!token) throw new UnauthorizedError("No token provided");            

            let webhookRegisterRequest: WebhookRegisterRequest
            try {
                webhookRegisterRequest = req.body;
                if(!webhookRegisterRequest.endpoint || !webhookRegisterRequest.eventName) throw Error();
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

            // Pick events
            let handler: CallableFunction;
            switch (webhookRegisterRequest.eventName) {
                case 'test':
                    handler = WebhookController.test;
                    break;

                case 'payment':
                    handler = PaymentController.onPaymentEvent
                    break;
            
                default:
                    throw new BadRequestError("invalid requested event name")
            }


            const endpoints: String[] = await this.webhookRepository.getWebhookUniqueEndpoints();
            if(!(webhookRegisterRequest.endpoint in endpoints)){
                app.server.post( "/webhook" + webhookRegisterRequest.endpoint,
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
                        if(webhookToken != token){
                            newres.status(StatusCodes.UNAUTHORIZED).json({
                                message: "Invalid token",
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
                        let client = await this.webhookRepository.getWebhookClientByIp(newreq.ip);
                        
                        const serverUrl = `${newreq.protocol}://${newreq.get('host')}`;
                        const forwardEndpoint = "/webhook/" + client.client_id + webhookRegisterRequest.endpoint;
                        const forwardUrl = serverUrl + forwardEndpoint;
                        const axiosResponse = await axios.post(forwardUrl, newreq.body, { headers: newreq.headers });

                        res.status(axiosResponse.status).send(axiosResponse.data);
                        return;
                });
            }

            app.server.post( "/webhook/" + registered.client_id + webhookRegisterRequest.endpoint,
                // TODO: Implement events
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
                    if(webhookToken != token){
                        newres.status(StatusCodes.UNAUTHORIZED).json({
                            message: "Invalid token",
                            valid: false,
                        }).send();
                        return;
                    }

                    res.status(StatusCodes.OK).json({
                        message: webhookRegisterRequest.eventName + " webhook triggered",
                        valid: true,
                        data: null
                    }).send();

                    await handler(newreq, newres);

                    console.log(webhookRegisterRequest.eventName + " webhook triggered");
                    return;
            });
            this.webhookRepository.insertWebhook(webhookRegisterRequest, registered.client_id);
    
            res.status(StatusCodes.CREATED).json({
                message: "Webhook addition successful",
                valid: true,
                data: null
            });
            return;
        }
    }
}
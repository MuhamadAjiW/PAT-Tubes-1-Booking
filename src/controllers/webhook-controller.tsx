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

export class WebhookController{
    webhookRepository: WebhookRepository;
    reservedEndpoints: String[] = ["/test", "/clients", "/events"];
    possibleEvents: String[] = ["test", "payment"];

    constructor(){
        this.webhookRepository = new WebhookRepository();
        this.webhookRepository.cleanWebhook()
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

            const endpoints: String[] = await this.webhookRepository.getWebhookUniqueEndpoints();
            if(!(webhookRegisterRequest.endpoint in endpoints)){
                app.server.post( "/webhook" + webhookRegisterRequest.endpoint,
                    async (req: Request, res: Response) => {
                        if(!req.ip) throw new BadRequestError("Undefined ip address");
                        let client = await this.webhookRepository.getWebhookClientByIp(req.ip);
                        
                        const serverUrl = `${req.protocol}://${req.get('host')}`;
                        const forwardEndpoint = "/webhook/" + client.client_id + webhookRegisterRequest.endpoint;
                        const forwardUrl = serverUrl + forwardEndpoint;
                        const axiosResponse = await axios.post(forwardUrl, req.body, { headers: req.headers });

                        res.status(axiosResponse.status).send(axiosResponse.data);
                        return;
                });
            }
            app.server.post( "/webhook/" + registered.client_id + webhookRegisterRequest.endpoint,
                // TODO: Implement events
                async (req: Request, res: Response) => {
                    res.status(StatusCodes.OK).json({
                        message: webhookRegisterRequest.eventName + " webhook triggered",
                        valid: true,
                        data: null
                    });
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
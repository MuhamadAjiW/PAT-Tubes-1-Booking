import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WebhookRegisterRequest } from '../types/WebhookRegisterRequest';
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from '../middlewares/error-middleware';
import { BadRequestError } from '../types/errors/BadRequestError';
import { App } from '../app';

export class WebhookController{
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

    register(app: App){
        return async (req: Request, res: Response) => {
            let webhookRegisterRequest: WebhookRegisterRequest
            try {
                webhookRegisterRequest = req.body;
            } catch (error) {
                throw new BadRequestError("Bad request parameters");
            }
    
            // TODO: Implement
            app.server.post(webhookRegisterRequest.endpoint,
                async (req: Request, res: Response) => {
                    console.log("Custom webhook triggered!");
            });
    
            res.status(StatusCodes.OK).json({
                message: "Webhook addition successful",
                valid: true,
                data: null
            });
            return;
        }
    }
}
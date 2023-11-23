import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WebhookRegisterRequest } from '../types/WebhookRegisterRequest';
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from './middlewares/error-middleware';
import { BadRequestError } from '../types/errors/BadRequestError';

export class WebhookController{
    async testWebhook(req: Request, res: Response){
        console.log("Test webhook triggered");

        res.status(StatusCodes.OK).json({
            message: "Webhook test successful",
            valid: true,
            data: null
        });
        return;
    }

    async register(req: Request, res: Response){
        let webhookRegisterRequest: WebhookRegisterRequest
        try {
            webhookRegisterRequest = req.body;
        } catch (error) {
            throw new BadRequestError("Bad request parameters");
        }

        // TODO: Implement

        res.status(StatusCodes.OK).json({
            message: "Webhook addition successful",
            valid: true,
            data: null
        });
        return;
    }
}
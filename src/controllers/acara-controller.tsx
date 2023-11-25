import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WebhookRegisterRequest } from '../types/WebhookRegisterRequest';
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from '../middlewares/error-middleware';
import { AcaraRepository } from '../repository/acara-repository';

export class AcaraController {
    private acaraRepository: AcaraRepository;

    constructor() {
        this.acaraRepository = new AcaraRepository();
    }

    getDistinctAcaraId() {
        return async(req: Request, res: Response) => {
            try {
                const data = await this.acaraRepository.getDistinctAcaraId();
                res.status(StatusCodes.OK).json({
                    message: "Fetch successful",
                    valid: true,
                    data: data
                });
            } catch (error) {
                throw new Error("Bad request parameters");
            }
        }
    }
}
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WebhookRegisterRequest } from '../types/WebhookRegisterRequest';
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from '../middlewares/error-middleware';
import { KursiRepository } from '../repository/kursi-repository';

export class KursiController {
    private kursiRepository: KursiRepository;

    constructor() {
        this.kursiRepository = new KursiRepository();
    }

    async getDistinctKursiId(req: Request, res: Response) {
        try {
            const acaraId = Number(req.query.acaraId);
            const data = await this.kursiRepository.getDistinctKursiId(acaraId);
            res.status(StatusCodes.OK).json({
                message: "Fetch successful",
                valid: true,
                data: data
            });
        } catch (error) {
            throw Error("Failed to fetch distinct kursiId");
        }
    }
}
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WebhookRegisterRequest } from '../types/WebhookRegisterRequest';
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from '../middlewares/error-middleware';
import { AcaraRepository } from '../repository/acara-repository';
import { AcaraRequest } from '../types/AcaraRequest';
import { BadRequestError } from '../types/errors/BadRequestError';
import { z } from 'zod';
import { NotFoundError } from '../types/errors/NotFoundError';

export class AcaraController {
    private acaraRepository: AcaraRepository;

    constructor() {
        this.acaraRepository = new AcaraRepository();
    }

    createAcara(){
        return async (req: Request, res: Response) => {
            const acaraBody = AcaraRequest.safeParse(req.body)
            if(!acaraBody.success) throw new BadRequestError(acaraBody.error.message);
            const acaraRequest: AcaraRequest = acaraBody.data;

            const result = await this.acaraRepository.createAcara(acaraRequest);

            res.status(StatusCodes.CREATED).json({
                message: "Acara successfully created",
                valid: true,
                data: result
            })
        }
    }

    getAcaraById(){
        return async (req: Request, res: Response) => {
            const acaraParam = z.number().int().safeParse(req.params.identifier)
            if(!acaraParam.success) throw new BadRequestError(acaraParam.error.message);
            const acara_id: number = acaraParam.data;

            const result = await this.acaraRepository.getAcaraById(acara_id);
            if(!result) throw new NotFoundError("Acara not found");

            res.status(StatusCodes.OK).json({
                message: "Acara successfully fetched",
                valid: true,
                data: result
            })
        }
    }

    updateAcaraById(){
        return async (req: Request, res: Response) => {
            const acaraParam = z.number().int().safeParse(req.params.identifier)
            if(!acaraParam.success) throw new BadRequestError(acaraParam.error.message);
            const acara_id: number = acaraParam.data;

            const acaraBody = AcaraRequest.safeParse(req.body)
            if(!acaraBody.success) throw new BadRequestError(acaraBody.error.message);
            const acaraRequest: AcaraRequest = acaraBody.data;

            const result = await this.acaraRepository.updateAcaraNamaAcara(acara_id, acaraRequest.nama_acara);

            res.status(StatusCodes.OK).json({
                message: "Acara successfully updated",
                valid: true,
                data: result
            })
        }
    }

    deleteAcaraById(){
        return async (req: Request, res: Response) => {
            const acaraParam = z.number().int().safeParse(req.params.identifier)
            if(!acaraParam.success) throw new BadRequestError(acaraParam.error.message);
            const acara_id: number = acaraParam.data;

            const result = await this.acaraRepository.deleteAcaraById(acara_id);
            if(!result) throw new NotFoundError("Acara not found");

            res.status(StatusCodes.OK).json({
                message: "Acara successfully deleted",
                valid: true,
                data: result
            })
        }
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
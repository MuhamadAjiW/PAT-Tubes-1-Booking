import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WebhookRegisterRequest } from '../types/WebhookRegisterRequest';
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from '../middlewares/error-middleware';
import { KursiRepository } from '../repository/kursi-repository';
import { KursiRequest } from '../types/KursiRequest';
import { BadRequestError } from '../types/errors/BadRequestError';
import { ConflictError } from '../types/errors/ConflictError';
import { z } from 'zod';
import { AcaraRepository } from '../repository/acara-repository';
import { NotFoundError } from '../types/errors/NotFoundError';
import { KursiUpdateRequest } from '../types/KursiUpdateRequest';
import { toKursiStatusEnum } from '../types/enums/KursiStatusEnum';

export class KursiController {
    private kursiRepository: KursiRepository;
    private acaraRepository: AcaraRepository;

    constructor() {
        this.kursiRepository = new KursiRepository();
        this.acaraRepository = new AcaraRepository();
    }

    createKursi(){
        return async (req: Request, res: Response) => {
            const acaraParam = z.number().int().safeParse(req.params.acaraId)
            if(!acaraParam.success) throw new BadRequestError(acaraParam.error.message);
            const acara_id: number = acaraParam.data;
            
            const acaraExisting = await this.acaraRepository.getAcaraById(acara_id);
            if(!acaraExisting) throw new NotFoundError("Acara does not exist");

            const kursiBody = KursiRequest.safeParse(req.body)
            if(!kursiBody.success) throw new BadRequestError(kursiBody.error.message);
            const kursiRequest: KursiRequest = kursiBody.data;

            const existing = await this.kursiRepository.getKursiById(acara_id, kursiRequest.kursi_id)
            if(existing) throw new ConflictError("Kursi already existed");

            const result = await this.kursiRepository.createKursi(acara_id, kursiRequest);

            res.status(StatusCodes.CREATED).json({
                message: "Kursi successfully created",
                valid: true,
                data: result
            })
        }
    }

    getKursiById(){
        return async (req: Request, res: Response) => {
            return async (req: Request, res: Response) => {
                const acaraParam = z.number().int().safeParse(req.params.acaraId)
                if(!acaraParam.success) throw new BadRequestError(acaraParam.error.message);
                const acara_id: number = acaraParam.data;
                
                const acaraExisting = await this.acaraRepository.getAcaraById(acara_id);
                if(!acaraExisting) throw new NotFoundError("Acara does not exist");
    
                const kursiBody = KursiRequest.safeParse(req.body)
                if(!kursiBody.success) throw new BadRequestError(kursiBody.error.message);
                const kursiRequest: KursiRequest = kursiBody.data;
    
                const result = await this.kursiRepository.getKursiById(acara_id, kursiRequest.kursi_id)
                if(!result) throw new NotFoundError("Kursi does not exist");
    
                res.status(StatusCodes.OK).json({
                    message: "Kursi successfully fetched",
                    valid: true,
                    data: result
                })
            }
        }
    }

    updateKursiById(){
        return async (req: Request, res: Response) => {
            const acaraParam = z.number().int().safeParse(req.params.acaraId)
            if(!acaraParam.success) throw new BadRequestError(acaraParam.error.message);
            const acara_id: number = acaraParam.data;
            
            const acaraExisting = await this.acaraRepository.getAcaraById(acara_id);
            if(!acaraExisting) throw new NotFoundError("Acara does not exist");

            const kursiBody = KursiUpdateRequest.safeParse(req.body)
            if(!kursiBody.success) throw new BadRequestError(kursiBody.error.message);
            const kursiRequest: KursiUpdateRequest = kursiBody.data;

            const existing = await this.kursiRepository.getKursiById(acara_id, kursiRequest.kursi_id)
            if(!existing) throw new NotFoundError("Kursi does not exist");

            const result = await this.kursiRepository.updateKursiStatus(acara_id, kursiRequest.kursi_id, toKursiStatusEnum(kursiRequest.status))

            res.status(StatusCodes.OK).json({
                message: "Kursi successfully updated",
                valid: true,
                data: result
            })
        }
    }

    deleteKursiById(){
        return async (req: Request, res: Response) => {
            const acaraParam = z.number().int().safeParse(req.params.acaraId)
            if(!acaraParam.success) throw new BadRequestError(acaraParam.error.message);
            const acara_id: number = acaraParam.data;
            
            const acaraExisting = await this.acaraRepository.getAcaraById(acara_id);
            if(!acaraExisting) throw new NotFoundError("Acara does not exist");

            const kursiBody = KursiUpdateRequest.safeParse(req.body)
            if(!kursiBody.success) throw new BadRequestError(kursiBody.error.message);
            const kursiRequest: KursiUpdateRequest = kursiBody.data;

            const existing = await this.kursiRepository.getKursiById(acara_id, kursiRequest.kursi_id)
            if(!existing) throw new NotFoundError("Kursi does not exist");

            const result = await this.kursiRepository.deleteById(acara_id, kursiRequest.kursi_id)

            res.status(StatusCodes.OK).json({
                message: "Kursi successfully deleted",
                valid: true,
                data: result
            })
        }
    }

    getDistinctKursiId() {
        return async (req: Request, res: Response) => {
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
}
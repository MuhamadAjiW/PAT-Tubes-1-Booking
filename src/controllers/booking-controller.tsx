import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../types/errors/BadRequestError';
import { BookingRequest } from '../types/BookingRequest';
import { BookingRepository } from '../repository/booking-repository';
import { FailureSimulator } from '../utils/failure-simulator';
import { PaymentController } from './payment-controller';
import { SERVER_FILE_FOLDER } from '../utils/config';
import { z } from 'zod';
import { SignatureUtil } from '../utils/signature-utils';
import { UnauthorizedError } from '../types/errors/UnauthorizedError';
import { NotFoundError } from '../types/errors/NotFoundError';
import { PDFUtils } from '../utils/pdf-utils';
import { AcaraRepository } from '../repository/acara-repository';
import { AcaraInfo } from '../types/AcaraInfo';

export class BookingController{
    bookingRepository: BookingRepository;
    acaraRepository: AcaraRepository;

    constructor(){
        this.bookingRepository = new BookingRepository();
        this.acaraRepository = new AcaraRepository();
    }

    book(){
        return async (req: Request, res: Response) => {
            let kursiBookRequest: BookingRequest;
            try {
                kursiBookRequest = BookingRequest.parse(req.body);
            } catch (error) {
                throw new BadRequestError("Bad request parameters");
            }

            if(FailureSimulator.simulate()){
                console.log("Simulating failure in ticketing server...")
                const acaraInfo: AcaraInfo = await this.acaraRepository.getAcaraById(kursiBookRequest.acaraId)

                const filename: string = await PDFUtils.generateBookingFailed({
                    email: kursiBookRequest.email,
                    namaAcara: acaraInfo.nama_acara,
                    invoiceNumber: "-",
                    bookingId: 0,
                    kursiId: kursiBookRequest.kursiId,
                    failureReason: "Failure in ticket before sending request to payment server"
                })
                const filePath = SERVER_FILE_FOLDER + filename;

                res.status(StatusCodes.INTERNAL_SERVER_ERROR).sendFile(filePath);
            }
            else{
                // TODO: Validate request
                console.log("Booking request received");
                const data = await this.bookingRepository.insert(kursiBookRequest);

                const paymentData = await PaymentController.requestPayment(kursiBookRequest);

                // TODO: Forward to client

                res.status(StatusCodes.OK).json({
                    message: "Booking ongoing",
                    valid: true,
                    data: paymentData
                });
            }
        }
    }

    getBookingPDF(){
        return async (req: Request, res: Response) => {
            const signatureParam = z.string().safeParse(req.query.signature as string)
            if(!signatureParam.success) throw new BadRequestError(signatureParam.error.message);
            
            let signature = signatureParam.data;
            let filename;
            let valid
            try {
                valid = SignatureUtil.verifySignature(signature)
            } catch (error) {
                throw new UnauthorizedError("Bad signature");
            }
            if(!valid) throw new UnauthorizedError("Signature timed out");
            
            filename = SignatureUtil.getIdentifier(signature);
            if(!filename) throw new NotFoundError("File not found");


            const filePath = SERVER_FILE_FOLDER + filename;

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="booking.pdf"`);

            console.log("Booking pdf sent")
            res.sendFile(filePath);
        }
    }
}
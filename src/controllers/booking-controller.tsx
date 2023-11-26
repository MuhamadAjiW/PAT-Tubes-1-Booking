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

export class BookingController{
    bookingRepository: BookingRepository;

    constructor(){
        this.bookingRepository = new BookingRepository();
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
                // TODO: Send failed pdf


                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Booking unsuccessful",
                    valid: false,
                    data: null
                });
            }
            else{
                // TODO: Validate request
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
            if(!SignatureUtil.verifySignature(signature)) throw new UnauthorizedError("Bad signature");

            const filename = SignatureUtil.getIdentifier(signature);
            if(!filename) throw new NotFoundError("File not found");

            const filePath = SERVER_FILE_FOLDER + filename;

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="booking.pdf"`);

            console.log("Booking pdf sent")
            res.sendFile(filePath);
        }
    }
}
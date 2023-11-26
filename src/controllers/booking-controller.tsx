import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WebhookRegisterRequest } from '../types/WebhookRegisterRequest';
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from '../middlewares/error-middleware';
import { BadRequestError } from '../types/errors/BadRequestError';
import { BookingRequest } from '../types/BookingRequest';
import { BookingRepository } from '../repository/booking-repository';
import { FailureSimulator } from '../utils/failure-simulator';
import { PaymentController } from './payment-controller';

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
                const data = await this.bookingRepository.insert(kursiBookRequest);
                
                // TODO: Forward to payment
                PaymentController.requestPayment(kursiBookRequest);

                res.status(StatusCodes.OK).json({
                    message: "Booking successful",
                    valid: true,
                    data: data
                });
            }
        }
    }
}
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WebhookRegisterRequest } from '../types/WebhookRegisterRequest';
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from '../middlewares/error-middleware';
import { BadRequestError } from '../types/errors/BadRequestError';
import { BookRequest } from '../types/BookRequest';
import { BookingRepository } from '../repository/booking-repository';

export class BookingController{
    bookingRepository: BookingRepository;

    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    book(){
        return async (req: Request, res: Response) => {   
            let kursiBookRequest: BookRequest
            try {
                kursiBookRequest = req.body;
            } catch (error) {
                throw new BadRequestError("Bad request parameters");
            }
    
            // TODO: Implement properly
            const data = await this.bookingRepository.insert(kursiBookRequest);
    
            res.status(StatusCodes.OK).json({
                message: "Booking successful",
                valid: true,
                data: data
            });
            return;
        }
    }
}
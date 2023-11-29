import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../types/errors/BadRequestError';
import { BookingRequest } from '../types/BookingRequest';
import { BookingRepository } from '../repository/booking-repository';
import { FailureSimulator } from '../utils/failure-simulator';
import { PaymentController } from './payment-controller';
import { PAYMENT_SERVER_PUBLIC_URL, SERVER_FILE_FOLDER } from '../utils/config';
import { z } from 'zod';
import { SignatureUtil } from '../utils/signature-utils';
import { UnauthorizedError } from '../types/errors/UnauthorizedError';
import { NotFoundError } from '../types/errors/NotFoundError';
import { PDFUtils } from '../utils/pdf-utils';
import { AcaraRepository } from '../repository/acara-repository';
import { AcaraInfo } from '../types/AcaraInfo';
import { BookingQuery } from '../types/BookingQuery';
import { ConflictError } from '../types/errors/ConflictError';
import { InvoiceRequest } from '../types/InvoiceRequest';

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
                const signature = SignatureUtil.generateSignature(filename, SignatureUtil.PDFExpiry);

                res.status(StatusCodes.OK).json({
                    message: "Server encountered an error",
                    valid: false,
                    data: {
                        signature: signature,
                        invoiceNumber: "-",
                        bookingId: 0,
                        failureReason: "Failure in ticket before sending request to payment server"
                    }
                });
            }
            else{
                const existing = await this.bookingRepository.getStatusByAcaraIdAndKursiId(kursiBookRequest.acaraId, kursiBookRequest.kursiId);
                if(existing) throw new ConflictError("Ticket has already been booked");

                console.log("Booking request received");
                const data = await this.bookingRepository.insert(kursiBookRequest);
                const invoiceRequest: InvoiceRequest = ({
                    email: kursiBookRequest.email,
                    acaraId: kursiBookRequest.acaraId,
                    kursiId: kursiBookRequest.kursiId,
                    userId: kursiBookRequest.kursiId,
                    bookingId: data.bookingId
                })

                // TODO: Test
                const paymentData = await PaymentController.requestPayment(invoiceRequest);
                paymentData.data.url = PAYMENT_SERVER_PUBLIC_URL + paymentData.data.url

                res.status(StatusCodes.OK).json({
                    message: "Booking ongoing",
                    valid: true,
                    data: paymentData
                }).send();
            }
        }
    }

    getBookingStatusByBookingId(){
        return async (req: Request, res: Response) => {
            const queryId = z.number().int().safeParse(req.params.identifier)
            if(!queryId.success) throw new BadRequestError(queryId.error.message);
            const bookingId: number = queryId.data;

            const result = await this.bookingRepository.getStatusById(bookingId);
            if(!result) throw new NotFoundError("Booking request not found");

            res.status(StatusCodes.OK).json({
                message: "Booking request status successfully fetched",
                valid: true,
                data: result.status
            }).send();
        }
    }


    getBookingStatusByAcaraIdAndKursiId(){
        return async (req: Request, res: Response) => {
            const queryParam = BookingQuery.safeParse(req.query)
            if(!queryParam.success) throw new BadRequestError(queryParam.error.message);
            const bookingQuery: BookingQuery = queryParam.data;

            const result = await this.bookingRepository.getStatusByAcaraIdAndKursiId(bookingQuery.acaraId, bookingQuery.kursiId);
            if(!result) throw new NotFoundError("Booking request not found");

            res.status(StatusCodes.OK).json({
                message: "Booking request status successfully fetched",
                valid: true,
                data: result.status
            }).send();
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
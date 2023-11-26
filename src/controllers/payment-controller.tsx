import { json } from "stream/consumers";
import { RabbitMQConnectionFactory } from "../types/others/RabbitMQConnectionFactory";
import { PAYMENT_SERVER_URL, SERVER_API_KEY, SERVER_FILE_FOLDER } from "../utils/config";
import { BadRequestError } from "../types/errors/BadRequestError";
import { BookingRequest } from "../types/BookingRequest";
import axios from "axios";
import { StandardResponse } from "../types/StandardResponse";
import { Invoice } from "../types/Invoice";
import { PaymentStatusEnum } from "../types/enums/PaymentStatusEnum";
import { AcaraRepository } from '../repository/acara-repository';
import { AcaraInfo } from "../types/AcaraInfo";
import { PDFUtils } from "../utils/pdf-utils";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

export class PaymentController {
    // TODO: Test
    public static async onPaymentEvent(req: Request, res: Response) {
        console.log("Payment event triggered")
        console.log(req.body)
        
        const responseBody = StandardResponse.safeParse(req.body);
        if(!responseBody.success) throw new BadRequestError("Invalid webhook argument");
        const response: StandardResponse = responseBody.data;
        
        const invoiceData = Invoice.safeParse(response.data);
        if(!invoiceData.success) throw new BadRequestError("Invalid invoice data");
        const invoice: Invoice = invoiceData.data;
        
        
        const acaraRepository: AcaraRepository = new AcaraRepository();
        if(invoice.status == PaymentStatusEnum.FAILED){
            console.log("Simulating failure in payment server...")
            const acaraInfo: AcaraInfo = await acaraRepository.getAcaraById(invoice.request.acaraId);
            
            const filename: string = await PDFUtils.generateBookingFailed({
                email: invoice.request.email,
                namaAcara: acaraInfo.nama_acara,
                invoiceNumber: invoice.invoiceNumber,
                bookingId: invoice.request.bookingId,
                kursiId: invoice.request.kursiId,
                failureReason: "Failure in payment server"
            })
            const filePath = SERVER_FILE_FOLDER + filename;
            
            // TODO: Forward invoice and payment url to client
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).sendFile(filePath);
        }
        else{
            console.log("Generating accepted PDF...")
            const acaraInfo: AcaraInfo = await acaraRepository.getAcaraById(invoice.request.acaraId);

            const filename: string = await PDFUtils.generateBookingSuccess({
                email: invoice.request.email,
                namaAcara: acaraInfo.nama_acara,
                invoiceNumber: invoice.invoiceNumber,
                bookingId: invoice.request.bookingId,
                kursiId: invoice.request.kursiId,
            })
            const filePath = SERVER_FILE_FOLDER + filename;
            
            // TODO: Forward invoice and payment url to client
            res.status(StatusCodes.OK).sendFile(filePath);
        }
    }

    public static async requestPayment(data: BookingRequest){
        console.log("Forwarding booking request to payment")
        const serverUrl = PAYMENT_SERVER_URL + "/api/payments";


        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SERVER_API_KEY}`
        }
        const axiosResponse = await axios.post(serverUrl, data, { headers: headers });
        console.log(axiosResponse.data);

        let response: StandardResponse;
        try {
            response = axiosResponse.data;
        } catch (error) {
            console.log("Response is not standard");
            response = {
                message: "Response is not standard",
                valid: false,
                data: axiosResponse.data
            };
        }

        return response;
    }
}
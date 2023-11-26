import { json } from "stream/consumers";
import { RabbitMQConnectionFactory } from "../types/others/RabbitMQConnectionFactory";
import { PAYMENT_SERVER_URL } from "../utils/config";
import { BadRequestError } from "../types/errors/BadRequestError";
import { BookingRequest } from "../types/BookingRequest";

export class PaymentController {
    // TODO: Forward invoice and payment url to client
    public static async onPaymentEvent(req: Request, res: Response) {
        console.log("Payment event triggered")
        console.log(req.body)
    }

    public static async requestPayment(data: BookingRequest){
        console.log("Forwarding booking request to payment")
        await RabbitMQConnectionFactory.publish(JSON.stringify(data), 'payment-exchange', 'incoming-invoice-queue')
    }
}
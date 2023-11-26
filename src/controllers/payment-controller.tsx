import { json } from "stream/consumers";
import { RabbitMQConnectionFactory } from "../types/others/RabbitMQConnectionFactory";
import { PAYMENT_SERVER_URL, SERVER_API_KEY } from "../utils/config";
import { BadRequestError } from "../types/errors/BadRequestError";
import { BookingRequest } from "../types/BookingRequest";
import axios from "axios";

export class PaymentController {
    // TODO: Forward invoice and payment url to client
    public static async onPaymentEvent(req: Request, res: Response) {
        console.log("Payment event triggered")
        console.log(req.body)
    }

    public static async requestPayment(data: BookingRequest){
        console.log("Forwarding booking request to payment")
        const serverUrl = PAYMENT_SERVER_URL + "/api/payments";


        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SERVER_API_KEY}`
        }
        const axiosResponse = await axios.post(serverUrl, data, { headers: headers });
        console.log(axiosResponse.data)

        // TODO: Forward to client
    }
}
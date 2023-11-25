import { RabbitMQConnectionFactory } from "../types/others/RabbitMQConnectionFactory";

export class PaymentController {
    // TODO: Forward invoice and payment url to client
    public static async onPaymentEvent(req: Request, res: Response) {
        console.log("Payment Event Triggered")
    }
}
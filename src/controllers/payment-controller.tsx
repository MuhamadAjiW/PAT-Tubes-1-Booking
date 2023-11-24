import { RabbitMQConnectionFactory } from "../types/others/RabbitMQConnectionFactory";

import { QueueListener } from "../types/interfaces/RabbitMQ";
import { RabbitMQConnection } from '../utils/connection';

export class PaymentController implements QueueListener {
    exchangeName: String = "payment-exchange";
    queueName: String = "outgoing-invoice-queue";
    
    async listen(): Promise<void> {
        try {
            const channel = await RabbitMQConnection.createChannel()

            await channel.assertExchange(this.exchangeName, 'direct', { durable: true });
            await channel.assertQueue(this.queueName, { durable: true });
            await channel.bindQueue(this.queueName, this.exchangeName, '/');


            channel.consume(this.queueName, (message: any) =>{
                if(message !== null){
                    console.log("message recceived");
                    console.log(message.content.toString());
                    channel.ack(message);
                }
            });

        } catch (error) {
            console.log('Failed listening for payments');
        }
    }

    async publish(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

export class PaymentController {
    initialize(){
        RabbitMQConnectionFactory.addListener(
            "payment-exchange",
            "outgoing-invoice-queue",
            this.testFunction
        )
    }

    testFunction(message: any){
        console.log("Message received for test1");
        console.log(message.content.toString());
    }
}
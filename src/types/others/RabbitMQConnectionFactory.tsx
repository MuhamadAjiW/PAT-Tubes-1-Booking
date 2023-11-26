import { QueuePublisher, QueueListener } from "../interfaces/RabbitMQ";
import { RabbitMQConnection } from "../../utils/connection";

export class RabbitMQConnectionFactory{
    static listeners: Array<QueuePublisher>;
    static publishers: Array<QueuePublisher>;

    static async addListener(
        exchangeName: String,
        queueName: String,
        handler: CallableFunction,
        exchangeType: String = "direct",
        exchangeProperty = { durable: true },
        queueProperty = { durable: true },
        route: String = '/',
        ){
        try{
            const channel = await RabbitMQConnection.createChannel();

            await channel.assertExchange(exchangeName, exchangeType, exchangeProperty);
            await channel.assertQueue(queueName, queueProperty);
            await channel.bindQueue(queueName, exchangeName, route);

            channel.consume(queueName, (message: any) => {
                if(message !== null){
                    handler(message);
                    channel.ack(message);
                }
            });

        } catch (error){
            console.error(error);
            console.log("Error adding listeners");
        }
    }

    static async publish(
        message: any,
        exchangeName: String,
        queue: String = '/',
        ){
        try{
            const channel = await RabbitMQConnection.createChannel();
            channel.publish(exchangeName, queue, Buffer.from(message));
        } catch (error){
            console.error(error);
            console.log("Error publishing message");
        }
    }

    static async publishAssert(
        message: any,
        exchangeName: String,
        queueName: String,
        handler: CallableFunction,
        exchangeType: String = "direct",
        exchangeProperty = { durable: true },
        queueProperty = { durable: true },
        route: String = '/',
        ){
        try{
            const channel = await RabbitMQConnection.createChannel();

            await channel.assertExchange(exchangeName, exchangeType, exchangeProperty);
            await channel.assertQueue(queueName, queueProperty);
            await channel.bindQueue(queueName, exchangeName, route);

            channel.publish(exchangeName, queueName, message);
        } catch (error){
            console.error(error);
            console.log("Error publishing message");
        }
    }
}
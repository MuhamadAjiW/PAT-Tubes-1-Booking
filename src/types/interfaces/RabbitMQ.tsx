export interface QueueListener {
    queueName: String;
    exchangeName: String;
    listen(): Promise<void>;
}
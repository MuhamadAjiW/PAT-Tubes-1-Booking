export interface QueueHandler {
    queueName: String;
    exchangeName: String;
    listen(): Promise<void>;
    publish(): Promise<void>;
}
export interface QueueListener {
    queueName: String;
    exchangeName: String;
    listen(): Promise<void>;
}

export interface QueuePublisher {
    queueName: String;
    exchangeName: String;
    publish(): Promise<void>;
}
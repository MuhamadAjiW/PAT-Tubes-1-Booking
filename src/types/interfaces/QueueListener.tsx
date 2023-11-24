export interface QueueListener {
    queueName: String;
    exchangeName: String;
    startListening(): Promise<void>;
}
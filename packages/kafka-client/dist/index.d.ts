import { Producer, Consumer, EachMessagePayload } from 'kafkajs';
export declare class KafkaClient {
    private kafka;
    private producer;
    private consumers;
    constructor(brokers: string[]);
    getProducer(): Promise<Producer>;
    createConsumer(groupId: string): Promise<Consumer>;
    publishEvent(topic: string, message: any): Promise<void>;
    subscribe(groupId: string, topics: string[], handler: (payload: EachMessagePayload) => Promise<void>): Promise<void>;
    disconnect(): Promise<void>;
}
export declare function createKafkaClient(brokers?: string): KafkaClient;

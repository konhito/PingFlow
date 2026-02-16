import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';
import { createServiceLogger } from '@pingflow/logger';
import { KafkaTopics } from '@pingflow/shared-types';

const logger = createServiceLogger('kafka-client');

export class KafkaClient {
    private kafka: Kafka;
    private producer: Producer | null = null;
    private consumers: Map<string, Consumer> = new Map();

    constructor(brokers: string[]) {
        this.kafka = new Kafka({
            clientId: 'pingflow',
            brokers,
            retry: {
                retries: 5,
                initialRetryTime: 300,
                multiplier: 2,
            },
        });
    }

    async getProducer(): Promise<Producer> {
        if (!this.producer) {
            this.producer = this.kafka.producer();
            await this.producer.connect();
            logger.info('Kafka producer connected');
        }
        return this.producer;
    }

    async createConsumer(groupId: string): Promise<Consumer> {
        if (this.consumers.has(groupId)) {
            return this.consumers.get(groupId)!;
        }

        const consumer = this.kafka.consumer({ groupId });
        await consumer.connect();
        this.consumers.set(groupId, consumer);
        logger.info({ groupId }, 'Kafka consumer connected');
        return consumer;
    }

    async publishEvent(topic: string, message: any): Promise<void> {
        const producer = await this.getProducer();

        try {
            await producer.send({
                topic,
                messages: [
                    {
                        value: JSON.stringify(message),
                        timestamp: Date.now().toString(),
                    },
                ],
            });
            logger.info({ topic, messageId: message.eventId }, 'Event published to Kafka');
        } catch (error) {
            logger.error({ topic, error }, 'Failed to publish event to Kafka');
            throw error;
        }
    }

    async subscribe(
        groupId: string,
        topics: string[],
        handler: (payload: EachMessagePayload) => Promise<void>
    ): Promise<void> {
        const consumer = await this.createConsumer(groupId);

        await consumer.subscribe({ topics, fromBeginning: false });

        await consumer.run({
            eachMessage: async (payload) => {
                try {
                    logger.info(
                        { topic: payload.topic, partition: payload.partition },
                        'Processing message'
                    );
                    await handler(payload);
                } catch (error) {
                    logger.error({ error, topic: payload.topic }, 'Error processing message');
                    // Publish to DLQ
                    await this.publishEvent(KafkaTopics.EVENTS_FAILED, {
                        originalTopic: payload.topic,
                        message: payload.message.value?.toString(),
                        error: error instanceof Error ? error.message : 'Unknown error',
                        timestamp: new Date().toISOString(),
                    });
                }
            },
        });
    }

    async disconnect(): Promise<void> {
        if (this.producer) {
            await this.producer.disconnect();
            logger.info('Kafka producer disconnected');
        }

        for (const [groupId, consumer] of this.consumers.entries()) {
            await consumer.disconnect();
            logger.info({ groupId }, 'Kafka consumer disconnected');
        }
    }
}

export function createKafkaClient(brokers?: string): KafkaClient {
    const brokerList = (brokers || process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
    return new KafkaClient(brokerList);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaClient = void 0;
exports.createKafkaClient = createKafkaClient;
const kafkajs_1 = require("kafkajs");
const logger_1 = require("@pingflow/logger");
const shared_types_1 = require("@pingflow/shared-types");
const logger = (0, logger_1.createServiceLogger)('kafka-client');
class KafkaClient {
    constructor(brokers) {
        this.producer = null;
        this.consumers = new Map();
        this.kafka = new kafkajs_1.Kafka({
            clientId: 'pingflow',
            brokers,
            retry: {
                retries: 5,
                initialRetryTime: 300,
                multiplier: 2,
            },
        });
    }
    async getProducer() {
        if (!this.producer) {
            this.producer = this.kafka.producer();
            await this.producer.connect();
            logger.info('Kafka producer connected');
        }
        return this.producer;
    }
    async createConsumer(groupId) {
        if (this.consumers.has(groupId)) {
            return this.consumers.get(groupId);
        }
        const consumer = this.kafka.consumer({ groupId });
        await consumer.connect();
        this.consumers.set(groupId, consumer);
        logger.info({ groupId }, 'Kafka consumer connected');
        return consumer;
    }
    async publishEvent(topic, message) {
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
        }
        catch (error) {
            logger.error({ topic, error }, 'Failed to publish event to Kafka');
            throw error;
        }
    }
    async subscribe(groupId, topics, handler) {
        const consumer = await this.createConsumer(groupId);
        await consumer.subscribe({ topics, fromBeginning: false });
        await consumer.run({
            eachMessage: async (payload) => {
                try {
                    logger.info({ topic: payload.topic, partition: payload.partition }, 'Processing message');
                    await handler(payload);
                }
                catch (error) {
                    logger.error({ error, topic: payload.topic }, 'Error processing message');
                    // Publish to DLQ
                    await this.publishEvent(shared_types_1.KafkaTopics.EVENTS_FAILED, {
                        originalTopic: payload.topic,
                        message: payload.message.value?.toString(),
                        error: error instanceof Error ? error.message : 'Unknown error',
                        timestamp: new Date().toISOString(),
                    });
                }
            },
        });
    }
    async disconnect() {
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
exports.KafkaClient = KafkaClient;
function createKafkaClient(brokers) {
    const brokerList = (brokers || process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
    return new KafkaClient(brokerList);
}

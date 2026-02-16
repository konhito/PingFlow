import { createKafkaClient } from '@pingflow/kafka-client';
import { createServiceLogger } from '@pingflow/logger';
import { KafkaTopics, NotificationPayload, DeliveryStatus } from '@pingflow/shared-types';
import axios from 'axios';
import Queue from 'bull';

const logger = createServiceLogger('whatsapp-service');
const kafka = createKafkaClient();

// Bull queue for retry logic
const whatsappQueue = new Queue('whatsapp-notifications', process.env.REDIS_URL || 'redis://localhost:6379');

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || 'http://localhost:3001';

async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
    try {
        const response = await axios.post(
            `${WHATSAPP_API_URL}/send`,
            {
                recipient: phoneNumber,
                message,
            },
            {
                timeout: 10000,
            }
        );

        logger.info({ phoneNumber }, 'WhatsApp message sent successfully');
        return response.data;
    } catch (error) {
        logger.error({ error, phoneNumber }, 'Failed to send WhatsApp message');
        throw error;
    }
}

function formatWhatsAppMessage(payload: NotificationPayload): string {
    const { event } = payload;

    let message = `${event.category.emoji} *${event.category.name}*\n\n`;

    for (const [key, value] of Object.entries(event.fields)) {
        message += `*${key}:* ${value}\n`;
    }

    if (event.description) {
        message += `\n${event.description}`;
    }

    return message;
}

async function publishStatus(eventId: string, status: DeliveryStatus['status'], error?: string): Promise<void> {
    const statusUpdate: DeliveryStatus = {
        eventId,
        channel: 'whatsapp',
        status,
        error,
        timestamp: new Date().toISOString(),
    };

    await kafka.publishEvent(KafkaTopics.NOTIFICATIONS_STATUS, statusUpdate);
}

// Process queue jobs
whatsappQueue.process(async (job) => {
    const payload: NotificationPayload = job.data;
    const { event, user } = payload;

    logger.info({ eventId: event.eventId }, 'Processing WhatsApp notification');

    try {
        const message = formatWhatsAppMessage(payload);
        await sendWhatsAppMessage(user.whatsappPhoneNumber!, message);

        await publishStatus(event.eventId, 'sent');

        logger.info({ eventId: event.eventId }, 'WhatsApp notification sent');
    } catch (error) {
        await publishStatus(event.eventId, 'failed', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
});

// Handle failed jobs
whatsappQueue.on('failed', (job, error) => {
    logger.error({ jobId: job.id, error }, 'WhatsApp job failed');
});

async function startWhatsAppService() {
    logger.info('WhatsApp service starting...');
    logger.info({ apiUrl: WHATSAPP_API_URL }, 'WhatsApp API URL configured');

    await kafka.subscribe(
        'whatsapp-service-group',
        [KafkaTopics.NOTIFICATIONS_WHATSAPP],
        async ({ message }) => {
            const payload: NotificationPayload = JSON.parse(message.value!.toString());

            // Add to queue with retry logic
            await whatsappQueue.add(payload, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            });
        }
    );

    logger.info('WhatsApp service ready');
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await whatsappQueue.close();
    await kafka.disconnect();
    process.exit(0);
});

startWhatsAppService().catch((error) => {
    logger.error({ error }, 'Fatal error in WhatsApp service');
    process.exit(1);
});

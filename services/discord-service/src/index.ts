import { createKafkaClient } from '@pingflow/kafka-client';
import { createServiceLogger } from '@pingflow/logger';
import { KafkaTopics, NotificationPayload, DeliveryStatus } from '@pingflow/shared-types';
import axios from 'axios';
import Queue from 'bull';

const logger = createServiceLogger('discord-service');
const kafka = createKafkaClient();

// Bull queue for retry logic
const discordQueue = new Queue('discord-notifications', process.env.REDIS_URL || 'redis://localhost:6379');

interface DiscordEmbed {
    title: string;
    color: number;
    fields: Array<{ name: string; value: string; inline: boolean }>;
    timestamp: string;
}

async function sendDiscordWebhook(webhookUrl: string, embed: DiscordEmbed): Promise<void> {
    try {
        await axios.post(webhookUrl, {
            embeds: [embed],
        });
        logger.info({ webhookUrl: webhookUrl.substring(0, 50) }, 'Discord webhook sent successfully');
    } catch (error) {
        logger.error({ error }, 'Failed to send Discord webhook');
        throw error;
    }
}

function formatDiscordEmbed(payload: NotificationPayload): DiscordEmbed {
    const { event } = payload;

    return {
        title: `${event.category.emoji} ${event.category.name}`,
        color: parseInt(event.category.color.replace('#', ''), 16),
        fields: Object.entries(event.fields).map(([key, value]) => ({
            name: key,
            value: String(value),
            inline: true,
        })),
        timestamp: event.timestamp,
    };
}

async function publishStatus(eventId: string, status: DeliveryStatus['status'], error?: string): Promise<void> {
    const statusUpdate: DeliveryStatus = {
        eventId,
        channel: 'discord',
        status,
        error,
        timestamp: new Date().toISOString(),
    };

    await kafka.publishEvent(KafkaTopics.NOTIFICATIONS_STATUS, statusUpdate);
}

// Process queue jobs
discordQueue.process(async (job) => {
    const payload: NotificationPayload = job.data;
    const { event, user } = payload;

    logger.info({ eventId: event.eventId }, 'Processing Discord notification');

    try {
        const embed = formatDiscordEmbed(payload);
        await sendDiscordWebhook(user.discordWebhookUrl!, embed);

        await publishStatus(event.eventId, 'sent');

        logger.info({ eventId: event.eventId }, 'Discord notification sent');
    } catch (error) {
        await publishStatus(event.eventId, 'failed', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
});

// Handle failed jobs
discordQueue.on('failed', (job, error) => {
    logger.error({ jobId: job.id, error }, 'Discord job failed');
});

async function startDiscordService() {
    logger.info('Discord service starting...');

    await kafka.subscribe(
        'discord-service-group',
        [KafkaTopics.NOTIFICATIONS_DISCORD],
        async ({ message }) => {
            const payload: NotificationPayload = JSON.parse(message.value!.toString());

            // Add to queue with retry logic
            await discordQueue.add(payload, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            });
        }
    );

    logger.info('Discord service ready');
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await discordQueue.close();
    await kafka.disconnect();
    process.exit(0);
});

startDiscordService().catch((error) => {
    logger.error({ error }, 'Fatal error in Discord service');
    process.exit(1);
});

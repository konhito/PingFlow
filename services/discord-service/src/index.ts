import { createKafkaClient } from '@pingflow/kafka-client';
import { createServiceLogger } from '@pingflow/logger';
import { KafkaTopics, NotificationPayload, DeliveryStatus } from '@pingflow/shared-types';
import { REST } from '@discordjs/rest';
import { Routes, APIEmbed } from 'discord-api-types/v10';
import Queue from 'bull';

const logger = createServiceLogger('discord-service');
const kafka = createKafkaClient();

// Bull queue for retry logic
const discordQueue = new Queue('discord-notifications', process.env.REDIS_URL || 'redis://localhost:6379');

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!DISCORD_BOT_TOKEN) {
    logger.error('DISCORD_BOT_TOKEN environment variable is required');
    process.exit(1);
}

// Initialize Discord REST client
const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

async function createDM(userId: string): Promise<{ id: string }> {
    return rest.post(Routes.userChannels(), {
        body: { recipient_id: userId }
    }) as Promise<{ id: string }>;
}

async function sendEmbed(channelId: string, embed: APIEmbed): Promise<void> {
    await rest.post(Routes.channelMessages(channelId), {
        body: { embeds: [embed] },
    });
}

function formatDiscordEmbed(payload: NotificationPayload): APIEmbed {
    const { event } = payload;

    return {
        title: `${event.category.emoji} ${event.category.name}`,
        description: event.description,
        color: event.category.color,
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
        // Create DM channel with user
        const dmChannel = await createDM(user.discordId!);
        
        // Send embed to DM
        const embed = formatDiscordEmbed(payload);
        await sendEmbed(dmChannel.id, embed);

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

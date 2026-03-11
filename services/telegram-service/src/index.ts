import { createKafkaClient } from '@pingflow/kafka-client';
import { createServiceLogger } from '@pingflow/logger';
import { KafkaTopics, NotificationPayload, DeliveryStatus } from '@pingflow/shared-types';
import { Telegraf } from 'telegraf';
import Queue from 'bull';

const logger = createServiceLogger('telegram-service');
const kafka = createKafkaClient();

// Bull queue for retry logic
const telegramQueue = new Queue('telegram-notifications', process.env.REDIS_URL || 'redis://localhost:6379');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
    logger.error('TELEGRAM_BOT_TOKEN environment variable is required');
    process.exit(1);
}

// Initialize Telegram bot
const bot = new Telegraf(BOT_TOKEN);

// Handle /start command to get chat ID
bot.start((ctx) => {
    const chatId = ctx.chat.id;
    logger.info({ chatId }, 'User started bot');
    ctx.reply(
        `✅ *Welcome to PingFlow!*\n\n` +
        `Your Telegram Chat ID is: \`${chatId}\`\n\n` +
        `Add this Chat ID to your PingFlow dashboard to start receiving notifications!`,
        { parse_mode: 'Markdown' }
    );
});

// Launch bot
bot.launch().then(() => {
    logger.info('Telegram bot launched successfully');
});

function formatTelegramMessage(payload: NotificationPayload): string {
    const { event } = payload;

    let message = `${event.category.emoji} *${event.category.name}*\n\n`;

    for (const [key, value] of Object.entries(event.fields)) {
        message += `*${key}:* ${value}\n`;
    }

    if (event.description) {
        message += `\n_${event.description}_`;
    }

    return message;
}

async function publishStatus(eventId: string, status: DeliveryStatus['status'], error?: string): Promise<void> {
    const statusUpdate: DeliveryStatus = {
        eventId,
        channel: 'telegram',
        status,
        error,
        timestamp: new Date().toISOString(),
    };

    await kafka.publishEvent(KafkaTopics.NOTIFICATIONS_STATUS, statusUpdate);
}

// Process queue jobs
telegramQueue.process(async (job) => {
    const payload: NotificationPayload = job.data;
    const { event, user } = payload;

    logger.info({ eventId: event.eventId }, 'Processing Telegram notification');

    try {
        const message = formatTelegramMessage(payload);

        await bot.telegram.sendMessage(user.telegramId!, message, {
            parse_mode: 'Markdown',
        });

        await publishStatus(event.eventId, 'sent');

        logger.info({ eventId: event.eventId }, 'Telegram notification sent');
    } catch (error) {
        await publishStatus(event.eventId, 'failed', error instanceof Error ? error.message : 'Unknown error');
        throw error;
    }
});

// Handle failed jobs
telegramQueue.on('failed', (job, error) => {
    logger.error({ jobId: job.id, error }, 'Telegram job failed');
});

async function startTelegramService() {
    logger.info('Telegram service starting...');

    await kafka.subscribe(
        'telegram-service-group',
        [KafkaTopics.NOTIFICATIONS_TELEGRAM],
        async ({ message }) => {
            const payload: NotificationPayload = JSON.parse(message.value!.toString());

            // Add to queue with retry logic
            await telegramQueue.add(payload, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            });
        }
    );

    logger.info('Telegram service ready');
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    bot.stop('SIGTERM');
    await telegramQueue.close();
    await kafka.disconnect();
    process.exit(0);
});

startTelegramService().catch((error) => {
    logger.error({ error }, 'Fatal error in Telegram service');
    process.exit(1);
});

import { createKafkaClient } from '@pingflow/kafka-client';
import { createServiceLogger } from '@pingflow/logger';
import { KafkaTopics, KafkaEvent, NotificationPayload } from '@pingflow/shared-types';
import { PrismaClient } from '@prisma/client';

const logger = createServiceLogger('event-producer');
const kafka = createKafkaClient();
const prisma = new PrismaClient();

async function processIncomingEvents() {
    logger.info('Event Producer service starting...');

    await kafka.subscribe(
        'event-producer-group',
        [KafkaTopics.EVENTS_INCOMING],
        async ({ message }) => {
            const event: KafkaEvent = JSON.parse(message.value!.toString());

            logger.info({ eventId: event.eventId }, 'Processing incoming event');

            try {
                // Store event in database
                await prisma.event.create({
                    data: {
                        id: event.eventId,
                        userId: event.userId,
                        categoryId: event.category.id,
                        fields: event.fields,
                        description: event.description,
                        createdAt: new Date(event.timestamp),
                    },
                });

                logger.info({ eventId: event.eventId }, 'Event stored in database');

                // Get user details
                const user = await prisma.user.findUnique({
                    where: { id: event.userId },
                });

                if (!user) {
                    logger.error({ userId: event.userId }, 'User not found');
                    return;
                }

                const payload: NotificationPayload = { event, user };

                // Route to appropriate notification services
                const promises: Promise<void>[] = [];

                if (user.discordWebhookUrl) {
                    promises.push(
                        kafka.publishEvent(KafkaTopics.NOTIFICATIONS_DISCORD, payload)
                    );
                }

                if (user.whatsappPhoneNumber) {
                    promises.push(
                        kafka.publishEvent(KafkaTopics.NOTIFICATIONS_WHATSAPP, payload)
                    );
                }

                if (user.telegramChatId) {
                    promises.push(
                        kafka.publishEvent(KafkaTopics.NOTIFICATIONS_TELEGRAM, payload)
                    );
                }

                await Promise.all(promises);

                // Publish to processed topic
                await kafka.publishEvent(KafkaTopics.EVENTS_PROCESSED, event);

                logger.info(
                    { eventId: event.eventId, channels: promises.length },
                    'Event routed to notification services'
                );
            } catch (error) {
                logger.error({ error, eventId: event.eventId }, 'Error processing event');
                throw error;
            }
        }
    );

    logger.info('Event Producer service ready');
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await kafka.disconnect();
    await prisma.$disconnect();
    process.exit(0);
});

processIncomingEvents().catch((error) => {
    logger.error({ error }, 'Fatal error in Event Producer');
    process.exit(1);
});

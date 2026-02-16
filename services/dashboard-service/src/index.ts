import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createKafkaClient } from '@pingflow/kafka-client';
import { createServiceLogger } from '@pingflow/logger';
import { KafkaTopics, KafkaEvent, DeliveryStatus } from '@pingflow/shared-types';
import { createClient } from 'redis';

const logger = createServiceLogger('dashboard-service');
const kafka = createKafkaClient();

const PORT = process.env.PORT || 3002;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Initialize Express and Socket.IO
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// Initialize Redis client
const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => logger.error({ err }, 'Redis Client Error'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'dashboard-service' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId as string;

    logger.info({ socketId: socket.id, userId }, 'Client connected');

    // Join user-specific room
    if (userId) {
        socket.join(`user:${userId}`);
        logger.info({ userId }, 'User joined room');
    }

    socket.on('disconnect', () => {
        logger.info({ socketId: socket.id, userId }, 'Client disconnected');
    });
});

// Broadcast event to user's dashboard
function broadcastEvent(userId: string, event: KafkaEvent) {
    io.to(`user:${userId}`).emit('new-event', event);
    logger.info({ userId, eventId: event.eventId }, 'Event broadcasted to dashboard');
}

// Broadcast delivery status to user's dashboard
function broadcastStatus(userId: string, status: DeliveryStatus) {
    io.to(`user:${userId}`).emit('delivery-status', status);
    logger.info({ userId, eventId: status.eventId, channel: status.channel }, 'Status broadcasted to dashboard');
}

async function startDashboardService() {
    logger.info('Dashboard service starting...');

    // Connect to Redis
    await redisClient.connect();
    logger.info('Redis connected');

    // Subscribe to incoming events
    await kafka.subscribe(
        'dashboard-service-group',
        [KafkaTopics.EVENTS_INCOMING, KafkaTopics.NOTIFICATIONS_STATUS],
        async ({ topic, message }) => {
            if (topic === KafkaTopics.EVENTS_INCOMING) {
                const event: KafkaEvent = JSON.parse(message.value!.toString());

                // Cache event in Redis
                await redisClient.setEx(
                    `event:${event.eventId}`,
                    3600, // 1 hour TTL
                    JSON.stringify(event)
                );

                // Broadcast to user's dashboard
                broadcastEvent(event.userId, event);
            } else if (topic === KafkaTopics.NOTIFICATIONS_STATUS) {
                const status: DeliveryStatus = JSON.parse(message.value!.toString());

                // Get event from Redis to find userId
                const eventData = await redisClient.get(`event:${status.eventId}`);
                if (eventData) {
                    const event: KafkaEvent = JSON.parse(eventData);
                    broadcastStatus(event.userId, status);
                }
            }
        }
    );

    // Start HTTP server
    httpServer.listen(PORT, () => {
        logger.info({ port: PORT }, 'Dashboard service ready');
    });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    io.close();
    await redisClient.quit();
    await kafka.disconnect();
    process.exit(0);
});

startDashboardService().catch((error) => {
    logger.error({ error }, 'Fatal error in Dashboard service');
    process.exit(1);
});

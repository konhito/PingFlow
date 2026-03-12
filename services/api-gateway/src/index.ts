import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { createKafkaClient } from '@pingflow/kafka-client';
import { createServiceLogger } from '@pingflow/logger';
import { KafkaTopics } from '@pingflow/shared-types';
import { z } from 'zod';

// ── Setup ────────────────────────────────────────────────────────────────────
const log = createServiceLogger('api-gateway');
const kafka = createKafkaClient();
const app = new Hono();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use('*', honoLogger());
app.use('*', cors({
  origin: process.env.APP_URL || 'https://pingflow.konhito.me',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Pingflow-API-Key'],
}));

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'api-gateway', timestamp: Date.now() });
});

app.get('/ready', (c) => {
  return c.json({ status: 'ready', service: 'api-gateway' });
});

// ── Event Ingestion ──────────────────────────────────────────────────────────
const eventSchema = z.object({
  category: z.string().min(1),
  description: z.string().optional(),
  fields: z.record(z.any()).optional(),
});

app.post('/api/v1/events', async (c) => {
  // Validate API key
  const apiKey = c.req.header('X-Pingflow-API-Key');
  if (!apiKey) {
    return c.json({ error: 'Missing API key' }, 401);
  }

  try {
    const body = await c.req.json();
    const validated = eventSchema.parse(body);

    // Publish to Kafka for async processing
    await kafka.publishEvent(KafkaTopics.EVENTS_INCOMING, {
      eventId: crypto.randomUUID(),
      apiKey,
      category: validated.category,
      description: validated.description,
      fields: validated.fields || {},
      timestamp: new Date().toISOString(),
    });

    log.info({ category: validated.category }, 'Event ingested');
    return c.json({ success: true, message: 'Event queued for processing' }, 202);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', details: error.errors }, 400);
    }
    log.error({ error }, 'Event ingestion failed');
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ── Webhook: Stripe ──────────────────────────────────────────────────────────
app.post('/api/webhooks/stripe', async (c) => {
  const signature = c.req.header('stripe-signature');
  if (!signature) {
    return c.json({ error: 'Missing Stripe signature' }, 400);
  }

  try {
    const rawBody = await c.req.text();

    // TODO: Verify stripe signature using stripe.webhooks.constructEvent()
    // For now, publish the raw webhook payload for processing
    await kafka.publishEvent(KafkaTopics.EVENTS_INCOMING, {
      eventId: crypto.randomUUID(),
      source: 'stripe-webhook',
      rawPayload: rawBody,
      timestamp: new Date().toISOString(),
    });

    log.info('Stripe webhook received');
    return c.json({ received: true }, 200);
  } catch (error) {
    log.error({ error }, 'Stripe webhook processing failed');
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

// ── Status / Info ────────────────────────────────────────────────────────────
app.get('/api/status', (c) => {
  return c.json({
    service: 'pingflow-api-gateway',
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── 404 fallback ─────────────────────────────────────────────────────────────
app.notFound((c) => {
  return c.json({ error: 'Not found', path: c.req.path }, 404);
});

// ── Global error handler ─────────────────────────────────────────────────────
app.onError((err, c) => {
  log.error({ error: err.message }, 'Unhandled error');
  return c.json({ error: 'Internal server error' }, 500);
});

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '4000', 10);

serve({ fetch: app.fetch, port: PORT }, (info) => {
  log.info({ port: info.port }, 'API Gateway started');
});

// ── Graceful shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', async () => {
  log.info('SIGTERM received, shutting down gracefully');
  await kafka.disconnect();
  process.exit(0);
});

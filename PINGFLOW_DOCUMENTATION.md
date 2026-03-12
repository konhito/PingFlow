# 📘 PingFlow Documentation — Part 1: Architecture & Docker

> 🧒 **Read this like a story.** We'll explain everything from scratch. No prior knowledge needed.

---

## 🌍 What is PingFlow?

PingFlow is a **notification platform**. Think of it like this:

> Imagine you run an online shop. Every time someone buys something, you want to be notified on Discord, Telegram, WhatsApp, and by Email — all at once. PingFlow does exactly that.

You send PingFlow **one event** (like "someone bought something"), and it fans that event out to every channel you configured.

---

## 🏗️ Why Do We Have So Many "Services"?

This is the first big question. Why not just write ONE big program?

### The "Restaurant" analogy

Imagine a restaurant:
- The **waiter** takes your order (API Gateway)
- The **chef** actually cooks it (event-producer)
- The **sushi chef** makes sushi (discord-service)
- The **pasta chef** makes pasta (email-service)
- The **manager** watches everything (dashboard-service)

Each person does **one job**. If the sushi chef is sick, you can still get pasta. You can also hire 10 pasta chefs when pasta is in high demand.

That's **microservices**. Here are all of PingFlow's services:

| Service | Port | Job |
|---|---|---|
| `pingflow-frontend` | 3000 | The website you see in your browser (Next.js) |
| `event-producer` | 3001 | Receives events, saves to DB, puts them in Kafka queue |
| `dashboard-service` | 3002 | Sends real-time updates via WebSocket to the dashboard |
| `discord-service` | 3003 | Reads from Kafka, sends Discord messages |
| `whatsapp-service` | 3004 | Reads from Kafka, sends WhatsApp messages |
| `telegram-service` | 3005 | Reads from Kafka, sends Telegram messages |
| `email-service` | 3006 | Reads from Kafka, sends emails |
| `api-gateway` | 4000 | The new front door — validates API keys, routes requests |

### The flow of one event

```
Your App → API Gateway → Kafka (message queue) → Discord Service → Discord
                                                → Telegram Service → Telegram  
                                                → Email Service → Email
                                                → Dashboard Service → Your Browser (real-time)
```

---

## 🐳 What is Docker?

Before Docker, deploying an app meant:
1. "It works on my computer" 😩
2. Install Node, set env vars, pray it works on the server

**Docker solves this** by packaging your app + everything it needs into a **container** — like a shipping container. Same box, works everywhere.

### Key Docker terms (with analogies)

| Term | Real-world analogy |
|---|---|
| **Image** | A recipe (blueprint, read-only) |
| **Container** | A meal made FROM the recipe (running instance) |
| **Dockerfile** | The instructions to make the recipe |
| **Registry (GHCR)** | A cookbook library where you store recipes |
| **Layer** | One step of the recipe (each `RUN` = one layer) |

---

## 🐳 The Dockerfile — Line by Line

This is the `Dockerfile` at the root of the project. It builds the **Next.js frontend**.

```dockerfile
# ── Stage 1: Dependencies ─────────────────────────────────────────────────────
FROM node:20-alpine AS deps
```
- `FROM node:20-alpine` — Start with a tiny, pre-built Linux image that already has Node.js 20 installed. "alpine" is a very minimal Linux that weighs ~5MB vs ~900MB for full Ubuntu.
- `AS deps` — Give this stage a name "deps" so we can reference it later. This is called a **multi-stage build**.

```dockerfile
WORKDIR /app
```
- Create and move into the `/app` folder inside the container. All future commands run from here.

```dockerfile
RUN apk add --no-cache libc6-compat dumb-init
```
- `apk add` — Alpine's package manager (like `apt` or `brew`).
- `libc6-compat` — A compatibility library that some Node packages need.
- `dumb-init` — A tiny process manager that handles signals (like Ctrl+C) properly. More on this later.
- `--no-cache` — Don't cache the package list (keeps image smaller).

```dockerfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
```
- Copy only the dependency files first. Why? Docker **caches layers**. If you copy everything first and code changes, ALL layers re-run. By copying package files first, the `pnpm install` layer only re-runs when `package.json` changes.

```dockerfile
RUN corepack enable pnpm && pnpm install --frozen-lockfile
```
- `corepack enable pnpm` — Enables pnpm (a faster npm alternative).
- `pnpm install --frozen-lockfile` — Install exact versions from `pnpm-lock.yaml`. No surprises.

---

```dockerfile
# ── Stage 2: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .
```
- Start a fresh stage. Copy `node_modules` FROM the `deps` stage (not re-installing).
- `COPY . .` — Now copy ALL your source code.

```dockerfile
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable pnpm && pnpm run build
```
- Disable Next.js telemetry (analytics it sends to Vercel).
- Build the Next.js app. This outputs a standalone production build to `.next/`.

---

```dockerfile
# ── Stage 3: Runner ───────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
```
- The **final** stage. Only this makes it into the image you ship.
- Setting `NODE_ENV=production` makes libraries skip dev-only code paths (faster, smaller).

```dockerfile
COPY --from=deps /usr/bin/dumb-init /usr/bin/dumb-init
```
- Copy `dumb-init` binary from the deps stage into runner. We need it at runtime.

```dockerfile
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
```
- **Security**: Create a non-root user called `nextjs`. Running as root inside a container is dangerous — if someone exploits your app, they get full root access.

```dockerfile
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
```
- Copy only the built output. `--chown=nextjs:nodejs` sets file ownership to our safe user.
- Not copying `node_modules` again! The `.next/standalone` output includes only what's needed.

```dockerfile
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
```
- Switch to the non-root user.
- `EXPOSE 3000` — Document that this container listens on port 3000 (doesn't actually open it).
- `0.0.0.0` — Listen on ALL network interfaces, not just localhost.

```dockerfile
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
```
- `ENTRYPOINT` — Always run `dumb-init` first. It becomes the parent process.
- `CMD` — What `dumb-init` actually launches: `node server.js`.
- Why `dumb-init`? When Kubernetes wants to stop a container, it sends `SIGTERM`. Node.js doesn't handle this well when run as PID 1. `dumb-init` properly forwards signals and reaps zombie processes.

### 🔑 Why 3 stages?

The multi-stage build gives us:
1. **Small final image**: Only the runner stage is kept. No build tools, no dev dependencies.
2. **Security**: Non-root user, minimal attack surface.
3. **Build cache**: Dependencies layer only re-builds when `package.json` changes.

---

## 🏃 How to Run Docker Locally

### Step 1: Install Docker
Download [Docker Desktop](https://www.docker.com/products/docker-desktop/) and install it.

### Step 2: Build the image
```bash
# In the c:\code\ping\pingflow directory
docker build -t pingflow-frontend:local .
```
- `-t pingflow-frontend:local` — Tag (name) the image.

### Step 3: Run it
```bash
docker run -p 3000:3000 --env-file .env.example pingflow-frontend:local
```
- `-p 3000:3000` — Map port 3000 on your machine to port 3000 in the container.
- `--env-file .env.example` — Pass environment variables.

### Step 4: See it
Open http://localhost:3000 in your browser.

---

## 🐳 Docker Compose (For All Services Together)

To run ALL services locally at once, the `docker/` folder contains compose files. They wires all 8 services + Kafka + Redis + PostgreSQL together with one command:

```bash
docker compose -f docker/docker-compose.yml up
```

---

*Continue reading:*
- **Part 2** → API Gateway (Hono) and how events flow
- **Part 3** → Kubernetes: what it is, and every K8s file explained
- **Part 4** → ArgoCD: GitOps and auto-deployment
- **Part 5** → CI/CD: GitHub Actions, every step explained


# 📘 PingFlow Documentation — Part 2: Hono & The API Gateway

> 🧒 **Remember**: this is your "front door" service. Every request from the outside world enters here first.

---

## 🌐 What is Hono?

Hono is a **web framework** for Node.js and edge runtimes. It's like Express.js but:
- **Super fast** (runs on edge workers if needed)
- **Tiny** (~14KB)
- **TypeScript-first**

Think of Hono like the **menu board at a restaurant counter**. It says: "If you ask for `/api/v1/events`, I'll do THIS. If you ask for `/health`, I'll do THAT."

---

## 📂 File: `services/api-gateway/src/index.ts`

Here is the entire file explained **one chunk at a time**:

---

### 1. Imports

```typescript
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { createKafkaClient } from '@pingflow/kafka-client';
import { createServiceLogger } from '@pingflow/logger';
import { KafkaTopics } from '@pingflow/shared-types';
import { z } from 'zod';
```

- `serve` from `@hono/node-server` — Hono is runtime-agnostic, so we need an adapter to run it inside Node.js specifically.
- `Hono` — The main web framework class.
- `cors` — Middleware (a function that runs before/after routes) that handles **Cross-Origin Resource Sharing**. Imagine your frontend is at `pingflow.konhito.me` and tries to call `api.pingflow.konhito.me` — browsers block this by default. CORS headers tell the browser "it's OK, these two domains can talk."
- `logger as honoLogger` — Built-in request logger. Logs every request: method, path, status code, time.
- `createKafkaClient` — Our shared package to talk to Kafka (the message queue).
- `createServiceLogger` — Our shared package to create a structured logger (using pino under the hood).
- `KafkaTopics` — Shared enum that lists all the Kafka topic names so we don't typo them.
- `z` from `zod` — A schema validation library. You describe the shape of data and it validates it for you.

---

### 2. Setup

```typescript
const log = createServiceLogger('api-gateway');
const kafka = createKafkaClient();
const app = new Hono();
```

- `log` — Our structured logger. Instead of `console.log`, we use this because it outputs JSON with timestamps, severity levels, and service name — much easier to search in production.
- `kafka` — Creates a Kafka producer/consumer connection. This is our "walkie-talkie" to send messages to other services.
- `app = new Hono()` — Create the web application. Think of this like creating a blank restaurant — no menu yet.

---

### 3. Middleware

```typescript
app.use('*', honoLogger());
```
- `'*'` means "apply this to EVERY route".
- `honoLogger()` — Logs every request automatically. When someone calls `/api/v1/events`, you'll see a line like:
  ```
  POST /api/v1/events 202 14ms
  ```

```typescript
app.use('*', cors({
  origin: process.env.APP_URL || 'https://pingflow.konhito.me',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Pingflow-API-Key'],
}));
```
- CORS middleware, applied to every route.
- `origin` — Only allow requests from `pingflow.konhito.me`. Requests from other websites get blocked.
- `allowMethods` — Which HTTP verbs are permitted.
- `allowHeaders` — Which custom request headers are permitted. `X-Pingflow-API-Key` is our custom header for authentication.
- `OPTIONS` is the "preflight" request browsers send automatically before cross-origin requests — we need to allow it.

---

### 4. Health Checks

```typescript
app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'api-gateway', timestamp: Date.now() });
});

app.get('/ready', (c) => {
  return c.json({ status: 'ready', service: 'api-gateway' });
});
```

- In Hono, `app.get(path, handler)` registers a GET route.
- `c` is the **context** — it holds the request, response helpers, headers, etc.
- `c.json(...)` — Returns a JSON response.

**Why do we have TWO health endpoints?**

Kubernetes uses two different checks:
- `/health` → **Liveness probe**. "Is the app alive?" If this fails, K8s restarts the container.
- `/ready` → **Readiness probe**. "Is the app ready to receive traffic?" If this fails, K8s stops sending traffic to this pod (but doesn't restart it).

This matters: an app might be alive (process not crashed) but still warming up (connecting to DB) — during warm-up, `/health` passes but `/ready` fails, so Kubernetes holds traffic until it's truly ready.

---

### 5. Event Schema Validation

```typescript
const eventSchema = z.object({
  category: z.string().min(1),
  description: z.string().optional(),
  fields: z.record(z.any()).optional(),
});
```

This is Zod validation. It says:
- `category` — Must be present and be a string with at least 1 character.
- `description` — Optional string.
- `fields` — Optional object where keys are strings and values can be anything (`z.any()`).

If someone sends `{ "category": "" }`, Zod will reject it with an error message.

---

### 6. Event Ingestion Endpoint (The Core Route)

```typescript
app.post('/api/v1/events', async (c) => {
```
- Handles `POST /api/v1/events`. This is where your app sends events TO PingFlow.
- `async` because we need to `await` Kafka publishing.

```typescript
  const apiKey = c.req.header('X-Pingflow-API-Key');
  if (!apiKey) {
    return c.json({ error: 'Missing API key' }, 401);
  }
```
- Read the `X-Pingflow-API-Key` header from the request.
- If it's missing, return HTTP 401 (Unauthorized). The `401` is the **status code** — a standard number the browser and apps understand. 401 = "you need to login/authenticate first."

```typescript
  try {
    const body = await c.req.json();
    const validated = eventSchema.parse(body);
```
- `c.req.json()` — Parse the request body as JSON.
- `eventSchema.parse(body)` — Validate it against our schema. If invalid, this THROWS a `ZodError`.

```typescript
    await kafka.publishEvent(KafkaTopics.EVENTS_INCOMING, {
      eventId: crypto.randomUUID(),
      apiKey,
      category: validated.category,
      description: validated.description,
      fields: validated.fields || {},
      timestamp: new Date().toISOString(),
    });
```
- **Publish to Kafka**! This is the key step.
- `crypto.randomUUID()` — Generate a unique ID for this event (like a tracking number).
- `KafkaTopics.EVENTS_INCOMING` — The Kafka topic name (like a "channel" to publish to).
- We attach `apiKey` so downstream services know who triggered this (for usage tracking/billing).
- We DON'T validate the API key here yet (just check it exists) — that happens in a deeper layer.

```typescript
    log.info({ category: validated.category }, 'Event ingested');
    return c.json({ success: true, message: 'Event queued for processing' }, 202);
```
- Log the event with the category (structured logging — easy to search).
- Return HTTP **202 Accepted** — NOT 200 OK. The difference: 
  - `200 OK` = "I processed your request."
  - `202 Accepted` = "I received your request and will process it soon." 
  - We use 202 because Kafka processing is asynchronous — we queued it but haven't sent the Discord message yet.

```typescript
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', details: error.errors }, 400);
    }
    log.error({ error }, 'Event ingestion failed');
    return c.json({ error: 'Internal server error' }, 500);
  }
```
- Catch block handles two cases:
  - `ZodError` → Return 400 Bad Request with details.
  - Any other error → Return 500 Internal Server Error.

---

### 7. Stripe Webhook

```typescript
app.post('/api/webhooks/stripe', async (c) => {
  const signature = c.req.header('stripe-signature');
  if (!signature) {
    return c.json({ error: 'Missing Stripe signature' }, 400);
  }
```
- Stripe sends webhooks (POST requests) to your server when events happen (payment succeeded, subscription cancelled, etc.).
- Stripe attaches a `stripe-signature` header to prove the request is genuinely from Stripe.

```typescript
  const rawBody = await c.req.text();
```
- Read body as **raw text**, not JSON. The signature validation needs the exact original bytes — parsing as JSON and re-stringifying would break it.

```typescript
  await kafka.publishEvent(KafkaTopics.EVENTS_INCOMING, {
    eventId: crypto.randomUUID(),
    source: 'stripe-webhook',
    rawPayload: rawBody,
    timestamp: new Date().toISOString(),
  });
```
- Forward the raw Stripe payload into Kafka for async processing. Another service will handle billing logic.
- Note the `TODO` comment: signature verification isn't done yet. This is a security gap to fix.

---

### 8. Graceful Shutdown

```typescript
process.on('SIGTERM', async () => {
  log.info('SIGTERM received, shutting down gracefully');
  await kafka.disconnect();
  process.exit(0);
});
```

- `SIGTERM` is the signal Kubernetes sends when it wants to stop a container.
- Without this: Node.js exits immediately, potentially dropping queued Kafka messages.
- With this: We disconnect from Kafka cleanly (flushing any buffered messages), then exit.
- `process.exit(0)` — Exit with code 0 = success.

---

## 🔌 What is Kafka?

Kafka is a **message queue** — like a conveyor belt in a factory.

```
API Gateway → [puts event on belt] → Kafka topic
                                           ↓
                              Discord service [picks up from belt]
                              Telegram service [picks up from belt]
                              Email service [picks up from belt]
```

**Why not just call the services directly?**
1. **Reliability**: If Discord is down, the message stays in Kafka and gets delivered when Discord comes back.
2. **Decoupling**: API Gateway doesn't need to know about Discord/Telegram/Email. It just puts a message on the belt.
3. **Scale**: 1 million events can queue up; services consume at their own pace.

---

*Continue reading:*
- **Part 3** → Kubernetes: clusters, pods, deployments, ingress
- **Part 4** → ArgoCD: GitOps
- **Part 5** → CI/CD Pipeline


# 📘 PingFlow Documentation — Part 3: Kubernetes

> 🧒 Kubernetes (K8s) sounds scary. But it's just a robot that manages your containers.

---

## ☸️ What is Kubernetes?

Imagine you have 20 Docker containers running across 5 servers. How do you:
- Make sure they all stay running?
- Restart crashed ones?
- Add more copies when traffic spikes?
- Route network traffic to the right container?

Kubernetes does all of this **automatically**. It's like a **factory floor manager robot**.

### Key Concepts (with Lego analogies)

| K8s Term | Lego analogy | What it is |
|---|---|---|
| **Cluster** | The Lego table | All your servers managed together |
| **Node** | One Lego baseplate | A single server/VM |
| **Pod** | A Lego build | The smallest unit — one or more containers |
| **Deployment** | A Lego instruction booklet | "Always keep 2 copies of this pod running" |
| **Service** | A phone number for a Lego city | Stable network address that routes to pods |
| **Namespace** | A Lego box | Logical grouping / isolation |
| **Ingress** | The city's front gate | Routes internet traffic to the right service |
| **ConfigMap** | A sticky note | Non-secret config values |
| **Secret** | A locked safe | Sensitive values like passwords |
| **StatefulSet** | A numbered Lego set | Like a Deployment but with stable identity and persistent storage |
| **HPA** | An auto-ordering system | Adds/removes pods based on CPU/memory |

---

## 📂 `k8s/namespace.yaml` — Creating a Sandbox

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: pingflow
```
- Everything in PingFlow lives inside the `pingflow` namespace.
- Namespaces prevent collisions with other teams' apps on the same cluster.
- Like having your own desk drawer instead of dumping everything on the shared table.

---

## 📂 `k8s/secrets.yaml` — Sensitive Config

### Part 1: The Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: pingflow-secrets
  namespace: pingflow
type: Opaque
stringData:
  database-url: "postgresql://pingflow:CHANGE_ME@postgres:5432/pingflow"
  postgres-user: "pingflow"
  postgres-password: "CHANGE_ME"
  nextauth-secret: "CHANGE_ME_32_CHAR_RANDOM_STRING"
  jwt-secret: "CHANGE_ME_32_CHAR_RANDOM_STRING"
  stripe-secret-key: "sk_live_CHANGE_ME"
  discord-bot-token: "CHANGE_ME"
  telegram-bot-token: "CHANGE_ME"
  smtp-user: "noreply@pingflow.konhito.me"
  smtp-pass: "CHANGE_ME"
```
- `kind: Secret` — K8s object for sensitive data.
- `type: Opaque` — Generic blob of key-value pairs (vs. more specific types like `kubernetes.io/tls`).
- `stringData` — You write human-readable strings; K8s base64-encodes them automatically.
- Each pod can mount these as environment variables without hardcoding them in code.
- **Important**: This file's `CHANGE_ME` values are placeholders. In production, these are filled with real values using a tool like [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) or Vault.

### Part 2: The ConfigMap

```yaml
kind: ConfigMap
metadata:
  name: pingflow-config
data:
  KAFKA_BROKER: "kafka:9092"
  KAFKA_BROKERS: "kafka:9092"
  REDIS_URL: "redis://redis:6379"
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  SMTP_HOST: "smtp.gmail.com"
  SMTP_PORT: "587"
  FROM_EMAIL: "noreply@pingflow.konhito.me"
  APP_URL: "https://pingflow.konhito.me"
```
- `kind: ConfigMap` — Like Secret but for non-sensitive config.
- Notice `kafka:9092` — Inside Kubernetes, services talk to each other by **service name**. `kafka` is the name of the Kafka K8s Service. Kubernetes has built-in DNS, so `kafka` resolves to the Kafka pod's IP automatically.

---

## 📂 `k8s/infrastructure.yaml` — Kafka, Zookeeper, Redis, PostgreSQL

These are all `StatefulSet` resources. Why not `Deployment`?

**Deployment** = Stateless (any pod is identical, any pod can be replaced)

**StatefulSet** = Stateful (each pod has a stable identity, ordered startup, persistent disks)

Databases MUST use StatefulSet because:
1. Data is stored on disk — pods need fixed, persistent storage
2. Pods have predictable names (`kafka-0`, `kafka-1`)

### Kafka StatefulSet

```yaml
kind: StatefulSet
metadata:
  name: kafka
spec:
  serviceName: kafka
  replicas: 1
  containers:
  - name: kafka
    image: confluentinc/cp-kafka:7.5.0
    env:
    - name: KAFKA_BROKER_ID
      value: "1"
    - name: KAFKA_ZOOKEEPER_CONNECT
      value: "zookeeper:2181"
    - name: KAFKA_ADVERTISED_LISTENERS
      value: "PLAINTEXT://kafka:9092"
    - name: KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR
      value: "1"
    - name: KAFKA_LOG_RETENTION_HOURS
      value: "168"
```
- `image: confluentinc/cp-kafka:7.5.0` — Official Kafka image from Confluent, pinned to version 7.5.0 (not `latest` — stability matters).
- `KAFKA_BROKER_ID: "1"` — Each Kafka broker needs a unique ID. We have 1 broker.
- `KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"` — Kafka needs Zookeeper to coordinate. Points to it by K8s service name.
- `KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://kafka:9092"` — The address Kafka tells clients to connect to.
- `KAFKA_LOG_RETENTION_HOURS: "168"` — Keep messages for 7 days (168 hours).

```yaml
    resources:
      requests:
        memory: "512Mi"
        cpu: "250m"
      limits:
        memory: "1Gi"
        cpu: "500m"
```
- `requests` — The minimum Kubernetes will **guarantee** to this pod. The scheduler uses this to find a node with enough capacity.
- `limits` — The maximum it can use. If it exceeds the memory limit, the pod is killed (OOMKilled).
- `cpu: "250m"` — 250 millicores = 0.25 of a CPU core.
- `memory: "512Mi"` — 512 mebibytes.

```yaml
    livenessProbe:
      exec:
        command:
        - sh
        - -c
        - "kafka-topics --bootstrap-server localhost:9092 --list > /dev/null 2>&1"
      initialDelaySeconds: 60
      periodSeconds: 30
      failureThreshold: 3
```
- Kubernetes runs this command every 30 seconds to check if Kafka is alive.
- `initialDelaySeconds: 60` — Don't check for the first 60 seconds; Kafka takes time to start.
- `failureThreshold: 3` — Only restart after 3 consecutive failures.
- The command lists Kafka topics — if Kafka is broken, this command fails.

```yaml
  volumeClaimTemplates:
  - metadata:
      name: kafka-data
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```
- StatefulSets can create **PersistentVolumeClaims (PVCs)** automatically — a 10GB disk per pod.
- `ReadWriteOnce` — Can only be mounted by one pod at a time.
- The data survives pod restarts (unlike regular container filesystem).

### Kafka Service

```yaml
kind: Service
metadata:
  name: kafka
spec:
  selector:
    app: kafka
  ports:
  - port: 9092
    targetPort: 9092
  clusterIP: None
```
- `clusterIP: None` — This is a **Headless Service**. Instead of a single virtual IP, DNS returns the actual pod IPs. StatefulSets need this so each pod (`kafka-0`, `kafka-1`) is independently addressable.

### Zookeeper, Redis, PostgreSQL
All follow the same pattern as Kafka. Notable differences:

- **Zookeeper**: Port 2181, 5GB storage. Uses `echo ruok | nc localhost 2181 | grep imok` as health check — this is Zookeeper's built-in health protocol.
- **Redis**: Port 6379, 5GB storage. Started with `--appendonly yes` (durability) + LRU eviction when RAM fills up.
- **PostgreSQL**: Port 5432, 20GB storage. Password pulled from `pingflow-secrets` secret.

---

## 📂 `k8s/api-gateway.yaml` — API Gateway Deployment

```yaml
kind: Deployment
spec:
  replicas: 2
```
- We run **2 copies** (pods) of the API gateway. If one crashes, the other keeps serving traffic.

```yaml
  containers:
  - name: api-gateway
    image: pingflow/api-gateway:latest
    ports:
    - containerPort: 4000
    envFrom:
    - configMapRef:
        name: pingflow-config
```
- `envFrom: configMapRef` — Mount ALL keys from `pingflow-config` as environment variables. This is how the app gets `KAFKA_BROKER`, `REDIS_URL`, etc.

```yaml
    env:
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef:
          name: pingflow-secrets
          key: database-url
```
- Sensitive values come from the Secret, individually. `DATABASE_URL` injected from `pingflow-secrets`.

```yaml
    livenessProbe:
      httpGet:
        path: /health
        port: 4000
    readinessProbe:
      httpGet:
        path: /ready
        port: 4000
```
- Instead of `exec` (running a command), use `httpGet` — simpler. K8s makes an HTTP GET to `/health` directly.

---

## 📂 `k8s/notification-services.yaml` — Discord, WhatsApp, Telegram, Email

All four follow the same pattern. Example: Discord:

```yaml
kind: Deployment
spec:
  replicas: 2
  containers:
  - name: discord-service
    image: pingflow/discord-service:latest
    env:
    - name: DISCORD_BOT_TOKEN
      valueFrom:
        secretKeyRef:
          name: pingflow-secrets
          key: discord-bot-token
    livenessProbe:
      exec:
        command: ["node", "-e", "require('http').get('http://localhost:3003/health', r => process.exit(r.statusCode===200?0:1))"]
```
- The Discord service gets its bot token from the Secret.
- Health check: a tiny inline Node script that makes an HTTP call and exits with 0 (success) or 1 (fail) based on status code.

---

## 📂 `k8s/ingress.yaml` — The Front Door of the Internet

This is how traffic flows from the internet INTO the cluster:

```
Internet 
    ↓
DNS: pingflow.konhito.me → Load Balancer IP
    ↓
nginx Ingress Controller (K8s)
    ↓  
Routes by path:
  /ws → dashboard-service:3002  (WebSocket)
  /api/v1 → event-producer:3001
  /api → api-gateway:4000
  / → pingflow-frontend:3000
```

```yaml
metadata:
  annotations:
    kubernetes.io/ingress.class: "nginx"
```
- Use the nginx Ingress Controller (a reverse proxy pod running inside K8s).

```yaml
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
```
- Automatically get and renew **free SSL certificates** from Let's Encrypt. cert-manager watches this annotation and handles everything.

```yaml
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/upgrade: "$http_upgrade"
    nginx.ingress.kubernetes.io/connection-upgrade: "Upgrade"
```
- WebSocket support. WebSockets are long-lived connections (not quick request/response). These settings tell nginx to keep the connection open for up to 1 hour and upgrade the HTTP connection to WebSocket protocol.

```yaml
spec:
  tls:
  - hosts:
    - pingflow.konhito.me
    secretName: pingflow-tls
```
- `tls` block — Enable HTTPS. cert-manager will store the SSL certificate in the `pingflow-tls` Secret.

```yaml
  rules:
  - host: pingflow.konhito.me
    http:
      paths:
      - path: /ws
        pathType: Prefix
        backend:
          service:
            name: dashboard-service
            port:
              number: 3002
```
- `pathType: Prefix` — The path prefix `/ws` matches `/ws`, `/ws/connect`, `/ws/anything`.
- Routes WebSocket connections to the dashboard service.

---

## 📂 `k8s/hpa.yaml` — Auto-Scaling

HPA = Horizontal Pod Autoscaler. This is K8s automatically adding/removing pods.

```yaml
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
spec:
  scaleTargetRef:
    name: api-gateway
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300
```
- `minReplicas: 2` — Always at least 2 pods (high availability).
- `maxReplicas: 10` — Never more than 10 (cost control).
- `averageUtilization: 70` — If average CPU across all pods exceeds 70%, add more pods.
- `scaleUp.stabilizationWindowSeconds: 15` — Wait only 15s before scaling up (react fast to spikes).
- `scaleDown.stabilizationWindowSeconds: 300` — Wait 5 minutes before scaling down (avoid yo-yo effect).

---

## 📂 `k8s/network-policies.yaml` — Firewall Rules

By default, all pods can talk to all other pods. Network policies add a firewall.

```yaml
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}   # {} means ALL pods
  policyTypes:
  - Ingress
```
- This is the "deny everything by default" rule. No pod can receive ingress traffic unless explicitly allowed.

```yaml
kind: NetworkPolicy
metadata:
  name: allow-kafka-from-services
spec:
  podSelector:
    matchLabels:
      app: kafka
  ingress:
  - from:
    - podSelector: { matchLabels: { app: event-producer } }
    - podSelector: { matchLabels: { app: discord-service  } }
    - podSelector: { matchLabels: { app: api-gateway } }
    # ... etc
    ports:
    - port: 9092
```
- Kafka only accepts connections from specific services on port 9092.
- If a compromised pod tries to talk to Kafka, it's blocked.

```yaml
kind: NetworkPolicy
metadata:
  name: allow-postgres-from-services
spec:
  podSelector:
    matchLabels:
      app: postgres
  ingress:
  - from:
    - podSelector: { matchLabels: { app: event-producer } }
    - podSelector: { matchLabels: { app: api-gateway } }
    ports:
    - port: 5432
```
- PostgreSQL only accepts connections from `event-producer` and `api-gateway`. The notification services (Discord, Telegram, etc.) cannot touch the database — they don't need to.

---

*Continue reading:*
- **Part 4** → ArgoCD & GitOps
- **Part 5** → CI/CD Pipeline


# 📘 PingFlow Documentation — Part 4: ArgoCD, GitOps & CI/CD

---

## 🔄 What is GitOps?

Traditional deployment: someone runs `kubectl apply -f k8s/` from their laptop.

**GitOps**: The Git repository IS the source of truth. A robot (ArgoCD) watches Git and makes the cluster match what's in Git.

```
Developer pushes code to Git
          ↓
GitHub Actions builds Docker image
          ↓
GitHub Actions updates image tag in k8s/*.yaml files and pushes to Git
          ↓
ArgoCD detects the change in Git
          ↓
ArgoCD applies the new k8s/*.yaml to the cluster
          ↓
Pods restart with the new image
```

**Benefits:**
- Full audit trail (every change is a Git commit)
- Easy rollback (revert the Git commit)
- No one needs direct `kubectl` access in production

---

## 🚀 What is ArgoCD?

ArgoCD is a **Continuous Delivery tool** that watches your Git repo and keeps the cluster in sync.

### The App-of-Apps Pattern

ArgoCD uses a **root application** that points to a folder of child applications.

```
argocd/
├── application.yaml   ← Root app (watches argocd/apps/)
├── project.yaml       ← RBAC permissions for the project
└── apps/              ← Each file here is a child app ArgoCD manages
```

---

## 📂 `argocd/application.yaml` — Root Application

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: pingflow-root
  namespace: argocd
  finalizers:
  - resources-finalizer.argocd.argoproj.io
  labels:
    app.kubernetes.io/part-of: pingflow
```
- `kind: Application` — ArgoCD's custom resource type.
- `namespace: argocd` — ArgoCD management objects live in the `argocd` namespace.
- `finalizers: resources-finalizer.argocd.argoproj.io` — When you delete this Application, ArgoCD also deletes all the K8s resources it manages. Without this, deleting the ArgoCD app would leave orphaned pods running.
- `app.kubernetes.io/part-of: pingflow` — Standard label to group related resources.

```yaml
spec:
  project: pingflow
```
- Which ArgoCD Project this belongs to. Projects define RBAC — what repos it can read, what clusters it can deploy to.

```yaml
  source:
    repoURL: https://github.com/konhito/PingFlow.git
    targetRevision: main
    path: argocd/apps
```
- `repoURL` — ArgoCD watches THIS git repository.
- `targetRevision: main` — Track the `main` branch.
- `path: argocd/apps` — Only look inside the `argocd/apps/` folder for child applications.

```yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
```
- `https://kubernetes.default.svc` — The cluster ArgoCD itself is running in. This is the in-cluster API server address.
- Child apps deploy to `pingflow` namespace (defined in each child app), not `argocd`.

```yaml
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
```
- `automated` — ArgoCD will sync automatically without you clicking a button.
- `prune: true` — If you DELETE a file from Git, ArgoCD deletes the corresponding K8s resource too. Without this, deleted resources would linger.
- `selfHeal: true` — If someone manually changes something in the cluster (kubectl edit), ArgoCD will revert it back to match Git. Git is the law.
- `allowEmpty: false` — Don't sync if the result would delete EVERYTHING (safety guard).

```yaml
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```
- If sync fails, retry up to 5 times.
- `backoff` — Exponential backoff: wait 5s, then 10s, then 20s, then 40s... (factor: 2), capped at 3 minutes.

---

## ⚡ How to Install ArgoCD

```bash
# 1. Create the argocd namespace
kubectl create namespace argocd

# 2. Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 3. Wait for it to be ready
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd

# 4. Apply the PingFlow ArgoCD config
kubectl apply -f argocd/application.yaml
kubectl apply -f argocd/project.yaml

# 5. Get the initial admin password
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath='{.data.password}' | base64 -d

# 6. Port-forward to access the UI
kubectl port-forward svc/argocd-server 8080:443 -n argocd
# Then open https://localhost:8080
```

---

## 🔨 `k8s/secrets.yaml` — Filling in Real Values

Before ArgoCD deploys, you need real secrets:

```bash
# Edit the file and replace all CHANGE_ME values
kubectl apply -f k8s/secrets.yaml
```

Or better, use kubectl directly (never commit real secrets to Git):
```bash
kubectl create secret generic pingflow-secrets \
  --namespace=pingflow \
  --from-literal=database-url="postgresql://pingflow:MYPASSWORD@postgres:5432/pingflow" \
  --from-literal=discord-bot-token="your-real-token" \
  --from-literal=smtp-pass="your-real-smtp-pass"
```

---

## 🤖 CI/CD: The GitHub Actions Pipeline

File: `.github/workflows/ci.yml`

This runs automatically every time you push to `main` or open a Pull Request.

---

### Job 1: Lint & Type Check

```yaml
jobs:
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
```
- `runs-on: ubuntu-latest` — GitHub provides a fresh Ubuntu VM for this job. It's thrown away after.
- `actions/checkout@v4` — Clone the repository into the VM.

```yaml
    - uses: pnpm/action-setup@v2
      with:
        version: 9
    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: pnpm
```
- Install pnpm 9 and Node 20 on the runner.
- `cache: pnpm` — Cache the `~/.pnpm-store` between runs. If packages haven't changed, this job skips downloading them. Saves ~60 seconds.

```yaml
    - run: pnpm install --frozen-lockfile
    - run: pnpm run build:typecheck
```
- Install deps, then run TypeScript type checking across all packages/services.
- If there's a type error, the pipeline fails HERE and the Docker build never runs. Fail fast!

---

### Job 2: Build & Push Service Docker Images

```yaml
  build-and-push:
    needs: lint
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
```
- `needs: lint` — Only runs AFTER lint passes.
- `if:` — Only runs on direct pushes to `main` (not on PRs — we don't want to publish images from PRs).

```yaml
    strategy:
      matrix:
        service:
        - event-producer
        - dashboard-service
        - discord-service
        - whatsapp-service
        - telegram-service
        - email-service
        - api-gateway
```
- **Matrix strategy** — GitHub Actions runs this job 7 times IN PARALLEL, once per service. Each gets its own fresh VM. This builds all 7 service images simultaneously instead of sequentially.

```yaml
    - name: Log in to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
```
- Login to GHCR (GitHub Container Registry) — where Docker images are stored.
- `github.actor` = the username of whoever triggered the workflow.
- `secrets.GITHUB_TOKEN` = a temporary token GitHub automatically creates for the workflow. It has permission to push packages.

```yaml
    - name: Docker meta
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.IMAGE_PREFIX }}/${{ matrix.service }}
        tags: |
          type=sha,prefix=
          type=raw,value=latest,enable={{is_default_branch}}
```
- Generates image tags automatically:
  - `type=sha,prefix=` → Tag with the Git commit SHA (e.g., `a1b2c3d`). This is IMMUTABLE — you can always go back.
  - `type=raw,value=latest` → Also tag as `latest` on main branch.
- Result: image is pushed as BOTH `ghcr.io/konhito/pingflow/discord-service:a1b2c3d` AND `ghcr.io/konhito/pingflow/discord-service:latest`.

```yaml
    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        context: ./services/${{ matrix.service }}
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
```
- `context: ./services/${{ matrix.service }}` — Build context is the service's folder.
- `cache-from: type=gha` — Use GitHub Actions' built-in cache to store Docker layer cache between builds. If only one file changed, most layers are pulled from cache. **Huge** time saver.

---

### Job 3: Build Frontend Image

Same as Job 2 but:
- `context: .` (root — the whole monorepo, because the Dockerfile is at root)
- `file: ./Dockerfile` — Explicit path to the Dockerfile

---

### Job 4: Update K8s Manifests

```yaml
  update-manifests:
    needs: [build-and-push, build-frontend]
```
- Waits for BOTH image-building jobs to finish.

```yaml
    - name: Update image tags in K8s manifests
      run: |
        SHORT_SHA=$(echo "${{ github.sha }}" | cut -c1-7)
        
        for service in event-producer dashboard-service discord-service ...; do
          sed -i "s|image: pingflow/${service}:.*|image: ${{ env.IMAGE_PREFIX }}/${service}:${SHORT_SHA}|g" k8s/*.yaml
        done
```
- `SHORT_SHA` = first 7 characters of the Git commit hash (e.g., `a1b2c3d`).
- `sed -i "s|old|new|g" file` = Find-and-replace in-place. Changes every line that says `image: pingflow/discord-service:anything` to `image: ghcr.io/konhito/pingflow/discord-service:a1b2c3d`.

```yaml
    - name: Commit and push updated manifests
      run: |
        git config user.name "github-actions[bot]"
        git config user.email "github-actions[bot]@users.noreply.github.com"
        git add k8s/
        git diff --staged --quiet || git commit -m "ci: update image tags to ${GITHUB_SHA::7}"
        git push
```
- The bot commits the updated `k8s/*.yaml` files back to the repo.
- `git diff --staged --quiet || ...` — Only commit if there are actual changes (avoid empty commits).
- This commit then triggers ArgoCD (which watches for Git commits), completing the loop!

---

## 🔁 The Complete Flow Visualized

```
You: git push origin main
         │
         ▼
GitHub Actions starts:
  ┌─ Job 1: Lint ──────────────────────────┐
  │  TypeScript check passes ✅            │
  └────────────────────────────────────────┘
         │ (triggers on success)
         ▼
  ┌─ Job 2: Build services (×7 parallel) ──┐
  │  Build Docker images ✅                │
  │  Push to ghcr.io ✅                    │
  └────────────────────────────────────────┘
  ┌─ Job 3: Build frontend ────────────────┐
  │  Build Next.js Docker image ✅         │
  │  Push to ghcr.io ✅                    │
  └────────────────────────────────────────┘
         │ (both finish)
         ▼
  ┌─ Job 4: Update manifests ──────────────┐
  │  sed replace image tags in k8s/*.yaml  │
  │  git commit + push to main ✅          │
  └────────────────────────────────────────┘
         │ (ArgoCD detects new commit)
         ▼
ArgoCD syncs:
  kubectl apply -f k8s/*.yaml (effectively)
         │
         ▼
Kubernetes:
  Rolls out new pods with new image
  Old pods shut down gracefully (SIGTERM)
  New pods pass health checks
  Traffic switches to new pods ✅
```

---

## 🛠️ Full Setup Guide from Scratch

### Prerequisites
1. A Kubernetes cluster (e.g., k3s on a VPS, GKE, EKS, or DigitalOcean Kubernetes)
2. `kubectl` installed on your machine
3. `helm` installed (for cert-manager)

### Steps

```bash
# 1. Install nginx Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

# 2. Install cert-manager (for Let's Encrypt SSL)
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --set installCRDs=true

# 3. Create cluster issuer for Let's Encrypt
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your@email.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

# 4. Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 5. Apply namespace and secrets
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml  # Fill in real values first!

# 6. Apply root ArgoCD application (it takes over from here)
kubectl apply -f argocd/project.yaml
kubectl apply -f argocd/application.yaml

# ArgoCD now deploys everything automatically!
```

### DNS Setup
Point your domain `pingflow.konhito.me` to the external IP of your nginx Ingress LoadBalancer:
```bash
kubectl get svc -n ingress-nginx ingress-nginx-controller
# Note the EXTERNAL-IP
# Add an A record in your DNS: pingflow.konhito.me → EXTERNAL-IP
```

---

*📖 You've now read the complete PingFlow documentation!*

**Quick reference: which Part covers what?**
- **Part 1**: Big picture — microservices, Docker (what it is, the Dockerfile line-by-line)
- **Part 2**: Hono API Gateway — every line of `index.ts` explained
- **Part 3**: Kubernetes — every K8s YAML file explained
- **Part 4**: ArgoCD (GitOps) + GitHub Actions CI/CD pipeline


# 📘 PingFlow Documentation — Part 5: OAuth & The Email Service

> 🧒 **Almost done!** In this final part, we'll look at how we know *who* you are (Authentication) and how we send you emails.

---

## 🔐 What is OAuth?

Imagine you want to go to a concert. Instead of giving the security guard your ID card, home address, and mother's maiden name, you just show them a **ticket** issued by Ticketmaster. 

**OAuth** is exactly like that. Instead of users creating a password on PingFlow (which we'd have to securely store), we say: "Go log in with Google. If Google says you're who you say you are, we believe them."

### The OAuth "Dance" (3 Steps)
1. **The Redirect:** We send the user to `accounts.google.com` (showing our "Client ID" so Google knows we sent them).
2. **The Consent:** The user clicks "Allow PingFlow to see my email."
3. **The Callback:** Google sends the user back to our app with a temporary **Code**. We secretly exchange that Code for an **Access Token** to get their profile.

---

## 📂 `src/lib/oauth.ts` — Custom Authentication

PingFlow uses a **custom OAuth implementation** instead of a library like NextAuth. Let's look at how it works line by line.

### Part 1: Generating the Login URL

```typescript
export function getGoogleOAuthURL(): string {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

    const options = {
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    }

    const qs = new URLSearchParams(options)
    return `${rootUrl}?${qs.toString()}`
}
```
- `rootUrl` — Google's official login page.
- `redirect_uri` — Where Google should send the user BACK to after they log in.
- `client_id` — Our public ID. It tells Google "PingFlow is asking for permission."
- `response_type: 'code'` — We want an Authorization Code back, not the final token (this is the most secure flow).
- `scope` — Exactly what we are asking to see. Here, just their public profile and email address. We don't ask to read their Gmail inbox!
- `URLSearchParams` — Formats the object into a query string: `?client_id=123&redirect_uri=...`

When a user clicks "Log in with Google", we just redirect their browser to the URL this function returns.

### Part 2: Handling the Callback

When the user comes back from Google, the URL looks like this:
`https://pingflow.konhito.me/api/auth/google/callback?code=SECRET_CODE_123`

```typescript
export async function getGoogleUser(code: string): Promise<GoogleUserInfo> {
    const tokenUrl = 'https://oauth2.googleapis.com/token'

    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
    }
```
- We take that `code` and prepare to send it BACK to Google.
- **CRITICAL:** Notice we now include `client_secret`. This is a password only our server knows. This step happens server-to-server, so the user never sees this secret.

```typescript
    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(values),
    })
    const tokens: GoogleTokenResponse = await tokenResponse.json()
```
- We POST the code and secret to Google.
- Google replies with an `access_token`. This token is like a 1-hour VIP pass to the user's data.

```typescript
    // Get user info
    const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    )
    return userInfoResponse.json()
}
```
- Finally, we use the `access_token` to ask Google: "Who does this token belong to?"
- Google replies with `{ "name": "Alice", "email": "alice@gmail.com" }`.
- We save Alice in our PostgreSQL database and log her in!

**(The GitHub OAuth implementation directly below it does the exact same dance, just with GitHub's URLs).**

---

## 📧 `services/email-service/src/index.ts` — The Email Worker

This is a microservice. Its ONLY job is to read events from Kafka and send emails.

```typescript
import { createKafkaClient } from '@pingflow/kafka-client';
import nodemailer from 'nodemailer';
```
- We import Kafka (the conveyor belt) and `nodemailer` (the industry standard Node.js library for sending emails).

```typescript
const transporter = SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    })
    : null;
```
- We create a `transporter`. This is basically an automated email client.
- It logs into an SMTP server (like Gmail or AWS SES) using the username and password we provided via Kubernetes Secrets.
- If we forgot to provide credentials, `transporter` is `null` — we'll run in "mock mode" (just logging).

### Subscribing to the Queue

Skip down to the bottom of the file to see how it starts:

```typescript
async function startEmailService() {
    await kafka.subscribe(
        'email-service-group',
        [KafkaTopics.NOTIFICATIONS_EMAIL],
        async ({ message }) => {
            const event: KafkaEvent = JSON.parse(message.value!.toString());
            await handleEmailNotification(event);
        }
    );
}
```
- `kafka.subscribe` — The service connects to the Kafka queue and says "Wake me up whenever a `NOTIFICATIONS_EMAIL` message arrives."
- **Consumer Group**: It uses `'email-service-group'`. This is a magic Kafka feature. If we run 3 instances of the email service, Kafka ensures each email is only sent by ONE instance. They share the workload!

### Processing the Email

When a message arrives, `handleEmailNotification` is called:

```typescript
async function handleEmailNotification(event: KafkaEvent) {
    const { category, fields, timestamp } = event;
    const subject = `${category.emoji} ${category.name}`;
```
- We pull apart the JSON event.
- The Subject line is built dynamically (e.g., "💰 New Sale").

```typescript
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${category.color};">${category.emoji} ${category.name}</h2>
        ...
```
- We build an HTML email. CSS inside emails is notoriously terrible, which is why everything uses inline styles (`style="..."`).

```typescript
    const recipientEmail = fields.email || fields.recipient || fields.to;
```
- Smart parsing: It looks at the custom data `fields` you sent in your event. It checks for a field named `email`, `recipient`, or `to` to figure out who to send this alert to.

```typescript
    if (transporter) {
        // Send real email
        const info = await transporter.sendMail({
            from: FROM_EMAIL,
            to: recipientEmail as string,
            subject,
            text: textBody,
            html: htmlBody,
        });
        logger.info({ messageId: info.messageId }, 'Email sent successfully');
```
- We call `transporter.sendMail()`. This actually talks to the SMTP server and hands off the email for delivery over the internet.
- Notice we send BOTH `text` and `html`. A good email includes a plain-text fallback for watches and people who block HTML emails.

---

## 🎉 You Finished!

You now understand:
1. **Architecture & Docker** (Containers and Microservices)
2. **Hono & API Gateway** (Routing and validating requests)
3. **Kubernetes** (Orchestrating the containers)
4. **ArgoCD & GitHub Actions** (Automating deployment safely)
5. **OAuth & EmailService** (Security and asynchronous workers)

You're a PingFlow expert now! 🚀



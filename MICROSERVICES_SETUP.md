# PingFlow Microservices - Quick Start Guide

## 🚀 Getting Started

This guide will help you set up and run the PingFlow microservices architecture locally.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ and npm/pnpm
- PostgreSQL (or use Docker)
- (Optional) EC2 instance for WhatsApp service

## 📁 Project Structure

```
pingflow/
├── docker-compose.yml          # All services orchestration
├── .env.microservices          # Environment variables
├── services/
│   ├── event-producer/         # Consumes events, routes to services
│   ├── dashboard-service/      # WebSocket server for real-time updates
│   ├── discord-service/        # Discord webhook notifications
│   ├── whatsapp-service/       # WhatsApp via whatscli API
│   └── telegram-service/       # Telegram bot notifications
└── packages/
    ├── shared-types/           # TypeScript types
    ├── logger/                 # Structured logging
    └── kafka-client/           # Kafka wrapper
```

## 🔧 Setup Instructions

### Step 1: Install Dependencies

```bash
# Install dependencies for all packages
cd packages/shared-types && npm install && npm run build && cd ../..
cd packages/logger && npm install && npm run build && cd ../..
cd packages/kafka-client && npm install && npm run build && cd ../..

# Install dependencies for all services
cd services/event-producer && npm install && cd ../..
cd services/dashboard-service && npm install && cd ../..
cd services/discord-service && npm install && cd ../..
cd services/whatsapp-service && npm install && cd ../..
cd services/telegram-service && npm install && cd ../..
```

### Step 2: Configure Environment Variables

```bash
# Copy the environment template
cp .env.microservices .env

# Edit .env and add your credentials:
# - TELEGRAM_BOT_TOKEN (get from @BotFather)
# - WHATSAPP_API_URL (your EC2 instance URL)
```

### Step 3: Start Infrastructure Services

```bash
# Start Kafka, Zookeeper, PostgreSQL, Redis
docker-compose up -d zookeeper kafka kafka-ui postgresql redis

# Wait for services to be ready (about 30 seconds)
docker-compose logs -f kafka
```

### Step 4: Run Database Migrations

```bash
# Run Prisma migrations
cd services/event-producer
npx prisma migrate dev
cd ../..
```

### Step 5: Start Microservices

**Option A: Using Docker Compose (Recommended)**

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f
```

**Option B: Run Services Locally (Development)**

```bash
# Terminal 1: Event Producer
cd services/event-producer
npm run dev

# Terminal 2: Dashboard Service
cd services/dashboard-service
npm run dev

# Terminal 3: Discord Service
cd services/discord-service
npm run dev

# Terminal 4: WhatsApp Service
cd services/whatsapp-service
npm run dev

# Terminal 5: Telegram Service
cd services/telegram-service
npm run dev
```

## 🔍 Verify Setup

### Check Kafka UI
Open http://localhost:8080 to view Kafka topics and messages

### Check Service Health
```bash
# Dashboard service
curl http://localhost:3002/health

# Check Docker containers
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f discord-service
```

## 📊 Kafka Topics

The following topics are automatically created:

- `events.incoming` - Raw events from API
- `events.processed` - Validated events
- `notifications.discord` - Discord notifications
- `notifications.whatsapp` - WhatsApp notifications
- `notifications.telegram` - Telegram notifications
- `notifications.status` - Delivery status updates
- `events.failed` - Failed events (DLQ)

## 🧪 Testing the System

### 1. Publish a Test Event

```bash
# Using Kafka console producer
docker exec -it pingflow-kafka kafka-console-producer \
  --bootstrap-server localhost:9092 \
  --topic events.incoming

# Paste this JSON:
{
  "eventId": "test-123",
  "userId": "user-1",
  "category": {
    "id": "cat-1",
    "name": "Test Event",
    "emoji": "🎉",
    "color": "#FF5733"
  },
  "fields": {
    "amount": 49.99,
    "email": "test@example.com"
  },
  "timestamp": "2024-02-16T12:00:00Z"
}
```

### 2. Monitor Logs

```bash
# Watch Event Producer process the event
docker-compose logs -f event-producer

# Watch notification services
docker-compose logs -f discord-service whatsapp-service telegram-service
```

## 🛠️ Common Commands

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Rebuild specific service
docker-compose up -d --build discord-service

# View resource usage
docker stats

# Access Kafka container
docker exec -it pingflow-kafka bash

# Access PostgreSQL
docker exec -it pingflow-postgres psql -U postgres -d pingflow
```

## 🐛 Troubleshooting

### Kafka not starting
```bash
# Check if ports are in use
lsof -i :9092
lsof -i :2181

# Restart Kafka
docker-compose restart kafka zookeeper
```

### Service can't connect to Kafka
```bash
# Check network
docker network ls
docker network inspect pingflow_pingflow-network

# Verify Kafka is accessible
docker exec -it pingflow-kafka kafka-broker-api-versions \
  --bootstrap-server localhost:9092
```

### Database connection issues
```bash
# Check PostgreSQL logs
docker-compose logs postgresql

# Verify connection
docker exec -it pingflow-postgres psql -U postgres -c "SELECT 1"
```

## 📝 Next Steps

1. **Set up WhatsApp**: Follow EC2 setup guide in `updated_architecture.md`
2. **Configure Telegram Bot**: Get token from @BotFather
3. **Integrate with Next.js**: Update API routes to publish to Kafka
4. **Add Monitoring**: Set up Prometheus and Grafana
5. **Deploy to Production**: Use Kubernetes manifests

## 🔗 Useful Links

- Kafka UI: http://localhost:8080
- Dashboard WebSocket: ws://localhost:3002
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## 💡 Tips

- Use Kafka UI to debug message flow
- Check service logs for detailed error messages
- Monitor Redis for WebSocket session management
- Use Bull UI for queue monitoring (optional)

Happy coding! 🚀

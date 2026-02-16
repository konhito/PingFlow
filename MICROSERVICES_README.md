# PingFlow Microservices - README

## 📚 Overview

PingFlow has been transformed from a monolithic Next.js application into a **microservices architecture** with event-driven communication using Apache Kafka.

## 🏗️ Architecture

```
Client → API Gateway → Kafka → Microservices → External APIs
                         ↓
                    Dashboard (WebSocket)
```

## 📦 Services

### Infrastructure Services
- **Kafka + Zookeeper**: Message broker for event streaming
- **PostgreSQL**: Event and user data storage
- **Redis**: Caching and Bull queue backend
- **Kafka UI**: Web interface for Kafka debugging (port 8080)

### Application Services
- **Event Producer**: Consumes incoming events, stores in DB, routes to notification services
- **Dashboard Service**: WebSocket server for real-time dashboard updates
- **Discord Service**: Sends notifications via Discord webhooks
- **WhatsApp Service**: Sends notifications via whatscli API (EC2)
- **Telegram Service**: Sends notifications via Telegram Bot API

### Shared Packages
- **@pingflow/shared-types**: TypeScript types and interfaces
- **@pingflow/logger**: Structured logging with Pino
- **@pingflow/kafka-client**: Kafka producer/consumer wrapper

## 🚀 Quick Start

```bash
# 1. Install dependencies for packages
cd packages/shared-types && npm install && npm run build && cd ../..
cd packages/logger && npm install && npm run build && cd ../..
cd packages/kafka-client && npm install && npm run build && cd ../..

# 2. Start all services
docker-compose up -d

# 3. View logs
docker-compose logs -f

# 4. Access Kafka UI
open http://localhost:8080
```

## 📊 Kafka Topics

| Topic | Purpose | Producers | Consumers |
|-------|---------|-----------|-----------|
| `events.incoming` | Raw events from API | API Gateway | Event Producer, Dashboard |
| `events.processed` | Validated events | Event Producer | Analytics |
| `notifications.discord` | Discord notifications | Event Producer | Discord Service |
| `notifications.whatsapp` | WhatsApp notifications | Event Producer | WhatsApp Service |
| `notifications.telegram` | Telegram notifications | Event Producer | Telegram Service |
| `notifications.status` | Delivery status | All notification services | Dashboard Service |
| `events.failed` | Failed events (DLQ) | All services | Monitoring |

## 🔧 Configuration

### Environment Variables

Create `.env` file in the root directory:

```env
# Kafka
KAFKA_BROKERS=localhost:29092

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pingflow

# Redis
REDIS_URL=redis://localhost:6379

# WhatsApp (EC2 instance)
WHATSAPP_API_URL=http://YOUR_EC2_IP:3001

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

## 🧪 Testing

### Publish Test Event to Kafka

```bash
docker exec -it pingflow-kafka kafka-console-producer \
  --bootstrap-server localhost:9092 \
  --topic events.incoming
```

Paste this JSON:
```json
{
  "eventId": "test-123",
  "userId": "user-1",
  "category": {
    "id": "cat-1",
    "name": "Test Sale",
    "emoji": "💰",
    "color": "#00FF00"
  },
  "fields": {
    "amount": 99.99,
    "email": "customer@example.com"
  },
  "timestamp": "2024-02-16T12:00:00Z"
}
```

### Monitor Event Flow

```bash
# Watch Event Producer
docker-compose logs -f event-producer

# Watch Notification Services
docker-compose logs -f discord-service whatsapp-service telegram-service

# Watch Dashboard Service
docker-compose logs -f dashboard-service
```

## 📁 Project Structure

```
pingflow/
├── docker-compose.yml
├── .env.microservices
├── services/
│   ├── event-producer/
│   │   ├── src/index.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── dashboard-service/
│   ├── discord-service/
│   ├── whatsapp-service/
│   └── telegram-service/
└── packages/
    ├── shared-types/
    ├── logger/
    └── kafka-client/
```

## 🔍 Monitoring

- **Kafka UI**: http://localhost:8080
- **Dashboard WebSocket**: ws://localhost:3002
- **Service Health**: `curl http://localhost:3002/health`

## 🛠️ Development

### Run Services Locally

```bash
# Terminal 1: Event Producer
cd services/event-producer && npm run dev

# Terminal 2: Dashboard Service
cd services/dashboard-service && npm run dev

# Terminal 3: Discord Service
cd services/discord-service && npm run dev

# Terminal 4: WhatsApp Service
cd services/whatsapp-service && npm run dev

# Terminal 5: Telegram Service
cd services/telegram-service && npm run dev
```

### Rebuild Specific Service

```bash
docker-compose up -d --build discord-service
```

## 📖 Documentation

- [Setup Guide](./MICROSERVICES_SETUP.md) - Detailed setup instructions
- [Architecture](./updated_architecture.md) - Architecture design and decisions
- [WhatsApp Service](./whatsapp_service_design.md) - WhatsApp integration details

## 🐛 Troubleshooting

See [MICROSERVICES_SETUP.md](./MICROSERVICES_SETUP.md#troubleshooting) for common issues and solutions.

## 🎯 Next Steps

1. ✅ Infrastructure setup complete
2. ✅ All microservices implemented
3. 🔄 Integrate with Next.js API Gateway
4. ⏳ Set up monitoring (Prometheus + Grafana)
5. ⏳ Deploy to Kubernetes
6. ⏳ Set up CI/CD pipeline

## 📝 License

MIT

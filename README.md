<div align="center">

# PingFlow

<img src="https://i.giphy.com/901mxGLGQN2PyCQpoc.webp" width="300" alt="PingFlow" />

**Real-Time SaaS Event Notifications - Delivered to Your Favorite Messaging Platforms**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-3.6-231F20?style=for-the-badge&logo=apachekafka)](https://kafka.apache.org/)
[![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Neon](https://img.shields.io/badge/Neon-Postgres-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Features](#features) • [Architecture](#architecture) • [Quick Start](#quick-start) • [API Documentation](#api-documentation) • [Integrations](#integrations)

</div>

---

## About

**PingFlow** is a powerful, real-time event monitoring service that sends instant notifications about critical SaaS events directly to your preferred messaging platform. Track sales, user signups, milestones, and any custom events with beautiful, formatted messages.

Now re-engineered with a **Microservices Architecture** for high scalability and reliability.

---

## Features

### Core Features

- **Event Tracking** - Monitor any event in your SaaS application via REST API
- **Real-Time Delivery** - Events are streamed via Kafka and processed instantly
- **Multi-Channel Support** - Discord, WhatsApp, Telegram, and Email integrations
- **Custom Categories** - Organize events with emojis and colors
- **Rich Notifications** - Beautifully formatted messages with custom fields
- **Rolling Sessions** - smart authentication that keeps active users logged in
- **Usage Quotas** - Track monthly event usage with automatic limiting

### Messaging Integrations

- **WhatsApp**: Direct message delivery via WhatsApp Business API
- **Telegram**: Rich text notifications via Telegram Bot
- **Discord**: Beautiful embed messages sent to DMs
- **Email**: HTML-formatted email notifications via SMTP

---

## Architecture

PingFlow uses an event-driven microservices architecture powered by Apache Kafka.

```mermaid
graph LR
    Client[Client App] -->|POST /events| Gateway[API Gateway (Next.js)]
    Gateway -->|Produces| Topic1[Kafka: events.incoming]
    
    Topic1 -->|Consumes| Producer[Event Producer Service]
    Producer -->|Validates & Stores| DB[(PostgreSQL)]
    Producer -->|Routes| Topic2[Kafka: notifications.*]
    
    Topic2 -->|Consumes| Discord[Discord Service]
    Topic2 -->|Consumes| WhatsApp[WhatsApp Service]
    Topic2 -->|Consumes| Telegram[Telegram Service]
    
    Discord -->|Sends| DiscordAPI[Discord API]
    WhatsApp -->|Sends| WhatsAppAPI[WhatsApp API]
    Telegram -->|Sends| TelegramAPI[Telegram API]
    
    Producer -->|Updates| Topic3[Kafka: events.processed]
    Topic3 -->|Consumes| Dashboard[Dashboard Service]
    Dashboard -->|WebSocket| Browser[User Dashboard]
```

### Services Overview

| Service | Description | Tech Stack |
|---------|-------------|------------|
| **API Gateway** | Entry point, Authentication, Rate Limiting | Next.js, Hono |
| **Event Producer** | Core logic, validation, routing | Node.js, KafkaJS, Prisma |
| **Discord Service** | Handles Discord notifications | Node.js, discord.js |
| **WhatsApp Service** | Handles WhatsApp notifications | Node.js, whatscli |
| **Telegram Service** | Handles Telegram notifications | Node.js, telegraf |
| **Email Service** | Handles Email notifications | Node.js, Nodemailer |
| **Dashboard Service** | Real-time updates via WebSockets | Node.js, Socket.io |

---

## Tech Stack

- **Frontend/Gateway:** [Next.js 14](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/)
- **Backend Services:** Node.js, TypeScript
- **Message Broker:** [Apache Kafka](https://kafka.apache.org/) (running on Docker)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Neon), [Redis](https://redis.io/) (Caching)
- **Authentication:** Custom JWT (Access/Refresh Tokens) with OAuth (Google, GitHub)
- **Infrastructure:** Docker Compose

---

## Project Structure

This is a monorepo managed with `pnpm workspaces`.

```
pingflow/
├── packages/                  # Shared libraries
│   ├── kafka-client/         # Kafka producer/consumer wrappers
│   ├── logger/               # Structured logging (Pino)
│   └── shared-types/         # Zod schemas & TypeScript interfaces
│
├── services/                  # Microservices
│   ├── dashboard-service/    # Real-time WebSocket server
│   ├── discord-service/      # Discord notification consumer
│   ├── event-producer/       # Main event router & validator
│   ├── telegram-service/     # Telegram notification consumer
│   └── whatsapp-service/     # WhatsApp notification consumer
│
├── src/                       # Next.js App (Frontend + API Gateway)
│   ├── app/                  # App Router
│   ├── lib/                  # Shared utilities
│   └── middleware.ts         # Auth & Routing Middleware
│
├── docker-compose.yml         # Local development infrastructure
├── neon_schema.sql           # Database schema
└── pnpm-workspace.yaml       # Workspace configuration
```

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ & pnpm
- PostgreSQL Database (Local or Neon)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/konhito/pingflow
   cd pingflow
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Update .env with your credentials (DB, OAuth, etc.)
   ```

3. **Install Dependencies**
   ```bash
   pnpm install
   ```

4. **Start Infrastructure (Kafka, Zookeeper, Redis)**
   ```bash
   docker-compose up -d
   ```

5. **Run Database Migrations**
   ```bash
   pnpm prisma migrate dev
   ```

6. **Start Development Server**
   ```bash
   pnpm dev
   ```
   This will start the Next.js gateway and all microservices concurrently.

---

## API Documentation

### Authentication

All API requests require a Bearer token (your API Key).

```http
Authorization: Bearer ping_123456789
```

### Endpoints

#### `POST /api/v1/events`

Send a new event notification.

**Body:**
```json
{
  "category": "sale",
  "fields": {
    "amount": 99.00,
    "plan": "PRO",
    "email": "user@example.com"
  }
}
```

**Response:**
```json
{ "success": true, "eventId": "evt_clx123..." }
```

---

## Integrations

### Discord
1. Add the PingFlow bot to your server.
2. In Dashboard, provide your **User ID** or **Channel ID**.
3. Events will be sent as rich embeds.

### WhatsApp
1. Connect your number via the Dashboard.
2. Verify ownership.
3. Receive instant messages.

### Telegram
1. Start a chat with the PingFlow bot.
2. Send `/start` to link your account.
3. Receive formatted event logs.

---

## Contributing

Contributions are welcome! Please follow the [Contributing Guidelines](CONTRIBUTING.md).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
  <strong>Made with ❤️ by konhito</strong>
</div>

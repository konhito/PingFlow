<div align="center">

# PingFlow

<img src="https://i.giphy.com/901mxGLGQN2PyCQpoc.webp" width="300" alt="PingFlow" />

**Real-Time SaaS Event Notifications - Delivered to Your Favorite Messaging Platforms**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.18-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-0.1.0-orange?style=for-the-badge)](package.json)

[Features](#features) • [Quick Start](#quick-start) • [API Documentation](#api-documentation) • [Integrations](#integrations) • [Contributing](#contributing)

</div>

---
## Architecture & Flow

<div align="center">
   
<img src="./public/Gemini_Generated_Image_w8tofgw8tofgw8to.png" width="800" alt="PingFlow" />
</div>



## About

**PingFlow** is a powerful, real-time event monitoring service that sends instant notifications about critical SaaS events directly to your preferred messaging platform. Track sales, user signups, milestones, and any custom events with beautiful, formatted messages.

### Why PingFlow?

- **Real-Time Alerts** - Get notified the moment events happen
- **Multi-Platform Support** - Discord, WhatsApp, and Telegram
- **Customizable Categories** - Organize events with emojis, colors, and custom fields
- **Simple Pricing** - Free tier available, one-time payment for Pro
- **Easy Integration** - Simple REST API, works with any language
- **Usage Tracking** - Monitor your event usage and quotas

---

## Features

### Core Features

- **Event Tracking** - Monitor any event in your SaaS application
- **Custom Categories** - Create unlimited event categories with custom emojis and colors
- **Rich Notifications** - Beautiful formatted messages with custom fields
- **Usage Quotas** - Track monthly event usage with automatic quota management
- **API Key Authentication** - Secure API access with bearer token authentication
- **Dashboard** - Beautiful web interface to manage categories and view events
- **Dark Mode** - Full dark mode support

### **Messaging Platform Integrations**

#### **WhatsApp Integration** NEW
Send real-time notifications directly to WhatsApp! PingFlow supports WhatsApp Business API integration, allowing you to receive instant alerts on your phone or WhatsApp Web.

**Features:**
- Direct WhatsApp message delivery
- Rich message formatting
- Support for media attachments
- Group chat support
- Read receipts and delivery status

#### **Telegram Integration** NEW
Get instant notifications on Telegram! PingFlow integrates seamlessly with Telegram Bot API, delivering your events as formatted messages.

**Features:**
- Telegram Bot integration
- Rich text formatting
- Inline buttons and interactive messages
- Channel and group support
- Delivery confirmation

#### **Discord Integration**
Send notifications to Discord DMs with beautiful embed messages. Perfect for developers and teams already using Discord.

**Features:**
- Discord DM notifications
- Rich embed messages
- Custom colors and emojis
- Field-based message layout

---

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Discord Bot Token (for Discord integration)
- WhatsApp Business API credentials (for WhatsApp integration)
- Telegram Bot Token (for Telegram integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/konhito/pingflow
   cd pingflow
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pingflow"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   DISCORD_BOT_TOKEN="your_discord_bot_token"
   WHATSAPP_API_KEY="your_whatsapp_api_key"
   TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
   STRIPE_SECRET_KEY="your_stripe_secret_key"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   ```

4. **Run database migrations**
   ```bash
   pnpm prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## API Documentation

### Base URL

```
https://your-domain.com/api/v1
```

### Authentication

All API requests require authentication using a Bearer token:

```http
Authorization: Bearer YOUR_API_KEY
```

### Create Event

Send a new event notification.

**Endpoint:** `POST /events`

**Request Body:**
```json
{
  "category": "sale",
  "fields": {
    "amount": 49.00,
    "email": "customer@example.com",
    "plan": "PRO"
  },
  "description": "Optional custom description"
}
```

**Response:**
```json
{
  "message": "Event processed successfully",
  "eventId": "clx1234567890"
}
```

**Example (JavaScript):**
```javascript
const response = await fetch('https://your-domain.com/api/v1/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    category: 'sale',
    fields: {
      amount: 49.00,
      email: 'customer@example.com',
      plan: 'PRO'
    }
  })
});

const data = await response.json();
console.log(data);
```

**Example (Python):**
```python
import requests

url = "https://your-domain.com/api/v1/events"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "category": "sale",
    "fields": {
        "amount": 49.00,
        "email": "customer@example.com",
        "plan": "PRO"
    }
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

**Example (cURL):**
```bash
curl -X POST https://your-domain.com/api/v1/events \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "sale",
    "fields": {
      "amount": 49.00,
      "email": "customer@example.com",
      "plan": "PRO"
    }
  }'
```

### Error Responses

| Status Code | Description |
|------------|-------------|
| 400 | Bad Request - Invalid JSON or missing required fields |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - Discord/WhatsApp/Telegram ID not configured |
| 404 | Not Found - Category does not exist |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Monthly quota exceeded |
| 500 | Internal Server Error - Server error |

---

## Integrations

### Setting Up WhatsApp Integration

1. **Get WhatsApp Business API Access**
   - Sign up for WhatsApp Business API (via Meta Business or a provider like Twilio)
   - Obtain your API credentials

2. **Configure in PingFlow**
   - Go to Account Settings
   - Enter your WhatsApp number or API credentials
   - Verify your number

3. **Start Receiving Notifications**
   - All events will now be sent to your WhatsApp number
   - Messages include rich formatting and custom fields

### Setting Up Telegram Integration

1. **Create a Telegram Bot**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Use `/newbot` command to create a bot
   - Save your bot token

2. **Configure in PingFlow**
   - Go to Account Settings
   - Enter your Telegram Bot Token
   - Start a conversation with your bot
   - Send `/start` to your bot

3. **Start Receiving Notifications**
   - All events will be sent to your Telegram chat
   - Messages support rich formatting and interactive buttons

### Setting Up Discord Integration

1. **Create a Discord Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to "Bot" section and create a bot
   - Copy the bot token

2. **Configure in PingFlow**
   - Go to Account Settings
   - Enter your Discord User ID
   - The bot will send DMs to this ID

3. **Start Receiving Notifications**
   - All events will be sent as Discord DM embeds

---

## Pricing

### Free Plan
- 100 events per month
- 3 event categories
- Basic support

### Pro Plan - $49 (One-time payment)
- 1,000 events per month
- 10 event categories
- Priority support
- Lifetime access
- All integrations (Discord, WhatsApp, Telegram)

[View Pricing →](https://your-domain.com/pricing)

---

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **API:** REST API with [Hono](https://hono.dev/)
- **State Management:** [TanStack Query](https://tanstack.com/query)

---

## Project Structure

```
pingflow/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (landing)/        # Landing pages
│   │   ├── api/              # API routes
│   │   └── dashboard/         # Dashboard pages
│   ├── components/            # React components
│   ├── lib/                   # Utility libraries
│   ├── server/                # Server-side code (tRPC)
│   └── hooks/                 # React hooks
├── package.json
└── README.md
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Prisma](https://www.prisma.io/) for the excellent ORM
- [Clerk](https://clerk.com/) for authentication
- [Radix UI](https://www.radix-ui.com/) for accessible components

---

## Support

- Email: support@pingflow.com
- Discord: [Join our Discord](https://discord.gg/pingflow)
- Documentation: [docs.pingflow.com](https://docs.pingflow.com)
- Issues: [GitHub Issues](https://github.com/konhito/pingflow/issues)

---

<div align="center">

**Made with love by the PingFlow team**

[Star us on GitHub](https://github.com/konhito/pingflow) • [Follow us on Twitter](https://x.com/otihnok) • [Connect on LinkedIn](https://www.linkedin.com/in/konhito)

</div>


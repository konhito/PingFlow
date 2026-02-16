# Database Schema Fix - ALL Missing User Columns

## Problem
Your production database is missing multiple columns in the `User` table, causing errors like:
- `The column User.password does not exist`
- `The column User.avatar does not exist`
- etc.

## Solution

Run the comprehensive migration script on your Neon database.

### 🚀 Step-by-Step Fix:

1. Go to [Neon Console](https://console.neon.tech/) SQL Editor.
2. Open the file `migration_full_user_fix.sql` from your project.
3. Copy the entire content.
4. Paste it into the Neon SQL Editor and click **Run**.

This script safely adds:
- `name`, `avatar`, `password`
- `provider`, `providerId`, `refreshToken`
- `quotaLimit`, `plan`, `apiKey`
- `discordId`, `whatsappId`, `telegramId`, `notificationEmail`

### Why this happened?
The production database was likely initialized with an older schema before the JWT Authentication and Microservices changes were implemented. This script re-aligns the database with the current `schema.prisma`.

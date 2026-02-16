-- Create Enums (Idempotent)
DO $$ BEGIN
    CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'DELIVERED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'GITHUB', 'EMAIL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "provider" "AuthProvider" NOT NULL,
    "providerId" TEXT NOT NULL,
    "password" TEXT,
    "refreshToken" TEXT,
    "quotaLimit" INTEGER NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "apiKey" TEXT NOT NULL,
    "discordId" TEXT,
    "whatsappId" TEXT,
    "telegramId" TEXT,
    "notificationEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create EventCategory table
CREATE TABLE IF NOT EXISTS "EventCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" INTEGER NOT NULL,
    "emoji" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventCategory_pkey" PRIMARY KEY ("id")
);

-- Create Event table
CREATE TABLE IF NOT EXISTS "Event" (
    "id" TEXT NOT NULL,
    "formattedMessage" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fields" JSONB NOT NULL,
    "deliveryStatus" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventCategoryId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- Create Quota table
CREATE TABLE IF NOT EXISTS "Quota" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quota_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints (CREATE UNIQUE INDEX IF NOT EXISTS is supported in later PG versions, but safe to just wrap in DO block or rely on error if table exists)
-- Better yet, if table exists, usually indexes do too. But let's use IF NOT EXISTS for indexes which is standard in recent PG.

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_apiKey_key" ON "User"("apiKey");
CREATE UNIQUE INDEX IF NOT EXISTS "User_provider_providerId_key" ON "User"("provider", "providerId");
CREATE UNIQUE INDEX IF NOT EXISTS "EventCategory_name_userId_key" ON "EventCategory"("name", "userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Quota_userId_key" ON "Quota"("userId");

-- Create indexes
CREATE INDEX IF NOT EXISTS "User_email_apiKey_idx" ON "User"("email", "apiKey");
CREATE INDEX IF NOT EXISTS "Event_createdAt_idx" ON "Event"("createdAt");

-- Add foreign key constraints (Idempotent check)
DO $$ BEGIN
    ALTER TABLE "EventCategory" ADD CONSTRAINT "EventCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "Event" ADD CONSTRAINT "Event_eventCategoryId_fkey" FOREIGN KEY ("eventCategoryId") REFERENCES "EventCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "Quota" ADD CONSTRAINT "Quota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Comprehensive Migration: Align User table with Prisma schema
-- This script safely adds EVERY column that might be missing from the User table

-- 1. Create AuthProvider enum if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AuthProvider') THEN
        CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'GITHUB', 'EMAIL');
    END IF;
END $$;

-- 2. Create Plan enum if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Plan') THEN
        CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');
    END IF;
END $$;

-- 3. Safely add columns to User table
DO $$ 
BEGIN
    -- Basic Info
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'name') THEN
        ALTER TABLE "User" ADD COLUMN "name" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'avatar') THEN
        ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
    END IF;

    -- Auth Provider Info
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'provider') THEN
        ALTER TABLE "User" ADD COLUMN "provider" "AuthProvider" NOT NULL DEFAULT 'EMAIL';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'providerId') THEN
        ALTER TABLE "User" ADD COLUMN "providerId" TEXT NOT NULL DEFAULT '';
    END IF;

    -- Credentials & Session
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'password') THEN
        ALTER TABLE "User" ADD COLUMN "password" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'refreshToken') THEN
        ALTER TABLE "User" ADD COLUMN "refreshToken" TEXT;
    END IF;

    -- Quotas & Plan
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'quotaLimit') THEN
        ALTER TABLE "User" ADD COLUMN "quotaLimit" INTEGER NOT NULL DEFAULT 100;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'plan') THEN
        ALTER TABLE "User" ADD COLUMN "plan" "Plan" NOT NULL DEFAULT 'FREE';
    END IF;

    -- API & Integrations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'apiKey') THEN
        ALTER TABLE "User" ADD COLUMN "apiKey" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'discordId') THEN
        ALTER TABLE "User" ADD COLUMN "discordId" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'whatsappId') THEN
        ALTER TABLE "User" ADD COLUMN "whatsappId" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'telegramId') THEN
        ALTER TABLE "User" ADD COLUMN "telegramId" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'notificationEmail') THEN
        ALTER TABLE "User" ADD COLUMN "notificationEmail" TEXT;
    END IF;

    RAISE NOTICE 'User table schema alignment completed.';
END $$;

-- 4. Fix data for existing users (idempotent)
UPDATE "User" 
SET "provider" = 'EMAIL', "providerId" = "id" 
WHERE "provider" IS NULL OR "providerId" = '';

-- 5. Add unique indices (idempotent)
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_apiKey_key" ON "User"("apiKey");
CREATE UNIQUE INDEX IF NOT EXISTS "User_provider_providerId_key" ON "User"("provider", "providerId");

-- 6. Verify result
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;

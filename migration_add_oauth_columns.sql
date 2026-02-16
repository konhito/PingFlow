-- Migration: Add missing OAuth columns to User table
-- This fixes the schema mismatch between Prisma schema and production database

-- Create AuthProvider enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'GITHUB', 'EMAIL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add name column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'name'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "name" TEXT;
        RAISE NOTICE 'Column User.name added';
    END IF;
END $$;

-- Add avatar column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'avatar'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
        RAISE NOTICE 'Column User.avatar added';
    END IF;
END $$;

-- Add provider column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'provider'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "provider" "AuthProvider" NOT NULL DEFAULT 'EMAIL';
        RAISE NOTICE 'Column User.provider added';
    END IF;
END $$;

-- Add providerId column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'providerId'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "providerId" TEXT NOT NULL DEFAULT '';
        RAISE NOTICE 'Column User.providerId added';
    END IF;
END $$;

-- Add refreshToken column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'refreshToken'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "refreshToken" TEXT;
        RAISE NOTICE 'Column User.refreshToken added';
    END IF;
END $$;

-- Update existing users to have provider and providerId
UPDATE "User" 
SET "provider" = 'EMAIL', "providerId" = "id"
WHERE "provider" IS NULL OR "providerId" = '';

-- Add unique constraint on provider + providerId
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'User_provider_providerId_key'
    ) THEN
        CREATE UNIQUE INDEX "User_provider_providerId_key" ON "User"("provider", "providerId");
        RAISE NOTICE 'Unique constraint User_provider_providerId_key added';
    END IF;
END $$;

-- Verify all columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;

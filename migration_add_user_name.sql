-- Migration: Add missing User.name column
-- This fixes the schema mismatch between Prisma schema and production database

-- Add name column to User table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'name'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "name" TEXT;
        RAISE NOTICE 'Column User.name added successfully';
    ELSE
        RAISE NOTICE 'Column User.name already exists';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;

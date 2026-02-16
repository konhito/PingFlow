# Database Schema Fix - Missing User.name Column

## Problem
Your production database is missing the `User.name` column, causing sign-up errors:
```
The column `User.name` does not exist in the current database.
```

## Solution

You need to run the migration on your Neon database. Here are three ways to do it:

### Option 1: Using Neon Dashboard (Recommended)

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project: `ep-old-hill-a4vznpu4`
3. Click on "SQL Editor"
4. Copy and paste the contents of `migration_add_user_name.sql`
5. Click "Run"

### Option 2: Using Vercel Postgres (if deployed on Vercel)

If your app is deployed on Vercel:

1. Go to your Vercel project dashboard
2. Navigate to Storage → Your Neon database
3. Click "Query" tab
4. Paste the migration SQL and execute

### Option 3: Install psql locally and run

```bash
# Install PostgreSQL client (macOS)
brew install postgresql

# Run the migration
psql "postgresql://neondb_owner:npg_YSz5ts3uepKA@ep-old-hill-a4vznpu4-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require" -f migration_add_user_name.sql
```

## Migration SQL

The migration is in `migration_add_user_name.sql`:

```sql
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
```

## After Running Migration

1. Verify the column exists by running:
   ```sql
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'User'
   ORDER BY ordinal_position;
   ```

2. Redeploy your application (if needed) or just wait for the next deployment

3. Test sign-up again

## Prevention

To avoid this in the future, always run migrations before deploying:

```bash
# Generate migration
npx prisma migrate dev --name add_user_name

# Apply to production
npx prisma migrate deploy
```

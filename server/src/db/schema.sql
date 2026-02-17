-- Users Table Schema
-- Stores all user accounts with authentication and role information
CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   username VARCHAR (255) UNIQUE NOT NULL,
   password VARCHAR (255) NOT NULL,
   admin BOOLEAN DEFAULT FALSE,  -- Admin flag: FALSE = regular user, TRUE = administrator
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Account creation timestamp
   last_login TIMESTAMP  -- Last successful login timestamp
);

-- Session Table Schema
-- Stores session data for authenticated users (required by express-session)
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

-- Add Primary Key to Session Table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey') THEN
        ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    END IF;
END $$;

-- Add Index on expire column for automatic session cleanup
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
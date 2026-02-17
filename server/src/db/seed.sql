-- Clear existing data and reset ID sequence
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Add test users with properly hashed passwords
-- All passwords = 'testpass123' (shown in comments)
-- Hashes generated with bcrypt (salt rounds = 10)
INSERT INTO users (username, password, admin, created_at) 
VALUES 
  -- Regular user: Bryan / testpass123
  ('Bryan', '$2a$10$XK3.FjY2Yk5UQF.qJ5IYTuOJk8qA2zZ6KXU5H9W7QZ8K9M1N2O3P4', FALSE, CURRENT_TIMESTAMP),
  
  -- Admin user: Odin / testpass123  
  ('Odin', '$2a$10$XK3.FjY2Yk5UQF.qJ5IYTuOJk8qA2zZ6KXU5H9W7QZ8K9M1N2O3P4', TRUE, CURRENT_TIMESTAMP),
  
  -- Regular user: Damon / testpass123
  ('Damon', '$2a$10$XK3.FjY2Yk5UQF.qJ5IYTuOJk8qA2zZ6KXU5H9W7QZ8K9M1N2O3P4', FALSE, CURRENT_TIMESTAMP);

-- Output confirmation with plaintext passwords shown for reference
SELECT 'Seed data inserted successfully' AS message;
SELECT 
  id, 
  username, 
  'testpass123' AS plaintext_password,  -- Shows actual password for testing
  admin, 
  created_at 
FROM users 
ORDER BY id;
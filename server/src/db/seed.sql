TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Add some test users
-- Note: These passwords won't work with bcrypt because they aren't hashed!
INSERT INTO users (username, password) 
VALUES 
  ('Bryan', 'testpass123'),
  ('Odin', 'testpass123'),
  ('Damon', 'testpass123');
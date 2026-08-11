-- ============================================================
-- BookKaroo — Seed 03: Users
-- Run after: 002_cities.sql
-- ============================================================
-- ⚠️  Passwords (BCrypt cost 12, for reference only):
--   admin@bookkaroo.com  → Admin@1234
--   sanjay@bookkaroo.com → Test@1234
--   priya@bookkaroo.com  → Test@1234
--   rahul@bookkaroo.com  → Test@1234
--   ayesha@bookkaroo.com → Test@1234
--   vikram@bookkaroo.com → Test@1234
--
-- These hashes were generated with BCrypt cost 12.
-- In production, change admin password immediately after first login.
-- ============================================================

INSERT INTO users (
  id, email, mobile, password_hash, name, dob, gender,
  city_id, state_code, role, email_verified, preferences
) VALUES
(
  'aaaaaaaa-0001-0001-0001-000000000001',
  'admin@bookkaroo.com',
  '+919900000001',
  '$2b$12$nqvZIPUDGDgeLwYlygutMOXpTEygcVv2AqwVaStIilXF3Ik22rYOG',  -- Admin@1234
  'BookKaroo Admin',
  '1990-01-01',
  'prefer_not',
  '11111111-0001-0001-0001-000000000005',   -- Ahmedabad
  '24',
  'admin',
  true,
  '{"languages":["Hindi","English"],"genres":["Action","Drama"],"notifications":true}'::jsonb
),
(
  'aaaaaaaa-0001-0001-0001-000000000002',
  'sanjay@bookkaroo.com',
  '+919900000002',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC//CBS/Dr/tr.LRSMfe',    -- Test@1234
  'Sanjay Makwana',
  '1995-06-15',
  'male',
  '11111111-0001-0001-0001-000000000005',   -- Ahmedabad
  '24',
  'user',
  true,
  '{"languages":["Hindi","Gujarati","English"],"genres":["Action","Comedy","Thriller"],"notifications":true}'::jsonb
),
(
  'aaaaaaaa-0001-0001-0001-000000000003',
  'priya@bookkaroo.com',
  '+919900000003',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC//CBS/Dr/tr.LRSMfe',
  'Priya Sharma',
  '1998-03-22',
  'female',
  '11111111-0001-0001-0001-000000000001',   -- Mumbai
  '27',
  'user',
  true,
  '{"languages":["Hindi","English"],"genres":["Romance","Drama","Comedy"],"notifications":true}'::jsonb
),
(
  'aaaaaaaa-0001-0001-0001-000000000004',
  'rahul@bookkaroo.com',
  '+919900000004',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC//CBS/Dr/tr.LRSMfe',
  'Rahul Verma',
  '1992-11-08',
  'male',
  '11111111-0001-0001-0001-000000000002',   -- Delhi-NCR
  '07',
  'user',
  true,
  '{"languages":["Hindi","English","Punjabi"],"genres":["Action","Sci-Fi","Thriller"],"notifications":false}'::jsonb
),
(
  'aaaaaaaa-0001-0001-0001-000000000005',
  'ayesha@bookkaroo.com',
  '+919900000005',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC//CBS/Dr/tr.LRSMfe',
  'Ayesha Khan',
  '1996-08-14',
  'female',
  '11111111-0001-0001-0001-000000000003',   -- Bangalore
  '29',
  'user',
  true,
  '{"languages":["Hindi","English","Telugu"],"genres":["Drama","Biography","Musical"],"notifications":true}'::jsonb
),
(
  'aaaaaaaa-0001-0001-0001-000000000006',
  'vikram@bookkaroo.com',
  '+919900000006',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC//CBS/Dr/tr.LRSMfe',
  'Vikram Nair',
  '1988-12-31',
  'male',
  '11111111-0001-0001-0001-000000000012',   -- Kochi
  '32',
  'user',
  true,
  '{"languages":["Malayalam","English","Tamil"],"genres":["Action","Drama","Horror"],"notifications":true}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

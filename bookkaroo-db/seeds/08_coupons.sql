-- ============================================================
-- BookKaroo — Seed 08: Coupons
-- Run after: 001_init.sql
-- ============================================================

INSERT INTO coupons (
  id, code, description, type, value, max_discount, min_order,
  valid_from, valid_to, usage_limit_per_user, total_usage_limit,
  applicable_cities, applicable_movies, applicable_venues, is_active
) VALUES

-- First-time booking offer
(
  'ffffffff-0001-0001-0001-000000000001',
  'FIRSTBOOK',
  'Welcome to BookKaroo! ₹100 off your first booking.',
  'flat',
  100.00,
  NULL,
  200.00,
  '2026-01-01 00:00:00+05:30',
  '2026-12-31 23:59:59+05:30',
  1,
  NULL,  -- unlimited total usage
  '{}',  -- all cities
  '{}',  -- all movies
  '{}',  -- all venues
  true
),

-- 20% off (capped at ₹200) on orders above ₹500
(
  'ffffffff-0001-0001-0001-000000000002',
  'MOVIE20',
  '20% off on ticket orders above ₹500. Max discount ₹200.',
  'percent',
  20.00,
  200.00,
  500.00,
  '2026-05-01 00:00:00+05:30',
  '2026-07-31 23:59:59+05:30',
  3,
  5000,
  '{}',
  '{}',
  '{}',
  true
),

-- Flat ₹450 off for KGF Chapter 2 specifically
(
  'ffffffff-0001-0001-0001-000000000003',
  'KGF450',
  'Flat ₹450 off on KGF: Chapter 2 bookings. Minimum order ₹900.',
  'flat',
  450.00,
  NULL,
  900.00,
  '2026-05-01 00:00:00+05:30',
  '2026-06-30 23:59:59+05:30',
  1,
  2000,
  '{}',
  ARRAY['dddddddd-0001-0001-0001-000000000001']::uuid[],  -- only KGF Ch2
  '{}',
  true
),

-- Cheap Tuesday — flat ₹50 off (Tuesdays only; app enforces day check)
(
  'ffffffff-0001-0001-0001-000000000004',
  'CHEAPTUE',
  'Every Tuesday special! ₹50 off on any booking.',
  'flat',
  50.00,
  NULL,
  150.00,
  '2026-01-01 00:00:00+05:30',
  '2026-12-31 23:59:59+05:30',
  4,    -- 4 uses per user (once per Tuesday for a month)
  NULL,
  '{}',
  '{}',
  '{}',
  true
),

-- Ahmedabad city-specific offer
(
  'ffffffff-0001-0001-0001-000000000005',
  'AHMDVIBE',
  '₹75 off for Ahmedabad moviegoers on orders above ₹300.',
  'flat',
  75.00,
  NULL,
  300.00,
  '2026-05-01 00:00:00+05:30',
  '2026-06-30 23:59:59+05:30',
  2,
  3000,
  ARRAY['11111111-0001-0001-0001-000000000005']::uuid[],  -- Ahmedabad only
  '{}',
  '{}',
  true
)

ON CONFLICT (id) DO NOTHING;

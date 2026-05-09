-- ============================================================
-- BookKaroo — Seed 09: CMS Banners (Home Carousel)
-- Run after: 001_init.sql
-- ============================================================

INSERT INTO cms_banners (id, title, image_url, link_url, position, is_active) VALUES
(
  'bbbbbbcc-0001-0001-0001-000000000001',
  'KGF: Chapter 2 — Now Showing',
  'https://image.tmdb.org/t/p/original/rAiYxVFo7QDk5Sc3UKuOmxUhRnS.jpg',
  '/movies/kgf-chapter-2',
  1,
  true
),
(
  'bbbbbbcc-0001-0001-0001-000000000002',
  'Pushpa 2: The Rule — IMAX Experience',
  'https://image.tmdb.org/t/p/original/jKECXJgLQJxcL7oKkMzNmFAq15e.jpg',
  '/movies/pushpa-2-the-rule',
  2,
  true
),
(
  'bbbbbbcc-0001-0001-0001-000000000003',
  'TATA IPL 2026 — Book Now',
  'https://images.unsplash.com/photo-1540747913346-19212a4b423f?w=1920',
  '/ipl',
  3,
  true
),
(
  'bbbbbbcc-0001-0001-0001-000000000004',
  'Chhaava — The Epic Saga Continues',
  'https://image.tmdb.org/t/p/original/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg',
  '/movies/chhaava',
  4,
  true
),
(
  'bbbbbbcc-0001-0001-0001-000000000005',
  'Arijit Singh Live — The Melody Tour',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920',
  '/events/arijit-singh-live-mumbai-2026',
  5,
  true
)
ON CONFLICT (id) DO NOTHING;

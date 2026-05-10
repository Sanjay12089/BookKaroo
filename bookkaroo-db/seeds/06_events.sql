-- ============================================================
-- BookKaroo — Seed 06: Events (IPL, Concerts, Plays)
-- Run after: 004_venues_screens.sql
-- Note: venue_id NULL = external stadium (non-screen venue)
-- ============================================================

INSERT INTO events (
  id, title, slug, type, description,
  venue_id, event_date, duration_min, language,
  age_restriction, organizer, artists, poster_url,
  price_tiers, status
) VALUES

-- ─── IPL 2026 MATCHES ───────────────────────────────────────────────────

(
  'eeeeeeee-0001-0001-0001-000000000001',
  'IPL 2026: Gujarat Titans vs Mumbai Indians',
  'ipl-2026-gt-vs-mi-may15',
  'ipl',
  'TATA IPL 2026 — Gujarat Titans take on Mumbai Indians at home in a high-stakes group stage clash.',
  NULL,  -- Narendra Modi Stadium (external)
  '2026-05-15 19:30:00+05:30',
  240,
  'Hindi',
  0,
  '{"name":"BCCI","contact":"ipl@bcci.tv","stadium":"Narendra Modi Stadium, Motera, Ahmedabad"}'::jsonb,
  '[{"name":"Gujarat Titans"},{"name":"Mumbai Indians"}]'::jsonb,
  'https://images.unsplash.com/photo-1540747913346-19212a4b423f?w=500',
  '[
    {"name":"General Stand","price":1500,"capacity":5000,"color":"#FFFFFF"},
    {"name":"Premium Stand","price":3500,"capacity":2000,"color":"#C0C0C0"},
    {"name":"Corporate Box","price":8000,"capacity":500,"color":"#FFD700"}
  ]'::jsonb,
  'published'
),
(
  'eeeeeeee-0001-0001-0001-000000000002',
  'IPL 2026: Rajasthan Royals vs Delhi Capitals',
  'ipl-2026-rr-vs-dc-may18',
  'ipl',
  'TATA IPL 2026 — Rajasthan Royals host Delhi Capitals at Sawai Mansingh Stadium.',
  NULL,
  '2026-05-18 19:30:00+05:30',
  240,
  'Hindi',
  0,
  '{"name":"BCCI","contact":"ipl@bcci.tv","stadium":"Sawai Mansingh Stadium, Jaipur"}'::jsonb,
  '[{"name":"Rajasthan Royals"},{"name":"Delhi Capitals"}]'::jsonb,
  'https://images.unsplash.com/photo-1540747913346-19212a4b423f?w=500',
  '[
    {"name":"General Stand","price":1200,"capacity":4000,"color":"#FFFFFF"},
    {"name":"Premium Stand","price":3000,"capacity":1500,"color":"#C0C0C0"},
    {"name":"Pavilion","price":6000,"capacity":300,"color":"#FFD700"}
  ]'::jsonb,
  'published'
),
(
  'eeeeeeee-0001-0001-0001-000000000003',
  'IPL 2026: Mumbai Indians vs Royal Challengers Bengaluru',
  'ipl-2026-mi-vs-rcb-may22',
  'ipl',
  'TATA IPL 2026 — MI vs RCB, the greatest rivalry in IPL history. Wankhede is sold out every time!',
  NULL,
  '2026-05-22 19:30:00+05:30',
  240,
  'Hindi',
  0,
  '{"name":"BCCI","contact":"ipl@bcci.tv","stadium":"Wankhede Stadium, Mumbai"}'::jsonb,
  '[{"name":"Mumbai Indians"},{"name":"Royal Challengers Bengaluru"}]'::jsonb,
  'https://images.unsplash.com/photo-1540747913346-19212a4b423f?w=500',
  '[
    {"name":"General Stand","price":2000,"capacity":6000,"color":"#FFFFFF"},
    {"name":"Upper Tier","price":4500,"capacity":2500,"color":"#C0C0C0"},
    {"name":"Club House","price":12000,"capacity":200,"color":"#FFD700"}
  ]'::jsonb,
  'published'
),
(
  'eeeeeeee-0001-0001-0001-000000000004',
  'IPL 2026: Chennai Super Kings vs Kolkata Knight Riders',
  'ipl-2026-csk-vs-kkr-may25',
  'ipl',
  'TATA IPL 2026 — CSK vs KKR. Thala vs Narine. A classic contest at Chepauk.',
  NULL,
  '2026-05-25 19:30:00+05:30',
  240,
  'Tamil',
  0,
  '{"name":"BCCI","contact":"ipl@bcci.tv","stadium":"M.A. Chidambaram Stadium, Chennai"}'::jsonb,
  '[{"name":"Chennai Super Kings"},{"name":"Kolkata Knight Riders"}]'::jsonb,
  'https://images.unsplash.com/photo-1540747913346-19212a4b423f?w=500',
  '[
    {"name":"General Stand","price":1800,"capacity":5500,"color":"#FFFFFF"},
    {"name":"Premium Stand","price":4000,"capacity":2000,"color":"#C0C0C0"},
    {"name":"VIP Enclosure","price":10000,"capacity":400,"color":"#FFD700"}
  ]'::jsonb,
  'published'
),
(
  'eeeeeeee-0001-0001-0001-000000000005',
  'IPL 2026: Royal Challengers Bengaluru vs Sunrisers Hyderabad',
  'ipl-2026-rcb-vs-srh-may28',
  'ipl',
  'TATA IPL 2026 — RCB vs SRH at Chinnaswamy. An electric atmosphere guaranteed.',
  NULL,
  '2026-05-28 19:30:00+05:30',
  240,
  'Kannada',
  0,
  '{"name":"BCCI","contact":"ipl@bcci.tv","stadium":"M. Chinnaswamy Stadium, Bangalore"}'::jsonb,
  '[{"name":"Royal Challengers Bengaluru"},{"name":"Sunrisers Hyderabad"}]'::jsonb,
  'https://images.unsplash.com/photo-1540747913346-19212a4b423f?w=500',
  '[
    {"name":"General Stand","price":1500,"capacity":4500,"color":"#FFFFFF"},
    {"name":"Premium Stand","price":3800,"capacity":1800,"color":"#C0C0C0"},
    {"name":"Corporate Box","price":9000,"capacity":350,"color":"#FFD700"}
  ]'::jsonb,
  'published'
),

-- ─── CONCERTS ────────────────────────────────────────────────────────────

(
  'eeeeeeee-0001-0001-0001-000000000006',
  'Arijit Singh Live — The Melody Tour',
  'arijit-singh-live-mumbai-2026',
  'live_event',
  'India''s most beloved singer Arijit Singh performs his biggest hits live. An unforgettable evening of melodies, emotion, and music.',
  180,
  '11111111-0001-0001-0001-000000000001',
  '2026-05-17 19:00:00+05:30',
  NULL,
  'Hindi',
  0,
  '{"name":"Live Nation India","contact":"events@livenation.in"}'::jsonb,
  '[{"name":"Arijit Singh","type":"Vocalist"}]'::jsonb,
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500',
  '[
    {"name":"Bronze","price":2500,"capacity":3000,"color":"#CD7F32"},
    {"name":"Silver","price":5000,"capacity":1500,"color":"#C0C0C0"},
    {"name":"Gold","price":9000,"capacity":500,"color":"#FFD700"},
    {"name":"Platinum","price":18000,"capacity":100,"color":"#E5E4E2"}
  ]'::jsonb,
  'published'
),
(
  'eeeeeeee-0001-0001-0001-000000000007',
  'Diljit Dosanjh — Dil-Luminati India Tour',
  'diljit-dosanjh-bangalore-2026',
  'live_event',
  'The biggest Punjab superstar brings his sold-out Dil-Luminati tour to Bangalore. Dance, music, and pure energy!',
  150,
  '11111111-0001-0001-0001-000000000003',
  '2026-05-20 20:00:00+05:30',
  NULL,
  'Punjabi',
  0,
  '{"name":"DNA Entertainment Networks","contact":"events@dnanetworks.com"}'::jsonb,
  '[{"name":"Diljit Dosanjh","type":"Artist"}]'::jsonb,
  'https://images.unsplash.com/photo-1501386761578-eaa54b8e2bb0?w=500',
  '[
    {"name":"Bronze","price":2000,"capacity":4000,"color":"#CD7F32"},
    {"name":"Silver","price":4500,"capacity":2000,"color":"#C0C0C0"},
    {"name":"Gold","price":8500,"capacity":800,"color":"#FFD700"},
    {"name":"VIP Pit","price":15000,"capacity":200,"color":"#E5E4E2"}
  ]'::jsonb,
  'published'
),

-- ─── PLAYS ────────────────────────────────────────────────────────────────

(
  'eeeeeeee-0001-0001-0001-000000000008',
  'Tumhari Amrita — 30th Anniversary Tour',
  'tumhari-amrita-mumbai-2026',
  'play',
  'The iconic two-hander starring Shabana Azmi and Farooq Sheikh''s letters comes alive again in this anniversary production. Presented by Motley Productions.',
  100,
  'bbbbbbbb-0001-0001-0001-000000000003',
  '2026-05-16 19:30:00+05:30',
  NULL,
  'Hindi',
  12,
  '{"name":"Motley Productions","contact":"motley@theatre.in"}'::jsonb,
  '[{"name":"Divya Dutta","type":"Lead Actress"},{"name":"Meiyang Chang","type":"Lead Actor"}]'::jsonb,
  'https://images.unsplash.com/photo-1503095396549-807759245b35?w=500',
  '[
    {"name":"Stalls","price":800,"capacity":200,"color":"#FFFFFF"},
    {"name":"Balcony","price":1200,"capacity":100,"color":"#C0C0C0"},
    {"name":"Premium Front","price":2000,"capacity":50,"color":"#FFD700"}
  ]'::jsonb,
  'published'
),
(
  'eeeeeeee-0001-0001-0001-000000000009',
  'Mughal-E-Azam: The Musical',
  'mughal-e-azam-musical-delhi-2026',
  'play',
  'The timeless love story of Prince Salim and Anarkali reimagined as a spectacular musical with 100+ artists, stunning costumes, and live orchestra.',
  150,
  NULL,
  '2026-05-19 18:00:00+05:30',
  NULL,
  'Hindi',
  8,
  '{"name":"Feroz Abbas Khan Productions","stadium":"Siri Fort Auditorium, Delhi"}'::jsonb,
  '[{"name":"Full Ensemble","type":"Cast & Orchestra"}]'::jsonb,
  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500',
  '[
    {"name":"Stalls A","price":1500,"capacity":300,"color":"#FFFFFF"},
    {"name":"Stalls B","price":2500,"capacity":200,"color":"#C0C0C0"},
    {"name":"Royal Circle","price":5000,"capacity":80,"color":"#FFD700"}
  ]'::jsonb,
  'published'
),

-- ─── COMEDY ──────────────────────────────────────────────────────────────

(
  'eeeeeeee-0001-0001-0001-000000000010',
  'Zakir Khan: Sakht Launda — Live',
  'zakir-khan-live-ahmedabad-2026',
  'comedy',
  'Stand-up comedian Zakir Khan brings his new live show to Ahmedabad. Expect relatable humour, life stories, and a lot of chai.',
  120,
  'bbbbbbbb-0001-0001-0001-000000000001',
  '2026-05-21 20:00:00+05:30',
  NULL,
  'Hindi',
  16,
  '{"name":"BookKaroo Live","contact":"live@bookkaroo.com"}'::jsonb,
  '[{"name":"Zakir Khan","type":"Comedian"}]'::jsonb,
  'https://images.unsplash.com/photo-1529258283598-8d6fe60b27f4?w=500',
  '[
    {"name":"General","price":799,"capacity":300,"color":"#FFFFFF"},
    {"name":"Premium","price":1499,"capacity":100,"color":"#C0C0C0"}
  ]'::jsonb,
  'published'
)

ON CONFLICT (id) DO NOTHING;

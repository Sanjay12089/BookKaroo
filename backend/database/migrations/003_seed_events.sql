-- ============================================================
-- BookKaroo — Event Seed Data
-- Run this AFTER 002_seed_data.sql
-- Execute in Supabase → SQL Editor
-- ============================================================
-- EventType enum (stored as int):
--   LiveEvent=0, Play=1, Sport=2, Activity=3, Comedy=4, Ipl=5
-- MovieStatus enum (stored as int):
--   Draft=0, Published=1, Archived=2
-- ============================================================

DO $$
DECLARE
  venue_pvr  uuid;
  venue_inox uuid;
  venue_cnp  uuid;
BEGIN
  SELECT "Id" INTO venue_pvr  FROM "Venues" WHERE "Slug" = 'pvr-acropolis-ahmedabad' LIMIT 1;
  SELECT "Id" INTO venue_inox FROM "Venues" WHERE "Slug" = 'inox-iscon-ahmedabad'    LIMIT 1;
  SELECT "Id" INTO venue_cnp  FROM "Venues" WHERE "Slug" = 'cinepolis-pavilion-ahmedabad' LIMIT 1;

  -- ── 5 IPL Matches (Type = 5) ───────────────────────────────
  INSERT INTO "Events" (
    "Id","Title","Slug","Type","Description","VenueId",
    "EventDate","DurationMin","Language","AgeRestriction",
    "Organizer","Artists","PriceTiers","PosterUrl","BackdropUrl",
    "Status","CreatedAt","UpdatedAt","DeletedAt"
  ) VALUES

  (gen_random_uuid(),
   'MI vs CSK · Match 12', 'mi-vs-csk-match-12', 5,
   'The ultimate rivalry — Mumbai Indians face Chennai Super Kings in a clash of titans under the lights at Wankhede.',
   NULL,
   (now() + interval '5 days')::timestamptz, 210, 'Hindi', 5,
   '{"name":"BCCI / TATA IPL"}',
   '[{"name":"Mumbai Indians","type":"Team"},{"name":"Chennai Super Kings","type":"Team"}]',
   '[{"name":"Stand","price":1500,"capacity":5000,"color":"#E11D48"},{"name":"Premium","price":3500,"capacity":2000,"color":"#6366F1"},{"name":"Corporate Box","price":8000,"capacity":500,"color":"#F59E0B"}]',
   'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Mumbai_Indians_Logo.svg/1200px-Mumbai_Indians_Logo.svg.png',
   NULL, 1, now(), now(), NULL),

  (gen_random_uuid(),
   'RCB vs GT · Match 17', 'rcb-vs-gt-match-17', 5,
   'Royal Challengers Bangalore host Gujarat Titans at Chinnaswamy — a battle of form and ambition.',
   NULL,
   (now() + interval '8 days')::timestamptz, 210, 'Hindi', 5,
   '{"name":"BCCI / TATA IPL"}',
   '[{"name":"Royal Challengers Bangalore","type":"Team"},{"name":"Gujarat Titans","type":"Team"}]',
   '[{"name":"Stand","price":1200,"capacity":6000,"color":"#E11D48"},{"name":"Premium","price":3000,"capacity":2500,"color":"#6366F1"},{"name":"Corporate Box","price":7000,"capacity":400,"color":"#F59E0B"}]',
   'https://upload.wikimedia.org/wikipedia/en/2/2a/Royal_Challengers_Bangalore_2020.svg',
   NULL, 1, now(), now(), NULL),

  (gen_random_uuid(),
   'KKR vs DC · Match 21', 'kkr-vs-dc-match-21', 5,
   'Kolkata Knight Riders take on Delhi Capitals at Eden Gardens — home advantage in full force.',
   NULL,
   (now() + interval '12 days')::timestamptz, 210, 'Hindi', 5,
   '{"name":"BCCI / TATA IPL"}',
   '[{"name":"Kolkata Knight Riders","type":"Team"},{"name":"Delhi Capitals","type":"Team"}]',
   '[{"name":"Stand","price":1000,"capacity":8000,"color":"#E11D48"},{"name":"Premium","price":2800,"capacity":3000,"color":"#6366F1"},{"name":"Corporate Box","price":6500,"capacity":600,"color":"#F59E0B"}]',
   NULL, NULL, 1, now(), now(), NULL),

  (gen_random_uuid(),
   'SRH vs PBKS · Match 26', 'srh-vs-pbks-match-26', 5,
   'Sunrisers Hyderabad face Punjab Kings in an explosive batting showdown at Rajiv Gandhi International Stadium.',
   NULL,
   (now() + interval '16 days')::timestamptz, 210, 'Hindi', 5,
   '{"name":"BCCI / TATA IPL"}',
   '[{"name":"Sunrisers Hyderabad","type":"Team"},{"name":"Punjab Kings","type":"Team"}]',
   '[{"name":"Stand","price":900,"capacity":7000,"color":"#E11D48"},{"name":"Premium","price":2500,"capacity":2800,"color":"#6366F1"},{"name":"Corporate Box","price":6000,"capacity":500,"color":"#F59E0B"}]',
   NULL, NULL, 1, now(), now(), NULL),

  (gen_random_uuid(),
   'RR vs LSG · Match 31', 'rr-vs-lsg-match-31', 5,
   'Rajasthan Royals vs Lucknow Super Giants — two ambitious squads collide in a must-watch contest.',
   NULL,
   (now() + interval '20 days')::timestamptz, 210, 'Hindi', 5,
   '{"name":"BCCI / TATA IPL"}',
   '[{"name":"Rajasthan Royals","type":"Team"},{"name":"Lucknow Super Giants","type":"Team"}]',
   '[{"name":"Stand","price":1100,"capacity":5500,"color":"#E11D48"},{"name":"Premium","price":2700,"capacity":2200,"color":"#6366F1"},{"name":"Corporate Box","price":6500,"capacity":450,"color":"#F59E0B"}]',
   NULL, NULL, 1, now(), now(), NULL),

  -- ── 2 Live Events / Concerts (Type = 0) ──────────────────
  (gen_random_uuid(),
   'Arijit Singh Live — The Melody Tour', 'arijit-singh-live-melody-tour', 0,
   'Experience the magic of Arijit Singh live — an unforgettable night of soulful melodies and chart-topping hits.',
   venue_pvr,
   (now() + interval '10 days')::timestamptz, 180, 'Hindi', 5,
   '{"name":"SonyLIV Events","contact":"events@sonyliv.com"}',
   '[{"name":"Arijit Singh","type":"Vocalist"}]',
   '[{"name":"General","price":1499,"capacity":3000,"color":"#E11D48"},{"name":"Gold","price":2999,"capacity":1200,"color":"#F59E0B"},{"name":"Platinum","price":5999,"capacity":400,"color":"#6366F1"}]',
   NULL, NULL, 1, now(), now(), NULL),

  (gen_random_uuid(),
   'AR Rahman · The Legend Live', 'ar-rahman-legend-live', 0,
   'A R Rahman brings his legendary discography to life — from Roja to Slumdog Millionaire, spanning three decades of music.',
   venue_inox,
   (now() + interval '25 days')::timestamptz, 210, 'Hindi', 5,
   '{"name":"BookKaroo Events","contact":"events@bookkaroo.com"}',
   '[{"name":"A R Rahman","type":"Composer / Vocalist"}]',
   '[{"name":"General","price":1999,"capacity":4000,"color":"#E11D48"},{"name":"Gold","price":3999,"capacity":1500,"color":"#F59E0B"},{"name":"Platinum","price":7999,"capacity":500,"color":"#6366F1"}]',
   NULL, NULL, 1, now(), now(), NULL),

  -- ── 1 Play (Type = 1) ──────────────────────────────────────
  (gen_random_uuid(),
   'Mughal-E-Azam The Musical', 'mughal-e-azam-musical', 1,
   'The iconic love story of Salim and Anarkali brought to life in a grand, award-winning Bollywood musical.',
   venue_cnp,
   (now() + interval '7 days')::timestamptz, 150, 'Hindi', 5,
   '{"name":"Feroz Abbas Khan Productions"}',
   '[{"name":"Feroz Abbas Khan","type":"Director"}]',
   '[{"name":"Stalls","price":999,"capacity":500,"color":"#E11D48"},{"name":"Balcony","price":1799,"capacity":300,"color":"#6366F1"},{"name":"Box","price":3499,"capacity":80,"color":"#F59E0B"}]',
   NULL, NULL, 1, now(), now(), NULL),

  -- ── 1 Comedy Show (Type = 4) ───────────────────────────────
  (gen_random_uuid(),
   'Zakir Khan · Haq Se Single Tour', 'zakir-khan-haq-se-single', 4,
   'Zakir Khan is back with his most personal, most hilarious show yet — Haq Se Single. Laugh till it hurts.',
   venue_pvr,
   (now() + interval '14 days')::timestamptz, 120, 'Hindi', 13,
   '{"name":"Only Much Louder","contact":"oml@bookmyshow.com"}',
   '[{"name":"Zakir Khan","type":"Stand-up Comedian"}]',
   '[{"name":"General","price":799,"capacity":800,"color":"#E11D48"},{"name":"Premium","price":1499,"capacity":300,"color":"#6366F1"}]',
   NULL, NULL, 1, now(), now(), NULL),

  -- ── 1 Activity (Type = 3) ──────────────────────────────────
  (gen_random_uuid(),
   'BookKaroo Run 2026 · Ahmedabad 10K', 'bookkaroo-run-2026-ahmedabad', 3,
   'Join thousands of runners for Ahmedabad''s biggest morning run — 5K and 10K routes through the riverfront.',
   NULL,
   (now() + interval '30 days')::timestamptz, 120, 'Hindi', 0,
   '{"name":"BookKaroo Sports","contact":"sports@bookkaroo.com"}',
   NULL,
   '[{"name":"5K Run","price":299,"capacity":2000,"color":"#22C55E"},{"name":"10K Run","price":499,"capacity":1500,"color":"#E11D48"}]',
   NULL, NULL, 1, now(), now(), NULL)

  ON CONFLICT DO NOTHING;
END $$;

-- ============================================================
-- BookKaroo — Seed 07: Shows
-- Generates shows for next 7 days from seeded movies + screens
-- Run after: 004_venues_screens.sql, 005_movies.sql
-- ============================================================
-- NOTE: show_datetime uses fixed dates relative to 2026-05-09.
-- When you run this, shows with past dates will be auto-completed
-- by the maintenance cron job.
-- ============================================================

-- Helper: we create shows for 7 published 'now_showing' movies
-- across 5 screens, 3-4 showtimes per day, 7 days.
-- That yields ~196 shows. We list key ones; the rest follow the pattern.

-- ─── MOVIES ON SCREEN ─────────────────────────────────────────────────
-- Rajhans CBD Screen 1 (cccccccc-0001-0001-0001-000000000001) → KGF Ch2
-- Rajhans CBD Screen 2 (cccccccc-0001-0001-0001-000000000002) → Chhaava
-- PVR Acropolis Audi 1 (cccccccc-0001-0001-0001-000000000003) → RRR
-- PVR Acropolis Audi 2 (cccccccc-0001-0001-0001-000000000004) → Animal
-- INOX IMAX (cccccccc-0001-0001-0001-000000000005) → Pushpa 2
-- INOX Screen 2 (cccccccc-0001-0001-0001-000000000006) → Jawan
-- INOX 4DX (cccccccc-0001-0001-0001-000000000007) → Kalki 2898-AD
-- PVR Orion Premiere (cccccccc-0001-0001-0001-000000000008) → Stree 2
-- PVR Orion Screen 2 (cccccccc-0001-0001-0001-000000000009) → Singham Again
-- Cinepolis 4DX (cccccccc-0001-0001-0001-000000000010) → Fighter
-- Cinepolis Screen 2 (cccccccc-0001-0001-0001-000000000011) → Pathaan
-- Cinepolis Screen 3 (cccccccc-0001-0001-0001-000000000012) → Raid 2

DO $$
DECLARE
  show_dates date[] := ARRAY[
    '2026-05-09'::date, '2026-05-10'::date, '2026-05-11'::date,
    '2026-05-12'::date, '2026-05-13'::date, '2026-05-14'::date,
    '2026-05-15'::date
  ];
  d date;

  -- Screen/Movie/Venue/Format/Language combos
  screens_data record;
BEGIN

  FOREACH d IN ARRAY show_dates LOOP

    -- ── Rajhans CBD Screen 1 → KGF Ch2 ──────────────────────────────
    INSERT INTO shows (screen_id, venue_id, movie_id, show_date, show_time, show_datetime, format, language, status)
    VALUES
      ('cccccccc-0001-0001-0001-000000000001','bbbbbbbb-0001-0001-0001-000000000001','dddddddd-0001-0001-0001-000000000001', d, '09:30', (d + '09:30'::time)::timestamptz, '3D',   'Hindi',   'scheduled'),
      ('cccccccc-0001-0001-0001-000000000001','bbbbbbbb-0001-0001-0001-000000000001','dddddddd-0001-0001-0001-000000000001', d, '12:45', (d + '12:45'::time)::timestamptz, '2D',   'Kannada', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000001','bbbbbbbb-0001-0001-0001-000000000001','dddddddd-0001-0001-0001-000000000001', d, '16:15', (d + '16:15'::time)::timestamptz, '3D',   'Hindi',   'scheduled'),
      ('cccccccc-0001-0001-0001-000000000001','bbbbbbbb-0001-0001-0001-000000000001','dddddddd-0001-0001-0001-000000000001', d, '19:30', (d + '19:30'::time)::timestamptz, 'IMAX', 'Hindi',   'scheduled'),
      ('cccccccc-0001-0001-0001-000000000001','bbbbbbbb-0001-0001-0001-000000000001','dddddddd-0001-0001-0001-000000000001', d, '23:00', (d + '23:00'::time)::timestamptz, '2D',   'Telugu',  'scheduled')
    ON CONFLICT DO NOTHING;

    -- ── Rajhans CBD Screen 2 → Chhaava ────────────────────────────────
    INSERT INTO shows (screen_id, venue_id, movie_id, show_date, show_time, show_datetime, format, language, status)
    VALUES
      ('cccccccc-0001-0001-0001-000000000002','bbbbbbbb-0001-0001-0001-000000000001','dddddddd-0001-0001-0001-000000000014', d, '10:00', (d + '10:00'::time)::timestamptz, '2D', 'Hindi',   'scheduled'),
      ('cccccccc-0001-0001-0001-000000000002','bbbbbbbb-0001-0001-0001-000000000001','dddddddd-0001-0001-0001-000000000014', d, '13:30', (d + '13:30'::time)::timestamptz, '3D', 'Hindi',   'scheduled'),
      ('cccccccc-0001-0001-0001-000000000002','bbbbbbbb-0001-0001-0001-000000000001','dddddddd-0001-0001-0001-000000000014', d, '17:00', (d + '17:00'::time)::timestamptz, '2D', 'Marathi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000002','bbbbbbbb-0001-0001-0001-000000000001','dddddddd-0001-0001-0001-000000000014', d, '20:30', (d + '20:30'::time)::timestamptz, '3D', 'Hindi',   'scheduled')
    ON CONFLICT DO NOTHING;

    -- ── PVR Acropolis Audi 1 → RRR ────────────────────────────────────
    INSERT INTO shows (screen_id, venue_id, movie_id, show_date, show_time, show_datetime, format, language, status)
    VALUES
      ('cccccccc-0001-0001-0001-000000000003','bbbbbbbb-0001-0001-0001-000000000002','dddddddd-0001-0001-0001-000000000002', d, '09:00', (d + '09:00'::time)::timestamptz, '3D',         'Telugu', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000003','bbbbbbbb-0001-0001-0001-000000000002','dddddddd-0001-0001-0001-000000000002', d, '12:30', (d + '12:30'::time)::timestamptz, 'Dolby Cinema','Hindi',  'scheduled'),
      ('cccccccc-0001-0001-0001-000000000003','bbbbbbbb-0001-0001-0001-000000000002','dddddddd-0001-0001-0001-000000000002', d, '16:00', (d + '16:00'::time)::timestamptz, '3D',         'Telugu', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000003','bbbbbbbb-0001-0001-0001-000000000002','dddddddd-0001-0001-0001-000000000002', d, '20:00', (d + '20:00'::time)::timestamptz, 'Dolby Cinema','Hindi',  'scheduled')
    ON CONFLICT DO NOTHING;

    -- ── PVR Acropolis Audi 2 → Animal ─────────────────────────────────
    INSERT INTO shows (screen_id, venue_id, movie_id, show_date, show_time, show_datetime, format, language, status)
    VALUES
      ('cccccccc-0001-0001-0001-000000000004','bbbbbbbb-0001-0001-0001-000000000002','dddddddd-0001-0001-0001-000000000004', d, '10:30', (d + '10:30'::time)::timestamptz, '2D', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000004','bbbbbbbb-0001-0001-0001-000000000002','dddddddd-0001-0001-0001-000000000004', d, '14:15', (d + '14:15'::time)::timestamptz, '3D', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000004','bbbbbbbb-0001-0001-0001-000000000002','dddddddd-0001-0001-0001-000000000004', d, '18:30', (d + '18:30'::time)::timestamptz, '2D', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000004','bbbbbbbb-0001-0001-0001-000000000002','dddddddd-0001-0001-0001-000000000004', d, '22:15', (d + '22:15'::time)::timestamptz, '3D', 'Hindi', 'scheduled')
    ON CONFLICT DO NOTHING;

    -- ── INOX IMAX → Pushpa 2 ─────────────────────────────────────────
    INSERT INTO shows (screen_id, venue_id, movie_id, show_date, show_time, show_datetime, format, language, status)
    VALUES
      ('cccccccc-0001-0001-0001-000000000005','bbbbbbbb-0001-0001-0001-000000000003','dddddddd-0001-0001-0001-000000000009', d, '09:15', (d + '09:15'::time)::timestamptz, 'IMAX', 'Telugu', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000005','bbbbbbbb-0001-0001-0001-000000000003','dddddddd-0001-0001-0001-000000000009', d, '13:00', (d + '13:00'::time)::timestamptz, 'IMAX', 'Hindi',  'scheduled'),
      ('cccccccc-0001-0001-0001-000000000005','bbbbbbbb-0001-0001-0001-000000000003','dddddddd-0001-0001-0001-000000000009', d, '17:30', (d + '17:30'::time)::timestamptz, 'IMAX', 'Telugu', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000005','bbbbbbbb-0001-0001-0001-000000000003','dddddddd-0001-0001-0001-000000000009', d, '21:30', (d + '21:30'::time)::timestamptz, 'IMAX', 'Hindi',  'scheduled')
    ON CONFLICT DO NOTHING;

    -- ── INOX Screen 2 → Jawan ─────────────────────────────────────────
    INSERT INTO shows (screen_id, venue_id, movie_id, show_date, show_time, show_datetime, format, language, status)
    VALUES
      ('cccccccc-0001-0001-0001-000000000006','bbbbbbbb-0001-0001-0001-000000000003','dddddddd-0001-0001-0001-000000000005', d, '10:15', (d + '10:15'::time)::timestamptz, '2D', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000006','bbbbbbbb-0001-0001-0001-000000000003','dddddddd-0001-0001-0001-000000000005', d, '13:45', (d + '13:45'::time)::timestamptz, '3D', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000006','bbbbbbbb-0001-0001-0001-000000000003','dddddddd-0001-0001-0001-000000000005', d, '18:00', (d + '18:00'::time)::timestamptz, '2D', 'Tamil', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000006','bbbbbbbb-0001-0001-0001-000000000003','dddddddd-0001-0001-0001-000000000005', d, '21:45', (d + '21:45'::time)::timestamptz, '3D', 'Hindi', 'scheduled')
    ON CONFLICT DO NOTHING;

    -- ── INOX 4DX → Kalki 2898-AD ──────────────────────────────────────
    INSERT INTO shows (screen_id, venue_id, movie_id, show_date, show_time, show_datetime, format, language, status)
    VALUES
      ('cccccccc-0001-0001-0001-000000000007','bbbbbbbb-0001-0001-0001-000000000003','dddddddd-0001-0001-0001-000000000006', d, '11:00', (d + '11:00'::time)::timestamptz, '4DX', 'Telugu', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000007','bbbbbbbb-0001-0001-0001-000000000003','dddddddd-0001-0001-0001-000000000006', d, '15:30', (d + '15:30'::time)::timestamptz, '4DX', 'Hindi',  'scheduled'),
      ('cccccccc-0001-0001-0001-000000000007','bbbbbbbb-0001-0001-0001-000000000003','dddddddd-0001-0001-0001-000000000006', d, '20:00', (d + '20:00'::time)::timestamptz, '4DX', 'Telugu', 'scheduled')
    ON CONFLICT DO NOTHING;

    -- ── PVR Orion Premiere → Stree 2 ──────────────────────────────────
    INSERT INTO shows (screen_id, venue_id, movie_id, show_date, show_time, show_datetime, format, language, status)
    VALUES
      ('cccccccc-0001-0001-0001-000000000008','bbbbbbbb-0001-0001-0001-000000000004','dddddddd-0001-0001-0001-000000000007', d, '09:45', (d + '09:45'::time)::timestamptz, 'Dolby Cinema', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000008','bbbbbbbb-0001-0001-0001-000000000004','dddddddd-0001-0001-0001-000000000007', d, '13:15', (d + '13:15'::time)::timestamptz, '3D',           'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000008','bbbbbbbb-0001-0001-0001-000000000004','dddddddd-0001-0001-0001-000000000007', d, '17:45', (d + '17:45'::time)::timestamptz, 'Dolby Cinema', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000008','bbbbbbbb-0001-0001-0001-000000000004','dddddddd-0001-0001-0001-000000000007', d, '21:00', (d + '21:00'::time)::timestamptz, '3D',           'Hindi', 'scheduled')
    ON CONFLICT DO NOTHING;

    -- ── PVR Orion Screen 2 → Singham Again ────────────────────────────
    INSERT INTO shows (screen_id, venue_id, movie_id, show_date, show_time, show_datetime, format, language, status)
    VALUES
      ('cccccccc-0001-0001-0001-000000000009','bbbbbbbb-0001-0001-0001-000000000004','dddddddd-0001-0001-0001-000000000010', d, '10:00', (d + '10:00'::time)::timestamptz, '2D', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000009','bbbbbbbb-0001-0001-0001-000000000004','dddddddd-0001-0001-0001-000000000010', d, '13:30', (d + '13:30'::time)::timestamptz, '3D', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000009','bbbbbbbb-0001-0001-0001-000000000004','dddddddd-0001-0001-0001-000000000010', d, '17:00', (d + '17:00'::time)::timestamptz, '2D', 'Tamil', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000009','bbbbbbbb-0001-0001-0001-000000000004','dddddddd-0001-0001-0001-000000000010', d, '21:15', (d + '21:15'::time)::timestamptz, '3D', 'Hindi', 'scheduled')
    ON CONFLICT DO NOTHING;

    -- ── Cinepolis 4DX → Fighter ────────────────────────────────────────
    INSERT INTO shows (screen_id, venue_id, movie_id, show_date, show_time, show_datetime, format, language, status)
    VALUES
      ('cccccccc-0001-0001-0001-000000000010','bbbbbbbb-0001-0001-0001-000000000005','dddddddd-0001-0001-0001-000000000008', d, '10:30', (d + '10:30'::time)::timestamptz, '4DX', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000010','bbbbbbbb-0001-0001-0001-000000000005','dddddddd-0001-0001-0001-000000000008', d, '14:30', (d + '14:30'::time)::timestamptz, '4DX', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000010','bbbbbbbb-0001-0001-0001-000000000005','dddddddd-0001-0001-0001-000000000008', d, '19:00', (d + '19:00'::time)::timestamptz, '4DX', 'Hindi', 'scheduled')
    ON CONFLICT DO NOTHING;

    -- ── Cinepolis Screen 2 → Pathaan ──────────────────────────────────
    INSERT INTO shows (screen_id, venue_id, movie_id, show_date, show_time, show_datetime, format, language, status)
    VALUES
      ('cccccccc-0001-0001-0001-000000000011','bbbbbbbb-0001-0001-0001-000000000005','dddddddd-0001-0001-0001-000000000003', d, '09:30', (d + '09:30'::time)::timestamptz, '2D',   'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000011','bbbbbbbb-0001-0001-0001-000000000005','dddddddd-0001-0001-0001-000000000003', d, '13:00', (d + '13:00'::time)::timestamptz, '3D',   'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000011','bbbbbbbb-0001-0001-0001-000000000005','dddddddd-0001-0001-0001-000000000003', d, '17:00', (d + '17:00'::time)::timestamptz, 'IMAX', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000011','bbbbbbbb-0001-0001-0001-000000000005','dddddddd-0001-0001-0001-000000000003', d, '21:30', (d + '21:30'::time)::timestamptz, '3D',   'Hindi', 'scheduled')
    ON CONFLICT DO NOTHING;

    -- ── Cinepolis Screen 3 → Raid 2 ───────────────────────────────────
    INSERT INTO shows (screen_id, venue_id, movie_id, show_date, show_time, show_datetime, format, language, status)
    VALUES
      ('cccccccc-0001-0001-0001-000000000012','bbbbbbbb-0001-0001-0001-000000000005','dddddddd-0001-0001-0001-000000000013', d, '10:00', (d + '10:00'::time)::timestamptz, '2D', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000012','bbbbbbbb-0001-0001-0001-000000000005','dddddddd-0001-0001-0001-000000000013', d, '14:00', (d + '14:00'::time)::timestamptz, '2D', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000012','bbbbbbbb-0001-0001-0001-000000000005','dddddddd-0001-0001-0001-000000000013', d, '18:15', (d + '18:15'::time)::timestamptz, '3D', 'Hindi', 'scheduled'),
      ('cccccccc-0001-0001-0001-000000000012','bbbbbbbb-0001-0001-0001-000000000005','dddddddd-0001-0001-0001-000000000013', d, '22:00', (d + '22:00'::time)::timestamptz, '2D', 'Hindi', 'scheduled')
    ON CONFLICT DO NOTHING;

  END LOOP;
END $$;

-- Mark past shows as completed (if running after May 9)
UPDATE shows
SET status = 'completed'
WHERE show_datetime < now()
  AND status = 'scheduled';

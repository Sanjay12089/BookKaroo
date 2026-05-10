-- ============================================================
-- BookKaroo — Seed 04: Venues & Screens
-- Run after: 002_cities.sql
-- 5 venues across 3 cities, 2–3 screens each (13 total)
-- ============================================================

-- ─── VENUES ───────────────────────────────────────────────

INSERT INTO venues (id, name, slug, chain, address, city_id, state_code, latitude, longitude, amenities) VALUES
-- Ahmedabad
(
  'bbbbbbbb-0001-0001-0001-000000000001',
  'Rajhans Cinemas: The CBD Mall, Zundal Circle',
  'rajhans-cbd-ahmedabad',
  'Rajhans',
  'The CBD Mall, Zundal Circle, SG Highway, Ahmedabad, Gujarat 382421',
  '11111111-0001-0001-0001-000000000005',
  '24', 23.1090, 72.5280,
  '["Parking","Food Court","M-Ticket","Wheelchair Access","Recliner"]'::jsonb
),
(
  'bbbbbbbb-0001-0001-0001-000000000002',
  'PVR Cinemas: Acropolis Mall',
  'pvr-acropolis-ahmedabad',
  'PVR',
  'Acropolis Mall, Vastrapur, Ahmedabad, Gujarat 380015',
  '11111111-0001-0001-0001-000000000005',
  '24', 23.0467, 72.5186,
  '["Parking","Food Court","M-Ticket","Dolby Atmos","Recliner"]'::jsonb
),
-- Mumbai
(
  'bbbbbbbb-0001-0001-0001-000000000003',
  'INOX: R City Mall',
  'inox-rcity-mumbai',
  'INOX',
  'R City Mall, LBS Marg, Ghatkopar West, Mumbai, Maharashtra 400086',
  '11111111-0001-0001-0001-000000000001',
  '27', 19.0860, 72.9069,
  '["Parking","Food Court","M-Ticket","IMAX","4DX","Wheelchair Access"]'::jsonb
),
-- Bangalore
(
  'bbbbbbbb-0001-0001-0001-000000000004',
  'PVR: Orion Mall',
  'pvr-orion-bangalore',
  'PVR',
  'Orion Mall, Dr Rajkumar Rd, Rajajinagar, Bangalore, Karnataka 560010',
  '11111111-0001-0001-0001-000000000003',
  '29', 12.9920, 77.5530,
  '["Parking","Food Court","M-Ticket","IMAX","Dolby Cinema","Recliner"]'::jsonb
),
-- Delhi-NCR
(
  'bbbbbbbb-0001-0001-0001-000000000005',
  'Cinepolis: DLF Mall of India',
  'cinepolis-dlfmoi-noida',
  'Cinepolis',
  'DLF Mall of India, Sector 18, Noida, Uttar Pradesh 201301',
  '11111111-0001-0001-0001-000000000002',
  '09', 28.5679, 77.3220,
  '["Parking","Food Court","M-Ticket","4DX","Recliner","Subtitles"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- ─── SCREENS ───────────────────────────────────────────────
-- Layout JSON: { rows, cols, categories[], blockedSeats[], aisleAfterCols[] }
-- categories: [{ name, rows[], price, color }]

-- ── Rajhans CBD (Ahmedabad) ──
INSERT INTO screens (id, venue_id, name, total_seats, layout) VALUES
(
  'cccccccc-0001-0001-0001-000000000001',
  'bbbbbbbb-0001-0001-0001-000000000001',
  'SCREEN 1',
  180,
  '{
    "rows": 12,
    "cols": 18,
    "categories": [
      { "name": "Recliner", "rows": ["A","B"], "price": 500, "color": "#FFD700" },
      { "name": "Executive", "rows": ["C","D","E","F"], "price": 300, "color": "#4169E1" },
      { "name": "Normal", "rows": ["G","H","I","J","K","L"], "price": 150, "color": "#FFFFFF" }
    ],
    "blockedSeats": ["A1","A18","B1","B18","L1","L18"],
    "aisleAfterCols": [6, 12]
  }'::jsonb
),
(
  'cccccccc-0001-0001-0001-000000000002',
  'bbbbbbbb-0001-0001-0001-000000000001',
  'SCREEN 2',
  120,
  '{
    "rows": 10,
    "cols": 14,
    "categories": [
      { "name": "Gold", "rows": ["A","B"], "price": 350, "color": "#C0C0C0" },
      { "name": "Executive", "rows": ["C","D","E"], "price": 250, "color": "#4169E1" },
      { "name": "Normal", "rows": ["F","G","H","I","J"], "price": 150, "color": "#FFFFFF" }
    ],
    "blockedSeats": ["A1","A14","J1","J14"],
    "aisleAfterCols": [5, 10]
  }'::jsonb
),
-- ── PVR Acropolis (Ahmedabad) ──
(
  'cccccccc-0001-0001-0001-000000000003',
  'bbbbbbbb-0001-0001-0001-000000000002',
  'AUDI 1 — DOLBY ATMOS',
  220,
  '{
    "rows": 14,
    "cols": 18,
    "categories": [
      { "name": "Recliner", "rows": ["A","B"], "price": 600, "color": "#FFD700" },
      { "name": "Gold", "rows": ["C","D","E"], "price": 400, "color": "#C0C0C0" },
      { "name": "Executive", "rows": ["F","G","H","I","J"], "price": 280, "color": "#4169E1" },
      { "name": "Normal", "rows": ["K","L","M","N"], "price": 180, "color": "#FFFFFF" }
    ],
    "blockedSeats": ["A1","A2","A17","A18","N1","N18"],
    "aisleAfterCols": [4, 9, 14]
  }'::jsonb
),
(
  'cccccccc-0001-0001-0001-000000000004',
  'bbbbbbbb-0001-0001-0001-000000000002',
  'AUDI 2',
  150,
  '{
    "rows": 10,
    "cols": 17,
    "categories": [
      { "name": "Gold", "rows": ["A","B","C"], "price": 380, "color": "#C0C0C0" },
      { "name": "Executive", "rows": ["D","E","F"], "price": 250, "color": "#4169E1" },
      { "name": "Normal", "rows": ["G","H","I","J"], "price": 170, "color": "#FFFFFF" }
    ],
    "blockedSeats": ["A1","A17","J1","J17"],
    "aisleAfterCols": [6, 12]
  }'::jsonb
),
-- ── INOX R City (Mumbai) ──
(
  'cccccccc-0001-0001-0001-000000000005',
  'bbbbbbbb-0001-0001-0001-000000000003',
  'IMAX SCREEN',
  280,
  '{
    "rows": 16,
    "cols": 20,
    "categories": [
      { "name": "Recliner", "rows": ["A","B","C"], "price": 800, "color": "#FFD700" },
      { "name": "Gold", "rows": ["D","E","F","G"], "price": 550, "color": "#C0C0C0" },
      { "name": "Executive", "rows": ["H","I","J","K","L"], "price": 380, "color": "#4169E1" },
      { "name": "Normal", "rows": ["M","N","O","P"], "price": 250, "color": "#FFFFFF" }
    ],
    "blockedSeats": ["A1","A2","A19","A20","P1","P20"],
    "aisleAfterCols": [5, 10, 15]
  }'::jsonb
),
(
  'cccccccc-0001-0001-0001-000000000006',
  'bbbbbbbb-0001-0001-0001-000000000003',
  'SCREEN 2',
  160,
  '{
    "rows": 10,
    "cols": 18,
    "categories": [
      { "name": "Executive", "rows": ["A","B","C","D","E"], "price": 350, "color": "#4169E1" },
      { "name": "Normal", "rows": ["F","G","H","I","J"], "price": 220, "color": "#FFFFFF" }
    ],
    "blockedSeats": ["A1","A18","J1","J18"],
    "aisleAfterCols": [6, 12]
  }'::jsonb
),
(
  'cccccccc-0001-0001-0001-000000000007',
  'bbbbbbbb-0001-0001-0001-000000000003',
  '4DX SCREEN',
  100,
  '{
    "rows": 8,
    "cols": 14,
    "categories": [
      { "name": "4DX Gold", "rows": ["A","B","C","D"], "price": 700, "color": "#FFD700" },
      { "name": "4DX Standard", "rows": ["E","F","G","H"], "price": 500, "color": "#C0C0C0" }
    ],
    "blockedSeats": ["A1","A14","H1","H14"],
    "aisleAfterCols": [4, 10]
  }'::jsonb
),
-- ── PVR Orion (Bangalore) ──
(
  'cccccccc-0001-0001-0001-000000000008',
  'bbbbbbbb-0001-0001-0001-000000000004',
  'PREMIERE SCREEN — DOLBY CINEMA',
  260,
  '{
    "rows": 14,
    "cols": 20,
    "categories": [
      { "name": "Recliner", "rows": ["A","B"], "price": 750, "color": "#FFD700" },
      { "name": "Gold", "rows": ["C","D","E","F"], "price": 500, "color": "#C0C0C0" },
      { "name": "Executive", "rows": ["G","H","I","J","K"], "price": 350, "color": "#4169E1" },
      { "name": "Normal", "rows": ["L","M","N"], "price": 220, "color": "#FFFFFF" }
    ],
    "blockedSeats": ["A1","A2","A19","A20"],
    "aisleAfterCols": [5, 10, 15]
  }'::jsonb
),
(
  'cccccccc-0001-0001-0001-000000000009',
  'bbbbbbbb-0001-0001-0001-000000000004',
  'SCREEN 2',
  140,
  '{
    "rows": 10,
    "cols": 16,
    "categories": [
      { "name": "Executive", "rows": ["A","B","C","D","E"], "price": 300, "color": "#4169E1" },
      { "name": "Normal", "rows": ["F","G","H","I","J"], "price": 190, "color": "#FFFFFF" }
    ],
    "blockedSeats": ["A1","A16","J1","J16"],
    "aisleAfterCols": [5, 11]
  }'::jsonb
),
-- ── Cinepolis DLF (Delhi-NCR) ──
(
  'cccccccc-0001-0001-0001-000000000010',
  'bbbbbbbb-0001-0001-0001-000000000005',
  'SCREEN 1 — 4DX',
  110,
  '{
    "rows": 8,
    "cols": 16,
    "categories": [
      { "name": "4DX Recliner", "rows": ["A","B"], "price": 900, "color": "#FFD700" },
      { "name": "4DX Standard", "rows": ["C","D","E","F","G","H"], "price": 650, "color": "#C0C0C0" }
    ],
    "blockedSeats": ["A1","A16","H1","H16"],
    "aisleAfterCols": [5, 11]
  }'::jsonb
),
(
  'cccccccc-0001-0001-0001-000000000011',
  'bbbbbbbb-0001-0001-0001-000000000005',
  'SCREEN 2',
  200,
  '{
    "rows": 12,
    "cols": 18,
    "categories": [
      { "name": "Recliner", "rows": ["A","B","C"], "price": 600, "color": "#FFD700" },
      { "name": "Executive", "rows": ["D","E","F","G","H"], "price": 380, "color": "#4169E1" },
      { "name": "Normal", "rows": ["I","J","K","L"], "price": 230, "color": "#FFFFFF" }
    ],
    "blockedSeats": ["A1","A18","L1","L18"],
    "aisleAfterCols": [6, 12]
  }'::jsonb
),
(
  'cccccccc-0001-0001-0001-000000000012',
  'bbbbbbbb-0001-0001-0001-000000000005',
  'SCREEN 3 — SUBTITLES',
  130,
  '{
    "rows": 10,
    "cols": 14,
    "categories": [
      { "name": "Gold", "rows": ["A","B","C"], "price": 420, "color": "#C0C0C0" },
      { "name": "Normal", "rows": ["D","E","F","G","H","I","J"], "price": 260, "color": "#FFFFFF" }
    ],
    "blockedSeats": ["A1","A14","J1","J14"],
    "aisleAfterCols": [5, 10]
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

# BookKaroo — Database

## Overview
- **DB:** Supabase PostgreSQL
- **No foreign keys** (logical references via UUID + indexes)
- **Soft deletes** via `deleted_at` on all mutable tables
- **GST-aware** (state_code on users + cities drives CGST/SGST vs IGST)

## Prerequisites
- Supabase project created
- Connection string available: Project Settings → Database → Connection string → URI
- `psql` CLI or Supabase SQL Editor

## How to Apply (Supabase SQL Editor — Recommended for MVP)

1. Go to your Supabase project → SQL Editor (left sidebar)
2. Click "New query"
3. Paste and run each file **in order:**

```
Step 1: migrations/001_init.sql     ← schema (tables, indexes, triggers)
Step 2: seeds/01_settings.sql       ← company details, GST config, fee rates
Step 3: seeds/02_cities.sql         ← 25 Indian cities with state codes
Step 4: seeds/03_users.sql          ← 1 admin + 5 test users
Step 5: seeds/04_venues_screens.sql ← 5 venues, 12 screens with layout JSON
Step 6: seeds/05_movies.sql         ← 20 movies (Bollywood / South)
Step 7: seeds/06_events.sql         ← 5 IPL matches, 2 concerts, 2 plays, 1 comedy
Step 8: seeds/07_shows.sql          ← ~170 shows over 7 days
Step 9: seeds/08_coupons.sql        ← 5 sample coupons
Step 10: seeds/09_banners.sql       ← 5 home carousel banners
```

> Each file is idempotent — safe to re-run (uses `ON CONFLICT DO NOTHING` or `CREATE TABLE IF NOT EXISTS`).

## How to Apply via psql (alternative)

```bash
# Set your connection string
export DB_URL="postgresql://postgres.[ref]:[password]@aws-...pooler.supabase.com:5432/postgres"

# Apply schema
psql "$DB_URL" -f migrations/001_init.sql

# Apply seeds in order
for f in seeds/0*.sql; do
  echo "Running $f..."
  psql "$DB_URL" -f "$f"
done
```

## Supabase Storage Buckets
Create these buckets manually in Supabase Dashboard → Storage:

| Bucket | Public | Purpose |
|---|---|---|
| `qr-codes` | ✅ Public | QR code PNG files |
| `invoices` | ❌ Private | GST invoice PDFs (use signed URLs) |
| `posters` | ✅ Public | Cached TMDB poster images |

**How to create:**
1. Supabase Dashboard → Storage → New bucket
2. Set name, toggle public/private
3. No policies needed (backend uses service_role key)

## Maintenance Jobs (set up after backend is running)

| Job | SQL | Schedule |
|---|---|---|
| Sweep expired seat locks | `DELETE FROM seat_locks WHERE expires_at < now()` | Every 60 seconds |
| Mark past shows completed | `UPDATE shows SET status='completed' WHERE show_datetime < now() AND status='scheduled'` | Every 15 minutes |
| Sweep expired idempotency keys | `DELETE FROM idempotency_keys WHERE created_at < now() - interval '24 hours'` | Every hour |

These run as Railway cron jobs or Supabase Edge Functions (to be configured in backend scaffold).

## Test Credentials

| Email | Password | Role |
|---|---|---|
| admin@bookkaroo.com | Admin@1234 | admin |
| sanjay@bookkaroo.com | Test@1234 | user (Ahmedabad, Gujarat) |
| priya@bookkaroo.com | Test@1234 | user (Mumbai, Maharashtra) |
| rahul@bookkaroo.com | Test@1234 | user (Delhi-NCR, Delhi) |
| ayesha@bookkaroo.com | Test@1234 | user (Bangalore, Karnataka) |
| vikram@bookkaroo.com | Test@1234 | user (Kochi, Kerala) |

> **sanjay** is intra-state (Gujarat = company state) → CGST + SGST on invoices
> **priya, rahul, ayesha, vikram** are inter-state → IGST on invoices

## Verify After Running

```sql
-- Quick sanity checks
SELECT 'cities' as tbl, count(*) FROM cities
UNION ALL SELECT 'users',  count(*) FROM users
UNION ALL SELECT 'venues', count(*) FROM venues
UNION ALL SELECT 'screens',count(*) FROM screens
UNION ALL SELECT 'movies', count(*) FROM movies
UNION ALL SELECT 'events', count(*) FROM events
UNION ALL SELECT 'shows',  count(*) FROM shows
UNION ALL SELECT 'coupons',count(*) FROM coupons
UNION ALL SELECT 'settings',count(*) FROM settings
UNION ALL SELECT 'cms_banners',count(*) FROM cms_banners;

-- Expected: 25, 6, 5, 12, 20, 10, ~170, 5, 30, 5
```

## Schema Diagram
See `/docs/DATABASE.md` for full ERD and column specs.

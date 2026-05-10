-- ============================================================
-- BookKaroo — Complete Database Schema
-- Version : 1.0.0
-- DB      : Supabase PostgreSQL
-- Rules   : No FKs | soft-delete | snake_case | UUID PKs
-- Run     : Safe to re-run (CREATE TABLE IF NOT EXISTS)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- trigram search on movie/event titles

-- ============================================================
-- UTILITY: auto-update updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper macro: attach set_updated_at to a table
-- Usage: SELECT attach_updated_at('table_name');
CREATE OR REPLACE FUNCTION attach_updated_at(tbl text)
RETURNS void AS $$
BEGIN
  EXECUTE format(
    'DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I;
     CREATE TRIGGER trg_%s_updated_at
     BEFORE UPDATE ON %I
     FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
    tbl, tbl, tbl, tbl
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLE: settings
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE: cities
-- ============================================================
CREATE TABLE IF NOT EXISTS cities (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        NOT NULL,
  state       text        NOT NULL,
  state_code  text        NOT NULL,   -- 2-digit GST state code
  country     text        NOT NULL DEFAULT 'IN',
  latitude    numeric(9,6),
  longitude   numeric(9,6),
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS cities_slug_idx ON cities(slug) WHERE deleted_at IS NULL;
CREATE INDEX        IF NOT EXISTS cities_name_idx ON cities(name);
CREATE INDEX        IF NOT EXISTS cities_state_code_idx ON cities(state_code);
SELECT attach_updated_at('cities');

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email            text        UNIQUE,
  mobile           text        UNIQUE,
  password_hash    text        NOT NULL,
  name             text        NOT NULL,
  dob              date,
  gender           text        CHECK (gender IN ('male','female','other','prefer_not')),
  city_id          uuid,                    -- logical ref → cities.id
  state_code       text,                    -- copied from city.state_code at signup
  profile_pic_url  text,
  role             text        NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  email_verified   boolean     NOT NULL DEFAULT false,
  is_blocked       boolean     NOT NULL DEFAULT false,
  preferences      jsonb       NOT NULL DEFAULT '{"languages":[],"genres":[],"notifications":true}'::jsonb,
  refresh_token    text,
  refresh_token_expires_at timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  deleted_at       timestamptz
);

CREATE INDEX IF NOT EXISTS users_email_idx      ON users(email)      WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS users_mobile_idx     ON users(mobile)     WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS users_city_id_idx    ON users(city_id);
CREATE INDEX IF NOT EXISTS users_role_idx       ON users(role);
SELECT attach_updated_at('users');

-- ============================================================
-- TABLE: password_reset_tokens
-- ============================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL,   -- logical ref → users.id
  token_hash text        NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prt_user_id_idx    ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS prt_token_hash_idx ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS prt_expires_at_idx ON password_reset_tokens(expires_at);

-- ============================================================
-- TABLE: venues
-- ============================================================
CREATE TABLE IF NOT EXISTS venues (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  slug          text        NOT NULL,
  chain         text,                    -- PVR | INOX | Cinepolis | Rajhans | etc.
  address       text        NOT NULL,
  city_id       uuid        NOT NULL,   -- logical ref → cities.id
  state_code    text        NOT NULL,
  latitude      numeric(9,6),
  longitude     numeric(9,6),
  amenities     jsonb       NOT NULL DEFAULT '[]'::jsonb,
  contact_phone text,
  contact_email text,
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS venues_slug_idx    ON venues(slug) WHERE deleted_at IS NULL;
CREATE INDEX        IF NOT EXISTS venues_city_id_idx ON venues(city_id);
CREATE INDEX        IF NOT EXISTS venues_chain_idx   ON venues(chain);
SELECT attach_updated_at('venues');

-- ============================================================
-- TABLE: screens
-- ============================================================
CREATE TABLE IF NOT EXISTS screens (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id    uuid        NOT NULL,   -- logical ref → venues.id
  name        text        NOT NULL,
  layout      jsonb       NOT NULL,   -- {rows, cols, categories[], blockedSeats[], aisleAfterCols[]}
  total_seats int         NOT NULL,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz
);

CREATE INDEX IF NOT EXISTS screens_venue_id_idx ON screens(venue_id);
SELECT attach_updated_at('screens');

-- ============================================================
-- TABLE: movies
-- ============================================================
CREATE TABLE IF NOT EXISTS movies (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tmdb_id        int         UNIQUE,
  title          text        NOT NULL,
  slug           text        NOT NULL,
  description    text,
  duration_min   int,
  languages      text[]      NOT NULL DEFAULT '{}',
  formats        text[]      NOT NULL DEFAULT '{}',
  genres         text[]      NOT NULL DEFAULT '{}',
  "cast"         jsonb       NOT NULL DEFAULT '[]'::jsonb,
  crew           jsonb       NOT NULL DEFAULT '[]'::jsonb,
  certificate    text,                  -- U | UA | A | S
  release_date   date,
  poster_url     text,
  backdrop_url   text,
  trailer_url    text,
  imdb_rating    numeric(3,1),
  status         text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  category       text        NOT NULL DEFAULT 'now_showing' CHECK (category IN ('now_showing','coming_soon','exclusive','premiere')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  deleted_at     timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS movies_slug_idx        ON movies(slug) WHERE deleted_at IS NULL;
CREATE INDEX        IF NOT EXISTS movies_status_idx      ON movies(status);
CREATE INDEX        IF NOT EXISTS movies_category_idx    ON movies(category);
CREATE INDEX        IF NOT EXISTS movies_release_date_idx ON movies(release_date);
CREATE INDEX        IF NOT EXISTS movies_title_trgm_idx  ON movies USING gin(title gin_trgm_ops);
SELECT attach_updated_at('movies');

-- ============================================================
-- TABLE: events
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text        NOT NULL,
  slug            text        NOT NULL,
  type            text        NOT NULL CHECK (type IN ('live_event','play','sport','activity','comedy','ipl')),
  description     text,
  venue_id        uuid,                  -- logical ref → venues.id
  event_date      timestamptz NOT NULL,
  duration_min    int,
  language        text,
  age_restriction int,
  organizer       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  artists         jsonb       NOT NULL DEFAULT '[]'::jsonb,
  poster_url      text,
  backdrop_url    text,
  price_tiers     jsonb       NOT NULL DEFAULT '[]'::jsonb,
  status          text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS events_slug_idx       ON events(slug) WHERE deleted_at IS NULL;
CREATE INDEX        IF NOT EXISTS events_type_idx       ON events(type);
CREATE INDEX        IF NOT EXISTS events_status_idx     ON events(status);
CREATE INDEX        IF NOT EXISTS events_event_date_idx ON events(event_date);
CREATE INDEX        IF NOT EXISTS events_venue_id_idx   ON events(venue_id);
CREATE INDEX        IF NOT EXISTS events_title_trgm_idx ON events USING gin(title gin_trgm_ops);
SELECT attach_updated_at('events');

-- ============================================================
-- TABLE: shows
-- ============================================================
CREATE TABLE IF NOT EXISTS shows (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  screen_id      uuid,                  -- logical ref → screens.id
  venue_id       uuid        NOT NULL,  -- denormalized for fast city-filter queries
  movie_id       uuid,                  -- logical ref → movies.id (one of movie_id or event_id set)
  event_id       uuid,                  -- logical ref → events.id
  show_date      date        NOT NULL,
  show_time      time        NOT NULL,
  show_datetime  timestamptz NOT NULL,  -- = show_date + show_time, indexed
  format         text        NOT NULL DEFAULT '2D',
  language       text        NOT NULL,
  price_overrides jsonb,                -- optional category price overrides
  status         text        NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','cancelled','completed')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  deleted_at     timestamptz
);

CREATE INDEX IF NOT EXISTS shows_screen_id_idx    ON shows(screen_id);
CREATE INDEX IF NOT EXISTS shows_venue_id_idx     ON shows(venue_id);
CREATE INDEX IF NOT EXISTS shows_movie_id_idx     ON shows(movie_id);
CREATE INDEX IF NOT EXISTS shows_event_id_idx     ON shows(event_id);
CREATE INDEX IF NOT EXISTS shows_show_datetime_idx ON shows(show_datetime);
CREATE INDEX IF NOT EXISTS shows_show_date_idx    ON shows(show_date);
CREATE INDEX IF NOT EXISTS shows_status_idx       ON shows(status);
SELECT attach_updated_at('shows');

-- ============================================================
-- TABLE: seat_locks
-- ============================================================
CREATE TABLE IF NOT EXISTS seat_locks (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id     uuid        NOT NULL,   -- logical ref → shows.id
  seat_label  text        NOT NULL,
  user_id     uuid,                   -- logical ref → users.id (null for guest pre-auth)
  session_id  text,                   -- for guest checkout
  expires_at  timestamptz NOT NULL,   -- now() + 8 minutes
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS seat_locks_show_id_idx    ON seat_locks(show_id);
CREATE INDEX IF NOT EXISTS seat_locks_expires_at_idx ON seat_locks(expires_at);
CREATE INDEX IF NOT EXISTS seat_locks_user_id_idx    ON seat_locks(user_id);

-- NOTE: now() is not IMMUTABLE so cannot be used in index predicates.
-- Active-lock uniqueness enforced at service layer (existence check before INSERT).
-- This composite index still speeds up the lookup.
CREATE INDEX IF NOT EXISTS seat_locks_show_seat_idx
  ON seat_locks(show_id, seat_label);

-- ============================================================
-- TABLE: coupons
-- ============================================================
CREATE TABLE IF NOT EXISTS coupons (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  code                   text        NOT NULL,
  description            text,
  type                   text        NOT NULL CHECK (type IN ('flat','percent','bogo')),
  value                  numeric(10,2) NOT NULL,
  max_discount           numeric(10,2),           -- cap for percent type
  min_order              numeric(10,2) NOT NULL DEFAULT 0,
  valid_from             timestamptz NOT NULL,
  valid_to               timestamptz NOT NULL,
  usage_limit_per_user   int         NOT NULL DEFAULT 1,
  total_usage_limit      int,                     -- null = unlimited
  current_usage          int         NOT NULL DEFAULT 0,
  applicable_cities      uuid[]      NOT NULL DEFAULT '{}',   -- empty = all cities
  applicable_movies      uuid[]      NOT NULL DEFAULT '{}',   -- empty = all movies
  applicable_venues      uuid[]      NOT NULL DEFAULT '{}',   -- empty = all venues
  is_active              boolean     NOT NULL DEFAULT true,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  deleted_at             timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS coupons_code_idx     ON coupons(UPPER(code)) WHERE deleted_at IS NULL;
CREATE INDEX        IF NOT EXISTS coupons_valid_idx    ON coupons(valid_from, valid_to);
CREATE INDEX        IF NOT EXISTS coupons_active_idx   ON coupons(is_active);
SELECT attach_updated_at('coupons');

-- ============================================================
-- TABLE: bookings
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref          text        NOT NULL,
  user_id              uuid        NOT NULL,   -- logical ref → users.id
  show_id              uuid        NOT NULL,   -- logical ref → shows.id
  ticket_qty           int         NOT NULL,
  ticket_amount        numeric(10,2) NOT NULL, -- seat prices sum (goes to venue)
  convenience_fee      numeric(10,2) NOT NULL, -- qty × 59 (BookKaroo revenue)
  offer_processing_fee numeric(10,2) NOT NULL DEFAULT 0,
  taxable_amount       numeric(10,2) NOT NULL, -- convenience_fee + offer_processing_fee
  cgst                 numeric(10,2) NOT NULL DEFAULT 0,
  sgst                 numeric(10,2) NOT NULL DEFAULT 0,
  igst                 numeric(10,2) NOT NULL DEFAULT 0,
  discount             numeric(10,2) NOT NULL DEFAULT 0,
  amount_paid          numeric(10,2) NOT NULL,
  customer_state_code  text        NOT NULL,
  coupon_id            uuid,                   -- logical ref → coupons.id
  status               text        NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','confirmed','cancelled','refunded')),
  invoice_number       text        UNIQUE,
  invoice_url          text,
  qr_url               text,
  payment_method_label text,
  cancelled_at         timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  deleted_at           timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS bookings_booking_ref_idx ON bookings(booking_ref);
CREATE INDEX        IF NOT EXISTS bookings_user_id_idx     ON bookings(user_id);
CREATE INDEX        IF NOT EXISTS bookings_show_id_idx     ON bookings(show_id);
CREATE INDEX        IF NOT EXISTS bookings_status_idx      ON bookings(status);
CREATE INDEX        IF NOT EXISTS bookings_created_at_idx  ON bookings(created_at);
CREATE INDEX        IF NOT EXISTS bookings_coupon_id_idx   ON bookings(coupon_id);
SELECT attach_updated_at('bookings');

-- booking_ref generator function
CREATE OR REPLACE FUNCTION generate_booking_ref()
RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := 'BK-' || to_char(now(), 'YYYYMMDD') || '-';
  i int;
BEGIN
  FOR i IN 1..5 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLE: booking_seats
-- ============================================================
CREATE TABLE IF NOT EXISTS booking_seats (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  uuid        NOT NULL,   -- logical ref → bookings.id
  seat_label  text        NOT NULL,
  category    text        NOT NULL,
  price       numeric(10,2) NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS booking_seats_booking_id_idx ON booking_seats(booking_id);

-- ============================================================
-- TABLE: payments
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id          uuid        NOT NULL UNIQUE,   -- logical ref → bookings.id
  provider            text        NOT NULL DEFAULT 'mock' CHECK (provider IN ('mock','razorpay','paypal')),
  provider_order_id   text,
  provider_payment_id text,
  provider_signature  text,
  provider_payload    jsonb,
  amount              numeric(10,2) NOT NULL,
  currency            text        NOT NULL DEFAULT 'INR',
  method              text,                  -- upi | card | netbanking | wallet | mock
  status              text        NOT NULL DEFAULT 'created'
                        CHECK (status IN ('created','captured','failed','refunded')),
  idempotency_key     text        UNIQUE,
  refund_id           text,
  refund_amount       numeric(10,2),
  captured_at         timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_booking_id_idx          ON payments(booking_id);
CREATE INDEX IF NOT EXISTS payments_provider_order_id_idx   ON payments(provider_order_id);
CREATE INDEX IF NOT EXISTS payments_provider_payment_id_idx ON payments(provider_payment_id);
CREATE INDEX IF NOT EXISTS payments_status_idx              ON payments(status);
SELECT attach_updated_at('payments');

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid        NOT NULL,   -- logical ref → users.id
  movie_id            uuid,                   -- logical ref → movies.id
  event_id            uuid,                   -- logical ref → events.id
  rating              int         NOT NULL CHECK (rating BETWEEN 1 AND 10),
  title               text,
  body                text,
  thumbs_up           int         NOT NULL DEFAULT 0,
  thumbs_down         int         NOT NULL DEFAULT 0,
  is_verified_booking boolean     NOT NULL DEFAULT false,
  status              text        NOT NULL DEFAULT 'published'
                        CHECK (status IN ('published','hidden','reported')),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  deleted_at          timestamptz
);

CREATE INDEX IF NOT EXISTS reviews_user_id_idx  ON reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_movie_id_idx ON reviews(movie_id);
CREATE INDEX IF NOT EXISTS reviews_event_id_idx ON reviews(event_id);
CREATE INDEX IF NOT EXISTS reviews_status_idx   ON reviews(status);
CREATE INDEX IF NOT EXISTS reviews_rating_idx   ON reviews(rating);
SELECT attach_updated_at('reviews');

-- ============================================================
-- TABLE: notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL,   -- logical ref → users.id
  type       text        NOT NULL,   -- booking_confirmed | reminder | offer | release | cancellation | refund
  title      text        NOT NULL,
  body       text        NOT NULL,
  data       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  is_read    boolean     NOT NULL DEFAULT false,
  sent_via   text[]      NOT NULL DEFAULT '{}',   -- email | whatsapp | in_app
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read);
CREATE INDEX IF NOT EXISTS notifications_type_idx    ON notifications(type);
SELECT attach_updated_at('notifications');

-- ============================================================
-- TABLE: cms_banners
-- ============================================================
CREATE TABLE IF NOT EXISTS cms_banners (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text        NOT NULL,
  image_url  text        NOT NULL,
  link_url   text,
  position   int         NOT NULL DEFAULT 0,
  is_active  boolean     NOT NULL DEFAULT true,
  starts_at  timestamptz,
  ends_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS cms_banners_active_idx ON cms_banners(is_active, position);
SELECT attach_updated_at('cms_banners');

-- ============================================================
-- TABLE: audit_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid,                   -- logical ref → users.id (null = system)
  action      text        NOT NULL,   -- create | update | delete | login | block | cancel | refund
  entity_type text        NOT NULL,   -- movie | booking | user | venue | show | coupon
  entity_id   uuid,
  before      jsonb,
  after       jsonb,
  ip          text,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx     ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx      ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx  ON audit_logs(created_at);

-- ============================================================
-- TABLE: idempotency_keys
-- ============================================================
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key          text        PRIMARY KEY,
  user_id      uuid,
  endpoint     text        NOT NULL,
  response     jsonb,
  status_code  int,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idempotency_keys_created_at_idx ON idempotency_keys(created_at);

-- ============================================================
-- TABLE: remind_me
-- (users who want email when Coming Soon → Released)
-- ============================================================
CREATE TABLE IF NOT EXISTS remind_me (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL,
  movie_id   uuid,
  event_id   uuid,
  notified   boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS remind_me_user_movie_idx ON remind_me(user_id, movie_id) WHERE movie_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS remind_me_user_event_idx ON remind_me(user_id, event_id) WHERE event_id IS NOT NULL;
CREATE INDEX        IF NOT EXISTS remind_me_notified_idx   ON remind_me(notified);

-- ============================================================
-- TABLE: coupon_usages
-- (track per-user coupon use for usage_limit_per_user enforcement)
-- ============================================================
CREATE TABLE IF NOT EXISTS coupon_usages (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id  uuid        NOT NULL,   -- logical ref → coupons.id
  user_id    uuid        NOT NULL,   -- logical ref → users.id
  booking_id uuid        NOT NULL,   -- logical ref → bookings.id
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX        IF NOT EXISTS coupon_usages_coupon_id_idx ON coupon_usages(coupon_id);
CREATE INDEX        IF NOT EXISTS coupon_usages_user_id_idx   ON coupon_usages(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS coupon_usages_unique_idx    ON coupon_usages(coupon_id, booking_id);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
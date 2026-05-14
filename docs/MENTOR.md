# BookKaroo — Project Mentor Summary

> Read this first. A senior dev explaining BookKaroo to a new team member (or Claude).
> For deep dives: see linked docs at the bottom of each section.

---

## What Is BookKaroo?

A **BookMyShow-style entertainment ticket booking platform** for the Indian market.
Users discover movies, live events, plays, sports (TATA IPL 2026), comedy shows, and activities across **25 Indian cities** — then book seats, pay, and receive a GST-compliant invoice by email.

**Phase 1 (current):** End-to-end booking MVP + admin panel.
**Phase 2 (future, do NOT implement):** Social login, F&B, recommendations, partner portal.

---

## Tech Stack — Why These Choices

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React 18 + Vite + TypeScript | Fast dev, code splitting, strict typing |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, no style drift, dark mode native |
| State | Zustand + TanStack Query | Lightweight, eliminates manual loading state boilerplate |
| Routing | React Router v6 (lazy) | Code splitting per route, straightforward nested routes |
| Forms | react-hook-form + zod | Type-safe validation, validate on blur + submit |
| Animation | framer-motion | Smooth page transitions and seat selection micro-interactions |
| Backend | .NET 8 Web API | Strong typing, excellent async/EF Core support |
| ORM | EF Core + Npgsql | Type-safe queries, migrations, global query filters |
| Validation | FluentValidation | Decoupled from controllers, auto-registered in DI |
| Logging | Serilog | Structured logs, Seq-compatible in production |
| Auth | JWT HS256 + BCrypt (cost 12) | Stateless, refresh via httpOnly cookie, no sessions |
| Database | Supabase (PostgreSQL) | Managed Postgres + Realtime + Storage in one platform |
| Realtime | Supabase Realtime (WebSockets) | Instant seat state sync without custom WebSocket server |
| Payments | Mock (Phase 1) → Razorpay (Phase 1.5) | IPaymentProvider abstraction swaps providers without code change |
| Email | Resend | Reliable transactional email, good React Email support |
| Movie data | TMDB API | Free, comprehensive, CDN-hosted poster images |
| Invoice | QuestPDF | Programmatic PDF with GST layout, no paid license for open-source |

---

## Architecture at a Glance

```
User Browser
  │ HTTPS
  ▼
React SPA (Vercel)
  │ REST + JWT        │ WebSocket (Supabase Realtime)
  ▼                   ▼
.NET 8 API (Render/Railway)    ←──  Supabase Realtime
  │
  ├── Supabase PostgreSQL (data)
  ├── Supabase Storage (QR codes, invoices, posters)
  ├── TMDB API (movie metadata + posters)
  ├── Resend (confirmation emails)
  └── IPaymentProvider (Mock | Razorpay | PayPal)

Railway Cron → DELETE expired seat_locks every 60s
```

### Backend Layers (strict, no skipping)
```
BookKaroo.Api          ← HTTP only (controllers, middleware)
BookKaroo.Application  ← Business logic (services, DTOs, validators, interfaces)
BookKaroo.Domain       ← Pure entities and enums (zero dependencies)
BookKaroo.Infrastructure ← EF Core, repos, external services
```

---

## Five Critical Architecture Decisions

### 1. No Foreign Keys
Tables reference each other by UUID column — **no FK constraints in the database**.
- Service layer checks existence before saving (e.g., verify `show_id` exists before creating `seat_locks`)
- EF Core navigation properties still configured (no `.OnDelete()`)
- Orphan rows possible → service-layer cleanup on soft delete
- **Why:** Avoids cross-table constraint failures during concurrent writes and schema evolution

### 2. Seat Locking (No Redis)
```
User clicks seat
  → POST /api/seat-locks
  → pg_try_advisory_lock(seatId hash)   ← PostgreSQL advisory lock
  → INSERT seat_locks (expires_at = now() + 8 min)
  → Supabase Realtime broadcasts to channel "show:{showId}"

Cron (every 60s):
  → DELETE seat_locks WHERE expires_at < now()
  → pg_advisory_unlock(seatId hash)
  → Broadcast unlock event

Payment capture (transaction):
  → DELETE seat_locks WHERE booking_id = ?
  → INSERT bookings + booking_seats
  → UPDATE payments SET status = 'captured'
  → COMMIT
```

### 3. Payment Provider Abstraction
```csharp
IPaymentProvider
  ├── MockPaymentProvider      Phase 1 — throws in Production (safety guard)
  ├── RazorpayPaymentProvider  Phase 1.5
  └── PayPalPaymentProvider    Phase 1.5 fallback
```
Selected via `PAYMENT_PROVIDER=mock` env var. Swap with zero code changes.

### 4. GST Calculation
BookKaroo charges GST only on **convenience fees** (not on ticket price — that's venue revenue):
- Convenience fee: ₹59/ticket
- Offer processing fee: ₹15 (only when coupon applied)
- **Intra-state** (customer state_code == `24` Gujarat): CGST 9% + SGST 9%
- **Inter-state** (customer state_code != `24`): IGST 18%
- `customer_state_code` stored on every booking for invoice generation

### 5. Soft Deletes Everywhere
Every table has `deleted_at timestamptz null`. Hard deletes are banned.
EF Core global query filter: `.HasQueryFilter(e => e.DeletedAt == null)` — auto-applies to all queries.

---

## Booking Flow (End-to-End)

```
Home
  → Movie/Event Detail   (TMDB poster, synopsis, ratings)
  → Showtimes            (7-day date picker, venues, time chips with availability)
  → Seat Selection       (8-min countdown, real-time locked seats, max 10)
  → Checkout             (GST breakdown, coupon input, T&C)
  → Mock Payment         (Phase 1: Simulate Success / Failure buttons)
  → Confirmation         (animated checkmark, ticket card, QR code, download invoice)
                              │
                              ├── Email: confirmation + GST invoice PDF
                              ├── WhatsApp share (wa.me link)
                              └── Add to Google Calendar
```

---

## Design System (Quick Reference)

| Token | Value | Use |
|-------|-------|-----|
| Base background | `#0A0E1A` | Page bg (`bg-[#0A0E1A]`) |
| Surface | `#131826` | Cards, panels |
| Primary text | `#F4F4F5` | Body copy |
| Secondary text | `#A1A1AA` | Subtitles, captions |
| Crimson accent | `#E50914` | Primary CTA, selected state |
| Indigo accent | `#6366F1` | Secondary CTA, links |
| Success | `#10B981` | Available seats, success state |
| Warning | `#F59E0B` | Locked seats (by others), warnings |
| Error | `#EF4444` | Error states |
| Display font | Playfair Display | Headings, movie titles |
| Body font | Inter | All UI text |
| Code font | JetBrains Mono | Booking refs, QR codes |

**Motion:** Skeleton loaders (not spinners). Page transitions: fade-up stagger. Hover: scale 1.02.
**Responsive:** 360px → 768px → 1024px → 1440px (mobile-first).
→ Full system: [docs/DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)

---

## Current Implementation Status

| Area | Status |
|------|--------|
| Design System | ✅ 100% — all tokens, components, screens |
| Backend Domain + Application | ✅ 100% — entities, services, DTOs, validators |
| Backend Infrastructure | 🔄 ~60% — DbContext done, repos in progress |
| Backend API Controllers | 🔄 ~40% — core controllers done |
| Frontend Pages | 🔄 ~40% — designed, partial API wiring |
| Database Migrations | ✅ Migrations 001-009 applied |
| End-to-end Booking | 🔄 In progress |
| Admin Panel | 🔄 ~30% — dashboard done, CRUD pages pending |

→ Detailed breakdown: [docs/STATUS.md](STATUS.md)
→ Known bugs: [docs/ISSUES.md](ISSUES.md) (30+ tracked)

---

## Common Gotchas

1. **Money fields:** `numeric(10,2)` in DB, `decimal` in C#. Never `float`/`double`. Even for display.
2. **Deleted records:** Always `WHERE deleted_at IS NULL` — EF global filter handles this automatically.
3. **Time zones:** Store UTC (`timestamptz`). Display IST on frontend. Never store local time.
4. **Seat grid:** Stored as JSON in `screens.layout_json`. Parse carefully — structure: `{ rows: [{ label, seats: [{ id, category, x, y }] }] }`.
5. **TMDB poster URLs:** `https://image.tmdb.org/t/p/w500/{poster_path}`. Use `w500` for cards, `original` for hero.
6. **Admin JWT:** Has `role: admin` claim. `AdminAuthMiddleware` checks this — do not rely on route guards alone.
7. **Idempotency:** Payment `POST /payments/order` requires `Idempotency-Key` (UUID) header. Generate on frontend, store in `idempotency_cache` table with 24h TTL.
8. **State code 24:** Company is Gujarat. All GST intra/inter-state logic pivots on `"24"`.

---

## What NOT to Do

| Constraint | Detail |
|-----------|--------|
| ❌ No `any` in TypeScript | Use `unknown`, narrow with type guards or zod |
| ❌ No hard deletes | Set `deleted_at = now()` |
| ❌ No inline CSS | Tailwind classes only |
| ❌ No FK constraints in DB | Service-layer integrity only |
| ❌ No files > 300 lines | Split into modules |
| ❌ No secrets in code | All in `.env`, never committed |
| ❌ No Redis | Seat locking via Postgres advisory locks |
| ❌ No class components | Functional + hooks only |
| ❌ No monoliths | One component/service per file |
| ❌ No Phase 2 features | Social login, F&B, recommendations, push notifications |

---

## Key Files Quick Reference

| File | What's In It |
|------|-------------|
| `CLAUDE.md` | Project constraints, tech stack, per-session workflow |
| `docs/PRD.md` | Full 1024-line product requirements (grep for sections) |
| `docs/DATABASE.md` | Schema, GST fields, settings keys table |
| `docs/API.md` | REST endpoint contracts |
| `docs/DESIGN-SYSTEM.md` | Colors, typography, component specs |
| `docs/ARCHITECTURE.md` | System diagram, request flows, env vars |
| `docs/GIT-WORKFLOW.md` | Branch strategy, commit format, PR process |
| `docs/COMPANY-DETAILS.md` | GST placeholder values, state codes, pre-launch checklist |
| `docs/ISSUES.md` | 30+ known bugs with context |
| `docs/HANDOFF.md` | Previous session state (check the date — may be stale) |
| `.claude/rules/` | Auto-loaded standards Claude follows for every task |

---

*This file: high-level orientation. For implementation depth, follow the links above.*

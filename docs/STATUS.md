# BookKaroo — Implementation Status

> Live tracker of what's built, what's partial, and what's next.
> Last updated: May 2026 | Bugs: [ISSUES.md](ISSUES.md) | Next priorities: [PRD.md](PRD.md)

---

## Legend
- ✅ Complete and working
- 🔄 Partial / in progress
- ❌ Not started
- 🐛 Has known bugs (see ISSUES.md)
- N/A Not applicable

---

## Infrastructure

| Component | Status | Notes |
|-----------|--------|-------|
| Database schema (all tables) | ✅ | All 22+ tables defined |
| EF Core migrations (001–009) | ✅ | Applied to Supabase |
| Supabase Realtime on seat_locks | ✅ | REPLICA IDENTITY FULL applied |
| Supabase Storage buckets | 🔄 | Created, RLS policies need review |
| Seat lock cron sweep (60s) | ✅ | SeatLockSweepService running |
| Payment provider abstraction | ✅ | IPaymentProvider + MockPaymentProvider |
| Email sending (Resend) | ✅ | Templates configured |
| GST invoice PDF (QuestPDF) | ✅ | Template complete |
| TMDB integration | ✅ | Poster fetch working |
| Idempotency on payment endpoints | ✅ | idempotency_cache table + service |
| Admin audit log | 🔄 | Table exists, not all mutations logged |

---

## Backend

### Auth
| Endpoint | Status | Notes |
|----------|--------|-------|
| POST /auth/signup | ✅ | |
| POST /auth/login | ✅ | |
| POST /auth/refresh | ✅ | |
| POST /auth/logout | ✅ | |
| POST /auth/forgot-password | ✅ | |
| POST /auth/reset-password | ✅ | |

### Users
| Endpoint | Status | Notes |
|----------|--------|-------|
| GET /users/me | ✅ | |
| PATCH /users/me | 🐛 | Returns 404 (Issue #20) |
| DELETE /users/me | ✅ | Soft delete |

### Movies
| Endpoint | Status | Notes |
|----------|--------|-------|
| GET /movies | ✅ | Filters by genre, language, format |
| GET /movies/:id | ✅ | |
| POST /movies | ✅ | Admin only |
| PUT /movies/:id | ✅ | Admin only |
| DELETE /movies/:id | ✅ | Soft delete, admin only |

### Events / Plays / Sports / Activities
| Endpoint | Status | Notes |
|----------|--------|-------|
| GET /events | ✅ | |
| GET /events/:id | ✅ | |
| CRUD (admin) | ✅ | |

### Showtimes & Venues
| Endpoint | Status | Notes |
|----------|--------|-------|
| GET /shows (by movie/event/date/city) | ✅ | |
| GET /venues | ✅ | |
| Admin CRUD | ✅ | |

### Seat Selection
| Endpoint | Status | Notes |
|----------|--------|-------|
| GET /shows/:id/seats | ✅ | Returns layout + locked/booked state |
| POST /seat-locks | ✅ | Advisory lock + Realtime broadcast |
| DELETE /seat-locks/:id | ✅ | Manual unlock |

### Booking & Payment
| Endpoint | Status | Notes |
|----------|--------|-------|
| POST /payments/order | ✅ | Idempotent, uses IPaymentProvider |
| POST /payments/mock-capture | ✅ | Phase 1 only |
| POST /payments/verify | ❌ | Phase 1.5 (Razorpay webhook) |
| POST /bookings (create) | ✅ | Transactional: delete locks + insert booking |
| GET /bookings/my | ✅ | |
| GET /bookings/:ref | ✅ | |
| POST /bookings/:id/cancel | ✅ | >2h window, refund logic |

### Notifications
| Feature | Status | Notes |
|---------|--------|-------|
| Booking confirmation email | ✅ | Sent fire-and-forget |
| GST invoice PDF attached to email | ✅ | |
| QR code generated + uploaded to Storage | ✅ | |
| Booking cancellation email | ✅ | |
| "Remind Me" email (coming-soon → now showing) | 🔄 | Service exists, trigger TBC |

### Admin
| Endpoint | Status | Notes |
|----------|--------|-------|
| GET /admin/dashboard (KPIs) | ✅ | Revenue, bookings, users, shows |
| Admin Movies CRUD | ✅ | |
| Admin Events CRUD | ✅ | |
| Admin Venues CRUD | ✅ | |
| Admin Shows CRUD | ✅ | |
| Admin Bookings management | ✅ | |
| Admin Users management | ✅ | |
| Admin Reports | 🔄 | Basic revenue report; charts TBC |
| Admin CMS (banners, promotions) | 🔄 | |
| Admin Settings (company details, GST) | ✅ | |

---

## Frontend

### Core Shell
| Feature | Status | Notes |
|---------|--------|-------|
| App router (lazy routes) | ✅ | |
| Theme (dark mode) | ✅ | No toggle yet (Issue #4) |
| Header (logo, city, search, auth) | 🔄 | Search not wired (Issue #15) |
| Footer | 🔄 | Links non-functional (Issue #13) |
| Auth guards (protected routes) | ✅ | |

### Auth Flow
| Feature | Status | Notes |
|---------|--------|-------|
| Signup | ✅ | Field label bug (Issue #2) |
| Login | ✅ | |
| Forgot / reset password | ✅ | |
| Sign out | 🐛 | Doesn't clear session (Issue #12) |

### Discovery
| Feature | Status | Notes |
|---------|--------|-------|
| Home page (hero, rails) | ✅ | |
| Movie listing + filters | 🔄 | Images broken (Issue #1), no city filter (Issue #14) |
| Movie detail | 🔄 | Trailer shows YouTube redirect, not modal (Issue #6) |
| Events listing | ❌ | "Coming soon" (Issue #7) |
| Plays / Sports / Activities | ❌ | "Coming soon" (Issues #8, #9) |
| IPL special page | ❌ | "Coming soon" (Issue #5) |
| Search | 🔄 | UI exists, not wired to API (Issue #15) |
| Showtimes page | ✅ | |

### Booking Flow
| Feature | Status | Notes |
|---------|--------|-------|
| Seat selection grid | 🔄 | UI partial, Realtime not connected (Issue #3) |
| Seat countdown timer | 🔄 | Component exists, not integrated |
| Checkout (GST breakdown) | 🔄 | Layout done, not wired |
| Mock payment dialog | 🔄 | |
| Confirmation page | 🔄 | |

### Profile & Bookings
| Feature | Status | Notes |
|---------|--------|-------|
| Profile page (view) | ✅ | |
| Profile edit | 🐛 | Shows email only (Issue #22), API 404 (Issue #20) |
| My Bookings | ❌ | "Coming soon" (Issue #10) |
| Cancel booking | ❌ | |

### Admin Panel
| Feature | Status | Notes |
|---------|--------|-------|
| Admin login | 🐛 | Redirect loop bug (Issue #21) |
| Dashboard (KPIs + recent bookings) | ✅ | |
| Movies CRUD | ❌ | "Coming soon" (Issue #23) |
| Events / Venues / Shows CRUD | ❌ | "Coming soon" (Issues #24–26) |
| Bookings management | ❌ | "Coming soon" |
| Users management | ❌ | "Coming soon" |
| Reports | ❌ | "Coming soon" |
| Settings | ❌ | "Coming soon" |

---

## Next Priorities (Suggested Order)

1. **Fix sign-out bug** (Issue #12) — critical for auth flow
2. **Fix profile PATCH 404** (Issue #20) — backend routing issue
3. **Wire seat selection to API** — frontend ↔ backend for core booking path
4. **Fix movie images** (Issue #1) — TMDB poster URL construction
5. **Complete booking flow frontend** — checkout, mock payment, confirmation
6. **My Bookings page** — closes the user journey loop
7. **Admin CRUD pages** — Movies, Events, Venues, Shows (backend is ready)
8. **Events / Plays / Sports pages** — unblock content discovery

---

*Full feature spec: [PRD.md](PRD.md) | All known bugs: [ISSUES.md](ISSUES.md)*

# BookKaroo — API Contracts

> Base URL (dev): `http://localhost:5000/api` | (prod): `https://api.bookkaroo.com/api`
> All responses: JSON. Errors: RFC 7807 ProblemDetails.
> Auth: `Authorization: Bearer <accessToken>` unless noted.

## Conventions
- All list endpoints: `?page=1&pageSize=20&sort=field:asc`
- Date format: ISO 8601
- Money: number in INR (no currency in payload, always INR)
- Validation errors: HTTP 400 + `{ type, title, status, errors: { field: [msg] } }`

---

## Auth

### POST /auth/signup
**Body:** `{ email, password, name, dob, gender, mobile, cityId }`
**Returns:** `201 { user, accessToken }` + httpOnly refresh cookie

### POST /auth/login
**Body:** `{ identifier, password }` (identifier = email or mobile)
**Returns:** `200 { user, accessToken }` + cookie

### POST /auth/refresh
**Cookie:** refresh_token
**Returns:** `200 { accessToken }` + new cookie

### POST /auth/logout
**Returns:** `204` + clears cookie

### POST /auth/forgot-password
**Body:** `{ email }`
**Returns:** `200` (always, to prevent enumeration)

### POST /auth/reset-password
**Body:** `{ token, newPassword }`
**Returns:** `200`

### GET /auth/me
**Returns:** `200 user`

---

## Users / Profile

### PATCH /users/me
**Body:** partial profile
**Returns:** updated user

### PATCH /users/me/password
**Body:** `{ currentPassword, newPassword }`

### PATCH /users/me/preferences
**Body:** `{ language?, genre?, notifications? }`

### DELETE /users/me
Soft delete account.

---

## Cities

### GET /cities
**Returns:** `City[]` (cached, no auth required)

### GET /cities/detect
**Header:** `X-Forwarded-For` (IP)
**Returns:** `{ city, confidence }` or 404

---

## Movies

### GET /movies
**Query:** `cityId, language[], genre[], category, format[], sort, page, pageSize`
**Returns:** `{ items: Movie[], total, page, pageSize }`

### GET /movies/{slug}
**Returns:** `MovieDetail` (includes cast, crew, gallery, reviews summary)

### GET /movies/{slug}/showtimes?cityId=&date=
**Returns:** `{ venues: [{ venue, screens: [{ screen, shows: Show[] }] }] }`

### GET /movies/{id}/reviews?sort=helpful&page=
**Returns:** paginated reviews

### POST /movies/{id}/reviews
*Auth required, must have confirmed booking for this movie*
**Body:** `{ rating, title, body }`

### POST /movies/{id}/remind-me
*Auth required*
For Coming Soon movies — opt in for release email.

---

## Events (covers IPL, plays, sports, concerts, comedy, activities)

### GET /events
**Query:** `cityId, type, date, page, pageSize`

### GET /events/{slug}
### POST /events/{id}/reviews
### POST /events/{id}/remind-me

---

## Shows

### GET /shows/{id}
**Returns:** show + screen layout + seat states (booked, locked)

### GET /shows/{id}/seats
**Returns:** `{ layout, bookedSeats[], lockedSeats[] }`
*FE subscribes to Supabase Realtime channel `show:{id}` for live updates*

---

## Seat Locks

### POST /seat-locks
*Auth required*
**Body:** `{ showId, seats: ["A1","A2"] }`
**Returns:** `201 { lockId, expiresAt, seats }`
**Errors:** 409 if any seat already locked/booked

### DELETE /seat-locks/{lockId}
Release lock voluntarily.

---

## Payments

### POST /payments/order
*Auth required, idempotent via `Idempotency-Key` header*
**Body:** `{ showId, seats[], couponCode? }`
**Returns:** `{ orderId, razorpayKeyId, amount, currency, breakdown: { subtotal, fee, gst, discount, total } }`

### POST /payments/verify
**Body:** `{ razorpayOrderId, razorpayPaymentId, razorpaySignature }`
**Returns:** `{ booking }`

### POST /payments/webhook
*Razorpay calls this with signature header.*
Internal signature verification → mark payment status → trigger booking finalize.

---

## Bookings

### GET /bookings/me?status=upcoming|past
**Returns:** `Booking[]`

### GET /bookings/{ref}
**Returns:** full booking detail (movie, show, seats, payment, QR url)

### POST /bookings/{ref}/cancel
**Returns:** `{ refundId, refundAmount, status }`
**Errors:** 400 if show <2h away

### GET /bookings/{ref}/ticket
Streams PDF.

---

## Search

### GET /search?q=&cityId=
**Returns:** `{ movies: [], events: [], venues: [], cities: [] }` (top 5 each)

---

## Coupons

### POST /coupons/validate
**Body:** `{ code, showId, subtotal }`
**Returns:** `{ valid, discount, finalTotal }`

---

## Admin (all require `role=admin`)

### GET /admin/dashboard
KPIs + chart data.

### GET /admin/movies, POST, PATCH /{id}, DELETE /{id}
### GET /admin/events, POST, PATCH /{id}, DELETE /{id}
### GET /admin/venues, POST, PATCH /{id}, DELETE /{id}
### GET /admin/screens, POST, PATCH /{id}, DELETE /{id}
### GET /admin/shows, POST, PATCH /{id}, POST /{id}/cancel
### GET /admin/bookings, GET /{id}, POST /{id}/cancel, POST /{id}/refund
### GET /admin/users, GET /{id}, POST /{id}/block, POST /{id}/unblock, POST /{id}/reset-password
### GET /admin/reports/bookings?from=&to=&groupBy=
### GET /admin/reports/revenue?from=&to=
### GET /admin/reports/users?from=&to=
### GET /admin/banners, POST, PATCH /{id}, DELETE /{id}
### GET /admin/settings, PATCH /{key}
### GET /admin/audit-logs?entityType=&entityId=&page=

---

## TMDB Sync (admin)

### POST /admin/movies/sync-tmdb
**Body:** `{ tmdbId }`
Pulls movie metadata, creates draft.

### POST /admin/movies/import-popular
Pulls TMDB popular and seeds drafts.

---

## Health

### GET /health
**Returns:** `{ status: "ok", db: "ok", uptime }`

---

## Rate Limits
- `/auth/*`: 10 req/min/IP
- `/payments/*`: 30 req/min/user
- All others: 100 req/min/user

## Standard Error Format
```json
{
  "type": "https://bookkaroo.com/errors/validation",
  "title": "Validation Failed",
  "status": 400,
  "detail": "One or more validation errors occurred",
  "errors": {
    "email": ["Email is invalid"]
  },
  "traceId": "00-abc..."
}
```

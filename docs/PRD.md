# BookKaroo — Product Requirements Document

> **Owner:** Sanjay | **Status:** Phase 1 in active development | **Last updated:** 2026-05-08

## 1. Vision
BookKaroo is India's premium entertainment ticket booking platform — a BookMyShow competitor focused on cinematic UX, frictionless checkout, and discovery across movies, live events, sports, plays, and activities.

## 2. Scope

### Phase 1 (MVP — current)
End-to-end booking flow: discover → select seat → pay → receive ticket. Plus admin panel.

### Phase 2 (next)
Social login, recommendations, F&B add-ons, advanced offers/coupons, partner portal, multi-channel notifications, voice search, wishlist, advanced reviews.

## 3. User Roles

| Role | Permissions |
|---|---|
| Guest | Browse, search, view details, see reviews |
| Registered User | All Guest + book, review, save favorites, manage profile |
| Admin | Full CRUD on movies, events, plays, sports, activities, IPL, venues, shows, users, banners, settings |
| (Phase 2) Venue Partner | Manage own venues, screens, shows; view own bookings/revenue |

---

## 4. Phase 1 Features

### 4.1 Auth
- **Sign up:** email + password (≥8 chars, 1 upper, 1 number, 1 special)
- Profile fields: name, DOB, gender, city, mobile, profile pic
- **Login:** email/mobile + password
- Forgot password (email reset link)
- JWT access (15 min) + refresh token (30 days, httpOnly cookie)

### 4.2 Profile
- View/edit profile
- Change password (requires current password)
- Preferences: language, genre, notification settings
- Soft delete account

### 4.3 Location & City
- Auto-detect city via IP geolocation on first visit
- Manual selector modal with search + 25 seed cities
- Persist in localStorage
- Cities: Mumbai, Delhi-NCR, Bangalore, Hyderabad, Ahmedabad, Chennai, Pune, Kolkata, Jaipur, Lucknow, Chandigarh, Kochi, Goa, Indore, Bhopal, Nagpur, Surat, Vadodara, Coimbatore, Mysore, Visakhapatnam, Bhubaneswar, Guwahati, Patna, Thiruvananthapuram

### 4.4 Home Page
- Hero carousel (Unsplash images, seeded)
- "Movies — Now Showing" rail (city-filtered)
- "Coming Soon" section
- "Live Events" section
- "Plays", "Sports", "Activities" sections
- IPL 2026 promotional strip → `/ipl` page
- Promotional banner strip
- Footer: about, careers, list your show, contact, T&C, privacy, FAQ, sitemap

### 4.5 Movies Module

**Listing `/movies`**
- Filters (multi-select): Languages (10), Genres (11), Categories (4)
- Sort: Popularity, Release Date, Rating, A-Z
- Grid view (poster + title + rating + languages)
- Pagination (20/page)

**Detail `/movies/:slug`**
- Backdrop banner + poster
- Title, IMDb-style rating, duration, genre tags, languages, formats, release date, certificate
- "Book Tickets" CTA → showtimes
- YouTube trailer embed
- Cast & Crew carousel
- Reviews & ratings (overall + user reviews + thumbs up/down)
- User can rate (1-10) + write review **after booking**
- Sort reviews: Most helpful, Most recent, Highest, Lowest
- Photo gallery
- About section (production, music)
- Sticky "Book Tickets" bar on scroll
- "Remind Me" for Coming Soon → email when status changes to Released

### 4.6 Showtimes `/movies/:slug/showtimes`
- Date selector: today + next 6 days (7 tabs)
- Grouped by venue:
  - Venue name, area, amenities badges (Parking, Food Court, M-Ticket)
  - Time chips per show with format tag (2D/3D) + availability color
- Click chip → Seat Selection

### 4.7 Seat Selection `/booking/:showId/seats`
- Screen indicator at top
- Seat grid (rows × cols from layout JSON)
- States: Available, Selected, Booked
- Categories with color + price: Recliner, Gold, Executive, Normal
- Row labels (A, B, C…)
- Max 10 seats per booking
- Real-time updates via Supabase Realtime (others' selections shown locked)
- 8-min countdown ring (SVG circular, pulsing red at <50s)
- Bottom bar: seat list, total, "Pay" button, legend
- Quick seat-count selector (1-10)

**Seat Lock Mechanism**
- On select: INSERT into `seat_locks` with `expires_at = now() + 8min`
- Postgres advisory lock per seat to prevent race
- Cron sweep expired locks every 60s (Supabase Edge Function or backend hosted service)
- On payment success: delete lock → create booking
- On timeout/cancel: delete lock

### 4.8 Checkout

**Order Summary**
- Movie title, format, language, date, time, venue, screen
- Selected seats + category breakdown
- Price breakdown:
  - Subtotal
  - Convenience fee: ₹25/seat
  - GST: 18% on convenience fee only
  - **Grand Total**
- Pre-filled mobile + email
- T&C checkbox
- 8-min timer visible
- "Proceed to Pay" button

**Payment (Razorpay sandbox)**
- Razorpay checkout modal (UPI, Card, Net Banking)
- Server-side payment verification on success
- Idempotency: one order ID per checkout (prevent double charge)
- Failure: retry / change method

### 4.9 Booking Confirmation
- Booking ref: `BK-YYYYMMDD-XXXXX`
- QR code (encodes booking ID, stored in Supabase storage)
- Details: movie, show, venue, seats, amount paid
- "Download Ticket" → PDF (or printable)
- "Go to My Bookings" link
- Email confirmation via Resend (with QR + invoice PDF attached)
- WhatsApp share via wa.me link
- Google Calendar event creation
- Cancellation policy notice

### 4.10 My Bookings `/profile/bookings`
- Tabs: Upcoming | Past
- Card: poster, movie name, date, time, venue, seats, booking ID, status
- "View Ticket" → confirmation page
- **Cancel:**
  - Only if show >2h away
  - Cancellation fee = convenience fee (non-refundable)
  - Razorpay refund API (sandbox)
  - Status → Cancelled

### 4.11 Search
- Header search bar
- Searches: movies, events, venues, cities
- Autocomplete with thumbnail + category
- Recent searches (localStorage)
- Search results page with filters

### 4.12 Help & Support
- FAQ page
- Contact form
- Booking-specific help (linked from each booking)

### 4.13 IPL 2026 `/ipl`
- Team cards
- Match schedule
- Countdown timer
- Special branding
- Reuses sports booking flow

### 4.14 Admin Panel `/admin`

**Dashboard**
- KPIs: Today's bookings, Revenue (today/week/month), Active users, Top movies
- City-wise booking chart

**Movies Management:** CRUD with all fields + status (Draft/Published/Archived)

**Events Management:** CRUD with event-specific fields

**Venues Management:** CRUD + screens (layout JSON editor for rows/cols/categories/blocked)

**Shows Management:** Create show (movie + screen + date + time + price tiers) + cancel

**Bookings Management:** Table with filters, view details, cancel, refund

**Users Management:** List, search, filter, view profile + booking history, block/unblock, reset password

**Reports:** Booking reports (by movie/venue/city/date), revenue, user acquisition. CSV/Excel export.

**CMS:** Home banners, static pages (T&C, Privacy, FAQ)

**Settings:** Convenience fee, GST rate, cancellation policy, email/SMS templates, payment gateway keys

### 4.15 Notifications (Phase 1 minimal)
- Email on booking confirm (via Resend, with invoice PDF attached + QR)
- WhatsApp share via wa.me link
- Google Calendar event

---

## 5. Phase 2 Features (Backlog)

### 5.1 Auth
- Social login: Google, Facebook (Firebase Auth stub)
- Remember me (30-day refresh token already in P1, formalize UX)

### 5.2 Profile
- Linked accounts (Google/Facebook)
- Saved cards (Razorpay tokenization)
- Address book (for merchandise)
- Preferences expanded: language, genre, notifications granularity

### 5.3 Location & Home
- Persist city in user profile (in addition to localStorage)
- "Recommended Movies" rail (personalized)
- "Premieres" section
- "Best of Stand-Up Comedy"
- Newsletter signup

### 5.4 Movies — Advanced Filters
- Format filter: 2D, 3D, IMAX, IMAX 3D, 4DX, Dolby, EPIQ, MX4D, ICE
- "Hide languages I don't speak" preference

### 5.5 Movie Detail (Phase 2 additions)
- Critics reviews
- Related movies rail
- Share buttons (WhatsApp, FB, Twitter, copy link)

### 5.6 Showtimes — Advanced
- Filters: price slider, time-of-day buckets, format, chain, amenities (wheelchair, subtitles, recliner)
- Map view with Google Maps pins
- "Sold out" state polish

### 5.7 Cinemas Page `/cinemas`
- All venues in city, search, filter, click → all movies playing there

### 5.8 Seat Selection (Phase 2 polish)
- Aisle gaps rendered correctly
- Pinch-to-zoom mobile, scroll-zoom desktop
- "Best available" auto-suggest

### 5.9 Checkout (Phase 2)
- Coupon input + auto-applied offers
- F&B add-ons (popcorn combos)
- Merchandise add-ons
- Save card (tokenized)

### 5.10 Offers Engine
- Bank offers (HDFC, ICICI, SBI)
- Wallet offers (Paytm, Mobikwik)
- BOGO, flat, percentage with cap
- First-booking offer
- City/movie/day-specific (Cheap Tuesday)
- T&C page
- Admin coupon CRUD with usage analytics

### 5.11 Events Module
Same pattern as Movies for: Live Events, Plays, Sports, Activities, Comedy
- Single event date (no daily showtimes)
- Tiered tickets (Bronze/Silver/Gold/Platinum or sections)
- Section/zone selection for non-numbered seating
- Numbered seating for premium events
- Organizer details, age restriction, lineup
- Non-cinema venues (stadium, auditorium, open ground)

### 5.12 Search (Phase 2)
- Trending searches
- Voice search
- Empty state with suggestions

### 5.13 User Dashboard (Phase 2)
- Wishlist with release/showtime notifications
- All reviews written by user, edit/delete
- In-app notifications center
- Reminders (1 day + 1 hour before show)

### 5.14 Reviews (Phase 2)
- Like/dislike others' reviews
- Report inappropriate
- Verified booking badge
- Spoiler warning toggle

### 5.15 Admin (Phase 2)
- Recent activity log
- Bulk import movies (CSV)
- Visual screen layout editor (drag-drop)
- Bulk show creation (recurring)
- Reviews moderation queue

### 5.16 Venue Partner Portal (Phase 2)
- Manage own venues/screens/shows
- Own bookings + revenue
- Settlement reports

### 5.17 Notifications (Phase 2)
**Triggers:** booking confirmed, 1d/1h before show, cancellation, refund, new offers, new release (wishlist)
**Channels:** Email, WhatsApp (via API), in-app

---

## 6. Non-Functional Requirements

### Performance
- LCP < 2s, TTI < 3s
- API p95: < 300ms cached, < 800ms DB
- Code splitting per route
- Image lazy load + webp

### Security
- BCrypt cost 12 password hashing
- JWT short-lived + refresh token httpOnly
- Rate limit auth endpoints
- Parameterized queries only
- HTTPS enforced
- Secrets in env vars

### Reliability
- Retry with exponential backoff on external APIs
- Idempotency keys on payment
- Webhook reconciliation for Razorpay

### Accessibility
- WCAG 2.1 AA
- Semantic HTML, ARIA labels
- Keyboard nav, focus rings
- Screen reader friendly seat grid
- Contrast ≥ 4.5:1
- Alt text on all images

### Responsive
- Mobile-first
- Breakpoints: 360, 768, 1024, 1440
- Touch-optimized seat selection
- Bottom-sheet modals on mobile

## 7. Success Metrics
- All P0 user journeys functional E2E
- Zero double-bookings under 100 concurrent users (load test)
- Zero critical security vulnerabilities (OWASP Top 10 scan)
- Lighthouse: Perf ≥ 85, A11y ≥ 95

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Seat double-booking | Advisory locks + DB transaction + load test |
| Payment failures | Idempotency keys + webhook reconciliation + retry job |
| Orphan rows (no FKs) | Service-layer integrity checks + nightly cleanup job |
| AI-generated bugs | Per-feature commits + tests + manual review |
| Scope creep | Strict phase boundaries; defer additions to Phase 2 |

## 9. Glossary
- **Show:** scheduled screening at a specific screen, date, time
- **Screen:** physical auditorium within a venue
- **Venue:** cinema/theatre/stadium location
- **Lock:** temporary hold on a seat during checkout
- **Booking:** confirmed purchase after successful payment
- **Order:** booking + payment combined transaction

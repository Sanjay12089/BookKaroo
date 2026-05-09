# BookKaroo — Handoff Document

> **Generated:** 2026-05-09  
> **Context:** ~80% — handing off for continuation  
> **Branch:** `feat/backend-scaffold` (uncommitted, all files present on disk)  
> **Next AI:** Continue from **Infrastructure layer** — DbContext + Repositories

---

## 1. Project Overview

BookKaroo is a BookMyShow-style entertainment ticket booking platform for India.  
Phase 1 MVP: movie discovery → seat selection → mock payment → GST invoice + email.

**Key docs to read first:**
- `/CLAUDE.md` — project rules, tech stack, don'ts
- `/SKILLS.md` — coding standards (strict TypeScript, layered .NET, no any, no FKs)
- `/docs/PRD.md` — full product requirements
- `/docs/ARCHITECTURE.md` — system design, payment provider abstraction
- `/docs/API.md` — REST endpoint contracts
- `/docs/DATABASE.md` — schema + patch notes (patch v2 in effect)
- `/docs/INVOICE-TEMPLATE.md` — QuestPDF A4 GST invoice layout
- `/docs/EMAIL-TEMPLATES.md` — Resend HTML email templates
- `/docs/COMPANY-DETAILS.md` — GST details, state codes, settings seed data

---

## 2. What Is DONE

### Design System (`frontend/src/design/`) — 100% complete, committed on `feat/design-system`

| File | Status |
|---|---|
| `tokens.ts` | ✅ CSS var-based dark/light theme tokens |
| `Logo.tsx` | ✅ Full SVG logo, 4 variants, 4 themes, glow |
| `DesignSystem.tsx` | ✅ 13 components: Button, Card, GlassCard, Badge, Chip, Skeleton, Input, Modal, BottomSheet, StarRating, CountdownRing, SectionHeader, Toast |
| `theme.ts` + `ThemeContext.tsx` | ✅ CSS custom properties, light/dark toggle, ThemeProvider, ThemeToggle |
| `screens/mockData.ts` | ✅ 8 movies, 3 coming-soon, 3 Ahmedabad venues, seat layout builder |
| `screens/Home.tsx` | ✅ Hero carousel, IPL strip, rails, events grid, footer |
| `screens/MoviesList.tsx` | ✅ Filter chips, sort, grid, empty state, skeleton, pagination |
| `screens/MovieDetail.tsx` | ✅ Backdrop, tabs (About/Cast/Reviews/Photos), sticky CTA |
| `screens/Showtimes.tsx` | ✅ 7-day strip, venue cards, time chips, legend |
| `screens/SeatSelection.tsx` | ✅ Seat grid 12×18, countdown ring, bottom bar, quick-pick |
| `screens/Checkout.tsx` | ✅ Two-panel, GST breakdown, coupon (KGF450), T&C |
| `screens/Confirmation.tsx` | ✅ Confetti, ticket card, QR placeholder, stamp animation |
| `screens/MyBookings.tsx` | ✅ Profile header, tabs, booking cards, cancel logic |
| `screens/AdminDashboard.tsx` | ✅ Sidebar, KPI cards, bar chart, table, activity log |
| `screens/Preview.tsx` | ✅ All 9 screens in browser frames, floating nav, theme toggle |
| `index.ts` | ✅ Barrel exports |
| `README.md` | ✅ Usage guide, token reference, component catalogue |

**Frontend Vite app is runnable:** `cd frontend && npm install && npm run dev`  
Preview at `http://localhost:5173` (or next available port)

### Backend Scaffold (`backend/`) — partially done, on `feat/backend-scaffold` (NOT YET COMMITTED)

**Solution structure created:**
```
backend/
├── BookKaroo.sln
├── src/
│   ├── BookKaroo.Api/           ← has auto-generated Program.cs only
│   ├── BookKaroo.Application/   ← FULLY WRITTEN (see below)
│   ├── BookKaroo.Domain/        ← FULLY WRITTEN (see below)
│   └── BookKaroo.Infrastructure/ ← EMPTY — next task
└── tests/
    └── BookKaroo.Tests/          ← EMPTY — next task
```

**NuGet packages already added:**
- Api: `Serilog.AspNetCore`, `Serilog.Sinks.Console`, `Serilog.Sinks.File`, `Microsoft.AspNetCore.Authentication.JwtBearer 8.0.12`, `Swashbuckle.AspNetCore`, `AspNetCoreRateLimit`, `Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore`
- Application: `FluentValidation.AspNetCore 11.3.0`, `AutoMapper 13.0.1`
- Infrastructure: `Npgsql.EntityFrameworkCore.PostgreSQL 8.0.11`, `Microsoft.EntityFrameworkCore.Design 8.0.12`, `BCrypt.Net-Next 4.0.3`, `QuestPDF 2024.10.3`, `Microsoft.Extensions.Http`, `FluentValidation`
- Tests: `Moq 4.20.72`, `FluentAssertions 6.12.2`, `Microsoft.AspNetCore.Mvc.Testing 8.0.12`

**Domain layer (`BookKaroo.Domain`) — 100% written:**
- `Enums/`: UserRole, BookingStatus, PaymentStatus, PaymentProvider, MovieStatus, MovieCategory, EventType, ShowStatus, ReviewStatus, CouponType (10 files)
- `Entities/`: BaseEntity, User, City, Venue, Screen, Movie, Event, Show, SeatLock, Coupon, Booking, BookingSeat, Payment, Review, Notification, CmsBanner, AuditLog, Setting, RemindMe, CouponUsage, IdempotencyKey, PasswordResetToken (22 files)

**Application layer (`BookKaroo.Application`) — 100% written:**
- `Exceptions/AppException.cs` — AppException, NotFoundException, ConflictException, UnauthorizedException, ForbiddenException, ValidationException
- `Interfaces/Repositories/` — IRepository\<T\>, IUserRepository, ICityRepository, IMovieRepository, IBookingRepository, ISeatLockRepository, ICouponRepository, ISettingRepository, IRemindMeRepository, IPasswordResetTokenRepository (10 files)
- `Interfaces/Services/` — IAuthService, ICityService, IPricingService, IEmailService, IInvoicePdfGenerator, IPaymentProvider (6 files)
- `DTOs/` — Auth (6 records), Cities (1), Pricing (1), Payment (4), Invoice (1 with InvoiceLine + GstSummary) (13 files)
- `Validators/` — SignupRequestValidator, LoginRequestValidator, ResetPasswordRequestValidator (3 files)
- `Services/AuthService.cs` — **FULLY IMPLEMENTED**: signup (BCrypt cost 12), login (email or mobile), refresh (token rotation), logout, forgot-password (SHA-256 hash, email fire-and-forget), reset-password, getMe; JWT HS256 generation
- `Services/PricingService.cs` — **FULLY IMPLEMENTED**: GST intra/inter-state logic, flat/percent coupons, offer processing fee, Math.Round AwayFromZero
- `Services/CityService.cs` — **FULLY IMPLEMENTED**: GetAllAsync (ordered by name), DetectFromIpAsync (ip-api.com)

---

## 3. What Is NOT DONE — Next Steps

### Step 1: Infrastructure Layer (NEXT — most critical)

Create these files in `backend/src/BookKaroo.Infrastructure/`:

#### `Data/BookKarooDbContext.cs`
EF Core DbContext with:
- DbSet for every entity (21 DbSets)
- `OnModelCreating`:
  - **No foreign keys** — just `HasIndex()` on every UUID reference column
  - `Setting`: `HasKey(s => s.Key)` (no Id column)
  - `AuditLog`, `SeatLock`, `BookingSeat`, `IdempotencyKey`, `PasswordResetToken`: no standard UpdatedAt behavior
  - Money columns: `HasColumnType("numeric(10,2)")`
  - String arrays (Movie.Languages, Movie.Formats, Movie.Genres, Notification.SentVia): `HasColumnType("text[]")`
  - Guid arrays (Coupon.ApplicableCities, etc.): `HasColumnType("uuid[]")`
  - Movie.Cast property must use `HasColumnName("movie_cast")` — "cast" is a reserved SQL word
  - All entities: `HasQueryFilter(e => e.DeletedAt == null)` (global soft delete filter)
  - Override `SaveChangesAsync` to auto-set `UpdatedAt = DateTime.UtcNow`

#### `Repositories/` (implement all 10 interfaces)
Base `Repository<T>` using DbContext + EF. All queries already filtered by global soft-delete.
Key methods: `SoftDeleteAsync` sets `DeletedAt = DateTime.UtcNow`.

Special repositories:
- `UserRepository`: `FindByRefreshTokenAsync` — load all active users with non-null RefreshToken, then BCrypt.Verify in memory (can't hash-match in SQL). This is acceptable since refresh tokens are rare lookups.
- `SettingRepository`: uses `Setting` entity with string key PK; `GetAllAsync` returns `Dictionary<string, string>`

#### `Payment/MockPaymentProvider.cs`
```csharp
// Constructor MUST throw InvalidOperationException if IHostEnvironment.IsProduction()
// CreateOrderAsync → returns synthetic MOCK-{Guid} order
// CaptureAsync → returns success PaymentCapture
// RefundAsync → returns success RefundResult
// VerifyWebhookSignatureAsync → always true
```

#### `Email/ResendEmailService.cs`
- POST to `https://api.resend.com/emails` using IHttpClientFactory
- Auth: `Authorization: Bearer {RESEND_API_KEY}` from config
- `SendBookingConfirmationAsync`: render booking-confirmation.html template from `/docs/EMAIL-TEMPLATES.md`, attach PDF as base64
- Templates: use simple `string.Replace("{{var}}", value)` for MVP (Scriban is optional)
- Other methods: send minimal appropriate emails

#### `Pdf/QuestPdfInvoiceGenerator.cs`
- `QuestPDF.Settings.License = LicenseType.Community` (static constructor)
- A4 portrait, 30mm margins
- Implement full layout from `/docs/INVOICE-TEMPLATE.md`:
  - Header: "Invoice" left, BookKaroo wordmark right
  - Two-column block: customer info left, company info right
  - Line items table (15 columns per spec)
  - Tax summary (right-aligned)
  - Amount in words (Indian numbering: lakh/crore)
  - Note about venue revenue
  - Payment reference block
  - Signature line

#### `Common/AmountInWordsConverter.cs`
Indian numbering: One, Eleven, Hundred, Thousand, Lakh, Crore.

#### `ExternalServices/TmdbService.cs`
- BaseAddress: `https://api.themoviedb.org/3/`
- Bearer token from `TMDB_BEARER` env
- `GetMovieAsync(tmdbId)`, `SearchAsync(query)`, `GetPopularAsync()`

#### `Storage/SupabaseStorageService.cs`
- Use `Supabase` C# client (service role key)
- `UploadQrAsync`, `UploadInvoiceAsync`, `GetSignedUrlAsync`

---

### Step 2: API Layer

Replace `backend/src/BookKaroo.Api/Program.cs` with full implementation per spec:
1. Serilog with Console + rolling file
2. DbContext from `DATABASE_URL` env
3. JWT HS256 auth
4. FluentValidation auto-validation (scan Application assembly)
5. AutoMapper (scan Application assembly)
6. AspNetCoreRateLimit (IP-based, load from appsettings)
7. CORS from `CORS_ALLOWED_ORIGINS` env
8. Swagger with JWT bearer support
9. Health checks with Npgsql
10. QuestPDF license
11. IPaymentProvider DI — read `PAYMENT_PROVIDER` env
12. Register all services/repositories (Scoped)
13. CorrelationIdMiddleware
14. GlobalExceptionMiddleware → RFC 7807 ProblemDetails
15. MapControllers, MapHealthChecks, UseSwagger

**Middleware to create:**
- `Middleware/GlobalExceptionMiddleware.cs`
- `Middleware/CorrelationIdMiddleware.cs`

**Controllers to create:**
- `Controllers/AuthController.cs` — FULLY IMPLEMENT (7 endpoints)
- `Controllers/CitiesController.cs` — FULLY IMPLEMENT (2 endpoints)
- `Controllers/HealthController.cs` — GET /health
- All other controllers (Movies, Events, Shows, Bookings, Payments, Search, Coupons, Admin, Venues) — return `501 { message: "Coming in next sprint" }`

---

### Step 3: Tests (`tests/BookKaroo.Tests/`)

**AuthServiceTests.cs** (7 tests):
- SignupAsync_ValidInput_CreatesUserAndSendsEmail
- SignupAsync_DuplicateEmail_ThrowsConflictException
- LoginAsync_ValidCredentials_ReturnsTokens
- LoginAsync_WrongPassword_ThrowsUnauthorizedException
- LoginAsync_BlockedUser_ThrowsForbiddenException
- RefreshAsync_ValidToken_RotatesToken
- RefreshAsync_ExpiredToken_ThrowsUnauthorizedException

**PricingServiceTests.cs** (7 tests):
- Calculate_IntraState_ReturnsCgstAndSgst
- Calculate_InterState_ReturnsIgst
- Calculate_WithFlatCoupon_AppliesDiscount
- Calculate_WithPercentCoupon_AppliesDiscountWithCap
- Calculate_WithCoupon_IncludesOfferProcessingFee
- Calculate_WithoutCoupon_NoOfferProcessingFee
- Calculate_RoundsToTwoDecimalPlaces

**CityServiceTests.cs** (3 tests):
- GetAllAsync_ReturnsCitiesOrderedByName
- DetectFromIp_ValidIp_ReturnsMatchingCity
- DetectFromIp_UnknownIp_ReturnsNull

Pattern: xUnit + Moq + FluentAssertions. AAA layout. Mock all repositories.

---

### Step 4: appsettings + .env

**`backend/src/BookKaroo.Api/appsettings.json`** — Serilog config, rate limiting rules, Swagger info  
**`backend/src/BookKaroo.Api/appsettings.Development.json`** — verbose logging, Swagger enabled  
**`backend/.env.example`** — all env vars from `/docs/ARCHITECTURE.md §10`

---

### Step 5: Verify Build

```bash
cd backend
dotnet build    # must: 0 errors, 0 warnings
dotnet test     # must: all tests pass
cd src/BookKaroo.Api && dotnet run
# GET http://localhost:5000/health → { status: "ok" }
# GET http://localhost:5000/swagger → Swagger UI
# POST http://localhost:5000/api/auth/signup → creates user
# GET http://localhost:5000/api/cities → 25 cities
```

---

### Step 6: Git & PR

```bash
git add backend/ SKILLS.md .gitignore frontend/
git commit -m "chore(backend): create solution and project structure"
git commit -m "feat(backend): add domain entities and enums"
git commit -m "feat(backend): add application interfaces, DTOs, validators, and services"
# ... (one commit per logical step)
git push -u origin feat/backend-scaffold
# Open PR to develop
```

---

## 4. Key Architectural Decisions to Preserve

| Decision | Why |
|---|---|
| **No foreign keys** in DB | PRD §3 — integrity enforced at service layer |
| **Global soft-delete filter** in EF | `WHERE deleted_at IS NULL` on every query |
| **IPaymentProvider abstraction** | Swap Mock → Razorpay without changing controller/service |
| **MockPaymentProvider throws in Production** | Constructor guard via `IHostEnvironment.IsProduction()` |
| **Refresh token stored as BCrypt hash** | Never store raw token in DB; verify with BCrypt.Verify |
| **PricingService.Calculate** is pure/async | Reads settings from DB each call; settings are admin-editable |
| **intra-state = customerStateCode == "24"** | Company is Gujarat; CGST+SGST if same state, IGST if different |
| **Coupon offer processing fee = ₹15** | Only added when coupon applied; separate line item on invoice |
| **AuthService fires email fire-and-forget** | Welcome/password-reset emails don't block response |
| **JWT 15min access + 30d httpOnly refresh** | Short-lived access, rotating refresh |

---

## 5. Environment Variables Required

```env
DATABASE_URL=postgresql://postgres.[ref]:[pw]@aws-...pooler.supabase.com:6543/postgres
DATABASE_DIRECT_URL=postgresql://...5432/postgres
SUPABASE_URL=https://[ref].supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
JWT_SECRET=<256-bit base64>
JWT_ISSUER=bookkaroo
JWT_AUDIENCE=bookkaroo-api
JWT_ACCESS_TTL_MIN=15
JWT_REFRESH_TTL_DAYS=30
PAYMENT_PROVIDER=mock
RESEND_API_KEY=re_...
RESEND_FROM=BookKaroo <onboarding@resend.dev>
TMDB_API_KEY=...
TMDB_BEARER=eyJ...
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ASPNETCORE_ENVIRONMENT=Development
```

---

## 6. File Count Summary

| Layer | Files Written | Files Remaining |
|---|---|---|
| Domain entities | 22 | 0 |
| Domain enums | 10 | 0 |
| Application interfaces | 16 | 0 |
| Application DTOs | 13 | 0 |
| Application validators | 3 | 0 |
| Application services | 3 (Auth, Pricing, City) | ~10 stubs needed |
| Infrastructure | 0 | ~10 (DbContext, repos, MockPayment, Email, PDF, Storage, TMDB) |
| API Program.cs | 0 (template only) | 1 full replacement |
| API Middleware | 0 | 2 |
| API Controllers | 0 | 12 |
| Tests | 0 | 3 classes × ~7 tests = 17 tests |
| Config files | 0 | appsettings.json, appsettings.Development.json, .env.example |

**Total: ~68 files done, ~40 files remaining.**

---

## 7. Design System Status (separate branch)

`feat/design-system` branch has 5 commits with the complete design system.  
**To use the preview:** `cd frontend && npm install && npm run dev` → open `http://localhost:5173`  
Toggle ☀️/🌙 in the top-right for light/dark theme.

The `feat/design-system` branch has NOT been merged to `develop` yet. Merge it before opening backend PR, or keep them parallel.

---

*Generated by Claude Sonnet 4.6 on 2026-05-09 for context handoff.*

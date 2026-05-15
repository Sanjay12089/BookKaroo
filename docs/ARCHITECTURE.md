# BookKaroo — Architecture

> **Patch v2:** `IPaymentProvider` abstraction added; `MockPaymentProvider` for MVP; PayPal/Razorpay deferred to Phase 1.5.

## 1. System Overview

```mermaid
flowchart LR
    U[User Browser] -->|HTTPS| FE[React SPA - Vercel]
    A[Admin Browser] -->|HTTPS| FE
    FE -->|REST + JWT| API[.NET 8 Web API - Railway]
    FE -.->|WebSocket| RT[Supabase Realtime]
    API --> DB[(Supabase Postgres)]
    API --> ST[Supabase Storage - QR + Invoices]
    RT --> DB
    API -->|REST| TMDB[TMDB API]
    API -->|Phase 1.5| GW[Razorpay / PayPal]
    API -->|REST| RES[Resend Email]
    CRON[Lock Sweep Cron - 60s] --> DB
```

## 2. Layered Architecture

### Backend (.NET 8)

```
TicketVerse.Api          ← HTTP layer (controllers, middleware, auth)
   │
TicketVerse.Application  ← Business logic (services, DTOs, validators, interfaces)
   │
TicketVerse.Domain       ← Pure entities, enums, value objects (no dependencies)
   │
TicketVerse.Infrastructure ← EF Core, repositories, external API clients (Resend, TMDB, Razorpay/PayPal/Mock)
```

### Frontend (React)
*(unchanged — see v1)*

## 3. Payment Provider Abstraction (NEW)

```csharp
// TicketVerse.Application/Interfaces/IPaymentProvider.cs
public interface IPaymentProvider
{
    string ProviderName { get; }
    Task<PaymentOrder> CreateOrderAsync(CreateOrderRequest req, CancellationToken ct);
    Task<PaymentCapture> CaptureAsync(string providerOrderId, CancellationToken ct);
    Task<RefundResult> RefundAsync(string providerPaymentId, decimal amount, CancellationToken ct);
    Task<bool> VerifyWebhookSignatureAsync(string payload, string signature, CancellationToken ct);
}
```

### Implementations

| Class | Purpose | Phase |
|---|---|---|
| `MockPaymentProvider` | Synthetic order/capture, returns success unless `?simulateFailure=true` | Phase 1 (MVP) |
| `RazorpayPaymentProvider` | Razorpay Orders API + webhook | Phase 1.5 |
| `PayPalPaymentProvider` | PayPal v2 Orders + webhook | Phase 1.5 alternate |

### Selection
DI registers the implementation based on `PAYMENT_PROVIDER` env var:
```csharp
services.AddScoped<IPaymentProvider>(sp => Configuration["PAYMENT_PROVIDER"] switch {
    "razorpay" => sp.GetRequiredService<RazorpayPaymentProvider>(),
    "paypal" => sp.GetRequiredService<PayPalPaymentProvider>(),
    _ => sp.GetRequiredService<MockPaymentProvider>()
});
```

### Production Safety
`MockPaymentProvider` constructor checks `IHostEnvironment` and **throws if Production**:
```csharp
public MockPaymentProvider(IHostEnvironment env) {
    if (env.IsProduction())
        throw new InvalidOperationException("MockPaymentProvider must not be used in Production");
}
```

## 4. Request Flow Examples

### B. Seat selection (real-time)
*(unchanged — see v1)*

### C. Payment Flow (Mock — Phase 1)
```
User clicks "Proceed to Pay"
   → POST /api/payments/order with Idempotency-Key header
   → IPaymentProvider.CreateOrderAsync (Mock returns synthetic ID)
   → return { orderId, providerOrderId, amount, currency }
   → FE shows mock checkout dialog (Simulate Success / Failure buttons)
   → On Simulate Success:
     POST /api/payments/mock-capture { providerOrderId }
   → BookingService:
        BEGIN TX
        delete seat_locks
        INSERT bookings + booking_seats
        update payments.status = 'captured'
        COMMIT
   → fire-and-forget: generate invoice PDF, send email with QR + invoice
   → return booking confirmation
```

### Phase 1.5 — Same Flow, Real Provider
Same controller/service code. `IPaymentProvider` resolves to Razorpay or PayPal. Real checkout in browser. Webhook verifies on server.

## 5. Authentication
*(unchanged — see v1)*

## 6. Seat Lock State Machine
*(unchanged — see v1)*

## 7. Caching Strategy
*(unchanged)*

## 8. Logging & Observability
*(unchanged)*

## 9. Deployment Topology

```
Frontend (Vercel)        ← static + edge
   ↓
Backend (Railway)        ← single .NET service, autoscale
   ↓
Database (Supabase)      ← managed Postgres + Realtime + Storage
   ↓
Cron job (Railway)       ← seat lock sweep every 60s
```

**Phase 1 deployment plan:**
1. Push code to GitHub
2. Vercel: import frontend repo → auto-deploy on `main` push
3. Railway: import backend repo → set env vars → deploy
4. Supabase: run migrations from local CLI
5. **At this point**, you have `bookkaroo.vercel.app` → use this URL for Razorpay verification → swap `MockPaymentProvider` for `RazorpayPaymentProvider`

## 10. Environment Configuration

### Backend `.env`
```
ASPNETCORE_ENVIRONMENT=Development

# Database
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-...pooler.supabase.com:6543/postgres
DATABASE_DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-...pooler.supabase.com:5432/postgres

# Supabase
SUPABASE_URL=https://[ref].supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SUPABASE_STORAGE_BUCKET_QR=qr-codes
SUPABASE_STORAGE_BUCKET_INVOICE=invoices

# JWT
JWT_SECRET=<256-bit, generate via: openssl rand -base64 32>
JWT_ISSUER=bookkaroo
JWT_AUDIENCE=bookkaroo-api
JWT_ACCESS_TTL_MIN=15
JWT_REFRESH_TTL_DAYS=30

# Payment (Phase 1: mock; Phase 1.5: razorpay/paypal)
PAYMENT_PROVIDER=mock
# RAZORPAY_KEY_ID=rzp_test_...        # Phase 1.5
# RAZORPAY_KEY_SECRET=...
# RAZORPAY_WEBHOOK_SECRET=...
# PAYPAL_MODE=sandbox                  # Phase 1.5 alternate
# PAYPAL_CLIENT_ID=...
# PAYPAL_CLIENT_SECRET=...
# PAYPAL_WEBHOOK_ID=...

# Email
RESEND_API_KEY=re_...
RESEND_FROM=BookKaroo <onboarding@bookkaroo.com>

# TMDB
TMDB_API_KEY=...
TMDB_BEARER=eyJ...

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://bookkaroo.vercel.app
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://[ref].supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_PAYMENT_PROVIDER=mock
# VITE_RAZORPAY_KEY_ID=rzp_test_...   # Phase 1.5
# VITE_PAYPAL_CLIENT_ID=...           # Phase 1.5 alternate
# VITE_GOOGLE_MAPS_API_KEY=...        # Phase 2
```

## 11. Risks (UPDATED)

| Risk | Mitigation |
|---|---|
| Mock provider used in production | Constructor guard + integration test asserting prod registry doesn't bind Mock |
| Razorpay rejects unverified URL during signup | Defer to Phase 1.5 after Vercel deploy; PayPal sandbox available as fallback |
| PayPal sandbox INR support unstable | If `CURRENCY_NOT_SUPPORTED`, fall back to USD with fixed-rate conversion via env var |
| GST calculation errors | Unit tests for intra/inter-state matrix; settings-driven (admin-fixable without redeploy) |
| Orphan rows (no FKs) | Service-layer integrity checks + nightly cleanup job |
| Seat double-booking | Advisory locks + DB transaction + load test (target: 100 concurrent) |

## 12. Scalability Path (Phase 2+)
*(unchanged — see v1)*

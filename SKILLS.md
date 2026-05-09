# BookKaroo — Coding Skills & Standards

## React / TypeScript
- **Functional components only.** No class components.
- **Hooks discipline:** custom hooks (`useX`) for any reused logic. Naming: `useAuth`, `useDebounce`, `useShowSeats`.
- **Strict TS:** `"strict": true`, `"noImplicitAny": true`. `any` is banned — use `unknown` and narrow.
- **Props typed via `interface`**, not `type` (unless union).
- **Components file = one component + its tests + types co-located.**
- **Lazy load every route**: `const X = lazy(() => import('@/features/x/pages/XPage'))`.
- **State separation:**
  - UI/local state → `useState`
  - Cross-component UI state → Zustand
  - Server state → TanStack Query (never duplicate into Zustand)
- **Forms:** `react-hook-form` + `zod` resolver. Always validate on submit AND on blur.
- **Errors:** every async UI shows loading skeleton → success state → error state with retry.
- **A11y:** semantic HTML, ARIA labels on icon buttons, focus rings, keyboard nav, contrast ≥ 4.5:1.

## File Naming (Frontend)
- Components: `PascalCase.tsx` (e.g., `MovieCard.tsx`)
- Hooks: `useCamelCase.ts`
- Utilities: `camelCase.ts`
- Types: `types.ts` per feature folder
- Constants: `constants.ts` per feature folder

## .NET / C#
- **Layering (strict):** Controller → Service → Repository → DbContext.
- **Controllers:** thin — only model binding + service call + return ActionResult. No business logic.
- **Services:** business logic, transactions, orchestration. Inject repositories.
- **Repositories:** data access only — no business rules. Return entities or DTOs.
- **DTOs:** in `Application` layer. Entities never leave the service boundary.
- **Async everywhere:** `async Task<T>` + `CancellationToken` parameter on every async method.
- **Validation:** FluentValidation per DTO; auto-registered in DI; runs in middleware.
- **Logging:** Serilog structured logs — `_logger.LogInformation("Booking created {BookingId} for user {UserId}", bookingId, userId)`. No string concatenation.
- **Errors:** custom exceptions (`NotFoundException`, `ValidationException`, `ConflictException`) → global middleware → ProblemDetails response.
- **Mapping:** AutoMapper or manual extension methods. Pick one, stick to it.
- **Naming:**
  - Interfaces: `IUserService`
  - Async methods end with `Async`
  - DTOs: `CreateUserRequest`, `UserResponse`

## File Naming (Backend)
- One class per file
- File name = class name
- Folder structure mirrors namespace

## Database
- All tables: `id (uuid)`, `created_at (timestamptz)`, `updated_at (timestamptz)`, `deleted_at (timestamptz null)`
- snake_case columns, plural table names (`users`, `movies`, `bookings`)
- UUIDs generated server-side via `gen_random_uuid()`
- Indexes on every reference column + frequently filtered columns
- No FKs (per project decision) — integrity enforced in service layer
- Money in `numeric(10,2)`, never `float`
- Migrations: numbered, idempotent, in `/database/migrations/`

## Git
- **Conventional commits:** `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `perf`
- Format: `<type>(<scope>): <subject>` — e.g., `feat(booking): add seat-lock cron sweep`
- Subject in imperative mood, ≤ 72 chars, no period
- One logical change per commit
- PR description must include: what, why, screenshots/recordings, test plan

## Testing
- **Backend:** xUnit + Moq + FluentAssertions
  - One test class per service
  - AAA pattern (Arrange–Act–Assert)
  - Mock repositories, test service logic
  - Integration tests for repositories with Testcontainers (Postgres)
- **Frontend:** Vitest + React Testing Library
  - Test user behavior, not implementation
  - Mock API via MSW
  - Critical paths: auth, seat selection, checkout
- **Coverage target:** ≥ 70% on services and reducers

## Security Checklist
- Passwords: BCrypt cost 12
- JWT: short-lived access (15min) + refresh token (30 days, httpOnly cookie)
- Rate limit `/auth/*` endpoints (10 req/min/IP)
- Sanitize all user-rendered HTML (DOMPurify)
- CORS: explicit origins, no `*`
- SQL: parameterized only via EF Core
- Secrets: env vars, never committed

## Performance
- Lighthouse Perf ≥ 85, A11y ≥ 95 on key pages
- LCP < 2s, TTI < 3s
- Code split per route
- Image: lazy load, modern formats (webp), `srcset`
- API: pagination on all list endpoints (default 20, max 100)
- DB: explain analyze on any query touching >10k rows

## Don'ts (repeat from CLAUDE.md for emphasis)
- ❌ No `any`, no monolithic files, no hard deletes, no inline styles, no FKs, no Redis

# BookKaroo Design System

> **Tagline:** Book the moment. Karo it now.  
> **Branch:** `feat/design-system`  
> **Stack:** React 18 · TypeScript · Vite · Inline styles from `DESIGN_TOKENS`

---

## How to use

### 1. Install fonts

Add the Google Fonts link to your `index.html` (or use the exported constant):

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

Or in your app root:

```tsx
import { GOOGLE_FONTS_URL } from '@/design';

// In your <head> or via a Helmet component:
// <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
```

### 2. Inject global CSS

In your app entry point (`main.tsx` or `App.tsx`):

```tsx
import { globalCSS } from '@/design';

const style = document.createElement('style');
style.textContent = globalCSS;
document.head.appendChild(style);
```

### 3. Import tokens and components

```tsx
import { DESIGN_TOKENS as T, Button, Logo, Badge } from '@/design';

function MyComponent() {
  return (
    <div style={{ background: T.colors.bg.base, padding: T.spacing[6] }}>
      <Logo size={40} glow />
      <Button variant="primary" size="lg">Book Tickets</Button>
      <Badge color="crimson">Now Showing</Badge>
    </div>
  );
}
```

### 4. Run the design preview

Point your router at `<Preview />` to see all screens at once:

```tsx
// In your router config:
import { Preview } from '@/design';

{ path: '/design-preview', element: <Preview /> }
```

Then open: **http://localhost:5173/design-preview**

---

## Screen list with routes

| # | Screen | Route | File |
|---|--------|-------|------|
| 1 | Home | `/` | `screens/Home.tsx` |
| 2 | Movies Listing | `/movies` | `screens/MoviesList.tsx` |
| 3 | Movie Detail | `/movies/:slug` | `screens/MovieDetail.tsx` |
| 4 | Showtimes | `/movies/:slug/showtimes` | `screens/Showtimes.tsx` |
| 5 | Seat Selection | `/booking/:showId/seats` | `screens/SeatSelection.tsx` |
| 6 | Checkout | `/checkout` | `screens/Checkout.tsx` |
| 7 | Booking Confirmed | `/booking/confirmed` | `screens/Confirmation.tsx` |
| 8 | My Bookings | `/profile/bookings` | `screens/MyBookings.tsx` |
| 9 | Admin Dashboard | `/admin` | `screens/AdminDashboard.tsx` |
| — | Design Preview | `/design-preview` | `screens/Preview.tsx` |

---

## Design tokens reference

All tokens live in `tokens.ts` and are exported as the `DESIGN_TOKENS` const.

### Colors

```ts
T.colors.bg.base         // #0A0E1A  — page background
T.colors.bg.surface      // #131826  — card/panel background
T.colors.bg.surface2     // #1A2138  — elevated surface
T.colors.bg.surface3     // #232C44  — top-layer surface

T.colors.border.default  // rgba(255,255,255,0.08)
T.colors.border.strong   // rgba(255,255,255,0.16)

T.colors.text.primary    // #F4F4F5
T.colors.text.secondary  // #A1A1AA
T.colors.text.muted      // #71717A

T.colors.accent.crimson  // #E11D74  — primary brand
T.colors.accent.indigo   // #6366F1  — secondary brand
T.colors.accent.purple   // #A855F7

T.colors.semantic.success  // #10B981
T.colors.semantic.warning  // #F59E0B
T.colors.semantic.error    // #EF4444

// Seat palette
T.colors.seat.recliner   // #FFD700
T.colors.seat.executive  // #4169E1
T.colors.seat.normal     // #E4E4E7
T.colors.seat.booked     // #232C44
T.colors.seat.locked     // #F59E0B
```

### Fonts

```ts
T.fonts.display   // 'Playfair Display' — movie titles, hero headings
T.fonts.body      // 'Sora'             — all UI text
T.fonts.mono      // 'JetBrains Mono'   — booking IDs, seat codes, prices
```

### Spacing (4px base scale)

```ts
T.spacing[1]  // 4px
T.spacing[2]  // 8px
T.spacing[4]  // 16px
T.spacing[6]  // 24px
T.spacing[8]  // 32px
T.spacing[12] // 48px
T.spacing[16] // 64px
```

### Radius

```ts
T.radius.sm    // 6px
T.radius.md    // 12px
T.radius.lg    // 16px
T.radius.xl    // 24px
T.radius.full  // 9999px
```

### Shadows

```ts
T.shadows.sm          // subtle lift
T.shadows.md          // card shadow
T.shadows.lg          // modal / floating shadow
T.shadows.glowCrimson // 0 10px 40px -10px rgba(225, 29, 116,0.55)
T.shadows.glowIndigo  // 0 10px 40px -10px rgba(99,102,241,0.55)
```

### Motion

```ts
T.motion.duration.fast  // 150ms
T.motion.duration.base  // 220ms
T.motion.duration.slow  // 400ms

T.motion.ease.default   // cubic-bezier(0.4, 0, 0.2, 1)
T.motion.ease.spring    // cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## Logo usage guide

```tsx
import { Logo, LogoIcon } from '@/design';

// Full horizontal logo (default)
<Logo size={40} />

// Variants
<Logo variant="full-horizontal" />  // icon + wordmark side by side
<Logo variant="full-stacked" />     // icon above wordmark
<Logo variant="icon-only" />        // just the film-strip play mark
<Logo variant="wordmark-only" />    // just "BookKaroo" text

// Themes
<Logo theme="dark" />        // white text on dark bg (default)
<Logo theme="light" />       // dark text on light bg
<Logo theme="mono-white" />  // all white (for dark overlays)
<Logo theme="mono-black" />  // all black (for light overlays)

// Glow effect (for hero / hero nav)
<Logo glow />

// Standalone icon
<LogoIcon size={48} glow />
```

**Rules:**
- Never use `theme="light"` on a dark background
- Use `glow` only on hero sections and sticky navs
- Maintain minimum 24px size for legibility
- Never recolor or stretch the logo

---

## Component catalogue

| Component | Key props |
|-----------|-----------|
| `Button` | `variant` (primary/secondary/ghost/gradient), `size` (sm/md/lg/xl), `loading` |
| `Card` | `padding`, `hover` |
| `GlassCard` | `padding`, `hover` — backdrop blur |
| `Badge` | `color` (crimson/indigo/purple/success/warning/error/default) |
| `Chip` | `active`, `onToggle` — toggle chip |
| `Skeleton` | `width`, `height`, `radius` — shimmer placeholder |
| `Input` | `label` (floating), `error`, `hint`, `inputSize` |
| `Modal` | `open`, `onClose`, `title`, `maxWidth` |
| `BottomSheet` | `open`, `onClose`, `title` — mobile drawer |
| `StarRating` | `value`, `max` (5/10), `onChange`, `readOnly` |
| `CountdownRing` | `totalSeconds`, `remainingSeconds`, `size` — SVG timer |
| `SectionHeader` | `title`, `seeAllHref`, `onSeeAll` |
| `Toast` / `ToastContainer` | `variant` (success/error/info), `message`, `onClose` |

All components accept `className` and `style` overrides.

---

## Coupon codes (test)

| Code | Effect |
|------|--------|
| `KGF450` | ₹450 discount + ₹17.70 offer processing fee |

---

*© 2026 BookKaroo Pvt Ltd · Design system generated on feat/design-system*

# Kaax AI — replit.md

## Overview

Kaax AI is a Spanish-language SaaS landing page and admin dashboard for an AI-powered WhatsApp sales agent product. The platform lets prospective customers learn about the service, submit their contact info as a lead, and subscribe via Stripe. An internal admin panel (protected by Replit Auth) lets the team view and manage leads and active subscriptions.

**Core user flows:**
1. Visitor lands on the marketing homepage (`/`), learns about the product, and fills out a lead capture form.
2. Visitor can initiate a Stripe subscription checkout directly from the pricing section.
3. After successful payment, visitor lands on the `/success` confirmation page.
4. Admin staff log in via Replit Auth and manage leads/subscriptions at `/admin`.

---

## User Preferences

Preferred communication style: Simple, everyday language.

---

## System Architecture

### Monorepo Layout

```
/
├── client/          # Vite + React frontend
│   └── src/
│       ├── pages/   # Home, Admin, Success, NotFound
│       ├── components/
│       │   └── ui/  # shadcn/ui component library
│       └── hooks/   # use-auth, use-leads, use-toast, use-mobile
├── server/          # Express backend
│   ├── index.ts     # HTTP server entry point
│   ├── routes.ts    # API route registration
│   ├── storage.ts   # DatabaseStorage class (Drizzle ORM)
│   ├── stripe.ts    # Stripe client setup
│   ├── db.ts        # Drizzle + pg Pool connection
│   └── replit_integrations/auth/  # Replit OIDC auth
├── shared/          # Types, Zod schemas, route definitions shared by client & server
│   ├── schema.ts    # Drizzle table definitions: leads, subscriptions
│   └── models/auth.ts # sessions, users tables (Replit Auth)
└── script/build.ts  # Custom esbuild + Vite dual build script
```

### Frontend

- **Framework:** React 18 (no SSR; `rsc: false`)
- **Routing:** Wouter (lightweight client-side router)
- **Data fetching:** TanStack Query v5 with a custom `queryClient` that handles 401s
- **Forms:** React Hook Form + Zod via `@hookform/resolvers`
- **Animations:** Framer Motion for page transitions and scroll-triggered effects
- **UI components:** shadcn/ui (Radix UI primitives + Tailwind CSS) using the "new-york" style
- **Design system:** Dark "Mayan Jungle" palette defined as CSS HSL variables in `index.css`; fonts are Inter (body) and Outfit (display) loaded from Google Fonts
- **Icons:** Lucide React + react-icons (SI for WhatsApp logo)

### Backend

- **Runtime:** Node.js (ESM, `tsx` for dev, esbuild bundle for production)
- **Framework:** Express.js
- **Dev server:** Vite middleware mode integrated into the Express server (hot module reload over `/vite-hmr`)
- **Production build:** `script/build.ts` runs Vite for the client and esbuild for the server into `dist/`

### Data Layer

- **Database:** PostgreSQL (required via `DATABASE_URL` env var)
- **ORM:** Drizzle ORM with `drizzle-zod` for schema-derived validation
- **Tables:**
  - `sessions` — express-session storage (connect-pg-simple); mandatory for Replit Auth
  - `users` — Replit Auth user profiles
  - `leads` — prospect contact submissions (name, email, phone, company, notes, status)
  - `subscriptions` — Stripe checkout/subscription records
- **Migrations:** `drizzle-kit push` (schema-push workflow, no manual migration files required for dev)

### Authentication & Authorization

- **Mechanism:** Replit OpenID Connect (OIDC) via `openid-client` + Passport.js (`openid-client/passport` strategy)
- **Sessions:** PostgreSQL-backed sessions via `connect-pg-simple`; 7-day TTL; `httpOnly + secure` cookies
- **Protected routes:** `isAuthenticated` middleware guards `/api/auth/user` and the Admin page checks login state client-side, redirecting to `/api/login` if unauthenticated
- **User upsert:** On each successful login, the user record is upserted into the `users` table

### API Design

Routes are defined in Express and type-safe route definitions live in `shared/routes.ts` (method, path, Zod input/response schemas). The client hooks consume these definitions directly, ensuring end-to-end type safety without a code-gen step.

Key API endpoints:
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/auth/user` | Get current user (authenticated) |
| GET/POST/PUT/DELETE | `/api/leads` | Lead CRUD |
| GET | `/api/stripe/config` | Expose Stripe public key to client |
| POST | `/api/stripe/create-checkout` | Create Stripe Checkout session |
| POST | `/api/stripe/webhook` | Stripe webhook (implied by subscription tracking) |

---

## External Dependencies

### Stripe
- **Purpose:** Subscription payment processing
- **Config:** `STRIPE_SECRET` (server), `VITE_STRIPE_PUBLIC_KEY` (client), `STRIPE_PRICE_ID`
- **Mode detection:** `isTestMode()` checks if secret key starts with `sk_test_`
- **Flow:** Server creates a Checkout Session → client redirects → webhook updates subscription status in DB

### Replit Auth (OIDC)
- **Purpose:** Admin authentication
- **Config:** `REPL_ID`, `ISSUER_URL` (defaults to `https://replit.com/oidc`), `SESSION_SECRET`
- **Discovery endpoint** is memoized for 1 hour to avoid repeated network calls

### PostgreSQL
- **Purpose:** Primary data store for all tables
- **Config:** `DATABASE_URL` environment variable (required at startup; throws if missing)
- **Connection:** `pg.Pool` passed to Drizzle

### Google Fonts
- **Purpose:** Inter and Outfit typefaces loaded in `client/index.html`
- **Note:** Also Architects Daughter, DM Sans, Fira Code, Geist Mono referenced in HTML (decorative/code sections)

### Replit Vite Plugins (dev only)
- `@replit/vite-plugin-runtime-error-modal` — overlay for runtime errors
- `@replit/vite-plugin-cartographer` — Replit source map tooling
- `@replit/vite-plugin-dev-banner` — Replit dev environment banner

### Key npm Packages
| Package | Role |
|---------|------|
| `framer-motion` | Page/section animations |
| `date-fns` | Date formatting in Admin |
| `react-helmet` | `<head>` meta tags for SEO/OG |
| `react-icons` | WhatsApp SI icon |
| `wouter` | Client-side routing |
| `memoizee` | OIDC config discovery caching |
| `nanoid` | Cache-busting in dev Vite template |
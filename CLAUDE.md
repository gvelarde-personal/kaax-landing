# Kaax AI Landing Page - Project Documentation

## Project Overview

**Kaax AI** is a B2B SaaS landing page for an AI-powered WhatsApp agent that automates lead qualification and customer support. The product helps businesses scale their sales by handling customer conversations 24/7, qualifying leads automatically, and integrating with existing CRM systems.

**Target Market**: B2B companies in Mexico looking to automate their sales funnel
**Pricing**: $18,000 MXN/month + IVA (subscription-based)
**Key Value Prop**: Unlimited AI tokens, 24/7 availability, CRM integration, instant lead qualification

---

## Architecture

### Next.js Full-Stack Structure

```
kaax-landing/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout with providers
│   ├── page.tsx         # Home page (/)
│   ├── providers.tsx    # Client-side providers
│   ├── demo/            # Demo page route
│   ├── admin/           # Admin panel route
│   ├── success/         # Success page route
│   ├── privacidad/      # Privacy policy route
│   ├── terminos/        # Terms of service route
│   └── api/             # API route handlers
│       ├── auth/        # NextAuth routes
│       ├── leads/       # Lead management API
│       ├── subscriptions/ # Subscription API
│       └── stripe/      # Stripe integration
├── client/src/          # UI components (kept for compatibility)
│   ├── components/      # Reusable UI components (Shadcn/ui)
│   ├── pages/           # Page components (used by app routes)
│   ├── hooks/           # React Query hooks for API calls
│   └── lib/             # Utilities (queryClient)
├── lib/                 # Server-side utilities
│   ├── db.ts            # Drizzle ORM connection (singleton)
│   ├── storage.ts       # Database operations layer
│   ├── stripe.ts        # Stripe SDK initialization
│   └── auth.ts          # NextAuth configuration
├── shared/              # Shared types & schemas
│   ├── schema.ts        # Drizzle schema + Zod validation
│   ├── routes.ts        # API contract definitions
│   └── models/          # Database models
│       └── nextauth.ts  # NextAuth database schema
└── public/              # Static assets
```

**Development**: `npm run dev` runs Next.js dev server on port 3000
**Production**: `npm run build && npm start` builds and serves Next.js app

---

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first styling
- **Shadcn/ui** - Pre-built accessible components (Radix UI primitives)
- **Framer Motion** - Animations & page transitions
- **React Hook Form + Zod** - Form validation
- **TanStack Query (React Query)** - Server state management

### Backend
- **Next.js API Routes** - Serverless API handlers
- **NextAuth v5** - Authentication (Google OAuth)
- **Drizzle ORM** - SQL query builder with Drizzle Adapter for NextAuth
- **PostgreSQL** - Primary database
- **Stripe** - Payment processing
- **Zod** - Runtime schema validation

### Build Tools
- **Next.js** - Build system and dev server
- **TypeScript** - Type checking

---

## Key Features

### 1. Landing Page (`/`)
- **Hero Section**: Eye-catching headline with CTAs
- **Features Section**: 3 key value propositions (Instant Qualification, 24/7 Availability, Analytics)
- **Services Section**: What's included in the service (WhatsApp agent, unlimited tokens, CRM integration)
- **Pricing Section**: Single transparent pricing tier with checkout button
- **Lead Capture Form**: Collects name, email, phone, company (Zod validated)
- **Floating WhatsApp Button**: Direct contact link with pre-filled message
- **SEO Optimized**: Meta tags, Open Graph, Twitter cards, prerendering for bots

### 2. Interactive Demo (`/demo`)
- **4 Scenario Showcases**:
  1. Lead Qualification - Shows how AI identifies hot prospects
  2. Customer Support - Handles order tracking and issues
  3. Automated Follow-up - Re-engages cold leads
  4. Objection Handling - Responds to pricing concerns
- **WhatsApp-style Chat UI**: Realistic message bubbles, typing indicators, timestamps
- **Auto-playing Animations**: Messages appear with delays, simulating real conversations
- **Mobile Responsive**: Adapts layout for small screens
- **CTA Integration**: Links to Calendly for booking demos

### 3. Admin Panel (`/admin`)
- **Authentication Required**: Replit OAuth (only authenticated users can access)
- **Two Main Tabs**:
  - **Leads Management**: View, filter, update status (new/contacted/qualified/lost), add notes, delete leads
  - **Sales/Subscriptions**: View Stripe subscriptions, track MRR, monitor test vs live mode
- **WhatsApp Integration**: Direct "Greet via WhatsApp" button for leads with phone numbers
- **Real-time Stats**: Total leads, new leads needing attention, qualified leads, active subscriptions, MRR

### 4. Stripe Payment Integration
- **Checkout Flow**:
  1. User clicks "Pagar Ahora" button
  2. Modal collects name + email
  3. Creates Stripe Checkout Session
  4. Redirects to Stripe-hosted payment page
  5. On success, redirects to `/success` page
- **Webhook Handling**: Listens for Stripe events (checkout.session.completed, subscription.updated/deleted)
- **Subscription Tracking**: Stores all subscriptions in database with status, amount, mode (test/live)
- **Test Mode Support**: Distinguishes between test and live transactions

### 5. SEO & Performance
- **Prerendering**: Detects search engine bots (Google, Bing, Facebook, Twitter) and serves pre-rendered HTML
- **Meta Tags**: Comprehensive SEO metadata with Spanish language content
- **Sitemap-friendly**: Clean URLs for `/privacidad` and `/terminos`

---

## Database Schema

### Tables

#### `leads`
Stores all captured leads from the landing page form.

```typescript
{
  id: serial (primary key)
  name: text (required)
  email: text (required)
  phone: text (optional)
  company: text (optional)
  notes: text (optional)
  status: text (default: 'new') // 'new' | 'contacted' | 'qualified' | 'lost'
  createdAt: timestamp (default: now())
}
```

#### `subscriptions`
Tracks all Stripe subscriptions.

```typescript
{
  id: serial (primary key)
  stripeSessionId: text (unique, required)
  stripeCustomerId: text
  stripeSubscriptionId: text
  customerName: text
  customerEmail: text (required)
  plan: text (default: 'agente_pro')
  status: text (default: 'active') // 'active' | 'cancelled' | 'past_due'
  amountMxn: integer (default: 18000)
  mode: text (default: 'test') // 'test' | 'live'
  createdAt: timestamp (default: now())
  cancelledAt: timestamp (nullable)
}
```

---

## API Routes

### Public Endpoints

#### Leads
- `GET /api/leads/list` - List all leads (dev mode: public, prod: requires auth)
- `GET /api/leads/:id` - Get single lead (auth required in prod)
- `POST /api/leads/create` - Create new lead (public, validated with Zod)
- `PUT /api/leads/:id` - Update lead status/notes (auth required)
- `DELETE /api/leads/:id` - Delete lead (auth required)

#### Stripe
- `GET /api/stripe/config` - Get public Stripe key and mode
- `POST /api/stripe/create-checkout` - Create Stripe Checkout Session
- `POST /api/stripe/webhook` - Stripe webhook handler (requires raw body)

#### Subscriptions
- `GET /api/subscriptions` - List all subscriptions (auth required)

#### Authentication (Replit)
- `GET /api/login` - Initiate Replit OAuth login
- `GET /api/logout` - Clear session and logout
- `GET /api/auth/user` - Get current authenticated user
- `GET /api/auth/callback` - OAuth callback handler

---

## Environment Variables

Required environment variables (add to `.env.local`):

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Next.js & NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin Access (comma-separated emails allowed to access /admin)
ADMIN_EMAIL_ALLOWLIST=admin@example.com,another@example.com

# Stripe (Development/Test)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...

# Stripe (Production)
STRIPE_SECRET_KEY_PROD=sk_live_...
STRIPE_PRICE_ID_PROD=price_...
STRIPE_WEBHOOK_SECRET_PROD=whsec_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY_PROD=pk_live_...

# App Config
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-link
NODE_ENV=development
```

**Important Notes**:
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `ADMIN_EMAIL_ALLOWLIST`: Only users with these emails can access /admin
- Google OAuth: Create credentials in Google Cloud Console, add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- Use `sk_test_` keys for testing. Switch to `sk_live_` for production. The app auto-detects mode.

---

## Development Workflow

### Setup
```bash
npm install
npm run db:push  # Push schema to database
```

### Run Dev Server
```bash
npm run dev
```
- Server runs on `http://localhost:5000`
- Vite dev server proxies API requests
- Hot reload enabled for both client and server

### Build for Production
```bash
npm run build
```
- Bundles client into `/dist/public`
- Bundles server into `/dist/index.cjs`

### Start Production Server
```bash
npm start
```

### Database Migrations
```bash
npm run db:push
```
Uses Drizzle Kit to sync schema changes to the database.

---

## Important Files & Concepts

### Client-Side

#### `client/src/App.tsx`
Main app component with routing. Uses Wouter for client-side routing.

#### `client/src/pages/Home.tsx`
Landing page with all sections. Key components:
- Lead capture form with React Hook Form + Zod validation
- Checkout modal for Stripe payments
- WhatsApp floating button with tooltip

#### `client/src/pages/Demo.tsx`
Interactive demo with 4 scenarios. Key logic:
- Auto-playing message timeline with delays
- Typing indicators between messages
- Scrolls to chat on mobile when scenario changes
- Replay functionality

#### `client/src/pages/Admin.tsx`
Admin dashboard with two tabs (Leads, Ventas). Key features:
- Replit OAuth authentication check
- Lead CRUD operations
- WhatsApp contact link generation
- Subscription monitoring with MRR calculation

#### `client/src/hooks/use-leads.ts`
React Query hooks for lead API calls (useLeads, useCreateLead, useUpdateLead, useDeleteLead).

### Server-Side

#### `server/index.ts`
Express server entry point. Sets up:
- JSON body parser with raw body capture (for Stripe webhooks)
- Request logging middleware
- Error handling
- Static file serving (production) or Vite dev server (development)

#### `server/routes.ts`
All API route handlers. Key sections:
- Bot detection and prerendering logic
- Stripe checkout and webhook handlers
- Lead CRUD endpoints
- Authentication routes

#### `server/storage.ts`
Database operations layer (IStorage interface). Abstracts Drizzle queries for:
- Lead management
- Subscription tracking

#### `server/stripe.ts`
Stripe SDK initialization. Determines mode (test vs live) based on environment variables.

#### `server/prerender.ts`
SEO optimization. Detects bots by User-Agent and serves pre-rendered HTML for `/`, `/privacidad`, `/terminos`.

### Shared

#### `shared/schema.ts`
Single source of truth for database schema and validation:
- Drizzle table definitions
- Zod schemas generated from tables
- TypeScript types exported for client/server

#### `shared/routes.ts`
API contract definitions. Type-safe route definitions with input/output schemas.

---

## Mobile Responsiveness

The app is fully responsive with special mobile considerations:
- **Demo Page**: Auto-scrolls to chat window when selecting scenarios on small screens
- **Home Page**: CTAs adapt to full-width buttons on mobile
- **Navbar**: Responsive menu (hidden elements on mobile)
- **Admin Panel**: Sidebar hidden on mobile, tables scroll horizontally

---

## Security Notes

### Admin Authentication
- Admin panel requires Google OAuth via NextAuth
- Only emails in `ADMIN_EMAIL_ALLOWLIST` can access /admin
- In development (`NODE_ENV=development`), auth check is bypassed for API routes (but login UI still shows)
- Sessions stored in PostgreSQL using NextAuth Drizzle adapter

### Stripe Webhook Security
- Webhook signature validation in production (uses `STRIPE_WEBHOOK_SECRET`)
- Raw body preserved for signature verification
- Falls back to JSON parsing if secret not set (for testing only)

### Lead Validation
- All lead inputs validated with Zod schemas on both client and server
- SQL injection protected by Drizzle ORM parameterized queries

---

## Testing Considerations

### Test Data
On first run, the server seeds 2 example leads (Alice Johnson, Bob Smith) for testing.

### Stripe Test Mode
Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`

### Admin Access
In development, admin panel is accessible without authentication.
In production, you must be logged in via Replit OAuth.

---

## Deployment Checklist

1. **Set Environment Variables**: Ensure all production env vars are set (especially `STRIPE_SECRET_KEY_PROD`, `DATABASE_URL`)
2. **Database Migration**: Run `npm run db:push` on production database
3. **Build**: Run `npm run build` to create production bundle
4. **Stripe Webhooks**: Configure webhook endpoint in Stripe dashboard pointing to `https://your-domain.com/api/stripe/webhook`
5. **Replit Auth**: Update `REPL_AUTH_REDIRECT_URI` to production URL
6. **Calendly**: Set `VITE_CALENDLY_URL` to your actual Calendly link
7. **Test Checkout**: Complete a test transaction to verify webhook handling
8. **Switch to Live Mode**: Replace test keys with live keys when ready for production

---

## Common Tasks

### Add a New Page
1. Create component in `client/src/pages/YourPage.tsx`
2. Add route in `client/src/App.tsx` Router
3. Update navigation if needed

### Add a New API Endpoint
1. Define route contract in `shared/routes.ts`
2. Add handler in `server/routes.ts`
3. Create React Query hook in `client/src/hooks/` if needed

### Modify Database Schema
1. Update `shared/schema.ts` with new columns/tables
2. Run `npm run db:push` to sync to database
3. Update TypeScript types are auto-generated

### Change Pricing
1. Update `$18,000` in `client/src/pages/Home.tsx`
2. Update `amountMxn: 18000` in `server/routes.ts` webhook handler
3. Update Stripe Price ID in environment variables

---

## Key Design Patterns

### Type Safety
- Shared schema definitions prevent client/server type drift
- Zod validation ensures runtime safety matches TypeScript types
- Drizzle ORM provides type-safe SQL queries

### State Management
- React Query for server state (leads, subscriptions)
- Local component state for UI (modals, forms, tabs)
- No global state management library needed

### Component Architecture
- Shadcn/ui provides consistent, accessible components
- Custom components in `client/src/components/` for business logic (Navbar, Logo)
- Page components own their data fetching via hooks

### Error Handling
- API errors caught by React Query and displayed via toast notifications
- Form errors shown inline with react-hook-form
- Server errors logged and returned as JSON with appropriate status codes

---

## Contact & Support

**WhatsApp**: +52 56 5898 9637
**Website**: https://kaax.ai/
**GitHub**: This repository

For bugs or feature requests, check the git history or contact the development team.
# Migration Guide: Vite + Express → Next.js

## ✅ Completed Migration Steps

### 1. Package Updates
- ✅ Removed: `vite`, `@vitejs/plugin-react`, `express`, `express-session`, `passport`, `openid-client`, `wouter`, `react-helmet`, Replit plugins
- ✅ Added: `next`, `next-auth`, `@auth/drizzle-adapter`
- ✅ Updated scripts: `dev`, `build`, `start` now use Next.js commands

### 2. Project Structure
- ✅ Created `app/` directory with App Router structure
- ✅ Created route pages: `/`, `/demo`, `/admin`, `/success`, `/privacidad`, `/terminos`
- ✅ Moved static assets from `client/public/` to `public/`
- ✅ Created `lib/` directory for server utilities (db, storage, stripe, auth)

### 3. Routing Migration
- ✅ Replaced `wouter` with Next.js `Link` and `usePathname`/`useSearchParams`
- ✅ Removed `react-helmet`, replaced with Next.js `metadata` exports
- ✅ Added `"use client"` directives to all client components

### 4. Authentication Migration
- ✅ Replaced Replit OAuth with Google OAuth via NextAuth
- ✅ Created NextAuth database schema in `shared/models/nextauth.ts`
- ✅ Updated schema exports to use NextAuth tables
- ✅ Created `lib/auth.ts` with email allowlist enforcement
- ✅ Updated Admin component to use `useSession`, `signIn`, `signOut`
- ✅ Wrapped app with `SessionProvider` in providers

### 5. API Routes Migration
- ✅ Migrated all Express routes to Next.js API Route Handlers:
  - `GET/POST /api/leads`
  - `GET/PUT/DELETE /api/leads/[id]`
  - `GET /api/subscriptions`
  - `GET /api/stripe/config`
  - `POST /api/stripe/create-checkout`
  - `POST /api/stripe/webhook` (with raw body handling)
- ✅ Applied `requireAdmin()` helper to protected routes
- ✅ Maintained same API paths for client compatibility

### 6. Environment Variables
- ✅ Created `.env.example` with all required variables
- ✅ Updated references from `import.meta.env.VITE_*` to `process.env.NEXT_PUBLIC_*`
- ✅ Updated Stripe config to use Next.js env var conventions

### 7. Configuration
- ✅ Created `next.config.mjs`
- ✅ Updated `tsconfig.json` for Next.js
- ✅ Updated `tailwind.config.ts` to include `app/` directory

---

## 🚧 Required Manual Steps

### 1. Install Dependencies

#### Opción A: Con Yarn (Recomendado - Más rápido)
```bash
yarn
```

#### Opción B: Con npm
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env.local` and copy from `.env.example`:

```bash
cp .env.example .env.local
```

**Required values:**
- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_URL` - `http://localhost:3000` (dev) or your production URL
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `ADMIN_EMAIL_ALLOWLIST` - Comma-separated emails allowed to access admin
- `STRIPE_*` keys - Your Stripe credentials
- `NEXT_PUBLIC_CALENDLY_URL` - Your Calendly link

### 3. Set Up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://your-domain.com/api/auth/callback/google`
5. Copy Client ID and Client Secret to `.env.local`

### 4. Update Database Schema
The NextAuth adapter requires new tables. Run migration:

```bash
npm run db:push
```

**Important**: This will:
- Create new NextAuth tables: `user`, `account`, `session`, `verificationToken`
- Drop old Replit auth tables: `users`, `sessions` (from `shared/models/auth.ts`)
- Keep existing `leads` and `subscriptions` tables

**⚠️ Backup your database before running this!**

If you need to preserve old user data, export it first:
```bash
pg_dump -t users -t sessions $DATABASE_URL > backup.sql
```

### 5. Test the Application

#### Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

#### Test Checklist
- [ ] Home page loads with all sections
- [ ] `/demo` page shows interactive scenarios
- [ ] Lead capture form creates a lead
- [ ] `/admin` redirects to Google login
- [ ] After Google login, admin panel shows leads/subscriptions
- [ ] Only allowlisted emails can access admin
- [ ] Update/delete lead works
- [ ] Stripe checkout creates session and redirects
- [ ] `/success` page shows after payment
- [ ] Static assets load (favicon, OG image)

#### Test Stripe Webhook (Local)
Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
stripe login
```

Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Get webhook signing secret from output and add to `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

Test with a checkout:
```bash
stripe trigger checkout.session.completed
```

### 6. Update Deployment Configuration

#### For Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Add environment variables in Vercel dashboard
4. Set production `NEXTAUTH_URL` to your Vercel domain
5. Update Google OAuth redirect URI to include Vercel domain

#### For Self-Hosted (Node)
```bash
npm run build
npm start
```

Runs on port 3000 by default. Use a reverse proxy (nginx/Caddy) for HTTPS.

Set `NODE_ENV=production` in production environment.

#### For Docker
Create `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t kaax-landing .
docker run -p 3000:3000 --env-file .env kaax-landing
```

### 7. Update Stripe Webhooks
1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET_PROD`

---

## 🗑️ Optional Cleanup

After verifying everything works, you can remove old files:

```bash
# Remove old server files (NO LONGER USED)
rm -rf server/

# Remove old build scripts
rm -rf script/

# Remove Vite config
rm vite.config.ts

# Remove old Replit auth models
rm shared/models/auth.ts

# Remove Vite types from tsconfig
# (Already done in migration)
```

---

## 🐛 Troubleshooting

### "Module not found: Can't resolve 'next-auth/react'"
```bash
npm install
```

### "Error: NEXTAUTH_SECRET is not set"
Generate and add to `.env.local`:
```bash
openssl rand -base64 32
```

### "Error: Unauthorized" when accessing admin
1. Check `ADMIN_EMAIL_ALLOWLIST` includes your Google account email
2. Sign out and sign in again
3. In development, API routes bypass auth, but UI still requires login

### Database connection errors
1. Verify `DATABASE_URL` is correct
2. Check database is running and accessible
3. Run `npm run db:push` to create tables

### Stripe webhook signature verification fails
1. Verify `STRIPE_WEBHOOK_SECRET` matches your endpoint
2. Use `stripe listen` for local testing
3. Check webhook is configured in Stripe dashboard for production

### Build errors with "use client"
Make sure all client-side hooks (`useState`, `useEffect`, `useSession`, etc.) are in components marked with `"use client"` at the top.

---

## 📚 Key Differences from Previous Setup

| Feature | Before (Vite + Express) | After (Next.js) |
|---------|------------------------|-----------------|
| **Routing** | Wouter | Next.js App Router |
| **SEO** | react-helmet | Next.js metadata |
| **Auth** | Replit OAuth | Google OAuth (NextAuth) |
| **API** | Express routes | Next.js Route Handlers |
| **Build** | Vite + esbuild | Next.js |
| **Dev Server** | Separate Vite + tsx | Single Next.js dev server |
| **Port** | 5000 | 3000 |
| **Admin Access** | Replit user auth | Email allowlist |

---

## 🎯 Benefits of Migration

1. **Simplified Stack**: Single framework for frontend + backend
2. **Better SEO**: Built-in SSR, metadata handling, image optimization
3. **Modern Auth**: Standard OAuth with session management
4. **Easier Deployment**: Deploy to Vercel, Netlify, or any Node host
5. **Better DX**: HMR for both client and API routes
6. **Type Safety**: Shared types between client and API with better inference
7. **Scalability**: Edge runtime support for API routes (future)

---

## ✅ Post-Migration Checklist

- [ ] Dependencies installed
- [ ] `.env.local` configured
- [ ] Google OAuth set up
- [ ] Database migrated
- [ ] Dev server runs successfully
- [ ] All pages accessible
- [ ] Authentication works
- [ ] Lead CRUD operations work
- [ ] Stripe checkout works
- [ ] Webhook handling works
- [ ] Production environment variables set
- [ ] Deployment successful
- [ ] Stripe production webhook configured

---

## 🆘 Need Help?

- Next.js Docs: https://nextjs.org/docs
- NextAuth Docs: https://authjs.dev/
- Drizzle Adapter: https://authjs.dev/reference/adapter/drizzle

For project-specific questions, check `CLAUDE.md` for architecture details.

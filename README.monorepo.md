# Kaax AI - Monorepo

Monorepo con frontend estático (Next.js SSG) y backend API (Hono + Lambda).

## Arquitectura

```
┌─────────────────────────────────────────┐
│   Cloudflare Pages (Frontend)           │
│   - Next.js 15 SSG                      │
│   - Build: <1min                        │
│   - Deploy: instantáneo                 │
│   - $0 (plan free)                      │
└─────────────────┬───────────────────────┘
                  │ fetch(NEXT_PUBLIC_API_URL)
                  ▼
┌─────────────────────────────────────────┐
│   AWS Lambda + Function URL (Backend)   │
│   - Hono framework                      │
│   - Cold start: ~100ms                  │
│   - Auto-scaling: 0 → 1000+            │
│   - ~$5-8 / 1M requests                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│   PostgreSQL (Supabase)                 │
│   - Connection pooling                  │
│   - Drizzle ORM                         │
└─────────────────────────────────────────┘
```

## Estructura del Proyecto

```
kaax-landing/
├── frontend/           # Next.js SSG (Cloudflare Pages)
│   ├── app/           # App Router (SSG)
│   ├── client/        # Client components
│   ├── public/        # Static assets
│   └── package.json
│
├── backend/           # Hono API (AWS Lambda)
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── lib/       # DB, Stripe, Storage
│   │   └── lambda.ts  # Lambda handler
│   ├── cdk/           # AWS CDK stack
│   ├── shared/        # Database schema
│   └── package.json
│
└── package.json       # Root (Yarn workspaces)
```

## Stack

### Frontend
- Next.js 15 (App Router + SSG)
- React 18
- TailwindCSS + shadcn/ui
- React Query
- Framer Motion

### Backend
- Hono (ultrarrápido)
- AWS Lambda (ARM64/Graviton2)
- Drizzle ORM
- PostgreSQL
- Stripe

## Quick Start

### Setup

```bash
# Instalar Node 20
nvm install 20
nvm use

# Habilitar Yarn 4
corepack enable

# Instalar dependencias (monorepo)
yarn install
```

### Desarrollo

```bash
# Terminal 1: Frontend
yarn dev:frontend
# http://localhost:3000

# Terminal 2: Backend (desarrollo local con Node server)
yarn dev:backend
# http://localhost:8787
```

### Build

```bash
# Frontend (output: frontend/out/)
yarn build:frontend

# Backend (output: backend/dist/)
yarn build:backend
```

### Deploy

```bash
# Frontend → Cloudflare Pages
cd frontend && npx wrangler pages deploy out

# Backend → AWS Lambda
cd backend && yarn deploy
```

## Configuración de Entornos

### Frontend (`.env.local`)

```bash
NEXT_PUBLIC_API_URL=https://your-lambda-url.amazonaws.com
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/...
```

### Backend (`.env`)

```bash
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://kaax.ai
NODE_ENV=production
```

## Ventajas del Monorepo

✅ **Frontend independiente**
- Builds súper rápidos (<1min)
- Deploy instantáneo a Cloudflare
- Sin dependencias del backend
- SSG puro = carga instantánea

✅ **Backend independiente**
- Escalado automático (Lambda)
- Cold starts rápidos (~100ms)
- Pay-per-request (muy barato)
- Fácil de mantener y actualizar

✅ **Desarrollo desacoplado**
- Frontend y backend pueden deployarse independientemente
- Diferentes velocidades de iteración
- Sin bloqueos entre equipos

## Scripts Disponibles

### Root
```bash
yarn dev:frontend       # Dev frontend
yarn dev:backend        # Dev backend
yarn build:frontend     # Build frontend
yarn build:backend      # Build backend
yarn deploy:backend     # Deploy backend a AWS
```

### Frontend
```bash
cd frontend
yarn dev               # Development server
yarn build             # Build estático
yarn start             # Preview build
```

### Backend
```bash
cd backend
yarn dev               # Development con hot reload
yarn build             # Build para Lambda
yarn deploy            # Deploy con CDK
yarn synth             # Ver CloudFormation template
yarn db:push           # Push schema a DB
```

## Costos Mensuales Estimados

- **Frontend (Cloudflare):** $0 (plan free hasta 500 builds/mes)
- **Backend (Lambda):** ~$5-8 para 1M requests
- **Database (Supabase):** $0 (plan free) o $25 (pro)
- **Stripe:** 2.9% + $0.30 por transacción

**Total:** ~$5-35/mes dependiendo del tráfico

## Próximos Pasos

1. ✅ Monorepo configurado
2. ⏳ Configurar variables de entorno
3. ⏳ Deploy frontend a Cloudflare
4. ⏳ Deploy backend a AWS Lambda
5. ⏳ Configurar Stripe webhook URL
6. ⏳ Testing end-to-end

## Documentación

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

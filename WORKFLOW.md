# Kaax - Flujo de Trabajo Completo

Guía completa de cómo trabajar con el monorepo Kaax (Frontend + Backend).

---

## 📋 Tabla de Contenidos

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Setup Inicial](#setup-inicial)
- [Workflow de Desarrollo](#workflow-de-desarrollo)
- [Deploy a Producción](#deploy-a-producción)
- [Casos de Uso Comunes](#casos-de-uso-comunes)
- [Troubleshooting](#troubleshooting)

---

## 📁 Estructura del Proyecto

```
kaax-landing/                    # Monorepo raíz
├── frontend/                    # Next.js 15 (SSG)
│   ├── app/                    # App Router
│   ├── client/src/             # Componentes React
│   ├── public/                 # Assets estáticos
│   └── out/                    # Build output (después de build)
│
├── backend/                     # Hono API (Lambda)
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── lib/               # DB, Stripe, Secrets
│   │   └── lambda.ts          # Lambda handler
│   ├── cdk/                    # AWS CDK infra
│   ├── dist/                   # Build output
│   ├── Makefile               # Comandos AWS
│   └── README.md              # Docs del backend
│
├── package.json                # Root (Yarn workspaces)
├── .nvmrc                      # Node 20
└── README.md                   # Docs generales
```

---

## 🚀 Setup Inicial

### 1. Clonar y Preparar Entorno

```bash
# Clonar repo
git clone <repo-url>
cd kaax-landing

# Usar Node 20
nvm install
nvm use

# Habilitar Yarn 4
corepack enable

# Instalar todas las dependencias
yarn install
```

### 2. Configurar Variables de Entorno

#### Backend (`.env`)

```bash
cd backend
cp .env.example .env
```

Editar `backend/.env`:
```bash
# AWS
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

#### Frontend (`.env.local`)

```bash
cd ../frontend
cp .env.example .env.local
```

Editar `frontend/.env.local`:
```bash
# Backend API (después de deploy del backend)
NEXT_PUBLIC_API_URL=https://auth.kaax.ai

# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...

# Calendly
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/...
```

---

## 💻 Workflow de Desarrollo

### Desarrollo Local (Frontend + Backend)

Abre **2 terminales**:

**Terminal 1 - Backend:**
```bash
cd backend
make dev
# Backend en http://localhost:8787
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn dev
# Frontend en http://localhost:3000
```

El frontend llama automáticamente al backend local (`NEXT_PUBLIC_API_URL`).

### Workflow Típico

#### 1. Trabajar en el Frontend

```bash
cd frontend

# Dev server con hot reload
yarn dev

# Editar archivos en:
# - client/src/pages/      (páginas interactivas)
# - client/src/components/ (componentes UI)
# - app/                   (wrappers SSG)
```

#### 2. Trabajar en el Backend

```bash
cd backend

# Dev server con hot reload
make dev

# Editar archivos en:
# - src/routes/      (API endpoints)
# - src/lib/         (lógica compartida)
```

#### 3. Ver Logs

```bash
# Logs del backend local
# Se muestran automáticamente en la terminal

# Logs del backend en AWS (producción)
cd backend
make logs
```

#### 4. Testing

```bash
# Test health endpoint local
curl http://localhost:8787/health

# Test frontend local
# Abrir http://localhost:3000 en el browser
```

---

## 🚢 Deploy a Producción

### Primera Vez (Setup Completo)

#### 1. Deploy del Backend

```bash
cd backend

# Bootstrap AWS CDK (solo primera vez)
make cdk-bootstrap

# Crear secrets
make secret-create

# Solicitar certificado SSL
make cert-request

# Ver CNAME de validación
make cert-validation
```

**Agregar CNAME en Squarespace:**
```
Type: CNAME
Host: _abc123.auth
Points To: _xyz789.acm-validations.aws
```

Esperar 10-30 min hasta que el certificado esté validado:
```bash
make cert-status
```

**Deploy completo:**
```bash
make deploy
```

**Configurar DNS final:**

El output del deploy te da el CNAME target. Agregar en Squarespace:
```
Type: CNAME
Host: auth
Points To: d-abc123.execute-api.us-east-1.amazonaws.com
```

Esperar 5-15 min y verificar:
```bash
make test-health
```

#### 2. Deploy del Frontend

```bash
cd frontend

# Actualizar .env.local con el backend URL
# NEXT_PUBLIC_API_URL=https://auth.kaax.ai

# Build estático
yarn build

# Deploy a Cloudflare Pages
npx wrangler pages deploy out --project-name=kaax-frontend
```

O conectar el repo a Cloudflare Pages en el dashboard.

---

### Deploys Subsecuentes

#### Deploy Rápido del Backend (Solo Código)

```bash
cd backend
make lambda-update
```

⏱️ **~10 segundos**

Usar cuando solo cambias código, sin tocar:
- Variables de entorno
- Configuración Lambda
- Permisos
- API Gateway

#### Deploy Completo del Backend

```bash
cd backend
make deploy
```

⏱️ **~60 segundos**

Usar cuando cambias infraestructura.

#### Deploy del Frontend

```bash
cd frontend
yarn build
npx wrangler pages deploy out
```

O push a git si está conectado a Cloudflare Pages.

---

## 📖 Casos de Uso Comunes

### Caso 1: Agregar un Nuevo Endpoint API

#### 1. Crear route en backend

```bash
cd backend/src/routes
```

Crear `nuevo.ts`:
```typescript
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  return c.json({ message: "Hola desde nuevo endpoint" });
});

export default app;
```

#### 2. Registrar route en `index.ts`

```typescript
import nuevoRoutes from "./routes/nuevo";

app.route("/nuevo", nuevoRoutes);
```

#### 3. Test local

```bash
make dev
curl http://localhost:8787/nuevo
```

#### 4. Deploy

```bash
make lambda-update
```

#### 5. Test producción

```bash
curl https://auth.kaax.ai/nuevo
```

---

### Caso 2: Actualizar Credenciales (DB, Stripe, etc)

#### 1. Editar `.env` del backend

```bash
cd backend
nano .env
```

#### 2. Actualizar secret en AWS

```bash
make secret-update
```

#### 3. Reiniciar Lambda

```bash
make lambda-update
```

O esperar ~10 min de inactividad para cold start.

#### 4. Verificar

```bash
make test-health
```

---

### Caso 3: Agregar Nueva Página en Frontend

#### 1. Crear client component

```bash
cd frontend/client/src/pages
```

Crear `NuevaPaginaClient.tsx`:
```typescript
"use client";

export default function NuevaPaginaClient() {
  return (
    <div>
      <h1>Nueva Página</h1>
    </div>
  );
}
```

#### 2. Crear SSG wrapper

```bash
cd frontend/app
mkdir nueva-pagina
```

Crear `app/nueva-pagina/page.tsx`:
```typescript
import type { Metadata } from "next";
import NuevaPaginaClient from "@/pages/NuevaPaginaClient";

export const metadata: Metadata = {
  title: "Nueva Página - Kaax",
  description: "Descripción",
};

export default function Page() {
  return <NuevaPaginaClient />;
}
```

#### 3. Test local

```bash
yarn dev
# Abrir http://localhost:3000/nueva-pagina
```

#### 4. Deploy

```bash
yarn build
npx wrangler pages deploy out
```

---

### Caso 4: Cambiar Dominio o Configuración DNS

#### 1. Solicitar nuevo certificado

```bash
cd backend
make cert-request
```

#### 2. Validar con DNS

```bash
make cert-validation
# Agregar CNAME en Squarespace
```

#### 3. Actualizar dominio en CDK

Editar `backend/cdk/stack.ts`:
```typescript
domainName: "nuevo.kaax.ai",
```

#### 4. Redeploy

```bash
make deploy
```

#### 5. Actualizar DNS final

Agregar CNAME en Squarespace apuntando al nuevo target.

---

### Caso 5: Ver Logs de Producción

```bash
cd backend

# Logs en tiempo real (últimos 5 min)
make logs

# Solo errores
make lambda-logs-errors

# Últimas 100 líneas
aws logs tail /aws/lambda/<FUNCTION_NAME> \
  --since 1h \
  --format short
```

---

### Caso 6: Rollback (Volver a Versión Anterior)

#### Backend (usando Git)

```bash
cd backend

# Ver commits recientes
git log --oneline -10

# Revertir a commit específico
git checkout <commit-hash> -- src/

# Rebuild y redeploy
make lambda-update
```

#### Frontend

En Cloudflare Pages dashboard:
1. Ve a **Deployments**
2. Click en el deployment anterior
3. Click **Rollback to this deployment**

---

### Caso 7: Configurar Stripe Webhook

#### 1. Obtener URL del webhook

El webhook URL es:
```
https://auth.kaax.ai/stripe/webhook
```

#### 2. Configurar en Stripe Dashboard

1. Ve a https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. URL: `https://auth.kaax.ai/stripe/webhook`
4. Events: Seleccionar:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copiar **Signing secret** (empieza con `whsec_`)

#### 3. Actualizar secret en backend

```bash
cd backend
nano .env
# Agregar: STRIPE_WEBHOOK_SECRET=whsec_...

make secret-update
make lambda-update
```

#### 4. Test webhook

En Stripe Dashboard:
1. Ve al webhook
2. Click **Send test webhook**
3. Enviar evento de prueba

Verificar logs:
```bash
make logs
```

---

## 🐛 Troubleshooting

### Frontend no se conecta al Backend

**Problema:** `fetch failed` o `CORS error`

**Solución:**
1. Verificar que `NEXT_PUBLIC_API_URL` está configurado:
   ```bash
   cat frontend/.env.local | grep API_URL
   ```

2. Verificar que el backend está corriendo:
   ```bash
   curl https://auth.kaax.ai/health
   ```

3. Verificar CORS en `backend/src/index.ts`:
   ```typescript
   cors({
     origin: ["https://kaax.ai", "http://localhost:3000"],
     credentials: true,
   })
   ```

---

### Backend devuelve 500 Internal Server Error

**Problema:** Lambda tiene un error

**Solución:**
```bash
cd backend
make lambda-logs-errors
```

Causas comunes:
- Database connection error (verificar `DATABASE_URL`)
- Stripe key inválida (verificar `STRIPE_SECRET_KEY`)
- Secret no cargado (hacer `make secret-update` y `make lambda-update`)

---

### Build del Frontend Falla

**Problema:** `yarn build` falla

**Solución:**
1. Limpiar cache:
   ```bash
   rm -rf .next
   yarn build
   ```

2. Verificar que todas las dependencias están instaladas:
   ```bash
   yarn install
   ```

3. Verificar errores de TypeScript:
   ```bash
   yarn check
   ```

---

### DNS no Resuelve (auth.kaax.ai)

**Problema:** `Could not resolve host`

**Solución:**
1. Verificar CNAME en Squarespace:
   ```
   Host: auth
   Type: CNAME
   Points To: d-abc123.execute-api.us-east-1.amazonaws.com
   ```

2. Esperar propagación (5-30 min):
   ```bash
   cd backend
   make dns-monitor
   ```

3. Test con URL directa mientras tanto:
   ```bash
   make test-health-direct
   ```

---

## 🎯 Comandos Rápidos (Cheat Sheet)

### Desarrollo
```bash
# Backend dev
cd backend && make dev

# Frontend dev
cd frontend && yarn dev
```

### Deploy
```bash
# Backend rápido
cd backend && make lambda-update

# Backend completo
cd backend && make deploy

# Frontend
cd frontend && yarn build && npx wrangler pages deploy out
```

### Monitoring
```bash
# Ver logs
cd backend && make logs

# Ver info del stack
cd backend && make info

# Test endpoints
cd backend && make test-all
```

### Secrets
```bash
# Ver secrets
cd backend && make secret-get

# Actualizar secrets
cd backend && make secret-update
```

---

## 📞 Ayuda

- **Backend README:** `backend/README.md`
- **Makefile help:** `cd backend && make help`
- **Frontend README:** `frontend/README.md`
- **Monorepo README:** `README.monorepo.md`

Para más información, revisa los logs o contacta al equipo.

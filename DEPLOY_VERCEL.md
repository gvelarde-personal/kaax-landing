# Deploy a Vercel - Guía Paso a Paso

## 🎯 Por qué Vercel

- ✅ Páginas SSG se sirven desde Edge CDN (súper rápido)
- ✅ API Routes funcionan como serverless functions
- ✅ Deploy automático desde Git
- ✅ HTTPS automático
- ✅ Preview deployments en cada PR
- ✅ Gratis para empezar (Hobby tier)

---

## 📋 Pre-requisitos

1. ✅ Código en Git (GitHub, GitLab, o Bitbucket)
2. ✅ Base de datos PostgreSQL externa (Neon, Supabase, Railway)
3. ✅ Google OAuth configurado
4. ✅ Cuenta de Stripe

---

## 🚀 Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
vercel login
```

---

## 🔧 Paso 2: Configurar Base de Datos Externa

### Opción A: Neon (Recomendado - Gratis)

1. Ve a [neon.tech](https://neon.tech)
2. Crea cuenta gratis
3. Crea un proyecto
4. Copia la connection string: `postgresql://user:pass@host/db`

### Opción B: Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea proyecto
3. Ve a Settings → Database → Connection String
4. Copia la connection string

### Opción C: Railway

1. Ve a [railway.app](https://railway.app)
2. New Project → PostgreSQL
3. Copia connection string

---

## 🔐 Paso 3: Environment Variables

Crea archivo `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

**NO subas** `.env.local` a Git. Configura las variables en Vercel.

---

## 🌐 Paso 4: Deploy desde Terminal

### Primera vez:

```bash
cd /Users/gvelarde/Downloads/kaax-landing
vercel
```

Te preguntará:
- Set up and deploy? **Y**
- Which scope? **Tu cuenta**
- Link to existing project? **N**
- Project name? **kaax-landing** (o el que quieras)
- In which directory is your code? **.**
- Want to override settings? **N**

### Agregar Environment Variables:

```bash
# Una por una
vercel env add DATABASE_URL production
# Pega tu connection string

vercel env add NEXTAUTH_SECRET production
# Pega: resultado de `openssl rand -base64 32`

vercel env add NEXTAUTH_URL production
# Pega: https://tu-proyecto.vercel.app

vercel env add GOOGLE_CLIENT_ID production
# Pega tu Google Client ID

vercel env add GOOGLE_CLIENT_SECRET production
# Pega tu Google Client Secret

vercel env add ADMIN_EMAIL_ALLOWLIST production
# Pega: tu-email@gmail.com

# Stripe
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_PRICE_ID production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_STRIPE_PUBLIC_KEY production

# Calendly
vercel env add NEXT_PUBLIC_CALENDLY_URL production
```

### Deploy a producción:

```bash
vercel --prod
```

---

## 🎨 Paso 5: Deploy desde GitHub (Recomendado)

### A. Sube tu código a GitHub:

```bash
git init
git add .
git commit -m "Initial commit - Next.js migration"
git branch -M main
git remote add origin https://github.com/tu-usuario/kaax-landing.git
git push -u origin main
```

### B. Conecta Vercel con GitHub:

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Import Git Repository
3. Selecciona tu repo `kaax-landing`
4. Configure Project:
   - Framework Preset: **Next.js** (detectado automáticamente)
   - Root Directory: **.** (dejar vacío)
   - Build Command: `npm run build` (automático)
   - Output Directory: `.next` (automático)

5. **Environment Variables** - Agrega todas:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=...
   NEXTAUTH_URL=https://tu-proyecto.vercel.app
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ADMIN_EMAIL_ALLOWLIST=tu@email.com
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PRICE_ID=price_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
   NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/tu-link
   ```

6. Click **Deploy**

### C. Configurar deploys automáticos:

Ahora cada `git push` a `main` hará deploy automático! 🎉

---

## 🔧 Paso 6: Configurar Servicios Externos

### A. Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edita tus OAuth 2.0 credentials
3. Agrega Authorized redirect URIs:
   ```
   https://tu-proyecto.vercel.app/api/auth/callback/google
   ```

### B. Stripe Webhook

1. Ve a [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint:
   ```
   https://tu-proyecto.vercel.app/api/stripe/webhook
   ```
3. Selecciona eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copia el webhook signing secret
5. Actualiza en Vercel:
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET production
   # Pega el nuevo secret
   ```
6. Redeploy:
   ```bash
   vercel --prod
   ```

---

## 🗄️ Paso 7: Migrar Base de Datos

### Migrar desde base de datos local/Replit a Neon/Supabase:

```bash
# 1. Exportar datos actuales
pg_dump $OLD_DATABASE_URL > backup.sql

# 2. Importar a nueva base de datos
psql $NEW_DATABASE_URL < backup.sql

# 3. Ejecutar migraciones de NextAuth
DATABASE_URL=$NEW_DATABASE_URL npm run db:push
```

---

## ✅ Verificación Post-Deploy

### Checklist:

- [ ] Sitio carga: `https://tu-proyecto.vercel.app`
- [ ] Metadata SEO visible en View Source
- [ ] `/demo` funciona correctamente
- [ ] Google OAuth funciona en `/admin`
- [ ] Solo emails en allowlist pueden acceder a admin
- [ ] Crear lead desde home funciona
- [ ] Ver leads en admin funciona
- [ ] Stripe checkout redirige correctamente
- [ ] Webhook de Stripe se activa (verifica en Stripe Dashboard)
- [ ] `/success` muestra después de pago
- [ ] Imágenes cargan (favicon, OG image)

### Test Performance:

```bash
# Lighthouse
npx lighthouse https://tu-proyecto.vercel.app --view

# O usa: https://pagespeed.web.dev/
```

**Espera:**
- Performance: 90-100 en páginas SSG
- SEO: 100
- Best Practices: 90+

---

## 🎛️ Dashboard de Vercel

Accede a: [vercel.com/dashboard](https://vercel.com/dashboard)

Desde ahí puedes:
- Ver deployments
- Ver logs en tiempo real
- Editar environment variables
- Ver analytics
- Configurar dominios custom
- Ver preview deployments de PRs

---

## 🌍 Dominios Custom (Opcional)

### Agregar tu propio dominio:

1. En Vercel Dashboard → Project Settings → Domains
2. Add Domain: `kaax.ai`
3. Configura DNS:
   - Tipo: `A` → IP: `76.76.21.21`
   - Tipo: `CNAME` → `www` → `cname.vercel-dns.com`
4. Vercel automáticamente provision SSL

### Actualizar environment variables:

```bash
vercel env add NEXTAUTH_URL production
# Actualiza a: https://kaax.ai

# También actualiza Google OAuth redirect URI
```

---

## 🐛 Troubleshooting

### Build falla

Ver logs:
```bash
vercel logs <deployment-url>
```

Errores comunes:
- **Module not found**: `npm install` y commit el package-lock.json
- **Type errors**: `npm run check` localmente primero
- **Env var missing**: Verifica que todas estén en Vercel

### Database connection fails

- Verifica que `DATABASE_URL` sea correcta
- Verifica que la base de datos externa permita conexiones desde Vercel IPs
- Neon/Supabase ya lo permiten por defecto

### NextAuth errors

- Verifica `NEXTAUTH_URL` sea tu URL de producción
- Verifica `NEXTAUTH_SECRET` esté configurado
- Verifica Google OAuth redirect URI incluya el dominio de Vercel

### Stripe webhook no funciona

1. Verifica el endpoint en Stripe Dashboard
2. Verifica que `STRIPE_WEBHOOK_SECRET` sea del endpoint de producción (no de Stripe CLI)
3. Verifica que los eventos estén seleccionados

---

## 💰 Costos

### Vercel Hobby (Gratis)

- ✅ 100GB bandwidth/mes
- ✅ Unlimited requests
- ✅ SSL automático
- ✅ Suficiente para MVP y pequeñas empresas

### Vercel Pro ($20/mes)

- ✅ 1TB bandwidth
- ✅ Team collaboration
- ✅ Password protection
- ✅ Analytics avanzados

### Base de datos (Neon/Supabase)

- **Neon Free**: 0.5GB storage, 10GB bandwidth
- **Supabase Free**: 500MB storage, 2GB bandwidth
- Upgrade solo si necesitas más

---

## 🚀 Deploy Recap

```bash
# Setup inicial
git init
git add .
git commit -m "Initial commit"
git push

# Vercel
vercel login
vercel
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
# ... agregar todas las env vars
vercel --prod

# Configurar externos
# → Google OAuth: agregar redirect URI
# → Stripe: agregar webhook endpoint
```

**¡Listo!** Tu sitio está en producción con:
- ✅ SSG pages cacheadas en CDN
- ✅ API routes serverless
- ✅ Deploy automático en cada push
- ✅ HTTPS automático

---

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Neon Docs](https://neon.tech/docs)
- [NextAuth Deployment](https://authjs.dev/getting-started/deployment)

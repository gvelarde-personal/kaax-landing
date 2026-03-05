# Kaax AI Landing Page

Agente de IA en WhatsApp para ventas B2B · $18,000 MXN/mes

## 🚀 Quick Start

### Requisitos

- Node.js 20+ (usa `nvm install` si tienes nvm)
- PostgreSQL
- Yarn o npm

### Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd kaax-landing

# 2. Instalar dependencias
yarn          # Recomendado (más rápido)
# o
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus valores

# 4. Sincronizar base de datos
yarn db:push
# o
npm run db:push

# 5. Iniciar desarrollo
yarn dev
# o
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000)

---

## 📦 Comandos Disponibles

| Acción | Yarn | npm |
|--------|------|-----|
| **Desarrollo** | `yarn dev` | `npm run dev` |
| **Build** | `yarn build` | `npm run build` |
| **Producción** | `yarn start` | `npm start` |
| **Type Check** | `yarn check` | `npm run check` |
| **DB Sync** | `yarn db:push` | `npm run db:push` |

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Auth**: NextAuth v5 (Google OAuth)
- **Database**: PostgreSQL + Drizzle ORM
- **Payments**: Stripe
- **Styling**: TailwindCSS + Shadcn/ui
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion

---

## 📁 Estructura del Proyecto

```
kaax-landing/
├── app/                 # Next.js App Router
│   ├── api/            # API route handlers
│   └── */page.tsx      # Páginas (/, /demo, /admin, etc.)
├── client/src/         # UI Components
│   ├── components/     # Shadcn/ui components
│   ├── pages/          # Page components (Client)
│   └── hooks/          # React Query hooks
├── lib/                # Server utilities
│   ├── db.ts          # Database connection
│   ├── auth.ts        # NextAuth config
│   └── stripe.ts      # Stripe SDK
├── shared/            # Shared types
│   └── schema.ts      # Drizzle schema
└── public/            # Static assets
```

---

## 🔧 Configuración

### Variables de Entorno

Ver `.env.example` para todas las variables requeridas.

**Esenciales:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generar con: `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `ADMIN_EMAIL_ALLOWLIST` - Emails permitidos en /admin
- `STRIPE_SECRET_KEY` / `STRIPE_PRICE_ID` - Stripe
- `NEXT_PUBLIC_CALENDLY_URL` - Link de Calendly

### Google OAuth Setup

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add authorized redirect: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret to `.env.local`

---

## 📄 Documentación

- **[MIGRATION.md](./MIGRATION.md)** - Guía de migración de Vite a Next.js
- **[SSG_OPTIMIZATION.md](./SSG_OPTIMIZATION.md)** - Optimizaciones SSG
- **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)** - Deploy a producción
- **[YARN_SETUP.md](./YARN_SETUP.md)** - Usar Yarn en el proyecto
- **[NVM_SETUP.md](./NVM_SETUP.md)** - Configurar Node con nvm
- **[CLAUDE.md](./CLAUDE.md)** - Documentación técnica completa

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Ver [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) para guía completa.

### Docker

```bash
docker build -t kaax-landing .
docker run -p 3000:3000 --env-file .env kaax-landing
```

---

## 🧪 Testing

### Type Checking

```bash
yarn check
# o
npm run check
```

### Lighthouse (Performance)

```bash
yarn build
yarn start

# En otra terminal
npx lighthouse http://localhost:3000 --view
```

---

## 📈 Performance

Páginas pre-renderizadas (SSG):
- `/` - Home
- `/demo` - Demo interactiva
- `/privacidad` - Política de privacidad (100% estática)
- `/terminos` - Términos de servicio (100% estática)

Lighthouse Score esperado:
- **Performance**: 90-100
- **SEO**: 100
- **Best Practices**: 90+

---

## 🛡️ Seguridad

- ✅ NextAuth con Google OAuth
- ✅ Email allowlist para admin
- ✅ CSRF protection (NextAuth)
- ✅ SQL injection protected (Drizzle ORM)
- ✅ XSS protection (React)
- ✅ Stripe webhook signature verification

---

## 🐛 Troubleshooting

### Build errors

```bash
# Limpiar y reinstalar
rm -rf node_modules .next
yarn
# o
npm install

yarn build
```

### Database errors

```bash
# Re-sync schema
yarn db:push

# O migrar manualmente
psql $DATABASE_URL < migration.sql
```

### Auth errors

- Verifica `NEXTAUTH_URL` sea correcta
- Verifica Google OAuth redirect URI
- Verifica `ADMIN_EMAIL_ALLOWLIST` incluya tu email

---

## 📝 License

MIT

---

## 🤝 Contributing

1. Fork el repositorio
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📧 Contacto

- Website: [kaax.ai](https://kaax.ai)
- WhatsApp: +52 56 5898 9637

---

## ⭐ Características

- ✅ Landing page moderna con animaciones
- ✅ Demo interactiva con chat simulado de WhatsApp
- ✅ Panel de admin con gestión de leads
- ✅ Integración con Stripe para suscripciones
- ✅ Google OAuth para autenticación
- ✅ SEO optimizado con SSG
- ✅ Responsive design
- ✅ Dark mode by default
- ✅ Type-safe con TypeScript
- ✅ Database migrations con Drizzle

---

**Hecho con ❤️ para empresas B2B en México**

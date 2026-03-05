# Kaax Frontend

Frontend estático construido con **Next.js 15** (App Router) con **Static Site Generation (SSG)**.

## Stack

- **Next.js 15** - React framework con SSG
- **React 18** - UI library
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **React Query** - Data fetching
- **Framer Motion** - Animaciones

## Desarrollo Local

```bash
# Instalar dependencias
yarn install

# Copiar variables de entorno
cp .env.example .env.local
# Edita .env.local con tu API URL

# Desarrollo
yarn dev

# Abre http://localhost:3000
```

## Build Estático

```bash
# Build para producción (SSG)
yarn build

# Output: out/ directory con HTML estático
```

El build genera:
- ✅ HTML estático pre-renderizado
- ✅ Assets optimizados
- ✅ Sin Node.js runtime necesario
- ✅ Listo para CDN (Cloudflare Pages)

## Deploy a Cloudflare Pages

### Opción 1: Git Deploy (Recomendado)

1. Push a GitHub
2. Conecta repo en Cloudflare Pages
3. Configuración:
   ```
   Build command: yarn build
   Build output: out
   Root directory: frontend
   ```
4. Agrega variables de entorno:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
   - `NEXT_PUBLIC_CALENDLY_URL`

### Opción 2: Manual Deploy

```bash
# Build
yarn build

# Deploy con wrangler
npx wrangler pages deploy out --project-name=kaax-frontend
```

## Estructura

```
frontend/
├── app/                  # Next.js App Router (SSG wrappers)
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page (SSG)
│   ├── success/         # Success page (SSG)
│   └── providers.tsx    # Client providers
├── client/src/
│   ├── pages/           # Client components (interactivos)
│   ├── components/      # Componentes UI
│   │   └── ui/         # shadcn/ui components
│   ├── hooks/          # Custom hooks
│   └── index.css       # Global styles
├── lib/
│   ├── utils.ts        # Tailwind helpers
│   └── queryClient.ts  # React Query config
└── public/             # Static assets
```

## Patrón SSG

Todas las páginas usan el patrón:

**page.tsx** (Server Component - SSG):
```tsx
import type { Metadata } from "next";
import HomeClient from "@/pages/HomeClient";

export const metadata: Metadata = {
  title: "...",
  description: "...",
};

export default function Page() {
  return <HomeClient />;
}
```

**HomeClient.tsx** (Client Component):
```tsx
"use client";

export default function HomeClient() {
  // Toda la interactividad aquí
}
```

## Llamadas al Backend

```tsx
// Usar NEXT_PUBLIC_API_URL
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Ejemplo
const response = await fetch(`${apiUrl}/leads`, {
  method: 'POST',
  body: JSON.stringify(data),
});
```

## Performance

- ⚡ Build time: **<1 min**
- 📦 Bundle size: **~200KB** (gzipped)
- 🚀 First Paint: **<500ms**
- ✅ Lighthouse: **95+**

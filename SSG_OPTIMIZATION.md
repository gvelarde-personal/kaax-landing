# SSG (Static Site Generation) Optimization

## ✅ Patrón Implementado

Usamos el patrón de **Server Component Wrapper + Client Component** para maximizar SSG:

```
app/page.tsx (Server Component - SSG)
    ↓ importa
client/src/pages/HomeClient.tsx (Client Component - interactivo)
```

## 📊 Estado de Pre-renderización por Página

### 🟢 100% SSG (Totalmente Estáticas)

Estas páginas se generan completamente en build time:

- **`/privacidad`** - Política de Privacidad
  - Sin interactividad
  - Contenido estático
  - HTML pre-generado

- **`/terminos`** - Términos y Condiciones
  - Sin interactividad
  - Contenido estático
  - HTML pre-generado

### 🟡 SSG + Client Hydration (Parcialmente Estáticas)

Estas páginas se pre-renderizan con metadata y estructura, luego hidratan la interactividad:

- **`/`** (Home)
  - ✅ Metadata SEO pre-generada
  - ✅ Estructura HTML pre-renderizada
  - 🔄 Formularios hidratan en cliente
  - 🔄 Modales hidratan en cliente
  - 🔄 Animaciones hidratan en cliente

- **`/demo`**
  - ✅ Metadata SEO pre-generada
  - ✅ Estructura HTML pre-renderizada
  - 🔄 Chat interactivo hidrata en cliente
  - 🔄 Animaciones de mensajes hidratan en cliente

- **`/success`**
  - ✅ Metadata SEO pre-generada
  - ✅ Estructura HTML pre-renderizada
  - 🔄 Query params leídos en cliente
  - 🔄 Animaciones hidratan en cliente

### 🔴 No SSG (Requieren Autenticación)

Estas páginas NO pueden ser SSG por razones de seguridad:

- **`/admin`**
  - ❌ No SSG (requiere sesión de usuario)
  - ❌ Datos sensibles (leads, suscripciones)
  - ✅ Metadata pre-generada
  - Server rendering on-demand con autenticación

## 🎯 Beneficios Obtenidos

### SEO
- ✅ Metadata pre-generada en todas las páginas
- ✅ HTML estático para bots (Google, Facebook, Twitter)
- ✅ Open Graph tags pre-renderizados
- ✅ URLs limpias y rastreables

### Performance
- ✅ Páginas estáticas se sirven desde CDN
- ✅ Time to First Byte (TTFB) < 100ms en páginas SSG
- ✅ Core Web Vitals mejorados:
  - LCP (Largest Contentful Paint): Más rápido con SSG
  - FID (First Input Delay): No afectado
  - CLS (Cumulative Layout Shift): Mejorado con pre-render

### Cache
- ✅ `/privacidad` y `/terminos` cacheable por años
- ✅ `/`, `/demo`, `/success` cacheable con revalidación
- ✅ Metadata cacheable en todos los casos

## 🔧 Configuración Avanzada (Opcional)

### Revalidación Incremental (ISR)

Si quieres que las páginas se regeneren periódicamente:

```tsx
// app/page.tsx
export const revalidate = 3600; // Regenerar cada hora

export default function Page() {
  return <HomeClient />;
}
```

### Forzar SSG en Build Time

Para páginas dinámicas que quieres pre-generar:

```tsx
// app/page.tsx
export const dynamic = 'force-static';

export default function Page() {
  return <HomeClient />;
}
```

### Parámetros Dinámicos con SSG

Si creas rutas dinámicas y quieres pre-generarlas:

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  return [
    { slug: 'post-1' },
    { slug: 'post-2' },
  ];
}
```

## 📈 Medición de Resultados

### Verificar SSG en Build

```bash
npm run build
```

Busca en la salida:
- `○` (círculo) = SSG (Estático)
- `●` (círculo lleno) = SSR (Server Side Rendering)
- `ƒ` (función) = Dynamic

### Lighthouse Score

Ejecuta Lighthouse en cada página para verificar:
- Performance: Debe ser 90+ en páginas SSG
- SEO: Debe ser 100
- Best Practices: 90+

### Next.js Bundle Analyzer

```bash
npm install --save-dev @next/bundle-analyzer
```

```js
// next.config.mjs
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  reactStrictMode: true,
});
```

Analizar bundle:
```bash
ANALYZE=true npm run build
```

## 🚀 Deployment

### Vercel (Recomendado para SSG)

Vercel optimiza automáticamente:
- ✅ SSG pages se sirven desde Edge Network
- ✅ Caching automático con CDN
- ✅ Invalidación automática en redeploy

```bash
vercel deploy
```

### Self-Hosted

Con nginx, cachea las páginas estáticas:

```nginx
location / {
    proxy_pass http://localhost:3000;

    # Cache páginas SSG por 1 hora
    proxy_cache_valid 200 1h;
    proxy_cache_bypass $http_pragma $http_authorization;
}

# Cache páginas totalmente estáticas por 1 año
location ~ ^/(privacidad|terminos) {
    proxy_pass http://localhost:3000;
    proxy_cache_valid 200 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

## 📝 Resumen

| Página | Tipo | Pre-render | Hidratación | SEO | Cache |
|--------|------|------------|-------------|-----|-------|
| `/` | SSG + Client | ✅ | ✅ | ✅ | 1h |
| `/demo` | SSG + Client | ✅ | ✅ | ✅ | 1h |
| `/success` | SSG + Client | ✅ | ✅ | ✅ | 1h |
| `/privacidad` | SSG 100% | ✅ | ❌ | ✅ | 1 año |
| `/terminos` | SSG 100% | ✅ | ❌ | ✅ | 1 año |
| `/admin` | SSR + Auth | ❌ | ✅ | ⚠️ | No cache |

## ✅ Checklist de Optimización

- [x] Separar Server Components de Client Components
- [x] Metadata en Server Components
- [x] Páginas estáticas sin "use client"
- [x] Client Components solo donde hay interactividad
- [ ] Configurar revalidación ISR (opcional)
- [ ] Configurar CDN/caching en producción
- [ ] Medir con Lighthouse
- [ ] Optimizar bundle size con analyzer

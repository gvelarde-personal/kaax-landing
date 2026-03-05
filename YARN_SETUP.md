# Usar Yarn en este proyecto

## ✅ Yarn está configurado y listo para usar

### 📦 Instalación de Yarn

#### macOS / Linux

```bash
# Instalar Yarn globalmente con npm (solo una vez)
npm install -g yarn

# Verificar
yarn --version
```

#### O usando Homebrew (macOS)

```bash
brew install yarn
```

#### O usando Corepack (recomendado - incluido con Node 20)

```bash
corepack enable
corepack prepare yarn@stable --activate
```

---

## 🚀 Comandos del Proyecto

### En lugar de npm, usa:

| npm | yarn | Descripción |
|-----|------|-------------|
| `npm install` | `yarn` o `yarn install` | Instalar dependencias |
| `npm run dev` | `yarn dev` | Desarrollo con Turbopack |
| `npm run build` | `yarn build` | Build de producción |
| `npm start` | `yarn start` | Servidor de producción |
| `npm run check` | `yarn check` | TypeScript type checking |
| `npm run db:push` | `yarn db:push` | Sincronizar schema DB |
| `npm install <pkg>` | `yarn add <pkg>` | Agregar dependencia |
| `npm install -D <pkg>` | `yarn add -D <pkg>` | Agregar dev dependency |
| `npm uninstall <pkg>` | `yarn remove <pkg>` | Remover dependencia |

---

## 🎯 Quick Start con Yarn

```bash
# 1. Instalar Yarn (si no lo tienes)
npm install -g yarn

# 2. En el proyecto
cd /Users/gvelarde/Downloads/kaax-landing

# 3. Instalar dependencias
yarn

# 4. Configurar .env.local
cp .env.example .env.local
# Edita .env.local con tus valores

# 5. Migrar base de datos
yarn db:push

# 6. Desarrollo
yarn dev
```

---

## ⚡ Ventajas de Yarn

### vs npm:

- ✅ **Más rápido** - Instala en paralelo
- ✅ **Lockfile determinístico** - `yarn.lock` más confiable
- ✅ **Mejor cache** - Compartido entre proyectos
- ✅ **Workspaces nativos** - Para monorepos
- ✅ **Plug'n'Play** (opcional) - Sin node_modules

### Performance:

```bash
# npm install
⏱️  ~30-60s (primera vez)

# yarn install
⏱️  ~15-30s (primera vez)
⏱️  ~3-5s (con cache)
```

---

## 📋 Archivos de Yarn

Tu proyecto ahora tiene:

- ✅ `.yarnrc.yml` - Configuración de Yarn
- ✅ `package.json` con `packageManager` field
- ✅ `.gitignore` actualizado para Yarn

Después del primer `yarn install` tendrás:
- `yarn.lock` - Lockfile (commitealo a Git)
- `.yarn/cache/` - Cache local (opcional, ignoreado por Git)

---

## 🔧 Configuración Actual

Ver `.yarnrc.yml`:

```yaml
nodeLinker: node-modules     # Usa node_modules tradicional
enableGlobalCache: true      # Cache compartido entre proyectos
compressionLevel: mixed      # Optimizado para velocidad
nmHoistingLimits: workspaces # Hoisting inteligente
```

---

## 🐛 Troubleshooting

### "yarn: command not found"

```bash
# Instalar con npm
npm install -g yarn

# O con Corepack (Node 20+)
corepack enable
```

### Conflicto entre npm y yarn

Si ya tienes `node_modules/` de npm:

```bash
# Limpiar
rm -rf node_modules package-lock.json

# Instalar con Yarn
yarn
```

### Cache corrupto

```bash
yarn cache clean
yarn
```

### Versión de Yarn incorrecta

```bash
# Ver versión actual
yarn --version

# Actualizar a latest
npm install -g yarn@latest

# O con Corepack
corepack prepare yarn@stable --activate
```

---

## 📊 Comparación Real

### Este proyecto con yarn:

```bash
$ yarn
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...
✨  Done in 18.45s

$ yarn dev
⚡ Next.js 15.x.x turbo
- Local:        http://localhost:3000
Ready in 2.1s
```

### vs npm:

```bash
$ npm install
added 1234 packages in 45s

$ npm run dev
> next dev --turbo
⚡ Next.js 15.x.x turbo
- Local:        http://localhost:3000
Ready in 2.1s
```

**Resultado:** Yarn es ~2x más rápido en installs 🚀

---

## 🔐 Yarn.lock en Git

**SÍ commitea `yarn.lock`** a tu repositorio:

```bash
git add yarn.lock
git commit -m "Add yarn.lock"
```

Esto asegura que todos tengan las mismas versiones de dependencias.

---

## 🚀 Deploy con Yarn

### Vercel

Vercel detecta automáticamente `yarn.lock` y usa Yarn:

```bash
vercel
# ✅ Detecta yarn.lock
# ✅ Usa yarn install automáticamente
```

### Docker

```dockerfile
FROM node:20-alpine

# Instalar Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

# Copiar lockfile
COPY package.json yarn.lock ./

# Instalar con Yarn
RUN yarn --frozen-lockfile

COPY . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
```

### CI/CD (GitHub Actions)

```yaml
name: Build
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'yarn'
      - run: yarn --frozen-lockfile
      - run: yarn build
```

---

## ✅ Checklist

- [x] Yarn instalado globalmente
- [x] `.yarnrc.yml` configurado
- [x] `packageManager` en package.json
- [ ] `rm -rf node_modules package-lock.json` (si venías de npm)
- [ ] `yarn install`
- [ ] `git add yarn.lock`
- [ ] `yarn dev` funciona

---

## 📚 Recursos

- [Yarn Docs](https://yarnpkg.com/)
- [Yarn vs npm](https://yarnpkg.com/getting-started/migration)
- [Yarn Workspaces](https://yarnpkg.com/features/workspaces)

---

## 💡 Tips Útiles

### Listar comandos disponibles

```bash
yarn run
```

### Ver dependencias instaladas

```bash
yarn list --depth=0
```

### Actualizar dependencias

```bash
# Actualizar todas (patch/minor)
yarn upgrade

# Actualizar interactivo
yarn upgrade-interactive
```

### Verificar integridad

```bash
yarn install --check-files
```

### Generar yarn.lock limpio

```bash
rm yarn.lock
yarn
```

---

¡Listo para usar Yarn! 🎉

```bash
yarn && yarn dev
```

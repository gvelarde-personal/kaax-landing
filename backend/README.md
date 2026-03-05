# Kaax Backend API

API backend construida con **Hono** para desplegarse en **AWS Lambda** con CDK.

## Stack

- **Hono** - Framework ultrarrápido para APIs
- **AWS Lambda** - Serverless compute
- **AWS CDK** - Infrastructure as Code
- **Drizzle ORM** - TypeScript ORM
- **PostgreSQL** - Database (Supabase)
- **Stripe** - Payments

## Desarrollo Local

```bash
# Instalar dependencias
yarn install

# Copiar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# Desarrollo (hot reload)
yarn dev

# El servidor corre en http://localhost:8787
```

## Build

```bash
# Compilar para Lambda
yarn build

# Output: dist/index.mjs (bundle optimizado)
```

## Deploy a AWS

### Prerequisitos

1. AWS CLI configurado
2. Credenciales con permisos para Lambda, CloudFormation, IAM

### Deploy

```bash
# Instalar AWS CDK (si no lo tienes)
npm install -g aws-cdk

# Bootstrap CDK (solo primera vez)
cd cdk && cdk bootstrap

# Compilar backend
cd .. && yarn build

# Deploy
yarn deploy
```

### Variables de entorno en Lambda

El stack de CDK lee las variables desde tu `.env` local y las configura en Lambda.

**IMPORTANTE:** Para producción, usa AWS Secrets Manager o Parameter Store para variables sensibles.

## Rutas API

### Health Check
```
GET /health
```

### Leads
```
GET  /leads      - List leads (requiere auth en prod)
POST /leads      - Create lead
```

### Stripe
```
POST /stripe/webhook - Webhook de Stripe
```

## Arquitectura

```
Lambda Function (Node 20, ARM64)
├── 256MB RAM
├── 10s timeout
├── Function URL (CORS habilitado)
└── CloudWatch Logs (7 días retención)
```

## Cold Starts

- **~80-150ms** con Hono (bundle ~100KB)
- ARM64 (Graviton2) - más rápido y barato que x86

## Costos estimados

- 1M requests/mes: **~$5-8**
- Memoria: 256MB (suficiente)
- Compute: ~100ms promedio por request

# Kaax Auth Backend API

Backend de autenticación construido con **Hono** desplegado en **AWS Lambda** con CDK.

---

## 📚 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Setup Inicial](#setup-inicial)
- [Desarrollo Local](#desarrollo-local)
- [Deploy a AWS](#deploy-a-aws)
- [Gestión de Secrets](#gestión-de-secrets)
- [Custom Domain](#custom-domain)
- [Monitoreo](#monitoreo)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────┐
│   Custom Domain (Squarespace)   │
│   auth.kaax.ai                   │
└────────────┬────────────────────┘
             │ CNAME
             ▼
┌─────────────────────────────────┐
│   API Gateway HTTP API           │
│   - CORS habilitado              │
│   - SSL Certificate (ACM)        │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   Lambda Function                │
│   - Runtime: Node 20 (ARM64)     │
│   - Memory: 256MB                │
│   - Timeout: 10s                 │
│   - Cold start: ~100ms           │
└────────────┬────────────────────┘
             │
             ├──────────┬──────────────┐
             ▼          ▼              ▼
      ┌──────────┐  ┌──────┐    ┌────────┐
      │ Secrets  │  │  DB  │    │ Stripe │
      │ Manager  │  │  PG  │    │  API   │
      └──────────┘  └──────┘    └────────┘
```

**Stack:**
- **Framework:** Hono (ultrarrápido)
- **Compute:** AWS Lambda (ARM64/Graviton2)
- **IaC:** AWS CDK
- **Database:** PostgreSQL (Supabase)
- **Secrets:** AWS Secrets Manager
- **Payments:** Stripe

---

## 🚀 Setup Inicial

### 1. Prerequisitos

```bash
# Node 20
nvm install 20
nvm use 20

# Yarn 4
corepack enable

# AWS CLI (verificar)
aws --version
```

### 2. Instalar Dependencias

```bash
cd backend
make setup
# o
yarn install
```

### 3. Configurar Variables de Entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# Frontend
FRONTEND_URL=https://kaax.ai
```

---

## 💻 Desarrollo Local

### 1. Iniciar Servidor de Desarrollo

```bash
make dev
# o
yarn dev
```

El servidor corre en: **http://localhost:8787**

### 2. Endpoints Disponibles

```bash
# Health Check
curl http://localhost:8787/health

# Leads (GET)
curl http://localhost:8787/leads

# Leads (POST)
curl -X POST http://localhost:8787/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'

# Stripe Webhook (test)
curl -X POST http://localhost:8787/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"checkout.session.completed"}'
```

### 3. Ver Logs

```bash
# Logs en tiempo real
make logs

# Solo errores
make lambda-logs-errors
```

---

## 🚢 Deploy a AWS

### Primera Vez (Setup Completo)

#### 1. Bootstrap CDK en tu cuenta AWS

```bash
make cdk-bootstrap
```

Esto crea los recursos necesarios para CDK (solo se hace **una vez** por cuenta/región).

#### 2. Crear Secret con Credenciales

```bash
make secret-create
```

Esto crea `kaax-auth-secrets` en AWS Secrets Manager con:
- DATABASE_URL
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_ID

#### 3. Solicitar Certificado SSL

```bash
make cert-request
```

Solicita un certificado SSL para `auth.kaax.ai`.

#### 4. Validar Certificado (DNS)

```bash
# Ver records DNS necesarios
make cert-validation
```

Output:
```
Name: _abc123.auth.kaax.ai
Type: CNAME
Value: _xyz789.acm-validations.aws
```

**Agrega este CNAME en Squarespace DNS** y espera 10-30 min.

Verificar estado:
```bash
make cert-status
```

#### 5. Deploy Completo

Una vez que el certificado esté **ISSUED**:

```bash
make deploy
```

Esto:
1. Compila el código (`yarn build`)
2. Crea CloudFormation stack
3. Deploya Lambda function
4. Configura API Gateway
5. Configura Custom Domain

#### 6. Configurar DNS Final

El deploy te dará un **CNAME target**:

```
DomainTarget: d-abc123.execute-api.us-east-1.amazonaws.com
```

**Agrega en Squarespace:**
```
Type: CNAME
Host: auth
Points To: d-abc123.execute-api.us-east-1.amazonaws.com
TTL: 3600
```

Espera 5-15 min para propagación DNS.

Verificar:
```bash
make dns-monitor
```

---

### Deploys Subsecuentes (Updates)

#### Deploy Rápido (Solo Código)

Si solo cambias código (sin tocar infraestructura):

```bash
make lambda-update
```

⚡ **~10 segundos** vs deploy completo (~60s)

#### Deploy Completo (Cambios de Infra)

Si cambias:
- Variables de entorno
- Configuración Lambda
- API Gateway
- Permisos IAM

```bash
make deploy
```

#### Ver Cambios Antes de Deploy

```bash
make cdk-diff
```

---

## 🔐 Gestión de Secrets

### Ver Secret Actual

```bash
make secret-get
```

Output:
```json
{
  "DATABASE_URL": "postgresql://...",
  "STRIPE_SECRET_KEY": "sk_live_...",
  "STRIPE_WEBHOOK_SECRET": "whsec_...",
  "STRIPE_PRICE_ID": "price_..."
}
```

### Actualizar Secret

Edita `.env` con nuevos valores y ejecuta:

```bash
make secret-update
```

**IMPORTANTE:** Después de actualizar el secret, el Lambda debe **reiniciarse** para cargar los nuevos valores:

```bash
make lambda-update
```

O espera al próximo cold start (~5-10 min de inactividad).

### Eliminar Secret

```bash
make secret-delete
```

⚠️ Se programa eliminación en **7 días** (recuperable durante ese período).

---

## 🌐 Custom Domain

### Estado del Custom Domain

```bash
make api-domain
```

Output:
```
DomainName: auth.kaax.ai
Target: d-abc123.execute-api.us-east-1.amazonaws.com
Status: AVAILABLE
```

### Verificar DNS

```bash
# Ver resolución DNS
make dns-check

# Monitorear hasta que propague
make dns-monitor
```

### Testing

```bash
# Test con custom domain
make test-health

# Test con URL directa (backup)
make test-health-direct
```

---

## 📊 Monitoreo

### Ver Información del Stack

```bash
make info
# o
make status
```

Output:
```
=== Kaax Auth Backend Stack Info ===

Function Name: KaaxApiStack-KaaxAPI4BF1BC4E-0tpR2w0jVk5D
Region: us-east-1
Custom Domain: https://auth.kaax.ai
Secret Name: kaax-auth-secrets

Endpoints:
  - https://auth.kaax.ai/health
  - https://auth.kaax.ai/leads
  - https://auth.kaax.ai/stripe/webhook
```

### Ver Logs en Tiempo Real

```bash
# Últimos 5 minutos (follow)
make logs

# Solo errores
make lambda-logs-errors
```

### Invocar Lambda Directamente (Test)

```bash
make lambda-invoke
```

Ejecuta el Lambda directamente sin pasar por API Gateway.

### Info del Lambda

```bash
make lambda-info
```

Output:
```
Name       Runtime   Memory  Timeout  LastModified
kaax-auth  nodejs20  256MB   10s      2026-03-05T20:00:00Z
```

---

## 🐛 Troubleshooting

### 1. Lambda devuelve "Internal Server Error"

**Causa:** Error en el código o secrets no cargados.

**Solución:**
```bash
# Ver logs de error
make lambda-logs-errors

# Verificar secrets
make secret-get

# Si el secret está bien, actualizar Lambda
make lambda-update
```

### 2. DNS no resuelve (auth.kaax.ai no funciona)

**Causa:** DNS aún propagando o CNAME mal configurado.

**Solución:**
```bash
# Verificar DNS
make dns-check

# Ver target correcto
make api-domain

# Esperar propagación
make dns-monitor
```

**Verificar en Squarespace:**
- Host debe ser: `auth` (sin kaax.ai)
- Type: CNAME
- Points To: `d-xxxxx.execute-api.us-east-1.amazonaws.com`

### 3. "Could not resolve host: auth.kaax.ai"

**Causa:** DNS no propagado todavía.

**Solución:**
- Esperar 5-30 minutos después de agregar CNAME
- Usar URL directa mientras tanto:
  ```bash
  make test-health-direct
  ```

### 4. Certificado SSL en "PENDING_VALIDATION"

**Causa:** CNAME de validación no agregado o no propagado.

**Solución:**
```bash
# Ver CNAME de validación
make cert-validation

# Verificar estado
make cert-status
```

Agregar el CNAME exacto en Squarespace DNS.

### 5. "AccessDenied" en AWS

**Causa:** Credenciales AWS incorrectas o permisos insuficientes.

**Solución:**
```bash
# Verificar credenciales
aws sts get-caller-identity

# Verificar permisos (necesitas AdministratorAccess o similar)
```

### 6. Deploy falla con "Stack already exists"

**Causa:** Deploy previo incompleto.

**Solución:**
```bash
# Ver estado del stack
aws cloudformation describe-stacks \
  --stack-name KaaxApiStack \
  --region us-east-1

# Si está en ROLLBACK_COMPLETE, eliminar y recrear
make cdk-destroy
make deploy
```

---

## 🧹 Limpieza

### Eliminar Archivos Temporales

```bash
make clean
```

Elimina:
- `dist.zip`
- `response.json`
- `cdk.out/`

### Eliminar Todo el Stack

⚠️ **CUIDADO:** Esto elimina **todos** los recursos en AWS:

```bash
make cdk-destroy
```

Elimina:
- Lambda function
- API Gateway
- Custom Domain
- Permisos IAM
- (NO elimina el secret - hazlo manual)

---

## 📖 Comandos Rápidos

```bash
# Setup inicial
make setup

# Desarrollo
make dev

# Deploy rápido (solo código)
make lambda-update

# Deploy completo
make deploy

# Ver logs
make logs

# Ver info
make info

# Test endpoints
make test-all

# Ver ayuda
make help
```

---

## 🔗 URLs Importantes

| Servicio | URL |
|----------|-----|
| **API Producción** | https://auth.kaax.ai |
| **API Gateway (directo)** | https://6ve3i0qeme.execute-api.us-east-1.amazonaws.com/ |
| **Health Check** | https://auth.kaax.ai/health |
| **AWS Console Lambda** | https://console.aws.amazon.com/lambda |
| **AWS Console Secrets** | https://console.aws.amazon.com/secretsmanager |
| **Squarespace DNS** | https://account.squarespace.com/domains |

---

## 💡 Tips

1. **Usa `lambda-update` para cambios rápidos** - Es 5x más rápido que CDK deploy completo

2. **Monitorea logs en tiempo real** - Siempre corre `make logs` en una terminal mientras desarrollas

3. **Secrets en AWS, no en código** - Nunca commitees `.env` al repo

4. **Test local primero** - Usa `make dev` antes de deployar

5. **DNS toma tiempo** - Ten paciencia, puede tardar hasta 30 min

6. **Backup de secrets** - Guarda tus secrets en 1Password o similar

7. **Cold starts** - El primer request después de inactividad tarda ~500ms

8. **Costos** - Lambda es gratis hasta 1M requests/mes

---

## 📞 Soporte

- **Logs:** `make logs`
- **Status:** `make info`
- **Test:** `make test-all`
- **Ayuda:** `make help`

Para más ayuda, revisa los logs o el [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/).

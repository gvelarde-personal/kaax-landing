# Kaax Auth Backend - AWS Deployment Makefile
# ========================================

.PHONY: help setup build deploy destroy logs info clean

# Variables
APP_NAME = kaax-auth
REGION = us-east-1
FUNCTION_NAME = KaaxApiStack-KaaxAPI4BF1BC4E-0tpR2w0jVk5D
SECRET_NAME = kaax-auth-secrets
CERT_ARN = arn:aws:acm:us-east-1:301782007691:certificate/636a2174-061a-41cb-962a-2020baf96209
DOMAIN = auth.kaax.ai

# Colors
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

help: ## Mostrar esta ayuda
	@echo "$(GREEN)Kaax Backend - AWS Deployment$(NC)"
	@echo ""
	@echo "$(YELLOW)Comandos disponibles:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# ========================================
# Setup & Build
# ========================================

setup: ## Instalar dependencias
	@echo "$(GREEN)Instalando dependencias...$(NC)"
	yarn install

build: ## Compilar Lambda function
	@echo "$(GREEN)Compilando código Lambda...$(NC)"
	yarn build
	@ls -lh dist/index.mjs

# ========================================
# AWS Secrets Manager
# ========================================

secret-create: ## Crear secret con credenciales
	@echo "$(GREEN)Creando secret en AWS...$(NC)"
	@./create-secret.sh

secret-get: ## Obtener secret actual
	@echo "$(GREEN)Obteniendo secret...$(NC)"
	@aws secretsmanager get-secret-value \
		--secret-id $(SECRET_NAME) \
		--region $(REGION) \
		--query 'SecretString' \
		--output text | jq .

secret-update: ## Actualizar secret
	@echo "$(GREEN)Actualizando secret...$(NC)"
	@./create-secret.sh

secret-delete: ## Eliminar secret (recuperable por 7 días)
	@echo "$(RED)Eliminando secret...$(NC)"
	@aws secretsmanager delete-secret \
		--secret-id $(SECRET_NAME) \
		--region $(REGION) \
		--recovery-window-in-days 7

# ========================================
# AWS Certificate Manager
# ========================================

cert-request: ## Solicitar certificado SSL para dominio
	@echo "$(GREEN)Solicitando certificado SSL...$(NC)"
	@aws acm request-certificate \
		--domain-name $(DOMAIN) \
		--validation-method DNS \
		--region $(REGION)

cert-status: ## Ver estado del certificado
	@echo "$(GREEN)Estado del certificado:$(NC)"
	@aws acm describe-certificate \
		--certificate-arn $(CERT_ARN) \
		--region $(REGION) \
		--query 'Certificate.{Status: Status, Domain: DomainName}' \
		--output table

cert-validation: ## Obtener records DNS para validación
	@echo "$(GREEN)Records DNS para validación:$(NC)"
	@aws acm describe-certificate \
		--certificate-arn $(CERT_ARN) \
		--region $(REGION) \
		--query 'Certificate.DomainValidationOptions[0].ResourceRecord' \
		--output table

cert-list: ## Listar todos los certificados
	@aws acm list-certificates \
		--region $(REGION) \
		--query 'CertificateSummaryList[*].[DomainName,Status,CertificateArn]' \
		--output table

# ========================================
# CDK Deployment
# ========================================

cdk-bootstrap: ## Bootstrap CDK en la cuenta AWS (solo primera vez)
	@echo "$(GREEN)Bootstrapping CDK...$(NC)"
	@export $$(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION)=' .env | xargs) && \
	npx cdk bootstrap aws://301782007691/$(REGION)

cdk-synth: ## Sintetizar CloudFormation template
	@echo "$(GREEN)Sintetizando stack...$(NC)"
	@export $$(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION)=' .env | xargs) && \
	npx cdk synth --app "tsx cdk/app.ts"

cdk-diff: ## Ver cambios pendientes
	@echo "$(GREEN)Diferencias vs stack actual:$(NC)"
	@export $$(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION)=' .env | xargs) && \
	npx cdk diff --app "tsx cdk/app.ts"

cdk-deploy: build ## Deploy completo con CDK
	@echo "$(GREEN)Desplegando stack a AWS...$(NC)"
	@export $$(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION)=' .env | xargs) && \
	npx cdk deploy --app "tsx cdk/app.ts" --require-approval never

cdk-destroy: ## Eliminar todo el stack de AWS
	@echo "$(RED)ADVERTENCIA: Esto eliminará todo el stack$(NC)"
	@read -p "¿Estás seguro? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		export $$(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION)=' .env | xargs) && \
		npx cdk destroy --app "tsx cdk/app.ts" --force; \
	fi

# ========================================
# Lambda Operations
# ========================================

lambda-update: build ## Actualizar solo el código Lambda (rápido)
	@echo "$(GREEN)Actualizando código Lambda...$(NC)"
	@cd dist && zip -r ../dist.zip . && cd ..
	@export $$(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION)=' .env | xargs) && \
	aws lambda update-function-code \
		--function-name $(FUNCTION_NAME) \
		--zip-file fileb://dist.zip \
		--region $(REGION) \
		--query '{Status: LastUpdateStatus, CodeSha: CodeSha256}' \
		--output json

lambda-logs: ## Ver logs del Lambda (últimos 5 min)
	@echo "$(GREEN)Logs del Lambda:$(NC)"
	@export $$(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION)=' .env | xargs) && \
	aws logs tail /aws/lambda/$(FUNCTION_NAME) \
		--since 5m \
		--follow \
		--region $(REGION)

lambda-logs-errors: ## Ver solo errores en logs
	@echo "$(RED)Errores en logs:$(NC)"
	@export $$(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION)=' .env | xargs) && \
	aws logs tail /aws/lambda/$(FUNCTION_NAME) \
		--since 10m \
		--filter-pattern "ERROR" \
		--region $(REGION)

lambda-invoke: ## Invocar Lambda directamente (test)
	@echo "$(GREEN)Invocando Lambda...$(NC)"
	@export $$(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION)=' .env | xargs) && \
	aws lambda invoke \
		--function-name $(FUNCTION_NAME) \
		--region $(REGION) \
		--payload '{"httpMethod":"GET","path":"/health"}' \
		response.json && \
	cat response.json && rm response.json

lambda-info: ## Info del Lambda function
	@export $$(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION)=' .env | xargs) && \
	aws lambda get-function \
		--function-name $(FUNCTION_NAME) \
		--region $(REGION) \
		--query 'Configuration.{Name: FunctionName, Runtime: Runtime, Memory: MemorySize, Timeout: Timeout, LastModified: LastModified}' \
		--output table

# ========================================
# API Gateway
# ========================================

api-info: ## Info del API Gateway
	@echo "$(GREEN)API Gateway Info:$(NC)"
	@export $$(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION)=' .env | xargs) && \
	aws apigatewayv2 get-apis \
		--region $(REGION) \
		--query 'Items[?Name==`KaaxHttpApi`].{Name: Name, ApiEndpoint: ApiEndpoint, ApiId: ApiId}' \
		--output table

api-domain: ## Info del custom domain
	@echo "$(GREEN)Custom Domain Info:$(NC)"
	@export $$(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION)=' .env | xargs) && \
	aws apigatewayv2 get-domain-name \
		--domain-name $(DOMAIN) \
		--region $(REGION) \
		--query '{DomainName: DomainName, Target: DomainNameConfigurations[0].ApiGatewayDomainName, Status: DomainNameConfigurations[0].DomainNameStatus}' \
		--output table

# ========================================
# Testing
# ========================================

test-health: ## Test health endpoint
	@echo "$(GREEN)Testing /health endpoint...$(NC)"
	@curl -s https://$(DOMAIN)/health | jq .

test-health-direct: ## Test health endpoint (URL directa)
	@echo "$(GREEN)Testing direct API URL...$(NC)"
	@curl -s https://6ve3i0qeme.execute-api.us-east-1.amazonaws.com/health | jq .

test-all: ## Test todos los endpoints
	@echo "$(GREEN)Testing all endpoints...$(NC)"
	@echo "$(YELLOW)Health:$(NC)"
	@curl -s https://$(DOMAIN)/health | jq .
	@echo ""
	@echo "$(YELLOW)Leads (GET):$(NC)"
	@curl -s https://$(DOMAIN)/leads | jq .

# ========================================
# DNS & Monitoring
# ========================================

dns-check: ## Verificar resolución DNS
	@echo "$(GREEN)Verificando DNS para $(DOMAIN)...$(NC)"
	@dig +short $(DOMAIN) CNAME || echo "No CNAME encontrado"
	@nslookup $(DOMAIN) | grep -A 2 "Name:"

dns-monitor: ## Monitorear hasta que DNS propague
	@echo "$(GREEN)Monitoreando propagación DNS...$(NC)"
	@for i in $$(seq 1 20); do \
		echo "Intento $$i - $$(date +%H:%M:%S)"; \
		if curl -s -o /dev/null -w "%{http_code}" https://$(DOMAIN)/health 2>&1 | grep -q "200"; then \
			echo "$(GREEN)✅ DNS propagado! $(DOMAIN) está activo$(NC)"; \
			exit 0; \
		fi; \
		sleep 30; \
	done; \
	echo "$(YELLOW)⏳ Aún propagando...$(NC)"

# ========================================
# Utilities
# ========================================

info: ## Mostrar información del stack
	@echo "$(GREEN)=== Kaax Backend Stack Info ===$(NC)"
	@echo ""
	@echo "$(YELLOW)Function Name:$(NC) $(FUNCTION_NAME)"
	@echo "$(YELLOW)Region:$(NC) $(REGION)"
	@echo "$(YELLOW)Custom Domain:$(NC) https://$(DOMAIN)"
	@echo "$(YELLOW)Secret Name:$(NC) $(SECRET_NAME)"
	@echo ""
	@echo "$(YELLOW)Endpoints:$(NC)"
	@echo "  - https://$(DOMAIN)/health"
	@echo "  - https://$(DOMAIN)/leads"
	@echo "  - https://$(DOMAIN)/stripe/webhook"

clean: ## Limpiar archivos temporales
	@echo "$(GREEN)Limpiando archivos temporales...$(NC)"
	@rm -f dist.zip
	@rm -f response.json
	@rm -rf cdk.out

deploy: cdk-deploy ## Alias para deploy completo

# Shortcuts
logs: lambda-logs ## Alias para ver logs
status: info ## Alias para ver info

#!/bin/bash

# Load env vars
export $(grep -E '^(AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|AWS_REGION|DATABASE_URL|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|STRIPE_PRICE_ID)=' .env | xargs)

# Create secret JSON
SECRET_VALUE=$(cat <<EOF
{
  "DATABASE_URL": "${DATABASE_URL}",
  "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}",
  "STRIPE_WEBHOOK_SECRET": "${STRIPE_WEBHOOK_SECRET}",
  "STRIPE_PRICE_ID": "${STRIPE_PRICE_ID}",
  "NODE_ENV": "production"
}
EOF
)

# Create or update secret
aws secretsmanager create-secret \
  --name kaax-auth-secrets \
  --description "Kaax Auth API credentials" \
  --secret-string "$SECRET_VALUE" \
  --region ${AWS_REGION:-us-east-1} 2>/dev/null

# If secret exists, update it
if [ $? -ne 0 ]; then
  echo "Secret already exists, updating..."
  aws secretsmanager update-secret \
    --secret-id kaax-auth-secrets \
    --secret-string "$SECRET_VALUE" \
    --region ${AWS_REGION:-us-east-1}
fi

echo "✅ Secret created/updated: kaax-auth-secrets"

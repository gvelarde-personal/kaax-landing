import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

let cachedSecrets: Record<string, string> | null = null;

export async function loadSecrets() {
  if (cachedSecrets) {
    return cachedSecrets;
  }

  const secretArn = process.env.SECRET_ARN;

  // In development, use env vars directly
  if (!secretArn || process.env.NODE_ENV === "development") {
    cachedSecrets = {
      DATABASE_URL: process.env.DATABASE_URL || "",
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
      STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID || "",
      NODE_ENV: process.env.NODE_ENV || "production",
    };
    return cachedSecrets;
  }

  try {
    const client = new SecretsManagerClient({ region: "us-east-1" });
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretArn,
      })
    );

    if (response.SecretString) {
      cachedSecrets = JSON.parse(response.SecretString);

      // Merge secrets into process.env for existing code
      Object.assign(process.env, cachedSecrets);

      return cachedSecrets;
    }
  } catch (error) {
    console.error("Failed to load secrets:", error);
    throw error;
  }

  throw new Error("Secret not found");
}

import { handle } from "hono/aws-lambda";
import app from "./index";
import { loadSecrets } from "./lib/secrets";

let isInitialized = false;

// Lambda handler with secrets loading
export const handler = async (event: any, context: any) => {
  // Load secrets on cold start
  if (!isInitialized) {
    try {
      await loadSecrets();
      isInitialized = true;
      console.log("✅ Secrets loaded successfully");
    } catch (error) {
      console.error("❌ Failed to load secrets:", error);
      throw error;
    }
  }

  // Handle the request
  return handle(app)(event, context);
};

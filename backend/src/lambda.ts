import { handle } from "hono/aws-lambda";
import app from "./index";

// Lambda handler
export const handler = handle(app);

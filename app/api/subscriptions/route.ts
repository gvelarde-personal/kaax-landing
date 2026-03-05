import { NextResponse } from "next/server";
import { storage } from "@/../../lib/storage";
import { requireAdmin } from "@/../../lib/auth";

// GET /api/subscriptions - List all subscriptions
export async function GET() {
  try {
    if (process.env.NODE_ENV !== "development") {
      await requireAdmin();
    }

    const subscriptions = await storage.getSubscriptions();
    return NextResponse.json(subscriptions);
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

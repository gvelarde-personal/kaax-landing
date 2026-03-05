import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/../../lib/storage";
import { requireAdmin } from "@/../../lib/auth";
import { z } from "zod";
import { insertLeadSchema } from "@shared/schema";

// GET /api/leads - List all leads
export async function GET() {
  try {
    // In development, bypass auth for easier testing
    if (process.env.NODE_ENV !== "development") {
      await requireAdmin();
    }

    const leads = await storage.getLeads();
    return NextResponse.json(leads);
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = insertLeadSchema.parse(body);

    const lead = await storage.createLead(input);
    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.errors[0].message,
          field: error.errors[0].path.join("."),
        },
        { status: 400 }
      );
    }
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

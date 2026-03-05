import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/../../lib/storage";
import { requireAdmin } from "@/../../lib/auth";
import { z } from "zod";
import { insertLeadSchema } from "@shared/schema";

type Params = {
  params: Promise<{ id: string }>;
};

// GET /api/leads/:id
export async function GET(request: NextRequest, { params }: Params) {
  try {
    if (process.env.NODE_ENV !== "development") {
      await requireAdmin();
    }

    const { id } = await params;
    const leadId = parseInt(id);

    if (isNaN(leadId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const lead = await storage.getLead(leadId);

    if (!lead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    console.error("Error fetching lead:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/leads/:id
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    if (process.env.NODE_ENV !== "development") {
      await requireAdmin();
    }

    const { id } = await params;
    const leadId = parseInt(id);

    if (isNaN(leadId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const input = insertLeadSchema.partial().parse(body);

    const existingLead = await storage.getLead(leadId);
    if (!existingLead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    const updatedLead = await storage.updateLead(leadId, input);
    return NextResponse.json(updatedLead);
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.errors[0].message,
          field: error.errors[0].path.join("."),
        },
        { status: 400 }
      );
    }
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/:id
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    if (process.env.NODE_ENV !== "development") {
      await requireAdmin();
    }

    const { id } = await params;
    const leadId = parseInt(id);

    if (isNaN(leadId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const existingLead = await storage.getLead(leadId);
    if (!existingLead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    await storage.deleteLead(leadId);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message === "Forbidden") {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

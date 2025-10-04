import { NextResponse } from "next/server";
import { listMotions } from "@/lib/higgsfield";

export async function GET() {
  try {
    const motions = await listMotions();
    return NextResponse.json(motions);
  } catch (error: unknown) {
    console.error("Error fetching motions:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to fetch motions", details: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

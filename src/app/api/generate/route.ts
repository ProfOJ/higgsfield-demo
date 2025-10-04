import { NextRequest, NextResponse } from "next/server";
import { generateVideoFromImage } from "@/lib/higgsfield";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MIME_TO_EXT,
  DEFAULT_PROMPT,
} from "@/types/common";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const motionId = formData.get("motionId") as string | null;
    const strengthStr = formData.get("strength") as string | null;
    const customPrompt = formData.get("prompt") as string | null;

    // Validate image presence
    if (!imageFile) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    // Validate file size
    if (imageFile.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB limit` },
        { status: 413 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type",
          details: `Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
        },
        { status: 415 }
      );
    }

    const imageFormat = MIME_TO_EXT[imageFile.type] as "jpeg" | "png" | "webp";
    const strength = strengthStr ? parseFloat(strengthStr) : 0.8;

    // Convert File to Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Use custom prompt or default Jurassic Park prompt
    const prompt = customPrompt || DEFAULT_PROMPT;

    // Generate video
    const result = await generateVideoFromImage({
      imageBuffer,
      imageFormat,
      motionId: motionId || undefined,
      strength,
      prompt,
    });

    return NextResponse.json({
      success: true,
      videoUrl: result.videoUrl,
      previewUrl: result.previewUrl,
      jobSetId: result.jobSetId,
    });
  } catch (error: unknown) {
    console.error("Error generating video:", error);
    const err = error as Error;

    // Handle specific error types
    if (err.message?.includes("credits")) {
      return NextResponse.json(
        { error: "Insufficient credits", details: err.message },
        { status: 402 }
      );
    }

    if (err.message?.includes("authentication") || err.message?.includes("credentials")) {
      return NextResponse.json(
        { error: "Authentication failed", details: err.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate video", details: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

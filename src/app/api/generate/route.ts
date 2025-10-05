import { NextRequest, NextResponse } from "next/server";
import { submitVideoGeneration } from "@/lib/higgsfield";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MIME_TO_EXT,
  DEFAULT_PROMPT,
} from "@/types/common";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const requestTimer = logger.startTimer("api/generate:total");
  const requestId = Math.random().toString(36).substring(7);

  logger.info("[/api/generate] Request started", {
    requestId,
    userAgent: request.headers.get("user-agent") || "unknown",
    ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
  });

  try {
    const parseTimer = logger.startTimer("form-parse");
    const formData = await request.formData();
    parseTimer.end();
    const imageFile = formData.get("image") as File | null;
    const motionId = formData.get("motionId") as string | null;
    const strengthStr = formData.get("strength") as string | null;
    const customPrompt = formData.get("prompt") as string | null;
    const model = (formData.get("model") as string | null) || "turbo";

    logger.debug("Request parameters", {
      requestId,
      hasImage: !!imageFile,
      imageSize: imageFile?.size,
      imageMime: imageFile?.type,
      model,
      motionId: motionId || "none",
      strength: strengthStr || "default",
      customPrompt: customPrompt || "(using default)",
      promptLength: customPrompt?.length || 0,
    });

    // Validate image presence
    if (!imageFile) {
      logger.warn("Validation failed: No image", { requestId });
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    // Validate file size
    if (imageFile.size > MAX_FILE_SIZE_BYTES) {
      logger.warn("Validation failed: File too large", {
        requestId,
        size: imageFile.size,
        limit: MAX_FILE_SIZE_BYTES,
      });
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB limit` },
        { status: 413 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(imageFile.type)) {
      logger.warn("Validation failed: Invalid MIME type", {
        requestId,
        mime: imageFile.type,
        allowed: ALLOWED_MIME_TYPES,
      });
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
    const conversionTimer = logger.startTimer("buffer-conversion");
    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    conversionTimer.end();

    // Use custom prompt or default Jurassic Park prompt
    const prompt = customPrompt || DEFAULT_PROMPT;

    // Validate model
    if (model !== "lite" && model !== "standard" && model !== "turbo") {
      logger.warn("Validation failed: Invalid model", { requestId, model });
      return NextResponse.json(
        { error: "Invalid model", details: "Model must be lite, standard, or turbo" },
        { status: 400 }
      );
    }

    logger.info("Starting video generation (async)", {
      requestId,
      imageSize: imageBuffer.length,
      format: imageFormat,
      model,
    });

    // Submit video generation job (returns immediately with job ID)
    const generationTimer = logger.startTimer("submit-generation");
    const jobSetId = await submitVideoGeneration({
      imageBuffer,
      imageFormat,
      motionId: motionId || undefined,
      strength,
      prompt,
      model,
    });
    generationTimer.end();

    const totalMs = requestTimer.end();
    logger.info("Video generation job submitted", {
      requestId,
      jobSetId,
      totalMs,
    });

    // Return job ID immediately - client will poll for status
    return NextResponse.json({
      success: true,
      jobSetId,
      status: "processing",
      message: "Video generation started. Check status with jobSetId.",
    });
  } catch (error: unknown) {
    const err = error as Error;
    logger.error("Video generation failed", {
      requestId,
      errorName: err.name,
      errorMessage: err.message,
      errorConstructor: err.constructor.name,
      stack: err.stack,
    });

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

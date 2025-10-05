import "server-only";
import { HiggsfieldClient, InputImage, inputMotion } from "@higgsfield/client";
import { env } from "./env";
import { logger } from "./logger";
import type { Motion } from "@/types/common";

let clientInstance: HiggsfieldClient | null = null;

export function getClient(): HiggsfieldClient {
  if (!clientInstance) {
    logger.debug("Initializing Higgsfield client");
    clientInstance = new HiggsfieldClient({
      apiKey: env.HF_API_KEY,
      apiSecret: env.HF_SECRET,
    });
    logger.info("Higgsfield client initialized");
  }
  return clientInstance;
}

export async function listMotions(): Promise<Motion[]> {
  const timer = logger.startTimer("listMotions");
  try {
    const client = getClient();
    logger.debug("Fetching motions from Higgsfield API");
    const motions = await client.getMotions();
    timer.end();
    logger.info("Motions fetched successfully", { count: motions.length });

    return motions.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      preview_url: m.preview_url,
    }));
  } catch (error) {
    timer.end();
    logger.error("Failed to fetch motions", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

interface GenerateVideoParams {
  imageBuffer: Buffer;
  imageFormat: "jpeg" | "png" | "webp";
  motionId?: string;
  strength?: number;
  prompt?: string;
  model?: "lite" | "standard" | "turbo";
}

export async function generateVideoFromImage({
  imageBuffer,
  imageFormat,
  motionId,
  strength = 0.8,
  prompt,
  model = "turbo",
}: GenerateVideoParams): Promise<{
  videoUrl: string;
  previewUrl: string;
  jobSetId: string;
}> {
  const totalTimer = logger.startTimer("generateVideoFromImage:total");

  logger.info("Starting video generation", {
    imageSize: imageBuffer.length,
    imageFormat,
    model,
    hasMotion: !!motionId,
    promptLength: prompt?.length || 0,
  });

  try {
    const client = getClient();

    // Upload image to Higgsfield CDN
    const uploadTimer = logger.startTimer("uploadImage");
    logger.debug("Uploading image to Higgsfield CDN");
    const imageUrl = await client.uploadImage(imageBuffer, imageFormat);
    uploadTimer.end();
    logger.info("Image uploaded", { imageUrl: imageUrl.substring(0, 50) + "..." });

    // Map model string to API model string
    // Note: The API expects 'dop-lite', 'dop-preview', or 'dop-turbo'
    const modelString =
      model === "lite" ? "dop-lite" : model === "standard" ? "dop-preview" : "dop-turbo";

    // Build params
    const params: Record<string, unknown> = {
      model: modelString,
      prompt: prompt || undefined,
      input_images: [InputImage.fromUrl(imageUrl)],
      enhance_prompt: true,
    };

    // Add motion if specified
    if (motionId) {
      params.motions = [inputMotion(motionId, strength)];
      logger.debug("Added motion", { motionId, strength });
    }

    // Generate video
    logger.info("Submitting generation job", { model: modelString });
    const generateTimer = logger.startTimer("generateJob");
    const jobSet = await client.generate("/v1/image2video/dop", params);
    generateTimer.end();

    logger.info("Job submitted", { jobSetId: jobSet.id });

    if (!jobSet.isCompleted) {
      logger.error("Job did not complete", {
        jobSetId: jobSet.id,
        isCompleted: jobSet.isCompleted,
        isFailed: jobSet.isFailed,
      });
      throw new Error("Job set did not complete in time");
    }

    if (jobSet.isFailed) {
      logger.error("Job failed", {
        jobSetId: jobSet.id,
        isCompleted: jobSet.isCompleted,
        isFailed: jobSet.isFailed,
      });
      throw new Error("Video generation failed");
    }

    const job = jobSet.jobs[0];
    if (!job || !job.results) {
      logger.error("No results available", { jobSetId: jobSet.id });
      throw new Error("No results available");
    }

    const totalMs = totalTimer.end();
    logger.info("Video generation completed successfully", {
      jobSetId: jobSet.id,
      totalMs,
      hasRaw: !!job.results.raw,
      hasMin: !!job.results.min,
    });

    return {
      videoUrl: job.results.raw.url,
      previewUrl: job.results.min.url,
      jobSetId: jobSet.id,
    };
  } catch (error) {
    totalTimer.end();
    logger.error("Video generation failed", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

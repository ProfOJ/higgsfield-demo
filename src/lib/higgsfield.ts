import "server-only";
import { HiggsfieldClient, InputImage, inputMotion, DoPModel } from "@higgsfield/client";
import { env } from "./env";
import type { Motion } from "@/types/common";

let clientInstance: HiggsfieldClient | null = null;

export function getClient(): HiggsfieldClient {
  if (!clientInstance) {
    clientInstance = new HiggsfieldClient({
      apiKey: env.HF_API_KEY,
      apiSecret: env.HF_SECRET,
    });
  }
  return clientInstance;
}

export async function listMotions(): Promise<Motion[]> {
  const client = getClient();
  const motions = await client.getMotions();

  return motions.map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description,
    preview_url: m.preview_url,
  }));
}

interface GenerateVideoParams {
  imageBuffer: Buffer;
  imageFormat: "jpeg" | "png" | "webp";
  motionId?: string;
  strength?: number;
  prompt?: string;
}

export async function generateVideoFromImage({
  imageBuffer,
  imageFormat,
  motionId,
  strength = 0.8,
  prompt,
}: GenerateVideoParams): Promise<{
  videoUrl: string;
  previewUrl: string;
  jobSetId: string;
}> {
  const client = getClient();

  // Upload image to Higgsfield CDN
  const imageUrl = await client.uploadImage(imageBuffer, imageFormat);

  // Build params
  const params: Record<string, unknown> = {
    model: DoPModel.TURBO,
    prompt: prompt || undefined,
    input_images: [InputImage.fromUrl(imageUrl)],
    enhance_prompt: true,
  };

  // Add motion if specified
  if (motionId) {
    params.motions = [inputMotion(motionId, strength)];
  }

  // Generate video
  const jobSet = await client.generate("/v1/image2video/dop", params);

  if (!jobSet.isCompleted) {
    throw new Error("Job set did not complete in time");
  }

  if (jobSet.isFailed) {
    throw new Error("Video generation failed");
  }

  const job = jobSet.jobs[0];
  if (!job || !job.results) {
    throw new Error("No results available");
  }

  return {
    videoUrl: job.results.raw.url,
    previewUrl: job.results.min.url,
    jobSetId: jobSet.id,
  };
}

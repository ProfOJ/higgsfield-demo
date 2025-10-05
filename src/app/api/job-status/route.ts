import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/higgsfield";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const maxDuration = 10; // Quick status check

interface Job {
  status: string;
  error?: string;
  results?: {
    raw?: { url?: string };
    min?: { url?: string };
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const jobSetId = searchParams.get("id");

  if (!jobSetId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  logger.info("Checking job status", { jobSetId });

  try {
    const client = getClient();

    // Fetch job status without polling (withPolling: false would be ideal, but we'll use the axios client)
    // @ts-expect-error - accessing internal axios client
    const response = await client.client.get(`/v1/job-sets/${jobSetId}`);
    const jobSetData = response.data;

    logger.debug("Job status fetched", {
      jobSetId,
      status: jobSetData.status,
      isCompleted: jobSetData.jobs?.every((j: Job) => j.status === "completed"),
    });

    // Check if all jobs are completed
    const allCompleted = jobSetData.jobs?.every((j: Job) => j.status === "completed");
    const anyFailed = jobSetData.jobs?.some((j: Job) => j.status === "failed");

    if (allCompleted) {
      const job = jobSetData.jobs[0];
      return NextResponse.json({
        status: "completed",
        videoUrl: job.results?.raw?.url,
        previewUrl: job.results?.min?.url,
        jobSetId,
      });
    }

    if (anyFailed) {
      const failedJob = jobSetData.jobs.find((j: Job) => j.status === "failed");
      return NextResponse.json({
        status: "failed",
        error: failedJob.error || "Video generation failed",
        jobSetId,
      });
    }

    // Still processing
    return NextResponse.json({
      status: "processing",
      jobSetId,
    });
  } catch (error: unknown) {
    const err = error as Error;
    logger.error("Failed to check job status", {
      jobSetId,
      error: err.message,
    });

    return NextResponse.json(
      { error: "Failed to check job status", details: err.message },
      { status: 500 }
    );
  }
}

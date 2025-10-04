export interface Motion {
  id: string;
  name: string;
  description?: string;
  preview_url?: string;
}

export interface GenerateVideoRequest {
  imageFile: File;
  motionId?: string;
  strength?: number;
}

export interface GenerateVideoResponse {
  success: boolean;
  videoUrl?: string;
  previewUrl?: string;
  jobSetId?: string;
  error?: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
}

export const DEFAULT_PROMPT =
  "Cinematic shot where a group of realistic dinosaurs enter the room toward the camera, Jurassic Park style, dramatic lighting, epic atmosphere";

export const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
};

export const ALLOWED_MIME_TYPES = Object.keys(MIME_TO_EXT);
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

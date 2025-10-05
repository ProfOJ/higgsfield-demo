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
  model?: "lite" | "standard" | "turbo";
}

export interface DoPModelInfo {
  id: "lite" | "standard" | "turbo";
  name: string;
  description: string;
  cost: string;
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
// Vercel has 4.5MB body limit for serverless functions, set to 4MB to be safe
export const MAX_FILE_SIZE_MB = 4;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const DOP_MODELS: DoPModelInfo[] = [
  {
    id: "lite",
    name: "Lite",
    description: "Fastest & most affordable (~2 credits)",
    cost: "~$0.125",
  },
  {
    id: "turbo",
    name: "Turbo",
    description: "Balanced speed & quality (~6.5 credits)",
    cost: "~$0.41",
  },
  {
    id: "standard",
    name: "Preview",
    description: "Higher quality preview (~9 credits)",
    cost: "~$0.56",
  },
];

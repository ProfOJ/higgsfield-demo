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
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const DOP_MODELS: DoPModelInfo[] = [
  {
    id: "lite",
    name: "Lite",
    description: "Fast & affordable (~2 credits)",
    cost: "~$0.125",
  },
  {
    id: "standard",
    name: "Standard",
    description: "Highest quality (~9 credits)",
    cost: "~$0.56",
  },
  {
    id: "turbo",
    name: "Turbo",
    description: "Fast with priority (~6.5 credits)",
    cost: "~$0.41",
  },
];

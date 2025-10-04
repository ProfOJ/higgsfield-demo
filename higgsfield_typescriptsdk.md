# Higgsfield SDK for Node.js and TypeScript

Higgsfield AI provides a TypeScript software development kit (SDK) that wraps the REST API and streamlines video and image generation tasks. The SDK exposes a unified `generate` method to call different endpoints, automatically polls job sets until completion, includes helper functions for specifying inputs, and provides typed definitions and error classes:contentReference[oaicite:0]{index=0}. This guide summarises installation, authentication, main use‑cases and API methods, along with best practices and configuration options for use in large language model coding tools.

## Installation

Install the client from npm:

```bash
npm install @higgsfield/client
```

## Quick start

Import the client and helper types, then initialize it with your credentials. If you do not provide credentials explicitly, the client retrieves them from the `HF_API_KEY` and `HF_SECRET` environment variables:contentReference[oaicite:1]{index=1}.

```typescript
import { HiggsfieldClient } from "@higgsfield/client";
import {
  InputImage,
  InputAudio,
  inputMotion,
  SoulQuality,
  SoulSize,
  BatchSize,
  DoPModel,
  SpeakVideoQuality,
  SpeakDuration,
  webhook,
  strength,
  seed,
} from "@higgsfield/client/helpers";

// Initialize the client
const client = new HiggsfieldClient({
  apiKey: "YOUR_API_KEY",
  apiSecret: "YOUR_API_SECRET",
});
```

## Authentication

The SDK supports two ways to authenticate. You can pass your API key and secret when creating the client:

```typescript
const client = new HiggsfieldClient({
  apiKey: "YOUR_API_KEY",
  apiSecret: "YOUR_API_SECRET",
});
```

Alternatively, set the environment variables `HF_API_KEY` and `HF_SECRET` and initialize the client without arguments:contentReference[oaicite:2]{index=2}:

```bash
export HF_API_KEY="YOUR_API_KEY"
export HF_SECRET="YOUR_API_SECRET"
```

```typescript
const client = new HiggsfieldClient();
```

## Image‑to‑Video generation (DoP model)

You can convert static images into five‑second videos using the Director of Photography (DoP) model. The `generate` method accepts the API endpoint string, a parameter object, and optional options such as a webhook. The SDK automatically polls the job set until completion and returns a `JobSet` object with results:contentReference[oaicite:3]{index=3}.

### Basic usage without motion

```typescript
// Generate video from image (no motion applied)
const jobSet = await client.generate("/v1/image2video/dop", {
  model: DoPModel.TURBO, // Options: DoPModel.LITE, DoPModel.STANDARD, DoPModel.TURBO
  prompt: "Cinematic camera movement around the subject",
  input_images: [InputImage.fromUrl("https://example.com/image.jpg")],
});

// Polling is automatic; check if completed
if (jobSet.isCompleted) {
  console.log("Video URL:", jobSet.jobs[0].results?.raw.url);
}
```

### Using predefined motions

You can fetch available motion templates with `getMotions()`, choose one by name and pass it as a motion input:

```typescript
// Fetch available motions
const motions = await client.getMotions();

// Each motion has id, name, description, preview_url and start_end_frame:contentReference[oaicite:4]{index=4}
const zoomMotion = motions.find((m) => m.name === "Zoom In");

// Use the motion when generating the video
const jobSet = await client.generate("/v1/image2video/dop", {
  model: DoPModel.TURBO,
  prompt: "Apply zoom motion to the subject",
  input_images: [InputImage.fromUrl("https://example.com/image.jpg")],
  motions: [inputMotion(zoomMotion.id, 0.8)],
});

if (jobSet.isCompleted) {
  console.log("Video generated successfully");
  console.log("Video URL:", jobSet.jobs[0].results?.raw.url);
}
```

### Advanced example with uploading a local image

```typescript
import fs from "fs";

// Read a local image buffer
const imageBuffer = fs.readFileSync("path/to/your/image.jpg");

// Upload the image to the Higgsfield CDN
const imageUrl = await client.uploadImage(imageBuffer, "jpeg");

// Generate a video with multiple motions and a webhook
const jobSet = await client.generate(
  "/v1/image2video/dop",
  {
    model: DoPModel.STANDARD,
    prompt: "Cinematic dolly zoom with dramatic lighting",
    input_images: [InputImage.fromUrl(imageUrl)],
    motions: [inputMotion("motion-uuid-1", 0.7), inputMotion("motion-uuid-2", 0.5)],
    seed: seed(42),
    enhance_prompt: true,
  },
  {
    webhook: webhook("https://your-webhook-url.com/callback", "your-webhook-secret"),
  }
);

// Handle results
for (const job of jobSet.jobs) {
  if (job.status === "completed") {
    console.log("Video URL:", job.results?.raw.url);
    console.log("Preview URL:", job.results?.min.url);
  } else if (job.status === "failed") {
    console.error("Job failed");
  }
}
```

## Speech‑to‑Video generation (Speak v2)

The SDK can generate a short talking‑head video by synchronising an image with a WAV audio clip. You supply the endpoint `/v1/speak/higgsfield` and parameters such as `input_image`, `input_audio`, `prompt`, `quality` and `duration`:contentReference[oaicite:5]{index=5}.

### Basic usage

```typescript
// Generate a talking avatar video
const jobSet = await client.generate("/v1/speak/higgsfield", {
  input_image: InputImage.fromUrl("https://example.com/avatar.jpg"),
  input_audio: InputAudio.fromUrl("https://example.com/speech.wav"), // Only WAV files supported:contentReference[oaicite:6]{index=6}
  prompt: "Professional presentation style",
  quality: SpeakVideoQuality.MID, // Use SpeakVideoQuality.HIGH for better quality
  duration: SpeakDuration.SHORT, // Options: SHORT (5s), MEDIUM (10s), LONG (15s)
  seed: seed(), // Random seed
});

if (jobSet.isCompleted) {
  console.log("Video URL:", jobSet.jobs[0].results?.raw.url);
}
```

## Text‑to‑Image generation (Soul)

The Soul model creates artistic images from textual descriptions. You can specify the resolution via `SoulSize`, quality via `SoulQuality`, and batch size. The SDK also supports style presets and advanced parameters for character consistency.

### Basic usage

```typescript
// Generate image from text
const jobSet = await client.generate("/v1/text2image/soul", {
  prompt: "A majestic mountain landscape at sunset, oil painting style",
  width_and_height: SoulSize.SQUARE_1536x1536, // 13 available sizes:contentReference[oaicite:7]{index=7}
  quality: SoulQuality.SD, // SoulQuality.HD for 1080p
  batch_size: BatchSize.SINGLE, // BatchSize.QUAD for four images
  enhance_prompt: true,
});

if (jobSet.isCompleted) {
  console.log("Image URL:", jobSet.jobs[0].results?.raw.url);
}
```

### Using style presets

First, fetch available Soul styles and select one by name. Each style object has `id`, `name`, `description` and `preview_url`:contentReference[oaicite:8]{index=8}. Then provide the `style_id` and `style_strength` when generating.

```typescript
// Get available styles
const styles = await client.getSoulStyles();
const oilPaintingStyle = styles.find((s) => s.name === "Oil Painting");

// Generate image with a specific style
const jobSet = await client.generate("/v1/text2image/soul", {
  prompt: "Portrait of a wise elderly person",
  style_id: oilPaintingStyle.id,
  style_strength: strength(0.8),
  width_and_height: SoulSize.PORTRAIT_1536x2048,
  quality: SoulQuality.HD,
  batch_size: BatchSize.QUAD,
  enhance_prompt: false,
  seed: seed(12345),
});

jobSet.jobs.forEach((job, index) => {
  if (job.status === "completed") {
    console.log(`Image ${index + 1}:`, job.results?.raw.url);
  }
});
```

### Advanced example with parameters

This example demonstrates controlling style, character references, and using an image reference. You can also attach a webhook for asynchronous notification:contentReference[oaicite:9]{index=9}.

```typescript
// Generate with advanced parameters and character consistency
const jobSet = await client.generate(
  "/v1/text2image/soul",
  {
    prompt: "Futuristic city with flying cars, cyberpunk aesthetic",
    width_and_height: SoulSize.LANDSCAPE_2048x1152,
    quality: SoulQuality.HD,
    batch_size: BatchSize.QUAD,
    style_id: "cyberpunk-style-uuid",
    style_strength: strength(0.9),
    custom_reference_id: "character-uuid",
    custom_reference_strength: strength(0.7),
    image_reference: InputImage.fromUrl("https://example.com/reference.jpg"),
    enhance_prompt: true,
    seed: seed(999),
  },
  {
    webhook: webhook("https://your-webhook-url.com/callback", "your-webhook-secret"),
  }
);

// Download results
for (const job of jobSet.jobs) {
  if (job.status === "completed" && job.results) {
    console.log("Full resolution:", job.results.raw.url);
    console.log("Thumbnail:", job.results.min.url);
  }
}
```

## Custom character references (SoulIds)

A SoulId is a custom character that ensures consistent faces across different generations. You can list existing SoulIds, create new ones from reference images, and use them in generation.

### Listing SoulIds

```typescript
// List existing SoulIds (page 1, 10 items per page)
const soulIdList = await client.listSoulIds(1, 10);
console.log(`Total SoulIds: ${soulIdList.total}`);
soulIdList.items.forEach((soul) => {
  console.log(`${soul.name} (${soul.id}): ${soul.status}`);
});
```

### Creating a new SoulId

```typescript
// Create a character from reference images
const newSoulId = await client.createSoulId(
  {
    name: "My Character",
    input_images: [
      { type: "image_url", image_url: "https://example.com/ref1.jpg" },
      { type: "image_url", image_url: "https://example.com/ref2.jpg" },
      { type: "image_url", image_url: "https://example.com/ref3.jpg" },
    ],
  },
  true
); // Poll until ready

console.log("Created SoulId:", newSoulId.id);

// Use the SoulId in a Soul generation
if (newSoulId.isCompleted) {
  const jobSet = await client.generate("/v1/text2image/soul", {
    prompt: "Portrait in professional attire",
    custom_reference_id: newSoulId.id,
    custom_reference_strength: strength(1),
    width_and_height: SoulSize.PORTRAIT_1536x2048,
    quality: SoulQuality.HD,
  });
}
```

## Core API methods

The SDK exposes several functions beyond the unified `generate` method:

### Generating content

`generate(endpoint, params, options)` sends a request to any Higgsfield endpoint, returns a `JobSet`, and optionally accepts a webhook and polling flag:contentReference[oaicite:10]{index=10}. Use it for all generation tasks by passing the corresponding endpoint string and parameters.

### Retrieving motions and styles

`getMotions()` fetches the list of motion presets for image‑to‑video generation:contentReference[oaicite:11]{index=11}. `getSoulStyles()` retrieves available styles for text‑to‑image generation:contentReference[oaicite:12]{index=12}. Both return arrays of objects with ids and descriptive fields.

### Uploading data

`upload(data, contentType)` obtains an upload link from the API and transfers raw data to the Higgsfield CDN, returning a public URL:contentReference[oaicite:13]{index=13}. `uploadImage(buffer, format)` is a convenience wrapper that uploads an image buffer and returns its URL:contentReference[oaicite:14]{index=14}.

### Managing SoulIds

`createSoulId(data, withPolling)` creates a new character reference and returns a `SoulId` object, optionally polling until it completes:contentReference[oaicite:15]{index=15}. `listSoulIds(page, pageSize)` lists existing SoulIds with pagination:contentReference[oaicite:16]{index=16}.

## Working with jobs

When `generate` returns, you get a `JobSet` containing job statuses and result URLs. The `JobSet` exposes flags such as `isCompleted`, `isInProgress`, `isNsfw`, `isFailed` and `isCanceled`:contentReference[oaicite:17]{index=17}. It also implements a `poll` method that polls the `/v1/job-sets/{id}` endpoint until completion or timeout based on the client configuration:contentReference[oaicite:18]{index=18}.

You can disable automatic polling by setting `withPolling: false` and manually poll using the internal Axios client. An example from the README demonstrates checking job status and results in a loop:contentReference[oaicite:19]{index=19}.

## Error handling

The SDK defines specific error classes to handle different scenarios. `AuthenticationError` indicates invalid credentials. `NotEnoughCreditsError` signals insufficient credits. `ValidationError` and `BadInputError` arise when the API returns a `422` or `400` status:contentReference[oaicite:20]{index=20}. `APIError` wraps other HTTP errors with status and response data:contentReference[oaicite:21]{index=21}. Catch these errors in a `try`/`catch` block to provide informative feedback to users:contentReference[oaicite:22]{index=22}.

Helper functions enforce input validation. For example, `strength(value)` throws a `BadInputError` if the value is not between 0 and 1:contentReference[oaicite:23]{index=23}. `seed(value)` ensures seeds are integers between 0 and 1 000 000 or generates a random seed if null:contentReference[oaicite:24]{index=24}. `InputImage.fromUrl(url)` and `inputMotion(motionId, strength)` throw errors for empty strings:contentReference[oaicite:25]{index=25}:contentReference[oaicite:26]{index=26}.

## Configuration options

When instantiating the client, you can adjust default settings. The `ClientConfig` interface includes `timeout`, `maxRetries`, `retryBackoff`, `retryMaxBackoff`, `pollInterval`, `maxPollTime`, `headers` and `baseURL`:contentReference[oaicite:27]{index=27}. The default timeout is 120 seconds, polling interval 2 seconds, maximum poll time 5 minutes, and up to three retries with exponential backoff:contentReference[oaicite:28]{index=28}. Max retries cannot exceed five:contentReference[oaicite:29]{index=29}. You may also add custom HTTP headers.

### Example configuration

```typescript
const client = new HiggsfieldClient({
  apiKey: "YOUR_API_KEY",
  apiSecret: "YOUR_API_SECRET",
  baseURL: "https://platform.higgsfield.ai",
  timeout: 120000, // 2 minutes
  maxRetries: 3,
  retryBackoff: 1000, // start with 1 second
  retryMaxBackoff: 60000, // maximum 60 seconds
  pollInterval: 2000, // check every 2 seconds
  maxPollTime: 300000, // timeout after 5 minutes
  headers: {
    "X-Custom-Header": "value",
  },
});
```

## TypeScript support

The SDK is written in TypeScript and provides full type definitions. You can import types such as `JobStatus`, `JobSet`, `Job`, `GenerateParams`, `SoulStyle` and `Motion` for type‑safe programming:contentReference[oaicite:30]{index=30}. The helpers define enums for DoP models, Soul quality, sizes, batch sizes, Speak quality and durations:contentReference[oaicite:31]{index=31}.

## Best practices

Upload large image or audio files to the Higgsfield CDN using `uploadImage()` or `upload()` before generating. Implement exponential backoff when handling rate limits by adjusting `maxRetries` and backoff values:contentReference[oaicite:32]{index=32}. Use webhooks for long‑running operations instead of polling:contentReference[oaicite:33]{index=33}. Fetch and cache motions and styles at application startup to avoid repeated requests:contentReference[oaicite:34]{index=34}. Close the client when you are finished:contentReference[oaicite:35]{index=35}.

## Support and licensing

For further documentation, visit the Higgsfield documentation site: https://docs.higgsfield.ai. You can check API status at https://status.higgsfield.ai :contentReference[oaicite:36]{index=36}. The SDK is released under the MIT license:contentReference[oaicite:37]{index=37}.

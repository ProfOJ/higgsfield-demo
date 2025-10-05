# Logging & Debugging Guide

This document explains the comprehensive logging system added to help diagnose issues in the Higgsfield Dino Generator application.

## Overview

The application now has detailed logging at every layer:

- **Server-side**: API routes and Higgsfield client library
- **Client-side**: Browser console logging for all requests
- **Environment**: Automatic validation and logging of required environment variables

## Server-Side Logging

### Logger Utility (`src/lib/logger.ts`)

A centralized logger with:

- Log levels: `debug`, `info`, `warn`, `error`
- Automatic timestamps (ISO format)
- Environment detection (`dev` / `prod`)
- Performance timers

#### Usage Example

```typescript
import { logger } from "@/lib/logger";

// Simple logging
logger.info("Operation started", { userId: 123 });
logger.error("Operation failed", { error: "timeout" });

// Performance timing
const timer = logger.startTimer("database-query");
// ... do work ...
const durationMs = timer.end(); // Automatically logs duration
```

### API Route Logging (`/api/generate`)

Every request is logged with:

- **Request ID**: Unique identifier for tracking
- **Client info**: IP address, user agent
- **Request parameters**: File size, MIME type, model, motion settings
- **Phase timers**: Form parsing, validation, buffer conversion, video generation
- **Errors**: Full error details including name, message, stack trace

#### Log Output Example

```
[2025-10-05T00:47:28.123Z] [prod] [INFO] [/api/generate] Request started {"requestId":"a3b2c1","userAgent":"Mozilla/5.0...","ip":"1.2.3.4"}
[2025-10-05T00:47:28.456Z] [prod] [DEBUG] Request parameters {"requestId":"a3b2c1","hasImage":true,"imageSize":2048576,"imageMime":"image/jpeg","model":"turbo"}
[2025-10-05T00:47:28.789Z] [prod] [INFO] Starting video generation {"requestId":"a3b2c1","imageSize":2048576,"format":"jpeg","model":"turbo"}
```

### Higgsfield Client Logging (`src/lib/higgsfield.ts`)

Detailed logging for:

- **Client initialization**: When the Higgsfield API client is created
- **Image upload**: Timing and result of CDN upload
- **Job submission**: Parameters sent to Higgsfield API
- **Job completion**: Status checks and final results

#### Log Output Example

```
[2025-10-05T00:47:29.123Z] [prod] [DEBUG] Uploading image to Higgsfield CDN
[2025-10-05T00:47:30.456Z] [prod] [INFO] Image uploaded {"imageUrl":"https://cdn.higgsfield.ai/abc123..."}
[2025-10-05T00:47:30.789Z] [prod] [INFO] Submitting generation job {"model":"dop-turbo"}
[2025-10-05T00:48:15.123Z] [prod] [INFO] Job submitted {"jobSetId":"job_xyz789"}
```

### Environment Variable Logging (`src/lib/env.ts`)

On startup, the application validates and logs:

- Which environment variables are present (without revealing values)
- Length of each variable (for sanity checking)
- Missing variables with clear error messages

## Client-Side Logging

### Browser Console Logs

Open **DevTools Console** (F12) to see:

#### Request Start

```javascript
[Generate] Starting request {
  fileName: "photo.jpg",
  fileSize: 2048576,
  fileType: "image/jpeg",
  model: "turbo",
  motionId: "none",
  strength: 0.8
}
```

#### Response Received

```javascript
[Generate] Response received {
  status: 200,
  statusText: "OK",
  durationMs: 45678
}
```

#### Error Details

```javascript
[Generate] Request failed {
  status: 500,
  error: "Failed to generate video",
  details: "Missing environment variables: HF_API_KEY",
  data: {...}
}
```

## Common Error Patterns

### 1. Missing Environment Variables

**Symptoms:**

- 500 error immediately on request
- Log: `Missing environment variables: HF_API_KEY, HF_SECRET`

**Fix:**

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add `HF_API_KEY` and `HF_SECRET` for Production and Preview
3. Redeploy the application

### 2. Request Timeout

**Symptoms:**

- 500 error after ~60 seconds
- Log: `Timer [higgsfield-generation] completed {"durationMs":60000}`
- No completion message

**Fix:**

- Already implemented: `maxDuration = 300` in API route
- If still timing out, consider async pattern (see below)

### 3. File Too Large

**Symptoms:**

- 413 error
- Log: `Validation failed: File too large {"size":15728640,"limit":10485760}`

**Fix:**

- Client enforces 10MB limit
- Vercel has ~4-5MB serverless body limit
- Reduce image size before upload or implement direct CDN upload

### 4. Invalid MIME Type

**Symptoms:**

- 415 error
- Log: `Validation failed: Invalid MIME type {"mime":"image/gif","allowed":["image/jpeg","image/png","image/webp"]}`

**Fix:**

- Only JPEG, PNG, and WebP are supported
- Convert image format before upload

### 5. Authentication Failed

**Symptoms:**

- 401 error
- Log: `Authentication failed {"details":"Invalid API credentials"}`

**Fix:**

- Verify `HF_API_KEY` and `HF_SECRET` are correct in Vercel
- Check credentials at https://cloud.higgsfield.ai

## Viewing Logs on Vercel

### Via Dashboard

1. Go to your Vercel project
2. Click on the deployment
3. Navigate to "Functions" tab
4. Click on a function to see its logs

### Via CLI

```bash
# Install Vercel CLI if needed
pnpm add -g vercel

# Link your project
vercel link

# Tail logs in real-time
vercel logs https://your-app.vercel.app --follow

# View recent logs
vercel logs https://your-app.vercel.app --since=1h
```

## Performance Monitoring

### Timer Labels

All operations are timed. Look for these labels in logs:

- `api/generate:total` - Complete API request duration
- `form-parse` - FormData parsing time
- `buffer-conversion` - File to Buffer conversion
- `higgsfield-generation` - Video generation (including upload, submit, wait)
- `uploadImage` - CDN upload time
- `generateJob` - Job submission and completion time
- `generateVideoFromImage:total` - Total Higgsfield operation time

### Example Performance Log

```
[DEBUG] Timer [form-parse] completed {"durationMs":45}
[DEBUG] Timer [buffer-conversion] completed {"durationMs":123}
[DEBUG] Timer [uploadImage] completed {"durationMs":2345}
[DEBUG] Timer [generateJob] completed {"durationMs":42567}
[INFO] Video generation succeeded {"requestId":"abc123","jobSetId":"job_xyz","totalMs":45678}
```

## Testing Logging

### Local Development

```bash
pnpm dev
```

- Server logs appear in terminal
- Client logs appear in browser console
- Try uploading an image to see full flow

### Production Testing

1. Deploy to Vercel
2. Open browser DevTools console
3. Upload an image
4. Check both browser console and Vercel function logs

### Intentional Error Testing

To verify error logging works:

1. **Missing env vars**: Remove env vars from Vercel, redeploy
2. **Invalid file**: Try uploading a .gif file
3. **File too large**: Try uploading a 20MB image
4. **Invalid model**: Modify client to send `model: "invalid"`

## Advanced: Async Pattern for Long Jobs

If timeouts persist even with `maxDuration = 300`, consider implementing an async pattern:

```typescript
// POST /api/generate - Start job, return immediately
{
  jobSetId: "job_xyz789",
  status: "pending"
}

// GET /api/job-status?id=job_xyz789 - Poll for status
{
  status: "completed",
  videoUrl: "...",
  previewUrl: "..."
}
```

Client polls every 2-3 seconds until complete. This avoids long-lived serverless functions entirely.

## Debugging Checklist

When investigating a 500 error:

- [ ] Check browser console for client-side logs
- [ ] Check Vercel function logs for server-side logs
- [ ] Verify environment variables are set in Vercel
- [ ] Check file size (must be < 5MB for Vercel)
- [ ] Check file type (JPEG, PNG, WebP only)
- [ ] Look for timer values to identify slow operations
- [ ] Check error stack trace for exact failure point
- [ ] Verify Higgsfield API credentials are valid

## Support

If issues persist after checking logs:

1. Copy relevant logs from both client and server
2. Note the request ID from server logs
3. Check Higgsfield API status
4. Contact support with full log context

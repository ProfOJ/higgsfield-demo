# 🚀 Quick Start Guide

## Setup (2 minutes)

1. **Verify your environment variables are set**:

   ```bash
   cat .env.local
   # Should show:
   # HF_API_KEY=your_actual_key
   # HF_SECRET=your_actual_secret
   ```

2. **Start the development server**:

   ```bash
   pnpm dev
   ```

3. **Open the app**:
   - Navigate to http://localhost:3000
   - You should see the Jurassic Park Video Generator UI

## Test the App

1. **Upload an image**:
   - Click "Upload Image"
   - Select a photo or take one with your camera (mobile)
   - Preview should appear

2. **Select a motion** (optional):
   - Choose from the dropdown (e.g., "Zoom In", "Pan Left")
   - Adjust strength with the slider (0-1)

3. **Generate video**:
   - Click "🎬 Generate Jurassic Park Video"
   - Wait 30-60 seconds
   - Video will play automatically when ready

## Verify Everything Works

```bash
# Run all tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# E2E tests (requires dev server running)
pnpm e2e
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # POST /api/generate - generates video
│   │   └── motions/route.ts     # GET /api/motions - lists motions
│   └── page.tsx                 # Main UI
├── components/
│   └── MotionSelector.tsx       # Motion dropdown + slider
├── lib/
│   ├── env.ts                   # Validates HF_API_KEY & HF_SECRET
│   └── higgsfield.ts            # Higgsfield client wrapper
└── types/
    └── common.ts                # Shared TypeScript types
```

## Key Features Implemented

✅ Image upload with camera support  
✅ Motion selection with strength control  
✅ Real-time video generation with Higgsfield API  
✅ Environment validation with Zod  
✅ Server-only API key security  
✅ Full TypeScript support  
✅ Unit, integration, and e2e tests  
✅ Pre-commit hooks (lint-staged + prettier)  
✅ CI/CD workflow (GitHub Actions)

## Troubleshooting

### Dev server won't start

- Verify `.env.local` has `HF_API_KEY` and `HF_SECRET`
- Run `pnpm install` to ensure dependencies are installed

### Video generation fails

- Check that your Higgsfield account has credits
- Verify API credentials are correct
- Check browser console for error details

### Tests fail

- Ensure `HF_API_KEY` and `HF_SECRET` env vars are set for tests
- Run `pnpm test` (unit tests mock the API)

## Next Steps

- Test with different images and motions
- Try adjusting motion strength
- Deploy to Vercel or your preferred hosting
- Customize the Jurassic Park prompt in `src/types/common.ts`

Enjoy creating dinosaur videos! 🦖

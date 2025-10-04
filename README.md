# 🦖 Jurassic Park Video Generator

Turn your photos into epic Jurassic Park-style videos with dinosaurs entering the scene using the Higgsfield AI SDK.

## Features

- 📸 **Image Upload**: Support for file upload and mobile camera capture
- 🎬 **Motion Selection**: Choose from various camera motions (zoom, pan, dolly, etc.)
- 🦕 **Jurassic Park Theme**: Automatic prompt generation for dinosaur scenes
- 🧟 **Zombie Apocalypse**: Alternative zombie-themed video generator
- 🎭 **Multiple Themes**: Two immersive experiences (dinosaurs and zombies)
- 🎨 **Modern UI**: Responsive design with dark mode support
- ✅ **Testing**: Unit, integration, and e2e tests with Jest and Playwright
- 🔒 **Type-Safe**: Full TypeScript support
- ⚡ **Fast**: Built with Next.js 15 and Turbopack

## Prerequisites

- Node.js 22.x or later
- pnpm 10.x or later
- Higgsfield AI API credentials ([Get them here](https://cloud.higgsfield.ai))

## Getting Started

### 1. Clone and Install

```bash
# Install dependencies
pnpm install
```

### 2. Environment Setup

Create `.env.local` file in the project root:

```bash
HF_API_KEY=your_api_key_here
HF_SECRET=your_api_secret_here
```

> ⚠️ **Important**: Never commit your `.env` or `.env.local` files. They are already in `.gitignore`.

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Available Scripts

### Development

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm typecheck` - Run TypeScript type checking

### Testing

- `pnpm test` - Run unit and integration tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm e2e` - Run Playwright e2e tests
- `pnpm e2e:ui` - Run e2e tests with UI mode

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # Video generation endpoint
│   │   └── motions/route.ts     # Motion list endpoint
│   ├── page.tsx                 # Main UI page
│   └── globals.css              # Global styles
├── components/
│   └── MotionSelector.tsx       # Motion selection component
├── lib/
│   ├── env.ts                   # Environment validation
│   └── higgsfield.ts            # Higgsfield client wrapper
└── types/
    └── common.ts                # Shared TypeScript types
e2e/
└── home.spec.ts                 # End-to-end tests
```

## How It Works

1. **Upload Image**: Select a photo from your device or take one with your camera
2. **Choose Motion** (optional): Select a camera motion effect and adjust strength
3. **Generate**: Click the generate button to create your video
4. **Download**: Once complete, watch and download your Jurassic Park-style video

The app uses:

- **Client-side**: React for UI, FormData for file uploads
- **API Routes**: Next.js API routes handle image validation and Higgsfield API calls
- **Server-only**: Higgsfield credentials stay server-side for security

## Testing Best Practices

This project follows testing best practices:

- **Unit Tests**: Test individual functions and utilities
- **Integration Tests**: Test API routes with mocked dependencies
- **E2E Tests**: Test user flows with Playwright
- **Pre-commit Hooks**: Automatically lint and format before commits
- **CI/CD**: GitHub Actions runs all checks on push

## Environment Variables

Required:

- `HF_API_KEY` - Your Higgsfield API key
- `HF_SECRET` - Your Higgsfield API secret

These are validated at runtime using Zod schemas.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI SDK**: @higgsfield/client
- **Validation**: Zod
- **Testing**: Jest, Testing Library, Playwright
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## Credits

- Built with [Higgsfield AI](https://higgsfield.ai)
- Powered by [Next.js](https://nextjs.org)

## License

MIT

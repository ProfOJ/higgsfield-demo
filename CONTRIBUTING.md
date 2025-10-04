# Contributing to Jurassic Park Video Generator

Thank you for your interest in contributing! 🦖

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/higgsfield-dino-generator.git
   cd higgsfield-dino-generator
   ```

3. **Install dependencies**:

   ```bash
   pnpm install
   ```

4. **Set up environment**:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Higgsfield credentials
   ```

5. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Before You Start Coding

- Check existing issues and PRs to avoid duplicates
- Open an issue to discuss major changes first
- Follow the existing code style

### While Coding

```bash
# Run dev server
pnpm dev

# Run tests (in another terminal)
pnpm test:watch

# Type check
pnpm typecheck

# Lint
pnpm lint
```

### Before Committing

The pre-commit hook will automatically:

- Run ESLint and fix issues
- Format code with Prettier

But you can also run manually:

```bash
pnpm format      # Format all files
pnpm lint        # Check for issues
pnpm typecheck   # TypeScript validation
pnpm test        # Run all tests
```

## Code Guidelines

### TypeScript

- Use strict TypeScript - no `any` types
- Add JSDoc comments for public functions
- Export types for reusable interfaces

### Testing

- Add unit tests for utilities and helpers
- Add integration tests for API routes
- Add e2e tests for critical user flows
- Maintain test coverage above 80%

### File Structure

```
src/
├── app/          # Next.js pages and API routes
├── components/   # React components
├── lib/          # Utilities and helpers
└── types/        # Shared TypeScript types
```

### Naming Conventions

- **Components**: PascalCase (`MotionSelector.tsx`)
- **Files**: kebab-case for utils (`higgsfield.ts`)
- **Functions**: camelCase (`generateVideo()`)
- **Types/Interfaces**: PascalCase (`Motion`, `GenerateVideoParams`)

## Pull Request Process

1. **Update tests** - Add/update tests for your changes
2. **Update docs** - Update README if you change functionality
3. **Run quality checks**:

   ```bash
   pnpm lint && pnpm typecheck && pnpm test
   ```

4. **Commit with conventional commits**:

   ```bash
   git commit -m "feat: add custom prompt support"
   git commit -m "fix: resolve env loading issue"
   git commit -m "docs: update installation guide"
   ```

5. **Push and create PR**:

   ```bash
   git push origin feature/your-feature-name
   # Then create PR on GitHub
   ```

6. **PR Checklist**:
   - [ ] Tests pass
   - [ ] Linting passes
   - [ ] Type checking passes
   - [ ] Documentation updated
   - [ ] No merge conflicts
   - [ ] Commits follow conventional format

## Types of Contributions

### 🐛 Bug Fixes

- Find a bug? Open an issue with reproduction steps
- Include screenshots/videos if relevant
- Link to the issue in your PR

### ✨ New Features

- Discuss in an issue first
- Keep changes focused and atomic
- Add tests and documentation

### 📚 Documentation

- Fix typos, improve clarity
- Add examples and use cases
- Update screenshots/GIFs

### 🎨 UI/UX Improvements

- Maintain accessibility (WCAG 2.1 AA)
- Test on mobile devices
- Keep consistent with existing design

## Need Help?

- **Questions**: Open a discussion on GitHub
- **Bugs**: Open an issue with details
- **Security**: Email security concerns (don't open public issues)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

Thank you for contributing! 🦖✨

# 🔧 Troubleshooting Guide

## "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

This error means the API routes are returning HTML error pages instead of JSON. This typically happens when:

### Solution 1: Environment Variables Not Loaded

**Problem**: `.env.local` file exists but Next.js isn't loading it.

**Fix**:

1. **Restart your dev server** completely:

   ```bash
   # Kill any running dev servers
   pkill -f "next dev"

   # Start fresh
   pnpm dev
   ```

2. **Verify your `.env.local` file**:

   ```bash
   cat .env.local
   ```

   Should show:

   ```
   HF_API_KEY=your_actual_key_here
   HF_SECRET=your_actual_secret_here
   ```

3. **Check for typos**:
   - Variable names must be EXACTLY `HF_API_KEY` and `HF_SECRET`
   - No spaces around the `=` sign
   - No quotes needed (unless your key/secret contains spaces)

### Solution 2: File is `.env` not `.env.local`

**Problem**: You might have created `.env` instead of `.env.local`.

**Fix**:

```bash
# Copy to the correct file
cp .env .env.local

# Or edit directly
nano .env.local
```

Next.js prioritizes `.env.local` over `.env` for local development.

### Solution 3: Clear Next.js Cache

**Problem**: Next.js cached the old (missing) environment variables.

**Fix**:

```bash
# Remove build cache
rm -rf .next

# Restart
pnpm dev
```

## Verify Environment Variables are Working

Test the API routes directly:

```bash
# Should return JSON array of motions
curl http://localhost:3000/api/motions

# Should NOT return HTML starting with "<!DOCTYPE html>"
```

If you see JSON, it's working! If you see HTML with an error, check the error message in the server logs.

## "Missing or invalid environment variables"

**Problem**: The validation is failing.

**Checklist**:

- [ ] `.env.local` exists in project root
- [ ] File contains `HF_API_KEY=...` (not empty)
- [ ] File contains `HF_SECRET=...` (not empty)
- [ ] No extra spaces or quotes
- [ ] Dev server was restarted after creating/editing the file

## "Failed to fetch motions" or API Errors

**Problem**: Higgsfield API is rejecting your credentials.

**Fix**:

1. Verify your credentials at https://cloud.higgsfield.ai
2. Generate new API keys if needed
3. Update `.env.local` with the new keys
4. Restart dev server

## Port Already in Use

**Problem**: Port 3000 is already taken.

**Fix**:

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm dev -- -p 3001
```

## Module Not Found Errors

**Problem**: Dependencies aren't installed.

**Fix**:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## TypeScript Errors

**Problem**: Type checking is failing.

**Fix**:

```bash
# Check what's failing
pnpm typecheck

# If it's a dependency issue
rm -rf node_modules .next
pnpm install
```

## Still Having Issues?

1. **Check the server logs** in your terminal where `pnpm dev` is running
2. **Check browser console** (F12 → Console tab)
3. **Verify your Higgsfield account** has credits
4. **Try the example curl commands** above to isolate the issue

## Quick Health Check

Run this command to verify everything:

```bash
# Should all pass
pnpm typecheck && \
HF_API_KEY=test-key HF_SECRET=test-secret pnpm test && \
pnpm lint && \
echo "✅ Everything looks good!"
```

## Getting Help

If you're still stuck:

1. Check the error in server logs
2. Check browser console for client-side errors
3. Verify `.env.local` is correct
4. Try the "Clear Next.js Cache" solution above

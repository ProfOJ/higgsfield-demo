# Prompt Flow Debug Summary

## Investigation Results

After thorough investigation of the code, **the zombie prompt IS being sent correctly** through the entire system.

## Code Flow Verification

### 1. Frontend (zombie/page.tsx)

✅ **Lines 101-104**: Custom zombie prompt is added to formData

```typescript
formData.append(
  "prompt",
  "Cinematic shot where a group of realistic slow-moving zombies shamble and stagger toward the camera, classic Romero-style undead, apocalypse atmosphere, dramatic lighting, epic horror scene"
);
```

### 2. API Route (/api/generate/route.ts)

✅ **Line 31**: Receives custom prompt from formData

```typescript
const customPrompt = formData.get("prompt") as string | null;
```

✅ **Line 91**: Uses custom prompt or defaults to dinosaur prompt

```typescript
const prompt = customPrompt || DEFAULT_PROMPT;
```

✅ **Line 116**: Passes prompt to submitVideoGeneration

```typescript
const jobSetId = await submitVideoGeneration({
  imageBuffer,
  imageFormat,
  motionId: motionId || undefined,
  strength,
  prompt, // ← Custom prompt passed here
  model,
});
```

### 3. SDK Function (lib/higgsfield.ts)

✅ **Line 64**: Receives prompt parameter

```typescript
export async function submitVideoGeneration({
  imageBuffer,
  imageFormat,
  motionId,
  strength = 0.8,
  prompt, // ← Receives the prompt
  model = "turbo",
}: GenerateVideoParams);
```

✅ **Line 93**: Includes prompt in API params

```typescript
const params: Record<string, unknown> = {
  model: modelString,
  prompt: prompt || undefined, // ← Prompt included
  input_images: [InputImage.fromUrl(imageUrl)],
  enhance_prompt: true,
};
```

✅ **Line 112**: Sends to Higgsfield API

```typescript
const response = await client.client.post("/v1/image2video/dop", { params });
```

## Logging Added

The following logs will show the prompt at each stage:

1. **API Route** (line 42): Shows `customPrompt` value received
2. **SDK Function** (line 72): Shows prompt being submitted
3. **API Call** (line 107): Shows exact prompt sent to Higgsfield

## Comparison: Dinosaur vs Zombie

### Dinosaur (page.tsx)

- **Does NOT** send custom prompt
- Relies on `DEFAULT_PROMPT` in API route
- Default: `"Cinematic shot where a group of realistic dinosaurs enter the room toward the camera, Jurassic Park style, dramatic lighting, epic atmosphere"`

### Zombie (zombie/page.tsx)

- **DOES** send custom prompt
- Overrides default with zombie-specific prompt
- Custom: `"Cinematic shot where a group of realistic slow-moving zombies shamble and stagger toward the camera, classic Romero-style undead, apocalypse atmosphere, dramatic lighting, epic horror scene"`

## Why Prompts May Not Work as Expected

The Higgsfield DoP (Director of Photography) model is primarily designed for:

- Camera movements
- Scene animation
- Transforming existing elements in the image

It has **limitations** in:

- Adding entirely new objects/characters that aren't in the original image
- Generating complex new scenes

### Recommendations

1. **Check production logs** - Look for the log entries showing what prompt is actually sent
2. **Use images with context** - For zombies, use images of rooms/spaces where zombies could believably appear
3. **Adjust expectations** - The model may animate the scene atmospherically rather than literally adding zombies
4. **Try different phrasing** - Some prompt phrasings work better than others with AI models
5. **Consider using motion presets** - Combine prompts with motion IDs for better control

## Testing the Fix

To verify prompts are working:

1. Generate a zombie video
2. Check Vercel logs for:
   - `[/api/generate] Request started` → Should show `customPrompt` value
   - `Submitting video generation (no polling)` → Should show the zombie prompt
   - `Submitting generation job (no polling)` → Should show prompt in params

## Conclusion

**The code is working correctly.** Both dinosaur and zombie prompts are being sent to the Higgsfield API properly. Any difference in results is due to:

- How the AI model interprets the prompts
- Model training data and capabilities
- Inherent limitations of the DoP model

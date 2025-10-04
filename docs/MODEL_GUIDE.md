# 🎬 Model Selection Guide

## Overview

The Higgsfield DoP (Director of Photography) service offers three quality tiers for image-to-video generation. Choose based on your needs for speed, quality, and budget.

---

## Available Models

### 🏃 Lite (`dop-lite`)

**Best for**: Quick tests, previews, high-volume processing

| Attribute     | Value                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| **Speed**     | ⚡⚡⚡ Fastest (~10-20 seconds)                                                                        |
| **Quality**   | ⭐⭐ Good                                                                                              |
| **Cost**      | ~$0.125 per video (2 credits)                                                                          |
| **Use Cases** | - Rapid prototyping<br>- Testing motions/prompts<br>- High-volume batch processing<br>- Draft previews |

**Pros**:

- Fastest generation time
- Most affordable
- Great for iteration

**Cons**:

- Lower resolution details
- Less refined motion

---

### ⚡ Turbo (`dop-turbo`) **← Recommended Default**

**Best for**: Production-quality videos with fast turnaround

| Attribute     | Value                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------ |
| **Speed**     | ⚡⚡ Fast (~30-45 seconds)                                                                       |
| **Quality**   | ⭐⭐⭐ Great                                                                                     |
| **Cost**      | ~$0.41 per video (6.5 credits)                                                                   |
| **Priority**  | Queue priority over Lite                                                                         |
| **Use Cases** | - Production videos<br>- Social media content<br>- Marketing materials<br>- Client presentations |

**Pros**:

- Best balance of speed and quality
- Priority queue placement
- Excellent for most use cases

**Cons**:

- More expensive than Lite
- Slightly lower quality than Preview

---

### 🎨 Preview (`dop-preview`)

**Best for**: High-quality final outputs

| Attribute     | Value                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------- |
| **Speed**     | ⚡ Slower (~60-90 seconds)                                                                          |
| **Quality**   | ⭐⭐⭐⭐ Highest                                                                                    |
| **Cost**      | ~$0.56 per video (9 credits)                                                                        |
| **Use Cases** | - Final production assets<br>- High-quality previews<br>- Portfolio pieces<br>- Client deliverables |

**Pros**:

- Highest quality output
- Best motion smoothness
- Finest detail preservation

**Cons**:

- Longest generation time
- Most expensive option

---

## Pricing Comparison

| Model   | Credits | USD    | Relative Cost | Videos per $1 |
| ------- | ------- | ------ | ------------- | ------------- |
| Lite    | 2       | $0.125 | 1x            | ~8            |
| Turbo   | 6.5     | $0.41  | 3.3x          | ~2.4          |
| Preview | 9       | $0.56  | 4.5x          | ~1.8          |

_Based on Higgsfield pricing: $1 = 16 credits_

---

## Choosing the Right Model

### Decision Tree

```
Start
  ├─ Need it fast for testing? → Lite
  ├─ Need production quality quickly? → Turbo ⭐
  └─ Need maximum quality? → Preview
```

### By Use Case

| Use Case               | Recommended Model |
| ---------------------- | ----------------- |
| Testing prompts        | Lite              |
| Prototyping            | Lite              |
| Social media posts     | Turbo             |
| Marketing videos       | Turbo             |
| Client presentations   | Turbo or Preview  |
| Final deliverables     | Preview           |
| Portfolio work         | Preview           |
| High-volume automation | Lite              |

### By Budget

| Budget       | Strategy                                        |
| ------------ | ----------------------------------------------- |
| **Tight**    | Use Lite for tests, Turbo for final only        |
| **Moderate** | Use Turbo for everything                        |
| **Flexible** | Use Preview for client work, Turbo for internal |

---

## Quality Differences

### Visual Comparison

| Aspect                  | Lite   | Turbo  | Preview   |
| ----------------------- | ------ | ------ | --------- |
| **Resolution**          | Good   | Great  | Best      |
| **Motion smoothness**   | 60 FPS | 60 FPS | 60 FPS    |
| **Detail preservation** | Fair   | Good   | Excellent |
| **Artifact reduction**  | Basic  | Good   | Best      |
| **Color accuracy**      | Good   | Great  | Excellent |

---

## Tips for Optimization

### Cost Optimization

1. **Use Lite for initial tests** - Find the right motion and prompt
2. **Switch to Turbo for final** - Once you're happy with the preview
3. **Reserve Preview for clients** - When quality is critical

### Quality Optimization

1. **Higher quality input** = Better output (all models)
2. **Motion strength** affects all models equally
3. **Prompt quality** matters more than model choice
4. **Preview model** best for detailed subjects

### Speed Optimization

1. **Lite** for rapid iteration
2. **Turbo** when you need both speed and quality
3. **Batch process** with Lite, then regenerate favorites with Preview

---

## API Model Strings

When using the API or SDK directly:

```typescript
// Correct API values
model: "dop-lite"; // Lite
model: "dop-turbo"; // Turbo
model: "dop-preview"; // Preview

// ❌ Don't use these (old/incorrect)
model: "lite";
model: "standard";
model: DoPModel.STANDARD;
```

---

## Examples

### Testing a New Motion

```typescript
// Use Lite for quick iteration
model: "dop-lite";
motion: "zoom-in";
strength: 0.8;
// Generate → Adjust → Repeat
```

### Social Media Post

```typescript
// Use Turbo for production quality
model: "dop-turbo";
motion: "dolly-zoom";
strength: 0.7;
prompt: "Cinematic dinosaur entrance";
```

### Client Deliverable

```typescript
// Use Preview for maximum quality
model: "dop-preview";
motion: "pan-left";
strength: 0.9;
prompt: "Dramatic Jurassic Park style reveal";
```

---

## FAQs

**Q: Can I upgrade from Lite to Preview later?**  
A: Yes! Just regenerate with the same settings but higher model. Each generation is independent.

**Q: Is Turbo really worth 3x the cost of Lite?**  
A: For production use, yes. The quality difference is noticeable, and you get queue priority.

**Q: When should I use Preview over Turbo?**  
A: When quality is more important than speed/cost - final deliverables, client work, portfolio pieces.

**Q: Do motion settings work the same across models?**  
A: Yes! The same motion and strength work identically across all models.

**Q: Can I mix models in the same project?**  
A: Absolutely! Use Lite for tests, Turbo for most content, Preview for hero shots.

---

## Support

For more information:

- [Higgsfield Documentation](https://docs.higgsfield.ai)
- [Pricing Details](https://cloud.higgsfield.ai/pricing)
- [API Reference](https://docs.higgsfield.ai/api-reference)

# Directive: Standardize "Nuestros Tamaños" Category Images

This directive outlines the process to upgrade the product images in the "Nuestros Tamaños" section to the "Pastel Warm" visual style.

**Goal**: Replace current category images with high-quality, pastel-themed generations while preserving the original files.

## 1. Safety & Constraints
> [!IMPORTANT]
> **Daily Limit**: Attempts to generate many images may fail due to API rate limits. If this happens, PAUSE and resume later. Do not create low-quality placeholders.
> **Preserve Originals**: Never overwrite the `.jpg` source files. Always create new files with a `-pastel.png` suffix.

## 2. Visual Style (Pastel Warm)
**Prompt**:
> "product photography of [DESCRIPTION] on a soft pastel cream or light pink background, warm ambient lighting, soft shadows, cozy and premium feel, high quality, 4k"

## 3. Execution Plan (Batch Process)
The `CategoryShowcase.tsx` file controls these images. You will need to generate a new image for each Flavor (Semi, White, Milk) for each Category.

### Target Images Map
| Category | Flavor | Original File | Target File | Description |
|---|---|---|---|---|
| **Tabletas** | Semi | `tableta-semi-amargo.jpg` | `tableta-semi-amargo-pastel.png` | single dark chocolate bar |
| | White | `tableta-blanco.jpg` | `tableta-blanco-pastel.png` | single white chocolate bar |
| | Milk | `tableta-leche.jpg` | `tableta-leche-pastel.png` | single milk chocolate bar |
| **Bombones** | Semi | `bombones-rellenos-semi.jpg` | `bombones-rellenos-semi-pastel.png` | cluster of dark bonbons |
| | White | `bombones-rellenos-blanco.jpg` | `bombones-rellenos-blanco-pastel.png` | cluster of white bonbons |
| | Milk | `bombones-rellenos-leche.jpg` | `bombones-rellenos-leche-pastel.png` | cluster of milk bonbons |
| **Simples Chicos** | Semi | `simples-chicos-semi.jpg` | `simples-chicos-semi-pastel.png` | small dark chocolates |
| | White | `simples-chicos-blanco.jpg` | `simples-chicos-blanco-pastel.png` | small white chocolates |
| | Milk | `simples-chicos-leche.jpg` | `simples-chicos-leche-pastel.png` | small milk chocolates |
| **Simples Grandes** | Semi | `simples-grandes-semi.jpg` | `simples-grandes-semi-pastel.png` | large dark chocolates |
| | White | `simples-grandes-blanco.jpg` | `simples-grandes-blanco-pastel.png` | large white chocolates |
| | Milk | `simples-grandes-leche.jpg` | `simples-grandes-leche-pastel.png` | large milk chocolates |
| **Tabletas Chicas** | Semi | `tabletas-chicas-semi.jpg` | `tabletas-chicas-semi-pastel.png` | small dark bar |
| | White | `tabletas-chicas-blanco.jpg` | `tabletas-chicas-blanco-pastel.png` | small white bar |
| | Milk | `tabletas-chicas-leche.jpg` | `tabletas-chicas-leche-pastel.png` | small milk bar |
| **Barritas** | Semi | `barritas-rellenas-semi.jpg` | `barritas-rellenas-semi-pastel.png` | stuffed dark bar |
| | White | `barritas-rellenas-blanco.jpg` | `barritas-rellenas-blanco-pastel.png` | stuffed white bar |

## 4. Code Implementation
After generating the images, modify:
`src/frontend/components/CategoryShowcase.tsx`

Update the `getImagePath` function to return the new `-pastel.png` paths.

```typescript
// Example:
if (selectedFlavor === "semi") return "/images/products/tableta-semi-amargo-pastel.png";
```

## 5. Verification
1.  Run `npm run dev`.
2.  Navigate to "Nuestros Tamaños".
3.  Click through ALL flavor buttons (Semi/White/Milk) for each category.
4.  Ensure no broken images.

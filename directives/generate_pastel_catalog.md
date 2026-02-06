# Directive: Generate Pastel Catalog Images

This directive guides the generation of product images with a "High-Quality Pastel Background" style, strictly preserving the product's original shape, quantity, **and composition/distribution**.

## Core Constraints
1.  **Preserve Structure & Layout**: You MUST use the **Original Product Image** as a structure reference. The count, shape, and **spatial distribution** of the items must remain identical to the source. Do not rearrange the items.
2.  **Style Consistency**: You MUST use a **Style Reference Image** (e.g., `simples-chicos-250-pastel.png`) for lighting and background.
3.  **Tooling**: Use `execution/generate_image_openrouter.py` with `gemini-3-image`.

## Visual Style
-   **Background**: Seamless soft pastel (pink, beige, or warm cream). No heavy textures.
-   **Lighting**: Soft, diffused studio lighting. High key, commercial quality.
-   **Quality**: 8k, hyperrealistic, ultra-sharp focus.

## Workflow
1.  **Prepare References**:
    -   **Ref 1 (Structure)**: The original `.jpg` of the product.
    -   **Ref 2 (Style)**: A successful pastel generation.

2.  **Generate**:
    -   **Command**: `python execution/generate_image_openrouter.py`
    -   **Arguments**:
        -   `--model`: "gemini-3-image"
        -   `--reference`: "path/to/original.jpg,path/to/style_ref.png"
        -   `--prompt`: 
            > "Product photography of [EXACT DESCRIPTION]. The FIRST image provided is the PRODUCT STRUCTURE (exact shape, quantity, and SPATIAL DISTRIBUTION). The SECOND image provided is the STYLE REFERENCE (lighting/background/tone). Recreate the product from image 1 ensuring it looks EXACTLY like those items arranged in that SPECIFIC LAYOUT, but place it in the environment/lighting of image 2. Seamless soft pastel warm beige background, commercial aesthetic, 8k, hyperrealistic, ultra sharp focus, highly detailed, masterpiece."

3.  **Verify**: Check that the generated image has the **exact count/shape/layout** of the original.

4.  **Save**: Save as `[original_name]-pastel.png`.

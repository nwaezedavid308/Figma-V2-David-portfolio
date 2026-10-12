# Managing the portfolio images

Add JPG, PNG, WebP, AVIF, GIF, or SVG files to:

- `public/PORFOLIO DESIGNS` for product and interface design.
- `public/GRAPHICS AND BRAND DESIGN` for graphics and brand design.

Nested folders are supported. Names become readable image captions. Use descriptive file names. The Vite plugin refreshes the page when an image is added, changed, or removed, and generates the same collection during a production build. No manual JavaScript manifest is needed.

Eight selected images open the product showcase. Browse all designs opens the complete image collection. Exact duplicate files appear once. Originals remain untouched. Existing files containing “flyer” or “feature graphics” supply the graphics carousel when its dedicated folder is empty.

Run `npm install`, `npm run dev`, `npm run lint`, and `npm run build`. If port 3000 is unavailable, use `npm run dev -- --port=5173`.

The uploaded product requirements document is not carousel content; only supported image files are displayed.

The current uploaded images have WebP previews in public/showcase-previews. The carousel uses previews when available; the viewer opens the original. New images without a preview still work automatically.

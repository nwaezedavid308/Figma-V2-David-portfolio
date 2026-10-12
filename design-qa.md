# Redesign verification

- Production build and TypeScript checks pass.
- Light theme renders white (#FFFFFF) with navy (#0D1B2A) text.
- Dark theme renders navy (#0D1B2A) with soft-gray (#E6E9EC) text.
- Theme selection persists after reload.
- Checked widths: 375, 768, 1024, and 1440 pixels; no page-level horizontal overflow.
- Both image carousels render: eight selected product images and three graphics images from the current upload. The full product collection contains 124 unique images.
- Arrow navigation advances the active project. Image dialogs open and close with Escape.
- Reduced-motion preference disables pinned scroll animation.
- No browser runtime errors in the final smoke check.
- Text colour pairs meet 4.5:1: blue/white button 4.51:1; navy/green 7.76:1; dark secondary text 8.14:1; main light/dark text 17.39:1 and 14.27:1.
- Optimized image previews total about 5 MB; uploaded originals total about 80.5 MB. Full artwork remains available in the viewer.

These checks cover the redesigned interface. Text inside uploaded artwork is part of the source image and is not recoloured by the website theme.

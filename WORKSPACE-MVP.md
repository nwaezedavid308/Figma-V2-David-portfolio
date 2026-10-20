# Interactive portfolio workspace MVP

The React/Vite portfolio now opens as a design editor. Project metadata and the introduction copy live in `src/workspaceData.ts`. Existing artwork remains in `public/`; the workspace reuses the existing optimised previews where available.

## Included

- Desktop toolbar, searchable pages and collapsible layers, selectable artboards, contextual inspector.
- Persisted light/dark themes; system preference on first visit.
- Scripted opening cursor, progressive frame outlines, typed introduction and bio, sequential work reveal, and navigation highlights. Pause/resume, take control, replay, first-visit memory, reduced-motion fallback.
- Canvas wheel/trackpad pan, drag pan on the canvas, zoom, fit, reset, presentation mode. Keyboard: V select, H hand, +/- zoom, 0 fit, Escape exit.
- Project detail dialogs with native focus containment and `?project=…` shareable links. Browser back restores the preceding project context.
- Mobile scrolling artboards, navigation drawer, assistant sheet, touch controls.
- Grounded local portfolio guide with project/category discovery and documented background/contact answers. It explicitly identifies itself as local mode.
- About/profile download, email, WhatsApp, LinkedIn, copy-link sharing.

## Content and integration boundaries

This is the first reviewable MVP, not completion of every PRD feature. No live language model or private API key is connected. A secure server endpoint, retrieval, and action validation belong in the next phase; the existing local guide and navigation remain usable without that service.

The repository contains no formal CV. “Download profile” exports a clearly labelled text summary. Project software, delivery dates, measured results, and live/prototype URLs have not been invented. Design-direction notes summarise the presented interface explorations rather than asserting new research or validated outcomes.

The uploaded imagery is used as portfolio content, while the attached Figma references inform the editor layout. No Figma branding or logo is used. The former site components remain in the repository and are available through Git history; the new entry point is `src/Workspace.tsx`.

## Verification

- TypeScript: `npm run lint` (`tsc --noEmit`).
- Production bundle: `npm run build`.
- Browser interactions checked: layer selection updates the inspector; case study opens at `?project=octoserve`; closing restores the workspace; search for AKUBA returns one project; guide filters mobile work; replay/pause/resume/take-control cycle; light and dark switches.
- Desktop and mobile DOM checks found no page-level horizontal overflow. Mobile uses its own scrolling layout rather than shrinking the editor.
- The browser reported no application JavaScript exceptions in the checked flow; a separately installed Chrome extension logged its own error.
- Browser screenshot capture repeatedly timed out on this machine. Visual screenshot review remains a limitation of this verification pass.

## Next review

Review the editor fidelity, selected project presentation, and opening pacing before adding secure live AI, the formal CV, richer verified case-study narratives, and additional content.

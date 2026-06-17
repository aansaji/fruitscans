## FruitScan Elite — Lab-Grade Fruit Analysis Dashboard

Build a single-page dark dashboard UI matching the provided HTML reference. Static front-end only, no backend.

### Sections (on `/`)
1. **Top nav bar** — sticky, dark, brand + nav links.
2. **Hero** — "Analyze Freshness with Precision" headline, two CTAs (Activate Camera, Batch Upload), and a glass-card scanner drop zone with hotlinked preview image and floating "Elite Device Connected" status pill.
3. **Live Analysis Dashboard** — header + 3 icon buttons; 4 metric glass-cards (Ripeness 87/100, Moisture 14.2%, Sugar 12.5°Bx, Pesticide 0.02 ppm) each with icon, status chip, value, and progress bar.
4. **Spectral Analysis Chart** — glass-card with Infrared/UV legend and an 8-bar bar chart with nm scale.
5. **System Tools** — 4 link cards (Scan History, Database Sync, Data Export, Calibration).
6. **Footer** — minimal brand + copyright.

### Design system (added to `src/styles.css`)
- Dark theme tokens in oklch: `background` (near-black), `surface`, `surface-container`, `surface-container-high`, `surface-container-lowest`, `on-surface`, `on-surface-variant`, `outline-variant`.
- Accent palette: `primary` (neon green), `secondary` (electric blue), `citrus-orange`, `berry-red`, each with a matching `glow-*` box-shadow utility.
- Utility classes: `.glass-card` (translucent bg + blur + border), `.btn-depth` (subtle shadow), `.sunk-in` (inset shadow), `.scanner-border-3d` (gradient border wrapper), `.glow-green/.glow-blue/.glow-orange/.glow-red` (drop-shadow glow).
- Typography: Space Grotesk (display/headline) + Inter (body), loaded via `<link>` in `__root.tsx`. Material Symbols Outlined icon font loaded the same way for the `material-symbols-outlined` spans.

### Technical
- Route: replace `src/routes/index.tsx` placeholder with the landing page; update `head()` with title "FruitScan Elite — Lab-Grade Freshness Analysis" and matching description/OG tags.
- Components split under `src/components/fruitscan/`: `TopNav`, `Hero`, `MetricCard`, `Dashboard`, `SpectralChart`, `SystemTools`, `Footer`.
- Images hotlinked from the source `lh3.googleusercontent.com` URL — no asset uploads.
- All colors via semantic tokens; no hardcoded hex in components.
- Buttons are non-functional (visual only) since no backend behavior was specified.

### Out of scope
- File upload handling, camera access, real data, routing to subpages (System Tools cards are visual links to `#`).

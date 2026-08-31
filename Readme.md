<div align="center">

# 🗺️ Stratakort

**Production-quality map poster generator**

Search anywhere on Earth, customize the cartography, compose a poster, and export a print-ready PNG — all in the browser.

[![Live Demo](https://img.shields.io/badge/demo-stratakort.vercel.app-1e2327?style=for-the-badge&logo=vercel&logoColor=white)](https://stratakort.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MapLibre](https://img.shields.io/badge/MapLibre_GL_JS-396CB2?style=for-the-badge&logo=mapbox&logoColor=white)](https://maplibre.org)

[Live App](https://stratakort.vercel.app) · [Features](#-features) · [Getting Started](#-getting-started) · [Architecture](#️-architecture-highlights) · [Roadmap](#-potential-future-development)

</div>

---

## ✨ What is Stratakort?

Stratakort turns real-world geographic data into highly customizable map posters. Search for a location, choose a cartographic style, customize colors and typography, add routes and markers, adjust the composition, and export the finished poster.

> *The map is the artwork. You control the visual language.*

Everything in the editor is **real functionality**, not static UI — the map, themes, styling controls, routes, terrain, poster composition, preview, and export pipeline are all fully implemented.

Built with **Next.js**, **MapLibre GL JS**, **Zustand**, and free/keyless geographic data sources.

---

## 🚀 Features

<table>
<tr>
<td width="50%" valign="top">

### 🗺️ Live Map Editor
- Interactive MapLibre GL JS map
- Real OpenStreetMap-derived vector tiles
- Full-planet coverage via OpenFreeMap
- Satellite imagery (Esri) & terrain basemap (OpenTopoMap)
- Buildings & roads stay visible at poster-level zooms
- No API key required

### 🎨 40 Cartographic Themes
Curated visual systems — not just background-color swaps. A few favorites: `Midnight Blue` · `Copper` · `Blueprint` · `Cyberpunk` · `Tokyo Neon` · `Nordic Frost` · `Synthwave` · `Obsidian Gold` — [see the full list](#-full-theme-list).

Every theme controls land, water, roads, buildings, parks, borders, and labels together — or override each color manually.

### 🖌️ Custom Styling & 🌈 Visual Effects
Independent color controls for every map layer, plus 5 built-in filters (`Vintage`, `Cool`, `Warm`, `Faded`, `Noir`) and a procedural film-grain effect — consistent between live preview and export.

### ✍️ Typography
Serif, sans-serif, display, and monospace pairings with full control over title, subtitle, tagline, alignment, size, weight, and letter spacing.

</td>
<td width="50%" valign="top">

### 📍 Location Search
Powered by OpenStreetMap Nominatim, with debounced requests, keyboard navigation, and server-side proxying — shared across map search, the location panel, and route waypoints.

### 🧭 Routes
Connect two or more locations with a rendered route (color, weight, solid/dashed) baked directly into the MapLibre style.

### ⛰️ Terrain & Elevation
Optional real elevation shading via AWS Open Data terrain tiles, layered independently of the basemap.

### 🖼️ Poster Composition
**Framed** (matted crop, title area, optional frame) or **Floating** (full-bleed map, text over a gradient scrim) — with configurable padding, orientation, and matting.

### 📐 Aspect Ratios
Presets across **Print** (2:3, A4, A3, Letter...), **Social** (LinkedIn, YouTube, Instagram, Reddit), and **Wallpaper** (4K, UltraWide, iPhone, Galaxy).

### 🖨️ High-Res PNG Export
A true render pipeline — not a screenshot. Map, crop, matting, frame, markers, typography, filters, and grain are composited on an off-DOM canvas at target resolution.

</td>
</tr>
</table>

<details>
<summary><b>🎨 Full theme list (40 themes)</b></summary>
<br>

Midnight Blue · Warm Sand · Copper · Emerald · Soft Slate · High Contrast Monochrome · Folio · Daylight · Nightdrive · Pastel Studio · Blueprint · Cyberpunk · Nordic Frost · Terracotta · Vintage Atlas · Tokyo Neon · Sage Forest · Obsidian Gold · Sunset Minimal · Dark Inverted Mono · Desert Oasis · Deep Plum · Sunken Treasure · Creamy Matcha · Cherry Blossom · Volcanic Ash · Royal Navy · Warm Olive · Synthwave · Rose Gold · Arctic Ice · Brutalist Concrete · Dune Spice · Lavender Fog · Mustard Retro · Matrix Green · Biscuit Parchment · Electric Violet · Subtle Clay · Abyssal Trench

</details>

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js, React, TypeScript |
| Maps | MapLibre GL JS |
| State | Zustand |
| Styling | Tailwind CSS |
| Rendering | HTML Canvas |
| Map tiles | OpenFreeMap, OpenStreetMap |
| Geocoding | Nominatim |
| Imagery | Esri World Imagery, OpenTopoMap |
| Elevation | AWS Open Data |
| Deployment | Vercel |

---

## 📁 Project Structure

<details>
<summary>Click to expand full directory tree</summary>

```
.
├── app/
│   ├── api/geocode/route.ts        # Server-side Nominatim geocoding proxy
│   ├── create/page.tsx             # Interactive map poster editor route
│   ├── globals.css                 # Tailwind imports & global styles
│   ├── layout.tsx                  # Root application layout
│   └── page.tsx                    # Product landing page
│
├── components/
│   ├── editor/                     # Map customization & layout controls
│   │   ├── ColorControls.tsx       # 8-color palette editor
│   │   ├── ControlPanel.tsx        # Sidebar / mobile sheet assembly
│   │   ├── DownloadBar.tsx         # Persistent export action bar
│   │   ├── EditorCanvas.tsx        # Viewport wrapper & gesture boundary
│   │   ├── EffectsControls.tsx     # Filter presets & grain intensity
│   │   ├── LayerControls.tsx       # Layer visibility & 3D terrain toggles
│   │   ├── LocationSearch.tsx      # Debounced location search
│   │   ├── MapCanvas.tsx           # MapLibre lifecycle & live filters
│   │   ├── MarkerControls.tsx      # Pin visibility & styling
│   │   ├── PosterOverlay.tsx       # Real-time preview overlay
│   │   ├── PosterSettingsControls.tsx # Frame, ratio, padding, matting
│   │   ├── RouteControls.tsx       # Waypoints & route styling
│   │   ├── StyleSelector.tsx       # Basemap & theme picker
│   │   └── TypographyControls.tsx  # Fonts, copy, alignment, spacing
│   │
│   ├── landing/                    # Landing page sections
│   │   ├── FAQ.tsx
│   │   ├── Features.tsx
│   │   ├── Gallery.tsx
│   │   ├── Hero.tsx
│   │   └── PosterMock.tsx
│   │
│   └── ui/                         # Reusable atomic components
│       ├── Accordion.tsx
│       ├── ColorField.tsx
│       ├── SegmentedControl.tsx
│       ├── Slider.tsx
│       └── Toggle.tsx
│
└── lib/
    ├── aspectRatioPresets.ts       # Print/Social/Wallpaper configs
    ├── export.ts                   # Canvas compositor & PNG exporter
    ├── fontPairs.ts                # Typography pairings & loaders
    ├── grain.ts                    # Procedural film-grain generator
    ├── mapStyles.ts                # Schema-based recoloring engine
    ├── palettes.ts                 # Curated theme presets
    ├── store.ts                    # Zustand editor state
    └── useExportPoster.ts          # High-res export orchestration
```

</details>

---

## 🔧 Getting Started

**Requirements:** Node.js 18.18+ and npm

```bash
git clone <your-repository-url>
cd stratakort
npm install
npm run dev
```

Open **http://localhost:3000** — no environment variables or API keys required.

| Script | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run start` | Runs the production build |
| `npm run lint` | Runs linting checks |

---

## ☁️ Deployment

Stratakort deploys directly to **Vercel**:

1. Push the repository to GitHub, GitLab, or Bitbucket
2. Import the repository into Vercel
3. Vercel auto-detects the Next.js app and deploys it

The `/api/geocode` endpoint runs automatically as a Vercel serverless function. No environment variables required.

---

## 🌍 Data Sources & Attribution

| Purpose | Provider |
|---|---|
| Vector cartography | OpenFreeMap |
| Geographic data | OpenStreetMap |
| Geocoding | OpenStreetMap Nominatim |
| Satellite imagery | Esri World Imagery |
| Terrain basemap | OpenTopoMap |
| Elevation data | AWS Open Data |

Exported posters include an attribution colophon crediting OpenStreetMap and Stratakort. Please review each provider's usage policy before operating at significant scale.

---

## ⚙️ Architecture Highlights

<details>
<summary><b>Schema-Based Map Styling</b></summary>
<br>

Map styling isn't tied to a single hardcoded style. `mapStyles.ts` analyzes OpenMapTiles source layers and categorizes them into functional groups (background, land, water, parks, buildings, roads, borders, labels), letting the palette system recolor the map while staying resilient to layer-ID changes across compatible OpenMapTiles styles.

</details>

<details>
<summary><b>Poster Rendering Pipeline</b></summary>
<br>

The map renderer is decoupled from the poster compositor:

```
MapLibre → Map Render Surface → Poster Layout
                                     │
                    ┌────────────────┼────────────────┐
                Crop  Matting  Frame  Marker  Typography  Filters  Grain  Attribution
                                     │
                                  Canvas → PNG
```

This keeps the interactive map and final export visually consistent while decoupling export from DOM layout.

</details>

<details>
<summary><b>Pixel-Accurate Preview</b></summary>
<br>

The editor preview and PNG export share the same `computePosterLayout` calculations for crop, matting, frame, text positioning, and attribution — minimizing discrepancies between what you see and what you export.

</details>

---

## 🧪 Known Limitations

<details>
<summary>Expand for details on current constraints</summary>

- **Map style repainting** — Theme changes use MapLibre's `setStyle()`. Constrained GPU-less/headless environments with software WebGL may not visibly repaint after color-only changes (structural/basemap changes are unaffected). Check `MapCanvas.tsx` first if this occurs.
- **Nominatim scaling** — The public endpoint suits moderate usage. For larger deployments, consider self-hosting Nominatim, a dedicated geocoding provider, or stronger caching/rate limiting.
- **OpenFreeMap availability** — Free, without a commercial SLA. Stratakort falls back across multiple compatible styles, but ultimately depends on upstream tile infrastructure.
- **Routing** — Routes use straight line segments, not road-following navigation. A future implementation could integrate OSRM.
- **Export resolution** — Named formats (A4, A3, Letter, social, wallpaper) use fixed pixel dimensions; ratio-only presets scale per quality tier and are subject to canvas limits. Very large print-press output (e.g., 24" at true 300 DPI) would need server-side rendering.
- **Fonts** — Uses local/system fonts rather than a remote webfont CDN, keeping the app dependency-free by default.
- **Persistence** — No accounts, database, cloud storage, saved designs, or collaboration. Editor state lives in browser memory for the session.

</details>

---

## 🎯 Design Philosophy

Stratakort intentionally avoids the visual language of generic SaaS dashboards and AI products. The interface draws from **cartography, printmaking, editorial design, paper, ink, brass, serif typography, and monospaced geographic metadata** — so the map itself feels like a designed artifact, not a navigation map dropped into a poster template.

---

## 🔮 Potential Future Development

- Road-following routes (OSRM)
- Saved projects & shareable poster URLs
- User accounts & collaborative editing
- Custom webfonts & map layer imports
- GPX/KML route imports
- Server-side high-resolution rendering
- Batch poster generation & version history

---

## 📜 License & Originality

Stratakort is an original implementation inspired by the broader category of interactive map poster editors. It does not copy the branding, logos, source code, or written copy of another product — the interface, styling system, editor architecture, poster composition system, and export pipeline were built specifically for Stratakort.

---

<div align="center">

**Made for maps. Designed like posters.**

[stratakort.vercel.app](https://stratakort.vercel.app)

</div>

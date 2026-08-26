# Stratakort

A production-quality map poster generator, inspired by Terraink's product
category. Search anywhere on Earth, restyle the cartography by hand — theme,
typography, layers, routes — and export a print-ready PNG. Built with
Next.js, MapLibre GL, and free/keyless map data.

This is an original implementation inspired by the *product category*
(interactive map poster editors), not a clone. No branding, logos, copy, or
source code were copied from any reference site — including on generated
posters, where the attribution line credits OpenStreetMap and this product
(Stratakort) rather than any other company's name.

---

## 1. What's actually implemented

Everything below is real and working, not a mock:

- **Live map editor** — MapLibre GL JS renders real OpenStreetMap-derived
  vector tiles (via [OpenFreeMap](https://openfreemap.org), free, no API
  key — tried as positron → bright → liberty in order, so a single style
  hiccup doesn't take the map down), plus two raster map types (Esri
  satellite imagery, OpenTopoMap terrain). Buildings and street detail are
  forced to render at any zoom the poster is framed at, rather than only
  once you zoom in close the way a navigation-map style normally behaves.
- **Eleven curated themes** — Midnight Blue, Warm Sand, Copper, Emerald, Soft
  Slate, High Contrast Monochrome, Folio, Daylight, Nightdrive, Pastel
  Studio, and Blueprint — each a deliberately composed color story (not
  just a background swap), plus full custom color overrides for
  background, land, water, major streets, minor streets, buildings, parks,
  borders, and labels.
- **Visual effects** — six map filters (Vintage, Cool, Warm, Faded, Noir)
  applied identically in the live preview (CSS) and the export (canvas
  `ctx.filter`), plus an adjustable procedural film-grain overlay.
- **Typography** — four curated font pairs (Serif, Sans-Serif, Display,
  Monospace), wide-tracked uppercase titles, an italic subtitle, a
  multi-line custom quote/tagline, left/center/right alignment, adjustable
  size/weight/letter-spacing, and an auto-or-custom text color.
- **Routes** — add two or more searched stops and Stratakort draws a styled
  connecting line (color, weight, solid/dashed) directly into the map style,
  so it renders live and exports automatically with the rest of the map.
- **Poster composition** — two overlay layouts (framed: matted crop with the
  title in its own strip; floating: full-bleed map with the title floating
  over its bottom edge on a gradient scrim), 16 aspect-ratio presets across
  Print (2:3, 3:4, 4:5, 1:1, A4, A3, Letter), Social (LinkedIn Banner,
  YouTube Banner/Thumbnail, Instagram Square, Instagram Story, Reddit
  Banner), and Wallpaper (Desktop 4K, UltraWide, iPhone, Galaxy) — plus
  orientation (where the format doesn't lock it), edge padding, frame
  (none/line/double), and matting (auto/white/black/custom) — plus a
  bottom-edge attribution colophon crediting OpenStreetMap, honoring their
  attribution requirement.
- **Real elevation shading** — an optional 3D terrain/hillshade layer using
  free, keyless AWS Open Data terrain-RGB tiles, toggleable on any map type.
- **Real location search** — a server-side proxy to OpenStreetMap Nominatim
  (`/api/geocode`), debounced, with keyboard navigation and empty/error
  states, reused across the floating map search, the Location panel, and
  the Routes waypoint picker.
- **Pixel-accurate live preview** — the on-screen crop/mat/frame/typography
  overlay uses the exact same layout math (`computePosterLayout`) as the PNG
  export, so what you see matches what downloads.
- **Real PNG export** — composites the live map canvas with the poster
  frame, marker, and typography onto an off-DOM canvas and downloads it.
  "High-res" and "Print" tiers genuinely re-render the map at that target
  resolution (not an upscaled screenshot) by briefly resizing the map's
  render surface off-screen, capturing, then restoring it invisibly.
- **Accordion control panel** — Location, Theme, Layout, Style, Layers,
  Markers, Routes, and Settings, each collapsible, with a live "Current
  Settings" summary and a persistent Download button always reachable
  regardless of scroll position — on both desktop (sidebar) and mobile
  (bottom sheet).

---

## 2. Project structure

```
app/
  page.tsx                    Landing page
  create/page.tsx              Editor route
  api/geocode/route.ts         Server-side Nominatim proxy
  layout.tsx, globals.css

components/
  landing/                     Navbar, Hero, Features, Gallery, FAQ, Footer,
                                PosterMock (real live-rendered sample poster
                                cards, see LiveMapThumbnail)
  editor/
    MapEditor.tsx               Top-level editor composition
    EditorCanvas.tsx            Owns the stable "viewport" wrapper
    MapCanvas.tsx                MapLibre lifecycle: create, style updates,
                                  live filter, error/loading states
    PosterOverlay.tsx            Live crop/mat/frame/typography/attribution
                                  preview
    LocationSearch.tsx           Floating debounced search with keyboard nav
    LocationPanel.tsx            Location accordion: summary + inline search
    StyleSelector.tsx            Map type + curated theme picker
    ColorControls.tsx            8-color palette editor
    EffectsControls.tsx          Map filter presets + grain intensity
    LayerControls.tsx            Layer visibility + terrain toggle
    TypographyControls.tsx       Font pair, title/subtitle/quote, alignment,
                                  text color, size, spacing
    PosterSettingsControls.tsx   Overlay style (framed/floating), aspect
                                  ratio presets (Print/Social/Wallpaper),
                                  orientation, padding, matting, frame
                                  (the "Layout" accordion)
    MarkerControls.tsx           Marker visibility, style, color
    RouteControls.tsx            Waypoint search/list + route styling
    SettingsControls.tsx         Export resolution, attribution toggle, reset
    CurrentSettingsSummary.tsx   Live summary card above the download button
    DownloadBar.tsx              Persistent export trigger
    ControlPanel.tsx             Accordion assembly (desktop sidebar /
                                  mobile bottom sheet)
    EditorTopBar.tsx
  ui/                           Slider, Toggle, ColorField, SegmentedControl,
                                Accordion, ControlSection — shared primitives

lib/
  store.ts                     Centralized Zustand editor state
  types.ts                     Shared TypeScript types
  mapStyles.ts                 Style construction: schema-based recoloring
                                (background/land/water/parks/major+minor
                                roads/buildings/borders/labels), the
                                minzoom fix that keeps buildings and detail
                                roads visible at poster zoom, terrain, and
                                route layers, all baked into one style
                                JSON per update
  aspectRatioPresets.ts        Print/Social/Wallpaper layout presets (id,
                                ratio or literal fixedPx, orientation lock)
  export.ts                    Poster layout math (framed + floating) +
                                canvas compositor
  mapFilters.ts                 Shared CSS/canvas filter definitions
  grain.ts                      Procedural film-grain texture (preview canvas
                                data-URL + export canvas pattern)
  fontPairs.ts                  Curated font-pair definitions
  geocode.ts, useLocationSearch.ts   Search fetch + shared debounce hook
  useExportPoster.ts             Shared export hook (used by DownloadBar)
  mapContext.tsx                 React context sharing the map instance
  palettes.ts                    Theme presets, raster-mode palettes
  sampleData.ts                  Real city/theme pairings for landing-page
                                cards (rendered live, see LiveMapThumbnail)
```

---

## 3. Setup

Requires Node.js 18.18+ (Next.js 14 requirement).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). **No environment
variables or API keys are required.** See `.env.example` for optional
upgrades (e.g. swapping in a MapTiler key for higher tile-traffic limits).

### Other commands

```bash
npm run build     # production build
npm run start     # serve the production build
npm run lint      # Next.js lint
```

---

## 4. Deployment (Vercel)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import it in [Vercel](https://vercel.com/new) — it auto-detects Next.js.
   No environment variables are required for the default build.
3. Deploy.

The `/api/geocode` route runs as a Vercel serverless function automatically;
no extra configuration needed.

---

## 5. Data sources (all free, all keyless by default)

| Purpose | Provider | Notes |
|---|---|---|
| Vector map (Cartography themes) | [OpenFreeMap](https://openfreemap.org) | Full planet, OpenMapTiles schema, no key |
| Geocoding / search | [OSM Nominatim](https://nominatim.org) | Public endpoint, proxied server-side with a proper User-Agent per their usage policy |
| Satellite imagery | Esri World Imagery | Public tile endpoint |
| Terrain base map | [OpenTopoMap](https://opentopomap.org) | CC-BY-SA |
| Elevation / hillshade | AWS Open Data Terrain Tiles (Terrarium encoding) | Public S3 bucket, no key |

All attributions render in the map's bottom-right control, and the poster
itself carries a bottom-edge colophon crediting OpenStreetMap, as their
license requires.

---

## 6. Known limitations

- **Style-update rendering in unusual environments.** Theme/color changes
  are applied via MapLibre's standard `setStyle()` mechanism (the same
  primary code path every production MapLibre app uses for style
  switching) and were verified correct at the state level — confirmed via
  `getPaintProperty` readback after every change. In one constrained,
  GPU-less, headless testing sandbox (Chromium forced onto its deprecated
  SwiftShader *software* WebGL fallback), the compositor did not always
  visibly repaint after a pure color-only style update, even though the
  underlying style state was correct and structural changes (e.g.
  switching Cartography → Satellite) repainted correctly every time. This
  pattern is consistent with a software-rendering-fallback quirk rather
  than an application bug, but **please verify theme switching visually
  right after your first deploy** — if a theme click doesn't recolor the
  map in a real browser, that's the first place to look
  (`components/editor/MapCanvas.tsx`, the style-update effect).
- **Nominatim rate limits at scale.** Fine for moderate traffic; for a real
  launch, self-host Nominatim or switch to a commercial geocoder (see the
  comment in `app/api/geocode/route.ts`).
- **OpenFreeMap has no official uptime SLA.** Free and community-run. We
  try positron → bright → liberty in order (all share the same OpenMapTiles
  schema) and fall back to a minimal inline style pointed at the same tile
  source as a last resort, so a single outage doesn't show a broken map —
  but there's still no *guaranteed* fallback if the underlying tile source
  itself is down, only if one style's pre-built JSON is.
- **Vector-tile color/category mapping is schema-based, not hardcoded to
  one style's layer ids.** Layers are sorted into background / land / water
  / parks / buildings / major streets / minor streets / borders / labels by
  their OpenMapTiles `source-layer` (and, for roads, by parsing the
  `class`/`subclass` values out of each layer's filter expression) rather
  than by matching specific layer ids — verified directly against the real
  positron and bright style JSON, so it survives OpenFreeMap re-splitting or
  renaming layers within a style, though not a change to the underlying
  OpenMapTiles schema itself. Buildings and detail-road layers also have
  their `minzoom` cleared to 0 wherever the base style would otherwise hide
  them until a closer navigation-map zoom — this is what fixes a poster
  looking like a flat, feature-less box at typical city-overview framings.
- **Routes draw straight lines between stops**, not road-following
  directions — adding a routing API (e.g. OSRM) is a natural extension but
  was intentionally left out to avoid a third external dependency with
  usage-policy caveats similar to Nominatim's.
- **Export resolution is capped by practical browser limits** for the
  ratio-only presets (2:3, 3:4, 4:5, 1:1), which scale with the chosen
  quality tier. Named formats (A4/A3/Letter, the social presets, the
  wallpaper presets) instead export at their exact literal pixel target
  regardless of quality tier, since the point of picking e.g. "A4" is that
  specific size. True poster-press resolution (300dpi at 24in+) for the
  ratio-only presets would still need a server-side rendering step, out of
  scope for a client-only app.
- **No accounts, saving, or sharing.** Everything lives in browser memory
  for the session.
- **Font stack is system fonts**, not bundled webfonts — keeps the app
  fully functional without a build-time network dependency to a font CDN.
  Swapping in `next/font/google` is a one-file change if you want custom
  webfonts.

---

## 7. Design notes

The visual language (paper/ink/brass palette, serif display type, mono
coordinates) is original and deliberately steered away from generic
SaaS/AI-tool defaults, aiming instead for a cartography/printmaking feel
appropriate to a poster product. See `tailwind.config.ts` for the full
design token set.

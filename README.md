# Stratakort

Production-quality map poster generator

Stratakort is an interactive map poster generator that lets you search anywhere on Earth, customize the cartography, compose a poster, and export it as a print-ready PNG.

Built with Next.js, MapLibre GL JS, Zustand, and free/keyless geographic data sources.

Live: "stratakort.vercel.app"

---

✨ What is Stratakort?

Stratakort turns real-world geographic data into highly customizable map posters.

Search for a location, choose a cartographic style, customize colors and typography, add routes and markers, adjust the composition, and export the finished poster.

The editor is designed around a simple principle:

«The map is the artwork. You control the visual language.»

Everything in the editor is functional — the map, themes, styling controls, routes, terrain, poster composition, preview, and export pipeline are all implemented as real functionality rather than static UI.

---

🚀 Features

🗺️ Live Map Editor

- Interactive MapLibre GL JS map
- Real OpenStreetMap-derived vector tiles
- Full-planet coverage through OpenFreeMap
- Satellite imagery through Esri World Imagery
- Terrain basemap through OpenTopoMap
- Buildings and detailed roads remain visible at poster-level zooms
- Automatic fallback between OpenFreeMap styles
- No API key required for the default configuration

---

🎨 Cartographic Themes

Stratakort includes curated visual themes designed as complete cartographic systems rather than simple background-color swaps.

Current themes include:

- Midnight Blue
- Warm Sand
- Copper
- Emerald
- Soft Slate
- High Contrast Monochrome
- Folio
- Daylight
- Nightdrive
- Pastel Studio
- Blueprint
- Cyberpunk 
- Nordic Frost
- Terracotta 
- Vintage Atlas
- Tokyo Neon
- Sage Forest
- Obsidian Gold
- Sunset Minimal
- Dark Inverted Mono
- Desert Oasis
- Deep Plum
- Sunken Treasure 
- Creamy Matcha
- Cherry Blossom 
- Volcanic Ash
- Royal Navy
- Warm Olive 
- Synthwave
- Rose Gold
- Arctic Ice
- Brutalist Concrete
- Dune Spice
- Lavender Fog
- Mustard Retro 
- Matrix Green
- Biscuit Parchment 
- Electric Violet 
- Subtle Clay
- Abyssal Trench

Every theme controls the visual relationship between:

- Land
- Water
- Major roads
- Minor roads
- Buildings
- Parks
- Borders
- Labels

You can also override the individual colors manually.

---

🖌️ Custom Styling

Fine-tune the map with independent controls for:

- Background
- Land
- Water
- Major streets
- Minor streets
- Buildings
- Parks
- Borders
- Labels

This makes it possible to create a completely custom cartographic style without modifying the underlying map data.

---

🌈 Visual Effects

Six built-in map filters are available:

- Vintage
- Cool
- Warm
- Faded
- Noir

There is also a procedural film-grain effect with adjustable intensity.

The same filter definitions are used by both the live preview and export pipeline to keep the two visually consistent.

---

✍️ Typography

Create poster titles and supporting text with:

- Serif
- Sans-serif
- Display
- Monospace

Typography controls include:

- Title
- Subtitle
- Multi-line quote/tagline
- Left / center / right alignment
- Font size
- Font weight
- Letter spacing
- Automatic or custom text color

Titles use wide-tracked uppercase styling to reinforce the print/cartography aesthetic.

---

📍 Location Search

Search anywhere on Earth using OpenStreetMap Nominatim.

The search system includes:

- Debounced requests
- Keyboard navigation
- Empty states
- Error handling
- Server-side proxying
- Reusable search logic

The same search infrastructure powers:

- Floating map search
- Location panel
- Route waypoint selection

---

🧭 Routes

Add two or more locations and Stratakort will draw a connecting route directly into the map style.

Route controls include:

- Multiple waypoints
- Route color
- Route weight
- Solid or dashed styling

Routes are rendered as part of the MapLibre style, meaning they appear in both the live editor and exported poster.

«Routes currently connect stops using straight line segments rather than road-following directions.»

---

⛰️ Terrain & Elevation

Stratakort supports optional real elevation shading using AWS Open Data terrain tiles.

The terrain layer can be enabled independently of the selected basemap.

This allows posters to incorporate actual geographic relief rather than simulated gradients.

---

🖼️ Poster Composition

Choose between two poster layouts:

Framed

- Matted map crop
- Dedicated title area
- Optional frame
- Configurable matting

Floating

- Full-bleed map
- Typography floating over the lower edge
- Gradient scrim behind text

Additional controls include:

- Edge padding
- Orientation
- Frame style
- Matting
- Custom mat color

Frame options:

- None
- Line
- Double

Matting options:

- Auto
- White
- Black
- Custom

---

📐 Aspect Ratios

Stratakort includes presets across three categories.

Print

- 2:3
- 3:4
- 4:5
- 1:1
- A4
- A3
- Letter

Social

- LinkedIn Banner
- YouTube Banner
- YouTube Thumbnail
- Instagram Square
- Instagram Story
- Reddit Banner

Wallpaper

- Desktop 4K
- UltraWide
- iPhone
- Galaxy

Orientation can be changed where the selected format does not impose a fixed orientation.

---

🖨️ High-Resolution PNG Export

The export pipeline is designed to render the poster rather than simply screenshot the browser viewport.

Export includes:

- Map rendering
- Crop
- Matting
- Frame
- Marker
- Typography
- Attribution
- Visual filters
- Film grain

For supported quality tiers, the map is temporarily rendered at the target resolution before being composited onto an off-DOM canvas.

The map is then restored to its original state without disrupting the editor.

---

👀 Pixel-Accurate Preview

The editor preview and PNG export share the same poster layout calculations.

The "computePosterLayout" system determines:

- Crop
- Matting
- Frame
- Text positioning
- Attribution placement

This minimizes discrepancies between what appears in the editor and what is exported.

---

🏗️ Tech Stack

Technology| Purpose
Next.js| Application framework
React| UI
TypeScript| Type safety
MapLibre GL JS| Interactive maps
Zustand| Editor state
Tailwind CSS| Styling
HTML Canvas| Poster composition & export
OpenFreeMap| Vector map tiles
OpenStreetMap| Geographic data
Nominatim| Geocoding/search
Esri World Imagery| Satellite imagery
OpenTopoMap| Terrain basemap
AWS Open Data| Elevation/terrain tiles
Vercel| Deployment

---

## 📁 Project Structure

```text
.
├── app/
│   ├── api/
│   │   └── geocode/
│   │       └── route.ts              # Server-side Nominatim geocoding proxy
│   ├── create/
│   │   └── page.tsx                  # Interactive map poster editor route
│   ├── globals.css                   # Tailwind imports & global style declarations
│   ├── layout.tsx                    # Root application layout wrapper
│   └── page.tsx                      # Product landing page
│
├── components/
│   ├── editor/                       # Map customization & layout controls
│   │   ├── ColorControls.tsx         # 8-color palette editor
│   │   ├── ControlPanel.tsx          # Desktop sidebar & mobile sheet accordion assembly
│   │   ├── CurrentSettingsSummary.tsx# Live configuration summary card above export
│   │   ├── DownloadBar.tsx           # Persistent export action bar & trigger
│   │   ├── EditorCanvas.tsx          # Viewport wrapper & gesture boundary
│   │   ├── EditorTopBar.tsx          # Header bar for the editor interface
│   │   ├── EffectsControls.tsx       # Map filter presets & grain intensity adjustment
│   │   ├── LayerControls.tsx         # Feature layer visibility & 3D terrain toggles
│   │   ├── LocationPanel.tsx         # Location accordion with inline search integration
│   │   ├── LocationSearch.tsx        # Floating debounced location search with keyboard nav
│   │   ├── MapCanvas.tsx             # MapLibre lifecycle, style compilation, & live filters
│   │   ├── MapEditor.tsx             # Top-level composition shell for the editor
│   │   ├── MarkerControls.tsx        # Pin visibility, custom marker styling, & color
│   │   ├── PosterOverlay.tsx         # Real-time preview overlay (frame, mat, typography)
│   │   ├── PosterSettingsControls.tsx# Frame layout, aspect ratio, padding, & matting
│   │   ├── RouteControls.tsx         # Waypoint search list & route line path styling
│   │   ├── SettingsControls.tsx      # Output resolution, attributions, & state reset
│   │   ├── StyleSelector.tsx         # Map provider type & curated base theme picker
│   │   └── TypographyControls.tsx    # Font pairs, copy, alignment, sizing, & spacing
│   │
│   ├── landing/                      # Landing page sections & preview components
│   │   ├── FAQ.tsx                   # Frequently asked questions accordion
│   │   ├── Features.tsx              # Core features highlight grid
│   │   ├── Footer.tsx                # Site footer
│   │   ├── Gallery.tsx               # Curated poster showcase
│   │   ├── Hero.tsx                  # Hero banner with primary editor CTA
│   │   ├── Navbar.tsx                # Main navigation header
│   │   └── PosterMock.tsx            # Live-rendered sample poster card container
│   │
│   └── ui/                           # Reusable atomic UI components
│       ├── Accordion.tsx
│       ├── ColorField.tsx
│       ├── ControlSection.tsx
│       ├── SegmentedControl.tsx
│       ├── Slider.tsx
│       └── Toggle.tsx
│
└── lib/                              # Application state, rendering logic, & utilities
    ├── aspectRatioPresets.ts         # Aspect ratio configurations (Print/Social/Wallpaper)
    ├── export.ts                     # Canvas compositor & high-resolution poster exporter
    ├── fontPairs.ts                  # Typography pairings & font loaders
    ├── geocode.ts                    # Geocoding fetch utilities
    ├── grain.ts                      # Procedural film-grain generator (data-URL & pattern)
    ├── mapContext.tsx                # React Context holding the shared MapLibre instance
    ├── mapFilters.ts                 # Shared CSS and Canvas filter definitions
    ├── mapStyles.ts                  # Schema-based recoloring & minzoom fix compiler
    ├── palettes.ts                   # Curated theme presets & raster palettes
    ├── sampleData.ts                 # Sample city/theme pairings for landing card previews
    ├── store.ts                      # Centralized Zustand editor state management
    ├── types.ts                      # TypeScript interfaces & domain types
    ├── useExportPoster.ts            # Hook orchestrating high-res export generation
    └── useLocationSearch.ts          # Shared debounced geocoding hook
|```

---

🔧 Getting Started

Requirements

- Node.js 18.18+
- npm

Installation

git clone <your-repository-url>
cd stratakort

npm install

Development

npm run dev

Open:

http://localhost:3000

No environment variables or API keys are required for the default configuration.

---

📦 Available Scripts

npm run dev

Starts the development server.

npm run build

Creates a production build.

npm run start

Runs the production build.

npm run lint

Runs the project's linting checks.

---

☁️ Deployment

Stratakort is designed to deploy directly to Vercel.

Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into Vercel.
3. Vercel automatically detects the Next.js application.
4. Deploy.

The "/api/geocode" endpoint runs automatically as a Vercel serverless function.

The default application does not require environment variables or API keys.

---

🌍 Data Sources & Attribution

Stratakort uses openly available geographic and map resources.

Purpose| Provider
Vector cartography| OpenFreeMap
Geographic data| OpenStreetMap
Geocoding| OpenStreetMap Nominatim
Satellite imagery| Esri World Imagery
Terrain basemap| OpenTopoMap
Elevation data| AWS Open Data

Map attribution is displayed through the map interface, and exported posters include an attribution colophon crediting OpenStreetMap and Stratakort.

Please review the current terms and usage policies of each upstream provider before operating the application at significant scale.

---

⚙️ Architecture Highlights

Schema-Based Map Styling

Map styling is not tied to a single hardcoded style.

"mapStyles.ts" analyzes OpenMapTiles source layers and categorizes them into functional groups such as:

background
land
water
parks
buildings
major streets
minor streets
borders
labels

This allows the palette system to recolor the map while remaining resilient to layer IDs changing within compatible OpenMapTiles styles.

Road classes are additionally interpreted from their style filter expressions.

---

Poster Rendering Pipeline

The application separates the map renderer from the poster compositor.

Conceptually:

MapLibre
   │
   ▼
Map Render Surface
   │
   ▼
Poster Layout
   │
   ├── Crop
   ├── Matting
   ├── Frame
   ├── Marker
   ├── Typography
   ├── Filters
   ├── Grain
   └── Attribution
   │
   ▼
Canvas
   │
   ▼
PNG

This architecture allows the interactive map and final poster to share the same visual configuration while keeping export independent from the DOM layout.

---

🧪 Known Limitations

Map Style Repainting

Theme changes use MapLibre's standard "setStyle()" mechanism.

The application's state and MapLibre style state update correctly, but certain constrained GPU-less/headless environments using software WebGL can fail to visibly repaint after color-only style changes.

Structural style changes and basemap changes repaint correctly.

If theme switching behaves unexpectedly after deployment, "components/editor/MapCanvas.tsx" is the first place to investigate.

---

Nominatim Scaling

The public Nominatim endpoint is suitable for moderate usage but is not intended to serve unrestricted high-volume production traffic.

For a larger deployment, consider:

- Self-hosting Nominatim
- Using a dedicated geocoding provider
- Adding stronger caching/rate limiting

---

OpenFreeMap Availability

OpenFreeMap is free and does not provide the same SLA as a commercial tile provider.

Stratakort attempts multiple compatible OpenFreeMap styles before falling back to a minimal inline style.

However, all of those approaches ultimately depend on the underlying tile infrastructure being available.

---

Routing

Routes currently use straight line segments between searched stops.

They are not road-following navigation routes.

A future routing implementation could integrate a service such as OSRM while keeping the existing route styling system.

---

Export Resolution

Named formats such as A4, A3, Letter, social formats, and wallpaper formats use their defined pixel dimensions.

Ratio-only presets scale according to the selected quality tier and remain subject to browser canvas limits.

Very large print-press output, such as a 24-inch poster at true 300 DPI, would be better handled through server-side rendering.

---

Fonts

The default font system uses local/system fonts rather than a remotely hosted webfont provider.

This keeps the application functional without introducing a build-time dependency on a font CDN.

Custom webfonts can be added later using Next.js font tooling.

---

Persistence

Stratakort currently has:

- No accounts
- No database
- No cloud project storage
- No saved designs
- No collaboration
- No sharing system

Editor state exists in browser memory for the current session.

---

🎯 Design Philosophy

Stratakort intentionally avoids the visual language of generic SaaS dashboards and AI products.

The interface uses a visual vocabulary inspired by:

- Cartography
- Printmaking
- Editorial design
- Paper
- Ink
- Brass
- Serif typography
- Monospaced geographic metadata

The goal is for the map itself to feel like a designed artifact, rather than a conventional navigation map placed inside a poster template.

---

🔮 Potential Future Development

Possible extensions include:

- Road-following routes
- Saved projects
- Shareable poster URLs
- User accounts
- Custom webfonts
- More map themes
- Custom map layer imports
- GPX/KML route imports
- Additional geographic overlays
- Server-side high-resolution rendering
- Commercial tile/geocoding providers
- Batch poster generation
- Poster history/versioning
- Collaborative editing

---

📜 License & Originality

Stratakort is an original implementation inspired by the broader category of interactive map poster editors.

It does not copy the branding, logos, source code, or written copy of another product.

The implementation, interface, styling system, editor architecture, poster composition system, and export pipeline were developed specifically for Stratakort.

Generated posters use Stratakort branding and appropriate geographic-data attribution.

---

👨‍💻 Project

Stratakort
Interactive map poster generator

Live application: "stratakort.vercel.app"

Built with Next.js, MapLibre GL JS, TypeScript, Zustand, Canvas, and open geographic data.

---

Made for maps. Designed like posters.
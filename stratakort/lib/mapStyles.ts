import type { StyleSpecification, LayerSpecification } from "maplibre-gl";
import { LayerVisibility, MapType, Palette, RouteSettings } from "./types";

// OpenFreeMap serves the full OSM-derived planet as vector tiles, free and
// without an API key. We try a short ordered list of their default styles
// — all share the same "openmaptiles" vector source and schema, so if the
// first one is ever slow or briefly unreachable we transparently fall back
// to the next rather than showing a broken/blank map. Every layer below
// gets fully recolored to match the chosen palette regardless of which of
// these ends up loading.
const OPENFREEMAP_STYLE_URLS = [
  "https://tiles.openfreemap.org/styles/positron",
  "https://tiles.openfreemap.org/styles/bright",
  "https://tiles.openfreemap.org/styles/liberty",
];

const STYLE_FETCH_TIMEOUT_MS = 6000;

// Open, keyless elevation tiles (AWS Open Data "Terrarium" encoding),
// used to add optional shaded-relief texture to any style.
export const TERRAIN_SOURCE_ID = "terrain-dem";
const TERRAIN_TILES_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";

export const ROUTE_SOURCE_ID = "user-route";
export const ROUTE_LINE_LAYER_ID = "user-route-line";
export const ROUTE_POINTS_LAYER_ID = "user-route-points";

function attachTerrain(style: StyleSpecification, enabled: boolean): StyleSpecification {
  (style.sources as any)[TERRAIN_SOURCE_ID] = {
    type: "raster-dem",
    tiles: [TERRAIN_TILES_URL],
    tileSize: 256,
    encoding: "terrarium",
    maxzoom: 15,
    attribution: "Elevation: AWS Terrain Tiles / Mapzen",
  };
  (style as any).terrain = enabled
    ? { source: TERRAIN_SOURCE_ID, exaggeration: 1.4 }
    : undefined;
  return style;
}

function routeGeoJSON(route: RouteSettings) {
  const coordinates = route.waypoints.map((w) => [w.longitude, w.latitude]);
  const features: any[] = route.waypoints.map((w) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [w.longitude, w.latitude] },
    properties: { kind: "point", label: w.label },
  }));
  if (coordinates.length >= 2) {
    features.unshift({
      type: "Feature",
      geometry: { type: "LineString", coordinates },
      properties: { kind: "line" },
    });
  }
  return { type: "FeatureCollection" as const, features };
}

/** Bakes the user's custom route (waypoints + styled connecting line) into
 *  any style — vector or raster — so it renders and exports identically
 *  regardless of the underlying map type. */
function attachRoute(style: StyleSpecification, route: RouteSettings): StyleSpecification {
  (style.sources as any)[ROUTE_SOURCE_ID] = {
    type: "geojson",
    data: routeGeoJSON(route),
  };
  const dasharray = route.style === "dashed" ? [2, 1.6] : [1, 0];
  style.layers = [
    ...style.layers,
    {
      id: ROUTE_LINE_LAYER_ID,
      type: "line",
      source: ROUTE_SOURCE_ID,
      filter: ["==", ["get", "kind"], "line"],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": route.color,
        "line-width": route.width,
        "line-dasharray": dasharray,
      },
    } as LayerSpecification,
    {
      id: ROUTE_POINTS_LAYER_ID,
      type: "circle",
      source: ROUTE_SOURCE_ID,
      filter: ["==", ["get", "kind"], "point"],
      paint: {
        "circle-radius": Math.max(3, route.width * 1.4),
        "circle-color": route.color,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 1.5,
      },
    } as LayerSpecification,
  ];
  return style;
}

const styleCache = new Map<string, StyleSpecification>();
let lastGoodStyleUrl: string | null = null;

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** A minimal, fully self-contained style used only if every OpenFreeMap
 *  style JSON endpoint above is unreachable (e.g. a total outage). It still
 *  points at the real OpenFreeMap vector tile source, so roads/water/
 *  buildings/parks still resolve via the schema-based categorization below
 *  — this is a plainer base to recolor, not a "no map" placeholder. */
function minimalFallbackStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      openmaptiles: { type: "vector", url: "https://tiles.openfreemap.org/planet" },
    },
    glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    layers: [
      { id: "background", type: "background", paint: { "background-color": "#EEEEEE" } },
      { id: "landcover", type: "fill", source: "openmaptiles", "source-layer": "landcover", paint: { "fill-color": "#E4E4DA" } },
      { id: "landuse", type: "fill", source: "openmaptiles", "source-layer": "landuse", paint: { "fill-color": "#E4E4DA" } },
      { id: "park", type: "fill", source: "openmaptiles", "source-layer": "park", paint: { "fill-color": "#D6E4D2" } },
      { id: "water", type: "fill", source: "openmaptiles", "source-layer": "water", paint: { "fill-color": "#B9D4E8" } },
      { id: "building", type: "fill", source: "openmaptiles", "source-layer": "building", paint: { "fill-color": "#D8D8D2" } },
      {
        id: "transportation",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        paint: { "line-color": "#B0B0A8", "line-width": 1 },
      },
    ],
  } as StyleSpecification;
}

/** Tries each OpenFreeMap style URL in order (remembering whichever one
 *  last worked, so a persistently-down mirror isn't retried on every
 *  call), falling back to a minimal inline style only if all are
 *  unreachable. */
async function fetchBaseStyle(): Promise<StyleSpecification> {
  const ordered = lastGoodStyleUrl
    ? [lastGoodStyleUrl, ...OPENFREEMAP_STYLE_URLS.filter((u) => u !== lastGoodStyleUrl)]
    : OPENFREEMAP_STYLE_URLS;

  for (const url of ordered) {
    const cached = styleCache.get(url);
    if (cached) {
      lastGoodStyleUrl = url;
      return structuredClone(cached);
    }
    try {
      const res = await fetchWithTimeout(url, STYLE_FETCH_TIMEOUT_MS);
      if (!res.ok) continue;
      const json = (await res.json()) as StyleSpecification;
      styleCache.set(url, json);
      lastGoodStyleUrl = url;
      return structuredClone(json);
    } catch {
      continue; // try the next style in the fallback chain
    }
  }
  return minimalFallbackStyle();
}

export type LayerCategory =
  | "background"
  | "land"
  | "water"
  | "parks"
  | "buildings"
  | "roadsMajor"
  | "roadsMinor"
  | "borders"
  | "labels"
  | "other";

/** Categories that should always render at whatever zoom the poster is
 *  framed at. A poster is a fixed, deliberately chosen view — not a
 *  navigation map the user pans and zooms — so features a general-purpose
 *  basemap hides until you zoom in close (buildings especially, often
 *  gated behind minzoom 12-13 on stock styles) need to render regardless.
 *  Labels are deliberately excluded: their zoom-based reveal is a feature
 *  (it's what keeps a wide framing from being cluttered with every hamlet
 *  name), not a bug, and the labels layer defaults to off anyway. */
const ALWAYS_VISIBLE_CATEGORIES = new Set<LayerCategory>([
  "land",
  "water",
  "parks",
  "buildings",
  "roadsMajor",
  "roadsMinor",
]);

const MAJOR_ROAD_CLASSES = new Set([
  "motorway",
  "trunk",
  "primary",
  "secondary",
  "tertiary",
]);

/** Within "major", motorways/trunk roads (ring roads, highways) get extra
 *  width so they read as the dominant artery — e.g. Hyderabad's Outer Ring
 *  Road standing out from ordinary primary/secondary streets — rather than
 *  every "major" class rendering at the same weight. */
const ARTERIAL_ROAD_CLASSES = new Set(["motorway", "trunk"]);

/** Recursively walks a MapLibre filter expression looking for any
 *  comparison against the OpenMapTiles "class"/"subclass" property — e.g.
 *  `["==",["get","class"],"motorway"]` or
 *  `["match",["get","class"],["primary","secondary"],true,false]` — and
 *  collects every literal class value referenced. This works across
 *  positron / bright / liberty (or any other OpenMapTiles-schema style)
 *  even though their layer ids and splitting differ, because they all
 *  express road class the same way at the data level. */
function extractClassValues(filter: unknown, out: Set<string> = new Set()): Set<string> {
  if (!Array.isArray(filter)) return out;
  const [op, ...rest] = filter;

  const isClassGet =
    Array.isArray(rest[0]) && rest[0][0] === "get" && (rest[0][1] === "class" || rest[0][1] === "subclass");

  if (isClassGet) {
    if (op === "==" || op === "!=") {
      if (typeof rest[1] === "string") out.add(rest[1]);
    } else if (op === "match") {
      // ["match", ["get","class"], label1, output1, label2, output2, ..., fallback]
      for (let i = 1; i < rest.length - 1; i += 2) {
        const label = rest[i];
        if (Array.isArray(label)) label.forEach((v) => typeof v === "string" && out.add(v));
        else if (typeof label === "string") out.add(label);
      }
    }
    return out;
  }

  for (const part of filter) {
    if (Array.isArray(part)) extractClassValues(part, out);
  }
  return out;
}

function roadCategoryFromFilter(filter: unknown): "roadsMajor" | "roadsMinor" {
  const classes = extractClassValues(filter);
  for (const c of classes) {
    if (MAJOR_ROAD_CLASSES.has(c)) return "roadsMajor";
  }
  return "roadsMinor";
}

function isArterialFilter(filter: unknown): boolean {
  const classes = extractClassValues(filter);
  if (classes.size === 0) return false;
  // Require every extracted class to be motorway/trunk, not just "any of
  // them" — some styles (positron included) group trunk into the same
  // layer as ordinary primary/secondary/tertiary roads, and an "any"
  // check would wrongly widen every plain major street along with it.
  for (const c of classes) {
    if (!ARTERIAL_ROAD_CLASSES.has(c)) return false;
  }
  return true;
}

/** Builds a zoom-interpolated line-width expression from [zoom, width, zoom,
 *  width, ...] stops, pre-scaled by `widthScale`. Kept as plain multiplied
 *  numbers (rather than a nested MapLibre `["*", ...]` expression) so the
 *  resulting style JSON is simple and easy to inspect/debug. */
function buildZoomWidth(stops: number[], widthScale: number): unknown {
  const scaled = stops.map((v, i) => (i % 2 === 1 ? v * widthScale : v));
  return ["interpolate", ["linear"], ["zoom"], ...scaled];
}

export function categorize(
  layer: Pick<LayerSpecification, "id" | "type"> & { "source-layer"?: string; filter?: unknown }
): LayerCategory {
  const sourceLayer = layer["source-layer"] ?? "";
  const id = layer.id.toLowerCase();

  if (layer.type === "background") return "background";

  // Trust the authoritative OpenMapTiles source-layer name first. This
  // matters: layers like "water_name" or "highway_name_motorway" are TEXT
  // LABELS (source-layer transportation_name/water_name) whose ids happen
  // to contain "water"/"highway" — a substring-first check would wrongly
  // sort them into the water/roads fill-and-line categories instead of
  // labels, leaving them uncolored (and illegible on dark styles).
  switch (sourceLayer) {
    case "park":
      return "parks";
    case "water":
    case "waterway":
      return "water";
    case "building":
      return "buildings";
    case "landcover":
    case "landuse":
      return "land";
    case "boundary":
      return "borders";
    case "transportation":
    case "aeroway":
      return roadCategoryFromFilter(layer.filter);
    case "place":
    case "poi":
    case "housenumber":
    case "transportation_name":
    case "water_name":
    case "aerodrome_label":
      return "labels";
    default:
      break;
  }

  // Fallback heuristics for layers without a recognized source-layer
  // (custom layers, or generic ids). Symbol type is checked first since
  // it's a strong, unambiguous signal that a layer renders text.
  if (layer.type === "symbol") return "labels";
  if (id.includes("park")) return "parks";
  if (id.includes("water")) return "water";
  if (id.includes("building")) return "buildings";
  if (id.includes("boundary")) return "borders";
  if (
    id.includes("road") ||
    id.includes("bridge") ||
    id.includes("tunnel") ||
    id.includes("street") ||
    id.includes("highway")
  )
    return roadCategoryFromFilter(layer.filter);
  if (id.includes("label")) return "labels";
  return "other";
}

function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function paintForCategory(
  category: LayerCategory,
  layerType: string,
  palette: Palette,
  filter: unknown,
  widthScale: number
): Record<string, unknown> {
  switch (category) {
    case "background":
      return { "background-color": palette.background };
    case "land":
      return layerType === "fill" ? { "fill-color": palette.land } : {};
    case "water":
      if (layerType === "fill") return { "fill-color": palette.water };
      if (layerType === "line") return { "line-color": palette.water };
      return {};
    case "parks":
      return layerType === "fill" ? { "fill-color": palette.parks } : {};
    case "buildings":
      if (layerType === "fill")
        return { "fill-color": palette.buildings, "fill-outline-color": withAlpha(palette.buildings, 0.4) };
      if (layerType === "fill-extrusion")
        return { "fill-extrusion-color": palette.buildings, "fill-extrusion-opacity": 0.9 };
      return {};
    case "roadsMajor": {
      if (layerType === "line") {
        // Ring roads/motorways read as the dominant artery; primary/
        // secondary/tertiary stay clearly "major" but a step down —
        // this is what makes something like Hyderabad's Outer Ring Road
        // stand out the way it does on a well-made reference map instead
        // of blending into every other major road at the same weight.
        const stops = isArterialFilter(filter)
          ? [7, 1.0, 9, 1.6, 11, 2.4, 13, 3.6, 16, 6.5]
          : [7, 0.5, 9, 0.9, 11, 1.4, 13, 2.2, 16, 4.2];
        return { "line-color": palette.roadsMajor, "line-width": buildZoomWidth(stops, widthScale) };
      }
      if (layerType === "fill") return { "fill-color": palette.roadsMajor };
      return {};
    }
    case "roadsMinor": {
      if (layerType === "line") {
        // Deliberately thin and low-weight — minor streets should read as
        // a fine, sharp mesh in the background, not compete with major
        // roads for attention or turn into a muddy tangle at city-wide zoom.
        const stops = [7, 0.15, 9, 0.3, 11, 0.55, 13, 0.95, 16, 1.8];
        return { "line-color": palette.roadsMinor, "line-width": buildZoomWidth(stops, widthScale) };
      }
      if (layerType === "fill") return { "fill-color": palette.roadsMinor };
      return {};
    }
    case "borders":
      return layerType === "line"
        ? { "line-color": palette.borders, "line-width": buildZoomWidth([7, 0.5, 12, 1, 16, 1.6], widthScale), "line-dasharray": [2, 1.5] }
        : {};
    case "labels":
      return layerType === "symbol"
        ? {
            "text-color": palette.labels,
            "text-halo-color": withAlpha(palette.background, 0.85),
            "text-halo-width": 1.2,
          }
        : {};
    default:
      return {};
  }
}

function visibilityForCategory(
  category: LayerCategory,
  layers: LayerVisibility
): "visible" | "none" | undefined {
  switch (category) {
    case "water":
      return layers.water ? "visible" : "none";
    case "parks":
      return layers.parks ? "visible" : "none";
    case "buildings":
      return layers.buildings ? "visible" : "none";
    case "roadsMajor":
    case "roadsMinor":
      return layers.roads ? "visible" : "none";
    case "borders":
      return layers.borders ? "visible" : "none";
    case "labels":
      return layers.labels ? "visible" : "none";
    default:
      return undefined;
  }
}

export async function buildVectorStyle(
  palette: Palette,
  layers: LayerVisibility,
  route: RouteSettings,
  widthScale = 1
): Promise<StyleSpecification> {
  const base = await fetchBaseStyle();

  base.layers = base.layers.map((layer) => {
    const next: LayerSpecification = structuredClone(layer);
    const sourceLayer = "source-layer" in layer ? (layer as any)["source-layer"] : undefined;
    const filter = "filter" in layer ? (layer as any).filter : undefined;
    const category = categorize({ id: layer.id, type: layer.type, "source-layer": sourceLayer, filter });
    const paint = paintForCategory(category, layer.type, palette, filter, widthScale);
    const visibility = visibilityForCategory(category, layers);

    if (Object.keys(paint).length) {
      (next as any).paint = { ...(next as any).paint, ...paint };
    }
    if (visibility) {
      (next as any).layout = { ...(next as any).layout, visibility };
    }
    // The actual "fix broken rendering" step: stock styles gate buildings
    // (and some minor/rail detail) behind a minzoom well above a typical
    // poster framing, which is what makes an out-of-the-box map look like
    // a flat, feature-less box at city-overview zooms. Since we've already
    // recolored this layer as one of our deliberate poster categories, it
    // should render at any zoom rather than only once the user zooms in
    // close.
    if (ALWAYS_VISIBLE_CATEGORIES.has(category) && typeof (next as any).minzoom === "number") {
      (next as any).minzoom = 0;
    }
    return next;
  });

  base.glyphs = base.glyphs ?? "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf";
  return attachRoute(attachTerrain(base, layers.terrain), route);
}

/** Raster styles (satellite / terrain) — free tile sources, no API key. */
export function buildRasterStyle(
  mapType: "satellite" | "terrain",
  terrainEnabled: boolean,
  route: RouteSettings
): StyleSpecification {
  const base: StyleSpecification =
    mapType === "satellite"
      ? ({
          version: 8,
          sources: {
            satellite: {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              ],
              tileSize: 256,
              maxzoom: 19,
              attribution:
                "Imagery &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community",
            },
          },
          layers: [
            { id: "background", type: "background", paint: { "background-color": "#111" } },
            { id: "satellite", type: "raster", source: "satellite" },
          ],
        } as StyleSpecification)
      : ({
          version: 8,
          sources: {
            topo: {
              type: "raster",
              tiles: ["https://a.tile.opentopomap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              maxzoom: 17,
              attribution:
                "Map data: &copy; OpenStreetMap contributors, SRTM | Style: OpenTopoMap (CC-BY-SA)",
            },
          },
          layers: [
            { id: "background", type: "background", paint: { "background-color": "#EFE7D8" } },
            { id: "topo", type: "raster", source: "topo" },
          ],
        } as StyleSpecification);

  return attachRoute(attachTerrain(base, terrainEnabled), route);
}

export async function buildStyleForEditor(
  mapType: MapType,
  palette: Palette,
  layers: LayerVisibility,
  route: RouteSettings,
  widthScale = 1
): Promise<StyleSpecification> {
  if (mapType === "satellite" || mapType === "terrain") {
    return buildRasterStyle(mapType, layers.terrain, route);
  }
  return buildVectorStyle(palette, layers, route, widthScale);
}

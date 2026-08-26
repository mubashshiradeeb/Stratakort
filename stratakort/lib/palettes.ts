import { MapType, Palette, ThemeId } from "./types";

/**
 * Six curated cartography themes. Each is a deliberate, cohesive color
 * story (not just a background swap) — tuned so water/roads/buildings read
 * clearly against the background while staying in the same tonal family.
 * Major and minor streets get distinct tones so the road hierarchy reads
 * at a glance, the way an engraved city map does.
 */
export const THEME_PRESETS: Record<ThemeId, Palette> = {
  midnightBlue: {
    background: "#10152B",
    land: "#1B2444",
    water: "#0A0E1F",
    roadsMajor: "#C7CEDE",
    roadsMinor: "#414A63",
    buildings: "#2A3560",
    parks: "#1E3038",
    borders: "#9AA5C4",
    labels: "#EDEFF7",
  },
  warmSand: {
    background: "#F3E9D7",
    land: "#F3E9D7",
    water: "#B7C2C2",
    roadsMajor: "#C68B5C",
    roadsMinor: "#B7A47E",
    buildings: "#E4D0AE",
    parks: "#D8CBA0",
    borders: "#A97C50",
    labels: "#493826",
  },
  copper: {
    background: "#251C16",
    land: "#2D2319",
    water: "#123230",
    roadsMajor: "#C56A3F",
    roadsMinor: "#8A6142",
    buildings: "#4B3726",
    parks: "#354139",
    borders: "#B87333",
    labels: "#F0E2D4",
  },
  emerald: {
    background: "#0E2B22",
    land: "#123B2F",
    water: "#1E5346",
    roadsMajor: "#D4AF37",
    roadsMinor: "#6E8F73",
    buildings: "#1B4536",
    parks: "#2D5D49",
    borders: "#D4AF37",
    labels: "#F2E8C9",
  },
  monochrome: {
    background: "#FFFFFF",
    land: "#FFFFFF",
    water: "#1A1A1A",
    roadsMajor: "#000000",
    roadsMinor: "#7A7A7A",
    buildings: "#E9E9E9",
    parks: "#F3F3F3",
    borders: "#000000",
    labels: "#000000",
  },
  softSlate: {
    background: "#DDE1E4",
    land: "#E7E9EA",
    water: "#93A3AC",
    roadsMajor: "#43505A",
    roadsMinor: "#8D98A0",
    buildings: "#C7CCCF",
    parks: "#B7C2BB",
    borders: "#5D6B74",
    labels: "#26313A",
  },
  // Warm paper canvas with the built-up city rendered as a dark charcoal
  // silhouette — inverted from most of the other themes, where "land"
  // reads close to the background. Accent is a muted plum rather than the
  // more obvious terracotta, so it doesn't collide with Warm Sand.
  folio: {
    background: "#F1EAE0",
    land: "#2B2E33",
    water: "#2E6FE0",
    roadsMajor: "#6B4E8C",
    roadsMinor: "#8F8A82",
    buildings: "#383C42",
    parks: "#748C6B",
    borders: "#B5A692",
    labels: "#211D18",
  },
  // Clean, bright wayfinding palette: light neutral land, pale sky water,
  // near-white minor streets that rely on width rather than contrast, and
  // an amber/gold highway hierarchy for the primary arteries.
  daylight: {
    background: "#F7F7F5",
    land: "#EAEAE7",
    water: "#9CC9F0",
    roadsMajor: "#F5A623",
    roadsMinor: "#FFFFFF",
    buildings: "#DDD9D2",
    parks: "#C5E1B8",
    borders: "#C9C9C6",
    labels: "#3C4043",
  },
  // Daylight's nighttime counterpart — midnight land, deep navy water,
  // minor streets pushed low-contrast on purpose, and the same amber
  // highways carried over so the arterial hierarchy still reads after dark.
  nightdrive: {
    background: "#1A1D21",
    land: "#202429",
    water: "#0E2036",
    roadsMajor: "#FFA83D",
    roadsMinor: "#3A3F47",
    buildings: "#2A2E34",
    parks: "#16281F",
    borders: "#454B54",
    labels: "#ECEDEF",
  },
  // Soft pastel lavender/blush land against teal water, with a warm coral
  // major-road accent so the palette reads as "vibrant pastel" rather than
  // washed out, plus clean cream minor streets.
  pastelStudio: {
    background: "#F7F1F5",
    land: "#F1D9E4",
    water: "#6FCBC0",
    roadsMajor: "#FF9E80",
    roadsMinor: "#FFFBF6",
    buildings: "#E8D5DC",
    parks: "#B9E3C6",
    borders: "#D9C2CC",
    labels: "#3B2E35",
  },
  // Genuinely monochromatic — every layer stays in the blueprint-blue
  // family (distinguished by value, not hue), with bright white/cyan
  // linework standing in for drafting-table chalk or ink.
  blueprint: {
    background: "#123A66",
    land: "#153F70",
    water: "#0B2A4D",
    roadsMajor: "#F5FCFF",
    roadsMinor: "#8FD6F2",
    buildings: "#1A4470",
    parks: "#1E4C7D",
    borders: "#CFEFFB",
    labels: "#F5FCFF",
  },
};

export const THEME_LABELS: Record<ThemeId, string> = {
  midnightBlue: "Midnight Blue",
  warmSand: "Warm Sand",
  copper: "Copper",
  emerald: "Emerald",
  monochrome: "High Contrast Mono",
  softSlate: "Soft Slate",
  folio: "Folio",
  daylight: "Daylight",
  nightdrive: "Nightdrive",
  pastelStudio: "Pastel Studio",
  blueprint: "Blueprint",
};

export const THEME_DESCRIPTIONS: Record<ThemeId, string> = {
  midnightBlue: "Deep sapphire night with silver moonlit lines.",
  warmSand: "Sun-bleached parchment with terracotta roads.",
  copper: "Espresso brown with etched copper roads.",
  emerald: "Forest green with gilded accents.",
  monochrome: "Pure black and white, maximum contrast.",
  softSlate: "Cool architectural grey, quiet and precise.",
  folio: "Warm paper canvas, the city inked in charcoal.",
  daylight: "Bright, clean wayfinding — the classic day map.",
  nightdrive: "Daylight after dark, with amber highways.",
  pastelStudio: "Soft lavender and teal, a designer's palette.",
  blueprint: "Drafting-table blue with sharp chalk-white lines.",
};

export const THEME_IDS: ThemeId[] = [
  "midnightBlue",
  "warmSand",
  "copper",
  "emerald",
  "monochrome",
  "softSlate",
  "folio",
  "daylight",
  "nightdrive",
  "pastelStudio",
  "blueprint",
];

/** Satellite/terrain are raster imagery — colors are fixed by the source,
 *  but background/labels still drive the poster mat, marker, and type
 *  contrast, so we keep a sensible default palette for each. Road colors
 *  are unused in raster mode (no vector road layer to tint) but still
 *  populated to satisfy the Palette shape. */
export const RASTER_PALETTES: Record<"satellite" | "terrain", Palette> = {
  satellite: {
    background: "#1A1A1A",
    land: "#1A1A1A",
    water: "#123249",
    roadsMajor: "#E8E4D8",
    roadsMinor: "#B8B2A0",
    buildings: "#E8E4D8",
    parks: "#3F5C3F",
    borders: "#F5F1E6",
    labels: "#F5F1E6",
  },
  terrain: {
    background: "#EFE7D8",
    land: "#EFE7D8",
    water: "#A9C6D6",
    roadsMajor: "#B0562F",
    roadsMinor: "#8C6A4E",
    buildings: "#C9BBA3",
    parks: "#9CB380",
    borders: "#6B5A44",
    labels: "#3A2E1F",
  },
};

export const MAP_TYPE_LABELS: Record<MapType, string> = {
  cartography: "Cartography",
  satellite: "Satellite",
  terrain: "Terrain",
};

export function defaultPaletteForMapType(mapType: MapType, theme: ThemeId): Palette {
  if (mapType === "cartography") return THEME_PRESETS[theme];
  return RASTER_PALETTES[mapType];
}

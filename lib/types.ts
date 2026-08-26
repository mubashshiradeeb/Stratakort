/** Which tile source/rendering pipeline is active. Distinct from Theme,
 *  which is a color palette applied within "cartography" mode. */
export type MapType = "cartography" | "satellite" | "terrain";

/** Curated color themes, applied when mapType === "cartography". Selecting
 *  one bulk-sets the palette; individual swatches remain user-editable
 *  afterward via ColorControls. */
export type ThemeId =
  | "midnightBlue"
  | "warmSand"
  | "copper"
  | "emerald"
  | "monochrome"
  | "softSlate"
  | "folio"
  | "daylight"
  | "nightdrive"
  | "pastelStudio"
  | "blueprint"
  | "cyberpunk"
  | "nordicFrost"
  | "terracotta"
  | "vintageAtlas"
  | "tokyoNeon"
  | "sageForest"
  | "obsidianGold"
  | "sunsetMinimal"
  | "monochromeDark"
  | "desertOasis"
  | "deepPlum"
  | "sunkenTreasure"
  | "creamyMatcha"
  | "cherryBlossom"
  | "volcanicAsh"
  | "royalNavy"
  | "warmOlive"
  | "synthwave"
  | "roseGold"
  | "arcticIce"
  | "brutalistConcrete"
  | "duneSpice"
  | "lavenderFog"
  | "mustardRetro"
  | "matrixGreen"
  | "biscuitParchment"
  | "electricViolet"
  | "subtleClay"
  | "abyssalTrench";
export interface Palette {
  /** Map base / canvas background, visible wherever no feature is drawn. */
  background: string;
  /** Generic landcover/landuse fill (residential tint, wood, grass, sand). */
  land: string;
  /** Water fill (oceans, lakes, rivers). */
  water: string;
  /** Parks, gardens, and other dedicated greenery polygons. */
  parks: string;
  /** Major / wide streets — motorways, trunk, primary, secondary, tertiary. */
  roadsMajor: string;
  /** Minor / inner streets — residential, service, tracks, footpaths. */
  roadsMinor: string;
  /** Building footprints. */
  buildings: string;
  /** Administrative boundary lines. */
  borders: string;
  /** Text labels, marker glyph, and frame line color. */
  labels: string;
}

export interface LayerVisibility {
  roads: boolean;
  buildings: boolean;
  water: boolean;
  parks: boolean;
  borders: boolean;
  labels: boolean;
  terrain: boolean;
}

/** References an id in ASPECT_RATIO_PRESETS (lib/aspectRatioPresets.ts).
 *  Left as an open string (rather than a closed union) because the preset
 *  list is data, not a fixed enum — new formats can be added there without
 *  touching this type. */
export type AspectRatioId = string;

export type Orientation = "portrait" | "landscape";

export type FrameStyle = "none" | "line" | "double";

/** "framed" is the classic matted poster: map cropped inside a border, title
 *  block living in its own strip below. "floating" lets the map bleed to
 *  the edge and floats the title/subtitle/coordinates over its bottom edge
 *  on a soft gradient scrim instead. */
export type OverlayStyle = "framed" | "floating";

export type MarkerStyle = "pin" | "dot" | "crosshair" | "ring";

export type FontPairId = "serif" | "sans" | "display" | "mono";

export type TextAlign = "left" | "center" | "right";

export interface TypographySettings {
  title: string;
  subtitle: string;
  /** A longer dedication / tagline / exact-coordinates line. Wraps to
   *  multiple lines in both the live preview and the export. */
  quote: string;
  showCoordinates: boolean;
  fontPair: FontPairId;
  fontSizeScale: number; // 0.7 - 1.4
  fontWeight: 400 | 500 | 600 | 700;
  letterSpacing: number; // em
  textAlign: TextAlign;
  /** "auto" = computed from the mat color for guaranteed contrast. */
  textColor: string;
}

/** "auto" = derived from palette.background luminance (dark map -> black
 *  mat, light map -> white mat). Otherwise a literal hex or "white"/"black". */
export type MatColorSetting = "auto" | "white" | "black" | (string & {});

export interface PosterSettings {
  aspectRatio: AspectRatioId;
  orientation: Orientation;
  /** Framed (matted, text in its own strip) or floating (full-bleed map,
   *  text overlaid on a gradient scrim). */
  overlayStyle: OverlayStyle;
  padding: number; // 0-100 scale
  frame: FrameStyle;
  matColor: MatColorSetting;
  showMarker: boolean;
  markerStyle: MarkerStyle;
  /** Small colophon line at the very bottom edge of the mat crediting the
   *  map data source (and, honoring OSM's attribution requirement, always
   *  available even if the user hides it for a specific print). */
  showAttribution: boolean;
}

export type MapFilterId = "none" | "vintage" | "cool" | "warm" | "faded" | "noir";

export interface EffectsSettings {
  filter: MapFilterId;
  /** Grain/texture overlay intensity, 0-100. */
  grain: number;
}

export interface RouteWaypoint {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
}

export interface RouteSettings {
  waypoints: RouteWaypoint[];
  color: string;
  width: number;
  style: "solid" | "dashed";
}

export type ExportQuality = "standard" | "high" | "print";

export interface LocationState {
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface EditorState {
  location: LocationState;
  /** Incremented whenever code (e.g. search) wants the map to fly somewhere.
   *  Passive updates from user panning do NOT touch this, which is what
   *  keeps map interaction from fighting with programmatic navigation. */
  flyToToken: number;
  mapType: MapType;
  theme: ThemeId;
  palette: Palette;
  layers: LayerVisibility;
  effects: EffectsSettings;
  typography: TypographySettings;
  poster: PosterSettings;
  route: RouteSettings;
  exportQuality: ExportQuality;

  setLocation: (partial: Partial<LocationState>) => void;
  goToLocation: (partial: Partial<LocationState>) => void;
  setMapType: (type: MapType) => void;
  setTheme: (theme: ThemeId) => void;
  setPaletteColor: (key: keyof Palette, value: string) => void;
  toggleLayer: (key: keyof LayerVisibility) => void;
  setEffects: (partial: Partial<EffectsSettings>) => void;
  setTypography: (partial: Partial<TypographySettings>) => void;
  setPoster: (partial: Partial<PosterSettings>) => void;
  addRouteWaypoint: (wp: Omit<RouteWaypoint, "id">) => void;
  removeRouteWaypoint: (id: string) => void;
  clearRoute: () => void;
  setRouteStyle: (partial: Partial<Pick<RouteSettings, "color" | "width" | "style">>) => void;
  setExportQuality: (quality: ExportQuality) => void;
  resetToDefaults: () => void;
}

export interface GeocodeResult {
  id: string;
  displayName: string;
  shortName: string;
  region: string;
  latitude: number;
  longitude: number;
  type: string;
  importance: number;
}

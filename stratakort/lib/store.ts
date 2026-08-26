import { create } from "zustand";
import { EditorState } from "./types";
import { THEME_PRESETS, RASTER_PALETTES } from "./palettes";
import { DEFAULT_ASPECT_RATIO_ID } from "./aspectRatioPresets";

const DEFAULT_LOCATION = {
  name: "HYDERABAD",
  region: "TELANGANA, INDIA",
  latitude: 17.385,
  longitude: 78.4867,
  zoom: 11.2,
  bearing: 0,
  pitch: 0,
};

const DEFAULT_LAYERS = {
  roads: true,
  buildings: true,
  water: true,
  parks: true,
  borders: false,
  labels: false,
  terrain: false,
};

const DEFAULT_TYPOGRAPHY = {
  title: DEFAULT_LOCATION.name,
  subtitle: DEFAULT_LOCATION.region,
  quote: "",
  showCoordinates: true,
  fontPair: "serif" as const,
  fontSizeScale: 1,
  fontWeight: 600 as const,
  // Generous default tracking so the title reads like "H Y D E R A B A D"
  // out of the box, matching a premium engraved-poster look.
  letterSpacing: 0.32,
  textAlign: "center" as const,
  textColor: "auto",
};

const DEFAULT_POSTER = {
  aspectRatio: DEFAULT_ASPECT_RATIO_ID,
  orientation: "portrait" as const,
  overlayStyle: "framed" as const,
  padding: 42,
  frame: "line" as const,
  matColor: "auto" as const,
  showMarker: true,
  markerStyle: "ring" as const,
  showAttribution: true,
};

const DEFAULT_EFFECTS = {
  filter: "none" as const,
  grain: 0,
};

const DEFAULT_ROUTE = {
  waypoints: [],
  color: "#C9A227",
  width: 3,
  style: "dashed" as const,
};

let waypointCounter = 0;

export const useEditorStore = create<EditorState>((set) => ({
  location: { ...DEFAULT_LOCATION },
  flyToToken: 0,
  mapType: "cartography",
  theme: "warmSand",
  palette: { ...THEME_PRESETS.warmSand },
  layers: { ...DEFAULT_LAYERS },
  effects: { ...DEFAULT_EFFECTS },
  typography: { ...DEFAULT_TYPOGRAPHY },
  poster: { ...DEFAULT_POSTER },
  route: { ...DEFAULT_ROUTE, waypoints: [] },
  exportQuality: "high",

  setLocation: (partial) =>
    set((state) => ({ location: { ...state.location, ...partial } })),

  goToLocation: (partial) =>
    set((state) => ({
      location: { ...state.location, ...partial },
      flyToToken: state.flyToToken + 1,
    })),

  setMapType: (type) =>
    set((state) => ({
      mapType: type,
      palette:
        type === "cartography" ? { ...THEME_PRESETS[state.theme] } : { ...RASTER_PALETTES[type] },
    })),

  setTheme: (theme) =>
    set(() => ({
      theme,
      mapType: "cartography",
      palette: { ...THEME_PRESETS[theme] },
    })),

  setPaletteColor: (key, value) =>
    set((state) => ({ palette: { ...state.palette, [key]: value } })),

  toggleLayer: (key) =>
    set((state) => ({ layers: { ...state.layers, [key]: !state.layers[key] } })),

  setEffects: (partial) =>
    set((state) => ({ effects: { ...state.effects, ...partial } })),

  setTypography: (partial) =>
    set((state) => ({ typography: { ...state.typography, ...partial } })),

  setPoster: (partial) =>
    set((state) => ({ poster: { ...state.poster, ...partial } })),

  addRouteWaypoint: (wp) =>
    set((state) => ({
      route: {
        ...state.route,
        waypoints: [...state.route.waypoints, { ...wp, id: `wp-${++waypointCounter}` }],
      },
    })),

  removeRouteWaypoint: (id) =>
    set((state) => ({
      route: { ...state.route, waypoints: state.route.waypoints.filter((w) => w.id !== id) },
    })),

  clearRoute: () =>
    set((state) => ({ route: { ...state.route, waypoints: [] } })),

  setRouteStyle: (partial) =>
    set((state) => ({ route: { ...state.route, ...partial } })),

  setExportQuality: (quality) => set(() => ({ exportQuality: quality })),

  resetToDefaults: () =>
    set((state) => ({
      location: { ...DEFAULT_LOCATION },
      flyToToken: state.flyToToken + 1,
      mapType: "cartography",
      theme: "warmSand",
      palette: { ...THEME_PRESETS.warmSand },
      layers: { ...DEFAULT_LAYERS },
      effects: { ...DEFAULT_EFFECTS },
      typography: { ...DEFAULT_TYPOGRAPHY },
      poster: { ...DEFAULT_POSTER },
      route: { ...DEFAULT_ROUTE, waypoints: [] },
      exportQuality: "high",
    })),
}));

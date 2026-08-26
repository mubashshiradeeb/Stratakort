import { MapFilterId } from "./types";

export interface MapFilterDef {
  label: string;
  /** Standard CSS filter syntax — applied both as a live CSS `filter` on the
   *  map canvas AND as `ctx.filter` in the export compositor, so preview and
   *  export always match exactly. */
  css: string;
}

export const MAP_FILTERS: Record<MapFilterId, MapFilterDef> = {
  none: { label: "None", css: "none" },
  vintage: {
    label: "Vintage",
    css: "sepia(0.35) saturate(0.85) contrast(1.05) brightness(1.02)",
  },
  cool: {
    label: "Cool",
    css: "hue-rotate(-8deg) saturate(0.85) contrast(1.06) brightness(1.02)",
  },
  warm: {
    label: "Warm",
    css: "hue-rotate(6deg) sepia(0.12) saturate(1.1) contrast(1.04)",
  },
  faded: {
    label: "Faded",
    css: "saturate(0.65) contrast(0.85) brightness(1.08)",
  },
  noir: {
    label: "Noir",
    css: "grayscale(1) contrast(1.18) brightness(0.97)",
  },
};

export const MAP_FILTER_IDS: MapFilterId[] = [
  "none",
  "vintage",
  "cool",
  "warm",
  "faded",
  "noir",
];

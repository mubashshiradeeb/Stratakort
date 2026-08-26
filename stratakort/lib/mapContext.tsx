"use client";

import { createContext, useContext, useRef, MutableRefObject } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";

interface MapRefs {
  mapRef: MutableRefObject<MapLibreMap | null>;
  /** The div MapLibre is bound to — the export flow (useExportPoster)
   *  temporarily resizes this off-screen to render at export resolution. Never read its size for UI
   *  layout; use viewportRef instead. */
  containerRef: MutableRefObject<HTMLDivElement | null>;
  /** The stable, always-on-screen-sized wrapper. Overlays (search, poster
   *  crop guide) size themselves against this so they never glitch when
   *  containerRef is resized for export. */
  viewportRef: MutableRefObject<HTMLDivElement | null>;
  /** True while MapCanvas is mid-rebuild — fetching/applying a new style
   *  after a theme, layer, route, or road-width-scale change. The export
   *  flow waits for this to clear before resizing+capturing, so a rebuild
   *  already in flight when Download is clicked can't land mid-capture and
   *  produce a frame that doesn't match what was on screen at that moment. */
  rebuildingRef: MutableRefObject<boolean>;
  /** The on-screen CSS-pixel width of the map area inside the poster crop
   *  guide (PosterOverlay's own `mapRect.w`), kept fresh every render. The
   *  export flow compares this to the much larger export-resolution map
   *  width to compute a zoom correction — at a fixed zoom, a bigger canvas
   *  simply shows more of the world, so capturing at full export
   *  resolution without compensating reveals extra surrounding area (e.g.
   *  a full ring road) that wasn't inside the crop guide on screen. */
  mapRectWidthRef: MutableRefObject<number | null>;
}

const MapInstanceContext = createContext<MapRefs | null>(null);

export function MapInstanceProvider({ children }: { children: React.ReactNode }) {
  const mapRef = useRef<MapLibreMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const rebuildingRef = useRef(false);
  const mapRectWidthRef = useRef<number | null>(null);
  return (
    <MapInstanceContext.Provider
      value={{ mapRef, containerRef, viewportRef, rebuildingRef, mapRectWidthRef }}
    >
      {children}
    </MapInstanceContext.Provider>
  );
}

export function useMapInstance() {
  const ctx = useContext(MapInstanceContext);
  if (!ctx) throw new Error("useMapInstance must be used within MapInstanceProvider");
  return ctx;
}

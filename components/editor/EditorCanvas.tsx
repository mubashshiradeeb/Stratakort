"use client";

import { useMapInstance } from "@/lib/mapContext";
import { MapCanvas } from "./MapCanvas";
import { PosterOverlay } from "./PosterOverlay";
import { LocationSearch } from "./LocationSearch";

/**
 * Owns `viewportRef` — the stable, always-on-screen-sized box that the
 * poster overlay and search box measure themselves against. MapCanvas's
 * own `containerRef` div lives inside this same box but can be resized
 * off-screen during high-res export without disturbing it.
 */
export function EditorCanvas() {
  const { viewportRef } = useMapInstance();

  return (
    <div
      ref={viewportRef}
      className="relative h-full w-full overflow-hidden bg-paper-dim"
    >
      <MapCanvas />
      <PosterOverlay />
      <LocationSearch />
    </div>
  );
}

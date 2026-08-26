"use client";

import { useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { useEditorStore } from "./store";
import { useMapInstance } from "./mapContext";
import { drawPoster, getPosterPixelSize, downloadCanvas, computePosterLayout, QUALITY_LONG_EDGE } from "./export";
import { getAspectRatioPreset } from "./aspectRatioPresets";

const MAX_WAIT_MS = 9000;

function waitForIdle(map: MapLibreMap): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const timer = setTimeout(finish, MAX_WAIT_MS);
    function finish() {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve();
    }
    map.once("idle", finish);
  });
}

export type ExportStatus = "idle" | "exporting" | "done" | "error";

/** Shared export logic — composites the live map at the chosen resolution
 *  onto an off-DOM canvas and downloads a PNG. Used by the persistent
 *  DownloadBar (and available to any other trigger). */
export function useExportPoster() {
  const { mapRef, containerRef, rebuildingRef, mapRectWidthRef } = useMapInstance();
  const [status, setStatus] = useState<ExportStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function exportPoster() {
    const map = mapRef.current;
    const container = containerRef.current;

    if (!map || !container) {
      setStatus("error");
      setErrorMsg("The map isn't ready yet. Wait a moment and try again.");
      return;
    }

    setStatus("exporting");
    setErrorMsg("");

    // A theme/layer/route/road-width-scale change schedules a style rebuild
    // (see MapCanvas.tsx) that can still be in flight if Download is clicked
    // right after changing a setting. Wait for it to fully settle first —
    // otherwise the style could finish swapping in mid-resize or mid-capture
    // below, producing a frame that doesn't match what was actually on
    // screen when the click happened. Bounded so a stuck flag can never
    // hang the export outright.
    const rebuildWaitStart = Date.now();
    while (rebuildingRef.current && Date.now() - rebuildWaitStart < 2000) {
      await new Promise((r) => setTimeout(r, 30));
    }

    const { poster, typography, palette, location, effects, exportQuality } =
      useEditorStore.getState();
    const longEdge = QUALITY_LONG_EDGE[exportQuality];

    const saved = {
      position: container.style.position,
      top: container.style.top,
      left: container.style.left,
      width: container.style.width,
      height: container.style.height,
      zIndex: container.style.zIndex,
    };
    // The zoom the user was actually looking at on screen — captured before
    // any resize, so it's what we compensate from and restore to afterward.
    const originalZoom = map.getZoom();

    try {
      const { width: posterW, height: posterH } = getPosterPixelSize(
        poster.aspectRatio,
        poster.orientation,
        longEdge
      );
      const { mapRect } = computePosterLayout(posterW, posterH, poster.padding, poster.overlayStyle);
      const captureW = Math.max(64, Math.round(mapRect.w));
      const captureH = Math.max(64, Math.round(mapRect.h));

      // Render the map at full export resolution off-screen (never visible
      // to the user) so the captured pixels are genuinely high-res rather
      // than an upscaled screenshot.
      container.style.position = "fixed";
      container.style.top = "-100000px";
      container.style.left = "-100000px";
      container.style.zIndex = "-1";
      container.style.width = `${captureW}px`;
      container.style.height = `${captureH}px`;
      map.resize();

      // The actual fix: at a fixed zoom, a bigger canvas simply shows more
      // of the world. Without this, capturing at full export resolution
      // (often several times the on-screen crop guide's pixel width)
      // reveals extra surrounding area that wasn't inside that guide —
      // a wider ring road, more coastline, extra islands. Comparing the
      // on-screen map width to the export's map width and shifting zoom by
      // the resulting log2 ratio keeps the same real-world framing the
      // user composed, just rendered at higher resolution.
      const onScreenMapWidth = mapRectWidthRef.current;
      if (onScreenMapWidth && onScreenMapWidth > 0) {
        const zoomDelta = Math.log2(captureW / onScreenMapWidth);
        map.jumpTo({ zoom: originalZoom + zoomDelta });
      }

      await waitForIdle(map);
      // One more frame so the final paint has definitely landed in the buffer.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const mapCanvas = map.getCanvas();
      if (!mapCanvas.width || !mapCanvas.height) {
        throw new Error("The map canvas came back empty.");
      }

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = posterW;
      outputCanvas.height = posterH;
      const ctx = outputCanvas.getContext("2d");
      if (!ctx) throw new Error("This browser can't render a canvas image.");

      drawPoster(ctx, posterW, posterH, mapCanvas, { palette, typography, poster, location, effects });

      const preset = getAspectRatioPreset(poster.aspectRatio);
      const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const formatSlug = preset.lockOrientation
        ? slug(preset.label)
        : `${slug(preset.label)}-${poster.orientation}`;
      const filename = `${slug(typography.title || "map-poster")}-${formatSlug}-${posterW}x${posterH}.png`;
      downloadCanvas(outputCanvas, filename);

      setStatus("done");
      setTimeout(() => setStatus("idle"), 2200);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Export failed. Please try again.");
    } finally {
      container.style.position = saved.position;
      container.style.top = saved.top;
      container.style.left = saved.left;
      container.style.width = saved.width;
      container.style.height = saved.height;
      container.style.zIndex = saved.zIndex;
      requestAnimationFrame(() => {
        const m = mapRef.current;
        if (!m) return;
        m.resize();
        // Undo the export-only zoom shift — otherwise the live map would
        // be left zoomed in (to whatever the last export's resolution
        // required) instead of showing what the user was actually editing.
        m.jumpTo({ zoom: originalZoom });
      });
    }
  }

  return { exportPoster, status, errorMsg };
}

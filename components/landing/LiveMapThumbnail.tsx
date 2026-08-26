"use client";

import { useEffect, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { buildVectorStyle } from "@/lib/mapStyles";
import { Palette, LayerVisibility, RouteSettings } from "@/lib/types";

const THUMBNAIL_LAYERS: LayerVisibility = {
  roads: true,
  buildings: true,
  water: true,
  parks: true,
  borders: false,
  labels: false,
  terrain: false,
};

const EMPTY_ROUTE: RouteSettings = { waypoints: [], color: "#000000", width: 2, style: "solid" };

// Shared across every LiveMapThumbnail on the page (Hero's stacked posters
// and the Gallery grid pull from the same six sample cities) so a given
// city is only ever captured once per page load — every other instance
// reuses the resulting PNG instead of spinning up its own WebGL context.
const captureCache = new Map<string, string>();
const inFlight = new Map<string, Promise<string>>();

async function captureThumbnail(
  latitude: number,
  longitude: number,
  zoom: number,
  palette: Palette,
  cacheKey: string
): Promise<string> {
  const cached = captureCache.get(cacheKey);
  if (cached) return cached;
  const existing = inFlight.get(cacheKey);
  if (existing) return existing;

  const promise = (async () => {
    // Dynamically imported so the (fairly large) MapLibre bundle never
    // ships as part of the initial landing-page load — it's only fetched
    // once the browser actually starts capturing a thumbnail.
    const maplibregl = (await import("maplibre-gl")).default;
    const style = await buildVectorStyle(palette, THUMBNAIL_LAYERS, EMPTY_ROUTE);

    const el = document.createElement("div");
    el.style.width = "640px";
    el.style.height = "640px";
    el.style.position = "fixed";
    el.style.left = "-99999px";
    el.style.top = "-99999px";
    document.body.appendChild(el);

    return new Promise<string>((resolve, reject) => {
      let map: MapLibreMap | null = null;
      let settled = false;
      const cleanup = () => {
        map?.remove();
        el.remove();
      };
      const finish = (fn: () => void) => {
        if (settled) return;
        settled = true;
        try {
          fn();
        } finally {
          cleanup();
        }
      };

      try {
        map = new maplibregl.Map({
          container: el,
          style: style as any,
          center: [longitude, latitude],
          zoom,
          interactive: false,
          attributionControl: false,
          preserveDrawingBuffer: true,
        });
        map.once("idle", () => {
          finish(() => {
            const url = map!.getCanvas().toDataURL("image/png");
            captureCache.set(cacheKey, url);
            resolve(url);
          });
        });
        map.once("error", (e) => {
          finish(() => reject(e.error ?? new Error("Map failed to load")));
        });
      } catch (err) {
        finish(() => reject(err));
      }
    });
  })();

  inFlight.set(cacheKey, promise);
  try {
    return await promise;
  } finally {
    inFlight.delete(cacheKey);
  }
}

export function LiveMapThumbnail({
  latitude,
  longitude,
  zoom,
  palette,
  cacheKey,
  className,
}: {
  latitude: number;
  longitude: number;
  zoom: number;
  palette: Palette;
  cacheKey: string;
  className?: string;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(() => captureCache.get(cacheKey) ?? null);

  useEffect(() => {
    if (dataUrl) return;
    let cancelled = false;
    captureThumbnail(latitude, longitude, zoom, palette, cacheKey)
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        // Leave dataUrl null — the palette's own background color still
        // reads as a (plain) poster while offline/blocked, rather than a
        // broken-image icon.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, dataUrl]);

  return (
    <div className={className} style={{ background: palette.background }}>
      {dataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dataUrl} alt="" className="h-full w-full object-cover" draggable={false} />
      )}
    </div>
  );
}

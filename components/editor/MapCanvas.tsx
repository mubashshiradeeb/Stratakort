"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/lib/store";
import { buildStyleForEditor } from "@/lib/mapStyles";
import { useMapInstance } from "@/lib/mapContext";
import { MAP_FILTERS } from "@/lib/mapFilters";
import { computeRoadWidthScale } from "@/lib/export";
import { RefreshCw, AlertTriangle } from "lucide-react";

export function MapCanvas() {
  const { mapRef, containerRef, rebuildingRef } = useMapInstance();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorDetail, setErrorDetail] = useState<string>("");
  const [retryToken, setRetryToken] = useState(0);

  const initializedStyleRef = useRef(false);
  const prevMapTypeRef = useRef<string | null>(null);
  const updateTokenRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mapType = useEditorStore((s) => s.mapType);
  const palette = useEditorStore((s) => s.palette);
  const layers = useEditorStore((s) => s.layers);
  const route = useEditorStore((s) => s.route);
  const filterId = useEditorStore((s) => s.effects.filter);
  const flyToToken = useEditorStore((s) => s.flyToToken);
  const setLocation = useEditorStore((s) => s.setLocation);
  const posterAspectRatio = useEditorStore((s) => s.poster.aspectRatio);
  const posterOrientation = useEditorStore((s) => s.poster.orientation);
  const exportQuality = useEditorStore((s) => s.exportQuality);
  // Road line-widths are baked into the style as fixed CSS pixels, so they'd
  // otherwise cover a shrinking share of the image as target resolution
  // grows (thin-looking on screen, muddy/thin at a big print). Scaling this
  // from the poster's *current* format+quality means the live style always
  // already matches what download will produce — export just captures
  // whatever's on screen, no separate rescaling step at export time.
  const widthScale = computeRoadWidthScale(posterAspectRatio, posterOrientation, exportQuality);

  function applyCanvasFilter(map: maplibregl.Map, id: keyof typeof MAP_FILTERS) {
    try {
      map.getCanvas().style.filter = MAP_FILTERS[id].css;
    } catch {
      /* canvas not ready yet */
    }
  }

  // --- Create the map once ---
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    const initial = useEditorStore.getState().location;
    const initialMapType = useEditorStore.getState().mapType;
    const initialPalette = useEditorStore.getState().palette;
    const initialLayers = useEditorStore.getState().layers;
    const initialRoute = useEditorStore.getState().route;
    const initialPoster = useEditorStore.getState().poster;
    const initialWidthScale = computeRoadWidthScale(
      initialPoster.aspectRatio,
      initialPoster.orientation,
      useEditorStore.getState().exportQuality
    );

    buildStyleForEditor(initialMapType, initialPalette, initialLayers, initialRoute, initialWidthScale)
      .then((style) => {
        if (cancelled || !containerRef.current) return;

        const map = new maplibregl.Map({
          container: containerRef.current,
          style,
          center: [initial.longitude, initial.latitude],
          zoom: initial.zoom,
          bearing: initial.bearing,
          pitch: initial.pitch,
          attributionControl: false,
          preserveDrawingBuffer: true, // required so we can read pixels for export
          antialias: true,
        });

        map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

        map.on("load", () => {
          if (cancelled) return;
          map.resize(); // Fix: Force MapLibre to update internal canvas size
          applyCanvasFilter(map, useEditorStore.getState().effects.filter);
          setStatus("ready");
        });

        map.on("error", (e) => {
          console.warn("MapLibre error", e?.error?.message);
        });

        map.on("moveend", () => {
          const c = map.getCenter();
          setLocation({
            latitude: c.lat,
            longitude: c.lng,
            zoom: map.getZoom(),
            bearing: map.getBearing(),
            pitch: map.getPitch(),
          });
        });

        mapRef.current = map;
        prevMapTypeRef.current = initialMapType;
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setErrorDetail(err instanceof Error ? err.message : "Failed to load the map");
      });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryToken]);

  // --- Apply style changes (theme, map type, layers, route) ---
  useEffect(() => {
    if (!initializedStyleRef.current) {
      initializedStyleRef.current = true;
      return;
    }
    const map = mapRef.current;
    if (!map) return;

    const mapTypeChanged = prevMapTypeRef.current !== mapType;
    prevMapTypeRef.current = mapType;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const runUpdate = () => {
      const myToken = ++updateTokenRef.current;
      rebuildingRef.current = true;
      if (mapTypeChanged) setStatus("loading");

      buildStyleForEditor(mapType, palette, layers, route, widthScale)
        .then((style) => {
          const m = mapRef.current;
          if (updateTokenRef.current !== myToken || !m) return;
          m.setStyle(style);
          m.once("idle", () => {
            if (updateTokenRef.current !== myToken || !mapRef.current) return;
            applyCanvasFilter(mapRef.current, useEditorStore.getState().effects.filter);
            mapRef.current.triggerRepaint();
            if (mapTypeChanged) setStatus("ready");
            rebuildingRef.current = false;
          });
        })
        .catch((err) => {
          if (updateTokenRef.current !== myToken) return;
          rebuildingRef.current = false;
          if (mapTypeChanged) {
            setStatus("error");
            setErrorDetail(err instanceof Error ? err.message : "Failed to switch map style");
          } else {
            console.warn("Style update failed", err);
          }
        });
    };

    if (mapTypeChanged) {
      runUpdate();
    } else {
      timeoutRef.current = setTimeout(runUpdate, 60);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapType, palette, layers, route, widthScale]);

  // --- Live filter updates (pure CSS, instant) ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    applyCanvasFilter(map, filterId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterId]);

  // --- Fly to a newly searched location ---
  useEffect(() => {
    const map = mapRef.current;
    if (!map || flyToToken === 0) return;
    const loc = useEditorStore.getState().location;
    map.flyTo({
      center: [loc.longitude, loc.latitude],
      zoom: loc.zoom,
      duration: 1400,
      curve: 1.3,
      essential: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyToToken]);

  return (
    <>
      {/* Fix: Guaranteed positioning and dimensions */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 h-full w-full" 
        style={{ position: "absolute" }} 
      />

      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-paper/70 backdrop-blur-[2px]">
          <div className="flex items-center gap-2.5 rounded-sm border border-line bg-paper px-4 py-2.5 shadow-panel">
            <RefreshCw size={14} className="animate-spin text-ink-faint" />
            <span className="text-[12.5px] text-ink-soft">Drawing the map…</span>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-paper p-6">
          <div className="max-w-sm rounded-sm border border-line bg-paper-soft p-6 text-center shadow-panel">
            <AlertTriangle size={20} className="mx-auto mb-3 text-brass" />
            <p className="mb-1 font-display text-[16px] text-ink">The map couldn&rsquo;t load</p>
            <p className="mb-4 text-[13px] leading-relaxed text-ink-soft">
              {errorDetail || "Check your connection and try again."}
            </p>
            <button
              onClick={() => setRetryToken((t) => t + 1)}
              className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2 text-[13px] text-paper transition hover:bg-forest"
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        </div>
      )}
    </>
  );
}
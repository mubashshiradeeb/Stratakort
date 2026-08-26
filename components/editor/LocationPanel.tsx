"use client";

import { useEditorStore } from "@/lib/store";
import { useLocationSearch } from "@/lib/useLocationSearch";
import { estimateZoomForType } from "@/lib/geocode";
import { formatCoordinates } from "@/lib/export";
import { GeocodeResult } from "@/lib/types";
import { Search, MapPin, Loader2, AlertCircle, Compass } from "lucide-react";

export function LocationPanel() {
  const { query, setQuery, results, status, clear } = useLocationSearch();
  const location = useEditorStore((s) => s.location);
  const goToLocation = useEditorStore((s) => s.goToLocation);
  const setTypography = useEditorStore((s) => s.setTypography);

  function selectResult(result: GeocodeResult) {
    goToLocation({
      latitude: result.latitude,
      longitude: result.longitude,
      zoom: estimateZoomForType(result.type),
    });
    setTypography({
      title: result.shortName.toUpperCase(),
      subtitle: result.region.toUpperCase(),
    });
    clear();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-sm border border-line bg-paper-soft px-3.5 py-3">
        <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wide text-ink-faint">
          <Compass size={12} /> Current location
        </div>
        <div className="font-display text-[15px] text-ink">{location.name}</div>
        <div className="text-[12px] text-ink-faint">{location.region}</div>
        <div className="mt-1.5 font-mono text-[11px] text-ink-faint">
          {formatCoordinates(location.latitude, location.longitude)} · zoom {location.zoom.toFixed(1)}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2.5 rounded-sm border border-line bg-paper-soft px-3 py-2.5">
          {status === "loading" ? (
            <Loader2 size={14} className="shrink-0 animate-spin text-ink-faint" />
          ) : (
            <Search size={14} className="shrink-0 text-ink-faint" />
          )}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a new place…"
            className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>

        {status === "error" && (
          <div className="flex items-start gap-2 px-1 py-2 text-[12px] text-ink-soft">
            <AlertCircle size={13} className="mt-0.5 shrink-0 text-brass" />
            <span>Search is unavailable right now.</span>
          </div>
        )}

        {results.length > 0 && (
          <div className="overflow-hidden rounded-sm border border-line">
            {results.map((r, i) => (
              <button
                key={r.id}
                onClick={() => selectResult(r)}
                className={`flex w-full items-start gap-2 px-3 py-2.5 text-left transition hover:bg-paper-soft ${
                  i !== results.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <MapPin size={13} className="mt-0.5 shrink-0 text-brass" />
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] text-ink">{r.shortName}</span>
                  <span className="block truncate text-[11px] text-ink-faint">{r.region}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

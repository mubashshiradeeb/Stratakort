"use client";

import { useEditorStore } from "@/lib/store";
import { useLocationSearch } from "@/lib/useLocationSearch";
import { Slider } from "@/components/ui/Slider";
import { ColorField } from "@/components/ui/ColorField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Search, MapPin, Loader2, X, Route as RouteIcon } from "lucide-react";

export function RouteControls() {
  const route = useEditorStore((s) => s.route);
  const addRouteWaypoint = useEditorStore((s) => s.addRouteWaypoint);
  const removeRouteWaypoint = useEditorStore((s) => s.removeRouteWaypoint);
  const clearRoute = useEditorStore((s) => s.clearRoute);
  const setRouteStyle = useEditorStore((s) => s.setRouteStyle);

  const { query, setQuery, results, status, clear } = useLocationSearch();

  return (
    <div className="space-y-4">
      <p className="text-[11.5px] leading-relaxed text-ink-faint">
        Add two or more stops to draw a connecting route across the poster —
        a trip, a journey, a path only you and someone else would recognize.
      </p>

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
            placeholder="Add a stop…"
            className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>

        {results.length > 0 && (
          <div className="overflow-hidden rounded-sm border border-line">
            {results.map((r, i) => (
              <button
                key={r.id}
                onClick={() => {
                  addRouteWaypoint({
                    label: r.shortName,
                    latitude: r.latitude,
                    longitude: r.longitude,
                  });
                  clear();
                }}
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

      {route.waypoints.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[12.5px] text-ink-soft">
              <RouteIcon size={13} /> {route.waypoints.length} stop
              {route.waypoints.length === 1 ? "" : "s"}
            </span>
            <button
              onClick={clearRoute}
              className="text-[11px] text-ink-faint transition hover:text-ink-soft"
            >
              Clear all
            </button>
          </div>
          <ol className="space-y-1.5">
            {route.waypoints.map((wp, i) => (
              <li
                key={wp.id}
                className="flex items-center justify-between rounded-sm border border-line bg-paper-soft px-3 py-2"
              >
                <span className="flex items-center gap-2 text-[12.5px] text-ink">
                  <span className="font-mono text-[10px] text-ink-faint">{i + 1}</span>
                  {wp.label}
                </span>
                <button
                  onClick={() => removeRouteWaypoint(wp.id)}
                  aria-label={`Remove ${wp.label}`}
                  className="text-ink-faint transition hover:text-ink"
                >
                  <X size={13} />
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      {route.waypoints.length >= 2 && (
        <>
          <ColorField
            label="Route color"
            value={route.color}
            onChange={(hex) => setRouteStyle({ color: hex })}
          />
          <SegmentedControl
            label="Line style"
            value={route.style}
            onChange={(v) => setRouteStyle({ style: v })}
            options={[
              { value: "dashed", label: "Dashed" },
              { value: "solid", label: "Solid" },
            ]}
          />
          <Slider
            label="Line weight"
            value={route.width}
            min={1}
            max={8}
            step={0.5}
            onChange={(v) => setRouteStyle({ width: v })}
          />
        </>
      )}

      {route.waypoints.length === 1 && (
        <p className="rounded-sm bg-paper-dim px-3 py-2 text-[11.5px] text-ink-faint">
          Add one more stop to draw a connecting line.
        </p>
      )}
    </div>
  );
}

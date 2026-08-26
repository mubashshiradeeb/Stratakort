"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/store";
import { THEME_PRESETS, THEME_LABELS, THEME_DESCRIPTIONS, THEME_IDS, MAP_TYPE_LABELS } from "@/lib/palettes";
import { MapType } from "@/lib/types";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Search } from "lucide-react";

const MAP_TYPES: MapType[] = ["cartography", "satellite", "terrain"];

export function StyleSelector() {
  const mapType = useEditorStore((s) => s.mapType);
  const theme = useEditorStore((s) => s.theme);
  const setMapType = useEditorStore((s) => s.setMapType);
  const setTheme = useEditorStore((s) => s.setTheme);
  const [query, setQuery] = useState("");

  const visibleIds = query.trim()
    ? THEME_IDS.filter((id) => THEME_LABELS[id].toLowerCase().includes(query.trim().toLowerCase()))
    : THEME_IDS;

  return (
    <div className="space-y-5">
      <SegmentedControl
        label="Map type"
        value={mapType}
        onChange={setMapType}
        options={MAP_TYPES.map((id) => ({ value: id, label: MAP_TYPE_LABELS[id] }))}
      />

      {mapType === "cartography" ? (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[12.5px] text-ink-soft">Theme</span>
            <span className="text-[11px] text-ink-faint">{THEME_IDS.length} total</span>
          </div>

          <div className="relative mb-2.5">
            <Search
              size={13}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search themes…"
              className="w-full rounded-sm border border-line bg-transparent py-1.5 pl-7 pr-2.5 text-[12px] text-ink placeholder:text-ink-faint focus:border-ink/40 focus:outline-none"
            />
          </div>

          {visibleIds.length === 0 ? (
            <p className="rounded-sm bg-paper-dim px-3 py-2.5 text-[11.5px] text-ink-faint">
              No themes match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {visibleIds.map((id) => {
                const p = THEME_PRESETS[id];
                const active = theme === id;
                return (
                  <button
                    key={id}
                    onClick={() => setTheme(id)}
                    title={THEME_DESCRIPTIONS[id]}
                    className={`group flex flex-col gap-2 rounded-sm border p-2.5 text-left transition ${
                      active ? "border-ink ring-1 ring-ink" : "border-line hover:border-ink/30"
                    }`}
                  >
                    <div
                      className="relative h-12 w-full overflow-hidden rounded-[2px]"
                      style={{ background: p.background }}
                    >
                      <div
                        className="absolute inset-x-0 bottom-0 h-3"
                        style={{ background: p.water, opacity: 0.85 }}
                      />
                      <div
                        className="absolute left-1.5 top-1.5 h-3 w-3 rounded-[1px]"
                        style={{ background: p.buildings }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `linear-gradient(90deg, transparent 19%, ${p.roadsMinor} 19%, ${p.roadsMinor} 22%, transparent 22%, transparent 46%, ${p.roadsMajor} 46%, ${p.roadsMajor} 51%, transparent 51%)`,
                        }}
                      />
                      <div
                        className="absolute bottom-1 right-1.5 h-1 w-5 rounded-full"
                        style={{ background: p.borders, opacity: 0.9 }}
                      />
                    </div>
                    <span className={`text-[12px] font-medium ${active ? "text-ink" : "text-ink-soft"}`}>
                      {THEME_LABELS[id]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <p className="rounded-sm bg-paper-dim px-3 py-2.5 text-[11.5px] leading-relaxed text-ink-faint">
          {mapType === "satellite"
            ? "Real satellite imagery — switch to Cartography for themed, recolorable line art."
            : "Shaded relief imagery — switch to Cartography for themed, recolorable line art."}
        </p>
      )}
    </div>
  );
}

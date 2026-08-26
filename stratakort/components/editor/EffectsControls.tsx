"use client";

import { useEditorStore } from "@/lib/store";
import { Slider } from "@/components/ui/Slider";
import { MAP_FILTERS, MAP_FILTER_IDS } from "@/lib/mapFilters";

export function EffectsControls() {
  const effects = useEditorStore((s) => s.effects);
  const setEffects = useEditorStore((s) => s.setEffects);

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2.5 text-[12.5px] text-ink-soft">Map filter</div>
        <div className="grid grid-cols-3 gap-1.5">
          {MAP_FILTER_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setEffects({ filter: id })}
              className={`rounded-sm border px-2 py-2 text-[11.5px] transition ${
                effects.filter === id
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-soft hover:border-ink/30"
              }`}
              style={effects.filter !== id ? { filter: MAP_FILTERS[id].css } : undefined}
            >
              {MAP_FILTERS[id].label}
            </button>
          ))}
        </div>
      </div>

      <Slider
        label="Grain / texture"
        value={effects.grain}
        min={0}
        max={100}
        displayValue={effects.grain === 0 ? "Off" : `${effects.grain}%`}
        onChange={(v) => setEffects({ grain: v })}
      />
    </div>
  );
}

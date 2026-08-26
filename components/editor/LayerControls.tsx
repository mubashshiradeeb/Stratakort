"use client";

import { useEditorStore } from "@/lib/store";
import { Toggle } from "@/components/ui/Toggle";
import { LayerVisibility } from "@/lib/types";

const FIELDS: { key: keyof LayerVisibility; label: string; rasterAware?: boolean }[] = [
  { key: "roads", label: "Roads" },
  { key: "buildings", label: "Buildings" },
  { key: "water", label: "Water" },
  { key: "parks", label: "Parks" },
  { key: "borders", label: "Borders" },
  { key: "labels", label: "Labels" },
  { key: "terrain", label: "Terrain shading" },
];

export function LayerControls() {
  const layers = useEditorStore((s) => s.layers);
  const toggleLayer = useEditorStore((s) => s.toggleLayer);
  const mapType = useEditorStore((s) => s.mapType);
  const isRaster = mapType !== "cartography";

  return (
    <div className="space-y-1">
      {isRaster && (
        <p className="mb-3 rounded-sm bg-paper-dim px-3 py-2 text-[11.5px] leading-relaxed text-ink-faint">
          Layer visibility applies to vector styles. Terrain shading works on
          any style, including this one.
        </p>
      )}
      {FIELDS.map((field) => (
        <Toggle
          key={field.key}
          label={field.label}
          checked={layers[field.key]}
          disabled={isRaster && field.key !== "terrain"}
          onChange={() => toggleLayer(field.key)}
        />
      ))}
    </div>
  );
}

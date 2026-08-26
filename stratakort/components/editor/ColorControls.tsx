"use client";

import { useEditorStore } from "@/lib/store";
import { ColorField } from "@/components/ui/ColorField";
import { Palette } from "@/lib/types";

const FIELDS: { key: keyof Palette; label: string; mapOnly?: boolean }[] = [
  { key: "background", label: "Background" },
  { key: "land", label: "Land", mapOnly: true },
  { key: "water", label: "Water", mapOnly: true },
  { key: "parks", label: "Parks & greenery", mapOnly: true },
  { key: "roadsMajor", label: "Major streets", mapOnly: true },
  { key: "roadsMinor", label: "Minor streets", mapOnly: true },
  { key: "buildings", label: "Buildings", mapOnly: true },
  { key: "borders", label: "Borders", mapOnly: true },
  { key: "labels", label: "Text & overlays" },
];

export function ColorControls() {
  const palette = useEditorStore((s) => s.palette);
  const setPaletteColor = useEditorStore((s) => s.setPaletteColor);
  const mapType = useEditorStore((s) => s.mapType);
  const isRaster = mapType !== "cartography";

  return (
    <div className="space-y-3">
      {isRaster && (
        <p className="rounded-sm bg-paper-dim px-3 py-2 text-[11.5px] leading-relaxed text-ink-faint">
          Satellite and Terrain use real imagery, so most colors are fixed —
          background and label color still affect the title block and marker.
        </p>
      )}
      {FIELDS.map((field) => (
        <ColorField
          key={field.key}
          label={field.label}
          value={palette[field.key]}
          disabled={isRaster && field.mapOnly}
          onChange={(hex) => setPaletteColor(field.key, hex)}
        />
      ))}
    </div>
  );
}

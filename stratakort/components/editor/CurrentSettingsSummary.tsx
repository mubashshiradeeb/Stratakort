"use client";

import { useEditorStore } from "@/lib/store";
import { THEME_LABELS, MAP_TYPE_LABELS } from "@/lib/palettes";
import { formatCoordinates, getPosterPixelSize } from "@/lib/export";
import { getAspectRatioPreset } from "@/lib/aspectRatioPresets";
import { ExportQuality } from "@/lib/types";

const QUALITY_LONG_EDGE: Record<ExportQuality, number> = {
  standard: 1400,
  high: 2200,
  print: 3300,
};

export function CurrentSettingsSummary() {
  const location = useEditorStore((s) => s.location);
  const mapType = useEditorStore((s) => s.mapType);
  const theme = useEditorStore((s) => s.theme);
  const poster = useEditorStore((s) => s.poster);
  const exportQuality = useEditorStore((s) => s.exportQuality);

  const preset = getAspectRatioPreset(poster.aspectRatio);
  const { width, height } = getPosterPixelSize(
    poster.aspectRatio,
    poster.orientation,
    QUALITY_LONG_EDGE[exportQuality]
  );

  const rows: { label: string; value: string }[] = [
    { label: "Location", value: `${location.name}, ${location.region}` },
    { label: "Theme", value: mapType === "cartography" ? THEME_LABELS[theme] : MAP_TYPE_LABELS[mapType] },
    {
      label: "Poster size",
      value: `${preset.label}${preset.lockOrientation ? "" : ` ${poster.orientation}`} · ${width}×${height}px`,
    },
    { label: "Layout", value: poster.overlayStyle === "floating" ? "Floating overlay" : "Framed" },
    { label: "Marker", value: poster.showMarker ? "1 shown" : "None" },
    { label: "Coordinates", value: formatCoordinates(location.latitude, location.longitude) },
  ];

  return (
    <div className="border-t border-line bg-paper-soft px-5 py-4">
      <div className="eyebrow mb-3">Current settings</div>
      <dl className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-3">
            <dt className="shrink-0 text-[11.5px] text-ink-faint">{row.label}</dt>
            <dd className="truncate text-[12px] text-ink" title={row.value}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

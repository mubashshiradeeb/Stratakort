"use client";

import { useEditorStore } from "@/lib/store";
import { Toggle } from "@/components/ui/Toggle";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ColorField } from "@/components/ui/ColorField";

export function MarkerControls() {
  const poster = useEditorStore((s) => s.poster);
  const palette = useEditorStore((s) => s.palette);
  const setPoster = useEditorStore((s) => s.setPoster);
  const setPaletteColor = useEditorStore((s) => s.setPaletteColor);

  return (
    <div className="space-y-4">
      <Toggle
        label="Show location marker"
        checked={poster.showMarker}
        onChange={(checked) => setPoster({ showMarker: checked })}
      />

      {poster.showMarker && (
        <>
          <SegmentedControl
            label="Marker style"
            value={poster.markerStyle}
            onChange={(v) => setPoster({ markerStyle: v })}
            options={[
              { value: "ring", label: "Ring" },
              { value: "dot", label: "Dot" },
              { value: "pin", label: "Pin" },
              { value: "crosshair", label: "Cross" },
            ]}
          />
          <ColorField
            label="Marker color"
            value={palette.labels}
            onChange={(hex) => setPaletteColor("labels", hex)}
          />
        </>
      )}

      <p className="text-[11px] leading-relaxed text-ink-faint">
        The marker sits at the exact center of the cropped map area. To move
        it, search a new location or pan the map before exporting.
      </p>
    </div>
  );
}

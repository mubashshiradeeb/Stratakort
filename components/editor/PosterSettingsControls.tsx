"use client";

import { useEditorStore } from "@/lib/store";
import { Slider } from "@/components/ui/Slider";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ColorField } from "@/components/ui/ColorField";
import { resolveMatColor } from "@/lib/export";
import {
  PRESET_CATEGORIES,
  PRESET_CATEGORY_LABELS,
  presetsByCategory,
  getAspectRatioPreset,
} from "@/lib/aspectRatioPresets";

type MatMode = "auto" | "white" | "black" | "custom";

export function PosterSettingsControls() {
  const poster = useEditorStore((s) => s.poster);
  const palette = useEditorStore((s) => s.palette);
  const setPoster = useEditorStore((s) => s.setPoster);

  const matMode: MatMode =
    poster.matColor === "auto" || poster.matColor === "white" || poster.matColor === "black"
      ? (poster.matColor as MatMode)
      : "custom";

  const activePreset = getAspectRatioPreset(poster.aspectRatio);

  return (
    <div className="space-y-5">
      <SegmentedControl
        label="Overlay style"
        value={poster.overlayStyle}
        onChange={(v) => setPoster({ overlayStyle: v })}
        options={[
          { value: "framed", label: "Framed" },
          { value: "floating", label: "Floating" },
        ]}
      />
      <p className="-mt-3 text-[11px] leading-relaxed text-ink-faint">
        {poster.overlayStyle === "floating"
          ? "Map bleeds to the edge; title and coordinates float over the bottom on a soft gradient."
          : "Map sits inside a matted border; title and coordinates live in their own strip below it."}
      </p>

      <div className="space-y-4">
        {PRESET_CATEGORIES.map((category) => (
          <div key={category}>
            <span className="mb-2 block text-[12.5px] text-ink-soft">
              {PRESET_CATEGORY_LABELS[category]}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetsByCategory(category).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setPoster({ aspectRatio: preset.id })}
                  title={preset.note}
                  className={`rounded-sm border px-2.5 py-1.5 text-[11.5px] transition ${
                    poster.aspectRatio === preset.id
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink-soft hover:border-ink/30"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="text-[11px] text-ink-faint" title={activePreset.note}>
          {activePreset.label} · {activePreset.note}
        </p>
      </div>

      {activePreset.lockOrientation ? (
        <p className="text-[11.5px] text-ink-faint">
          Orientation is fixed for {activePreset.label} (its shape is already defined by the format).
        </p>
      ) : (
        <SegmentedControl
          label="Orientation"
          value={poster.orientation}
          onChange={(v) => setPoster({ orientation: v })}
          options={[
            { value: "portrait", label: "Portrait" },
            { value: "landscape", label: "Landscape" },
          ]}
        />
      )}

      <Slider
        label={poster.overlayStyle === "floating" ? "Edge margin" : "Edge padding"}
        value={poster.padding}
        min={0}
        max={100}
        onChange={(v) => setPoster({ padding: v })}
      />

      <div>
        <SegmentedControl
          label="Matting"
          value={matMode}
          onChange={(v: MatMode) =>
            setPoster({
              matColor: v === "custom" ? resolveMatColor(poster.matColor, palette.background) : v,
            })
          }
          options={[
            { value: "auto", label: "Auto" },
            { value: "white", label: "White" },
            { value: "black", label: "Black" },
            { value: "custom", label: "Custom" },
          ]}
        />
        {matMode === "custom" && (
          <div className="mt-3">
            <ColorField
              label="Mat color"
              value={resolveMatColor(poster.matColor, palette.background)}
              onChange={(hex) => setPoster({ matColor: hex })}
            />
          </div>
        )}
      </div>

      <SegmentedControl
        label="Frame"
        value={poster.frame}
        onChange={(v) => setPoster({ frame: v })}
        options={[
          { value: "none", label: "None" },
          { value: "line", label: "Line" },
          { value: "double", label: "Double" },
        ]}
      />
    </div>
  );
}

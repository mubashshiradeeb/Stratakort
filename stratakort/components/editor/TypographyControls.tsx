"use client";

import { useEditorStore } from "@/lib/store";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ColorField } from "@/components/ui/ColorField";
import { FONT_PAIRS, FONT_PAIR_IDS } from "@/lib/fontPairs";
import { resolveMatColor, resolveTextColor } from "@/lib/export";

const WEIGHT_OPTIONS = [
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semibold" },
  { value: "700", label: "Bold" },
];

export function TypographyControls() {
  const typography = useEditorStore((s) => s.typography);
  const setTypography = useEditorStore((s) => s.setTypography);
  const palette = useEditorStore((s) => s.palette);
  const poster = useEditorStore((s) => s.poster);

  const matColor = resolveMatColor(poster.matColor, palette.background);
  const resolvedTextColor = resolveTextColor(typography.textColor, matColor);
  const isAutoColor = typography.textColor === "auto";

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2.5 text-[12.5px] text-ink-soft">Font pair</div>
        <div className="grid grid-cols-2 gap-2">
          {FONT_PAIR_IDS.map((id) => {
            const pair = FONT_PAIRS[id];
            const active = typography.fontPair === id;
            return (
              <button
                key={id}
                onClick={() => setTypography({ fontPair: id })}
                title={pair.description}
                className={`flex items-center gap-2.5 rounded-sm border px-2.5 py-2 text-left transition ${
                  active ? "border-ink ring-1 ring-ink" : "border-line hover:border-ink/30"
                }`}
              >
                <span
                  className="text-[18px] leading-none text-ink"
                  style={{ fontFamily: pair.title }}
                >
                  {pair.sample}
                </span>
                <span className={`text-[11.5px] ${active ? "text-ink" : "text-ink-soft"}`}>
                  {pair.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-[12.5px] text-ink-soft">Primary title</span>
        <input
          value={typography.title}
          onChange={(e) => setTypography({ title: e.target.value })}
          maxLength={40}
          placeholder="HYDERABAD"
          className="w-full rounded-sm border border-line bg-paper-soft px-3 py-2 text-[13px] uppercase tracking-wide text-ink outline-none focus:border-ink/30"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-[12.5px] text-ink-soft">Subtitle</span>
        <input
          value={typography.subtitle}
          onChange={(e) => setTypography({ subtitle: e.target.value })}
          maxLength={48}
          placeholder="TELANGANA, INDIA"
          className="w-full rounded-sm border border-line bg-paper-soft px-3 py-2 text-[13px] uppercase tracking-wide text-ink outline-none focus:border-ink/30"
        />
      </label>

      <Toggle
        label="Show coordinates"
        checked={typography.showCoordinates}
        onChange={(checked) => setTypography({ showCoordinates: checked })}
      />

      <label className="block">
        <span className="mb-1.5 block text-[12.5px] text-ink-soft">Custom quote / tagline</span>
        <span className="mb-2 block text-[11px] text-ink-faint">
          A dedication, exact coordinates, or a line only you know.
        </span>
        <textarea
          value={typography.quote}
          onChange={(e) => setTypography({ quote: e.target.value })}
          maxLength={140}
          rows={2}
          placeholder="Where our story began"
          className="w-full resize-none rounded-sm border border-line bg-paper-soft px-3 py-2 text-[13px] italic text-ink outline-none focus:border-ink/30"
        />
      </label>

      <SegmentedControl
        label="Alignment"
        value={typography.textAlign}
        onChange={(v) => setTypography({ textAlign: v })}
        options={[
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ]}
      />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12.5px] text-ink-soft">Text color</span>
          <button
            onClick={() => setTypography({ textColor: "auto" })}
            className={`rounded-sm border px-2 py-0.5 text-[10.5px] transition ${
              isAutoColor ? "border-ink bg-ink text-paper" : "border-line text-ink-faint hover:border-ink/30"
            }`}
          >
            Auto
          </button>
        </div>
        <ColorField
          label="Custom"
          value={resolvedTextColor}
          onChange={(hex) => setTypography({ textColor: hex })}
        />
      </div>

      <SegmentedControl
        label="Title weight"
        value={String(typography.fontWeight)}
        onChange={(v) => setTypography({ fontWeight: Number(v) as 400 | 500 | 600 | 700 })}
        options={WEIGHT_OPTIONS}
      />

      <Slider
        label="Title size"
        value={typography.fontSizeScale}
        min={0.7}
        max={1.4}
        step={0.02}
        displayValue={`${Math.round(typography.fontSizeScale * 100)}%`}
        onChange={(v) => setTypography({ fontSizeScale: v })}
      />

      <Slider
        label="Letter spacing"
        value={typography.letterSpacing}
        min={0}
        max={0.4}
        step={0.01}
        displayValue={typography.letterSpacing.toFixed(2) + "em"}
        onChange={(v) => setTypography({ letterSpacing: v })}
      />
    </div>
  );
}

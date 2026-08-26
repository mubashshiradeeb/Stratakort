"use client";

import { useEditorStore } from "@/lib/store";
import { Toggle } from "@/components/ui/Toggle";
import { RotateCcw } from "lucide-react";
import { ExportQuality } from "@/lib/types";

const QUALITY_OPTIONS: { id: ExportQuality; label: string; hint: string }[] = [
  { id: "standard", label: "Standard", hint: "Screens & sharing" },
  { id: "high", label: "High-res", hint: "Small prints" },
  { id: "print", label: "Print", hint: "18×24in & larger" },
];

export function SettingsControls() {
  const exportQuality = useEditorStore((s) => s.exportQuality);
  const setExportQuality = useEditorStore((s) => s.setExportQuality);
  const poster = useEditorStore((s) => s.poster);
  const setPoster = useEditorStore((s) => s.setPoster);
  const resetToDefaults = useEditorStore((s) => s.resetToDefaults);

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-[12.5px] text-ink-soft">Export resolution</div>
        <div className="grid grid-cols-3 gap-1.5">
          {QUALITY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setExportQuality(opt.id)}
              className={`rounded-sm border px-2 py-2 text-left transition ${
                exportQuality === opt.id
                  ? "border-ink bg-ink text-paper"
                  : "border-line hover:border-ink/30"
              }`}
            >
              <span className="block text-[12px] font-medium">{opt.label}</span>
              <span
                className={`block text-[10px] ${
                  exportQuality === opt.id ? "text-paper/70" : "text-ink-faint"
                }`}
              >
                {opt.hint}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Toggle
          label="Show data attribution"
          checked={poster.showAttribution}
          onChange={(checked) => setPoster({ showAttribution: checked })}
        />
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-faint">
          OpenStreetMap&rsquo;s license asks that map data be credited on
          anything published — we recommend keeping this on.
        </p>
      </div>

      <button
        onClick={resetToDefaults}
        className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-line px-3 py-2.5 text-[12px] text-ink-soft transition hover:border-ink/30 hover:text-ink"
      >
        <RotateCcw size={13} /> Reset all settings
      </button>
    </div>
  );
}

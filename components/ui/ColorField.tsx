"use client";

import { useState, useEffect } from "react";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  disabled?: boolean;
}

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function ColorField({ label, value, onChange, disabled }: ColorFieldProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  function commit(next: string) {
    setDraft(next);
    if (HEX_RE.test(next)) onChange(next);
  }

  return (
    <div className={`flex items-center justify-between gap-3 ${disabled ? "opacity-35" : ""}`}>
      <span className="text-[12.5px] text-ink-soft">{label}</span>
      <div className="flex items-center gap-2">
        <div className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-inset ring-ink/15">
          <input
            type="color"
            value={HEX_RE.test(draft) ? draft.slice(0, 7) : value.slice(0, 7)}
            onChange={(e) => commit(e.target.value)}
            disabled={disabled}
            className="h-8 w-8 -translate-x-1 -translate-y-1 cursor-pointer border-0 p-0"
            aria-label={`${label} color picker`}
          />
        </div>
        <input
          type="text"
          value={draft}
          disabled={disabled}
          onChange={(e) => commit(e.target.value)}
          onBlur={() => setDraft(value)}
          spellCheck={false}
          className="w-[74px] rounded-sm border border-line bg-paper-soft px-1.5 py-1 font-mono text-[11px] uppercase text-ink-soft outline-none focus:border-ink/30"
        />
      </div>
    </div>
  );
}

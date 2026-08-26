"use client";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  displayValue?: string;
}

export function Slider({ label, value, min, max, step = 1, onChange, displayValue }: SliderProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[12.5px] text-ink-soft">{label}</span>
        <span className="font-mono text-[11px] text-ink-faint">
          {displayValue ?? value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );
}

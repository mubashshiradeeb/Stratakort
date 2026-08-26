"use client";

interface SegmentedControlProps<T extends string> {
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div>
      {label && <div className="mb-2 text-[12.5px] text-ink-soft">{label}</div>}
      <div className="grid auto-cols-fr grid-flow-col gap-px overflow-hidden rounded-sm border border-line bg-line">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2 py-1.5 text-[12px] transition-colors ${
              value === opt.value
                ? "bg-ink text-paper"
                : "bg-paper-soft text-ink-soft hover:bg-paper"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

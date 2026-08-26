export function ControlSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line px-5 py-6 first:pt-5 last:border-b-0">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="eyebrow">{title}</h3>
        {hint && <span className="text-[11px] text-ink-faint">{hint}</span>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

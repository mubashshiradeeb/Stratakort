const STEPS = [
  {
    n: "01",
    title: "Search",
    body: "Type a city, an address, a summit, a coastline — anywhere with coordinates. The map centers and frames itself automatically.",
  },
  {
    n: "02",
    title: "Shape",
    body: "Choose a cartographic style, then reach into individual colors, road weights, and which layers appear — water, parks, buildings, borders.",
  },
  {
    n: "03",
    title: "Arrange",
    body: "Set the aspect ratio, padding, frame, and title block. Everything you change updates the composition instantly, in place.",
  },
  {
    n: "04",
    title: "Export",
    body: "Download a high-resolution PNG sized for printing and framing, matching the on-screen composition exactly.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-b border-line bg-paper-soft">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-16 max-w-lg">
          <p className="eyebrow mb-4">How it works</p>
          <h2 className="text-balance font-display text-[32px] leading-tight text-ink md:text-[38px]">
            A real cartography tool, not a filter.
          </h2>
        </div>

        <div className="grid gap-x-8 gap-y-14 md:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.n} className="border-t border-ink/15 pt-5">
              <span className="font-mono text-[12px] text-brass">{step.n}</span>
              <h3 className="mt-3 font-display text-[19px] text-ink">{step.title}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

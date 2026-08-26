const FAQS = [
  {
    q: "Where does the map data come from?",
    a: "OpenStreetMap, the same open, community-maintained dataset behind much of the world's mapping software — covering roads, water, buildings, and parks for nearly every place on Earth.",
  },
  {
    q: "What resolution can I export?",
    a: "Posters export as PNG at up to 3× your screen resolution — sized for framing at common print dimensions like 18×24 in or A2.",
  },
  {
    q: "Do I need an account?",
    a: "No. The editor works entirely in your browser. Nothing is saved to a server unless you download it yourself.",
  },
  {
    q: "Is it really free?",
    a: "Yes — designing and exporting are free. There's no paywall on styles, colors, or resolution.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-b border-line bg-paper-soft">
      <div className="mx-auto max-w-4xl px-6 py-24 md:px-10">
        <p className="eyebrow mb-4 text-center">Questions</p>
        <h2 className="mb-14 text-balance text-center font-display text-[32px] leading-tight text-ink md:text-[38px]">
          A few things people ask.
        </h2>
        <div className="divide-y divide-line border-t border-line">
          {FAQS.map((item) => (
            <div key={item.q} className="grid gap-2 py-7 md:grid-cols-[220px_1fr] md:gap-10">
              <h3 className="font-display text-[16px] text-ink">{item.q}</h3>
              <p className="text-[14.5px] leading-relaxed text-ink-soft">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

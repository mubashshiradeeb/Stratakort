import Link from "next/link";
import { PosterMock } from "./PosterMock";
import { SAMPLE_POSTERS } from "@/lib/sampleData";

export function Hero() {
  const [back, mid, front] = SAMPLE_POSTERS;

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0 bg-contour" />
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-2 md:items-center md:py-28 md:px-10">
        <div className="relative z-10 animate-fade-up">
          <p className="eyebrow mb-6">Cartography, made personal</p>
          <h1 className="text-balance font-display text-[42px] leading-[1.08] text-ink md:text-[58px]">
            Every place you&rsquo;ve loved,
            <br />
            drawn as a poster.
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-soft">
            Search anywhere on Earth, shape the cartography by hand — colors,
            typography, terrain, roads — and export a print-ready poster in
            minutes. No design experience required.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-[14px] font-medium text-paper transition hover:bg-forest"
            >
              Create your map
              <span>→</span>
            </Link>
            <a
              href="#gallery"
              className="text-[14px] font-medium text-ink-soft underline decoration-line decoration-2 underline-offset-4 transition hover:text-ink hover:decoration-brass"
            >
              See examples
            </a>
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            <div>
              <dt className="eyebrow mb-1">Coverage</dt>
              <dd className="font-display text-[15px] text-ink">Anywhere on Earth</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">Output</dt>
              <dd className="font-display text-[15px] text-ink">Print-ready PNG</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1">Cost</dt>
              <dd className="font-display text-[15px] text-ink">Free to design</dd>
            </div>
          </dl>
        </div>

        <div className="relative z-10 flex justify-center md:justify-end">
          <div className="relative h-[420px] w-[300px] md:h-[460px] md:w-[330px]">
            <div className="absolute inset-0 -rotate-6 translate-x-[-38px] translate-y-3 opacity-70 shadow-poster">
              <PosterMock data={back} className="h-full w-full rounded-[2px]" />
            </div>
            <div className="absolute inset-0 rotate-3 translate-x-[30px] translate-y-1 opacity-85 shadow-poster">
              <PosterMock data={mid} className="h-full w-full rounded-[2px]" />
            </div>
            <div className="absolute inset-0 shadow-poster-lg ring-1 ring-black/5">
              <PosterMock data={front} className="h-full w-full rounded-[2px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

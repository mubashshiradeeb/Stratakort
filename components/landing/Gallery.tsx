import Link from "next/link";
import { PosterMock } from "./PosterMock";
import { SAMPLE_POSTERS } from "@/lib/sampleData";

export function Gallery() {
  return (
    <section id="gallery" className="border-b border-line">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-lg">
            <p className="eyebrow mb-4">Gallery</p>
            <h2 className="text-balance font-display text-[32px] leading-tight text-ink md:text-[38px]">
              Six cities, six moods.
            </h2>
          </div>
          <Link
            href="/create"
            className="text-[13.5px] font-medium text-ink-soft underline decoration-line decoration-2 underline-offset-4 transition hover:text-ink hover:decoration-brass"
          >
            Start your own →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-7 lg:grid-cols-6">
          {SAMPLE_POSTERS.map((poster) => (
            <Link
              href="/create"
              key={poster.city}
              className="group block overflow-hidden rounded-[2px] shadow-panel ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-poster-lg"
            >
              <PosterMock data={poster} className="w-full" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

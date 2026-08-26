import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer>
      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center md:px-10">
          <p className="eyebrow mb-5">Ready when you are</p>
          <h2 className="text-balance font-display text-[34px] leading-tight text-ink md:text-[44px]">
            Your first map poster
            <br />
            takes about two minutes.
          </h2>
          <Link
            href="/create"
            className="mt-9 inline-flex items-center gap-2 rounded-sm bg-ink px-7 py-3.5 text-[14px] font-medium text-paper transition hover:bg-forest"
          >
            Create your map
            <span>→</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-[12.5px] text-ink-faint md:flex-row md:px-10">
        <div className="flex items-center gap-2">
          <Image src="/stratakort-icon.png" alt="" width={22} height={12} className="h-3 w-auto opacity-70" />
          <span>Stratakort — map data © OpenStreetMap contributors</span>
        </div>
        <div className="flex gap-6">
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="hover:text-ink">
            Map attribution
          </a>
          <Link href="/create" className="hover:text-ink">
            Editor
          </Link>
        </div>
      </div>
    </footer>
  );
}

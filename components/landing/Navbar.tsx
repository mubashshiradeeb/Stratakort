"use client";

import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/stratakort-icon.png" alt="" width={30} height={16} className="h-4 w-auto" priority />
          <span className="font-display text-[19px] tracking-tight text-ink">
            Stratakort
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#gallery" className="text-[13.5px] text-ink-soft transition hover:text-ink">
            Gallery
          </a>
          <a href="#features" className="text-[13.5px] text-ink-soft transition hover:text-ink">
            How it works
          </a>
          <a href="#faq" className="text-[13.5px] text-ink-soft transition hover:text-ink">
            FAQ
          </a>
        </nav>

        <Link
          href="/create"
          className="group inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2.5 text-[13px] font-medium text-paper transition hover:bg-forest"
        >
          Create your map
          <span className="transition group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </header>
  );
}

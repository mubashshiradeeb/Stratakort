"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useEditorStore } from "@/lib/store";

export function EditorTopBar() {
  const title = useEditorStore((s) => s.typography.title);
  const subtitle = useEditorStore((s) => s.typography.subtitle);

  return (
    <header className="z-30 flex h-14 shrink-0 items-center justify-between border-b border-line bg-paper px-4 md:px-5">
      <Link
        href="/"
        className="flex items-center gap-2 text-[13px] text-ink-soft transition hover:text-ink"
      >
        <ArrowLeft size={15} />
        <span className="hidden items-center gap-1.5 sm:flex">
          <Image src="/stratakort-icon.png" alt="" width={26} height={14} className="h-3 w-auto" />
          Stratakort
        </span>
      </Link>

      <div className="max-w-[55%] truncate text-center font-mono text-[11px] uppercase tracking-wide text-ink-faint">
        {title}
        {subtitle ? ` · ${subtitle}` : ""}
      </div>

      <div className="w-[15px] sm:w-[100px]" aria-hidden />
    </header>
  );
}

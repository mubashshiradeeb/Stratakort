"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface AccordionContextValue {
  openId: string | null;
  setOpenId: (id: string | null) => void;
}
const AccordionContext = createContext<AccordionContextValue | null>(null);

export function Accordion({
  children,
  defaultOpen,
}: {
  children: ReactNode;
  defaultOpen?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? null);
  return (
    <AccordionContext.Provider value={{ openId, setOpenId }}>
      <div className="divide-y divide-line">{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionItem must be used within Accordion");
  const isOpen = ctx.openId === id;

  return (
    <div>
      <button
        onClick={() => ctx.setOpenId(isOpen ? null : id)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-paper-soft"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2.5">
          {Icon && <Icon size={14} />}
          <span className="eyebrow">{title}</span>
        </span>
        <ChevronDown
          size={15}
          className={`text-ink-faint transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 px-5 pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

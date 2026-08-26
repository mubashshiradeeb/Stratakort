"use client";

import { useEffect, useRef, useState } from "react";
import { Search, MapPin, Loader2, AlertCircle } from "lucide-react";
import { useEditorStore } from "@/lib/store";
import { useLocationSearch } from "@/lib/useLocationSearch";
import { estimateZoomForType } from "@/lib/geocode";
import { GeocodeResult } from "@/lib/types";

export function LocationSearch() {
  const { query, setQuery, results, status } = useLocationSearch();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const goToLocation = useEditorStore((s) => s.goToLocation);
  const setTypography = useEditorStore((s) => s.setTypography);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  function selectResult(result: GeocodeResult) {
    goToLocation({
      latitude: result.latitude,
      longitude: result.longitude,
      zoom: estimateZoomForType(result.type),
    });
    setTypography({
      title: result.shortName.toUpperCase(),
      subtitle: result.region.toUpperCase(),
    });
    setQuery(`${result.shortName}, ${result.region}`);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[activeIndex] ?? results[0];
      if (target) selectResult(target);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="absolute left-4 right-4 top-4 z-10 md:left-5 md:right-auto md:top-5 md:w-[340px]"
    >
      <div className="flex items-center gap-2.5 rounded-sm border border-line bg-paper/95 px-3.5 py-3 shadow-panel backdrop-blur">
        {status === "loading" ? (
          <Loader2 size={16} className="shrink-0 animate-spin text-ink-faint" />
        ) : (
          <Search size={16} className="shrink-0 text-ink-faint" />
        )}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search a city, address, or landmark…"
          className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-ink-faint focus:outline-none"
          aria-label="Search for a location"
          role="combobox"
          aria-expanded={open}
        />
      </div>

      {open && (query.trim().length >= 2 || status === "error") && (
        <div className="mt-2 max-h-80 overflow-y-auto rounded-sm border border-line bg-paper shadow-poster thin-scroll">
          {status === "error" && (
            <div className="flex items-start gap-2.5 px-4 py-4 text-[13px] text-ink-soft">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-brass" />
              <span>Search is unavailable right now. Check your connection and try again.</span>
            </div>
          )}

          {status !== "error" && results.length === 0 && status !== "loading" && (
            <div className="px-4 py-4 text-[13px] text-ink-faint">
              No places found for &ldquo;{query}&rdquo;.
            </div>
          )}

          {results.map((result, i) => (
            <button
              key={result.id}
              onClick={() => selectResult(result)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex w-full items-start gap-2.5 px-4 py-3 text-left transition-colors ${
                i === activeIndex ? "bg-paper-dim" : "hover:bg-paper-soft"
              } ${i !== results.length - 1 ? "border-b border-line" : ""}`}
            >
              <MapPin size={14} className="mt-0.5 shrink-0 text-brass" />
              <span className="min-w-0">
                <span className="block truncate text-[13.5px] text-ink">
                  {result.shortName}
                </span>
                <span className="block truncate text-[12px] text-ink-faint">
                  {result.region}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { searchLocations } from "./geocode";
import { GeocodeResult } from "./types";

/** Shared debounced-search logic used by the floating map search, the
 *  Location panel, and the Routes waypoint picker — one implementation,
 *  three presentations. */
export function useLocationSearch(debounceMs = 380) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await searchLocations(trimmed, controller.signal);
        setResults(res);
        setStatus("idle");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setStatus("error");
        }
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, debounceMs]);

  function clear() {
    setQuery("");
    setResults([]);
    setStatus("idle");
  }

  return { query, setQuery, results, status, clear };
}

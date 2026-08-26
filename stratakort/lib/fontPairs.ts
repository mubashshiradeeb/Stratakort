import { FontPairId } from "./types";

export interface FontPair {
  label: string;
  description: string;
  /** Font-family CSS stack for the title. */
  title: string;
  /** Font-family CSS stack for subtitle, quote, and coordinates. */
  body: string;
  /** A short sample rendered in the picker so the choice is self-evident. */
  sample: string;
}

// System font stacks only — no external webfont fetch, so type renders
// identically and instantly everywhere (no FOUT/FOIT, no build-time network
// dependency). Each pair is tuned to feel genuinely distinct even though
// every family here ships with the OS.
export const FONT_PAIRS: Record<FontPairId, FontPair> = {
  serif: {
    label: "Serif",
    description: "Engraved, classic — the traditional map-poster look.",
    title: "Georgia, 'Iowan Old Style', 'Palatino Linotype', Palatino, serif",
    body: "Georgia, 'Iowan Old Style', 'Palatino Linotype', Palatino, serif",
    sample: "Aa",
  },
  sans: {
    label: "Sans-Serif",
    description: "Clean and modern, generous whitespace.",
    title: "'Helvetica Neue', -apple-system, BlinkMacSystemFont, Arial, sans-serif",
    body: "'Helvetica Neue', -apple-system, BlinkMacSystemFont, Arial, sans-serif",
    sample: "Aa",
  },
  display: {
    label: "Display",
    description: "Bold, condensed headline with a quiet support line.",
    title: "'Arial Narrow', 'Helvetica Neue Condensed', 'Oswald', sans-serif",
    body: "'Helvetica Neue', -apple-system, BlinkMacSystemFont, Arial, sans-serif",
    sample: "Aa",
  },
  mono: {
    label: "Monospace",
    description: "Technical, surveyor's-chart precision.",
    title: "'IBM Plex Mono', 'SF Mono', Menlo, Consolas, monospace",
    body: "'IBM Plex Mono', 'SF Mono', Menlo, Consolas, monospace",
    sample: "Aa",
  },
};

export const FONT_PAIR_IDS: FontPairId[] = ["serif", "sans", "display", "mono"];

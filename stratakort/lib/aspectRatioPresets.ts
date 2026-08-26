export type PresetCategory = "print" | "social" | "wallpaper";

export interface AspectRatioPreset {
  id: string;
  label: string;
  category: PresetCategory;
  /** Design ratio [a, b] — only used when fixedPx is absent. Orientation
   *  flips which side is the long edge. */
  ratio: [number, number];
  /** A literal target export size in pixels. When present this always wins
   *  over ratio + orientation + export-quality scaling — used for formats
   *  where a specific platform/device expects an exact pixel size. */
  fixedPx?: { width: number; height: number };
  /** True for formats with one canonical orientation (a banner, a phone
   *  wallpaper) — the UI hides the portrait/landscape toggle for these. */
  lockOrientation?: boolean;
  /** Short human-readable spec shown under the preset button, e.g. "1584 × 396 px". */
  note: string;
}

const PRINT_PRESETS: AspectRatioPreset[] = [
  { id: "print-2-3", label: "2:3", category: "print", ratio: [2, 3], note: "Classic poster (e.g. 12×18\u2033, 24×36\u2033)" },
  { id: "print-3-4", label: "3:4", category: "print", ratio: [3, 4], note: "3 × 4" },
  { id: "print-4-5", label: "4:5", category: "print", ratio: [4, 5], note: "4 × 5" },
  { id: "print-1-1", label: "1:1", category: "print", ratio: [1, 1], note: "Square" },
  {
    id: "print-a4",
    label: "A4",
    category: "print",
    ratio: [210, 297],
    fixedPx: { width: 2480, height: 3508 },
    note: "210 × 297 mm · 300dpi",
  },
  {
    id: "print-a3",
    label: "A3",
    category: "print",
    ratio: [297, 420],
    fixedPx: { width: 3508, height: 4961 },
    note: "297 × 420 mm · 300dpi",
  },
  {
    id: "print-letter",
    label: "Letter",
    category: "print",
    ratio: [850, 1100],
    fixedPx: { width: 2550, height: 3300 },
    note: "8.5 × 11\u2033 · 300dpi",
  },
];

const SOCIAL_PRESETS: AspectRatioPreset[] = [
  {
    id: "social-linkedin-banner",
    label: "LinkedIn Banner",
    category: "social",
    ratio: [1584, 396],
    fixedPx: { width: 1584, height: 396 },
    lockOrientation: true,
    note: "1584 × 396 px",
  },
  {
    id: "social-youtube-banner",
    label: "YouTube Banner / Thumbnail",
    category: "social",
    ratio: [16, 9],
    fixedPx: { width: 2560, height: 1440 },
    lockOrientation: true,
    note: "2560 × 1440 px · 16:9",
  },
  {
    id: "social-instagram-square",
    label: "Instagram Square",
    category: "social",
    ratio: [1, 1],
    fixedPx: { width: 1080, height: 1080 },
    lockOrientation: true,
    note: "1080 × 1080 px",
  },
  {
    id: "social-instagram-story",
    label: "Instagram Story",
    category: "social",
    ratio: [9, 16],
    fixedPx: { width: 1080, height: 1920 },
    lockOrientation: true,
    note: "1080 × 1920 px · 9:16",
  },
  {
    id: "social-reddit-banner",
    label: "Reddit Banner",
    category: "social",
    ratio: [1920, 256],
    fixedPx: { width: 1920, height: 256 },
    lockOrientation: true,
    note: "1920 × 256 px",
  },
];

const WALLPAPER_PRESETS: AspectRatioPreset[] = [
  {
    id: "wallpaper-desktop-4k",
    label: "Desktop 4K",
    category: "wallpaper",
    ratio: [16, 9],
    fixedPx: { width: 3840, height: 2160 },
    lockOrientation: true,
    note: "3840 × 2160 px",
  },
  {
    id: "wallpaper-ultrawide",
    label: "UltraWide",
    category: "wallpaper",
    ratio: [21, 9],
    fixedPx: { width: 3440, height: 1440 },
    lockOrientation: true,
    note: "3440 × 1440 px · 21:9",
  },
  {
    id: "wallpaper-iphone",
    label: "iPhone",
    category: "wallpaper",
    ratio: [1320, 2868],
    fixedPx: { width: 1320, height: 2868 },
    lockOrientation: true,
    note: "1320 × 2868 px",
  },
  {
    id: "wallpaper-galaxy",
    label: "Galaxy",
    category: "wallpaper",
    ratio: [1440, 3120],
    fixedPx: { width: 1440, height: 3120 },
    lockOrientation: true,
    note: "1440 × 3120 px",
  },
];

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  ...PRINT_PRESETS,
  ...SOCIAL_PRESETS,
  ...WALLPAPER_PRESETS,
];

export const ASPECT_RATIO_MAP: Record<string, AspectRatioPreset> = Object.fromEntries(
  ASPECT_RATIO_PRESETS.map((p) => [p.id, p])
);

export const PRESET_CATEGORY_LABELS: Record<PresetCategory, string> = {
  print: "Print",
  social: "Social",
  wallpaper: "Wallpaper",
};

export const PRESET_CATEGORIES: PresetCategory[] = ["print", "social", "wallpaper"];

export const DEFAULT_ASPECT_RATIO_ID = "print-2-3";

export function getAspectRatioPreset(id: string): AspectRatioPreset {
  return ASPECT_RATIO_MAP[id] ?? ASPECT_RATIO_MAP[DEFAULT_ASPECT_RATIO_ID];
}

export function presetsByCategory(category: PresetCategory): AspectRatioPreset[] {
  return ASPECT_RATIO_PRESETS.filter((p) => p.category === category);
}

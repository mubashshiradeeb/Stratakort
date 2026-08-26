import { ThemeId } from "./types";

export interface PosterMockData {
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  /** City-overview zoom used for the thumbnail's live map render. */
  zoom: number;
  theme: ThemeId;
}

// One real city per curated theme, chosen for a thematic echo (Reykjavík
// for Midnight Blue, Paris limestone for Warm Sand, Tokyo's cool grid for
// Soft Slate, etc.) — rendered as an actual live vector map via
// LiveMapThumbnail, not placeholder art.
export const SAMPLE_POSTERS: PosterMockData[] = [
  { city: "REYKJAVÍK", region: "ICELAND", latitude: 64.1466, longitude: -21.9426, zoom: 11.6, theme: "midnightBlue" },
  { city: "PARIS", region: "FRANCE", latitude: 48.8566, longitude: 2.3522, zoom: 11.9, theme: "warmSand" },
  { city: "HYDERABAD", region: "TELANGANA, INDIA", latitude: 17.385, longitude: 78.4867, zoom: 11.2, theme: "copper" },
  { city: "KYOTO", region: "JAPAN", latitude: 35.0116, longitude: 135.7681, zoom: 12.0, theme: "emerald" },
  { city: "VANCOUVER", region: "CANADA", latitude: 49.2827, longitude: -123.1207, zoom: 11.5, theme: "monochrome" },
  { city: "TOKYO", region: "JAPAN", latitude: 35.6762, longitude: 139.6503, zoom: 11.4, theme: "softSlate" },
];

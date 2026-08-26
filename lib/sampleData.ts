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

// One real city per featured theme, chosen for a thematic echo (Reykjavík's
// glaciers for Arctic Ice, Marrakech's dunes for Desert Oasis, Kyoto's
// sakura season for Cherry Blossom, etc.) — rendered as an actual live
// vector map via LiveMapThumbnail, not placeholder art. All six now
// showcase newer custom themes from the expanded 40-theme palette, spread
// across a wider range of moods and geographies than the original set.
export const SAMPLE_POSTERS: PosterMockData[] = [
  { city: "REYKJAVÍK", region: "ICELAND", latitude: 64.1466, longitude: -21.9426, zoom: 11.6, theme: "arcticIce" },
  { city: "NEW YORK CITY", region: "UNITED STATES", latitude: 40.7128, longitude: -74.0060, zoom: 11.3, theme: "synthwave" },
  { city: "SINGAPORE", region: "SINGAPORE", latitude: 1.3521, longitude: 103.8198, zoom: 11.6, theme: "sageForest" },
  { city: "KYOTO", region: "JAPAN", latitude: 35.0116, longitude: 135.7681, zoom: 12.0, theme: "cherryBlossom" },
  { city: "MARRAKECH", region: "MOROCCO", latitude: 31.6295, longitude: -7.9811, zoom: 12.2, theme: "desertOasis" },
  { city: "TOKYO", region: "JAPAN", latitude: 35.6762, longitude: 139.6503, zoom: 11.4, theme: "tokyoNeon" },
];

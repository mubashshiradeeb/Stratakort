import { GeocodeResult } from "./types";

export async function searchLocations(
  query: string,
  signal?: AbortSignal
): Promise<GeocodeResult[]> {
  if (!query || query.trim().length < 2) return [];
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, { signal });
  if (!res.ok) throw new Error("Location search failed");
  const data = await res.json();
  return (data.results ?? []) as GeocodeResult[];
}

export function estimateZoomForType(type: string): number {
  const zoomByType: Record<string, number> = {
    country: 4.2,
    state: 5.5,
    region: 6,
    county: 8,
    city: 11.5,
    town: 12.5,
    village: 13.5,
    suburb: 13,
    neighbourhood: 14,
    island: 9,
    house: 16,
    building: 16,
    road: 15,
    attraction: 14.5,
  };
  return zoomByType[type] ?? 11;
}

import { NextRequest, NextResponse } from "next/server";

// Proxies OpenStreetMap Nominatim search server-side. This keeps the
// required User-Agent/Referer headers off the client and respects
// Nominatim's usage policy (nominatim.org/release-docs/latest/api/Search).
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    addressdetails: "1",
    limit: "6",
  });

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: {
        "User-Agent": "Stratakort/1.0 (map poster generator; contact: support@stratakort.app)",
        "Accept-Language": "en",
      },
      // Nominatim asks that automated clients cache; Next's fetch caches by default.
      next: { revalidate: 60 * 60 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { results: [], error: "Search service unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();

    const results = (Array.isArray(data) ? data : []).map((item: any) => ({
      id: String(item.place_id),
      displayName: item.display_name as string,
      shortName:
        item.address?.city ||
        item.address?.town ||
        item.address?.village ||
        item.address?.county ||
        item.name ||
        (item.display_name as string).split(",")[0],
      region:
        [item.address?.state, item.address?.country].filter(Boolean).join(", ") ||
        (item.display_name as string).split(",").slice(1).join(",").trim(),
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      type: item.type as string,
      importance: item.importance ?? 0,
    }));

    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { results: [], error: "Network error reaching search service" },
      { status: 502 }
    );
  }
}

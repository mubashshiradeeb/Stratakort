"use client";

import { THEME_PRESETS } from "@/lib/palettes";
import { PosterMockData } from "@/lib/sampleData";
import { formatCoordinates, getMatColor, getTextColorForMat, getScrimRgb } from "@/lib/export";
import { LiveMapThumbnail } from "./LiveMapThumbnail";

/**
 * A landing-page sample card — a real, live-rendered vector map (via
 * LiveMapThumbnail) styled with one of the six curated themes, with the
 * title/subtitle/coordinates floating over its bottom edge on a gradient
 * scrim. Doubles as a showcase of the "floating" overlay layout available
 * in the editor itself.
 */
export function PosterMock({
  data,
  className,
}: {
  data: PosterMockData;
  className?: string;
}) {
  const palette = THEME_PRESETS[data.theme];
  // Same auto-contrast logic the editor uses, so these samples are
  // genuinely representative of what the product produces, not a
  // special-cased marketing treatment.
  const matColor = getMatColor(palette.background);
  const textColor = getTextColorForMat(matColor);
  const scrimRgb = getScrimRgb(textColor);
  const coords = formatCoordinates(data.latitude, data.longitude);

  return (
    <div
      className={`relative aspect-[5/7] overflow-hidden ${className ?? ""}`}
      style={{ background: palette.background, containerType: "inline-size" as any }}
    >
      <LiveMapThumbnail
        latitude={data.latitude}
        longitude={data.longitude}
        zoom={data.zoom}
        palette={palette}
        cacheKey={`${data.city}-${data.theme}`}
        className="absolute inset-0 h-full w-full"
      />

      {/* floating title block over a gradient scrim */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center px-[6%] pb-[7%] pt-[18%] text-center"
        style={{
          background: `linear-gradient(to top, rgba(${scrimRgb}, 0.88) 0%, rgba(${scrimRgb}, 0.5) 58%, rgba(${scrimRgb}, 0) 100%)`,
        }}
      >
        <div
          className="font-display uppercase"
          style={{
            color: textColor,
            fontSize: "5.7cqw",
            letterSpacing: "0.13em",
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {data.city}
        </div>
        <div
          className="mt-[6%] font-body italic uppercase"
          style={{ color: textColor, fontSize: "2.8cqw", letterSpacing: "0.19em", opacity: 0.85 }}
        >
          {data.region}
        </div>
        <div className="mt-[5%] h-px w-[15%]" style={{ background: textColor, opacity: 0.5 }} />
        <div
          className="mt-[5%] font-mono"
          style={{ color: textColor, fontSize: "2.3cqw", letterSpacing: "0.09em", opacity: 0.8 }}
        >
          {coords}
        </div>
      </div>

      {/* thin frame line, echoing the editor's default poster frame */}
      <div
        className="pointer-events-none absolute inset-[3%] border"
        style={{ borderColor: `${textColor}33` }}
      />
    </div>
  );
}

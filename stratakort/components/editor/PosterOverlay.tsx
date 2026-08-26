"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/lib/store";
import { useMapInstance } from "@/lib/mapContext";
import {
  computePosterLayout,
  formatCoordinates,
  resolveMatColor,
  resolveTextColor,
  getPosterPixelSize,
  getFloatingZoneHeight,
  getScrimRgb,
  ATTRIBUTION_TEXT,
} from "@/lib/export";
import { FONT_PAIRS } from "@/lib/fontPairs";
import { getGrainTileDataUrl } from "@/lib/grain";

export function PosterOverlay() {
  const { viewportRef, mapRectWidthRef } = useMapInstance();
  const [container, setContainer] = useState({ width: 0, height: 0 });

  const palette = useEditorStore((s) => s.palette);
  const typography = useEditorStore((s) => s.typography);
  const poster = useEditorStore((s) => s.poster);
  const location = useEditorStore((s) => s.location);
  const effects = useEditorStore((s) => s.effects);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () =>
      setContainer({ width: el.clientWidth, height: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewportRef]);

  if (!container.width || !container.height) return null;

  const floating = poster.overlayStyle === "floating";
  const ref = getPosterPixelSize(poster.aspectRatio, poster.orientation, 1000);
  const scale = Math.min(
    (container.width * 0.9) / ref.width,
    (container.height * 0.86) / ref.height
  );
  const box = {
    w: ref.width * scale,
    h: ref.height * scale,
  };
  const boxX = (container.width - box.w) / 2;
  const boxY = (container.height - box.h) / 2;

  const { mapRect, padding } = computePosterLayout(box.w, box.h, poster.padding, poster.overlayStyle);
  // Kept fresh on every render (not inside an effect — this is read only by
  // the imperative, click-triggered export function, never during another
  // component's render, so there's no tearing/ordering concern) so export
  // always has the *current* on-screen map width to compute its zoom
  // correction against, not a stale value from a previous layout.
  mapRectWidthRef.current = mapRect.w;
  const matColor = resolveMatColor(poster.matColor, palette.background);
  const textColor = resolveTextColor(typography.textColor, matColor);
  const s = box.w / 1000; // proportional scale factor, mirrors export.ts

  const rightBarW = box.w - mapRect.x - mapRect.w;
  const bottomBarY = mapRect.y + mapRect.h;
  const bottomBarH = box.h - bottomBarY;

  const fontPair = FONT_PAIRS[typography.fontPair];
  const baseTitleSize = 46 * s * typography.fontSizeScale;

  const textAlignCss = typography.textAlign;
  const alignItems =
    typography.textAlign === "left" ? "flex-start" : typography.textAlign === "right" ? "flex-end" : "center";

  const zoneHeight = floating ? getFloatingZoneHeight(mapRect, s) : 0;
  const zoneTop = mapRect.y + mapRect.h - zoneHeight;
  const scrimRgb = getScrimRgb(textColor);

  const titleBlock = (
    <>
      {typography.title.trim() && (
        <div
          style={{
            fontFamily: fontPair.title,
            fontWeight: typography.fontWeight,
            fontSize: baseTitleSize,
            letterSpacing: `${typography.letterSpacing}em`,
            color: textColor,
            lineHeight: 1,
            textAlign: textAlignCss,
          }}
          className="uppercase"
        >
          {typography.title}
        </div>
      )}
      {typography.subtitle.trim() && (
        <div
          style={{
            fontFamily: fontPair.body,
            fontStyle: "italic",
            fontSize: baseTitleSize * 0.32,
            letterSpacing: "0.22em",
            color: textColor,
            marginTop: baseTitleSize * 0.45,
            opacity: 0.85,
            textAlign: textAlignCss,
          }}
          className="uppercase"
        >
          {typography.subtitle}
        </div>
      )}
      {(typography.showCoordinates || (typography.quote.trim() && !floating)) && (
        <div
          style={{
            width: box.w * 0.06,
            borderTop: `1px solid ${textColor}`,
            opacity: 0.5,
            marginTop: baseTitleSize * 0.4,
            alignSelf: alignItems,
          }}
        />
      )}
      {typography.showCoordinates && (
        <div
          style={{
            fontFamily: fontPair.body,
            fontSize: baseTitleSize * 0.24,
            letterSpacing: "0.1em",
            color: textColor,
            marginTop: baseTitleSize * 0.38,
            opacity: 0.85,
            textAlign: textAlignCss,
          }}
        >
          {formatCoordinates(location.latitude, location.longitude)}
        </div>
      )}
      {typography.quote.trim() && !floating && (
        <div
          style={{
            fontFamily: fontPair.body,
            fontStyle: "italic",
            fontSize: baseTitleSize * 0.23,
            color: textColor,
            marginTop: baseTitleSize * 0.32,
            opacity: 0.78,
            textAlign: textAlignCss,
            maxWidth: mapRect.w * 0.82,
            whiteSpace: "pre-wrap",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {typography.quote}
        </div>
      )}
    </>
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute transition-[width,height,left,top] duration-200 ease-out"
        style={{
          left: boxX,
          top: boxY,
          width: box.w,
          height: box.h,
          boxShadow: `0 1px 1px rgba(20,24,26,0.14), 0 10px 20px -12px rgba(20,24,26,0.4), 0 40px 70px -24px rgba(20,24,26,0.55), 0 0 0 2000px rgba(20,24,26,0.32)`,
        }}
      >
        {!floating && (
          <>
            {/* mat bars covering the live map outside the crop */}
            <div
              className="absolute left-0 top-0 w-full"
              style={{ height: mapRect.y, background: matColor }}
            />
            <div
              className="absolute left-0 top-0 h-full"
              style={{ width: mapRect.x, background: matColor }}
            />
            <div
              className="absolute right-0 top-0 h-full"
              style={{ width: rightBarW, background: matColor }}
            />
            <div
              className="absolute left-0 flex w-full flex-col px-4"
              style={{
                top: bottomBarY,
                height: bottomBarH,
                background: matColor,
                alignItems,
                justifyContent: "center",
              }}
            >
              {titleBlock}
            </div>
          </>
        )}

        {floating && (
          <>
            {/* thin edge margin, only visible if padding > 0 */}
            {padding > 0 && (
              <>
                <div className="absolute left-0 top-0 w-full" style={{ height: mapRect.y, background: matColor }} />
                <div className="absolute left-0 top-0 h-full" style={{ width: mapRect.x, background: matColor }} />
                <div className="absolute right-0 top-0 h-full" style={{ width: rightBarW, background: matColor }} />
                <div className="absolute left-0 bottom-0 w-full" style={{ height: padding, background: matColor }} />
              </>
            )}
            {/* gradient scrim + floating title block, sitting directly over
                the bottom of the map itself rather than a separate mat strip */}
            <div
              className="absolute left-0 flex flex-col px-4"
              style={{
                top: zoneTop,
                left: mapRect.x,
                width: mapRect.w,
                height: zoneHeight,
                alignItems,
                justifyContent: "flex-start",
                paddingTop: zoneHeight * 0.34,
                background: `linear-gradient(to top, rgba(${scrimRgb}, 0.82) 0%, rgba(${scrimRgb}, 0.45) 55%, rgba(${scrimRgb}, 0) 100%)`,
              }}
            >
              {titleBlock}
            </div>
          </>
        )}

        {/* attribution colophon, pinned to the bottom edge regardless of
            how much title/subtitle/quote content sits above it */}
        {poster.showAttribution && (
          <div
            className="absolute left-0 w-full text-center uppercase"
            style={{
              bottom: Math.max(padding * 0.32, 6 * s),
              fontFamily: fontPair.body,
              fontSize: baseTitleSize * 0.15,
              letterSpacing: "0.08em",
              color: textColor,
              opacity: floating ? 0.65 : 0.5,
            }}
          >
            {ATTRIBUTION_TEXT}
          </div>
        )}

        {/* frame */}
        {poster.frame !== "none" && (
          <div
            className="absolute"
            style={{
              left: mapRect.x,
              top: mapRect.y,
              width: mapRect.w,
              height: mapRect.h,
              border: `${1.5 * s}px solid ${palette.labels}`,
            }}
          />
        )}
        {poster.frame === "double" && (
          <div
            className="absolute"
            style={{
              left: mapRect.x + 6 * s,
              top: mapRect.y + 6 * s,
              width: mapRect.w - 12 * s,
              height: mapRect.h - 12 * s,
              border: `${1 * s}px solid ${palette.labels}`,
            }}
          />
        )}

        {/* subtle inner bevel where the print meets the mat, like glass in a frame */}
        <div
          className="absolute shadow-bevel"
          style={{ left: mapRect.x, top: mapRect.y, width: mapRect.w, height: mapRect.h }}
        />

        {/* marker */}
        {poster.showMarker && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: mapRect.x + mapRect.w / 2, top: mapRect.y + mapRect.h / 2 }}
          >
            <MarkerGlyph style={poster.markerStyle} color={palette.labels} scale={s} />
          </div>
        )}

        {/* grain / texture overlay, across the whole physical print */}
        {effects.grain > 0 && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${getGrainTileDataUrl()})`,
              backgroundRepeat: "repeat",
              backgroundSize: "160px 160px",
              mixBlendMode: "overlay",
              opacity: Math.min(1, (effects.grain / 100) * 0.5),
            }}
          />
        )}
      </div>
    </div>
  );
}

function MarkerGlyph({
  style,
  color,
  scale,
}: {
  style: "pin" | "dot" | "crosshair" | "ring";
  color: string;
  scale: number;
}) {
  const r = 7 * scale;
  const size = r * 4;
  return (
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
      {style === "dot" && <circle cx={0} cy={0} r={r * 0.6} fill={color} />}
      {style === "ring" && (
        <>
          <circle cx={0} cy={0} r={r} fill="none" stroke={color} strokeWidth={2 * scale} />
          <circle cx={0} cy={0} r={r * 0.28} fill={color} />
        </>
      )}
      {style === "crosshair" && (
        <>
          <line x1={-r * 1.6} y1={0} x2={r * 1.6} y2={0} stroke={color} strokeWidth={2 * scale} />
          <line x1={0} y1={-r * 1.6} x2={0} y2={r * 1.6} stroke={color} strokeWidth={2 * scale} />
          <circle cx={0} cy={0} r={r} fill="none" stroke={color} strokeWidth={2 * scale} />
        </>
      )}
      {style === "pin" && (
        <path
          d={`M 0 ${r * 1.1} L ${-r * 0.55} ${-r * 0.35} A ${r * 0.7} ${r * 0.7} 0 1 1 ${r * 0.55} ${-r * 0.35} Z`}
          fill={color}
        />
      )}
    </svg>
  );
}

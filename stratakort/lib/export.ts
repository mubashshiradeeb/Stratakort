import { AspectRatioId, EditorState, ExportQuality, MatColorSetting, Orientation, OverlayStyle, TextAlign } from "./types";
import { FONT_PAIRS } from "./fontPairs";
import { MAP_FILTERS } from "./mapFilters";
import { drawGrainOverlay } from "./grain";
import { getAspectRatioPreset } from "./aspectRatioPresets";

/** Target long-edge pixel size per export-quality tier. Shared by the
 *  export hook (to size the actual output) and the live map (to pick a
 *  matching road-width scale — see computeRoadWidthScale) so both always
 *  agree on what resolution is being targeted. */
export const QUALITY_LONG_EDGE: Record<ExportQuality, number> = {
  standard: 1400,
  high: 2200,
  print: 3300,
};

/** Looks up the named preset. When it defines a literal `fixedPx` target
 *  (social/wallpaper formats, and named paper sizes like A4/A3/Letter),
 *  that size is returned as-is — orientation and the export-quality long
 *  edge don't apply, since the whole point of picking e.g. "Instagram
 *  Story" is to get that exact pixel size. Otherwise the preset's design
 *  ratio is scaled to `baseLongEdge` and oriented per `orientation`, same
 *  as before. */
export function getPosterPixelSize(
  aspectRatio: AspectRatioId,
  orientation: Orientation,
  baseLongEdge: number
): { width: number; height: number } {
  const preset = getAspectRatioPreset(aspectRatio);
  if (preset.fixedPx) return { width: preset.fixedPx.width, height: preset.fixedPx.height };

  let [a, b] = preset.ratio;
  if (a > b) [a, b] = [b, a]; // normalize so b is the long edge factor
  const shortEdge = Math.round((baseLongEdge * a) / b);
  const width = orientation === "portrait" ? shortEdge : baseLongEdge;
  const height = orientation === "portrait" ? baseLongEdge : shortEdge;
  return { width, height };
}

export interface PosterLayout {
  mapRect: { x: number; y: number; w: number; h: number };
  padding: number;
  textBlockHeight: number;
}

/** Single source of truth for the mat/padding/text-block geometry, shared by
 *  the on-screen CSS preview and the canvas export so they stay in sync.
 *
 *  "framed" (default) reserves a bottom strip below a matted map crop, same
 *  as always. "floating" lets the map fill (almost) the whole poster —
 *  padding becomes a thin optional edge margin instead of a mat, and there's
 *  no reserved text strip because the title block floats over the map
 *  itself (see getFloatingZoneHeight). */
export function computePosterLayout(
  width: number,
  height: number,
  paddingSetting: number,
  overlayStyle: OverlayStyle = "framed"
): PosterLayout {
  if (overlayStyle === "floating") {
    const padding = (paddingSetting / 100) * (width * 0.05);
    return {
      mapRect: {
        x: padding,
        y: padding,
        w: width - padding * 2,
        h: height - padding * 2,
      },
      padding,
      textBlockHeight: 0,
    };
  }

  const padding = (paddingSetting / 100) * (width * 0.16) + width * 0.02;
  const textBlockHeight = height * 0.24;
  return {
    mapRect: {
      x: padding,
      y: padding,
      w: width - padding * 2,
      h: height - padding * 2 - textBlockHeight,
    },
    padding,
    textBlockHeight,
  };
}

/** Height of the bottom band (within mapRect) that the floating title block
 *  and its gradient scrim occupy. A fraction of the map's own height, with
 *  a floor based on `scale` so text has room to breathe even on very short
 *  formats (banners), clamped so it can never swallow the whole map. */
export function getFloatingZoneHeight(mapRect: { w: number; h: number }, scale: number): number {
  const proportional = mapRect.h * 0.34;
  const minimumForText = 46 * scale * 3.6;
  return Math.max(proportional, Math.min(minimumForText, mapRect.h * 0.6));
}

const ROAD_WIDTH_REFERENCE_LONG_EDGE = 1600;
const ROAD_WIDTH_SCALE_MIN = 0.8;
const ROAD_WIDTH_SCALE_MAX = 2.6;

/** MapLibre line-width is defined in fixed CSS pixels, so the same numeric
 *  width covers a shrinking fraction of the image as the target resolution
 *  grows — a road drawn "3px wide" looks reasonable at 1400px but
 *  proportionally thin (and, stacked with hundreds of overlapping minor
 *  streets, muddy) at 4900px (e.g. an A3 print). This computes a width
 *  multiplier from the poster's *current* aspect-ratio + export-quality
 *  settings, so the live map's style already bakes in the right road
 *  weight before the user ever clicks download — export then just
 *  captures whatever's already on screen, with no separate resize-time
 *  rescaling step needed. */
export function computeRoadWidthScale(
  aspectRatio: AspectRatioId,
  orientation: Orientation,
  exportQuality: ExportQuality
): number {
  const { width, height } = getPosterPixelSize(aspectRatio, orientation, QUALITY_LONG_EDGE[exportQuality]);
  const longEdge = Math.max(width, height);
  return Math.min(ROAD_WIDTH_SCALE_MAX, Math.max(ROAD_WIDTH_SCALE_MIN, longEdge / ROAD_WIDTH_REFERENCE_LONG_EDGE));
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** The poster's outer mat/backing color — white for light cartography,
 *  near-black for dark, so the frame reads like a printed mat board. */
export function getMatColor(paletteBackground: string): "#FFFFFF" | "#0A0C0D" {
  return relativeLuminance(paletteBackground) > 0.5 ? "#FFFFFF" : "#0A0C0D";
}

export function getTextColorForMat(matColor: string): "#14181A" | "#EEF0EA" {
  return relativeLuminance(matColor) > 0.5 ? "#14181A" : "#EEF0EA";
}

/** RGB triplet (as a "r, g, b" string) to build the floating overlay's
 *  scrim gradient from — dark scrim behind light text, light scrim behind
 *  dark text, so the gradient always pushes legibility in the right
 *  direction regardless of which of the two the user's palette/custom
 *  color resolves to. */
export function getScrimRgb(textColor: string): string {
  const { r, g, b } = relativeLuminance(textColor) > 0.5 ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
  return `${r}, ${g}, ${b}`;
}

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Resolves the "auto | white | black | hex" matting setting to a literal
 *  color. Shared by the live preview and export so a custom mat always
 *  matches exactly. */
export function resolveMatColor(setting: MatColorSetting, paletteBackground: string): string {
  if (setting === "auto") return getMatColor(paletteBackground);
  if (setting === "white") return "#FFFFFF";
  if (setting === "black") return "#0A0C0D";
  if (HEX_RE.test(setting)) return setting;
  return getMatColor(paletteBackground);
}

/** Resolves the "auto | hex" text color setting against a mat color. */
export function resolveTextColor(setting: string, matColor: string): string {
  if (setting === "auto" || !HEX_RE.test(setting)) return getTextColorForMat(matColor);
  return setting;
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir} / ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

/** Colophon line at the bottom edge of the mat. Credits OpenStreetMap (the
 *  license requires attribution) plus our own product name — deliberately
 *  NOT copying any other product's name/branding onto generated posters. */
export const ATTRIBUTION_TEXT = "© OPENSTREETMAP CONTRIBUTORS  ·  STRATAKORT";

// --- letter-spaced text measurement/drawing (manual, for cross-browser
// consistency — native canvas `letterSpacing` support is inconsistent) ---

function measureSpacedWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string,
  letterSpacingEm: number
): number {
  ctx.font = font;
  const sizeMatch = font.match(/(\d+(?:\.\d+)?)px/);
  const fontSize = sizeMatch ? parseFloat(sizeMatch[1]) : 16;
  const spacing = letterSpacingEm * fontSize;
  const chars = Array.from(text);
  if (chars.length === 0) return 0;
  const widths = chars.map((c) => ctx.measureText(c).width);
  return widths.reduce((a, w) => a + w, 0) + spacing * (chars.length - 1);
}

type Align = TextAlign;

/** Draws one line of letter-spaced text anchored at `x` per `align`
 *  (mirrors native ctx.textAlign semantics: left = start, right = end,
 *  center = midpoint). */
function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  letterSpacingEm: number,
  align: Align = "center"
) {
  ctx.font = font;
  const sizeMatch = font.match(/(\d+(?:\.\d+)?)px/);
  const fontSize = sizeMatch ? parseFloat(sizeMatch[1]) : 16;
  const spacing = letterSpacingEm * fontSize;
  const chars = Array.from(text);
  const widths = chars.map((c) => ctx.measureText(c).width);
  const totalWidth = widths.reduce((a, w) => a + w, 0) + spacing * (chars.length - 1);

  let startX = x;
  if (align === "center") startX = x - totalWidth / 2;
  else if (align === "right") startX = x - totalWidth;

  const prevAlign = ctx.textAlign;
  ctx.textAlign = "left";
  let cursor = startX;
  chars.forEach((c, i) => {
    ctx.fillText(c, cursor, y);
    cursor += widths[i] + spacing;
  });
  ctx.textAlign = prevAlign;
}

/** Greedy word-wrap for letter-spaced text, capped at `maxLines` (extra
 *  content is truncated with an ellipsis on the last line). */
function wrapSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font: string,
  letterSpacingEm: number,
  maxLines = 3
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (measureSpacedWidth(ctx, candidate, font, letterSpacingEm) <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (current) lines.push(current);

  // If words remain unconsumed (we broke early at maxLines), ellipsize.
  const consumed = lines.join(" ").split(/\s+/).length;
  if (consumed < words.length) {
    let last = lines[lines.length - 1];
    while (
      measureSpacedWidth(ctx, `${last}…`, font, letterSpacingEm) > maxWidth &&
      last.length > 1
    ) {
      last = last.slice(0, -1);
    }
    lines[lines.length - 1] = `${last}…`;
  }
  return lines;
}

/**
 * Draws the full poster (map crop + frame + typography + marker) onto a
 * canvas 2D context at the given pixel size. `mapSource` is the live
 * MapLibre canvas (captured via preserveDrawingBuffer).
 */
export function drawPoster(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mapSource: HTMLCanvasElement,
  state: Pick<EditorState, "palette" | "typography" | "poster" | "location" | "effects">
) {
  const { palette, typography, poster, location, effects } = state;
  const scale = width / 1000; // design at 1000px-wide reference, then scale
  const floating = poster.overlayStyle === "floating";

  ctx.clearRect(0, 0, width, height);

  // Outer paper background — echoes a physical mat/border behind the print.
  // In floating mode this is mostly covered by the near-full-bleed map; only
  // a thin edge (if any padding is set) shows it.
  const matColor = resolveMatColor(poster.matColor, palette.background);
  ctx.fillStyle = matColor;
  ctx.fillRect(0, 0, width, height);

  const { mapRect, textBlockHeight, padding } = computePosterLayout(
    width,
    height,
    poster.padding,
    poster.overlayStyle
  );

  const textColor = resolveTextColor(typography.textColor, matColor);
  const fontPair = FONT_PAIRS[typography.fontPair];
  const baseTitleSize = 46 * scale * typography.fontSizeScale;
  const letterSpacing = typography.letterSpacing;
  const align: Align = typography.textAlign;
  const anchorX = align === "left" ? mapRect.x : align === "right" ? mapRect.x + mapRect.w : width / 2;
  const dividerAnchorX = mapRect.x + mapRect.w / 2;

  // --- Map image: cover-fit crop into mapRect, with the chosen filter ---
  ctx.save();
  ctx.beginPath();
  ctx.rect(mapRect.x, mapRect.y, mapRect.w, mapRect.h);
  ctx.clip();

  const srcW = mapSource.width;
  const srcH = mapSource.height;
  const srcRatio = srcW / srcH;
  const dstRatio = mapRect.w / mapRect.h;
  let drawW: number, drawH: number, dx: number, dy: number;
  if (srcRatio > dstRatio) {
    drawH = mapRect.h;
    drawW = drawH * srcRatio;
    dx = mapRect.x - (drawW - mapRect.w) / 2;
    dy = mapRect.y;
  } else {
    drawW = mapRect.w;
    drawH = drawW / srcRatio;
    dx = mapRect.x;
    dy = mapRect.y - (drawH - mapRect.h) / 2;
  }
  ctx.fillStyle = palette.background;
  ctx.fillRect(mapRect.x, mapRect.y, mapRect.w, mapRect.h);

  const filterCss = MAP_FILTERS[effects.filter]?.css ?? "none";
  const supportsCtxFilter = "filter" in ctx;
  if (supportsCtxFilter) (ctx as any).filter = filterCss;
  ctx.drawImage(mapSource, dx, dy, drawW, drawH);
  if (supportsCtxFilter) (ctx as any).filter = "none";

  // Center marker (drawn crisp, above the filtered map image)
  if (poster.showMarker) {
    const cx = mapRect.x + mapRect.w / 2;
    const cy = mapRect.y + mapRect.h / 2;
    ctx.strokeStyle = palette.labels;
    ctx.fillStyle = palette.labels;
    ctx.lineWidth = 2 * scale;
    const r = 7 * scale;
    if (poster.markerStyle === "dot") {
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    } else if (poster.markerStyle === "ring") {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
    } else if (poster.markerStyle === "crosshair") {
      ctx.beginPath();
      ctx.moveTo(cx - r * 1.6, cy);
      ctx.lineTo(cx + r * 1.6, cy);
      ctx.moveTo(cx, cy - r * 1.6);
      ctx.lineTo(cx, cy + r * 1.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    } else if (poster.markerStyle === "pin") {
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.6, r * 0.7, 0, Math.PI * 2);
      ctx.moveTo(cx - r * 0.55, cy - r * 0.35);
      ctx.lineTo(cx, cy + r * 1.1);
      ctx.lineTo(cx + r * 0.55, cy - r * 0.35);
      ctx.closePath();
      ctx.fill();
    }
  }

  // --- Floating overlay: gradient scrim + typography, drawn while still
  // clipped to mapRect so text/scrim never spill past the map crop. ---
  if (floating) {
    const zoneHeight = getFloatingZoneHeight(mapRect, scale);
    const zoneTop = mapRect.y + mapRect.h - zoneHeight;
    const scrimRgb = getScrimRgb(textColor);

    const gradient = ctx.createLinearGradient(0, zoneTop, 0, mapRect.y + mapRect.h);
    gradient.addColorStop(0, `rgba(${scrimRgb}, 0)`);
    gradient.addColorStop(0.45, `rgba(${scrimRgb}, 0.45)`);
    gradient.addColorStop(1, `rgba(${scrimRgb}, 0.82)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(mapRect.x, zoneTop, mapRect.w, zoneHeight);

    let cursorY = zoneTop + zoneHeight * 0.4;
    ctx.textAlign = "center";
    ctx.fillStyle = textColor;

    if (typography.title.trim()) {
      drawSpacedText(
        ctx,
        typography.title.toUpperCase(),
        anchorX,
        cursorY,
        `${typography.fontWeight} ${baseTitleSize}px ${fontPair.title}`,
        letterSpacing,
        align
      );
      cursorY += baseTitleSize * 0.95;
    }

    if (typography.subtitle.trim()) {
      const subSize = baseTitleSize * 0.32;
      const subFont = `italic 500 ${subSize}px ${fontPair.body}`;
      drawSpacedText(ctx, typography.subtitle.toUpperCase(), anchorX, cursorY, subFont, 0.22, align);
      cursorY += subSize * 1.9;
    }

    if (typography.showCoordinates) {
      const coordSize = baseTitleSize * 0.24;
      const coordText = formatCoordinates(location.latitude, location.longitude);
      const coordFont = `400 ${coordSize}px ${fontPair.body}`;
      drawSpacedText(ctx, coordText, anchorX, cursorY, coordFont, 0.1, align);
    }

    if (poster.showAttribution) {
      const attrSize = baseTitleSize * 0.15;
      const attrY = mapRect.y + mapRect.h - padding - attrSize * 0.9;
      ctx.globalAlpha = 0.6;
      drawSpacedText(
        ctx,
        ATTRIBUTION_TEXT,
        mapRect.x + mapRect.w / 2,
        attrY,
        `400 ${attrSize}px ${fontPair.body}`,
        0.08,
        "center"
      );
      ctx.globalAlpha = 1;
    }
  }

  ctx.restore();

  // --- Frame ---
  if (poster.frame !== "none") {
    ctx.strokeStyle = palette.labels;
    ctx.lineWidth = 1.5 * scale;
    ctx.strokeRect(mapRect.x, mapRect.y, mapRect.w, mapRect.h);
    if (poster.frame === "double") {
      const inset = 6 * scale;
      ctx.lineWidth = 1 * scale;
      ctx.strokeRect(
        mapRect.x + inset,
        mapRect.y + inset,
        mapRect.w - inset * 2,
        mapRect.h - inset * 2
      );
    }
  }

  // --- Framed typography block (skipped entirely in floating mode — that
  // content was already drawn inside the map clip above) ---
  if (!floating) {
    let cursorY = mapRect.y + mapRect.h + textBlockHeight * 0.36;

    ctx.textAlign = "center";
    ctx.fillStyle = textColor;

    if (typography.title.trim()) {
      drawSpacedText(
        ctx,
        typography.title.toUpperCase(),
        anchorX,
        cursorY,
        `${typography.fontWeight} ${baseTitleSize}px ${fontPair.title}`,
        letterSpacing,
        align
      );
      cursorY += baseTitleSize * 0.95;
    }

    if (typography.subtitle.trim()) {
      const subSize = baseTitleSize * 0.32;
      const subFont = `italic 500 ${subSize}px ${fontPair.body}`;
      drawSpacedText(ctx, typography.subtitle.toUpperCase(), anchorX, cursorY, subFont, 0.22, align);
      cursorY += subSize * 1.9;
    }

    // hairline divider
    const dividerW = width * 0.06;
    ctx.strokeStyle = textColor;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(dividerAnchorX - dividerW / 2, cursorY);
    ctx.lineTo(dividerAnchorX + dividerW / 2, cursorY);
    ctx.stroke();
    ctx.globalAlpha = 1;
    cursorY += baseTitleSize * 0.42;

    if (typography.showCoordinates) {
      const coordSize = baseTitleSize * 0.24;
      const coordText = formatCoordinates(location.latitude, location.longitude);
      const coordFont = `400 ${coordSize}px ${fontPair.body}`;
      drawSpacedText(ctx, coordText, anchorX, cursorY, coordFont, 0.1, align);
      cursorY += coordSize * 1.6;
    }

    if (typography.quote.trim()) {
      const quoteSize = baseTitleSize * 0.23;
      const quoteFont = `italic 400 ${quoteSize}px ${fontPair.body}`;
      const maxWidth = mapRect.w * 0.82;
      const lines = wrapSpacedText(ctx, typography.quote, maxWidth, quoteFont, 0.02, 3);
      ctx.globalAlpha = 0.78;
      for (const line of lines) {
        drawSpacedText(ctx, line, anchorX, cursorY, quoteFont, 0.02, align);
        cursorY += quoteSize * 1.5;
      }
      ctx.globalAlpha = 1;
    }

    // --- Attribution colophon: fixed to the bottom edge, independent of how
    // much content is above it (title/quote length shouldn't push it around).
    if (poster.showAttribution) {
      const attrSize = baseTitleSize * 0.15;
      const attrY = height - padding - attrSize * 0.9;
      ctx.globalAlpha = 0.5;
      drawSpacedText(
        ctx,
        ATTRIBUTION_TEXT,
        width / 2,
        attrY,
        `400 ${attrSize}px ${fontPair.body}`,
        0.08,
        "center"
      );
      ctx.globalAlpha = 1;
    }
  }

  // --- Grain / texture overlay (paper-print feel, over the whole poster) ---
  drawGrainOverlay(ctx, width, height, effects.grain);
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}

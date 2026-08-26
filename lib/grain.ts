// Procedural film-grain texture, generated once and reused everywhere
// (live CSS overlay + canvas export) so a "gallery print" feel doesn't cost
// a network request or a bundled asset.

const TILE_SIZE = 160;
let cachedTileCanvas: HTMLCanvasElement | null = null;

/** A small tileable canvas of random per-pixel noise, generated once. */
function getNoiseTile(): HTMLCanvasElement {
  if (cachedTileCanvas) return cachedTileCanvas;
  const canvas = document.createElement("canvas");
  canvas.width = TILE_SIZE;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(TILE_SIZE, TILE_SIZE);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    imageData.data[i] = v;
    imageData.data[i + 1] = v;
    imageData.data[i + 2] = v;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  cachedTileCanvas = canvas;
  return canvas;
}

/** Data URL of the noise tile, for use as a CSS `background-image` in the
 *  live preview (tiled via `background-repeat: repeat`). */
export function getGrainTileDataUrl(): string {
  return getNoiseTile().toDataURL("image/png");
}

/** Draws the grain texture over the given canvas region using an 'overlay'
 *  blend so it darkens/lightens rather than flattening the artwork beneath
 *  — the same visual effect as the CSS `mix-blend-mode: overlay` used in
 *  the live preview. `intensity` is 0-100. */
export function drawGrainOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
) {
  if (intensity <= 0) return;
  const tile = getNoiseTile();
  const pattern = ctx.createPattern(tile, "repeat");
  if (!pattern) return;

  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = Math.min(1, (intensity / 100) * 0.5);
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

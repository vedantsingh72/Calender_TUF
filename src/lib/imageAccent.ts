export type AccentTheme = {
  accentRgb: string;
  contrastText: string;
  wallGlowRgb: string;
  wallDeepRgb: string;
};

const FALLBACK: AccentTheme = {
  accentRgb: "rgb(56, 189, 248)",
  contrastText: "#ffffff",
  wallGlowRgb: "rgb(30, 41, 59)",
  wallDeepRgb: "rgb(15, 23, 42)",
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function relativeLuminance(r: number, g: number, b: number): number {
  return (r * 320 + g * 620 + b * 160) / 1000;
}

function rgbToString(r: number, g: number, b: number): string {
  return `rgb(${r}, ${g}, ${b})`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const lightness = (max + min) / 2;
  let s = 0;
  const d = max - min;
  if (d !== 0) {
    s = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [h * 360, s, lightness];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 1);
  l = clamp(l, 0, 1);
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rp = 0;
  let gp = 0;
  let bp = 0;
  if (h < 60) {
    rp = c;
    gp = x;
  } else if (h < 120) {
    rp = x;
    gp = c;
  } else if (h < 180) {
    gp = c;
    bp = x;
  } else if (h < 240) {
    gp = x;
    bp = c;
  } else if (h < 300) {
    rp = x;
    bp = c;
  } else {
    rp = c;
    bp = x;
  }
  return [
    Math.round((rp + m) * 255),
    Math.round((gp + m) * 255),
    Math.round((bp + m) * 255),
  ];
}

function accentFromAveragedRgb(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  const [h, s, l] = rgbToHsl(r, g, b);
  const saturation = s < 0.12 ? Math.max(s, 0.4) : clamp(s * 1.38, 0.26, 0.92);
  const lightness = clamp(l * 0.9 + 0.07, 0.38, 0.58);
  return hslToRgb(h, saturation, lightness);
}

function wallDeepFromAverage(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  const [h, s, l] = rgbToHsl(r, g, b);
  const saturation = clamp(s * 0.58 + 0.1, 0.18, 0.52);
  const lightness = clamp(l * 0.14 + 0.06, 0.07, 0.14);
  return hslToRgb(h, saturation, lightness);
}

function wallGlowFromAverage(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  const [h, s, l] = rgbToHsl(r, g, b);
  const saturation = clamp(s * 0.62 + 0.08, 0.22, 0.5);
  const lightness = clamp(l * 0.28 + 0.14, 0.2, 0.32);
  return hslToRgb(h, saturation, lightness);
}

export function accentThemeFromImageData(imageData: ImageData): AccentTheme {
  const pixels = imageData.data;
  let r = 0;
  let g = 0;
  let b = 0;
  let totalWeight = 0;

  for (let i = 0; i < pixels.length; i += 16) {
    if (pixels[i + 3] < 200) continue;
    const pr = pixels[i];
    const pg = pixels[i + 1];
    const pb = pixels[i + 2];
    const chroma = Math.max(pr, pg, pb) - Math.min(pr, pg, pb);
    const weight = 1 + (chroma / 255) * 2.35;
    r += pr * weight;
    g += pg * weight;
    b += pb * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return FALLBACK;

  const ar = Math.round(r / totalWeight);
  const ag = Math.round(g / totalWeight);
  const ab = Math.round(b / totalWeight);
  const [vr, vg, vb] = accentFromAveragedRgb(ar, ag, ab);
  const accentRgb = rgbToString(vr, vg, vb);
  const contrastText = relativeLuminance(vr, vg, vb) < 150 ? "#ffffff" : "#0f172a";

  const [dr, dg, db] = wallDeepFromAverage(ar, ag, ab);
  const [gr, gg, gb] = wallGlowFromAverage(ar, ag, ab);

  return {
    accentRgb,
    contrastText,
    wallDeepRgb: rgbToString(dr, dg, db),
    wallGlowRgb: rgbToString(gr, gg, gb),
  };
}

export const ACCENT_THEME_FALLBACK = FALLBACK;

import { useEffect, useState } from "react";
import {
  ACCENT_THEME_FALLBACK,
  type AccentTheme,
  accentThemeFromImageData,
} from "@/lib/imageAccent";

function themesEqual(a: AccentTheme, b: AccentTheme): boolean {
  return (
    a.accentRgb === b.accentRgb &&
    a.contrastText === b.contrastText &&
    a.wallDeepRgb === b.wallDeepRgb &&
    a.wallGlowRgb === b.wallGlowRgb
  );
}

// In night mode, sample the hero art and push accent + wall tints onto :root.
export function useDynamicTheme(imageUrl: string, active: boolean): AccentTheme {
  const [theme, setTheme] = useState<AccentTheme>(ACCENT_THEME_FALLBACK);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.src = imageUrl;

    image.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        const maxSide = 96;
        const w = image.naturalWidth;
        const h = image.naturalHeight;
        const scale = w > h ? maxSide / w : maxSide / h;
        canvas.width = Math.max(8, Math.round(w * scale));
        canvas.height = Math.max(8, Math.round(h * scale));
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2d context unavailable");

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const next = accentThemeFromImageData(
          ctx.getImageData(0, 0, canvas.width, canvas.height),
        );
        setTheme((prev) => (themesEqual(prev, next) ? prev : next));
      } catch {
        setTheme(ACCENT_THEME_FALLBACK);
      }
    };

    image.onerror = () => {
      if (!cancelled) setTheme(ACCENT_THEME_FALLBACK);
    };

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  useEffect(() => {
    const root = document.documentElement;
    if (!active) {
      root.style.removeProperty("--accent-color");
      root.style.removeProperty("--on-accent-color");
      root.style.removeProperty("--wall-deep");
      root.style.removeProperty("--wall-glow");
      root.style.removeProperty("--bg-color");
      return;
    }
    root.style.setProperty("--accent-color", theme.accentRgb);
    root.style.setProperty("--on-accent-color", theme.contrastText);
    root.style.setProperty("--wall-deep", theme.wallDeepRgb);
    root.style.setProperty("--wall-glow", theme.wallGlowRgb);
    root.style.setProperty("--bg-color", theme.wallDeepRgb);
  }, [theme, active, imageUrl]);

  return theme;
}

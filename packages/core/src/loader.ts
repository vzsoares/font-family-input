/**
 * Generic, system-font-aware Google Fonts stylesheet loader.
 *
 * Ported from the original Alpine prototype: extracts the first family name,
 * skips system/generic fonts that don't exist on Google Fonts, dedups by a
 * stable element id, and injects a `<link>` to the Google Fonts CSS2 endpoint.
 *
 * SSR-safe: no-ops when `document` is unavailable.
 */

/** Generic / system families that should never be requested from Google Fonts. */
export const DEFAULT_SYSTEM_FONTS: readonly string[] = [
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
  "ui-rounded",
  "system-ui",
  "sans-serif",
  "serif",
  "monospace",
  "cursive",
  "fantasy",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Helvetica",
  "Arial",
  "Georgia",
  "Times New Roman",
  "Times",
  "Courier New",
  "Impact",
  "Haettenschweiler",
  "Arial Narrow Bold",
];

export type FontDisplay = "auto" | "block" | "swap" | "fallback" | "optional";

export interface GoogleFontLoaderOptions {
  /** `font-display` strategy passed to the Google Fonts request. Default `swap`. */
  display?: FontDisplay;
  /** Override the list of families to skip. Default {@link DEFAULT_SYSTEM_FONTS}. */
  systemFonts?: readonly string[];
  /** Prefix for the injected element id (for dedup + cleanup). */
  idPrefix?: string;
  /** Override the document target (for iframes / testing). */
  target?: Document;
}

/** Extract the first concrete family name from a CSS font-family value. */
export function firstFamilyName(family: string): string {
  const first = family.split(",")[0] ?? family;
  return first.trim().replace(/['"]/g, "");
}

/** Stable, DOM-safe element id for a given family. */
function fontElementId(prefix: string, name: string): string {
  return `${prefix}${name.replace(/\s+/g, "-").toLowerCase()}`;
}

/**
 * Build a {@link FontProvider} `loadFont` implementation that injects Google
 * Fonts stylesheets on demand.
 */
export function createGoogleFontLoader(
  options: GoogleFontLoaderOptions = {},
): (family: string) => void {
  const display = options.display ?? "swap";
  const systemFonts = options.systemFonts ?? DEFAULT_SYSTEM_FONTS;
  const idPrefix = options.idPrefix ?? "ffi-font-";
  const systemSet = new Set(systemFonts.map((f) => f.toLowerCase()));

  return function loadFont(family: string): void {
    const doc = options.target ?? (typeof document !== "undefined" ? document : undefined);
    if (!doc) return;

    const name = firstFamilyName(family);
    if (!name || systemSet.has(name.toLowerCase())) return;

    const id = fontElementId(idPrefix, name);
    if (doc.getElementById(id)) return;

    const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(
      /%20/g,
      "+",
    )}&display=${display}`;

    const link = doc.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    doc.head.appendChild(link);
  };
}

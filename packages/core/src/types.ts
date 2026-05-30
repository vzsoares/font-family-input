/** Coarse Google Fonts category. Optional metadata on a {@link FontItem}. */
export type FontCategory = "serif" | "sans-serif" | "display" | "handwriting" | "monospace";

/** A single selectable font. `family` is the only required field. */
export interface FontItem {
  family: string;
  category?: FontCategory;
}

/**
 * Pluggable font source. The default is {@link googleFontsProvider}, but any
 * object satisfying this contract works — self-hosted, Bunny Fonts, Adobe, a
 * local `@font-face` catalog, etc.
 *
 * - `listFonts()` returns the selectable catalog (sync or async).
 * - `loadFont(family)` injects whatever CSS is needed to actually render
 *   `family` (e.g. a Google Fonts stylesheet). Called lazily for previews.
 */
export interface FontProvider {
  listFonts(): FontItem[] | Promise<FontItem[]>;
  loadFont(family: string): void | Promise<void>;
}

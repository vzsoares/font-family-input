import { GOOGLE_FONTS } from "../data/google-fonts";
import { type GoogleFontLoaderOptions, createGoogleFontLoader } from "../loader";
import type { FontItem, FontProvider } from "../types";

export interface GoogleFontsProviderOptions extends GoogleFontLoaderOptions {
  /** Override the bundled catalog (e.g. the full live Google Fonts list). */
  fonts?: readonly FontItem[];
}

/**
 * Default {@link FontProvider}: serves the bundled curated Google Fonts catalog
 * and lazily injects Google Fonts stylesheets via {@link createGoogleFontLoader}.
 *
 * @example
 * ```ts
 * const provider = googleFontsProvider();
 * const provider = googleFontsProvider({ display: "optional" });
 * const provider = googleFontsProvider({ fonts: myFullCatalog });
 * ```
 */
export function googleFontsProvider(options: GoogleFontsProviderOptions = {}): FontProvider {
  const { fonts = GOOGLE_FONTS, ...loaderOptions } = options;
  const loadFont = createGoogleFontLoader(loaderOptions);
  const catalog = [...fonts];

  return {
    listFonts: () => catalog,
    loadFont,
  };
}

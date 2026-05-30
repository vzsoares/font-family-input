// @font-family-input/html — a <font-family-input> custom element.

export { FontFamilyInput } from "./element";
export { defineFontFamilyInput } from "./define";

// Re-exported core conveniences for configuring providers.
export {
  createGoogleFontLoader,
  GOOGLE_FONTS,
  googleFontsApiProvider,
  googleFontsProvider,
  type FontCategory,
  type FontItem,
  type FontProvider,
  type GoogleFontsApiProviderOptions,
  type GoogleFontsProviderOptions,
} from "@font-family-input/core";

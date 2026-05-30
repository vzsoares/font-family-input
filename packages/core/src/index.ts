// @font-family-input/core — public API surface.

// Types
export type { FontCategory, FontItem, FontProvider } from "./types";

// Font loading + providers
export {
  createGoogleFontLoader,
  DEFAULT_SYSTEM_FONTS,
  firstFamilyName,
  type FontDisplay,
  type GoogleFontLoaderOptions,
} from "./loader";
export { GOOGLE_FONTS } from "./data/google-fonts";
export {
  googleFontsProvider,
  type GoogleFontsProviderOptions,
} from "./providers/google";
export {
  googleFontsApiProvider,
  type GoogleFontsApiProviderOptions,
  type GoogleFontsSort,
} from "./providers/google-api";

// Filtering
export { defaultFilter, type FontFilter } from "./filter";

// Headless store
export {
  createFontInput,
  type FontInputOptions,
  type FontInputState,
  type FontInputStore,
} from "./store";

// Keyboard
export {
  handleComboboxKey,
  type KeyboardTarget,
  type KeyLike,
} from "./keyboard";

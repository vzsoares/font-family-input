// @font-family-input/vue — composable, unstyled, virtualized Vue primitives.

export { FontInputRoot } from "./components/Root";
export { FontInputTrigger } from "./components/Trigger";
export { FontInputContent } from "./components/Content";
export { FontInputSearch } from "./components/Search";
export { FontInputList } from "./components/List";
export { FontInputItem } from "./components/Item";
export { FontInputEmpty } from "./components/Empty";

// Composable + context escape hatch.
export { useFontInput, type UseFontInputOptions } from "./useFontInput";
export {
  useFontInputContext,
  FontInputKey,
  type FontInputContext,
  type FontInputIds,
} from "./context";

// Re-exported core conveniences.
export {
  createGoogleFontLoader,
  defaultFilter,
  GOOGLE_FONTS,
  googleFontsApiProvider,
  googleFontsProvider,
  type FontCategory,
  type FontFilter,
  type FontItem,
  type FontProvider,
  type GoogleFontsApiProviderOptions,
  type GoogleFontsProviderOptions,
} from "@font-family-input/core";

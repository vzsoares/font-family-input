// @font-family-input/preact — composable, unstyled, virtualized Preact primitives.

import { Content, Empty, Item, List, Portal, Root, Search, Trigger } from "./primitives";

export const FontInput = { Root, Trigger, Portal, Content, Search, List, Item, Empty };
export { Root, Trigger, Portal, Content, Search, List, Item, Empty };

export type {
  RootProps,
  TriggerProps,
  PortalProps,
  ContentProps,
  SearchProps,
  ListProps,
  ItemProps,
  EmptyProps,
} from "./primitives";

export { useFontInput, type UseFontInputProps } from "./useFontInput";
export {
  useFontInputContext,
  useItemContext,
  type FontInputContextValue,
  type FontInputIds,
  type ItemContextValue,
} from "./context";

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
} from "@font-family-input/core";

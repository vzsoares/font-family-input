// @font-family-input/react — composable, unstyled, virtualized React primitives.

import { Content } from "./primitives/Content";
import { Empty } from "./primitives/Empty";
import { Item } from "./primitives/Item";
import { List } from "./primitives/List";
import { Portal } from "./primitives/Portal";
import { Root } from "./primitives/Root";
import { Search } from "./primitives/Search";
import { Trigger } from "./primitives/Trigger";

/** Namespaced compound component: `<FontInput.Root>`, `<FontInput.Trigger>`, … */
export const FontInput = {
  Root,
  Trigger,
  Portal,
  Content,
  Search,
  List,
  Item,
  Empty,
};

// Individual primitives (for direct/aliased imports).
export { Root, Trigger, Portal, Content, Search, List, Item, Empty };

// Hook + context escape hatch.
export { useFontInput, type UseFontInputProps } from "./useFontInput";
export {
  useFontInputContext,
  useItemContext,
  type FontInputContextValue,
  type FontInputIds,
  type ItemContextValue,
} from "./context";

// Primitive prop types.
export type { FontInputRootProps } from "./primitives/Root";
export type { FontInputTriggerProps } from "./primitives/Trigger";
export type { FontInputPortalProps } from "./primitives/Portal";
export type { FontInputContentProps } from "./primitives/Content";
export type { FontInputSearchProps } from "./primitives/Search";
export type { FontInputListProps } from "./primitives/List";
export type { FontInputItemProps } from "./primitives/Item";
export type { FontInputEmptyProps } from "./primitives/Empty";

// Re-exported core conveniences.
export {
  createGoogleFontLoader,
  defaultFilter,
  GOOGLE_FONTS,
  googleFontsProvider,
  type FontCategory,
  type FontFilter,
  type FontItem,
  type FontProvider,
  type GoogleFontsProviderOptions,
} from "@font-family-input/core";

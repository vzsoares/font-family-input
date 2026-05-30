import type { ReactNode } from "react";
import { FontInputProvider } from "../context";
import { type UseFontInputProps, useFontInput } from "../useFontInput";

export interface FontInputRootProps extends UseFontInputProps {
  children: ReactNode;
}

/** Provider + state owner for the font picker. Renders no DOM of its own. */
export function Root({ children, ...props }: FontInputRootProps) {
  const ctx = useFontInput(props);
  return <FontInputProvider value={ctx}>{children}</FontInputProvider>;
}
Root.displayName = "FontInput.Root";

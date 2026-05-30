import type { HTMLAttributes } from "react";
import { useFontInputContext } from "../context";

export type FontInputEmptyProps = HTMLAttributes<HTMLDivElement>;

/** Renders its children only when the filtered catalog is empty (and loaded). */
export function Empty({ children, ...rest }: FontInputEmptyProps) {
  const { state } = useFontInputContext("Empty");
  if (state.loading || state.filtered.length > 0) return null;
  return <div {...rest}>{children}</div>;
}
Empty.displayName = "FontInput.Empty";

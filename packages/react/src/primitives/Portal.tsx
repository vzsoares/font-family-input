import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface FontInputPortalProps {
  children: ReactNode;
  /** Mount target. Defaults to `document.body`. */
  container?: Element | null;
}

/** Renders its children into a DOM node outside the React tree (SSR-safe). */
export function Portal({ children, container }: FontInputPortalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, container ?? document.body);
}
Portal.displayName = "FontInput.Portal";

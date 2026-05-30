import {
  Virtualizer,
  elementScroll,
  observeElementOffset,
  observeElementRect,
} from "@tanstack/virtual-core";
import type { RefObject } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

export interface UseVirtualizerOptions {
  count: number;
  scrollRef: RefObject<HTMLElement>;
  estimateSize: number;
  overscan: number;
}

/** Minimal Preact binding over `@tanstack/virtual-core`. */
export function useVirtualizer(
  options: UseVirtualizerOptions,
): Virtualizer<HTMLElement, HTMLElement> {
  const [, setTick] = useState(0);
  const rerender = () => setTick((n) => n + 1);

  const virtualizer = useMemo(
    () =>
      new Virtualizer<HTMLElement, HTMLElement>({
        count: options.count,
        getScrollElement: () => options.scrollRef.current,
        estimateSize: () => options.estimateSize,
        overscan: options.overscan,
        scrollToFn: elementScroll,
        observeElementRect,
        observeElementOffset,
        onChange: () => rerender(),
      }),
    // Create once; option updates happen below.
    [],
  );

  virtualizer.setOptions({
    ...virtualizer.options,
    count: options.count,
    getScrollElement: () => options.scrollRef.current,
    estimateSize: () => options.estimateSize,
    overscan: options.overscan,
    onChange: () => rerender(),
  });

  useEffect(() => virtualizer._didMount(), [virtualizer]);
  useEffect(() => {
    virtualizer._willUpdate();
  });

  return virtualizer;
}

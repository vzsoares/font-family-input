import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFontInput } from "./store";
import type { FontItem, FontProvider } from "./types";

const FONTS: FontItem[] = [
  { family: "Inter" },
  { family: "Roboto" },
  { family: "Lato" },
  { family: "Lobster" },
];

function makeProvider(overrides: Partial<FontProvider> = {}): FontProvider {
  return {
    listFonts: () => FONTS,
    loadFont: vi.fn(),
    ...overrides,
  };
}

describe("createFontInput", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  it("primes the catalog synchronously from the provider", () => {
    const store = createFontInput({ provider: makeProvider() });
    const s = store.getState();
    expect(s.loading).toBe(false);
    expect(s.fonts).toHaveLength(4);
    expect(s.filtered).toHaveLength(4);
  });

  it("resolves an async catalog", async () => {
    const store = createFontInput({
      provider: makeProvider({ listFonts: () => Promise.resolve(FONTS) }),
    });
    expect(store.getState().loading).toBe(true);
    await Promise.resolve();
    await Promise.resolve();
    expect(store.getState().loading).toBe(false);
    expect(store.getState().fonts).toHaveLength(4);
  });

  it("filters by search and resets highlight to first match", () => {
    const store = createFontInput({ provider: makeProvider() });
    store.setSearch("l");
    const s = store.getState();
    expect(s.filtered.map((f) => f.family)).toEqual(["Lato", "Lobster"]);
    expect(s.highlightedIndex).toBe(0);
  });

  it("highlights the selected value when opening", () => {
    const store = createFontInput({ provider: makeProvider(), defaultValue: "Lato" });
    store.open();
    expect(store.getState().highlightedIndex).toBe(2);
  });

  it("select fires onChange, sets value, and closes", () => {
    const onChange = vi.fn();
    const store = createFontInput({ provider: makeProvider(), onChange });
    store.open();
    store.select("Roboto");
    expect(onChange).toHaveBeenCalledWith("Roboto");
    expect(store.getState().value).toBe("Roboto");
    expect(store.getState().open).toBe(false);
  });

  it("setValue syncs without firing onChange", () => {
    const onChange = vi.fn();
    const store = createFontInput({ provider: makeProvider(), onChange });
    store.setValue("Inter");
    expect(store.getState().value).toBe("Inter");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("clamps highlight within bounds", () => {
    const store = createFontInput({ provider: makeProvider() });
    store.open();
    store.highlightBy(-5);
    expect(store.getState().highlightedIndex).toBe(0);
    store.highlightLast();
    expect(store.getState().highlightedIndex).toBe(3);
    store.highlightBy(5);
    expect(store.getState().highlightedIndex).toBe(3);
  });

  it("notifies subscribers and stops after destroy", () => {
    const store = createFontInput({ provider: makeProvider() });
    const listener = vi.fn();
    const unsub = store.subscribe(listener);
    store.open();
    expect(listener).toHaveBeenCalledTimes(1);
    unsub();
    store.close();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

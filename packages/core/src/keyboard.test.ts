import { describe, expect, it, vi } from "vitest";
import { type KeyboardTarget, handleComboboxKey } from "./keyboard";

function makeTarget(open: boolean): KeyboardTarget & {
  open: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
  highlightBy: ReturnType<typeof vi.fn>;
  highlightFirst: ReturnType<typeof vi.fn>;
  highlightLast: ReturnType<typeof vi.fn>;
  selectHighlighted: ReturnType<typeof vi.fn>;
} {
  return {
    isOpen: () => open,
    open: vi.fn(),
    close: vi.fn(),
    highlightBy: vi.fn(),
    highlightFirst: vi.fn(),
    highlightLast: vi.fn(),
    selectHighlighted: vi.fn(),
  };
}

describe("handleComboboxKey", () => {
  it("ArrowDown opens when closed", () => {
    const t = makeTarget(false);
    expect(handleComboboxKey(t, { key: "ArrowDown" })).toBe(true);
    expect(t.open).toHaveBeenCalled();
    expect(t.highlightBy).not.toHaveBeenCalled();
  });

  it("ArrowDown / ArrowUp move highlight when open", () => {
    const t = makeTarget(true);
    handleComboboxKey(t, { key: "ArrowDown" });
    handleComboboxKey(t, { key: "ArrowUp" });
    expect(t.highlightBy).toHaveBeenNthCalledWith(1, 1);
    expect(t.highlightBy).toHaveBeenNthCalledWith(2, -1);
  });

  it("Home / End jump when open", () => {
    const t = makeTarget(true);
    handleComboboxKey(t, { key: "Home" });
    handleComboboxKey(t, { key: "End" });
    expect(t.highlightFirst).toHaveBeenCalled();
    expect(t.highlightLast).toHaveBeenCalled();
  });

  it("Enter selects the highlighted option when open", () => {
    const t = makeTarget(true);
    expect(handleComboboxKey(t, { key: "Enter" })).toBe(true);
    expect(t.selectHighlighted).toHaveBeenCalled();
  });

  it("Enter is a no-op when closed", () => {
    const t = makeTarget(false);
    expect(handleComboboxKey(t, { key: "Enter" })).toBe(false);
    expect(t.selectHighlighted).not.toHaveBeenCalled();
  });

  it("Escape closes when open", () => {
    const t = makeTarget(true);
    expect(handleComboboxKey(t, { key: "Escape" })).toBe(true);
    expect(t.close).toHaveBeenCalled();
  });

  it("Tab closes but does not consume the event", () => {
    const t = makeTarget(true);
    expect(handleComboboxKey(t, { key: "Tab" })).toBe(false);
    expect(t.close).toHaveBeenCalled();
  });
});

import type { FontProvider } from "@font-family-input/core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineFontFamilyInput } from "./define";
import { FontFamilyInput } from "./element";

defineFontFamilyInput();

const provider: FontProvider = {
  listFonts: () => [{ family: "Inter" }, { family: "Roboto Mono" }, { family: "Lobster" }],
  loadFont: vi.fn(),
};

function mount(): FontFamilyInput {
  const el = document.createElement("font-family-input") as FontFamilyInput;
  el.provider = provider;
  document.body.appendChild(el);
  return el;
}

function part(el: FontFamilyInput, name: string): HTMLElement {
  const root = el.shadowRoot;
  if (!root) throw new Error("no shadow root");
  const node = root.querySelector<HTMLElement>(`[part="${name}"]`);
  if (!node) throw new Error(`missing part ${name}`);
  return node;
}

describe("<font-family-input>", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("registers the custom element", () => {
    expect(customElements.get("font-family-input")).toBe(FontFamilyInput);
  });

  it("renders a trigger with the placeholder", () => {
    const el = mount();
    el.setAttribute("placeholder", "Pick one");
    expect(part(el, "value").textContent).toBe("Pick one");
  });

  it("opens on trigger click and renders options", () => {
    const el = mount();
    expect(part(el, "content").hidden).toBe(true);
    part(el, "trigger").click();
    expect(part(el, "content").hidden).toBe(false);
    const options = el.shadowRoot?.querySelectorAll('[role="option"]');
    expect(options?.length ?? 0).toBeGreaterThan(0);
  });

  it("filters when typing in the search box (Empty state)", () => {
    const el = mount();
    part(el, "trigger").click();
    const search = part(el, "search") as HTMLInputElement;
    search.value = "zzz-no-match";
    search.dispatchEvent(new Event("input"));
    expect(part(el, "empty").hidden).toBe(false);
    search.value = "inter";
    search.dispatchEvent(new Event("input"));
    expect(part(el, "empty").hidden).toBe(true);
  });

  it("selects via the keyboard, updates value, and emits change", () => {
    const el = mount();
    const onChange = vi.fn();
    el.addEventListener("change", onChange);
    part(el, "trigger").click();
    const search = part(el, "search");
    // Open highlights index 0 (Inter); ArrowDown -> index 1 (Roboto Mono).
    search.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    search.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(el.value).toBe("Roboto Mono");
    expect(el.getAttribute("value")).toBe("Roboto Mono");
    expect(onChange).toHaveBeenCalledOnce();
    expect(part(el, "content").hidden).toBe(true);
  });

  it("reflects the value attribute into the selection", () => {
    const el = document.createElement("font-family-input") as FontFamilyInput;
    el.setAttribute("value", "Lobster");
    el.provider = provider;
    document.body.appendChild(el);
    expect(el.value).toBe("Lobster");
    expect(part(el, "value").textContent).toBe("Lobster");
  });
});

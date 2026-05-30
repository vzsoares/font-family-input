import { FontFamilyInput } from "./element";

/**
 * Register the `<font-family-input>` custom element. Safe to call multiple
 * times — it no-ops if the tag is already defined.
 */
export function defineFontFamilyInput(tagName = "font-family-input"): void {
  if (typeof customElements === "undefined") return;
  if (!customElements.get(tagName)) {
    customElements.define(tagName, FontFamilyInput);
  }
}

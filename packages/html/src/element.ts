import {
  type FontInputStore,
  type FontProvider,
  type KeyboardTarget,
  createFontInput,
  handleComboboxKey,
} from "@font-family-input/core";

const TEMPLATE = `
<style>
  :host { display: inline-block; position: relative; }
  [part="trigger"] {
    all: unset; box-sizing: border-box; cursor: pointer; display: inline-flex;
    align-items: center; justify-content: space-between; gap: 8px;
  }
  [part="content"] { position: absolute; box-sizing: border-box; }
  [part="content"][hidden] { display: none; }
  [part="list"] { overflow: auto; }
  [part="option"] { cursor: pointer; box-sizing: border-box; }
</style>
<button part="trigger" type="button" aria-haspopup="listbox">
  <span part="value"></span>
</button>
<div part="content" hidden role="presentation">
  <input part="search" type="text" role="combobox" autocomplete="off"
         aria-autocomplete="list" placeholder="Search fonts…" />
  <div part="list" role="listbox">
    <div part="viewport"></div>
  </div>
  <div part="empty" hidden></div>
</div>
`;

const DEFAULT_ROW_HEIGHT = 36;
const OVERSCAN = 8;

/**
 * `<font-family-input>` — a framework-agnostic custom element wrapping the
 * headless core. Styleable via `::part(trigger|value|content|search|list|
 * option|empty)`. Emits a `change` CustomEvent with `{ value }` on selection.
 *
 * The list is virtualized with fixed-height windowing; set the row height via
 * the `row-height` attribute (default 36px) to match your option styling.
 *
 * @example
 * ```html
 * <font-family-input value="Inter" placeholder="Pick a font"></font-family-input>
 * ```
 */
export class FontFamilyInput extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["value", "placeholder", "row-height"];
  }

  #store: FontInputStore | null = null;
  #unsubscribe: (() => void) | null = null;
  #provider: FontProvider | undefined;

  #root!: ShadowRoot;
  #trigger!: HTMLButtonElement;
  #valueEl!: HTMLElement;
  #content!: HTMLDivElement;
  #search!: HTMLInputElement;
  #list!: HTMLDivElement;
  #viewport!: HTMLDivElement;
  #empty!: HTMLDivElement;

  /** Set a custom {@link FontProvider}. Re-initializes if already connected. */
  set provider(provider: FontProvider | undefined) {
    this.#provider = provider;
    if (this.isConnected) this.#initStore();
  }
  get provider(): FontProvider | undefined {
    return this.#provider;
  }

  /** The selected font family. */
  get value(): string {
    return this.#store?.getState().value ?? this.getAttribute("value") ?? "";
  }
  set value(next: string) {
    this.#store?.setValue(next);
    this.#reflectValue(next);
  }

  get #rowHeight(): number {
    const raw = Number(this.getAttribute("row-height"));
    return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_ROW_HEIGHT;
  }

  connectedCallback(): void {
    if (!this.#root) this.#renderShell();
    this.#initStore();
  }

  disconnectedCallback(): void {
    this.#unsubscribe?.();
    this.#store?.destroy();
    this.#store = null;
    document.removeEventListener("pointerdown", this.#onDocPointerDown);
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    if (
      name === "value" &&
      this.#store &&
      value !== null &&
      value !== this.#store.getState().value
    ) {
      this.#store.setValue(value);
    }
    if (name === "placeholder") this.#renderValue();
    if (name === "row-height") this.#renderList();
  }

  #renderShell(): void {
    this.#root = this.attachShadow({ mode: "open" });
    this.#root.innerHTML = TEMPLATE;
    this.#trigger = this.#q<HTMLButtonElement>("trigger");
    this.#valueEl = this.#q("value");
    this.#content = this.#q<HTMLDivElement>("content");
    this.#search = this.#q<HTMLInputElement>("search");
    this.#list = this.#q<HTMLDivElement>("list");
    this.#viewport = this.#q<HTMLDivElement>("viewport");
    this.#empty = this.#q<HTMLDivElement>("empty");

    this.#trigger.addEventListener("click", () => this.#store?.toggle());
    this.#trigger.addEventListener("keydown", (e) => this.#onKeydown(e));
    this.#search.addEventListener("input", () => this.#store?.setSearch(this.#search.value));
    this.#search.addEventListener("keydown", (e) => this.#onKeydown(e));
    this.#list.addEventListener("scroll", () => this.#renderList());
    document.addEventListener("pointerdown", this.#onDocPointerDown);
  }

  #q<T extends HTMLElement = HTMLElement>(part: string): T {
    const el = this.#root.querySelector<T>(`[part="${part}"]`);
    if (!el) throw new Error(`font-family-input: missing part "${part}"`);
    return el;
  }

  #initStore(): void {
    this.#unsubscribe?.();
    this.#store?.destroy();

    const store = createFontInput({
      provider: this.#provider,
      defaultValue: this.getAttribute("value") ?? "",
      onChange: (family) => {
        this.#reflectValue(family);
        this.dispatchEvent(new CustomEvent("change", { detail: { value: family }, bubbles: true }));
      },
      onOpenChange: (open) => this.#onOpenChange(open),
    });
    this.#store = store;
    this.#unsubscribe = store.subscribe(() => this.#sync());
    this.#sync();
  }

  #keyboardTarget(): KeyboardTarget {
    const store = this.#store;
    return {
      isOpen: () => store?.getState().open ?? false,
      open: () => store?.open(),
      close: () => store?.close(),
      highlightBy: (delta) => store?.highlightBy(delta),
      highlightFirst: () => store?.highlightFirst(),
      highlightLast: () => store?.highlightLast(),
      selectHighlighted: () => store?.selectHighlighted(),
    };
  }

  #onKeydown(event: KeyboardEvent): void {
    if (handleComboboxKey(this.#keyboardTarget(), event)) event.preventDefault();
  }

  #onDocPointerDown = (event: PointerEvent): void => {
    if (!this.#store?.getState().open) return;
    const path = event.composedPath();
    if (!path.includes(this.#content) && !path.includes(this.#trigger)) {
      this.#store.close();
    }
  };

  #onOpenChange(open: boolean): void {
    this.#content.hidden = !open;
    this.#trigger.setAttribute("aria-expanded", String(open));
    this.#trigger.setAttribute("data-state", open ? "open" : "closed");
    if (open) {
      queueMicrotask(() => {
        this.#search.focus();
        this.#renderList();
      });
    }
  }

  #sync(): void {
    const state = this.#store?.getState();
    if (!state) return;
    this.#renderValue();
    this.#scrollHighlightedIntoView();
    this.#renderList();
    this.#empty.hidden = state.loading || state.filtered.length > 0;
  }

  #renderValue(): void {
    const value = this.#store?.getState().value ?? "";
    const placeholder = this.getAttribute("placeholder") ?? "Select font…";
    this.#valueEl.textContent = value || placeholder;
    this.#trigger.style.fontFamily = value ? `"${value}"` : "";
    if (value) this.#trigger.removeAttribute("data-placeholder");
    else this.#trigger.setAttribute("data-placeholder", "");
  }

  #scrollHighlightedIntoView(): void {
    const state = this.#store?.getState();
    if (!state || state.highlightedIndex < 0) return;
    const rowHeight = this.#rowHeight;
    const top = state.highlightedIndex * rowHeight;
    const bottom = top + rowHeight;
    const viewTop = this.#list.scrollTop;
    const viewBottom = viewTop + this.#list.clientHeight;
    if (top < viewTop) this.#list.scrollTop = top;
    else if (bottom > viewBottom) this.#list.scrollTop = bottom - this.#list.clientHeight;
  }

  #renderList(): void {
    const state = this.#store?.getState();
    if (!state) return;
    const rowHeight = this.#rowHeight;
    const count = state.filtered.length;

    this.#viewport.style.height = `${count * rowHeight}px`;
    this.#viewport.style.position = "relative";
    this.#viewport.style.width = "100%";

    const viewportHeight = this.#list.clientHeight || count * rowHeight;
    const scrollTop = this.#list.scrollTop;
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN);
    const end = Math.min(count, Math.ceil((scrollTop + viewportHeight) / rowHeight) + OVERSCAN);

    const frag = document.createDocumentFragment();
    for (let i = start; i < end; i++) {
      const font = state.filtered[i];
      if (!font) continue;
      const option = document.createElement("div");
      option.setAttribute("part", "option");
      option.setAttribute("role", "option");
      option.dataset.index = String(i);
      option.style.position = "absolute";
      option.style.top = "0";
      option.style.left = "0";
      option.style.width = "100%";
      option.style.height = `${rowHeight}px`;
      option.style.transform = `translateY(${i * rowHeight}px)`;
      option.style.fontFamily = `"${font.family}"`;
      option.textContent = font.family;
      const selected = state.value === font.family;
      const highlighted = state.highlightedIndex === i;
      option.setAttribute("aria-selected", String(selected));
      if (selected) option.setAttribute("data-selected", "");
      if (highlighted) option.setAttribute("data-highlighted", "");
      option.addEventListener("click", () => this.#store?.select(font.family));
      option.addEventListener("mouseenter", () => this.#store?.highlight(i));
      frag.appendChild(option);
    }
    this.#viewport.replaceChildren(frag);
  }

  #reflectValue(value: string): void {
    if (this.getAttribute("value") !== value) this.setAttribute("value", value);
  }
}

import { type FontFilter, defaultFilter } from "./filter";
import { googleFontsProvider } from "./providers/google";
import type { FontItem, FontProvider } from "./types";

export interface FontInputState {
  /** Whether the listbox is open. */
  open: boolean;
  /** Current search query. */
  search: string;
  /** Currently selected family (empty string = none). */
  value: string;
  /** Full catalog from the provider. */
  fonts: readonly FontItem[];
  /** Catalog narrowed by {@link FontInputState.search}. */
  filtered: readonly FontItem[];
  /** Index into `filtered` of the active option, or -1 for none. */
  highlightedIndex: number;
  /** True while the provider's `listFonts()` promise is pending. */
  loading: boolean;
}

export interface FontInputOptions {
  /** Font source. Defaults to {@link googleFontsProvider}. */
  provider?: FontProvider;
  /** Initial selected family (uncontrolled). */
  defaultValue?: string;
  /** Called whenever the user selects a family. */
  onChange?: (family: string) => void;
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Override the search strategy. Defaults to a case-insensitive substring match. */
  filter?: FontFilter;
  /** Load the font stylesheet as options become highlighted (live preview). Default true. */
  loadOnHighlight?: boolean;
}

export interface FontInputStore {
  getState(): FontInputState;
  subscribe(listener: () => void): () => void;
  open(): void;
  close(): void;
  toggle(): void;
  setSearch(query: string): void;
  /** Sync the selected value without firing `onChange` (for controlled usage). */
  setValue(family: string): void;
  highlight(index: number): void;
  highlightBy(delta: number): void;
  highlightFirst(): void;
  highlightLast(): void;
  select(family: string): void;
  selectHighlighted(): void;
  loadFont(family: string): void;
  /** Release subscribers and abort pending work. */
  destroy(): void;
}

function clampHighlight(index: number, length: number): number {
  if (length === 0) return -1;
  if (index < 0) return 0;
  if (index >= length) return length - 1;
  return index;
}

export function createFontInput(options: FontInputOptions = {}): FontInputStore {
  const provider = options.provider ?? googleFontsProvider();
  const filter = options.filter ?? defaultFilter;
  const loadOnHighlight = options.loadOnHighlight ?? true;

  const listeners = new Set<() => void>();
  let destroyed = false;

  let state: FontInputState = {
    open: false,
    search: "",
    value: options.defaultValue ?? "",
    fonts: [],
    filtered: [],
    highlightedIndex: -1,
    loading: true,
  };

  function emit(): void {
    for (const listener of listeners) listener();
  }

  function setState(patch: Partial<FontInputState>): void {
    state = { ...state, ...patch };
    emit();
  }

  function loadFont(family: string): void {
    if (!family) return;
    void provider.loadFont(family);
  }

  // Resolve the catalog (sync or async) and prime preview for the initial value.
  const listed = provider.listFonts();
  function applyFonts(fonts: readonly FontItem[]): void {
    if (destroyed) return;
    setState({
      fonts,
      filtered: filter(state.search, fonts),
      loading: false,
    });
    if (state.value) loadFont(state.value);
  }
  if (Array.isArray(listed)) {
    applyFonts(listed);
  } else {
    void Promise.resolve(listed).then(applyFonts);
  }

  function setOpen(open: boolean): void {
    if (state.open === open) return;
    if (open) {
      const idx = state.filtered.findIndex((f) => f.family === state.value);
      const highlightedIndex = idx >= 0 ? idx : state.filtered.length > 0 ? 0 : -1;
      setState({ open: true, highlightedIndex });
      maybePreview(highlightedIndex);
    } else {
      setState({ open: false, search: "", filtered: filter("", state.fonts) });
    }
    options.onOpenChange?.(open);
  }

  function maybePreview(index: number): void {
    if (!loadOnHighlight) return;
    const item = state.filtered[index];
    if (item) loadFont(item.family);
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!state.open),
    setSearch(query) {
      const filtered = filter(query, state.fonts);
      const highlightedIndex = filtered.length > 0 ? 0 : -1;
      setState({ search: query, filtered, highlightedIndex });
      maybePreview(highlightedIndex);
    },
    setValue(family) {
      setState({ value: family });
      if (family) loadFont(family);
    },
    highlight(index) {
      const highlightedIndex = clampHighlight(index, state.filtered.length);
      setState({ highlightedIndex });
      maybePreview(highlightedIndex);
    },
    highlightBy(delta) {
      this.highlight(state.highlightedIndex + delta);
    },
    highlightFirst() {
      this.highlight(0);
    },
    highlightLast() {
      this.highlight(state.filtered.length - 1);
    },
    select(family) {
      setState({ value: family });
      loadFont(family);
      options.onChange?.(family);
      setOpen(false);
    },
    selectHighlighted() {
      const item = state.filtered[state.highlightedIndex];
      if (item) this.select(item.family);
    },
    loadFont,
    destroy() {
      destroyed = true;
      listeners.clear();
    },
  };
}

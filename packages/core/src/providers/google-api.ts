import { GOOGLE_FONTS } from "../data/google-fonts";
import { type GoogleFontLoaderOptions, createGoogleFontLoader } from "../loader";
import type { FontCategory, FontItem, FontProvider } from "../types";

/** Sort order accepted by the Google Fonts Developer API. */
export type GoogleFontsSort = "alpha" | "date" | "popularity" | "style" | "trending";

export interface GoogleFontsApiProviderOptions extends GoogleFontLoaderOptions {
  /** Google Fonts Developer API key. Required to fetch the live catalog. */
  apiKey: string;
  /** Catalog ordering. Defaults to `popularity`. */
  sort?: GoogleFontsSort;
  /**
   * Catalog to serve if the API request fails. Defaults to the bundled
   * curated list, so the picker still works offline / on error.
   */
  fallback?: readonly FontItem[];
  /** Override the fetch endpoint (for proxies / testing). */
  endpoint?: string;
  /** Inject a custom `fetch` (for non-browser runtimes / testing). */
  fetch?: typeof fetch;
}

interface GoogleWebfontsItem {
  family: string;
  category?: string;
}

interface GoogleWebfontsResponse {
  items?: GoogleWebfontsItem[];
}

const KNOWN_CATEGORIES: ReadonlySet<string> = new Set<FontCategory>([
  "serif",
  "sans-serif",
  "display",
  "handwriting",
  "monospace",
]);

function toCategory(value: string | undefined): FontCategory | undefined {
  return value && KNOWN_CATEGORIES.has(value) ? (value as FontCategory) : undefined;
}

/**
 * Async {@link FontProvider} backed by the live
 * [Google Fonts Developer API](https://developers.google.com/fonts/docs/developer_api).
 *
 * Fetches the full catalog (≈1,800 families) once, lazily injects stylesheets
 * via {@link createGoogleFontLoader}, and falls back to the bundled list if the
 * request fails so the picker degrades gracefully.
 *
 * @example
 * ```ts
 * const provider = googleFontsApiProvider({ apiKey: import.meta.env.VITE_GF_KEY });
 * ```
 */
export function googleFontsApiProvider(options: GoogleFontsApiProviderOptions): FontProvider {
  const {
    apiKey,
    sort = "popularity",
    fallback = GOOGLE_FONTS,
    endpoint = "https://www.googleapis.com/webfonts/v1/webfonts",
    fetch: fetchImpl,
    ...loaderOptions
  } = options;

  const loadFont = createGoogleFontLoader(loaderOptions);
  let cache: FontItem[] | null = null;

  async function listFonts(): Promise<FontItem[]> {
    if (cache) return cache;

    const doFetch =
      fetchImpl ?? (typeof fetch !== "undefined" ? fetch.bind(globalThis) : undefined);
    if (!doFetch) {
      cache = [...fallback];
      return cache;
    }

    try {
      const url = `${endpoint}?key=${encodeURIComponent(apiKey)}&sort=${sort}`;
      const res = await doFetch(url);
      if (!res.ok) throw new Error(`Google Fonts API responded ${res.status}`);
      const data: GoogleWebfontsResponse = await res.json();
      const items = data.items ?? [];
      cache = items.map((item) => ({
        family: item.family,
        category: toCategory(item.category),
      }));
      return cache;
    } catch {
      cache = [...fallback];
      return cache;
    }
  }

  return { listFonts, loadFont };
}

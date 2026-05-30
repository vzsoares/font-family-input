import type { FontItem } from "../types";

/**
 * Curated list of popular Google Fonts with categories. This is the default
 * catalog for {@link googleFontsProvider}; it works fully offline (no API key).
 *
 * Supply your own via the provider's `fonts` option, or implement a custom
 * `FontProvider` to load the full live Google Fonts catalog.
 */
export const GOOGLE_FONTS: readonly FontItem[] = [
  // sans-serif
  { family: "Inter", category: "sans-serif" },
  { family: "Roboto", category: "sans-serif" },
  { family: "Open Sans", category: "sans-serif" },
  { family: "Montserrat", category: "sans-serif" },
  { family: "Lato", category: "sans-serif" },
  { family: "Poppins", category: "sans-serif" },
  { family: "Raleway", category: "sans-serif" },
  { family: "Nunito", category: "sans-serif" },
  { family: "Source Sans 3", category: "sans-serif" },
  { family: "Ubuntu", category: "sans-serif" },
  { family: "Rubik", category: "sans-serif" },
  { family: "Noto Sans", category: "sans-serif" },
  { family: "PT Sans", category: "sans-serif" },
  { family: "Work Sans", category: "sans-serif" },
  { family: "Fira Sans", category: "sans-serif" },
  { family: "Quicksand", category: "sans-serif" },
  { family: "Mulish", category: "sans-serif" },
  { family: "Barlow", category: "sans-serif" },
  { family: "DM Sans", category: "sans-serif" },
  { family: "Cabin", category: "sans-serif" },
  { family: "Josefin Sans", category: "sans-serif" },
  { family: "Karla", category: "sans-serif" },
  { family: "Manrope", category: "sans-serif" },
  { family: "Outfit", category: "sans-serif" },
  { family: "Plus Jakarta Sans", category: "sans-serif" },
  { family: "Sora", category: "sans-serif" },
  { family: "Archivo", category: "sans-serif" },
  { family: "Figtree", category: "sans-serif" },
  { family: "Red Hat Display", category: "sans-serif" },
  { family: "IBM Plex Sans", category: "sans-serif" },
  // serif
  { family: "Playfair Display", category: "serif" },
  { family: "Merriweather", category: "serif" },
  { family: "Libre Baskerville", category: "serif" },
  { family: "Lora", category: "serif" },
  { family: "Bitter", category: "serif" },
  { family: "Crimson Text", category: "serif" },
  { family: "EB Garamond", category: "serif" },
  { family: "Cormorant Garamond", category: "serif" },
  { family: "IBM Plex Serif", category: "serif" },
  { family: "Noto Serif", category: "serif" },
  { family: "PT Serif", category: "serif" },
  { family: "Source Serif 4", category: "serif" },
  // monospace
  { family: "Space Mono", category: "monospace" },
  { family: "JetBrains Mono", category: "monospace" },
  { family: "Fira Code", category: "monospace" },
  { family: "Inconsolata", category: "monospace" },
  { family: "IBM Plex Mono", category: "monospace" },
  { family: "Roboto Mono", category: "monospace" },
  { family: "Source Code Pro", category: "monospace" },
  // display
  { family: "Oswald", category: "display" },
  { family: "Bebas Neue", category: "display" },
  { family: "Space Grotesk", category: "display" },
  { family: "Comfortaa", category: "display" },
  { family: "Lobster", category: "display" },
  { family: "Abril Fatface", category: "display" },
  { family: "Anton", category: "display" },
  { family: "Righteous", category: "display" },
  // handwriting
  { family: "Pacifico", category: "handwriting" },
  { family: "Dancing Script", category: "handwriting" },
  { family: "Caveat", category: "handwriting" },
  { family: "Shadows Into Light", category: "handwriting" },
  { family: "Satisfy", category: "handwriting" },
  { family: "Great Vibes", category: "handwriting" },
  { family: "Permanent Marker", category: "handwriting" },
  { family: "Indie Flower", category: "handwriting" },
];

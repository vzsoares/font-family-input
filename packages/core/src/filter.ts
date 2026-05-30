import type { FontItem } from "./types";

/** Strategy for narrowing the catalog by the search query. */
export type FontFilter = (query: string, fonts: readonly FontItem[]) => FontItem[];

/** Case-insensitive substring match on the family name. */
export const defaultFilter: FontFilter = (query, fonts) => {
  const q = query.trim().toLowerCase();
  if (!q) return [...fonts];
  return fonts.filter((f) => f.family.toLowerCase().includes(q));
};

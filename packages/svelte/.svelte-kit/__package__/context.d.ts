import { type FontFilter, type FontInputState, type FontInputStore, type FontProvider } from "@font-family-input/core";
import type { Readable } from "svelte/store";
export declare const FONT_INPUT_KEY: unique symbol;
export interface FontInputIds {
    trigger: string;
    listbox: string;
    input: string;
    option: (index: number) => string;
}
export interface RefHolder {
    trigger?: HTMLButtonElement;
    content?: HTMLDivElement;
    input?: HTMLInputElement;
}
export interface FontInputContext {
    store: FontInputStore;
    /** Svelte-readable snapshot of the store state (use as `$state` store). */
    state: Readable<FontInputState>;
    ids: FontInputIds;
    refs: RefHolder;
}
export interface CreateFontContextOptions {
    initialValue?: string;
    provider?: FontProvider;
    filter?: FontFilter;
    loadOnHighlight?: boolean;
    onChange?: (family: string) => void;
    onOpenChange?: (open: boolean) => void;
}
export declare function createFontContext(options: CreateFontContextOptions): FontInputContext;
//# sourceMappingURL=context.d.ts.map
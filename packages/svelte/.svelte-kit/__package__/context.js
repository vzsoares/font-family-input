import { createFontInput, } from "@font-family-input/core";
export const FONT_INPUT_KEY = Symbol("font-input");
let idCounter = 0;
export function createFontContext(options) {
    const store = createFontInput({
        provider: options.provider,
        filter: options.filter,
        loadOnHighlight: options.loadOnHighlight,
        defaultValue: options.initialValue,
        onChange: options.onChange,
        onOpenChange: options.onOpenChange,
    });
    const state = {
        subscribe(run) {
            run(store.getState());
            return store.subscribe(() => run(store.getState()));
        },
    };
    const base = `ffi-${++idCounter}`;
    return {
        store,
        state,
        ids: {
            trigger: `${base}-trigger`,
            listbox: `${base}-listbox`,
            input: `${base}-input`,
            option: (index) => `${base}-option-${index}`,
        },
        refs: {},
    };
}

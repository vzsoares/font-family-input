import type { FontInputStore, KeyboardTarget } from "@font-family-input/core";
/** Adapt the core store to the {@link KeyboardTarget} contract. */
export declare function comboboxTarget(store: FontInputStore): KeyboardTarget;
/** Action that moves a node to a target container (a lightweight portal). */
export declare function portal(node: HTMLElement, target?: Element): {
    update(next?: Element): void;
    destroy(): void;
};
//# sourceMappingURL=internal.d.ts.map
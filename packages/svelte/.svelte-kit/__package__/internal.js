/** Adapt the core store to the {@link KeyboardTarget} contract. */
export function comboboxTarget(store) {
    return {
        isOpen: () => store.getState().open,
        open: () => store.open(),
        close: () => store.close(),
        highlightBy: (delta) => store.highlightBy(delta),
        highlightFirst: () => store.highlightFirst(),
        highlightLast: () => store.highlightLast(),
        selectHighlighted: () => store.selectHighlighted(),
    };
}
/** Action that moves a node to a target container (a lightweight portal). */
export function portal(node, target) {
    const dest = target ?? document.body;
    dest.appendChild(node);
    return {
        update(next) {
            (next ?? document.body).appendChild(node);
        },
        destroy() {
            node.remove();
        },
    };
}

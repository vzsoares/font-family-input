import { type Snippet } from "svelte";
import type { FontItem } from "@font-family-input/core";
interface Props {
    font: FontItem;
    index: number;
    previewFont?: boolean;
    children?: Snippet;
    [key: string]: unknown;
}
declare const Item: import("svelte").Component<Props, {}, "">;
type Item = ReturnType<typeof Item>;
export default Item;
//# sourceMappingURL=Item.svelte.d.ts.map
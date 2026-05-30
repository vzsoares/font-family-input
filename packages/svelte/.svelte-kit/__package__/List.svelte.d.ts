import { type Snippet } from "svelte";
import type { FontItem } from "@font-family-input/core";
interface Props {
    estimateSize?: number;
    overscan?: number;
    children: Snippet<[FontItem, number]>;
    [key: string]: unknown;
}
declare const List: import("svelte").Component<Props, {}, "">;
type List = ReturnType<typeof List>;
export default List;
//# sourceMappingURL=List.svelte.d.ts.map
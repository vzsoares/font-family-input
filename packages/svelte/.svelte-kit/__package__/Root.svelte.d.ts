import { type Snippet } from "svelte";
import type { FontFilter, FontProvider } from "@font-family-input/core";
interface Props {
    value?: string;
    defaultValue?: string;
    provider?: FontProvider;
    filter?: FontFilter;
    loadOnHighlight?: boolean;
    onValueChange?: (family: string) => void;
    onOpenChange?: (open: boolean) => void;
    children?: Snippet;
}
declare const Root: import("svelte").Component<Props, {}, "value">;
type Root = ReturnType<typeof Root>;
export default Root;
//# sourceMappingURL=Root.svelte.d.ts.map
import { type Snippet } from "svelte";
interface Props {
    placeholder?: string;
    previewFont?: boolean;
    children?: Snippet<[string]>;
    [key: string]: unknown;
}
declare const Trigger: import("svelte").Component<Props, {}, "">;
type Trigger = ReturnType<typeof Trigger>;
export default Trigger;
//# sourceMappingURL=Trigger.svelte.d.ts.map
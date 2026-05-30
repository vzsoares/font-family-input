import type { FontProvider } from "@font-family-input/core";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import {
  FontInputContent,
  FontInputEmpty,
  FontInputItem,
  FontInputList,
  FontInputRoot,
  FontInputSearch,
  FontInputTrigger,
} from "./index";

const provider: FontProvider = {
  listFonts: () => [{ family: "Inter" }, { family: "Roboto Mono" }, { family: "Lobster" }],
  loadFont: vi.fn(),
};

function makePicker(rootProps: Record<string, unknown> = {}) {
  return defineComponent({
    setup() {
      return () =>
        h(FontInputRoot, { provider, ...rootProps }, () => [
          h(FontInputTrigger, { class: "trigger" }),
          h(FontInputContent, { class: "content" }, () => [
            h(FontInputSearch, { class: "search" }),
            h(
              FontInputList,
              { style: "max-height: 200px" },
              {
                default: ({ font, index }: { font: { family: string }; index: number }) =>
                  h(FontInputItem, { font, index }),
              },
            ),
            h(FontInputEmpty, { class: "empty" }, () => "No fonts found"),
          ]),
        ]);
    },
  });
}

describe("FontInput (vue)", () => {
  it("shows the placeholder until a value is set", () => {
    const wrapper = mount(makePicker());
    expect(wrapper.find(".trigger").text()).toContain("Select font…");
  });

  it("opens on click and closes on Escape", async () => {
    const wrapper = mount(makePicker(), { attachTo: document.body });
    expect(wrapper.find(".content").exists()).toBe(false);
    await wrapper.find(".trigger").trigger("click");
    expect(wrapper.find(".content").exists()).toBe(true);
    await wrapper.find(".search").trigger("keydown", { key: "Escape" });
    expect(wrapper.find(".content").exists()).toBe(false);
    wrapper.unmount();
  });

  it("filters via the search box (Empty state)", async () => {
    const wrapper = mount(makePicker(), { attachTo: document.body });
    await wrapper.find(".trigger").trigger("click");
    const input = wrapper.find(".search");
    await input.setValue("zzz-no-match");
    await nextTick();
    expect(wrapper.find(".empty").exists()).toBe(true);
    await input.setValue("inter");
    await nextTick();
    expect(wrapper.find(".empty").exists()).toBe(false);
    wrapper.unmount();
  });

  it("selects via the keyboard and emits update:modelValue", async () => {
    const wrapper = mount(makePicker(), { attachTo: document.body });
    await wrapper.find(".trigger").trigger("click");
    const input = wrapper.find(".search").element;
    const key = (k: string) =>
      input.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
    // Open highlights index 0 (Inter); ArrowDown -> index 1 (Roboto Mono).
    key("ArrowDown");
    await nextTick();
    key("Enter");
    await nextTick();
    expect(wrapper.findComponent(FontInputRoot).emitted("update:modelValue")?.[0]).toEqual([
      "Roboto Mono",
    ]);
    wrapper.unmount();
  });

  it("supports v-model (controlled)", () => {
    const wrapper = mount(makePicker({ modelValue: "Lobster" }));
    expect(wrapper.find(".trigger").text()).toContain("Lobster");
  });
});

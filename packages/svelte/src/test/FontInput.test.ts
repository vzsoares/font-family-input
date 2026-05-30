import type { FontProvider } from "@font-family-input/core";
import { cleanup, render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import Picker from "./Picker.svelte";

const provider: FontProvider = {
  listFonts: () => [{ family: "Inter" }, { family: "Roboto Mono" }, { family: "Lobster" }],
  loadFont: vi.fn(),
};

afterEach(cleanup);

describe("FontInput (svelte)", () => {
  it("shows the placeholder until a value is set", () => {
    render(Picker, { provider });
    expect(screen.getByTestId("trigger").textContent).toContain("Select font…");
  });

  it("opens on click and lists fonts", async () => {
    const user = userEvent.setup();
    render(Picker, { provider });
    expect(screen.queryByTestId("content")).toBeNull();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByTestId("content")).toBeTruthy();
    // Svelte uses fixed-height windowing, so rows render under jsdom.
    expect(screen.getByText("Inter")).toBeTruthy();
  });

  it("shows the Empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(Picker, { provider });
    await user.click(screen.getByTestId("trigger"));
    await user.type(screen.getByTestId("search"), "zzz-no-match");
    expect(screen.getByTestId("empty")).toBeTruthy();
    await user.clear(screen.getByTestId("search"));
    await user.type(screen.getByTestId("search"), "inter");
    expect(screen.queryByTestId("empty")).toBeNull();
  });

  it("selects via the keyboard and reports onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(Picker, { provider, onValueChange });
    await user.click(screen.getByTestId("trigger"));
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("Roboto Mono");
    expect(screen.getByTestId("trigger").textContent).toContain("Roboto Mono");
  });

  it("supports controlled value", () => {
    render(Picker, { provider, value: "Lobster" });
    expect(screen.getByTestId("trigger").textContent).toContain("Lobster");
  });
});

import type { FontProvider } from "@font-family-input/core";
import { cleanup, render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FontInput, type RootProps } from "./index";

// See the React suite note: jsdom can't measure layout so virtualized rows
// don't render here; these assert behavior. Rendered rows are covered by e2e.

const provider: FontProvider = {
  listFonts: () => [{ family: "Inter" }, { family: "Roboto Mono" }, { family: "Lobster" }],
  loadFont: vi.fn(),
};

function Picker(props: Partial<RootProps>) {
  return (
    <FontInput.Root provider={provider} {...props}>
      <FontInput.Trigger data-testid="trigger" />
      <FontInput.Content data-testid="content">
        <FontInput.Search data-testid="search" />
        <FontInput.List style={{ "max-height": "200px" }}>
          {(item) => <FontInput.Item>{item.family}</FontInput.Item>}
        </FontInput.List>
        <FontInput.Empty data-testid="empty">No fonts found</FontInput.Empty>
      </FontInput.Content>
    </FontInput.Root>
  );
}

afterEach(cleanup);

describe("FontInput (solid)", () => {
  it("shows the placeholder until a value is set", () => {
    render(() => <Picker />);
    expect(screen.getByTestId("trigger").textContent).toContain("Select font…");
  });

  it("opens on click and closes on Escape", async () => {
    const user = userEvent.setup();
    render(() => <Picker />);
    expect(screen.queryByTestId("content")).toBeNull();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByTestId("content")).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("content")).toBeNull();
  });

  it("shows the Empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(() => <Picker />);
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
    render(() => <Picker onValueChange={onValueChange} />);
    await user.click(screen.getByTestId("trigger"));
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("Roboto Mono");
    expect(screen.getByTestId("trigger").textContent).toContain("Roboto Mono");
  });

  it("supports controlled value", () => {
    render(() => <Picker value="Lobster" />);
    expect(screen.getByTestId("trigger").textContent).toContain("Lobster");
  });
});

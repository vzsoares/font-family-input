import type { FontProvider } from "@font-family-input/core";
import { cleanup, render, screen } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FontInput } from "./index";

// See the note in the React suite: jsdom can't measure layout, so TanStack
// Virtual renders no rows here. These tests assert behavior (open/Empty/keyboard/
// controlled); rendered-row coverage lives in the Playwright e2e suite.

const provider: FontProvider = {
  listFonts: () => [{ family: "Inter" }, { family: "Roboto Mono" }, { family: "Lobster" }],
  loadFont: vi.fn(),
};

function Picker(props: Partial<Parameters<typeof FontInput.Root>[0]>) {
  return (
    <FontInput.Root provider={provider} {...props}>
      <FontInput.Trigger data-testid="trigger" />
      <FontInput.Content data-testid="content">
        <FontInput.Search data-testid="search" />
        <FontInput.List style={{ maxHeight: 200 }}>
          {(item) => <FontInput.Item>{item.family}</FontInput.Item>}
        </FontInput.List>
        <FontInput.Empty data-testid="empty">No fonts found</FontInput.Empty>
      </FontInput.Content>
    </FontInput.Root>
  );
}

afterEach(cleanup);

describe("FontInput (preact)", () => {
  it("shows the placeholder until a value is set", () => {
    render(<Picker />);
    expect(screen.getByTestId("trigger").textContent).toContain("Select font…");
  });

  it("opens on click and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Picker />);
    expect(screen.queryByTestId("content")).toBeNull();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByTestId("content")).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("content")).toBeNull();
  });

  it("shows the Empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Picker />);
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
    render(<Picker onValueChange={onValueChange} />);
    await user.click(screen.getByTestId("trigger"));
    // Open highlights index 0 (Inter); ArrowDown -> index 1 (Roboto Mono).
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("Roboto Mono");
    expect(screen.getByTestId("trigger").textContent).toContain("Roboto Mono");
  });

  it("supports controlled value", () => {
    render(<Picker value="Lobster" />);
    expect(screen.getByTestId("trigger").textContent).toContain("Lobster");
  });
});

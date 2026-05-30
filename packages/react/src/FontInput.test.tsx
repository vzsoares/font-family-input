import type { FontProvider } from "@font-family-input/core";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FontInput } from "./index";

const provider: FontProvider = {
  listFonts: () => [
    { family: "Inter" },
    { family: "Roboto Mono" },
    { family: "Lobster" },
  ],
  loadFont: vi.fn(),
};

function Picker(props: Partial<ComponentProps<typeof FontInput.Root>>) {
  return (
    <FontInput.Root provider={provider} {...props}>
      <FontInput.Trigger data-testid="trigger" />
      <FontInput.Content data-testid="content">
        <FontInput.Search data-testid="search" />
        <FontInput.List style={{ maxHeight: 200 }}>
          {(item) => <FontInput.Item key={item.family}>{item.family}</FontInput.Item>}
        </FontInput.List>
        <FontInput.Empty data-testid="empty">No fonts found</FontInput.Empty>
      </FontInput.Content>
    </FontInput.Root>
  );
}

afterEach(cleanup);

describe("FontInput (react)", () => {
  it("shows the placeholder until a value is set", () => {
    render(<Picker />);
    expect(screen.getByTestId("trigger").textContent).toContain("Select font…");
  });

  it("opens on click and lists fonts", async () => {
    const user = userEvent.setup();
    render(<Picker />);
    expect(screen.queryByTestId("content")).toBeNull();
    await user.click(screen.getByTestId("trigger"));
    expect(await screen.findByTestId("content")).toBeTruthy();
    expect(await screen.findByText("Inter")).toBeTruthy();
  });

  it("filters via the search box", async () => {
    const user = userEvent.setup();
    render(<Picker />);
    await user.click(screen.getByTestId("trigger"));
    await user.type(screen.getByTestId("search"), "lob");
    await waitFor(() => {
      expect(screen.getByText("Lobster")).toBeTruthy();
      expect(screen.queryByText("Inter")).toBeNull();
    });
  });

  it("selects a font and reports it via onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Picker onValueChange={onValueChange} />);
    await user.click(screen.getByTestId("trigger"));
    await user.click(screen.getByText("Roboto Mono"));
    expect(onValueChange).toHaveBeenCalledWith("Roboto Mono");
    expect(screen.getByTestId("trigger").textContent).toContain("Roboto Mono");
    expect(screen.queryByTestId("content")).toBeNull();
  });

  it("supports controlled value", () => {
    function Controlled() {
      const [v] = useState("Lobster");
      return <Picker value={v} />;
    }
    render(<Controlled />);
    expect(screen.getByTestId("trigger").textContent).toContain("Lobster");
  });

  it("selects the highlighted option with the keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Picker onValueChange={onValueChange} />);
    await user.click(screen.getByTestId("trigger"));
    const search = screen.getByTestId("search");
    search.focus();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalled();
  });
});

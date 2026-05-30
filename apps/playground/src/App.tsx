import { FontInput, type FontProvider } from "@font-family-input/react";
import { type ComponentProps, useState } from "react";

function Picker(props: ComponentProps<typeof FontInput.Root>) {
  return (
    <div style={{ position: "relative" }}>
      <FontInput.Root {...props}>
        <FontInput.Trigger className="ffi-trigger" data-testid="trigger" />
        <FontInput.Content className="ffi-content" data-testid="content">
          <FontInput.Search className="ffi-search" data-testid="search" />
          <FontInput.List className="ffi-list" data-testid="list">
            {(item) => (
              <FontInput.Item key={item.family} className="ffi-item">
                {item.family}
              </FontInput.Item>
            )}
          </FontInput.List>
          <FontInput.Empty className="ffi-empty">No fonts found</FontInput.Empty>
        </FontInput.Content>
      </FontInput.Root>
    </div>
  );
}

const customProvider: FontProvider = {
  listFonts: () => [
    { family: "Inter" },
    { family: "Roboto Mono" },
    { family: "Lobster" },
    { family: "Playfair Display" },
  ],
  loadFont: () => {},
};

export function App() {
  const [font, setFont] = useState("Playfair Display");

  return (
    <main className="page">
      <h1>font-family-input</h1>
      <p className="lead">Headless, composable, virtualized font pickers. Live playground.</p>

      <div className="field">
        <span className="lbl">Uncontrolled (defaults to Inter)</span>
        <Picker defaultValue="Inter" />
      </div>

      <div className="field">
        <span className="lbl">Controlled</span>
        <Picker value={font} onValueChange={setFont} />
        <code>value: {font || "(none)"}</code>
      </div>

      <div className="field">
        <span className="lbl">Custom provider (no-op loader)</span>
        <Picker provider={customProvider} />
      </div>
    </main>
  );
}

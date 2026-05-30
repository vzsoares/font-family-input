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
    { family: "Space Grotesk" },
    { family: "Dancing Script" },
  ],
  loadFont: () => {},
};

export function App() {
  const [controlled, setControlled] = useState("Playfair Display");

  return (
    <main className="page">
      <h1>font-family-input</h1>
      <p className="lead">Headless, composable, virtualized font pickers. Live playground.</p>

      <section className="section">
        <h2>React adapter</h2>

        <div className="field">
          <span className="lbl">Uncontrolled (defaults to Inter)</span>
          <Picker defaultValue="Inter" />
        </div>

        <div className="field">
          <span className="lbl">Controlled</span>
          <Picker value={controlled} onValueChange={setControlled} />
          <code>value: {controlled || "(none)"}</code>
        </div>

        <div className="field">
          <span className="lbl">Custom provider (6 fonts, no-op loader)</span>
          <Picker provider={customProvider} />
        </div>
      </section>

      <section className="section">
        <h2>Web Component</h2>
        <p className="note">
          The <code>&lt;font-family-input&gt;</code> custom element is registered on this page:
        </p>
        <div className="field">
          {/* @ts-expect-error — custom element */}
          <font-family-input value="Space Grotesk" class="wc-picker" />
        </div>
      </section>
    </main>
  );
}

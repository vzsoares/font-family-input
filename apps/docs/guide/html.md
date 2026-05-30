# @font-family-input/html

A framework-agnostic `<font-family-input>` custom element wrapping the headless core. Works in plain HTML, any framework, or straight from a CDN.

## Install

```bash
bun add @font-family-input/html
```

Or skip the install entirely and use the CDN:

```html
<script src="https://unpkg.com/@font-family-input/html"></script>
```

## Usage

### With a bundler

```ts
import { defineFontFamilyInput } from "@font-family-input/html";
defineFontFamilyInput(); // registers <font-family-input>
```

```html
<font-family-input value="Inter" placeholder="Pick a font"></font-family-input>
```

### From a CDN (UMD)

The package ships a self-contained UMD build (`unpkg` / `jsdelivr` fields point to it). All of `@font-family-input/core` is bundled — no import map required.

```html
<script src="https://unpkg.com/@font-family-input/html"></script>
<script>
  FontFamilyInput.defineFontFamilyInput();
</script>

<font-family-input value="Inter" placeholder="Pick a font"></font-family-input>
```

### As an ES module from a CDN

```html
<script type="module">
  import { defineFontFamilyInput }
    from "https://unpkg.com/@font-family-input/html?module";
  defineFontFamilyInput();
</script>
```

## Attributes

| Attribute | Type | Notes |
| --- | --- | --- |
| `value` | `string` | Selected family. Reflects on selection. |
| `placeholder` | `string` | Text shown when no value is set. |
| `row-height` | `number` | Option row height in px (default `36`). Match your CSS. |

## Events

| Event | Detail | Notes |
| --- | --- | --- |
| `change` | `{ value: string }` | Fired when the user selects a family. Bubbles. |

```js
document.querySelector("font-family-input")
  .addEventListener("change", (e) => console.log(e.detail.value));
```

## JavaScript API

```ts
const el = document.querySelector("font-family-input");

el.value = "Roboto";          // set selection programmatically
el.provider = myProvider;     // inject a custom FontProvider
```

## Styling

The element uses a Shadow DOM. Style its internal parts via `::part()`:

```css
font-family-input::part(trigger) {
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
}

font-family-input::part(trigger)[data-state="open"] {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px #6366f133;
}

font-family-input::part(content) {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  box-shadow: 0 10px 30px -10px #0003;
  overflow: hidden;
}

font-family-input::part(option)[data-highlighted] { background: #eef2ff; }
font-family-input::part(option)[data-selected]    { color: #4338ca; }
```

Available parts: `trigger`, `value`, `content`, `search`, `list`, `option`, `empty`.

## Custom provider

```ts
import { defineFontFamilyInput } from "@font-family-input/html";
import type { FontProvider } from "@font-family-input/html";

const myProvider: FontProvider = {
  listFonts: () => [{ family: "My Brand Sans" }],
  loadFont: () => {},
};

defineFontFamilyInput();
const el = document.querySelector("font-family-input");
el.provider = myProvider;
```

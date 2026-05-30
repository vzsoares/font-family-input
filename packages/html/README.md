# @font-family-input/html

> `<font-family-input>` — a framework-agnostic custom element for picking font families.

Works in plain HTML, any framework, or straight from a CDN. All of `@font-family-input/core` is bundled in the UMD build so no import map is needed.

## Install

```bash
bun add @font-family-input/html
```

## Usage

```ts
import { defineFontFamilyInput } from "@font-family-input/html";
defineFontFamilyInput();
```

```html
<font-family-input value="Inter" placeholder="Pick a font"></font-family-input>
```

## From a CDN (no build step)

```html
<script src="https://unpkg.com/@font-family-input/html"></script>
<script>FontFamilyInput.defineFontFamilyInput();</script>

<font-family-input value="Inter"></font-family-input>
```

## Styling

Style via `::part()`:

```css
font-family-input::part(trigger) { border: 1px solid #ccc; border-radius: 6px; }
font-family-input::part(option)[data-highlighted] { background: #eef2ff; }
```

Parts: `trigger`, `value`, `content`, `search`, `list`, `option`, `empty`.

## Attributes

| Attribute | Notes |
| --- | --- |
| `value` | Selected family. Reflects on selection. |
| `placeholder` | Shown when no value set. |
| `row-height` | Option row height in px (default `36`). |

## Events

`change` — `CustomEvent<{ value: string }>`, bubbles.

## Docs

https://vzsoares.github.io/font-family-input/guide/html

## License

MIT

# motion-web

Framework-independent expressive motion controls built as native Web Components.

## Install

```sh
npm install github:ofercraft/motion-web
```

Import the component once, then use it in any framework or plain HTML:

```js
import 'motion-web/motion-button';
```

```html
<motion-button icon="play_arrow" aria-label="Play" width="76" height="52"></motion-button>
```

The component supports `icon`, `label`, `selected`, `disabled`, `vertical`,
`motion-level`, `width`, `height`, `icon-size`, `content-padding`, and
`content-gap`. It uses an internal native `<button>`, so clicks, keyboard focus,
and assistive-technology semantics work normally.

Theme it with CSS custom properties:

```css
motion-button {
  --motion-button-background: #f8f9ff;
  --motion-button-color: #101114;
  --motion-button-radius: 999px;
  --motion-button-pressed-radius: 18px;
}
```

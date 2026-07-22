# motion-web

Framework-independent expressive motion controls built as native Web Components and ported from the Android Motion button.

## Install

```sh
npm install github:ofercraft/motion-web
```

```js
import 'motion-web/motion-button';
```

```html
<motion-button icon="play_arrow" aria-label="Play" motion-level="medium" width="76" height="52"></motion-button>
```

The button is controlled: set `selected` for its selected state. It reproduces Android's four resolved states, 100 ms delayed press response, corner and outline springs, variable Feldman Font text axes, and variable Material Symbol axes.

```js
const button = document.querySelector('motion-button');
button.selected = true;
button.selectedState = {
  backgroundColor: '#fff',
  contentColor: '#101114',
  fontAxes: { width: 110 },
};
```

Theme colors can also be supplied with `--motion-button-background`, `--motion-button-color`, `--motion-button-selected-background`, and `--motion-button-selected-color`.

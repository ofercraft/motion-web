# motion-web

Framework-independent expressive motion controls built as native Web Components and ported from the Android Motion button.

[Live Angular Material demo](https://ofercraft.github.io/motion-web/)

## Install

```sh
npm install github:ofercraft/motion-web
```

```js
import 'motion-web/motion-button';
import 'motion-web/motion-split-button';
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

## Split button

`motion-split-button` composes two Motion buttons with compact Material 3 split-button geometry. It uses low motion by default and keeps the reference control's 40px height, 14px label, and 20px icons.

```html
<motion-split-button
  label="Button"
  icon="add_circle"
  menu-icon="expand_more"
  aria-label="Create item"
  menu-aria-label="More create options"
></motion-split-button>
```

```js
const splitButton = document.querySelector('motion-split-button');
splitButton.addEventListener('primary-action', () => createItem());
splitButton.addEventListener('secondary-action', () => openMenu());
```

## Feldman Font

Motion Web bundles Feldman Font, an OFL-licensed modified typeface based on Google Sans Flex and Fredoka. Characters supported by Google Sans Flex retain their original outlines and variable behavior. Characters missing from Google Sans Flex, including Hebrew, come from Fredoka.

The Fredoka-derived glyphs were extended to respond to every Google Sans Flex axis included in the font:

- `opsz` — optical size
- `wdth` — width
- `wght` — weight
- `GRAD` — grade without changing advance width
- `ROND` — terminal roundness
- `slnt` — slant

Fredoka's original shapes are already fully rounded, so `ROND=100` preserves those outlines. Moving toward `ROND=0` progressively flattens the outside terminal edges while preserving the bowls, counters, and overall glyph dimensions. Intermediate values interpolate between the flat and original rounded terminals.

Feldman Font is not affiliated with or endorsed by Google LLC or the Fredoka Project Authors. Its copyright notices and SIL Open Font License 1.1 are included in [`src/fonts/OFL.txt`](src/fonts/OFL.txt).

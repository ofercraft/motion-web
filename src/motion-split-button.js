import './motion-button.js';

const styles = `
  :host {
    display: inline-block;
    max-width: 100%;
    vertical-align: middle;
  }

  .split {
    display: inline-flex;
    align-items: stretch;
    gap: var(--motion-split-gap, 2px);
    width: var(--motion-split-width, auto);
    max-width: 100%;
  }

  .split[data-ratio] {
    width: var(--motion-split-width, 160px);
  }

  motion-button {
    --motion-button-height: var(--motion-split-height, 40px);
    --motion-button-font-size: var(--motion-split-font-size, 14px);
    --motion-button-icon-size: var(--motion-split-icon-size, 20px);
    --motion-button-content-gap: var(--motion-split-content-gap, 6px);
    --motion-split-full-radius: calc(var(--motion-split-height, 40px) / 2);
    --motion-split-resting-outer-radius: calc(var(--motion-split-height, 40px) / 2 - 2px);
    --motion-split-current-inner-radius: var(--motion-split-inner-radius, 6px);
    --motion-split-current-outer-radius: var(--motion-split-outer-radius, var(--motion-split-resting-outer-radius));
  }

  motion-button::part(button) {
    transition:
      background-color var(--motion-color-duration, 120ms) var(--motion-color-easing, cubic-bezier(.4, 0, .2, 1)),
      color var(--motion-color-duration, 120ms) var(--motion-color-easing, cubic-bezier(.4, 0, .2, 1)),
      border-color var(--motion-color-duration, 120ms) var(--motion-color-easing, cubic-bezier(.4, 0, .2, 1)),
      border-start-start-radius var(--motion-split-corner-duration, 260ms) cubic-bezier(.2, 1.35, .35, 1),
      border-start-end-radius var(--motion-split-corner-duration, 260ms) cubic-bezier(.2, 1.35, .35, 1),
      border-end-start-radius var(--motion-split-corner-duration, 260ms) cubic-bezier(.2, 1.35, .35, 1),
      border-end-end-radius var(--motion-split-corner-duration, 260ms) cubic-bezier(.2, 1.35, .35, 1);
  }

  motion-button[data-pressed],
  motion-button[pressed] {
    --motion-split-current-inner-radius: var(--motion-split-pressed-inner-radius, var(--motion-split-full-radius));
    --motion-split-current-outer-radius: var(--motion-split-pressed-outer-radius, var(--motion-split-full-radius));
  }

  .primary {
    --motion-button-min-width: var(--motion-split-primary-min-width, 58px);
    --motion-button-padding: var(--motion-split-primary-padding, 0 15px);
  }

  .secondary {
    --motion-button-width: var(--motion-split-secondary-width, 42px);
    --motion-button-min-width: var(--motion-split-secondary-min-width, 0px);
    --motion-button-padding: var(--motion-split-secondary-padding, 0);
  }

  .split[data-width]:not([data-ratio]) .primary {
    --motion-button-width: 100%;
    flex: 1 1 auto;
  }

  .split[data-ratio] motion-button {
    --motion-button-width: 100%;
    --motion-button-min-width: 0px;
    min-width: 0;
  }

  .primary::part(button) {
    border-start-start-radius: var(--motion-split-current-outer-radius);
    border-end-start-radius: var(--motion-split-current-outer-radius);
    border-start-end-radius: var(--motion-split-current-inner-radius);
    border-end-end-radius: var(--motion-split-current-inner-radius);
  }

  .secondary::part(button) {
    border-start-start-radius: var(--motion-split-current-inner-radius);
    border-end-start-radius: var(--motion-split-current-inner-radius);
    border-start-end-radius: var(--motion-split-current-outer-radius);
    border-end-end-radius: var(--motion-split-current-outer-radius);
  }

  :host([selected]) motion-button {
    --motion-split-current-inner-radius: var(--motion-split-selected-inner-radius, var(--motion-split-full-radius));
  }

  :host([selected]) motion-button[data-pressed],
  :host([selected]) motion-button[pressed] {
    --motion-split-current-inner-radius: var(--motion-split-selected-pressed-inner-radius, var(--motion-split-full-radius));
  }
`;

const defaultState = {
  backgroundColor: 'var(--motion-split-background, #d0bcff)',
  contentColor: 'var(--motion-split-color, #21005d)',
};

const selectedState = {
  backgroundColor: 'var(--motion-split-selected-background, var(--mat-sys-primary, #6750a4))',
  contentColor: 'var(--motion-split-selected-color, var(--mat-sys-on-primary, #fff))',
};

export class MotionSplitButton extends HTMLElement {
  static observedAttributes = [
    'label', 'icon', 'menu-icon', 'aria-label', 'menu-aria-label',
    'selected', 'disabled', 'motion-level', 'haptics-enabled',
    'width', 'height', 'font-size', 'icon-size', 'gap', 'content-gap',
    'primary-width', 'secondary-width', 'primary-padding', 'secondary-padding',
    'primary-ratio', 'secondary-ratio',
  ];

  #split;
  #primary;
  #secondary;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <div class="split" role="group">
        <motion-button class="primary"></motion-button>
        <motion-button class="secondary"></motion-button>
      </div>
    `;
    this.#split = root.querySelector('.split');
    this.#primary = root.querySelector('.primary');
    this.#secondary = root.querySelector('.secondary');

    for (const button of [this.#primary, this.#secondary]) {
      const startPress = event => {
        if (this.disabled || event.repeat) return;
        if (event.type !== 'keydown' || event.key === ' ' || event.key === 'Enter') {
          button.setAttribute('data-pressed', '');
        }
      };
      const endPress = () => button.removeAttribute('data-pressed');
      button.addEventListener('pointerdown', startPress);
      button.addEventListener('keydown', startPress);
      for (const eventName of ['pointerup', 'pointercancel', 'pointerleave', 'keyup', 'blur']) {
        button.addEventListener(eventName, endPress);
      }
    }

    this.#primary.addEventListener('click', event => {
      event.stopPropagation();
      this.dispatchEvent(new CustomEvent('primary-action', {
        bubbles: true,
        composed: true,
        detail: { source: 'primary' },
      }));
    });
    this.#secondary.addEventListener('click', event => {
      event.stopPropagation();
      this.dispatchEvent(new CustomEvent('secondary-action', {
        bubbles: true,
        composed: true,
        detail: { source: 'secondary' },
      }));
    });
  }

  connectedCallback() {
    this.#sync();
  }

  attributeChangedCallback() {
    this.#sync();
  }

  get label() { return this.getAttribute('label') ?? ''; }
  set label(value) { this.#setStringAttribute('label', value); }
  get icon() { return this.getAttribute('icon') ?? ''; }
  set icon(value) { this.#setStringAttribute('icon', value); }
  get menuIcon() { return this.getAttribute('menu-icon') ?? 'expand_more'; }
  set menuIcon(value) { this.#setStringAttribute('menu-icon', value); }
  get selected() { return this.hasAttribute('selected'); }
  set selected(value) { this.toggleAttribute('selected', Boolean(value)); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', Boolean(value)); }
  get motionLevel() { return this.getAttribute('motion-level') ?? 'low'; }
  set motionLevel(value) { this.#setStringAttribute('motion-level', value); }
  get width() { return this.getAttribute('width') ?? ''; }
  set width(value) { this.#setStringAttribute('width', value); }
  get height() { return this.getAttribute('height') ?? ''; }
  set height(value) { this.#setStringAttribute('height', value); }
  get fontSize() { return this.getAttribute('font-size') ?? ''; }
  set fontSize(value) { this.#setStringAttribute('font-size', value); }
  get iconSize() { return this.getAttribute('icon-size') ?? ''; }
  set iconSize(value) { this.#setStringAttribute('icon-size', value); }
  get gap() { return this.getAttribute('gap') ?? ''; }
  set gap(value) { this.#setStringAttribute('gap', value); }
  get contentGap() { return this.getAttribute('content-gap') ?? ''; }
  set contentGap(value) { this.#setStringAttribute('content-gap', value); }
  get primaryWidth() { return this.getAttribute('primary-width') ?? ''; }
  set primaryWidth(value) { this.#setStringAttribute('primary-width', value); }
  get secondaryWidth() { return this.getAttribute('secondary-width') ?? ''; }
  set secondaryWidth(value) { this.#setStringAttribute('secondary-width', value); }
  get primaryPadding() { return this.getAttribute('primary-padding') ?? ''; }
  set primaryPadding(value) { this.#setStringAttribute('primary-padding', value); }
  get secondaryPadding() { return this.getAttribute('secondary-padding') ?? ''; }
  set secondaryPadding(value) { this.#setStringAttribute('secondary-padding', value); }
  get primaryRatio() { return Number(this.getAttribute('primary-ratio') ?? 1); }
  set primaryRatio(value) { this.#setStringAttribute('primary-ratio', value); }
  get secondaryRatio() { return Number(this.getAttribute('secondary-ratio') ?? 1); }
  set secondaryRatio(value) { this.#setStringAttribute('secondary-ratio', value); }

  #sync() {
    if (!this.#primary || !this.#secondary) return;

    this.#primary.label = this.label;
    this.#primary.icon = this.icon;
    this.#primary.selected = this.selected;
    this.#primary.disabled = this.disabled;
    this.#primary.motionLevel = this.motionLevel;
    this.#primary.defaultState = defaultState;
    this.#primary.selectedState = selectedState;
    this.#syncAttribute(this.#primary, 'height', 'height');
    this.#syncAttribute(this.#primary, 'font-size', 'font-size');
    this.#syncAttribute(this.#primary, 'icon-size', 'icon-size');
    this.#syncAttribute(this.#primary, 'content-padding', 'primary-padding');
    this.#syncAttribute(this.#primary, 'content-gap', 'content-gap');
    this.#primary.setAttribute(
      'aria-label',
      this.getAttribute('aria-label') || this.label || this.icon || 'Primary action',
    );

    this.#secondary.icon = this.menuIcon;
    this.#secondary.disabled = this.disabled;
    this.#secondary.motionLevel = this.motionLevel;
    this.#secondary.defaultState = defaultState;
    this.#secondary.selectedState = selectedState;
    this.#syncAttribute(this.#secondary, 'height', 'height');
    this.#syncAttribute(this.#secondary, 'font-size', 'font-size');
    this.#syncAttribute(this.#secondary, 'icon-size', 'icon-size');
    this.#syncAttribute(this.#secondary, 'content-padding', 'secondary-padding');
    this.#syncAttribute(this.#secondary, 'content-gap', 'content-gap');
    this.#secondary.setAttribute(
      'aria-label',
      this.getAttribute('menu-aria-label') || `More ${this.label || 'actions'}`,
    );

    const hasRatio = this.hasAttribute('primary-ratio') || this.hasAttribute('secondary-ratio');
    this.#split.toggleAttribute('data-ratio', hasRatio);
    this.#split.toggleAttribute('data-width', this.hasAttribute('width'));
    this.#setSizeProperty(this, 'width', this.getAttribute('width'));
    this.#setSizeProperty(this, '--motion-split-width', this.getAttribute('width'));
    this.#setSizeProperty(this, '--motion-split-height', this.getAttribute('height'));
    this.#setSizeProperty(this.#split, '--motion-split-gap', this.getAttribute('gap'));

    if (hasRatio) {
      this.#primary.removeAttribute('width');
      this.#secondary.removeAttribute('width');
      this.#primary.style.flex = `${this.#ratio('primary-ratio')} 1 0px`;
      this.#secondary.style.flex = `${this.#ratio('secondary-ratio')} 1 0px`;
    } else {
      this.#primary.style.removeProperty('flex');
      this.#secondary.style.removeProperty('flex');
      this.#syncAttribute(this.#primary, 'width', 'primary-width');
      this.#syncAttribute(this.#secondary, 'width', 'secondary-width');
    }

    const hapticsEnabled = this.getAttribute('haptics-enabled');
    if (hapticsEnabled === null) {
      this.#primary.removeAttribute('haptics-enabled');
      this.#secondary.removeAttribute('haptics-enabled');
    } else {
      this.#primary.setAttribute('haptics-enabled', hapticsEnabled);
      this.#secondary.setAttribute('haptics-enabled', hapticsEnabled);
    }
  }

  #setStringAttribute(name, value) {
    if (value === null || value === undefined || value === '') this.removeAttribute(name);
    else this.setAttribute(name, String(value));
  }

  #syncAttribute(element, targetName, sourceName) {
    const value = this.getAttribute(sourceName);
    if (value === null || value === '') element.removeAttribute(targetName);
    else element.setAttribute(targetName, value);
  }

  #setSizeProperty(element, property, value) {
    if (value === null || value === '') {
      element.style.removeProperty(property);
      return;
    }
    const normalized = /^-?\d*\.?\d+$/.test(value) ? `${value}px` : value;
    element.style.setProperty(property, normalized);
  }

  #ratio(attribute) {
    const value = Number(this.getAttribute(attribute) ?? 1);
    return Number.isFinite(value) && value > 0 ? value : 1;
  }
}

if (!customElements.get('motion-split-button')) {
  customElements.define('motion-split-button', MotionSplitButton);
}

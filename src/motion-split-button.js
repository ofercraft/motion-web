import { MOTION_LEVEL_CHANGE_EVENT } from './motion-button.js';

const styles = `
  :host {
    display: inline-block;
    max-width: 100%;
    vertical-align: middle;
  }

  :host([data-motion-level="low"]) {
    --motion-split-corner-duration: 340ms;
    --motion-split-corner-easing: cubic-bezier(.2, 1.7, .35, 0.85);
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
      width var(--motion-split-corner-duration, 260ms) var(--motion-split-corner-easing, cubic-bezier(.2, 1.35, .35, 1)),
      border-start-start-radius var(--motion-split-corner-duration, 260ms) var(--motion-split-corner-easing, cubic-bezier(.2, 1.35, .35, 1)),
      border-start-end-radius var(--motion-split-corner-duration, 260ms) var(--motion-split-corner-easing, cubic-bezier(.2, 1.35, .35, 1)),
      border-end-start-radius var(--motion-split-corner-duration, 260ms) var(--motion-split-corner-easing, cubic-bezier(.2, 1.35, .35, 1)),
      border-end-end-radius var(--motion-split-corner-duration, 260ms) var(--motion-split-corner-easing, cubic-bezier(.2, 1.35, .35, 1));
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

  .primary > [data-motion-label] {
    flex-shrink: 0;
    overflow: visible;
    text-overflow: clip;
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
    --motion-split-current-inner-radius: var(--motion-split-selected-pressed-inner-radius, calc(var(--motion-split-full-radius) / 2));
  }
`;

// Each half resolves its own color variables first, falling back to the
// shared split-wide ones, so the two buttons can be themed independently.
const primaryDefaultState = {
  backgroundColor: 'var(--motion-split-primary-background, var(--motion-split-background, #d0bcff))',
  contentColor: 'var(--motion-split-primary-color, var(--motion-split-color, #21005d))',
};

const secondaryDefaultState = {
  backgroundColor: 'var(--motion-split-secondary-background, var(--motion-split-background, #d0bcff))',
  contentColor: 'var(--motion-split-secondary-color, var(--motion-split-color, #21005d))',
};

const primarySelectedState = {
  backgroundColor: 'var(--motion-split-primary-selected-background, var(--motion-split-selected-background, var(--mat-sys-primary, #6750a4)))',
  contentColor: 'var(--motion-split-primary-selected-color, var(--motion-split-selected-color, var(--mat-sys-on-primary, #fff)))',
  // Keep the label at its resting width so the split never changes size on selection.
  fontAxes: { width: 100 },
};

const secondarySelectedState = {
  backgroundColor: 'var(--motion-split-secondary-selected-background, var(--motion-split-selected-background, var(--mat-sys-primary, #6750a4)))',
  contentColor: 'var(--motion-split-secondary-selected-color, var(--motion-split-selected-color, var(--mat-sys-on-primary, #fff)))',
  fontAxes: { width: 100 },
};

export class MotionSplitButton extends HTMLElement {
  static observedAttributes = [
    'label', 'icon', 'menu-icon', 'aria-label', 'menu-aria-label',
    'selected', 'disabled', 'motion-level', 'haptics-enabled', 'icon-trailing',
    'width', 'height', 'font-size', 'icon-size', 'gap', 'content-gap',
    'primary-width', 'secondary-width', 'primary-padding', 'secondary-padding',
    'primary-ratio', 'secondary-ratio',
  ];

  #split;
  #primary;
  #secondary;
  #downTimes = new Map();
  #tapTimers = new Map();
  #measureKey = null;
  #fontsListener = null;
  #levelListener = null;

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
      button.addEventListener('pointerdown', () => this.#downTimes.set(button, performance.now()));
    }
    this.#primary.addEventListener('click', event => {
      event.stopPropagation();
      const wasSelected = this.selected;
      this.dispatchEvent(new CustomEvent('primary-action', {
        bubbles: true,
        composed: true,
        detail: { source: 'primary' },
      }));
      this.#tapPulse(this.#primary, wasSelected);
    });
    this.#secondary.addEventListener('click', event => {
      event.stopPropagation();
      const wasSelected = this.selected;
      this.dispatchEvent(new CustomEvent('secondary-action', {
        bubbles: true,
        composed: true,
        detail: { source: 'secondary' },
      }));
      this.#tapPulse(this.#secondary, wasSelected);
    });
  }

  connectedCallback() {
    this.#sync();
    this.#fontsListener = () => this.#updatePrimaryWidth(true);
    document.fonts?.addEventListener('loadingdone', this.#fontsListener);
    document.fonts?.ready.then(() => {
      if (this.isConnected) this.#updatePrimaryWidth(true);
    });
    this.#levelListener = () => { if (!this.hasAttribute('motion-level')) this.#sync(); };
    document.addEventListener(MOTION_LEVEL_CHANGE_EVENT, this.#levelListener);
  }

  disconnectedCallback() {
    document.fonts?.removeEventListener('loadingdone', this.#fontsListener);
    document.removeEventListener(MOTION_LEVEL_CHANGE_EVENT, this.#levelListener);
    for (const timer of this.#tapTimers.values()) clearTimeout(timer);
    this.#tapTimers.clear();
  }

  attributeChangedCallback() {
    this.#sync();
  }

  #tapPulse(button, wasSelected) {
    // Quick taps release before the press visuals engage; give the corners a
    // brief dip through the (previous state's) pressed pose so taps bounce.
    const downTime = this.#downTimes.get(button) ?? 0;
    if (performance.now() - downTime > 175) return;
    if (this.motionLevel === 'none' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const inner = wasSelected
      ? 'var(--motion-split-selected-pressed-inner-radius, calc(var(--motion-split-full-radius) / 2))'
      : 'var(--motion-split-pressed-inner-radius, var(--motion-split-full-radius))';
    const outer = 'var(--motion-split-pressed-outer-radius, var(--motion-split-full-radius))';
    button.style.setProperty('--motion-split-current-inner-radius', inner);
    button.style.setProperty('--motion-split-current-outer-radius', outer);
    clearTimeout(this.#tapTimers.get(button));
    this.#tapTimers.set(button, setTimeout(() => {
      button.style.removeProperty('--motion-split-current-inner-radius');
      button.style.removeProperty('--motion-split-current-outer-radius');
      this.#tapTimers.delete(button);
    }, 160));
  }

  #updatePrimaryWidth(force = false) {
    if (!this.isConnected) return;
    if (this.#split.hasAttribute('data-ratio') || this.#split.hasAttribute('data-width')
      || this.hasAttribute('primary-width')) {
      this.#primary.style.removeProperty('--motion-button-width');
      this.#measureKey = null;
      return;
    }
    const key = ['label', 'icon', 'font-size', 'icon-size', 'height', 'primary-padding', 'content-gap']
      .map(name => this.getAttribute(name) ?? '').join('|');
    if (!force && key === this.#measureKey) return;
    this.#measureKey = key;
    // Pin the primary to its natural resting width (the widest pose) plus a
    // small cushion for spring overshoot, so axis bounces never move layout.
    // Content changes re-measure and the width transition animates the jump.
    this.#primary.style.removeProperty('--motion-button-width');
    const natural = this.#primary.getBoundingClientRect().width;
    if (natural > 0) {
      this.#primary.style.setProperty('--motion-button-width', `${Math.ceil(natural) + 2}px`);
    }
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
  get motionLevel() {
    const own = this.getAttribute('motion-level');
    if (own) return own;
    const inherited = this.isConnected
      ? getComputedStyle(this).getPropertyValue('--motion-level').trim()
      : '';
    return inherited || 'low';
  }
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

    const level = this.motionLevel;
    // Reflect the resolved level so the corner-easing CSS (:host([data-motion-level]))
    // works whether the level is explicit or inherited from --motion-level.
    this.dataset.motionLevel = level;

    this.#primary.label = this.label;
    this.#primary.icon = this.icon;
    this.#primary.toggleAttribute('icon-trailing', this.hasAttribute('icon-trailing'));
    this.#primary.selected = this.selected;
    this.#primary.disabled = this.disabled;
    this.#primary.motionLevel = level;
    this.#primary.defaultState = primaryDefaultState;
    this.#primary.selectedState = primarySelectedState;
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
    this.#secondary.motionLevel = level;
    this.#secondary.defaultState = secondaryDefaultState;
    this.#secondary.selectedState = secondarySelectedState;
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

    this.#updatePrimaryWidth();
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

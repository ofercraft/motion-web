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
    max-width: 100%;
  }

  motion-button {
    --motion-button-height: var(--motion-split-height, 40px);
    --motion-button-font-size: var(--motion-split-font-size, 14px);
    --motion-button-icon-size: var(--motion-split-icon-size, 20px);
  }

  .primary {
    --motion-button-min-width: 58px;
  }

  .secondary {
    --motion-button-min-width: var(--motion-split-secondary-width, 42px);
  }

  .primary::part(button) {
    border-radius:
      var(--motion-split-outer-radius, 20px)
      var(--motion-split-inner-radius, 6px)
      var(--motion-split-inner-radius, 6px)
      var(--motion-split-outer-radius, 20px);
  }

  .secondary::part(button) {
    border-radius:
      var(--motion-split-inner-radius, 6px)
      var(--motion-split-outer-radius, 20px)
      var(--motion-split-outer-radius, 20px)
      var(--motion-split-inner-radius, 6px);
  }

  :host([dir='rtl']) .primary::part(button) {
    border-radius:
      var(--motion-split-inner-radius, 6px)
      var(--motion-split-outer-radius, 20px)
      var(--motion-split-outer-radius, 20px)
      var(--motion-split-inner-radius, 6px);
  }

  :host([dir='rtl']) .secondary::part(button) {
    border-radius:
      var(--motion-split-outer-radius, 20px)
      var(--motion-split-inner-radius, 6px)
      var(--motion-split-inner-radius, 6px)
      var(--motion-split-outer-radius, 20px);
  }
`;

const defaultState = {
  backgroundColor: 'var(--motion-split-background, #d0bcff)',
  contentColor: 'var(--motion-split-color, #21005d)',
  fontAxes: { weight: 500, width: 100, round: 100 },
  symbolAxes: { weight: 400, fill: 0, grad: 0, opsz: 20 },
};

const selectedState = {
  backgroundColor: 'var(--motion-split-selected-background, var(--mat-sys-primary, #6750a4))',
  contentColor: 'var(--motion-split-selected-color, var(--mat-sys-on-primary, #fff))',
  fontAxes: { weight: 550, width: 102, round: 100 },
  symbolAxes: { weight: 450, fill: 1, grad: 0, opsz: 20 },
};

export class MotionSplitButton extends HTMLElement {
  static observedAttributes = [
    'label', 'icon', 'menu-icon', 'aria-label', 'menu-aria-label',
    'selected', 'disabled', 'motion-level', 'haptics-enabled',
  ];

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
    this.#primary = root.querySelector('.primary');
    this.#secondary = root.querySelector('.secondary');

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

  #sync() {
    if (!this.#primary || !this.#secondary) return;

    this.#primary.label = this.label;
    this.#primary.icon = this.icon;
    this.#primary.selected = this.selected;
    this.#primary.disabled = this.disabled;
    this.#primary.motionLevel = this.motionLevel;
    this.#primary.defaultState = defaultState;
    this.#primary.selectedState = selectedState;
    this.#primary.setAttribute('height', '40');
    this.#primary.setAttribute('font-size', '14');
    this.#primary.setAttribute('icon-size', '20');
    this.#primary.setAttribute('content-padding', '0 15px');
    this.#primary.setAttribute('content-gap', '6');
    this.#primary.setAttribute(
      'aria-label',
      this.getAttribute('aria-label') || this.label || this.icon || 'Primary action',
    );

    this.#secondary.icon = this.menuIcon;
    this.#secondary.disabled = this.disabled;
    this.#secondary.motionLevel = this.motionLevel;
    this.#secondary.defaultState = defaultState;
    this.#secondary.selectedState = selectedState;
    this.#secondary.setAttribute('width', '42');
    this.#secondary.setAttribute('height', '40');
    this.#secondary.setAttribute('icon-size', '20');
    this.#secondary.setAttribute('content-padding', '0');
    this.#secondary.setAttribute(
      'aria-label',
      this.getAttribute('menu-aria-label') || `More ${this.label || 'actions'}`,
    );

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
}

if (!customElements.get('motion-split-button')) {
  customElements.define('motion-split-button', MotionSplitButton);
}

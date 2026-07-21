const motionSpecs = {
  none: {
    shape: { type: 'snap' },
    font: { type: 'snap' },
    colorDuration: 0,
    symbolDuration: 0,
  },
  low: {
    shape: { dampingRatio: 0.8, stiffness: 600 },
    font: { dampingRatio: 0.8, stiffness: 600 },
    colorDuration: 90,
    symbolDuration: 100,
  },
  medium: {
    shape: { dampingRatio: 0.4, stiffness: 400 },
    font: { dampingRatio: 0.3, stiffness: 400 },
    colorDuration: 120,
    symbolDuration: 140,
  },
  high: {
    shape: { dampingRatio: 0.25, stiffness: 250 },
    font: { dampingRatio: 0.25, stiffness: 250 },
    colorDuration: 160,
    symbolDuration: 180,
  },
};

const styles = `
  @property --motion-symbol-weight { syntax: '<number>'; inherits: true; initial-value: 400; }
  @property --motion-symbol-fill { syntax: '<number>'; inherits: true; initial-value: 0; }
  @property --motion-symbol-grad { syntax: '<number>'; inherits: true; initial-value: 100; }
  @property --motion-symbol-opsz { syntax: '<number>'; inherits: true; initial-value: 24; }

  :host {
    display: inline-block;
    max-width: 100%;
    vertical-align: middle;
  }

  button {
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--motion-button-content-gap, 8px);
    box-sizing: border-box;
    width: var(--motion-button-width, auto);
    min-width: var(--motion-button-min-width, 58px);
    height: var(--motion-button-height, 80px);
    margin: 0;
    overflow: hidden;
    border: var(--motion-button-outline-width, 0) solid var(--motion-button-outline-color, transparent);
    border-radius: var(--motion-button-radius, 50%);
    padding: var(--motion-button-padding, 0);
    color: var(--motion-button-color, var(--mat-sys-on-primary, #fff));
    background: var(--motion-button-background, var(--mat-sys-primary, #65558f));
    cursor: pointer;
    appearance: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition:
      border-radius var(--motion-shape-duration) var(--motion-shape-easing),
      border-width var(--motion-shape-duration) var(--motion-shape-easing),
      background-color var(--motion-color-duration) cubic-bezier(.4, 0, .2, 1),
      color var(--motion-color-duration) cubic-bezier(.4, 0, .2, 1),
      border-color var(--motion-color-duration) cubic-bezier(.4, 0, .2, 1);
  }

  :host([vertical]) button { flex-direction: column; }

  button:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--motion-button-background, #65558f), transparent 38%);
    outline-offset: 3px;
  }

  button:disabled {
    opacity: .38;
    cursor: default;
  }

  :host([selected]) button {
    color: var(--motion-button-selected-color, var(--mat-sys-on-secondary, #fff));
    background: var(--motion-button-selected-background, var(--mat-sys-secondary, #625b71));
    border-radius: var(--motion-button-selected-radius, 25%);
  }

  :host([pressed]) button {
    border-radius: var(--motion-button-pressed-radius, 30%);
  }

  :host([selected][pressed]) button {
    border-radius: var(--motion-button-selected-pressed-radius, 40%);
  }

  .icon,
  .label {
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  .icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    width: var(--motion-button-icon-size, 24px);
    height: var(--motion-button-icon-size, 24px);
    font-family: 'Material Symbols Rounded', 'Material Icons', sans-serif;
    font-size: var(--motion-button-icon-size, 24px);
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    white-space: nowrap;
    font-feature-settings: 'liga';
    font-variation-settings:
      'FILL' var(--motion-symbol-fill),
      'wght' var(--motion-symbol-weight),
      'GRAD' var(--motion-symbol-grad),
      'opsz' var(--motion-symbol-opsz);
    -webkit-font-smoothing: antialiased;
    transition:
      --motion-symbol-weight var(--motion-font-duration) var(--motion-font-easing),
      --motion-symbol-fill var(--motion-symbol-duration) cubic-bezier(.4, 0, .2, 1),
      --motion-symbol-grad var(--motion-font-duration) var(--motion-font-easing),
      --motion-symbol-opsz var(--motion-font-duration) var(--motion-font-easing);
  }

  .label {
    overflow: hidden;
    font: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ripple {
    position: absolute;
    z-index: 0;
    border-radius: 50%;
    background: currentColor;
    pointer-events: none;
    animation: motion-ripple 520ms cubic-bezier(.2, 0, 0, 1) forwards;
  }

  @keyframes motion-ripple {
    from { opacity: .18; transform: scale(0); }
    to { opacity: 0; transform: scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    button, .icon { transition-duration: .01ms !important; }
    .ripple { animation-duration: .01ms; }
  }
`;

export class MotionButton extends HTMLElement {
  static observedAttributes = [
    'icon', 'label', 'aria-label', 'selected', 'disabled', 'vertical',
    'haptics-enabled', 'motion-level', 'width', 'height', 'icon-size',
    'content-padding', 'content-gap',
  ];

  #button;
  #icon;
  #label;
  #pressTimer = null;
  #rippleTimer = null;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>${styles}</style>
      <button part="button" type="button">
        <span class="icon" part="icon" aria-hidden="true"></span>
        <span class="label" part="label"></span>
      </button>
    `;
    this.#button = root.querySelector('button');
    this.#icon = root.querySelector('.icon');
    this.#label = root.querySelector('.label');

    this.#button.addEventListener('pointerdown', event => this.#onPointerDown(event));
    for (const type of ['pointerup', 'pointercancel', 'pointerleave', 'blur']) {
      this.#button.addEventListener(type, () => this.#endPress());
    }
    this.#button.addEventListener('keydown', event => this.#onKeyDown(event));
    this.#button.addEventListener('keyup', event => {
      if (event.key === ' ' || event.key === 'Enter') this.#endPress();
    });
  }

  connectedCallback() {
    this.#sync();
  }

  disconnectedCallback() {
    this.#endPress();
    clearTimeout(this.#rippleTimer);
  }

  attributeChangedCallback() {
    this.#sync();
  }

  get icon() { return this.getAttribute('icon') ?? ''; }
  set icon(value) { this.#setStringAttribute('icon', value); }
  get label() { return this.getAttribute('label') ?? ''; }
  set label(value) { this.#setStringAttribute('label', value); }
  get selected() { return this.hasAttribute('selected'); }
  set selected(value) { this.toggleAttribute('selected', Boolean(value)); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', Boolean(value)); }
  get motionLevel() { return this.getAttribute('motion-level') ?? 'medium'; }
  set motionLevel(value) { this.#setStringAttribute('motion-level', value); }

  focus(options) {
    this.#button.focus(options);
  }

  #sync() {
    if (!this.#button) return;
    const icon = this.icon;
    const label = this.label;
    this.#icon.textContent = icon;
    this.#icon.hidden = !icon;
    this.#label.textContent = label;
    this.#label.hidden = !label;
    this.#button.disabled = this.disabled;
    this.#button.setAttribute('aria-label', this.getAttribute('aria-label') || label || icon);
    this.#button.setAttribute('aria-pressed', String(this.selected));
    this.hasAttribute('pressed')
      ? this.#applyPressedSymbolState()
      : this.#applyRestingSymbolState();

    this.#setSize('--motion-button-width', this.getAttribute('width'));
    this.#setSize('--motion-button-height', this.getAttribute('height'));
    this.#setSize('--motion-button-icon-size', this.getAttribute('icon-size'));
    this.#setSize('--motion-button-content-gap', this.getAttribute('content-gap'));
    this.#button.style.setProperty('--motion-button-padding', this.getAttribute('content-padding') || '0');
    this.#applyMotionSpec();
  }

  #setStringAttribute(name, value) {
    if (value === null || value === undefined || value === '') this.removeAttribute(name);
    else this.setAttribute(name, String(value));
  }

  #setSize(property, value) {
    if (!value) {
      this.#button.style.removeProperty(property);
      return;
    }
    const normalized = /^-?\d+(\.\d+)?$/.test(value) ? `${value}px` : value;
    this.#button.style.setProperty(property, normalized);
  }

  #applyMotionSpec() {
    const level = this.motionLevel in motionSpecs ? this.motionLevel : 'medium';
    const spec = motionSpecs[level];
    const shape = springTiming(spec.shape);
    const font = springTiming(spec.font);
    this.#button.style.setProperty('--motion-shape-duration', shape.duration);
    this.#button.style.setProperty('--motion-shape-easing', shape.easing);
    this.#button.style.setProperty('--motion-font-duration', font.duration);
    this.#button.style.setProperty('--motion-font-easing', font.easing);
    this.#button.style.setProperty('--motion-color-duration', `${spec.colorDuration}ms`);
    this.#button.style.setProperty('--motion-symbol-duration', `${spec.symbolDuration}ms`);
  }

  #onPointerDown(event) {
    if (this.disabled || event.button !== 0) return;
    const bounds = this.#button.getBoundingClientRect();
    this.#beginPress(event.clientX - bounds.left, event.clientY - bounds.top, bounds);
  }

  #onKeyDown(event) {
    if (this.disabled || event.repeat || (event.key !== ' ' && event.key !== 'Enter')) return;
    const bounds = this.#button.getBoundingClientRect();
    this.#beginPress(bounds.width / 2, bounds.height / 2, bounds);
  }

  #beginPress(x, y, bounds) {
    this.#endPress();
    this.#performHaptic('toggle-on');
    this.#pressTimer = setTimeout(() => {
      this.toggleAttribute('pressed', true);
      this.#applyPressedSymbolState();
      this.#pressTimer = null;
    }, 100);

    const size = Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y)) * 2;
    this.shadowRoot.querySelector('.ripple')?.remove();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.part = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px`;
    this.#button.prepend(ripple);
    clearTimeout(this.#rippleTimer);
    this.#rippleTimer = setTimeout(() => ripple.remove(), 540);
  }

  #endPress() {
    clearTimeout(this.#pressTimer);
    this.#pressTimer = null;
    this.toggleAttribute('pressed', false);
    this.#applyRestingSymbolState();
  }

  #applyPressedSymbolState() {
    const high = this.motionLevel === 'high';
    const low = this.motionLevel === 'low' || this.motionLevel === 'none';
    if (this.selected) {
      this.style.setProperty('--motion-symbol-weight', this.motionLevel === 'none' ? '700' : low ? '600' : high ? '200' : '300');
      this.style.setProperty('--motion-symbol-fill', '1');
      this.style.setProperty('--motion-symbol-grad', low ? '100' : high ? '-30' : '0');
      this.style.setProperty('--motion-symbol-opsz', low ? '12' : high ? '16' : '20');
      return;
    }
    this.style.setProperty('--motion-symbol-weight', low ? '400' : high ? '200' : '300');
    this.style.setProperty('--motion-symbol-fill', '0');
    this.style.setProperty('--motion-symbol-grad', low ? '100' : high ? '50' : '70');
    this.style.setProperty('--motion-symbol-opsz', low ? '24' : high ? '30' : '10');
  }

  #applyRestingSymbolState() {
    this.style.setProperty('--motion-symbol-weight', this.selected ? '500' : '400');
    this.style.setProperty('--motion-symbol-fill', this.selected ? '1' : '0');
    this.style.setProperty('--motion-symbol-grad', '100');
    this.style.setProperty('--motion-symbol-opsz', '24');
  }

  #performHaptic(pattern) {
    if (this.getAttribute('haptics-enabled') === 'false' || !('vibrate' in navigator)) return;
    navigator.vibrate(pattern === 'toggle-on' ? 10 : 18);
  }
}

function springTiming(spec) {
  if (spec.type === 'snap') return { duration: '0ms', easing: 'linear' };
  const dampingRatio = Math.max(0.01, spec.dampingRatio);
  const naturalFrequency = Math.sqrt(Math.max(0.01, spec.stiffness));
  const threshold = 0.01;
  const durationSeconds = dampingRatio < 1
    ? -Math.log(threshold * Math.sqrt(1 - dampingRatio * dampingRatio)) / (dampingRatio * naturalFrequency)
    : -Math.log(threshold * 0.1) / naturalFrequency;
  const sampleCount = 48;
  const values = Array.from({ length: sampleCount + 1 }, (_, index) => {
    if (index === sampleCount) return '1';
    return springPosition(durationSeconds * index / sampleCount, dampingRatio, naturalFrequency).toFixed(4);
  });
  return { duration: `${Math.round(durationSeconds * 1000)}ms`, easing: `linear(${values.join(',')})` };
}

function springPosition(time, dampingRatio, naturalFrequency) {
  if (dampingRatio < 1) {
    const dampedFrequency = naturalFrequency * Math.sqrt(1 - dampingRatio * dampingRatio);
    const envelope = Math.exp(-dampingRatio * naturalFrequency * time);
    const phase = dampingRatio / Math.sqrt(1 - dampingRatio * dampingRatio);
    return 1 - envelope * (Math.cos(dampedFrequency * time) + phase * Math.sin(dampedFrequency * time));
  }
  return 1 - Math.exp(-naturalFrequency * time) * (1 + naturalFrequency * time);
}

if (!customElements.get('motion-button')) {
  customElements.define('motion-button', MotionButton);
}

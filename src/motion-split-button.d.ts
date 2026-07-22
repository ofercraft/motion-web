import type { MotionLevel } from './motion-button.js';

export class MotionSplitButton extends HTMLElement {
  label: string;
  icon: string;
  menuIcon: string;
  selected: boolean;
  disabled: boolean;
  motionLevel: MotionLevel;
}

declare global {
  interface HTMLElementTagNameMap {
    'motion-split-button': MotionSplitButton;
  }
}

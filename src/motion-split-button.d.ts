import type { MotionLevel } from './motion-button.js';

export class MotionSplitButton extends HTMLElement {
  label: string;
  icon: string;
  menuIcon: string;
  selected: boolean;
  disabled: boolean;
  motionLevel: MotionLevel;
  width: string | number;
  height: string | number;
  fontSize: string | number;
  iconSize: string | number;
  gap: string | number;
  contentGap: string | number;
  primaryWidth: string | number;
  secondaryWidth: string | number;
  primaryPadding: string;
  secondaryPadding: string;
  primaryRatio: number;
  secondaryRatio: number;
}

declare global {
  interface HTMLElementTagNameMap {
    'motion-split-button': MotionSplitButton;
  }
}

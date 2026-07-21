export type MotionLevel = 'none' | 'low' | 'medium' | 'high';

export class MotionButton extends HTMLElement {
  icon: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  motionLevel: MotionLevel;
}

declare global {
  interface HTMLElementTagNameMap {
    'motion-button': MotionButton;
  }
}

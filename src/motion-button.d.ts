export type MotionLevel = 'none' | 'low' | 'medium' | 'high';
export type MotionHaptic = 'toggle-on' | 'long-press' | 'toggle-off' | null;

export type SpringMotionSpec =
  | { type: 'snap' }
  | { type: 'spring'; dampingRatio: number; stiffness: number };

export interface TweenMotionSpec {
  duration: number;
  easing: string;
}

export interface MotionSpec {
  corner: SpringMotionSpec;
  font: SpringMotionSpec;
  color: TweenMotionSpec;
  symbol: TweenMotionSpec;
}

export interface MotionFontAxes {
  weight: number;
  width: number;
  round: number;
}

export interface MotionSymbolAxes {
  weight: number;
  fill: number;
  grad: number;
  opsz: number;
}

export interface MotionButtonState {
  backgroundColor?: string;
  contentColor?: string;
  cornerRadius?: number;
  fontAxes?: Partial<MotionFontAxes>;
  symbolAxes?: Partial<MotionSymbolAxes>;
  haptic?: MotionHaptic;
  outlineWidth?: number;
  outlineColor?: string;
}

export class MotionButton extends HTMLElement {
  icon: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  motionLevel: MotionLevel;
  motionSpec: MotionSpec | null;
  defaultState: MotionButtonState;
  defaultPressedState: MotionButtonState;
  selectedState: MotionButtonState;
  selectedPressedState: MotionButtonState;
}

declare global {
  interface HTMLElementTagNameMap {
    'motion-button': MotionButton;
  }
}

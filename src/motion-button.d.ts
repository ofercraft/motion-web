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

/** Event dispatched on `document` when the site-wide default motion level changes. */
export const MOTION_LEVEL_CHANGE_EVENT: 'motion-level-change';

/**
 * Set the site-wide default motion level by writing the inherited
 * `--motion-level` custom property. Controls with their own `motion-level`
 * attribute keep their value.
 */
export function setDefaultMotionLevel(level: MotionLevel, target?: HTMLElement): void;

declare global {
  interface HTMLElementTagNameMap {
    'motion-button': MotionButton;
  }
}

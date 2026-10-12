import type { CSSProperties } from 'react';

export type ChoiceFrameGeometry = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export const STANDARD_LEVEL_CHOICE_FRAME: ChoiceFrameGeometry = {
  x: 3.3,
  y: 66.6,
  w: 93.4,
  h: 22.35,
};

/**
 * Divides the complete translucent frame into equal cells. Each choice button
 * owns one full-height cell; CSS then centers the normalized square artwork in
 * that cell and pins every caption to the same lower row.
 *
 * `preferredWidth` is intentionally retained for call-site compatibility but
 * ignored in play mode. Author-saved widths still control the editor canvas;
 * playback must not let those values make one option look larger than another.
 */
export function autoChoiceLayoutStyle(
  index: number,
  count: number,
  _preferredWidth: number,
  frame: ChoiceFrameGeometry = STANDARD_LEVEL_CHOICE_FRAME,
): CSSProperties {
  const safeCount = Math.max(1, Math.floor(count));
  const safeIndex = Math.min(safeCount - 1, Math.max(0, Math.floor(index)));
  const cellWidth = frame.w / safeCount;

  return {
    left: `${frame.x + cellWidth * safeIndex}%`,
    top: `${frame.y}%`,
    width: `${cellWidth}%`,
    height: `${frame.h}%`,
    translate: 'none',
  };
}

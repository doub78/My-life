import {interpolate, useCurrentFrame} from 'remotion';

/**
 * Returns a scale multiplier that briefly "punches in" on each specified frame.
 * Creates the Zack D Films signature camera push on key words.
 */
export const useZoomPunch = (punchFrames: number[], magnitude = 0.045): number => {
  const frame = useCurrentFrame();
  const punch = punchFrames.reduce((total, start) => {
    const lf = frame - start;
    if (lf < 0 || lf > 14) return total;
    return total + interpolate(lf, [0, 2, 6, 14], [0, magnitude, magnitude * 0.6, 0]);
  }, 0);
  return 1 + punch;
};

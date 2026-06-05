import {interpolate, useCurrentFrame} from 'remotion';

interface KenBurnsOpts {
  durationFrames?: number;
  fromScale?: number;
  toScale?: number;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
}

export const useKenBurns = ({
  durationFrames = 90,
  fromScale = 1.0,
  toScale = 1.12,
  fromX = 0,
  toX = 0,
  fromY = 0,
  toY = 0,
}: KenBurnsOpts = {}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return {
    scale: fromScale + (toScale - fromScale) * t,
    x: fromX + (toX - fromX) * t,
    y: fromY + (toY - fromY) * t,
    style: {
      transform: `scale(${fromScale + (toScale - fromScale) * t}) translate(${fromX + (toX - fromX) * t}px, ${fromY + (toY - fromY) * t}px)`,
      transformOrigin: 'center center',
      width: '100%',
      height: '100%',
    } as React.CSSProperties,
  };
};

import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

interface SfxPopProps {
  text: string;
  x: number;
  y: number;
  startFrame: number;
  color?: string;
  size?: number;
  rotation?: number;
}

export const SfxPop: React.FC<SfxPopProps> = ({
  text,
  x,
  y,
  startFrame,
  color = '#FFE566',
  size = 72,
  rotation = -8,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - startFrame;

  if (localFrame < 0 || localFrame > 40) return null;

  const scale = spring({
    frame: localFrame,
    fps,
    config: {damping: 8, stiffness: 200},
  });

  const opacity = interpolate(localFrame, [25, 40], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transformOrigin: 'center',
        opacity,
        fontSize: size,
        fontWeight: 900,
        color,
        textShadow: `0 0 20px ${color}80, 2px 2px 0 #000`,
        letterSpacing: '-1px',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}
    >
      {text}
    </div>
  );
};

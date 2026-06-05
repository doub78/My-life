import React, {useMemo} from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

interface ParticlesProps {
  count?: number;
  startFrame: number;
  cx: number;
  cy: number;
  color?: string;
  radius?: number;
}

export const Particles: React.FC<ParticlesProps> = ({
  count = 12,
  startFrame,
  cx,
  cy,
  color = '#FFE566',
  radius = 200,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - startFrame;

  // Deterministic particle layout — computed once per mount
  const particles = useMemo(
    () =>
      Array.from({length: count}, (_, i) => ({
        angle: (i / count) * 2 * Math.PI + (i % 3) * 0.2,
        dist: radius * (0.5 + (i % 4) * 0.17),
        size: 6 + (i % 5) * 3,
        delay: i * 1.5,
      })),
    [count, radius],
  );

  if (localFrame < 0 || localFrame > 60) return null;

  return (
    <>
      {particles.map((p, i) => {
        const lf = localFrame - p.delay;
        if (lf < 0) return null;

        const progress = spring({
          frame: lf,
          fps,
          config: {damping: 14, stiffness: 120},
        });

        const opacity = interpolate(lf, [20, 60], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const px = cx + Math.cos(p.angle) * p.dist * progress;
        const py = cy + Math.sin(p.angle) * p.dist * progress;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px - p.size / 2,
              top: py - p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: color,
              opacity,
              boxShadow: `0 0 ${p.size * 2}px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};

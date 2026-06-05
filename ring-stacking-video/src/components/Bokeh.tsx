import React from 'react';
import {useCurrentFrame} from 'remotion';

const CIRCLES = [
  {x: 0.12, y: 0.28, r: 90, spd: 0.7, ph: 0.0},
  {x: 0.78, y: 0.18, r: 140, spd: 0.5, ph: 1.2},
  {x: 0.45, y: 0.55, r: 70, spd: 1.0, ph: 2.4},
  {x: 0.88, y: 0.72, r: 110, spd: 0.6, ph: 0.6},
  {x: 0.22, y: 0.82, r: 80, spd: 0.9, ph: 1.8},
  {x: 0.62, y: 0.38, r: 95, spd: 0.55, ph: 0.3},
  {x: 0.35, y: 0.12, r: 60, spd: 0.8, ph: 3.0},
];

interface BokehProps {
  color?: string;
  maxOpacity?: number;
}

export const Bokeh: React.FC<BokehProps> = ({color = '255,200,50', maxOpacity = 0.1}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {CIRCLES.map((c, i) => {
        const breathe = Math.sin(frame * 0.035 + c.ph * 2) * 0.25 + 0.75;
        const drift = Math.sin(frame * 0.008 * c.spd + c.ph) * 0.04;
        const driftY = Math.cos(frame * 0.006 * c.spd + c.ph) * 0.06;
        const x = (c.x + drift) * 1080;
        const y = (c.y + driftY) * 1920;
        const r = c.r * breathe;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${color},${maxOpacity * breathe}) 0%, transparent 72%)`,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </>
  );
};

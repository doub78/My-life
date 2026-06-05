import React from 'react';

interface RingProps {
  x: number;
  y: number;
  rx?: number;
  ry?: number;
  color?: string;
  gemColor?: string;
  rotation?: number;
  opacity?: number;
}

export const Ring: React.FC<RingProps> = ({
  x,
  y,
  rx = 60,
  ry = 22,
  color = '#D4A017',
  gemColor,
  rotation = 0,
  opacity = 1,
}) => {
  // Use string-based id to avoid collisions; Math.round keeps it stable per position
  const id = `rg-${Math.round(x)}-${Math.round(y)}`;
  const lightColor = '#FFE87C';
  const darkColor = '#7A5500';
  const innerRx = rx * 0.62;
  const innerRy = ry * 0.62;

  return (
    <svg
      style={{
        position: 'absolute',
        left: x - rx - 10,
        top: y - ry - 10,
        width: (rx + 10) * 2,
        height: (ry + 10) * 2,
        opacity,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center',
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lightColor} />
          <stop offset="35%" stopColor={color} />
          <stop offset="100%" stopColor={darkColor} />
        </linearGradient>
        <filter id={`${id}-shadow`}>
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.5)" />
        </filter>
        <mask id={`${id}-mask`}>
          <ellipse cx={rx + 10} cy={ry + 10} rx={rx} ry={ry} fill="white" />
          <ellipse cx={rx + 10} cy={ry + 10} rx={innerRx} ry={innerRy} fill="black" />
        </mask>
      </defs>

      {/* Ring body with donut mask */}
      <ellipse
        cx={rx + 10}
        cy={ry + 10}
        rx={rx}
        ry={ry}
        fill={`url(#${id}-grad)`}
        mask={`url(#${id}-mask)`}
        filter={`url(#${id}-shadow)`}
      />

      {/* Inner highlight arc for 3-D sheen */}
      <ellipse
        cx={rx + 10}
        cy={ry + 8}
        rx={rx * 0.7}
        ry={ry * 0.35}
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        mask={`url(#${id}-mask)`}
      />

      {/* Optional gemstone */}
      {gemColor && (
        <ellipse
          cx={rx + 10}
          cy={ry + 10}
          rx={rx * 0.22}
          ry={ry * 0.55}
          fill={gemColor}
          opacity={0.9}
        />
      )}
    </svg>
  );
};

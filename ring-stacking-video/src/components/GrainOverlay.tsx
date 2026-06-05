import React from 'react';
import {useCurrentFrame} from 'remotion';

export const GrainOverlay: React.FC<{opacity?: number}> = ({opacity = 0.038}) => {
  const frame = useCurrentFrame();
  const id = `grain-${frame % 5}`;
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        zIndex: 90,
      }}
    >
      <filter id={id}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.72"
          numOctaves="4"
          seed={frame % 60}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
};

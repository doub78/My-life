import React from 'react';

export const Vignette: React.FC<{intensity?: number; color?: string}> = ({
  intensity = 0.68,
  color = '0,0,0',
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(ellipse at 50% 45%, transparent 28%, rgba(${color},${intensity}) 100%)`,
      pointerEvents: 'none',
      zIndex: 80,
    }}
  />
);

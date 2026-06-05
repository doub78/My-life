import React, {useRef, useState, useEffect} from 'react';
import {continueRender, delayRender, interpolate, useCurrentFrame} from 'remotion';

interface DrawOnPathProps {
  d: string;
  stroke: string;
  strokeWidth?: number;
  startFrame?: number;
  durationFrames?: number;
  fill?: string;
  opacity?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
}

// Kurzgesagt signature technique: SVG paths draw themselves on screen
export const DrawOnPath: React.FC<DrawOnPathProps> = ({
  d,
  stroke,
  strokeWidth = 3,
  startFrame = 0,
  durationFrames = 25,
  fill = 'none',
  opacity = 1,
  strokeLinecap = 'round',
}) => {
  const frame = useCurrentFrame();
  const ref = useRef<SVGPathElement>(null);
  const [handle] = useState(() => delayRender('Measuring path length'));
  const [length, setLength] = useState(2000);

  useEffect(() => {
    if (ref.current) {
      setLength(ref.current.getTotalLength());
    }
    continueRender(handle);
  }, [handle]);

  const progress = interpolate(frame - startFrame, [0, durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <path
      ref={ref}
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      opacity={opacity}
      strokeLinecap={strokeLinecap}
      strokeDasharray={length}
      strokeDashoffset={length * (1 - progress)}
    />
  );
};

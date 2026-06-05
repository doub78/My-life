import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

interface CountUpProps {
  from?: number;
  to: number;
  startFrame?: number;
  durationFrames?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
  decimals?: number;
  locale?: string;
}

// Number counter animation — Kurzgesagt / educational YouTube signature
export const CountUp: React.FC<CountUpProps> = ({
  from = 0,
  to,
  startFrame = 0,
  durationFrames = 45,
  prefix = '',
  suffix = '',
  style = {},
  decimals = 0,
  locale = 'en-US',
}) => {
  const frame = useCurrentFrame();

  const raw = interpolate(frame - startFrame, [0, durationFrames], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const display =
    decimals > 0
      ? raw.toFixed(decimals)
      : Math.round(raw).toLocaleString(locale);

  return (
    <span
      style={{
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum"',
        ...style,
      }}
    >
      {prefix}{display}{suffix}
    </span>
  );
};

import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

interface GlassBadgeProps {
  children: React.ReactNode;
  startFrame?: number;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  slideFrom?: 'top' | 'bottom' | 'left' | 'right';
}

// Glassmorphism badge — Kurzgesagt / modern YouTube educational style
export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  startFrame = 0,
  accentColor = '#FFE566',
  size = 'md',
  style = {},
  slideFrom = 'top',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - startFrame;

  const sc = spring({frame: localFrame, fps, config: {damping: 12, stiffness: 150}});
  const opacity = interpolate(localFrame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  if (localFrame < 0) return null;

  const slideOffset = {
    top: {transform: `translateY(${(1 - sc) * -40}px)`},
    bottom: {transform: `translateY(${(1 - sc) * 40}px)`},
    left: {transform: `translateX(${(1 - sc) * -40}px)`},
    right: {transform: `translateX(${(1 - sc) * 40}px)`},
  }[slideFrom];

  const fontSizes: Record<'sm' | 'md' | 'lg', string> = {sm: '28px', md: '36px', lg: '44px'};
  const paddings: Record<'sm' | 'md' | 'lg', string> = {sm: '8px 24px', md: '12px 36px', lg: '16px 44px'};

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `2px solid ${accentColor}CC`,
        borderRadius: 50,
        padding: paddings[size],
        fontSize: fontSizes[size],
        fontWeight: 800,
        color: '#fff',
        letterSpacing: 1.5,
        boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px ${accentColor}30`,
        opacity,
        ...slideOffset,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

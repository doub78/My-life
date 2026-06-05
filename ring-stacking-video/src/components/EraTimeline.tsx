import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Kurzgesagt-style animated historical timeline bar
// Shows the progression of Ring Stacking across 3 eras

interface Era {
  label: string;
  year: string;
  color: string;
  ringCount: number;
  startFrame: number;
}

const ERAS: Era[] = [
  {label: 'อียิปต์ / โรมัน', year: '3000 ปีก่อน', color: '#D4A017', ringCount: 8, startFrame: 5},
  {label: 'เรเนสซองส์', year: 'ค.ศ. 1400–1600', color: '#9C27B0', ringCount: 5, startFrame: 15},
  {label: 'ยุคปัจจุบัน', year: '2025', color: '#2196F3', ringCount: 4, startFrame: 25},
];

interface EraTimelineProps {
  startFrame?: number;
  activeEra?: 0 | 1 | 2;
  bottom?: number;
}

export const EraTimeline: React.FC<EraTimelineProps> = ({startFrame = 0, activeEra = 0, bottom = 240}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - startFrame;

  const containerIn = spring({frame: localFrame, fps, config: {damping: 14, stiffness: 120}});

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: 60,
        right: 60,
        transform: `translateY(${(1 - containerIn) * 80}px)`,
        opacity: containerIn,
      }}
    >
      {/* Timeline track */}
      <div style={{position: 'relative', height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, marginBottom: 24}}>
        {ERAS.map((era, i) => {
          const segStart = i / ERAS.length;
          const segEnd = (i + 1) / ERAS.length;
          const segLocalFrame = localFrame - era.startFrame;
          const segWidth = interpolate(segLocalFrame, [0, 18], [0, (segEnd - segStart) * 100], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${segStart * 100}%`,
                top: 0, height: '100%',
                width: `${segWidth}%`,
                background: era.color,
                borderRadius: 3,
                boxShadow: `0 0 10px ${era.color}80`,
              }}
            />
          );
        })}

        {/* Dot markers */}
        {ERAS.map((era, i) => {
          const dotFrame = localFrame - era.startFrame;
          const dotScale = spring({frame: dotFrame, fps, config: {damping: 8, stiffness: 200}});
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${(i / (ERAS.length - 1)) * 100}%`,
                top: '50%',
                transform: `translate(-50%, -50%) scale(${dotScale})`,
                width: 18, height: 18,
                borderRadius: '50%',
                background: era.color,
                border: `3px solid #fff`,
                boxShadow: i === activeEra ? `0 0 20px ${era.color}` : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Era labels */}
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        {ERAS.map((era, i) => {
          const labelFrame = localFrame - era.startFrame - 5;
          const labelOpacity = interpolate(labelFrame, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const isActive = i === activeEra;
          return (
            <div key={i} style={{textAlign: 'center', flex: 1, opacity: labelOpacity}}>
              <div style={{
                fontSize: isActive ? 28 : 22,
                fontWeight: isActive ? 800 : 600,
                color: isActive ? era.color : 'rgba(255,255,255,0.7)',
                textShadow: isActive ? `0 0 12px ${era.color}60` : 'none',
                transition: 'all 0.3s',
              }}>
                {era.year}
              </div>
              {/* Ring count chips */}
              <div style={{
                display: 'inline-flex', gap: 3, marginTop: 4,
                opacity: isActive ? 1 : 0.5,
              }}>
                {Array.from({length: era.ringCount}).map((_, ri) => (
                  <div key={ri} style={{
                    width: isActive ? 10 : 7,
                    height: isActive ? 10 : 7,
                    borderRadius: '50%',
                    background: era.color,
                    boxShadow: isActive ? `0 0 6px ${era.color}` : 'none',
                  }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {waitUntilDone} from './fonts';
import {HookScene} from './scenes/HookScene';
import {AncientScene} from './scenes/AncientScene';
import {RenaissanceScene} from './scenes/RenaissanceScene';
import {OutroScene} from './scenes/OutroScene';

waitUntilDone.then(() => {/* fonts ready */});

// Quick white flash at each scene cut — the signature Zack D Films hard-cut energy
const CUTS = [90, 180, 270]; // 30fps * 3s boundaries

export const RingStackingVideo: React.FC = () => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();

  const cutFlash = CUTS.reduce((max, cut) => {
    const lf = frame - cut + 2;
    if (lf < 0 || lf > 6) return max;
    return Math.max(max, interpolate(lf, [0, 1, 3, 6], [0, 1, 0.6, 0]));
  }, 0);

  return (
    <AbsoluteFill style={{background: '#000', fontFamily: 'Kanit, sans-serif'}}>
      <Sequence from={0} durationInFrames={3 * fps}><HookScene /></Sequence>
      <Sequence from={3 * fps} durationInFrames={3 * fps}><AncientScene /></Sequence>
      <Sequence from={6 * fps} durationInFrames={3 * fps}><RenaissanceScene /></Sequence>
      <Sequence from={9 * fps} durationInFrames={3 * fps}><OutroScene /></Sequence>

      {/* Scene-cut flash overlay */}
      {cutFlash > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#fff',
            opacity: cutFlash,
            pointerEvents: 'none',
            zIndex: 200,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

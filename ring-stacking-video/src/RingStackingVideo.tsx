import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {waitUntilDone} from './fonts';
import {HookScene} from './scenes/HookScene';
import {AncientScene} from './scenes/AncientScene';
import {RenaissanceScene} from './scenes/RenaissanceScene';
import {OutroScene} from './scenes/OutroScene';

// Kick off font loading as early as possible
waitUntilDone.then(() => {/* fonts ready */});

export const RingStackingVideo: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000', fontFamily: 'Kanit, sans-serif'}}>
      <Sequence from={0} durationInFrames={3 * fps}><HookScene /></Sequence>
      <Sequence from={3 * fps} durationInFrames={3 * fps}><AncientScene /></Sequence>
      <Sequence from={6 * fps} durationInFrames={3 * fps}><RenaissanceScene /></Sequence>
      <Sequence from={9 * fps} durationInFrames={3 * fps}><OutroScene /></Sequence>
    </AbsoluteFill>
  );
};

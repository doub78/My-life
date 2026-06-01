import React from 'react';
import {Composition} from 'remotion';
import {RingStackingVideo} from './RingStackingVideo';

export const Root: React.FC = () => (
  <Composition
    id="RingStacking"
    component={RingStackingVideo}
    durationInFrames={1500}
    fps={30}
    width={1080}
    height={1920}
  />
);

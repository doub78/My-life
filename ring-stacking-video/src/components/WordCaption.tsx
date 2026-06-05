import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export interface CaptionWord {
  text: string;
  startFrame: number;
  highlight?: boolean;
}

interface WordCaptionProps {
  words: CaptionWord[];
  endFrame: number;
  y?: number;
  align?: 'left' | 'center';
}

export const WordCaption: React.FC<WordCaptionProps> = ({
  words,
  endFrame,
  y = 1450,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const containerOpacity = interpolate(frame, [endFrame - 15, endFrame], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        top: y,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        gap: '12px',
        opacity: containerOpacity,
      }}
    >
      {words.map((word, i) => {
        const localFrame = frame - word.startFrame;
        if (localFrame < 0) return null;

        const scale = spring({
          frame: localFrame,
          fps,
          config: {damping: 10, stiffness: 180, mass: 0.8},
        });

        const opacity = interpolate(localFrame, [0, 8], [0, 1], {
          extrapolateRight: 'clamp',
        });

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `scale(${scale})`,
              opacity,
              fontSize: 68,
              fontWeight: 900,
              color: word.highlight ? '#FFE566' : '#FFFFFF',
              textShadow: word.highlight
                ? '0 0 30px #FFE56680, 2px 2px 0 #000'
                : '3px 3px 0 #000, -1px -1px 0 #000',
              lineHeight: 1.15,
              letterSpacing: '-1px',
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};

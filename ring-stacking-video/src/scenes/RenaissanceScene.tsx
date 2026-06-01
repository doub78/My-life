import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Ring} from '../components/Ring';
import {SfxPop} from '../components/SfxPop';
import {WordCaption, CaptionWord} from '../components/WordCaption';
import {Particles} from '../components/Particles';

// Scene duration: 90 frames (3 s). All timings scaled from original 450-frame version (×0.2).

const line1Words: CaptionWord[] = [
  {text: 'พอเข้าสู่', startFrame: 1},
  {text: 'ยุคเรเนสซองส์', startFrame: 3, highlight: true},
  {text: 'เทรนด์นี้', startFrame: 5},
  {text: 'ยิ่งฮาร์ดคอร์', startFrame: 7, highlight: true},
  {text: 'ขึ้น!', startFrame: 9},
];

const line2Words: CaptionWord[] = [
  {text: 'พวกผู้ดี', startFrame: 24},
  {text: 'จะใส่', startFrame: 26},
  {text: 'ถุงมือผ้าไหม', startFrame: 28, highlight: true},
  {text: 'ราคาแพง', startFrame: 30},
  {text: "แต่'ตัดปลาย", startFrame: 35, highlight: true},
  {text: "ถุงมือออก'", startFrame: 37, highlight: true},
  {text: 'เพื่อเปิดทาง', startFrame: 42},
  {text: 'ให้แหวนอัญมณี', startFrame: 44, highlight: true},
  {text: 'เลเยอร์กัน', startFrame: 47},
  {text: 'เป็นชั้นๆ', startFrame: 49, highlight: true},
  {text: 'ส่องแสง', startFrame: 51},
  {text: 'กระแทกตา!', startFrame: 54, highlight: true},
];

const RING_GEMS = ['#E91E63', '#2196F3', '#4CAF50', '#FFFFFF', '#9C27B0'];
const RING_FRAMES = [36, 39, 42, 45, 48];
const RING_POSITIONS = [
  {x: 132, y: 450},
  {x: 154, y: 443},
  {x: 166, y: 445},
  {x: 177, y: 453},
  {x: 142, y: 460},
];

const NoblewomanSVG: React.FC = () => (
  <svg
    viewBox="0 0 400 800"
    width={400}
    height={800}
    style={{position: 'absolute', left: 140, top: 150}}
  >
    <path d="M200 480 Q80 500 40 780 L360 780 Q320 500 200 480Z" fill="#6B0E25" />
    <path d="M200 480 Q100 510 70 700 Q100 690 120 720 Q140 690 200 480Z" fill="#8B1530" opacity="0.5" />
    <path d="M200 480 Q300 510 330 700 Q300 690 280 720 Q260 690 200 480Z" fill="#8B1530" opacity="0.5" />
    <path d="M40 680 Q200 640 360 680" fill="none" stroke="#9B2240" strokeWidth="3" />
    <path d="M50 600 Q200 560 350 600" fill="none" stroke="#9B2240" strokeWidth="3" />
    <path d="M55 520 Q200 495 345 520" fill="none" stroke="#9B2240" strokeWidth="3" />
    <path d="M140 280 Q130 380 150 480 L250 480 Q270 380 260 280 Z" fill="#8B1A30" />
    <path d="M170 290 Q200 310 230 290 L230 330 Q200 315 170 330 Z" fill="#C4A017" opacity="0.6" />
    <path d="M140 290 Q80 270 30 320 Q10 340 20 360 Q30 380 55 365 Q100 330 145 340" fill="#2d0a5e" />
    <path d="M140 290 Q95 285 55 310" fill="none" stroke="#C4A017" strokeWidth="3" />
    <path d="M260 290 Q320 270 350 310 Q368 330 355 360 L330 350 Q300 320 265 340" fill="#2d0a5e" />
    <path d="M260 290 Q310 285 345 315" fill="none" stroke="#C4A017" strokeWidth="3" />
    <ellipse cx="200" cy="250" rx="55" ry="18" fill="#F5F0E8" opacity="0.9" />
    {Array.from({length: 12}).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return (
        <ellipse
          key={i}
          cx={200 + Math.cos(a) * 48}
          cy={250 + Math.sin(a) * 16}
          rx="10"
          ry="5"
          fill="#F5F0E8"
          opacity="0.8"
          transform={`rotate(${i * 30},${200 + Math.cos(a) * 48},${250 + Math.sin(a) * 16})`}
        />
      );
    })}
    <circle cx="200" cy="155" r="72" fill="#D4956A" />
    <ellipse cx="182" cy="148" rx="8" ry="9" fill="#6B3A2A" />
    <ellipse cx="218" cy="148" rx="8" ry="9" fill="#6B3A2A" />
    <path d="M182 178 Q200 190 218 178" fill="none" stroke="#C46A5A" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="200" cy="90" rx="55" ry="30" fill="#3D1A0A" />
    <path d="M150 110 Q145 70 165 55 Q185 40 200 42 Q215 40 235 55 Q255 70 250 110" fill="#3D1A0A" />
    {Array.from({length: 6}).map((_, i) => (
      <circle key={i} cx={162 + i * 13} cy={72} r="4" fill="#F5F0E8" opacity="0.9" />
    ))}
    <path d="M20 355 Q5 350 0 340 Q-5 328 10 322 Q25 316 35 328 L55 365Z" fill="#F5F0E8" opacity="0.95" />
    <rect x="-8" y="295" width="11" height="30" rx="5" fill="#F5F0E8" opacity="0.95" />
    <rect x="4" y="288" width="11" height="34" rx="5" fill="#F5F0E8" opacity="0.95" />
    <rect x="16" y="290" width="11" height="32" rx="5" fill="#F5F0E8" opacity="0.95" />
    <rect x="27" y="298" width="10" height="26" rx="5" fill="#F5F0E8" opacity="0.95" />
  </svg>
);

interface ScissorsSVGProps {
  progress: number;
}

const ScissorsSVG: React.FC<ScissorsSVGProps> = ({progress}) => {
  const angle = progress * 35;
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      style={{
        position: 'absolute',
        left: 40,
        top: 380,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '60px 60px',
      }}
    >
      <path d="M20 55 Q60 50 100 30 Q95 38 60 60 Z" fill="#888" stroke="#555" strokeWidth="1" />
      <path d="M20 65 Q60 70 100 90 Q95 82 60 60 Z" fill="#888" stroke="#555" strokeWidth="1" />
      <circle cx="60" cy="60" r="7" fill="#AAA" />
      <ellipse cx="18" cy="46" rx="12" ry="16" fill="none" stroke="#888" strokeWidth="3" />
      <ellipse cx="18" cy="74" rx="12" ry="16" fill="none" stroke="#888" strokeWidth="3" />
    </svg>
  );
};

export const RenaissanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});

  const scissorProgress = interpolate(frame, [26, 33], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scissorOpacity = interpolate(frame, [24, 26, 35, 39], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #1a0533 0%, #2d0a5e 40%, #180a2e 100%)',
        opacity: sceneIn,
      }}
    >
      {Array.from({length: 20}).map((_, i) => {
        const sx = (i * 137.5 + 50) % 1080;
        const sy = (i * 89.3 + 100) % 1600;
        const twinkle = Math.sin(frame * 0.08 + i) * 0.5 + 0.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: sx,
              top: sy,
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#fff',
              opacity: twinkle * 0.4,
            }}
          />
        );
      })}

      <NoblewomanSVG />

      <div style={{opacity: scissorOpacity}}>
        <ScissorsSVG progress={scissorProgress} />
      </div>

      {RING_FRAMES.map((startF, i) => {
        if (frame < startF) return null;
        const sc = spring({frame: frame - startF, fps, config: {damping: 7, stiffness: 250}});
        const pos = RING_POSITIONS[i];
        return (
          <div key={i} style={{transform: `scale(${sc})`, transformOrigin: `${pos.x}px ${pos.y}px`}}>
            <Ring x={pos.x} y={pos.y} rx={25 + (i % 3) * 3} ry={11} color="#C4A017" gemColor={RING_GEMS[i]} />
          </div>
        );
      })}

      {frame >= 36 && <Particles startFrame={36} cx={160} cy={450} count={15} radius={120} color="#FFE566" />}
      {frame >= 42 && <Particles startFrame={42} cx={175} cy={445} count={12} radius={100} color="#9C27B0" />}

      <SfxPop text="ฉึก! ✂️" x={200} y={550} startFrame={30} color="#4DD0E1" size={85} />
      <SfxPop text="✨ SPARKLE!" x={250} y={480} startFrame={39} color="#FFE566" size={75} rotation={5} />

      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: sceneIn,
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: '2px solid #9C27B0',
            borderRadius: 40,
            padding: '10px 36px',
            fontSize: 36,
            fontWeight: 800,
            color: '#CE93D8',
            letterSpacing: 3,
          }}
        >
          🎭 ยุคเรเนสซองส์ · ค.ศ. 1400–1600
        </div>
      </div>

      <WordCaption words={line1Words} endFrame={20} y={1440} />
      <WordCaption words={line2Words} endFrame={88} y={1440} />
    </AbsoluteFill>
  );
};

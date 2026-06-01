import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Ring} from '../components/Ring';
import {WordCaption, CaptionWord} from '../components/WordCaption';
import {Particles} from '../components/Particles';
import {SfxPop} from '../components/SfxPop';

const line1Words: CaptionWord[] = [
  {text: 'ดังนั้น', startFrame: 5},
  {text: 'ครั้งต่อไป', startFrame: 14},
  {text: 'ที่คุณแมตช์แหวน', startFrame: 24, highlight: true},
  {text: 'หลายๆ วง', startFrame: 36},
  {text: 'เข้าด้วยกัน...', startFrame: 46},
];

const line2Words: CaptionWord[] = [
  {text: 'จำไว้เลยว่า', startFrame: 70},
  {text: 'คุณกำลัง', startFrame: 78},
  {text: 'สืบทอด', startFrame: 84, highlight: true},
  {text: 'จิตวิญญาณ', startFrame: 90, highlight: true},
  {text: "'ความตัวมัม'", startFrame: 98, highlight: true},
  {text: 'ของเศรษฐี', startFrame: 106},
  {text: 'เมื่อพันปีที่แล้ว!', startFrame: 116, highlight: true},
];

const PhoneSVG: React.FC<{scale: number}> = ({scale}) => (
  <svg
    viewBox="0 0 220 400"
    width={220}
    height={400}
    style={{
      position: 'absolute',
      right: 80,
      top: 600,
      transform: `scale(${scale})`,
      transformOrigin: 'top right',
    }}
  >
    {/* Phone body */}
    <rect x="5" y="5" width="210" height="390" rx="30" fill="#222" />
    <rect x="10" y="10" width="200" height="380" rx="28" fill="#111" />
    {/* Screen */}
    <rect x="18" y="18" width="184" height="364" rx="22" fill="#1a1a3e" />
    {/* Status bar */}
    <rect x="30" y="25" width="60" height="6" rx="3" fill="#333" />
    <rect x="170" y="25" width="25" height="6" rx="3" fill="#333" />
    {/* Notch */}
    <rect x="80" y="18" width="60" height="20" rx="10" fill="#000" />
    {/* Post header */}
    <rect x="30" y="60" width="160" height="12" rx="6" fill="#333" />
    <rect x="30" y="80" width="100" height="10" rx="5" fill="#222" />
    {/* Photo area */}
    <rect x="18" y="105" width="184" height="180" fill="#1a3060" />
    <text x="110" y="200" textAnchor="middle" fontSize="60" fill="#FFE566">
      💍
    </text>
    {/* Engagement */}
    <text x="30" y="310" fontSize="18" fill="#fff">
      ❤️ 12.4K
    </text>
    <text x="30" y="335" fontSize="18" fill="#fff">
      💬 234
    </text>
    <text x="30" y="360" fontSize="14" fill="#888">
      Ring Stacking is everything ✨
    </text>
    {/* Home bar */}
    <rect x="80" y="372" width="60" height="5" rx="3" fill="#444" />
  </svg>
);

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const sceneOut = interpolate(frame, [270, 300], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(sceneIn, sceneOut);

  const phoneScale = spring({frame, fps, config: {damping: 12, stiffness: 100}});

  // Ring spring animations
  const r1 = spring({frame: frame - 15, fps, config: {damping: 8, stiffness: 200}});
  const r2 = spring({frame: frame - 25, fps, config: {damping: 8, stiffness: 200}});
  const r3 = spring({frame: frame - 35, fps, config: {damping: 8, stiffness: 200}});
  const r4 = spring({frame: frame - 45, fps, config: {damping: 8, stiffness: 200}});

  // Year counter animation
  const yearCount = Math.round(
    interpolate(frame, [60, 150], [0, 3000], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  const counterOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtitleOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ctaOpacity = interpolate(frame, [240, 255], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ctaScale = spring({frame: frame - 240, fps, config: {damping: 8, stiffness: 150}});

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        opacity,
      }}
    >
      {/* Modern hand with stacked rings (left side) */}
      <svg
        viewBox="0 0 200 350"
        width={200}
        height={350}
        style={{position: 'absolute', left: 60, top: 700}}
      >
        <path
          d="M40 200 Q35 150 38 120 Q40 105 52 103 Q64 101 66 115 L67 175 L70 115 Q72 100 84 98 Q96 96 97 112 L98 175 L100 110 Q102 96 114 94 Q126 92 127 108 L127 175 L131 118 Q133 108 142 110 Q152 112 151 124 L147 200 Q155 230 148 260 Q140 285 115 295 Q95 302 75 295 Q50 285 45 260 Z"
          fill="#F5CBA7"
        />
        {/* Thumb */}
        <path
          d="M40 200 Q25 192 18 178 Q10 160 18 147 Q26 136 38 140 L40 200Z"
          fill="#F5CBA7"
        />
      </svg>

      {/* Rings on the modern hand */}
      {frame >= 15 && (
        <div style={{transform: `scale(${r1})`, transformOrigin: '103px 785px'}}>
          <Ring x={103} y={785} rx={38} ry={13} color="#D4A017" gemColor="#E91E63" />
        </div>
      )}
      {frame >= 25 && (
        <div style={{transform: `scale(${r2})`, transformOrigin: '118px 778px'}}>
          <Ring x={118} y={778} rx={38} ry={13} gemColor="#2196F3" />
        </div>
      )}
      {frame >= 35 && (
        <div style={{transform: `scale(${r3})`, transformOrigin: '133px 783px'}}>
          <Ring x={133} y={783} rx={35} ry={12} color="#C0A060" />
        </div>
      )}
      {frame >= 45 && (
        <div style={{transform: `scale(${r4})`, transformOrigin: '103px 820px'}}>
          <Ring x={103} y={820} rx={37} ry={13} gemColor="#4CAF50" />
        </div>
      )}

      {/* Phone */}
      <PhoneSVG scale={phoneScale} />

      {/* Year counter */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 520,
          display: 'flex',
          justifyContent: 'center',
          opacity: counterOpacity,
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: '#FFE566',
            textShadow: '0 0 40px #FFE56660, 4px 4px 0 #000',
            letterSpacing: '-3px',
          }}
        >
          {yearCount.toLocaleString()}+
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 640,
          display: 'flex',
          justifyContent: 'center',
          opacity: subtitleOpacity,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: '#fff',
            textShadow: '2px 2px 0 #000',
          }}
        >
          ปีของประวัติศาสตร์
        </div>
      </div>

      {/* Burst particles when rings appear */}
      {frame >= 15 && (
        <Particles startFrame={15} cx={110} cy={785} count={10} radius={80} />
      )}
      {frame >= 45 && (
        <Particles startFrame={45} cx={110} cy={820} count={8} radius={70} color="#4CAF50" />
      )}

      {/* SFX pop */}
      <SfxPop text="👑 ICONIC!" x={350} y={860} startFrame={55} color="#FFE566" size={75} />

      {/* Captions */}
      <WordCaption words={line1Words} endFrame={65} y={1430} />
      <WordCaption words={line2Words} endFrame={245} y={1430} />

      {/* Follow CTA button */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: 60,
          right: 60,
          background: 'linear-gradient(135deg,#D4A017,#FFE566,#D4A017)',
          borderRadius: 60,
          padding: '28px 40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
          boxShadow: '0 8px 40px rgba(212,160,23,0.5)',
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: '#000',
            letterSpacing: '-1px',
          }}
        >
          กด Follow เพื่อดูตอนต่อไป! 👑
        </span>
      </div>

      {/* Top scene label */}
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
            border: '2px solid #FFE566',
            borderRadius: 40,
            padding: '10px 36px',
            fontSize: 36,
            fontWeight: 800,
            color: '#FFE566',
            letterSpacing: 2,
          }}
        >
          📱 Ring Stacking · ยุคนี้ vs ยุคโบราณ
        </div>
      </div>
    </AbsoluteFill>
  );
};

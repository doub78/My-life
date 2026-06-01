import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Ring} from '../components/Ring';
import {SfxPop} from '../components/SfxPop';
import {WordCaption, CaptionWord} from '../components/WordCaption';
import {Particles} from '../components/Particles';

const line1Words: CaptionWord[] = [
  {text: 'คุณคิดว่า', startFrame: 5},
  {text: 'การใส่แหวน', startFrame: 14},
  {text: 'หลายๆ วง', startFrame: 22},
  {text: 'บนนิ้วเดียว', startFrame: 30},
  {text: 'หรือ', startFrame: 38},
  {text: 'Ring Stacking', startFrame: 44, highlight: true},
  {text: 'เป็นแค่', startFrame: 54},
  {text: 'เทรนด์แฟชั่น', startFrame: 62},
  {text: 'ยุคนี้', startFrame: 70},
  {text: 'ใช่ไหม?', startFrame: 78},
];

const line2Words: CaptionWord[] = [
  {text: 'แต่ความจริงแล้ว...', startFrame: 118},
  {text: 'มันเริ่มมาจาก', startFrame: 126},
  {text: "'ความขี้อวด'", startFrame: 132, highlight: true},
  {text: 'ของคน', startFrame: 136},
  {text: 'เมื่อหลายพัน', startFrame: 140},
  {text: 'ปีก่อน!', startFrame: 144, highlight: true},
];

const HandSVG: React.FC<{opacity: number}> = ({opacity}) => (
  <svg
    viewBox="0 0 300 500"
    width={300}
    height={500}
    style={{position: 'absolute', left: 390, top: 680, opacity}}
  >
    {/* Palm */}
    <path
      d="M60 280 Q50 200 55 160 Q58 140 75 138 Q92 136 95 155 L98 240 L105 160 Q108 136 126 134 Q144 132 146 155 L148 240 L150 155 Q152 132 170 130 Q188 128 190 152 L190 240 L194 165 Q196 150 210 152 Q226 154 226 172 L220 280 Q230 320 220 360 Q210 400 170 420 Q140 432 110 420 Q70 405 60 360 Z"
      fill="#F5CBA7"
    />
    {/* Thumb */}
    <path
      d="M60 280 Q40 270 30 250 Q18 225 28 205 Q38 188 55 192 L60 280Z"
      fill="#F5CBA7"
    />
    {/* Finger dividers */}
    <line x1="98" y1="240" x2="98" y2="280" stroke="#E8B490" strokeWidth="1" opacity="0.5" />
    <line x1="148" y1="240" x2="148" y2="280" stroke="#E8B490" strokeWidth="1" opacity="0.5" />
    <line x1="190" y1="240" x2="190" y2="280" stroke="#E8B490" strokeWidth="1" opacity="0.5" />
    {/* Knuckle lines */}
    <path d="M75 190 Q88 185 100 190" fill="none" stroke="#E8B490" strokeWidth="1.5" opacity="0.6" />
    <path d="M120 186 Q134 181 147 186" fill="none" stroke="#E8B490" strokeWidth="1.5" opacity="0.6" />
    <path d="M163 184 Q176 179 188 184" fill="none" stroke="#E8B490" strokeWidth="1.5" opacity="0.6" />
    <path d="M200 192 Q210 188 220 192" fill="none" stroke="#E8B490" strokeWidth="1.5" opacity="0.6" />
    {/* Nail highlights */}
    <ellipse cx="87" cy="148" rx="9" ry="7" fill="#F9DCC4" opacity="0.7" />
    <ellipse cx="127" cy="145" rx="9" ry="7" fill="#F9DCC4" opacity="0.7" />
    <ellipse cx="170" cy="141" rx="9" ry="7" fill="#F9DCC4" opacity="0.7" />
    <ellipse cx="210" cy="160" rx="7" ry="6" fill="#F9DCC4" opacity="0.7" />
  </svg>
);

const GoldBar: React.FC<{
  x: number;
  y: number;
  scale: number;
  rotation: number;
}> = ({x, y, scale, rotation}) => (
  <svg
    width="120"
    height="60"
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `scale(${scale}) rotate(${rotation}deg)`,
      transformOrigin: 'center',
    }}
  >
    <defs>
      <linearGradient id="gold-bar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE87C" />
        <stop offset="40%" stopColor="#D4A017" />
        <stop offset="100%" stopColor="#8B6914" />
      </linearGradient>
    </defs>
    <rect x="5" y="15" width="110" height="40" rx="4" fill="url(#gold-bar-grad)" />
    <rect x="5" y="15" width="110" height="12" rx="4" fill="#FFE87C" opacity="0.3" />
    <text
      x="60"
      y="42"
      textAnchor="middle"
      fontSize="14"
      fontWeight="bold"
      fill="#8B6914"
      fontFamily="serif"
    >
      AURUM
    </text>
  </svg>
);

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Ring spring appearances
  const ring1Scale = spring({frame: frame - 10, fps, config: {damping: 8, stiffness: 200}});
  const ring2Scale = spring({frame: frame - 25, fps, config: {damping: 8, stiffness: 200}});
  const ring3Scale = spring({frame: frame - 40, fps, config: {damping: 8, stiffness: 200}});
  const ring4Scale = spring({frame: frame - 55, fps, config: {damping: 8, stiffness: 200}});

  // White flash at frame 90
  const flashOpacity = interpolate(frame, [88, 95, 100, 112], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Rings fade out after flash
  const ringsOpacity = interpolate(frame, [100, 118], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Gold bars appear after flash
  const goldBar1Scale = spring({frame: frame - 115, fps, config: {damping: 10}});
  const goldBar2Scale = spring({frame: frame - 122, fps, config: {damping: 10}});
  const goldBar3Scale = spring({frame: frame - 129, fps, config: {damping: 10}});

  // Hand fade in
  const handOpacity = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{background: 'radial-gradient(ellipse at 50% 40%, #1a1a2e 0%, #0d0d0d 100%)'}}
    >
      {/* Decorative background glow */}
      <div
        style={{
          position: 'absolute',
          left: 200,
          top: 400,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #2a1a4e22 0%, transparent 70%)',
        }}
      />

      {/* Hand illustration */}
      <HandSVG opacity={ringsOpacity * handOpacity} />

      {/* Ring 1 — index finger */}
      {frame >= 10 && (
        <div
          style={{
            opacity: ringsOpacity,
            transform: `scale(${ring1Scale})`,
            transformOrigin: '480px 810px',
          }}
        >
          <Ring x={480} y={810} rx={52} ry={18} color="#D4A017" />
        </div>
      )}

      {/* Ring 2 — middle finger with gem */}
      {frame >= 25 && (
        <div
          style={{
            opacity: ringsOpacity,
            transform: `scale(${ring2Scale})`,
            transformOrigin: '540px 790px',
          }}
        >
          <Ring x={540} y={790} rx={52} ry={18} color="#C0A060" gemColor="#E040FB" />
        </div>
      )}

      {/* Ring 3 — ring finger */}
      {frame >= 40 && (
        <div
          style={{
            opacity: ringsOpacity,
            transform: `scale(${ring3Scale})`,
            transformOrigin: '600px 800px',
          }}
        >
          <Ring x={600} y={800} rx={48} ry={17} color="#D4A017" />
        </div>
      )}

      {/* Ring 4 — index finger second knuckle with gem */}
      {frame >= 55 && (
        <div
          style={{
            opacity: ringsOpacity,
            transform: `scale(${ring4Scale})`,
            transformOrigin: '480px 850px',
          }}
        >
          <Ring x={480} y={850} rx={50} ry={17} gemColor="#00BCD4" />
        </div>
      )}

      {/* Burst particles per ring appearance */}
      {frame >= 10 && (
        <Particles startFrame={10} cx={480} cy={810} count={10} radius={80} />
      )}
      {frame >= 25 && (
        <Particles startFrame={25} cx={540} cy={790} count={10} radius={80} color="#E040FB" />
      )}
      {frame >= 40 && (
        <Particles startFrame={40} cx={600} cy={800} count={10} radius={80} />
      )}
      {frame >= 55 && (
        <Particles startFrame={55} cx={480} cy={850} count={10} radius={80} color="#00BCD4" />
      )}

      {/* White flash overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#fff',
          opacity: flashOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* SFX pop on flash */}
      <SfxPop text="เอี๊ยด! 🛑" x={300} y={700} startFrame={90} color="#FF5722" size={80} />

      {/* Gold bars replace rings after flash */}
      {frame >= 115 && (
        <>
          <GoldBar x={410} y={820} scale={goldBar1Scale} rotation={-5} />
          <GoldBar x={500} y={800} scale={goldBar2Scale} rotation={2} />
          <GoldBar x={580} y={830} scale={goldBar3Scale} rotation={-3} />
        </>
      )}

      {/* Captions */}
      <WordCaption words={line1Words} endFrame={90} />
      <WordCaption words={line2Words} endFrame={148} />

      {/* Top scene label */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(255,229,102,0.15)',
            border: '2px solid #FFE566',
            borderRadius: 40,
            padding: '12px 40px',
            fontSize: 38,
            fontWeight: 700,
            color: '#FFE566',
            letterSpacing: 2,
            opacity: interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'}),
          }}
        >
          Ring Stacking
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bokeh} from '../components/Bokeh';
import {GrainOverlay} from '../components/GrainOverlay';
import {Vignette} from '../components/Vignette';
import {Particles} from '../components/Particles';
import {Ring} from '../components/Ring';
import {SfxPop} from '../components/SfxPop';
import {WordCaption, CaptionWord} from '../components/WordCaption';
import {useKenBurns} from '../hooks/useKenBurns';
import {useZoomPunch} from '../hooks/useZoomPunch';

// SCENE: Modern hook — rings stacking on a hand → screech flash → gold bars
// COLOR GRADE: Warm golden (glamour / TikTok aesthetic)
// KEN BURNS: Slow push in, slight right pan

const line1Words: CaptionWord[] = [
  {text: 'คุณคิดว่า', startFrame: 3},
  {text: 'การใส่แหวน', startFrame: 8},
  {text: 'หลายๆ วง', startFrame: 13},
  {text: 'บนนิ้วเดียว', startFrame: 18},
  {text: 'หรือ', startFrame: 23},
  {text: 'Ring Stacking', startFrame: 26, highlight: true},
  {text: 'เป็นแค่', startFrame: 32},
  {text: 'เทรนด์แฟชั่น', startFrame: 37},
  {text: 'ยุคนี้', startFrame: 42},
  {text: 'ใช่ไหม?', startFrame: 47},
];

const line2Words: CaptionWord[] = [
  {text: 'แต่ความจริงแล้ว...', startFrame: 60},
  {text: 'มันเริ่มมาจาก', startFrame: 65},
  {text: "'ความขี้อวด'", startFrame: 69, highlight: true},
  {text: 'ของคน', startFrame: 73},
  {text: 'เมื่อหลายพัน', startFrame: 77},
  {text: 'ปีก่อน!', startFrame: 81, highlight: true},
];

// Zoom punch frames = frames where highlighted words appear
const PUNCH_FRAMES = [26, 69, 81];

const HandSVG: React.FC<{opacity: number}> = ({opacity}) => (
  <svg viewBox="0 0 300 500" width={300} height={500} style={{position: 'absolute', left: 390, top: 680, opacity}}>
    {/* Shadow */}
    <ellipse cx="160" cy="490" rx="100" ry="18" fill="rgba(0,0,0,0.3)" />
    {/* Palm */}
    <path
      d="M60 280 Q50 200 55 160 Q58 140 75 138 Q92 136 95 155 L98 240 L105 160 Q108 136 126 134 Q144 132 146 155 L148 240 L150 155 Q152 132 170 130 Q188 128 190 152 L190 240 L194 165 Q196 150 210 152 Q226 154 226 172 L220 280 Q230 320 220 360 Q210 400 170 420 Q140 432 110 420 Q70 405 60 360 Z"
      fill="url(#skin-grad)"
    />
    {/* Thumb */}
    <path d="M60 280 Q40 270 30 250 Q18 225 28 205 Q38 188 55 192 L60 280Z" fill="url(#skin-grad)" />
    {/* Subtle finger separators */}
    <line x1="98" y1="240" x2="98" y2="285" stroke="#D4956A" strokeWidth="1.5" opacity="0.4" />
    <line x1="148" y1="240" x2="148" y2="285" stroke="#D4956A" strokeWidth="1.5" opacity="0.4" />
    <line x1="190" y1="240" x2="190" y2="285" stroke="#D4956A" strokeWidth="1.5" opacity="0.4" />
    {/* Knuckle creases */}
    <path d="M74 192 Q87 186 100 192" fill="none" stroke="#C8845A" strokeWidth="2" opacity="0.5" />
    <path d="M118 188 Q133 182 147 188" fill="none" stroke="#C8845A" strokeWidth="2" opacity="0.5" />
    <path d="M161 186 Q175 180 188 186" fill="none" stroke="#C8845A" strokeWidth="2" opacity="0.5" />
    <path d="M198 194 Q210 189 222 195" fill="none" stroke="#C8845A" strokeWidth="2" opacity="0.5" />
    {/* Nails */}
    <ellipse cx="87" cy="147" rx="10" ry="8" fill="#FDDCC4" opacity="0.85" />
    <ellipse cx="127" cy="144" rx="10" ry="8" fill="#FDDCC4" opacity="0.85" />
    <ellipse cx="170" cy="140" rx="10" ry="8" fill="#FDDCC4" opacity="0.85" />
    <ellipse cx="210" cy="159" rx="8" ry="6.5" fill="#FDDCC4" opacity="0.85" />
    {/* Red nail polish */}
    <ellipse cx="87" cy="147" rx="8" ry="6" fill="rgba(200,30,50,0.75)" />
    <ellipse cx="127" cy="144" rx="8" ry="6" fill="rgba(200,30,50,0.75)" />
    <ellipse cx="170" cy="140" rx="8" ry="6" fill="rgba(200,30,50,0.75)" />
    <ellipse cx="210" cy="159" rx="6.5" ry="5" fill="rgba(200,30,50,0.75)" />
    <defs>
      <linearGradient id="skin-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F5CBA7" />
        <stop offset="60%" stopColor="#EDB88A" />
        <stop offset="100%" stopColor="#D4956A" />
      </linearGradient>
    </defs>
  </svg>
);

const GoldBar: React.FC<{x: number; y: number; scale: number; rotation: number}> = ({x, y, scale, rotation}) => (
  <svg
    width="130" height="65"
    style={{
      position: 'absolute', left: x, top: y,
      transform: `scale(${scale}) rotate(${rotation}deg)`,
      transformOrigin: 'center',
      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))',
    }}
  >
    <defs>
      <linearGradient id="bar-g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF176" />
        <stop offset="35%" stopColor="#D4A017" />
        <stop offset="100%" stopColor="#7A5500" />
      </linearGradient>
    </defs>
    <rect x="4" y="14" width="122" height="42" rx="5" fill="url(#bar-g)" />
    <rect x="4" y="14" width="122" height="14" rx="5" fill="rgba(255,255,255,0.25)" />
    <text x="65" y="43" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#6B4400" fontFamily="serif">AURUM</text>
  </svg>
);

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const kb = useKenBurns({durationFrames: 90, fromScale: 1.0, toScale: 1.13, fromX: 0, toX: 18});
  const punch = useZoomPunch(PUNCH_FRAMES);

  const contentScale = kb.scale * punch;

  const ring1S = spring({frame: frame - 6, fps, config: {damping: 8, stiffness: 200}});
  const ring2S = spring({frame: frame - 15, fps, config: {damping: 8, stiffness: 200}});
  const ring3S = spring({frame: frame - 24, fps, config: {damping: 8, stiffness: 200}});
  const ring4S = spring({frame: frame - 33, fps, config: {damping: 8, stiffness: 200}});

  const flashOpacity = interpolate(frame, [53, 57, 60, 67], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ringsOpacity = interpolate(frame, [60, 71], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const goldBar1S = spring({frame: frame - 69, fps, config: {damping: 10, stiffness: 180}});
  const goldBar2S = spring({frame: frame - 73, fps, config: {damping: 10, stiffness: 180}});
  const goldBar3S = spring({frame: frame - 77, fps, config: {damping: 10, stiffness: 180}});

  const handIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});

  // Heartbeat ambient glow pulsing behind rings
  const glowPulse = Math.sin(frame * 0.15) * 0.5 + 0.5;

  return (
    <>
      {/* ── BACKGROUND + CONTENT ── */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, #1e1a2e 0%, #0a0a12 100%)',
          filter: 'brightness(1.0) contrast(1.15) saturate(1.2)',
        }}
      >
        {/* Bokeh atmosphere */}
        <Bokeh color="255,200,50" maxOpacity={0.09} />

        {/* Warm golden tint overlay */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(200,140,0,0.08)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />

        {/* ── KEN BURNS + PUNCH WRAPPER ── */}
        <div
          style={{
            position: 'absolute', inset: 0,
            transform: `scale(${contentScale}) translateX(${kb.x}px)`,
            transformOrigin: 'center center',
          }}
        >
          {/* Ambient glow ring */}
          <div
            style={{
              position: 'absolute', left: 350, top: 680,
              width: 380, height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(212,160,23,${0.15 + glowPulse * 0.08}) 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Hand illustration */}
          <HandSVG opacity={ringsOpacity * handIn} />

          {/* Stacking rings */}
          {frame >= 6 && (
            <div style={{opacity: ringsOpacity, transform: `scale(${ring1S})`, transformOrigin: '480px 810px'}}>
              <Ring x={480} y={810} rx={52} ry={18} color="#D4A017" />
            </div>
          )}
          {frame >= 15 && (
            <div style={{opacity: ringsOpacity, transform: `scale(${ring2S})`, transformOrigin: '540px 790px'}}>
              <Ring x={540} y={790} rx={52} ry={18} color="#C0A060" gemColor="#E040FB" />
            </div>
          )}
          {frame >= 24 && (
            <div style={{opacity: ringsOpacity, transform: `scale(${ring3S})`, transformOrigin: '600px 800px'}}>
              <Ring x={600} y={800} rx={48} ry={17} color="#D4A017" />
            </div>
          )}
          {frame >= 33 && (
            <div style={{opacity: ringsOpacity, transform: `scale(${ring4S})`, transformOrigin: '480px 850px'}}>
              <Ring x={480} y={850} rx={50} ry={17} gemColor="#00BCD4" />
            </div>
          )}

          {/* Particles on ring appear */}
          {frame >= 6 && <Particles startFrame={6} cx={480} cy={810} count={12} radius={90} />}
          {frame >= 15 && <Particles startFrame={15} cx={540} cy={790} count={12} radius={90} color="#E040FB" />}
          {frame >= 24 && <Particles startFrame={24} cx={600} cy={800} count={10} radius={80} />}
          {frame >= 33 && <Particles startFrame={33} cx={480} cy={850} count={10} radius={80} color="#00BCD4" />}

          {/* Gold bars appear after flash */}
          {frame >= 69 && (
            <>
              <GoldBar x={395} y={820} scale={goldBar1S} rotation={-5} />
              <GoldBar x={495} y={800} scale={goldBar2S} rotation={2} />
              <GoldBar x={575} y={832} scale={goldBar3S} rotation={-3} />
            </>
          )}

          {/* Particles when bars appear */}
          {frame >= 69 && <Particles startFrame={69} cx={530} cy={820} count={15} radius={150} color="#FFE566" />}
        </div>

        {/* Screech flash */}
        <div
          style={{
            position: 'absolute', inset: 0, background: '#fff',
            opacity: flashOpacity, pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>

      {/* ── POST-PROCESS ── */}
      <Vignette intensity={0.65} />
      <GrainOverlay opacity={0.038} />

      {/* ── HUD / UI ── */}
      <div
        style={{
          position: 'absolute', top: 110, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          opacity: interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'}),
          zIndex: 100,
        }}
      >
        <div
          style={{
            background: 'rgba(212,160,23,0.18)',
            border: '2px solid rgba(255,229,102,0.8)',
            borderRadius: 40,
            padding: '12px 44px',
            fontSize: 38, fontWeight: 700, color: '#FFE566',
            letterSpacing: 3,
            backdropFilter: 'blur(4px)',
            textShadow: '0 0 20px rgba(255,229,102,0.4)',
          }}
        >
          💍 Ring Stacking
        </div>
      </div>

      <SfxPop text="เอี๊ยด! 🛑" x={280} y={680} startFrame={54} color="#FF5722" size={82} />

      <WordCaption words={line1Words} endFrame={55} />
      <WordCaption words={line2Words} endFrame={89} />
    </>
  );
};

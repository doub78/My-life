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

// SCENE: Renaissance — noblewoman cuts silk gloves to show off jeweled rings
// COLOR GRADE: Dark moody purple / Rembrandt chiaroscuro
// KEN BURNS: Slow push in, slight upward tilt (reverence feel)

const RING_GEMS = ['#E91E63', '#2196F3', '#4CAF50', '#FFFFFF', '#9C27B0'];
const RING_FRAMES = [36, 39, 42, 45, 48];
const RING_POSITIONS = [{x: 132, y: 450}, {x: 154, y: 443}, {x: 166, y: 445}, {x: 177, y: 453}, {x: 142, y: 460}];

const PUNCH_FRAMES = [3, 7, 35, 37, 44, 49, 54];

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

// Animated candle flames behind noblewoman
const CandleFlames: React.FC = () => {
  const frame = useCurrentFrame();
  const candles = [
    {x: 80, y: 900}, {x: 140, y: 950}, {x: 950, y: 880}, {x: 1010, y: 930},
  ];
  return (
    <>
      {candles.map((c, i) => {
        const flicker = Math.sin(frame * 0.22 + i * 1.4) * 0.15 + 1;
        const sway = Math.sin(frame * 0.18 + i * 0.8) * 8;
        return (
          <g key={i}>
            {/* Candle stick */}
            <rect
              x={c.x - 6} y={c.y}
              width={12} height={60}
              fill="#EDE0C4"
              style={{position: 'absolute'}}
            />
            {/* Flame glow */}
            <div style={{
              position: 'absolute',
              left: c.x - 25, top: c.y - 55,
              width: 50, height: 80,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              background: `radial-gradient(ellipse at 50% 70%, rgba(255,200,50,${0.25 * flicker}), transparent 75%)`,
              transform: `scaleX(${1 + sway * 0.01})`,
              pointerEvents: 'none',
            }} />
          </g>
        );
      })}
    </>
  );
};

const NoblewomanFigure: React.FC = () => (
  <svg viewBox="0 0 420 820" width={420} height={820} style={{position: 'absolute', left: 130, top: 140}}>
    {/* Ground shadow */}
    <ellipse cx="210" cy="812" rx="120" ry="16" fill="rgba(0,0,0,0.4)" />
    {/* Skirt */}
    <path d="M210 490 Q80 512 38 795 L382 795 Q340 512 210 490Z" fill="url(#skirt-grad)" />
    <path d="M210 490 Q105 520 75 712 Q106 700 126 730 Q148 700 210 490Z" fill="rgba(120,15,40,0.4)" />
    <path d="M210 490 Q315 520 345 712 Q314 700 294 730 Q272 700 210 490Z" fill="rgba(120,15,40,0.4)" />
    {/* Ruffle lines */}
    <path d="M38 695 Q210 650 382 695" fill="none" stroke="#9B2240" strokeWidth="3.5" opacity="0.7" />
    <path d="M48 610 Q210 568 372 610" fill="none" stroke="#9B2240" strokeWidth="3" opacity="0.65" />
    <path d="M52 530 Q210 505 368 530" fill="none" stroke="#9B2240" strokeWidth="3" opacity="0.6" />
    {/* Bodice */}
    <path d="M145 290 Q134 392 155 490 L265 490 Q276 392 265 290 Z" fill="url(#bodice-grad)" />
    {/* Gold trim V */}
    <path d="M175 300 Q210 322 245 300 L245 344 Q210 328 175 344 Z" fill="rgba(212,160,23,0.7)" />
    {/* Sleeves */}
    <path d="M145 298 Q82 278 28 330 Q7 350 18 372 Q29 392 56 376 Q102 340 148 350" fill="url(#sleeve-grad)" />
    <path d="M145 298 Q98 293 55 318" fill="none" stroke="#C4A017" strokeWidth="3.5" />
    <path d="M265 298 Q328 278 372 320 Q390 342 376 364 L350 354 Q320 326 268 350" fill="url(#sleeve-grad)" />
    <path d="M265 298 Q316 294 355 326" fill="none" stroke="#C4A017" strokeWidth="3.5" />
    {/* Neck ruff — pleated white collar */}
    <ellipse cx="210" cy="258" rx="58" ry="20" fill="#F5F0E8" opacity="0.92" />
    {Array.from({length: 14}).map((_, i) => {
      const a = (i / 14) * Math.PI * 2;
      return (
        <ellipse
          key={i} fill="#F5F0E8" opacity="0.82"
          cx={210 + Math.cos(a) * 52} cy={258 + Math.sin(a) * 18}
          rx="11" ry="6"
          transform={`rotate(${i * (360 / 14)},${210 + Math.cos(a) * 52},${258 + Math.sin(a) * 18})`}
        />
      );
    })}
    {/* Head */}
    <circle cx="210" cy="165" r="75" fill="url(#skin-r)" />
    {/* Face */}
    <ellipse cx="191" cy="158" rx="8.5" ry="10" fill="#4A2512" />
    <ellipse cx="229" cy="158" rx="8.5" ry="10" fill="#4A2512" />
    <path d="M191 190 Q210 203 229 190" fill="none" stroke="#C46A5A" strokeWidth="3.5" strokeLinecap="round" />
    {/* Lips */}
    <ellipse cx="210" cy="192" rx="14" ry="7" fill="rgba(180,40,60,0.6)" />
    {/* Elaborate updo */}
    <ellipse cx="210" cy="94" rx="58" ry="32" fill="#2A1206" />
    <path d="M154 116 Q150 74 170 58 Q190 42 210 44 Q230 42 250 58 Q270 74 266 116" fill="#2A1206" />
    {/* Pearl hairpins */}
    {Array.from({length: 7}).map((_, i) => (
      <circle key={i} cx={163 + i * 14} cy={76} r="4.5" fill="#F5F0E8" opacity="0.9" />
    ))}
    {/* Left arm extended with glove */}
    <path d="M18 368 Q4 362 -2 350 Q-8 336 8 328 Q24 320 35 333 L55 376Z" fill="#EDE8E0" opacity="0.95" />
    {/* Glove fingertips - cut */}
    <rect x="-10" y="298" width="12" height="32" rx="6" fill="#EDE8E0" opacity="0.95" />
    <rect x="4" y="291" width="12" height="36" rx="6" fill="#EDE8E0" opacity="0.95" />
    <rect x="18" y="293" width="12" height="34" rx="6" fill="#EDE8E0" opacity="0.95" />
    <rect x="30" y="300" width="11" height="28" rx="5" fill="#EDE8E0" opacity="0.95" />
    {/* Cut-edge detail on fingertips */}
    <path d="M-10 298 Q-4 292 2 298" fill="none" stroke="#C8B89A" strokeWidth="1.5" opacity="0.8" />
    <path d="M4 291 Q10 285 16 291" fill="none" stroke="#C8B89A" strokeWidth="1.5" opacity="0.8" />
    <path d="M18 293 Q24 287 30 293" fill="none" stroke="#C8B89A" strokeWidth="1.5" opacity="0.8" />
    <defs>
      <linearGradient id="skirt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7B0E28" />
        <stop offset="100%" stopColor="#4A0818" />
      </linearGradient>
      <linearGradient id="bodice-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#9B1A32" />
        <stop offset="100%" stopColor="#6B0E22" />
      </linearGradient>
      <linearGradient id="sleeve-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3a0a5e" />
        <stop offset="100%" stopColor="#1a0533" />
      </linearGradient>
      <linearGradient id="skin-r" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#DDAD90" />
        <stop offset="100%" stopColor="#C49070" />
      </linearGradient>
    </defs>
  </svg>
);

interface ScissorsSVGProps { progress: number }
const ScissorsSVG: React.FC<ScissorsSVGProps> = ({progress}) => {
  const angle = progress * 38;
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" style={{
      position: 'absolute', left: 32, top: 372,
      transform: `rotate(${angle}deg)`, transformOrigin: '65px 65px',
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
    }}>
      <path d="M22 58 Q65 53 108 30 Q102 40 65 65 Z" fill="#AAA" stroke="#666" strokeWidth="1" />
      <path d="M22 72 Q65 77 108 100 Q102 90 65 65 Z" fill="#AAA" stroke="#666" strokeWidth="1" />
      <circle cx="65" cy="65" r="8" fill="#CCC" />
      <ellipse cx="20" cy="48" rx="13" ry="18" fill="none" stroke="#999" strokeWidth="3.5" />
      <ellipse cx="20" cy="82" rx="13" ry="18" fill="none" stroke="#999" strokeWidth="3.5" />
    </svg>
  );
};

export const RenaissanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const kb = useKenBurns({durationFrames: 90, fromScale: 1.0, toScale: 1.1, fromY: 0, toY: -18});
  const punch = useZoomPunch(PUNCH_FRAMES);

  const sceneIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});

  const scissorProgress = interpolate(frame, [26, 34], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const scissorOpacity = interpolate(frame, [24, 27, 36, 42], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Candle ambient flicker on background
  const candleFlicker = Math.sin(frame * 0.14) * 0.06 + 0.94;

  return (
    <>
      {/* ── BACKGROUND + CONTENT ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 40%, rgba(80,10,120,${0.55 * candleFlicker}), #0d0018 100%)`,
          filter: 'brightness(0.72) contrast(1.38) saturate(0.88) hue-rotate(-18deg)',
          opacity: sceneIn,
        }}
      >
        {/* Deep purple tint */}
        <div style={{position: 'absolute', inset: 0, background: 'rgba(70,0,110,0.22)', mixBlendMode: 'screen', pointerEvents: 'none'}} />

        {/* Candlelight warm glow from bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
          background: `linear-gradient(0deg, rgba(180,90,10,${0.18 * candleFlicker}), transparent)`,
          pointerEvents: 'none',
        }} />

        {/* Bokeh — golden candlelight bokeh */}
        <Bokeh color="220,120,20" maxOpacity={0.12} />

        {/* Stars / dust motes */}
        {Array.from({length: 22}).map((_, i) => {
          const sx = (i * 137.5 + 50) % 1080;
          const sy = (i * 89.3 + 100) % 1700;
          const twinkle = Math.sin(frame * 0.09 + i * 0.7) * 0.5 + 0.5;
          return (
            <div key={i} style={{
              position: 'absolute', left: sx, top: sy,
              width: 3 + (i % 3), height: 3 + (i % 3),
              borderRadius: '50%', background: '#fff',
              opacity: twinkle * 0.35, pointerEvents: 'none',
            }} />
          );
        })}

        {/* KEN BURNS + PUNCH wrapper */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: `scale(${kb.scale * punch}) translateY(${kb.y}px)`,
          transformOrigin: 'center center',
        }}>
          <NoblewomanFigure />
          <CandleFlames />

          {/* Scissors */}
          <div style={{opacity: scissorOpacity}}>
            <ScissorsSVG progress={scissorProgress} />
          </div>

          {/* Jeweled rings reveal */}
          {RING_FRAMES.map((startF, i) => {
            if (frame < startF) return null;
            const sc = spring({frame: frame - startF, fps, config: {damping: 7, stiffness: 260}});
            const pos = RING_POSITIONS[i];
            return (
              <div key={i} style={{transform: `scale(${sc})`, transformOrigin: `${pos.x}px ${pos.y}px`}}>
                <Ring x={pos.x} y={pos.y} rx={27 + (i % 3) * 3} ry={12} color="#C4A017" gemColor={RING_GEMS[i]} />
              </div>
            );
          })}
        </div>

        {/* Sparkle particles when rings appear */}
        {frame >= 36 && <Particles startFrame={36} cx={155} cy={450} count={18} radius={130} color="#FFE566" />}
        {frame >= 42 && <Particles startFrame={42} cx={170} cy={445} count={14} radius={110} color="#9C27B0" />}
        {frame >= 48 && <Particles startFrame={48} cx={160} cy={458} count={12} radius={100} color="#E91E63" />}
      </AbsoluteFill>

      {/* ── POST-PROCESS ── */}
      <Vignette intensity={0.78} color="20,0,35" />
      <GrainOverlay opacity={0.052} />

      {/* ── HUD / UI ── */}
      <SfxPop text="ฉึก! ✂️" x={195} y={540} startFrame={30} color="#4DD0E1" size={88} />
      <SfxPop text="✨ SPARKLE!" x={240} y={468} startFrame={39} color="#FFE566" size={78} rotation={5} />

      <div style={{
        position: 'absolute', top: 80, left: 0, right: 0, display: 'flex', justifyContent: 'center',
        opacity: sceneIn, zIndex: 100,
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.58)', border: '2px solid rgba(156,39,176,0.85)',
          borderRadius: 40, padding: '10px 38px', fontSize: 36, fontWeight: 800,
          color: '#CE93D8', letterSpacing: 3,
          textShadow: '0 0 15px rgba(156,39,176,0.5)',
        }}>
          🎭 ยุคเรเนสซองส์ · ค.ศ. 1400–1600
        </div>
      </div>

      <WordCaption words={line1Words} endFrame={20} y={1440} />
      <WordCaption words={line2Words} endFrame={88} y={1440} />
    </>
  );
};

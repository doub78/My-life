import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bokeh} from '../components/Bokeh';
import {EraTimeline} from '../components/EraTimeline';
import {GlassBadge} from '../components/GlassBadge';
import {GrainOverlay} from '../components/GrainOverlay';
import {Particles} from '../components/Particles';
import {Ring} from '../components/Ring';
import {SfxPop} from '../components/SfxPop';
import {Vignette} from '../components/Vignette';
import {WordCaption, CaptionWord} from '../components/WordCaption';
import {useKenBurns} from '../hooks/useKenBurns';
import {useZoomPunch} from '../hooks/useZoomPunch';

// SCENE: Renaissance — noblewoman cuts silk gloves for jeweled rings
// Style: dark moody purple Kurzgesagt flat design + Rembrandt chiaroscuro

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

// Animated candle ambient glow — div-based (no mixed SVG/div)
const CandleGlows: React.FC<{frame: number}> = ({frame}) => {
  const candles = [
    {x: 80, y: 880}, {x: 140, y: 930}, {x: 950, y: 860}, {x: 1010, y: 910},
  ];
  return (
    <>
      {candles.map((c, i) => {
        const flicker = Math.sin(frame * 0.22 + i * 1.4) * 0.15 + 1;
        const sway = Math.sin(frame * 0.18 + i * 0.8) * 6;
        return (
          <div key={i}>
            {/* Candle body */}
            <div style={{
              position: 'absolute', left: c.x - 7, top: c.y,
              width: 14, height: 64,
              background: 'linear-gradient(180deg, #FFFDE7, #FFF9C4)',
              border: '2px solid #E0D07A',
              borderRadius: 2,
            }} />
            {/* Flame */}
            <div style={{
              position: 'absolute',
              left: c.x - 14 + sway * 0.3, top: c.y - 52,
              width: 28, height: 52,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              background: `radial-gradient(ellipse at 50% 70%, rgba(255,200,50,${0.9 * flicker}), rgba(255,120,0,0.6) 60%, transparent 90%)`,
              filter: 'blur(2px)',
            }} />
            {/* Glow */}
            <div style={{
              position: 'absolute',
              left: c.x - 36, top: c.y - 80,
              width: 72, height: 100,
              borderRadius: '50%',
              background: `radial-gradient(ellipse, rgba(255,180,30,${0.22 * flicker}), transparent 75%)`,
            }} />
          </div>
        );
      })}
    </>
  );
};

// Flat Kurzgesagt noblewoman with bold outlines
const FlatNoblewomanFigure: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const bodyIn = spring({frame, fps, config: {damping: 14, stiffness: 90}});
  return (
    <svg viewBox="0 0 420 820" width={420} height={820}
      style={{position: 'absolute', left: 130, top: 140, transform: `scale(${bodyIn})`, transformOrigin: '210px 410px'}}
    >
      <ellipse cx="210" cy="812" rx="120" ry="16" fill="rgba(0,0,0,0.35)" />

      {/* Skirt — flat bold */}
      <path d="M210 490 Q80 512 38 795 L382 795 Q340 512 210 490Z"
        fill="#7B0E28" stroke="#3A0010" strokeWidth="3.5" />
      {/* Ruffle shadows */}
      <path d="M210 490 Q105 520 75 712 Q106 700 126 730 Q148 700 210 490Z" fill="rgba(100,0,30,0.45)" />
      <path d="M210 490 Q315 520 345 712 Q314 700 294 730 Q272 700 210 490Z" fill="rgba(100,0,30,0.45)" />
      {/* Bold ruffle lines */}
      <path d="M38 695 Q210 650 382 695" fill="none" stroke="#C02040" strokeWidth="4" strokeLinecap="round" />
      <path d="M48 610 Q210 568 372 610" fill="none" stroke="#C02040" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M52 530 Q210 505 368 530" fill="none" stroke="#C02040" strokeWidth="3" strokeLinecap="round" />

      {/* Bodice */}
      <path d="M145 290 Q134 392 155 490 L265 490 Q276 392 265 290 Z"
        fill="#9B1A32" stroke="#3A0010" strokeWidth="3.5" />
      {/* Gold trim V */}
      <path d="M175 300 Q210 322 245 300 L245 344 Q210 328 175 344 Z"
        fill="#D4A017" stroke="#7A5500" strokeWidth="2" />

      {/* Sleeves */}
      <path d="M145 298 Q82 278 28 330 Q7 350 18 372 Q29 392 56 376 Q102 340 148 350"
        fill="#2D0850" stroke="#1A0333" strokeWidth="3.5" />
      <path d="M265 298 Q328 278 372 320 Q390 342 376 364 L350 354 Q320 326 268 350"
        fill="#2D0850" stroke="#1A0333" strokeWidth="3.5" />
      {/* Sleeve gold trim */}
      <path d="M145 298 Q98 293 55 318" fill="none" stroke="#D4A017" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M265 298 Q316 294 355 326" fill="none" stroke="#D4A017" strokeWidth="3.5" strokeLinecap="round" />

      {/* Neck ruff — flat white circles */}
      <ellipse cx="210" cy="258" rx="58" ry="20" fill="#F5F0E8" stroke="#C8BEAA" strokeWidth="2.5" />
      {Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <ellipse key={i} fill="#F5F0E8" stroke="#C8BEAA" strokeWidth="1.5"
            cx={210 + Math.cos(a) * 52} cy={258 + Math.sin(a) * 18}
            rx="11" ry="6"
            transform={`rotate(${i * 30},${210 + Math.cos(a) * 52},${258 + Math.sin(a) * 18})`}
          />
        );
      })}

      {/* Head */}
      <circle cx="210" cy="165" r="75" fill="#DDAD90" stroke="#8A5030" strokeWidth="3.5" />
      {/* Eyes — bold flat dots */}
      <circle cx="188" cy="158" r="10" fill="#2A1006" />
      <circle cx="232" cy="158" r="10" fill="#2A1006" />
      <circle cx="191" cy="155" r="3.5" fill="#fff" opacity="0.7" />
      <circle cx="235" cy="155" r="3.5" fill="#fff" opacity="0.7" />
      {/* Lips */}
      <path d="M191 190 Q210 203 229 190" fill="none" stroke="#C46A5A" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="210" cy="192" rx="14" ry="7" fill="rgba(180,40,60,0.55)" />

      {/* Elaborate updo — flat bold */}
      <ellipse cx="210" cy="94" rx="58" ry="32" fill="#1E0A04" stroke="#000" strokeWidth="2" />
      <path d="M154 116 Q150 74 170 58 Q190 42 210 44 Q230 42 250 58 Q270 74 266 116"
        fill="#1E0A04" stroke="#000" strokeWidth="2" />
      {/* Pearl hairpins */}
      {Array.from({length: 7}).map((_, i) => (
        <circle key={i} cx={163 + i * 14} cy={76} r="5" fill="#F5F0E8" stroke="#C8BEAA" strokeWidth="1.5" />
      ))}

      {/* Extended arm with cut glove */}
      <path d="M18 368 Q4 362 -2 350 Q-8 336 8 328 Q24 320 35 333 L55 376Z"
        fill="#EDE8E0" stroke="#A09080" strokeWidth="2.5" />
      {/* Cut fingertips */}
      <rect x="-10" y="298" width="13" height="32" rx="6" fill="#EDE8E0" stroke="#A09080" strokeWidth="2" />
      <rect x="4" y="291" width="13" height="36" rx="6" fill="#EDE8E0" stroke="#A09080" strokeWidth="2" />
      <rect x="18" y="293" width="13" height="34" rx="6" fill="#EDE8E0" stroke="#A09080" strokeWidth="2" />
      <rect x="30" y="300" width="12" height="28" rx="5" fill="#EDE8E0" stroke="#A09080" strokeWidth="2" />
      {/* Cut edge marks — bold Kurzgesagt */}
      <path d="M-10 298 Q-3 292 3 298" fill="none" stroke="#C0A090" strokeWidth="2" />
      <path d="M4 291 Q11 285 17 291" fill="none" stroke="#C0A090" strokeWidth="2" />
      <path d="M18 293 Q25 287 31 293" fill="none" stroke="#C0A090" strokeWidth="2" />
    </svg>
  );
};

// Flat scissors — Kurzgesagt bold style
interface ScissorsSVGProps {progress: number}
const FlatScissorsSVG: React.FC<ScissorsSVGProps> = ({progress}) => {
  const angle = progress * 38;
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" style={{
      position: 'absolute', left: 32, top: 372,
      transform: `rotate(${angle}deg)`, transformOrigin: '65px 65px',
      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
    }}>
      <path d="M22 58 Q65 53 108 30 Q102 40 65 65 Z"
        fill="#C0C0C0" stroke="#555" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M22 72 Q65 77 108 100 Q102 90 65 65 Z"
        fill="#C0C0C0" stroke="#555" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="65" cy="65" r="9" fill="#E0E0E0" stroke="#888" strokeWidth="2" />
      <ellipse cx="20" cy="48" rx="13" ry="18" fill="none" stroke="#999" strokeWidth="4" />
      <ellipse cx="20" cy="82" rx="13" ry="18" fill="none" stroke="#999" strokeWidth="4" />
      {/* Gold screw center */}
      <circle cx="65" cy="65" r="5" fill="#D4A017" />
    </svg>
  );
};

// Dust motes / dark studio ambiance
const DustMotes: React.FC<{frame: number}> = ({frame}) => (
  <>
    {Array.from({length: 18}).map((_, i) => {
      const sx = (i * 137.5 + 50) % 1080;
      const sy = (i * 89.3 + 100) % 1700;
      const twinkle = Math.sin(frame * 0.09 + i * 0.7) * 0.5 + 0.5;
      return (
        <div key={i} style={{
          position: 'absolute', left: sx, top: sy,
          width: 3 + (i % 3), height: 3 + (i % 3),
          borderRadius: '50%', background: '#fff',
          opacity: twinkle * 0.28, pointerEvents: 'none',
        }} />
      );
    })}
  </>
);

export const RenaissanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const kb = useKenBurns({durationFrames: 90, fromScale: 1.0, toScale: 1.1, fromY: 0, toY: -18});
  const punch = useZoomPunch(PUNCH_FRAMES);

  const sceneIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});

  const scissorProgress = interpolate(frame, [26, 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scissorOpacity = interpolate(frame, [24, 27, 36, 42], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const candleFlicker = Math.sin(frame * 0.14) * 0.06 + 0.94;

  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 40%, rgba(80,10,120,${0.55 * candleFlicker}), #0d0018 100%)`,
          filter: 'brightness(0.72) contrast(1.38) saturate(0.88) hue-rotate(-18deg)',
          opacity: sceneIn,
        }}
      >
        {/* Deep purple overlay */}
        <div style={{position: 'absolute', inset: 0, background: 'rgba(70,0,110,0.22)', mixBlendMode: 'screen', pointerEvents: 'none'}} />

        {/* Candlelight warm glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
          background: `linear-gradient(0deg, rgba(180,90,10,${0.18 * candleFlicker}), transparent)`,
          pointerEvents: 'none',
        }} />

        <Bokeh color="220,120,20" maxOpacity={0.12} />
        <DustMotes frame={frame} />
        <CandleGlows frame={frame} />

        {/* Diagonal accent lines — gold tinted */}
        <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04}}>
          {Array.from({length: 6}).map((_, i) => (
            <line key={i} x1={i * 200} y1={0} x2={i * 200 + 280} y2={1920} stroke="#9C27B0" strokeWidth="1.5" />
          ))}
        </svg>

        {/* KEN BURNS + PUNCH */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: `scale(${kb.scale * punch}) translateY(${kb.y}px)`,
          transformOrigin: 'center center',
        }}>
          <FlatNoblewomanFigure frame={frame} fps={fps} />

          {/* Scissors */}
          <div style={{opacity: scissorOpacity}}>
            <FlatScissorsSVG progress={scissorProgress} />
          </div>

          {/* Jeweled rings reveal — Kurzgesagt damping:200 */}
          {RING_FRAMES.map((startF, i) => {
            if (frame < startF) return null;
            const sc = spring({frame: frame - startF, fps, config: {damping: 200, stiffness: 28}});
            const pos = RING_POSITIONS[i];
            return (
              <div key={i} style={{transform: `scale(${sc})`, transformOrigin: `${pos.x}px ${pos.y}px`}}>
                <Ring x={pos.x} y={pos.y} rx={27 + (i % 3) * 3} ry={12} color="#C4A017" gemColor={RING_GEMS[i]} />
              </div>
            );
          })}

          <Particles startFrame={36} cx={155} cy={450} count={18} radius={130} color="#FFE566" />
          {frame >= 42 && <Particles startFrame={42} cx={170} cy={445} count={14} radius={110} color="#9C27B0" />}
          {frame >= 48 && <Particles startFrame={48} cx={160} cy={458} count={12} radius={100} color="#E91E63" />}
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.78} color="20,0,35" />
      <GrainOverlay opacity={0.052} />

      {/* Glass badge — purple accent */}
      <div style={{
        position: 'absolute', top: 108, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: sceneIn, zIndex: 100,
      }}>
        <GlassBadge startFrame={0} accentColor="#CE93D8" size="md">
          🎭 ยุคเรเนสซองส์ · ค.ศ. 1400–1600
        </GlassBadge>
      </div>

      <SfxPop text="ฉึก! ✂️" x={195} y={540} startFrame={30} color="#4DD0E1" size={88} />
      <SfxPop text="✨ SPARKLE!" x={240} y={468} startFrame={39} color="#FFE566" size={78} rotation={5} />

      <WordCaption words={line1Words} endFrame={20} y={1440} />
      <WordCaption words={line2Words} endFrame={88} y={1440} />

      {/* Era timeline — era 1 (Renaissance) active */}
      <EraTimeline startFrame={5} activeEra={1} bottom={180} />
    </>
  );
};

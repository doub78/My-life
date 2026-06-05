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

// SCENE: Ancient Rome / Egypt — rings as status symbols
// COLOR GRADE: Warm sepia — sand, gold, ancient papyrus
// KEN BURNS: Slow zoom OUT (wider reveal of the character's wealth)

const RING_APPEAR_FRAMES = [9, 12, 14, 17, 20, 23, 25, 28];
const PUNCH_FRAMES = [6, 18, 33, 43, 49];

const line1Words: CaptionWord[] = [
  {text: 'ย้อนกลับ', startFrame: 1},
  {text: 'ยุค', startFrame: 3},
  {text: 'อียิปต์', startFrame: 4, highlight: true},
  {text: 'และ', startFrame: 5},
  {text: 'โรมันโบราณ', startFrame: 6, highlight: true},
  {text: 'เครื่องประดับ', startFrame: 8},
  {text: 'ไม่ใช่แค่', startFrame: 11},
  {text: "'สมุดบัญชี", startFrame: 13, highlight: true},
  {text: "เคลื่อนที่'", startFrame: 15, highlight: true},
  {text: 'ยิ่งรวยมาก!', startFrame: 18, highlight: true},
];

const line2Words: CaptionWord[] = [
  {text: 'เศรษฐียุคนั้น', startFrame: 30},
  {text: 'ใส่แหวน', startFrame: 32},
  {text: 'ทองเหลือง', startFrame: 33, highlight: true},
  {text: 'ซ้อนกัน', startFrame: 35},
  {text: 'ทุกข้อนิ้ว', startFrame: 37, highlight: true},
  {text: 'งอนิ้ว', startFrame: 40},
  {text: 'ไม่ได้เลย!', startFrame: 43, highlight: true},
  {text: 'เพื่ออวด', startFrame: 47},
  {text: 'สถานะ', startFrame: 49, highlight: true},
  {text: 'ทางสังคม', startFrame: 51},
];

// Falling gold coins background
const FallingCoins: React.FC = () => {
  const frame = useCurrentFrame();
  const coins = Array.from({length: 14}, (_, i) => ({
    x: ((i * 97 + 40) % 1000) + 40,
    delay: i * 5,
    speed: 0.8 + (i % 4) * 0.3,
    size: 18 + (i % 5) * 6,
  }));
  return (
    <>
      {coins.map((c, i) => {
        const t = ((frame - c.delay) * c.speed) % 2000;
        if (t < 0) return null;
        const y = (t - 100) % 2100;
        const rotate = t * 2.5;
        const opacity = Math.min(1, t / 60) * Math.max(0, 1 - Math.max(0, y - 1800) / 200);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: c.x, top: y,
              width: c.size * 1.6, height: c.size,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at 35% 30%, #FFF176, #D4A017 50%, #7A5500)`,
              opacity: opacity * 0.65,
              transform: `rotate(${rotate}deg)`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}
          />
        );
      })}
    </>
  );
};

const RomanFigure: React.FC = () => (
  <svg viewBox="0 0 420 720" width={420} height={720} style={{position: 'absolute', left: 130, top: 180}}>
    {/* Ground shadow */}
    <ellipse cx="210" cy="710" rx="130" ry="20" fill="rgba(0,0,0,0.35)" />
    {/* Toga / body */}
    <path
      d="M125 250 Q82 272 72 435 Q67 515 84 556 Q126 598 210 598 Q294 598 336 556 Q353 515 348 435 Q338 272 295 250 Z"
      fill="url(#toga-grad)"
    />
    {/* Toga drape lines */}
    <path d="M125 250 L85 430 Q90 490 158 510" fill="none" stroke="#DDD8CC" strokeWidth="2.5" opacity="0.7" />
    <path d="M210 300 L180 430 L202 510" fill="none" stroke="#DDD8CC" strokeWidth="2.5" opacity="0.6" />
    <path d="M295 250 L335 430 Q328 490 262 510" fill="none" stroke="#DDD8CC" strokeWidth="2.5" opacity="0.7" />
    {/* Belt */}
    <rect x="112" y="352" width="196" height="20" rx="10" fill="#C4A017" opacity="0.9" />
    <ellipse cx="210" cy="362" rx="14" ry="10" fill="#FFE566" opacity="0.8" />
    {/* Raised right arm */}
    <path
      d="M288 278 Q322 228 356 185 Q378 158 390 168 Q406 180 394 202 Q372 224 344 248 Q312 278 296 318 Z"
      fill="url(#skin-a)"
    />
    {/* Left arm at side */}
    <path d="M125 290 Q93 342 88 395 Q85 415 98 424 Q110 430 120 413 Q132 360 136 308 Z" fill="url(#skin-a)" />
    {/* Right hand */}
    <ellipse cx="390" cy="167" rx="24" ry="30" fill="url(#skin-a)" />
    {/* Fingers stiff with rings */}
    <rect x="374" y="130" width="11" height="38" rx="5" fill="url(#skin-a)" />
    <rect x="388" y="122" width="11" height="42" rx="5" fill="url(#skin-a)" />
    <rect x="401" y="126" width="11" height="38" rx="5" fill="url(#skin-a)" />
    <rect x="412" y="136" width="10" height="30" rx="4" fill="url(#skin-a)" />
    {/* Head */}
    <circle cx="210" cy="164" r="74" fill="url(#skin-a)" />
    {/* Face */}
    <ellipse cx="193" cy="158" rx="8" ry="9" fill="#5C3A1E" />
    <ellipse cx="227" cy="158" rx="8" ry="9" fill="#5C3A1E" />
    <path d="M193 190 Q210 202 227 190" fill="none" stroke="#8B4513" strokeWidth="3.5" strokeLinecap="round" />
    {/* Laurel crown */}
    <path d="M138 128 Q160 102 210 97 Q260 102 282 128" fill="none" stroke="#3D6B3D" strokeWidth="9" strokeLinecap="round" />
    {[145, 165, 195, 210, 225, 255, 275].map((cx, i) => {
      const cy = [122, 110, 100, 97, 100, 110, 122][i];
      return <ellipse key={i} cx={cx} cy={cy} rx="11" ry="8" fill="#4A7C59" />;
    })}
    {/* Chest plate */}
    <path d="M148 262 Q210 252 272 262 L282 304 Q210 292 138 304 Z" fill="#C4A060" opacity="0.7" />
    {/* Sandal straps */}
    <path d="M132 570 Q100 582 90 598 L122 604 Q148 586 158 570 Z" fill="#C4A060" />
    <path d="M288 570 Q320 582 330 598 L298 604 Q272 586 262 570 Z" fill="#C4A060" />
    <defs>
      <linearGradient id="toga-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5F0E8" />
        <stop offset="60%" stopColor="#EAE4D5" />
        <stop offset="100%" stopColor="#D8D0C0" />
      </linearGradient>
      <linearGradient id="skin-a" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#D4956A" />
        <stop offset="100%" stopColor="#B8744A" />
      </linearGradient>
    </defs>
  </svg>
);

export const AncientScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const kb = useKenBurns({durationFrames: 90, fromScale: 1.12, toScale: 1.0, fromX: -15, toX: 0});
  const punch = useZoomPunch(PUNCH_FRAMES);

  const sceneIn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});

  const ringZoom = interpolate(frame, [30, 45], [1, 1.28], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ringOX = interpolate(frame, [30, 45], [500, 380], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ringOY = interpolate(frame, [30, 45], [300, 220], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const wobble = frame > 43 ? Math.sin((frame - 43) * 0.18) * 3.5 : 0;

  const ringColors = ['#D4A017', '#C0A060', '#D4A017', '#8B6914', '#D4A017', '#C0A060', '#D4A017', '#8B6914'];
  const gemColors: (string | undefined)[] = [undefined, '#E040FB', undefined, '#2196F3', undefined, '#4CAF50', undefined, '#FF5722'];

  return (
    <>
      {/* ── BACKGROUND + CONTENT ── */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, #7A5500 0%, #B8860B 20%, #D4B07A 55%, #C4955A 100%)',
          filter: 'brightness(0.88) contrast(1.28) saturate(0.62) sepia(0.42)',
          opacity: sceneIn,
        }}
      >
        {/* Falling coins */}
        <FallingCoins />

        {/* Bokeh — warm golden dust motes */}
        <Bokeh color="255,210,80" maxOpacity={0.1} />

        {/* Sepia tint layer */}
        <div style={{position: 'absolute', inset: 0, background: 'rgba(180,110,0,0.14)', mixBlendMode: 'multiply', pointerEvents: 'none'}} />

        {/* Stone pillars */}
        <div style={{position: 'absolute', left: 30, top: 80, width: 82, bottom: 0, background: 'linear-gradient(90deg,#A07820,#D4B07A,#A07820)', borderRadius: '10px 10px 0 0', opacity: 0.45}} />
        <div style={{position: 'absolute', right: 30, top: 80, width: 82, bottom: 0, background: 'linear-gradient(90deg,#A07820,#D4B07A,#A07820)', borderRadius: '10px 10px 0 0', opacity: 0.45}} />

        {/* KEN BURNS + PUNCH wrapper */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: `scale(${kb.scale * punch}) translateX(${kb.x}px)`,
          transformOrigin: 'center center',
        }}>
          <div style={{transform: `rotate(${wobble}deg)`, transformOrigin: '540px 900px'}}>
            <RomanFigure />
          </div>

          {/* Rings on raised hand */}
          <div style={{transform: `scale(${ringZoom})`, transformOrigin: `${ringOX}px ${ringOY}px`}}>
            {RING_APPEAR_FRAMES.map((startF, i) => {
              if (frame < startF) return null;
              const sc = spring({frame: frame - startF, fps, config: {damping: 8, stiffness: 230}});
              const col = i % 4;
              const row = Math.floor(i / 4);
              const rx = 358 + col * 12 + 540 - 200;
              const ry = 102 + row * 22 + (i % 7) * 9 + 200;
              return (
                <div key={i} style={{transform: `scale(${sc})`, transformOrigin: `${rx}px ${ry}px`}}>
                  <Ring x={rx} y={ry} rx={22} ry={9} color={ringColors[i]} gemColor={gemColors[i]} />
                </div>
              );
            })}
          </div>

          <Particles startFrame={9} cx={520} cy={310} count={14} radius={110} />
        </div>
      </AbsoluteFill>

      {/* ── POST-PROCESS ── */}
      <Vignette intensity={0.72} color="40,20,0" />
      <GrainOverlay opacity={0.055} />

      {/* ── HUD / UI ── */}
      <SfxPop text="CLANK! 🔔" x={90} y={490} startFrame={9} color="#FFE566" size={88} rotation={-14} />
      <SfxPop text="งอไม่ได้! 😤" x={195} y={390} startFrame={44} color="#FF5722" size={72} />

      <div style={{
        position: 'absolute', top: 80, left: 0, right: 0, display: 'flex', justifyContent: 'center',
        opacity: sceneIn, zIndex: 100,
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(212,160,23,0.85)',
          borderRadius: 40, padding: '10px 38px', fontSize: 36, fontWeight: 800,
          color: '#FFE566', letterSpacing: 3,
          textShadow: '0 0 15px rgba(212,160,23,0.4)',
        }}>
          🏛️ อียิปต์ · โรมัน · 3,000 ปีก่อน
        </div>
      </div>

      <WordCaption words={line1Words} endFrame={28} y={1440} />
      <WordCaption words={line2Words} endFrame={89} y={1440} />
    </>
  );
};

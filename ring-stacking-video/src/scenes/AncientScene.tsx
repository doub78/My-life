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

// SCENE: Ancient Rome / Egypt — rings as status symbols
// Style: warm sepia Kurzgesagt flat design + bold outlines

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

// Flat Kurzgesagt-style coins — bold, graphic
const FlatCoins: React.FC = () => {
  const frame = useCurrentFrame();
  const coins = Array.from({length: 12}, (_, i) => ({
    x: ((i * 113 + 55) % 960) + 60,
    delay: i * 5,
    speed: 0.7 + (i % 4) * 0.25,
    size: 22 + (i % 4) * 8,
  }));
  return (
    <>
      {coins.map((c, i) => {
        const t = ((frame - c.delay) * c.speed) % 2000;
        if (t < 0) return null;
        const y = (t - 80) % 2100;
        const rotate = t * 2;
        const opacity = Math.min(1, t / 50) * Math.max(0, 1 - Math.max(0, y - 1850) / 180);
        return (
          <div key={i} style={{
            position: 'absolute', left: c.x, top: y,
            width: c.size * 1.6, height: c.size,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFF176 0%, #D4A017 55%, #7A5500 100%)',
            border: '2px solid #5C3A00',
            opacity: opacity * 0.55,
            transform: `rotate(${rotate}deg)`,
          }} />
        );
      })}
    </>
  );
};

// Flat Kurzgesagt Roman figure with bold outlines
const FlatRomanFigure: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const bodyIn = spring({frame, fps, config: {damping: 14, stiffness: 100}});
  return (
    <svg
      viewBox="0 0 420 720"
      width={420} height={720}
      style={{position: 'absolute', left: 130, top: 180, transform: `scale(${bodyIn})`, transformOrigin: '210px 360px'}}
    >
      <ellipse cx="210" cy="710" rx="130" ry="18" fill="rgba(0,0,0,0.3)" />
      {/* Toga body — flat with bold stroke */}
      <path
        d="M125 250 Q82 272 72 435 Q67 515 84 556 Q126 598 210 598 Q294 598 336 556 Q353 515 348 435 Q338 272 295 250 Z"
        fill="#F5EED8"
        stroke="#4A2800"
        strokeWidth="3.5"
      />
      {/* Toga drape — thick flat lines */}
      <path d="M125 250 L85 430 Q90 490 158 510" fill="none" stroke="#C8BEA0" strokeWidth="4" strokeLinecap="round" />
      <path d="M295 250 L335 430 Q328 490 262 510" fill="none" stroke="#C8BEA0" strokeWidth="4" strokeLinecap="round" />
      {/* Belt — gold flat bar */}
      <rect x="112" y="352" width="196" height="22" rx="11" fill="#D4A017" stroke="#7A5500" strokeWidth="2.5" />
      <ellipse cx="210" cy="363" rx="14" ry="10" fill="#FFE566" />
      {/* Raised right arm */}
      <path
        d="M288 278 Q322 228 356 185 Q378 158 390 168 Q406 180 394 202 Q372 224 344 248 Q312 278 296 318 Z"
        fill="#E8A06A"
        stroke="#7A4020"
        strokeWidth="3"
      />
      {/* Left arm */}
      <path d="M125 290 Q93 342 88 395 Q85 415 98 424 Q110 430 120 413 Q132 360 136 308 Z"
        fill="#E8A06A" stroke="#7A4020" strokeWidth="3" />
      {/* Right hand */}
      <ellipse cx="390" cy="167" rx="24" ry="30" fill="#E8A06A" stroke="#7A4020" strokeWidth="3" />
      {/* Fingers */}
      <rect x="374" y="130" width="12" height="38" rx="6" fill="#E8A06A" stroke="#7A4020" strokeWidth="2.5" />
      <rect x="388" y="122" width="12" height="42" rx="6" fill="#E8A06A" stroke="#7A4020" strokeWidth="2.5" />
      <rect x="401" y="126" width="12" height="38" rx="6" fill="#E8A06A" stroke="#7A4020" strokeWidth="2.5" />
      <rect x="412" y="136" width="11" height="30" rx="5" fill="#E8A06A" stroke="#7A4020" strokeWidth="2.5" />
      {/* Head */}
      <circle cx="210" cy="164" r="74" fill="#E8A06A" stroke="#7A4020" strokeWidth="3.5" />
      {/* Eyes — flat bold dots */}
      <circle cx="190" cy="158" r="9" fill="#2A1200" />
      <circle cx="228" cy="158" r="9" fill="#2A1200" />
      <circle cx="193" cy="155" r="3" fill="#fff" opacity="0.7" />
      <circle cx="231" cy="155" r="3" fill="#fff" opacity="0.7" />
      {/* Smile */}
      <path d="M192 190 Q210 203 228 190" fill="none" stroke="#7A4020" strokeWidth="3.5" strokeLinecap="round" />
      {/* Laurel crown — flat bold */}
      <path d="M138 128 Q160 102 210 97 Q260 102 282 128" fill="none" stroke="#2D5A2D" strokeWidth="9" strokeLinecap="round" />
      {[145, 165, 195, 210, 225, 255, 275].map((cx, i) => {
        const cy = [122, 110, 100, 97, 100, 110, 122][i];
        return <ellipse key={i} cx={cx} cy={cy} rx="12" ry="9" fill="#4A7C59" stroke="#2D5A2D" strokeWidth="2" />;
      })}
      {/* Chest plate */}
      <path d="M148 262 Q210 252 272 262 L282 304 Q210 292 138 304 Z" fill="#C4A060" stroke="#7A5500" strokeWidth="2" opacity="0.85" />
      {/* Sandal straps */}
      <path d="M132 570 Q100 582 90 598 L122 604 Q148 586 158 570 Z" fill="#C4A060" stroke="#7A5500" strokeWidth="2" />
      <path d="M288 570 Q320 582 330 598 L298 604 Q272 586 262 570 Z" fill="#C4A060" stroke="#7A5500" strokeWidth="2" />
    </svg>
  );
};

// Background diagonal accent — Kurzgesagt
const DiagonalAccents: React.FC = () => (
  <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05}}>
    {Array.from({length: 6}).map((_, i) => (
      <line key={i}
        x1={i * 200} y1={0} x2={i * 200 + 300} y2={1920}
        stroke="#D4A017" strokeWidth="1.5"
      />
    ))}
  </svg>
);

export const AncientScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const kb = useKenBurns({durationFrames: 90, fromScale: 1.12, toScale: 1.0, fromX: -15, toX: 0});
  const punch = useZoomPunch(PUNCH_FRAMES);

  const sceneIn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});

  const ringZoom = interpolate(frame, [30, 45], [1, 1.28], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ringOX = interpolate(frame, [30, 45], [500, 380], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ringOY = interpolate(frame, [30, 45], [300, 220], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wobble = frame > 43 ? Math.sin((frame - 43) * 0.18) * 3.5 : 0;

  const ringColors = ['#D4A017', '#C0A060', '#D4A017', '#8B6914', '#D4A017', '#C0A060', '#D4A017', '#8B6914'];
  const gemColors: (string | undefined)[] = [undefined, '#E040FB', undefined, '#2196F3', undefined, '#4CAF50', undefined, '#FF5722'];

  // Pulsing golden ambient glow
  const glow = Math.sin(frame * 0.12) * 0.3 + 0.7;

  return (
    <>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, #6B4400 0%, #A87000 22%, #C8A060 55%, #B88040 100%)',
          filter: 'brightness(0.86) contrast(1.25) saturate(0.65) sepia(0.38)',
          opacity: sceneIn,
        }}
      >
        <FlatCoins />
        <DiagonalAccents />
        <Bokeh color="255,210,80" maxOpacity={0.1} />

        {/* Warm sepia tint */}
        <div style={{position: 'absolute', inset: 0, background: 'rgba(160,90,0,0.12)', mixBlendMode: 'multiply', pointerEvents: 'none'}} />

        {/* Ambient ring glow */}
        <div style={{
          position: 'absolute', left: 320, top: 300, width: 440, height: 360,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(212,160,23,${0.16 * glow}) 0%, transparent 70%)`,
        }} />

        {/* Stone columns — flat bold */}
        <div style={{position: 'absolute', left: 22, top: 100, width: 76, bottom: 0, background: 'linear-gradient(90deg,#8A6010,#C8A060,#8A6010)', borderRadius: '8px 8px 0 0', border: '3px solid #5C3A00', opacity: 0.5}} />
        <div style={{position: 'absolute', right: 22, top: 100, width: 76, bottom: 0, background: 'linear-gradient(90deg,#8A6010,#C8A060,#8A6010)', borderRadius: '8px 8px 0 0', border: '3px solid #5C3A00', opacity: 0.5}} />
        {/* Column caps */}
        <div style={{position: 'absolute', left: 14, top: 90, width: 92, height: 20, background: '#D4A017', borderRadius: 4, border: '2px solid #5C3A00', opacity: 0.5}} />
        <div style={{position: 'absolute', right: 14, top: 90, width: 92, height: 20, background: '#D4A017', borderRadius: 4, border: '2px solid #5C3A00', opacity: 0.5}} />

        {/* KEN BURNS + PUNCH */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: `scale(${kb.scale * punch}) translateX(${kb.x}px)`,
          transformOrigin: 'center center',
        }}>
          <div style={{transform: `rotate(${wobble}deg)`, transformOrigin: '540px 900px'}}>
            <FlatRomanFigure frame={frame} fps={fps} />
          </div>

          {/* Rings on raised hand — Kurzgesagt damping:200 springs */}
          <div style={{transform: `scale(${ringZoom})`, transformOrigin: `${ringOX}px ${ringOY}px`}}>
            {RING_APPEAR_FRAMES.map((startF, i) => {
              if (frame < startF) return null;
              const sc = spring({frame: frame - startF, fps, config: {damping: 200, stiffness: 26}});
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
          {frame >= 17 && <Particles startFrame={17} cx={550} cy={290} count={10} radius={90} color="#FFE566" />}
        </div>
      </AbsoluteFill>

      <Vignette intensity={0.72} color="40,20,0" />
      <GrainOverlay opacity={0.055} />

      {/* Glass badge — Kurzgesagt style */}
      <div style={{
        position: 'absolute', top: 108, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: sceneIn, zIndex: 100,
      }}>
        <GlassBadge startFrame={0} accentColor="#D4A017" size="md">
          🏛️ อียิปต์ · โรมัน · 3,000 ปีก่อน
        </GlassBadge>
      </div>

      <SfxPop text="CLANK! 🔔" x={90} y={490} startFrame={9} color="#FFE566" size={88} rotation={-14} />
      <SfxPop text="งอไม่ได้! 😤" x={195} y={390} startFrame={44} color="#FF5722" size={72} />

      <WordCaption words={line1Words} endFrame={28} y={1440} />
      <WordCaption words={line2Words} endFrame={89} y={1440} />

      {/* Era timeline — always era 0 (Ancient) */}
      <EraTimeline startFrame={5} activeEra={0} bottom={180} />
    </>
  );
};

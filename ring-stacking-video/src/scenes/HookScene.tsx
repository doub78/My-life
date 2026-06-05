import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bokeh} from '../components/Bokeh';
import {CountUp} from '../components/CountUp';
import {GlassBadge} from '../components/GlassBadge';
import {GrainOverlay} from '../components/GrainOverlay';
import {Particles} from '../components/Particles';
import {Ring} from '../components/Ring';
import {SfxPop} from '../components/SfxPop';
import {Vignette} from '../components/Vignette';
import {WordCaption, CaptionWord} from '../components/WordCaption';
import {useKenBurns} from '../hooks/useKenBurns';
import {useZoomPunch} from '../hooks/useZoomPunch';

// HOOK: Modern TikTok ring-stacking → history reveal
// Style: premium dark + gold (TikTok aesthetic) + Kurzgesagt draw-on elements

const line1Words: CaptionWord[] = [
  {text: 'คุณคิดว่า', startFrame: 3},
  {text: 'การใส่แหวน', startFrame: 8},
  {text: 'หลายๆ วง', startFrame: 13},
  {text: 'บนนิ้วเดียว', startFrame: 18},
  {text: 'หรือ', startFrame: 23},
  {text: 'Ring Stacking', startFrame: 26, highlight: true},
  {text: 'เป็นแค่เทรนด์?', startFrame: 32},
];

const line2Words: CaptionWord[] = [
  {text: 'แต่จริงๆ แล้ว...', startFrame: 58},
  {text: 'มันเริ่มจาก', startFrame: 63},
  {text: "'ความขี้อวด'", startFrame: 67, highlight: true},
  {text: 'เมื่อหลายพันปีก่อน!', startFrame: 72, highlight: true},
];

const PUNCH_FRAMES = [26, 67, 72];

// Hand drawn with SVG — cleaner Kurzgesagt flat design
const FlatHand: React.FC<{opacity: number; frame: number; fps: number}> = ({opacity, frame, fps}) => {
  // Each finger draws on staggered
  const fingerScales = [0, 6, 12, 18, 24].map((delay) =>
    spring({frame: frame - delay, fps, config: {damping: 10, stiffness: 200}})
  );

  return (
    <svg
      viewBox="0 0 280 460"
      width={280} height={460}
      style={{position: 'absolute', left: 400, top: 700, opacity}}
    >
      {/* Drop shadow */}
      <ellipse cx="150" cy="450" rx="90" ry="16" fill="rgba(0,0,0,0.4)" />

      {/* Palm — flat coral skin tone */}
      <path
        d="M55 270 Q45 195 50 155 Q53 135 70 133 Q87 131 90 150 L93 230 L100 155 Q103 131 121 129 Q139 127 141 150 L143 230 L145 150 Q147 127 165 125 Q183 123 185 147 L185 230 L189 160 Q191 145 206 147 Q222 149 221 167 L216 270 Q225 315 215 355 Q205 393 165 412 Q135 424 105 412 Q65 397 55 355 Z"
        fill="#F4A57B"
        style={{transform: `scaleY(${fingerScales[0]})`, transformOrigin: '135px 400px'}}
      />

      {/* Finger highlights — flat design */}
      {[
        {cx: 83, cy: 143, delay: 0},
        {cx: 121, cy: 140, delay: 6},
        {cx: 163, cy: 136, delay: 12},
        {cx: 202, cy: 155, delay: 18},
      ].map((f, i) => (
        <ellipse
          key={i} cx={f.cx} cy={f.cy} rx="9" ry="7"
          fill="#E8915A"
          opacity={fingerScales[i + 1]}
        />
      ))}

      {/* Thumb */}
      <path
        d="M55 270 Q35 260 25 242 Q14 218 24 200 Q34 184 50 188 L55 270Z"
        fill="#F4A57B"
      />

      {/* Bold outline — Kurzgesagt style */}
      <path
        d="M55 270 Q45 195 50 155 Q53 135 70 133 Q87 131 90 150 L93 230 L100 155 Q103 131 121 129 Q139 127 141 150 L143 230 L145 150 Q147 127 165 125 Q183 123 185 147 L185 230 L189 160 Q191 145 206 147 Q222 149 221 167 L216 270 Q225 315 215 355 Q205 393 165 412 Q135 424 105 412 Q65 397 55 355 Z"
        fill="none" stroke="#1a0a00" strokeWidth="3.5"
      />

      {/* Nail polish — bold red */}
      {[
        {cx: 83, cy: 143, rx: 8, ry: 5.5},
        {cx: 121, cy: 140, rx: 8, ry: 5.5},
        {cx: 163, cy: 136, rx: 8, ry: 5.5},
        {cx: 202, cy: 155, rx: 7, ry: 4.5},
      ].map((n, i) => (
        <ellipse key={i} cx={n.cx} cy={n.cy} rx={n.rx} ry={n.ry}
          fill="#E53935" opacity={fingerScales[i + 1]}
        />
      ))}
    </svg>
  );
};

// Gold bar in Kurzgesagt flat style
const FlatGoldBar: React.FC<{x: number; y: number; scale: number; rotation: number}> = ({x, y, scale, rotation}) => (
  <div style={{
    position: 'absolute', left: x, top: y,
    transform: `scale(${scale}) rotate(${rotation}deg)`,
    transformOrigin: 'center',
    width: 140, height: 62,
    background: 'linear-gradient(135deg, #FFF176 0%, #FFC107 40%, #FF8F00 100%)',
    borderRadius: 8,
    border: '3px solid #E65100',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, fontWeight: 900, color: '#4E2800', letterSpacing: 2,
    fontFamily: 'serif',
    textShadow: '0 1px 0 rgba(255,255,255,0.4)',
  }}>
    AURUM
  </div>
);

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const kb = useKenBurns({durationFrames: 90, fromScale: 1.0, toScale: 1.14, fromX: 0, toX: 20});
  const punch = useZoomPunch(PUNCH_FRAMES);

  // Rings — spring entrance staggered (Kurzgesagt pattern: 8-12 frame delay)
  const ringScales = [6, 16, 26, 36].map((d) =>
    spring({frame: frame - d, fps, config: {damping: 200, stiffness: 26}})
  );

  const flashOpacity = interpolate(frame, [52, 56, 59, 66], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ringsOpacity = interpolate(frame, [59, 70], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const barScales = [69, 74, 79].map((d) =>
    spring({frame: frame - d, fps, config: {damping: 200, stiffness: 22}})
  );

  const handIn = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});

  // Pulsing glow ring
  const glow = Math.sin(frame * 0.14) * 0.4 + 0.6;

  // "Ring Stacking" label slides in
  const labelIn = interpolate(frame, [2, 12], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 40% 30%, #1e1240 0%, #070510 100%)',
          filter: 'brightness(1.0) contrast(1.18) saturate(1.22)',
        }}
      >
        <Bokeh color="255,200,50" maxOpacity={0.1} />

        {/* Diagonal accent lines — Kurzgesagt graphic element */}
        <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06}}>
          {Array.from({length: 8}).map((_, i) => (
            <line key={i}
              x1={i * 140} y1={0} x2={i * 140 + 200} y2={1920}
              stroke="#FFE566" strokeWidth="1"
            />
          ))}
        </svg>

        {/* KEN BURNS + PUNCH */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: `scale(${kb.scale * punch}) translateX(${kb.x}px)`,
          transformOrigin: 'center',
        }}>
          {/* Ambient ring glow */}
          <div style={{
            position: 'absolute', left: 330, top: 700, width: 420, height: 320,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(212,160,23,${0.18 * glow}) 0%, transparent 70%)`,
          }} />

          <FlatHand opacity={ringsOpacity * handIn} frame={frame} fps={fps} />

          {/* Rings — flat Kurzgesagt-style with bold outlines */}
          {[
            {d: 6, x: 483, y: 812, rx: 54, ry: 20, color: '#D4A017', gem: undefined},
            {d: 16, x: 543, y: 793, rx: 52, ry: 19, color: '#AB47BC', gem: '#E040FB'},
            {d: 26, x: 601, y: 802, rx: 50, ry: 18, color: '#D4A017', gem: undefined},
            {d: 36, x: 483, y: 853, rx: 52, ry: 19, color: '#26C6DA', gem: '#00BCD4'},
          ].map((r, i) => (
            frame >= r.d && (
              <div key={i} style={{
                opacity: ringsOpacity,
                transform: `scale(${ringScales[i]})`,
                transformOrigin: `${r.x}px ${r.y}px`,
              }}>
                <Ring x={r.x} y={r.y} rx={r.rx} ry={r.ry} color={r.color} gemColor={r.gem} />
              </div>
            )
          ))}

          {/* Particles */}
          {frame >= 6 && <Particles startFrame={6} cx={483} cy={812} count={12} radius={90} />}
          {frame >= 16 && <Particles startFrame={16} cx={543} cy={793} count={12} radius={90} color="#E040FB" />}
          {frame >= 26 && <Particles startFrame={26} cx={601} cy={802} count={10} radius={80} />}
          {frame >= 36 && <Particles startFrame={36} cx={483} cy={853} count={10} radius={80} color="#00BCD4" />}

          {/* Gold bars after flash */}
          {frame >= 69 && <FlatGoldBar x={398} y={824} scale={barScales[0]} rotation={-5} />}
          {frame >= 74 && <FlatGoldBar x={498} y={804} scale={barScales[1]} rotation={2} />}
          {frame >= 79 && <FlatGoldBar x={578} y={836} scale={barScales[2]} rotation={-3} />}

          {frame >= 69 && <Particles startFrame={69} cx={530} cy={825} count={18} radius={160} color="#FFE566" />}

          {/* Count-up: how many years of history */}
          {frame >= 70 && (
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 1150,
              display: 'flex', justifyContent: 'center',
            }}>
              <CountUp
                from={0} to={3000}
                startFrame={70} durationFrames={18}
                suffix=" ปีแห่งประวัติศาสตร์"
                style={{
                  fontSize: 52, fontWeight: 900, color: '#FFE566',
                  textShadow: '0 0 30px rgba(255,229,102,0.6), 3px 3px 0 #000',
                }}
              />
            </div>
          )}
        </div>

        {/* Flash */}
        <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flashOpacity, pointerEvents: 'none'}} />
      </AbsoluteFill>

      <Vignette intensity={0.68} />
      <GrainOverlay opacity={0.036} />

      {/* Glass badge — Kurzgesagt style label */}
      <div style={{
        position: 'absolute', top: 108, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: labelIn, zIndex: 100,
      }}>
        <GlassBadge startFrame={0} accentColor="#FFE566" size="md">
          💍 Ring Stacking
        </GlassBadge>
      </div>

      <SfxPop text="เอี๊ยด! 🛑" x={265} y={668} startFrame={53} color="#FF5722" size={84} />
      <WordCaption words={line1Words} endFrame={53} />
      <WordCaption words={line2Words} endFrame={89} />
    </>
  );
};

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

// SCENE: Outro — modern hand + phone, TikTok generation = descendants of ancient flex
// COLOR GRADE: Clean modern cool-to-warm gradient
// KEN BURNS: Gentle pull back reveal (from tight to wider)

const PUNCH_FRAMES = [8, 30, 33, 36, 43];

const line1Words: CaptionWord[] = [
  {text: 'ดังนั้น', startFrame: 2},
  {text: 'ครั้งต่อไป', startFrame: 5},
  {text: 'ที่แมตช์แหวน', startFrame: 8, highlight: true},
  {text: 'หลายวง', startFrame: 12},
  {text: 'เข้าด้วยกัน...', startFrame: 16},
];

const line2Words: CaptionWord[] = [
  {text: 'จำไว้เลยว่า', startFrame: 24},
  {text: 'คุณกำลัง', startFrame: 27},
  {text: 'สืบทอด', startFrame: 30, highlight: true},
  {text: 'จิตวิญญาณ', startFrame: 33, highlight: true},
  {text: "'ความตัวมัม'", startFrame: 36, highlight: true},
  {text: 'ของเศรษฐี', startFrame: 39},
  {text: 'เมื่อพันปีที่แล้ว!', startFrame: 43, highlight: true},
];

// Animated Instagram-style social media UI
const SocialUI: React.FC<{scale: number; frame: number}> = ({scale, frame}) => {
  const likes = Math.round(interpolate(frame, [5, 60], [0, 12400], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));
  const heartBeat = Math.sin(frame * 0.18) * 0.08 + 1;
  return (
    <svg
      viewBox="0 0 230 410" width={230} height={410}
      style={{
        position: 'absolute', right: 72, top: 590,
        transform: `scale(${scale})`, transformOrigin: 'top right',
        filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.6))',
      }}
    >
      {/* Phone body */}
      <rect x="4" y="4" width="222" height="402" rx="32" fill="#1C1C2E" />
      <rect x="9" y="9" width="212" height="392" rx="28" fill="#0F0F1A" />
      {/* Screen */}
      <rect x="16" y="16" width="198" height="378" rx="24" fill="url(#phone-grad)" />
      {/* Notch */}
      <rect x="82" y="16" width="66" height="22" rx="11" fill="#0F0F1A" />
      {/* Status icons */}
      <rect x="28" y="26" width="55" height="7" rx="3" fill="#333" />
      <rect x="176" y="26" width="28" height="7" rx="3" fill="#333" />
      {/* User avatar + name */}
      <circle cx="38" cy="58" r="14" fill="url(#avatar-grad)" />
      <rect x="57" y="50" width="80" height="9" rx="4" fill="#555" />
      <rect x="57" y="64" width="55" height="7" rx="3" fill="#3A3A4A" />
      {/* Main image area */}
      <rect x="16" y="84" width="198" height="198" fill="url(#img-grad)" />
      {/* Ring emoji on image */}
      <text x="115" y="200" textAnchor="middle" fontSize="64" fill="#FFE566">💍</text>
      <text x="115" y="262" textAnchor="middle" fontSize="22" fill="rgba(255,255,255,0.5)">✨ Ring Stacking ✨</text>
      {/* Like count */}
      <text
        x="30" y="314" fontSize="22" fill="#fff"
        style={{transform: `scale(${heartBeat})`, transformOrigin: '30px 314px'}}
      >
        ❤️
      </text>
      <text x="56" y="314" fontSize="18" fontWeight="bold" fill="#fff">
        {likes.toLocaleString()}
      </text>
      {/* Comment */}
      <text x="30" y="338" fontSize="17" fill="#fff">💬 234</text>
      {/* Caption text */}
      <text x="30" y="362" fontSize="13" fill="#999">Ring Stacking is everything ✨</text>
      <text x="30" y="378" fontSize="12" fill="#666">#ringstack #jewelry #fashion</text>
      {/* Home bar */}
      <rect x="84" y="384" width="62" height="6" rx="3" fill="#3A3A4A" />
      <defs>
        <linearGradient id="phone-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A1A2E" />
          <stop offset="100%" stopColor="#16213E" />
        </linearGradient>
        <linearGradient id="img-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A3060" />
          <stop offset="100%" stopColor="#0A1530" />
        </linearGradient>
        <radialGradient id="avatar-grad">
          <stop offset="0%" stopColor="#FFE566" />
          <stop offset="100%" stopColor="#D4A017" />
        </radialGradient>
      </defs>
    </svg>
  );
};

const ModernHand: React.FC = () => (
  <svg viewBox="0 0 200 360" width={200} height={360} style={{position: 'absolute', left: 55, top: 695}}>
    {/* Shadow */}
    <ellipse cx="100" cy="352" rx="70" ry="12" fill="rgba(0,0,0,0.3)" />
    {/* Palm */}
    <path
      d="M40 200 Q35 150 38 120 Q40 105 52 103 Q64 101 66 115 L67 175 L70 115 Q72 100 84 98 Q96 96 97 112 L98 175 L100 110 Q102 96 114 94 Q126 92 127 108 L127 175 L131 118 Q133 108 142 110 Q152 112 151 124 L147 200 Q155 230 148 260 Q140 285 115 295 Q95 302 75 295 Q50 285 45 260 Z"
      fill="url(#skin-m)"
    />
    {/* Thumb */}
    <path d="M40 200 Q25 192 18 178 Q10 160 18 147 Q26 136 38 140 L40 200Z" fill="url(#skin-m)" />
    {/* Knuckle lines */}
    <path d="M55 152 Q60 147 66 152" fill="none" stroke="#D4956A" strokeWidth="1.5" opacity="0.5" />
    <path d="M79 147 Q84 142 90 147" fill="none" stroke="#D4956A" strokeWidth="1.5" opacity="0.5" />
    <path d="M103 143 Q108 138 114 143" fill="none" stroke="#D4956A" strokeWidth="1.5" opacity="0.5" />
    <path d="M125 147 Q130 143 136 147" fill="none" stroke="#D4956A" strokeWidth="1.5" opacity="0.5" />
    {/* Nails */}
    <ellipse cx="52" cy="108" rx="7" ry="5" fill="#FDDCC4" opacity="0.8" />
    <ellipse cx="83" cy="103" rx="7" ry="5" fill="#FDDCC4" opacity="0.8" />
    <ellipse cx="113" cy="99" rx="7" ry="5" fill="#FDDCC4" opacity="0.8" />
    <ellipse cx="136" cy="115" rx="6" ry="4.5" fill="#FDDCC4" opacity="0.8" />
    {/* Gel nail polish sheen */}
    <ellipse cx="52" cy="108" rx="5.5" ry="3.5" fill="rgba(220,50,80,0.7)" />
    <ellipse cx="83" cy="103" rx="5.5" ry="3.5" fill="rgba(220,50,80,0.7)" />
    <ellipse cx="113" cy="99" rx="5.5" ry="3.5" fill="rgba(220,50,80,0.7)" />
    <ellipse cx="136" cy="115" rx="5" ry="3" fill="rgba(220,50,80,0.7)" />
    <defs>
      <linearGradient id="skin-m" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F5CBA7" />
        <stop offset="100%" stopColor="#D4956A" />
      </linearGradient>
    </defs>
  </svg>
);

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const kb = useKenBurns({durationFrames: 90, fromScale: 1.1, toScale: 1.0, fromY: -12, toY: 0});
  const punch = useZoomPunch(PUNCH_FRAMES);

  const sceneIn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const sceneOut = interpolate(frame, [81, 90], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(sceneIn, sceneOut);

  const phoneScale = spring({frame, fps, config: {damping: 12, stiffness: 100}});

  const r1 = spring({frame: frame - 5, fps, config: {damping: 8, stiffness: 200}});
  const r2 = spring({frame: frame - 8, fps, config: {damping: 8, stiffness: 200}});
  const r3 = spring({frame: frame - 11, fps, config: {damping: 8, stiffness: 200}});
  const r4 = spring({frame: frame - 14, fps, config: {damping: 8, stiffness: 200}});

  const yearCount = Math.round(interpolate(frame, [18, 45], [0, 3000], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));
  const counterOpacity = interpolate(frame, [17, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subtitleOpacity = interpolate(frame, [24, 32], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const ctaOpacity = interpolate(frame, [68, 76], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ctaScale = spring({frame: frame - 68, fps, config: {damping: 8, stiffness: 150}});

  return (
    <>
      {/* ── BACKGROUND + CONTENT ── */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 45%, #0a1a40 100%)',
          filter: 'brightness(1.08) contrast(1.08) saturate(1.18)',
          opacity,
        }}
      >
        {/* Bokeh — cool blue-white modern */}
        <Bokeh color="120,180,255" maxOpacity={0.08} />

        {/* Modern cool tint */}
        <div style={{position: 'absolute', inset: 0, background: 'rgba(50,100,200,0.06)', mixBlendMode: 'screen', pointerEvents: 'none'}} />

        {/* Bottom warm glow (ring light effect) */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(0deg, rgba(212,160,23,0.1), transparent)',
          pointerEvents: 'none',
        }} />

        {/* KEN BURNS + PUNCH wrapper */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: `scale(${kb.scale * punch}) translateY(${kb.y}px)`,
          transformOrigin: 'center center',
        }}>
          <ModernHand />

          {/* Stacked rings */}
          {frame >= 5 && (
            <div style={{transform: `scale(${r1})`, transformOrigin: '103px 785px'}}>
              <Ring x={103} y={785} rx={38} ry={13} color="#D4A017" gemColor="#E91E63" />
            </div>
          )}
          {frame >= 8 && (
            <div style={{transform: `scale(${r2})`, transformOrigin: '118px 778px'}}>
              <Ring x={118} y={778} rx={38} ry={13} gemColor="#2196F3" />
            </div>
          )}
          {frame >= 11 && (
            <div style={{transform: `scale(${r3})`, transformOrigin: '133px 783px'}}>
              <Ring x={133} y={783} rx={35} ry={12} color="#C0A060" />
            </div>
          )}
          {frame >= 14 && (
            <div style={{transform: `scale(${r4})`, transformOrigin: '103px 820px'}}>
              <Ring x={103} y={820} rx={37} ry={13} gemColor="#4CAF50" />
            </div>
          )}

          {/* Phone */}
          <SocialUI scale={phoneScale} frame={frame} />

          {/* Year counter */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 510,
            display: 'flex', justifyContent: 'center', opacity: counterOpacity,
          }}>
            <div style={{
              fontSize: 114, fontWeight: 900, color: '#FFE566',
              textShadow: '0 0 50px rgba(255,229,102,0.5), 4px 4px 0 #000',
              letterSpacing: '-4px',
            }}>
              {yearCount.toLocaleString()}+
            </div>
          </div>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 635,
            display: 'flex', justifyContent: 'center', opacity: subtitleOpacity,
          }}>
            <div style={{fontSize: 52, fontWeight: 800, color: '#fff', textShadow: '3px 3px 0 #000'}}>
              ปีของประวัติศาสตร์
            </div>
          </div>
        </div>

        {/* Particles */}
        {frame >= 5 && <Particles startFrame={5} cx={110} cy={785} count={12} radius={90} />}
        {frame >= 14 && <Particles startFrame={14} cx={110} cy={820} count={10} radius={75} color="#4CAF50" />}
      </AbsoluteFill>

      {/* ── POST-PROCESS ── */}
      <Vignette intensity={0.6} color="0,10,30" />
      <GrainOverlay opacity={0.032} />

      {/* ── HUD / UI ── */}
      <SfxPop text="👑 ICONIC!" x={335} y={850} startFrame={17} color="#FFE566" size={78} />

      <WordCaption words={line1Words} endFrame={23} y={1430} />
      <WordCaption words={line2Words} endFrame={70} y={1430} />

      {/* Follow CTA */}
      <div style={{
        position: 'absolute', bottom: 112, left: 56, right: 56,
        background: 'linear-gradient(135deg, #C4900F, #FFE566, #C4900F)',
        borderRadius: 64,
        padding: '26px 36px',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        opacity: ctaOpacity,
        transform: `scale(${ctaScale})`,
        boxShadow: '0 10px 45px rgba(212,160,23,0.55)',
        zIndex: 100,
      }}>
        <span style={{fontSize: 46, fontWeight: 900, color: '#000', letterSpacing: '-1px'}}>
          กด Follow เพื่อดูตอนต่อไป! 👑
        </span>
      </div>

      {/* Scene tag */}
      <div style={{
        position: 'absolute', top: 80, left: 0, right: 0, display: 'flex', justifyContent: 'center',
        opacity: sceneIn, zIndex: 100,
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(255,229,102,0.85)',
          borderRadius: 40, padding: '10px 38px', fontSize: 36, fontWeight: 800,
          color: '#FFE566', letterSpacing: 2,
          textShadow: '0 0 12px rgba(255,229,102,0.35)',
        }}>
          📱 ยุคนี้ vs 3,000 ปีก่อน
        </div>
      </div>
    </>
  );
};

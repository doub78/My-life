import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bokeh} from '../components/Bokeh';
import {CountUp} from '../components/CountUp';
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

// SCENE: Outro — modern ring stacking = descendants of ancient flex
// Style: clean modern Kurzgesagt with era comparison bar chart

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

// Kurzgesagt-style era comparison bars
const EraComparisonBars: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const bars = [
    {label: 'อียิปต์/โรมัน', year: '3,000 ปีก่อน', color: '#D4A017', maxRings: 8, delay: 2},
    {label: 'เรเนสซองส์', year: 'ค.ศ. 1400–1600', color: '#9C27B0', maxRings: 5, delay: 6},
    {label: 'ยุคนี้', year: '2025', color: '#2196F3', maxRings: 10, delay: 10},
  ];

  return (
    <div style={{
      position: 'absolute', left: 60, right: 60, top: 520,
      display: 'flex', flexDirection: 'column', gap: 18,
    }}>
      {bars.map((b, i) => {
        const barProgress = interpolate(frame - b.delay, [0, 22], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        const labelOpacity = interpolate(frame - b.delay, [0, 12], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        const dotSc = spring({frame: frame - b.delay, fps, config: {damping: 200, stiffness: 30}});

        return (
          <div key={i} style={{opacity: labelOpacity}}>
            {/* Label row */}
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 6}}>
              <span style={{fontSize: 26, fontWeight: 800, color: b.color}}>
                {b.label}
              </span>
              <span style={{fontSize: 22, fontWeight: 600, color: 'rgba(255,255,255,0.65)'}}>
                {b.year}
              </span>
            </div>
            {/* Bar track */}
            <div style={{position: 'relative', height: 20, background: 'rgba(255,255,255,0.1)', borderRadius: 10}}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${barProgress * (b.maxRings / 10) * 100}%`,
                background: `linear-gradient(90deg, ${b.color}CC, ${b.color})`,
                borderRadius: 10,
                boxShadow: `0 0 14px ${b.color}60`,
              }} />
            </div>
            {/* Ring count dots */}
            <div style={{display: 'flex', gap: 6, marginTop: 6}}>
              {Array.from({length: b.maxRings}).map((_, ri) => {
                const dotOpacity = ri < b.maxRings * barProgress ? 1 : 0.15;
                return (
                  <div key={ri} style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: b.color,
                    opacity: dotOpacity,
                    transform: `scale(${dotSc})`,
                    boxShadow: dotOpacity > 0.5 ? `0 0 8px ${b.color}` : 'none',
                  }} />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Modern phone UI — Kurzgesagt flat style
const ModernPhoneUI: React.FC<{scale: number; frame: number}> = ({scale, frame}) => {
  return (
    <svg
      viewBox="0 0 230 410" width={230} height={410}
      style={{
        position: 'absolute', right: 72, top: 590,
        transform: `scale(${scale})`, transformOrigin: 'top right',
        filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.7))',
      }}
    >
      {/* Phone body — flat bold */}
      <rect x="4" y="4" width="222" height="402" rx="32" fill="#0F0F1A" stroke="#2A2A4A" strokeWidth="3" />
      <rect x="12" y="12" width="206" height="386" rx="26" fill="#1C1C2E" />
      {/* Screen */}
      <rect x="18" y="18" width="194" height="374" rx="22" fill="url(#phone-grad-o)" />
      {/* Dynamic island */}
      <rect x="80" y="18" width="70" height="24" rx="12" fill="#0F0F1A" />
      {/* Ring content */}
      <rect x="18" y="48" width="194" height="194" fill="url(#img-grad-o)" rx="8" />
      <text x="115" y="168" textAnchor="middle" fontSize="72" fill="#FFE566">💍</text>
      <text x="115" y="228" textAnchor="middle" fontSize="18" fill="rgba(255,255,255,0.5)">✨ Ring Stacking ✨</text>
      {/* Interaction bar */}
      <rect x="18" y="250" width="194" height="1" fill="rgba(255,255,255,0.1)" />
      {/* Likes */}
      <text x="28" y="280" fontSize="20" fill="#fff">❤️</text>
      <text x="52" y="280" fontSize="18" fontWeight="bold" fill="#fff">
        {Math.round(interpolate(frame, [5, 60], [0, 12400], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})).toLocaleString()}
      </text>
      <text x="28" y="306" fontSize="17" fill="#fff">💬 234</text>
      {/* Caption */}
      <text x="28" y="334" fontSize="12" fill="#999">Ring Stacking is everything ✨</text>
      <text x="28" y="352" fontSize="11" fill="#666">#ringstack #jewelry #fashion</text>
      {/* Home indicator */}
      <rect x="82" y="376" width="66" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />
      <defs>
        <linearGradient id="phone-grad-o" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A1A2E" />
          <stop offset="100%" stopColor="#16213E" />
        </linearGradient>
        <linearGradient id="img-grad-o" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A3060" />
          <stop offset="100%" stopColor="#0A1530" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Flat modern hand with bold outlines — Kurzgesagt style
const FlatModernHand: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const bodyIn = spring({frame, fps, config: {damping: 14, stiffness: 90}});
  return (
    <svg viewBox="0 0 200 360" width={200} height={360}
      style={{position: 'absolute', left: 55, top: 695, transform: `scale(${bodyIn})`, transformOrigin: '100px 180px'}}
    >
      <ellipse cx="100" cy="352" rx="70" ry="12" fill="rgba(0,0,0,0.28)" />
      {/* Palm */}
      <path
        d="M40 200 Q35 150 38 120 Q40 105 52 103 Q64 101 66 115 L67 175 L70 115 Q72 100 84 98 Q96 96 97 112 L98 175 L100 110 Q102 96 114 94 Q126 92 127 108 L127 175 L131 118 Q133 108 142 110 Q152 112 151 124 L147 200 Q155 230 148 260 Q140 285 115 295 Q95 302 75 295 Q50 285 45 260 Z"
        fill="#F5CBA7" stroke="#9A5C35" strokeWidth="3"
      />
      {/* Thumb */}
      <path d="M40 200 Q25 192 18 178 Q10 160 18 147 Q26 136 38 140 L40 200Z"
        fill="#F5CBA7" stroke="#9A5C35" strokeWidth="3" />
      {/* Knuckle lines */}
      <path d="M55 152 Q60 146 66 152" fill="none" stroke="#D4956A" strokeWidth="2" />
      <path d="M79 147 Q84 141 90 147" fill="none" stroke="#D4956A" strokeWidth="2" />
      <path d="M103 143 Q108 137 114 143" fill="none" stroke="#D4956A" strokeWidth="2" />
      <path d="M125 147 Q130 142 136 147" fill="none" stroke="#D4956A" strokeWidth="2" />
      {/* Nails — bold flat red polish */}
      <ellipse cx="52" cy="108" rx="8" ry="5.5" fill="#E53935" stroke="#7A0000" strokeWidth="1.5" />
      <ellipse cx="83" cy="103" rx="8" ry="5.5" fill="#E53935" stroke="#7A0000" strokeWidth="1.5" />
      <ellipse cx="113" cy="99" rx="8" ry="5.5" fill="#E53935" stroke="#7A0000" strokeWidth="1.5" />
      <ellipse cx="136" cy="115" rx="7" ry="5" fill="#E53935" stroke="#7A0000" strokeWidth="1.5" />
    </svg>
  );
};

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const kb = useKenBurns({durationFrames: 90, fromScale: 1.1, toScale: 1.0, fromY: -12, toY: 0});
  const punch = useZoomPunch(PUNCH_FRAMES);

  const sceneIn = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const sceneOut = interpolate(frame, [81, 90], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(sceneIn, sceneOut);

  const phoneScale = spring({frame, fps, config: {damping: 12, stiffness: 100}});

  // Ring springs — Kurzgesagt damping:200
  const r1 = spring({frame: frame - 5, fps, config: {damping: 200, stiffness: 26}});
  const r2 = spring({frame: frame - 8, fps, config: {damping: 200, stiffness: 26}});
  const r3 = spring({frame: frame - 11, fps, config: {damping: 200, stiffness: 26}});
  const r4 = spring({frame: frame - 14, fps, config: {damping: 200, stiffness: 26}});

  const counterOpacity = interpolate(frame, [17, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const ctaOpacity = interpolate(frame, [68, 76], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ctaScale = spring({frame: frame - 68, fps, config: {damping: 8, stiffness: 150}});

  return (
    <>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 45%, #0a1a40 100%)',
          filter: 'brightness(1.08) contrast(1.08) saturate(1.18)',
          opacity,
        }}
      >
        <Bokeh color="120,180,255" maxOpacity={0.08} />

        {/* Modern cool tint */}
        <div style={{position: 'absolute', inset: 0, background: 'rgba(50,100,200,0.06)', mixBlendMode: 'screen', pointerEvents: 'none'}} />

        {/* Ring light warm glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(0deg, rgba(212,160,23,0.1), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Diagonal accent lines */}
        <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04}}>
          {Array.from({length: 6}).map((_, i) => (
            <line key={i} x1={i * 200} y1={0} x2={i * 200 + 260} y2={1920} stroke="#2196F3" strokeWidth="1.5" />
          ))}
        </svg>

        {/* KEN BURNS + PUNCH */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: `scale(${kb.scale * punch}) translateY(${kb.y}px)`,
          transformOrigin: 'center center',
        }}>
          <FlatModernHand frame={frame} fps={fps} />

          {/* Stacked rings — Kurzgesagt springs */}
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

          <ModernPhoneUI scale={phoneScale} frame={frame} />
        </div>

        {/* Era comparison bars — Kurzgesagt data visualization */}
        <EraComparisonBars frame={frame} fps={fps} />

        {/* CountUp — years of history */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 420,
          display: 'flex', justifyContent: 'center', opacity: counterOpacity,
        }}>
          <CountUp
            from={0} to={3000}
            startFrame={18} durationFrames={27}
            suffix="+ ปีแห่งประวัติศาสตร์"
            style={{
              fontSize: 52, fontWeight: 900, color: '#FFE566',
              textShadow: '0 0 30px rgba(255,229,102,0.5), 3px 3px 0 #000',
            }}
          />
        </div>

        {/* Particles */}
        {frame >= 5 && <Particles startFrame={5} cx={110} cy={785} count={12} radius={90} />}
        {frame >= 14 && <Particles startFrame={14} cx={110} cy={820} count={10} radius={75} color="#4CAF50" />}
      </AbsoluteFill>

      <Vignette intensity={0.6} color="0,10,30" />
      <GrainOverlay opacity={0.032} />

      {/* Glass badge — gold accent */}
      <div style={{
        position: 'absolute', top: 108, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: sceneIn, zIndex: 100,
      }}>
        <GlassBadge startFrame={0} accentColor="#FFE566" size="md">
          📱 ยุคนี้ vs 3,000 ปีก่อน
        </GlassBadge>
      </div>

      <SfxPop text="👑 ICONIC!" x={335} y={850} startFrame={17} color="#FFE566" size={78} />

      <WordCaption words={line1Words} endFrame={23} y={1430} />
      <WordCaption words={line2Words} endFrame={70} y={1430} />

      {/* Era timeline — era 2 (Modern) active */}
      <EraTimeline startFrame={5} activeEra={2} bottom={310} />

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
    </>
  );
};

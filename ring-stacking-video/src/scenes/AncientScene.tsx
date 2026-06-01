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

// Scene duration: 90 frames (3 s). All timings scaled from original 600-frame version (×0.15).

const RING_APPEAR_FRAMES = [9, 12, 14, 17, 20, 23, 25, 28];

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

const PILLAR_STYLE: React.CSSProperties = {
  position: 'absolute',
  width: 80,
  top: 100,
  bottom: 0,
  background: 'linear-gradient(90deg,#C4A060,#E8D090,#C4A060)',
  borderRadius: '10px 10px 0 0',
  opacity: 0.4,
};

const RomanCharacterSVG: React.FC = () => (
  <svg
    viewBox="0 0 400 700"
    width={400}
    height={700}
    style={{position: 'absolute', left: 140, top: 200}}
  >
    <path
      d="M120 240 Q80 260 70 420 Q65 500 80 540 Q120 580 200 580 Q280 580 320 540 Q335 500 330 420 Q320 260 280 240 Z"
      fill="#F5F0E8"
    />
    <path d="M120 240 L80 420 Q85 480 150 500" fill="none" stroke="#DDD8CC" strokeWidth="2" />
    <path d="M200 290 L170 420 L190 500" fill="none" stroke="#DDD8CC" strokeWidth="2" />
    <path d="M280 240 L320 420 Q315 480 250 500" fill="none" stroke="#DDD8CC" strokeWidth="2" />
    <rect x="110" y="340" width="180" height="18" rx="9" fill="#C4A017" opacity="0.8" />
    <path
      d="M120 280 Q90 330 85 380 Q82 400 95 410 Q105 415 115 400 Q125 350 130 300 Z"
      fill="#D4956A"
    />
    <path
      d="M280 270 Q310 220 340 180 Q360 155 370 165 Q385 175 375 195 Q355 215 330 240 Q300 275 285 310 Z"
      fill="#D4956A"
    />
    <ellipse cx="372" cy="162" rx="22" ry="28" fill="#D4956A" />
    <rect x="358" y="128" width="10" height="35" rx="5" fill="#D4956A" />
    <rect x="370" y="122" width="10" height="38" rx="5" fill="#D4956A" />
    <rect x="382" y="126" width="10" height="35" rx="5" fill="#D4956A" />
    <rect x="392" y="135" width="9" height="28" rx="4" fill="#D4956A" />
    <circle cx="200" cy="160" r="70" fill="#D4956A" />
    <ellipse cx="185" cy="155" rx="7" ry="8" fill="#8B5E3C" />
    <ellipse cx="215" cy="155" rx="7" ry="8" fill="#8B5E3C" />
    <path d="M185 185 Q200 195 215 185" fill="none" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round" />
    <path d="M135 125 Q155 100 200 95 Q245 100 265 125" fill="none" stroke="#4A7C59" strokeWidth="8" strokeLinecap="round" />
    {[150, 170, 200, 230, 250].map((cx, i) => {
      const cy = [118, 108, 103, 108, 118][i];
      return <ellipse key={i} cx={cx} cy={cy} rx="10" ry="7" fill="#4A7C59" />;
    })}
    <path d="M145 250 Q200 240 255 250 L265 290 Q200 280 135 290 Z" fill="#C4A060" opacity="0.6" />
    <path d="M130 555 Q100 565 90 580 L120 585 Q145 570 155 555 Z" fill="#C4A060" />
    <path d="M270 555 Q300 565 310 580 L280 585 Q255 570 245 555 Z" fill="#C4A060" />
  </svg>
);

export const AncientScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 5], [0, 1], {extrapolateRight: 'clamp'});

  // Zoom into ring area after frame 30
  const ringZoom = interpolate(frame, [30, 42], [1, 1.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringOriginX = interpolate(frame, [30, 42], [500, 380], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringOriginY = interpolate(frame, [30, 42], [300, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const wobble = frame > 42 ? Math.sin((frame - 42) * 0.15) * 4 : 0;

  const ringColors = ['#D4A017', '#C0A060', '#D4A017', '#8B6914', '#D4A017', '#C0A060', '#D4A017', '#8B6914'];
  const gemColors: (string | undefined)[] = [undefined, '#E040FB', undefined, '#2196F3', undefined, '#4CAF50', undefined, '#FF5722'];

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #8B6914 0%, #C4A060 30%, #D4B896 60%, #C8A06E 100%)',
        opacity: sceneIn,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(ellipse 2px 2px at 20% 30%, rgba(255,255,255,0.08) 0%, transparent 100%)',
          backgroundSize: '40px 40px',
        }}
      />

      <div style={{...PILLAR_STYLE, left: 50}} />
      <div style={{...PILLAR_STYLE, right: 50}} />

      <div style={{transform: `rotate(${wobble}deg)`, transformOrigin: '540px 900px'}}>
        <RomanCharacterSVG />
      </div>

      <div
        style={{
          transform: `scale(${ringZoom})`,
          transformOrigin: `${ringOriginX}px ${ringOriginY}px`,
        }}
      >
        {RING_APPEAR_FRAMES.map((startF, i) => {
          if (frame < startF) return null;
          const sc = spring({frame: frame - startF, fps, config: {damping: 8, stiffness: 220}});
          const col = i % 4;
          const row = Math.floor(i / 4);
          const rx = 358 + col * 12 + 540 - 200;
          const ry = 102 + row * 20 + (i % 7) * 8 + 200;
          return (
            <div key={i} style={{transform: `scale(${sc})`, transformOrigin: `${rx}px ${ry}px`}}>
              <Ring x={rx} y={ry} rx={20} ry={8} color={ringColors[i]} gemColor={gemColors[i]} />
            </div>
          );
        })}
      </div>

      <SfxPop text="CLANK!" x={100} y={500} startFrame={9} color="#FFE566" size={90} rotation={-12} />
      <SfxPop text="งอไม่ได้! 😤" x={200} y={400} startFrame={44} color="#FF5722" size={70} />

      <Particles startFrame={9} cx={520} cy={300} count={12} radius={100} />

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
            border: '2px solid #D4A017',
            borderRadius: 40,
            padding: '10px 36px',
            fontSize: 36,
            fontWeight: 800,
            color: '#FFE566',
            letterSpacing: 3,
          }}
        >
          🏛️ อียิปต์ · โรมัน · 3,000 ปีก่อน
        </div>
      </div>

      <WordCaption words={line1Words} endFrame={28} y={1440} />
      <WordCaption words={line2Words} endFrame={89} y={1440} />
    </AbsoluteFill>
  );
};

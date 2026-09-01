import React from 'react';
import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {PageCam} from './components/PageCam';

const C = {
  ink: '#152421',
  inkSoft: '#43534f',
  muted: '#667570',
  porcelain: '#f7f9f6',
  paper: '#ffffff',
  mist: '#edf2ee',
  mistDeep: '#dfe8e2',
  line: '#ced8d2',
  teal: '#1f756b',
  rail: '#0f3b34',
  railDeep: '#092d28',
  coral: '#e95f49',
  coralSoft: '#fff0ec',
  brass: '#b18a50',
  aqua: '#8fd8cf',
};

const fonts = {
  brand: '"STXingkai", "华文行楷", "Xingkai SC", "HanziPen SC", "STKaiti", serif',
  display: '"Songti SC", "STSong", "Noto Serif CJK SC", "Source Han Serif SC", serif',
  body: '"PingFang SC", "Microsoft YaHei UI", "Segoe UI", system-ui, sans-serif',
};

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const prog = (frame: number, from: number, to: number, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [from, to], [0, 1], {...CLAMP, easing});

const Grain: React.FC<{dark?: boolean}> = ({dark = false}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      opacity: dark ? 0.1 : 0.18,
      mixBlendMode: dark ? 'screen' : 'multiply',
      backgroundImage:
        'repeating-linear-gradient(97deg, rgba(255,255,255,.09) 0px, rgba(255,255,255,.09) 1px, transparent 1px, transparent 5px), repeating-linear-gradient(7deg, rgba(12,42,38,.03) 0px, rgba(12,42,38,.03) 1px, transparent 1px, transparent 8px)',
    }}
  />
);

const BrandMark: React.FC<{progress?: number; size?: number; color?: string}> = ({progress = 1, size = 128, color = C.teal}) => {
  const dash = 420;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
      <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="2.2" opacity={0.42} />
      <circle
        cx="50"
        cy="50"
        r="31"
        fill="none"
        stroke={color}
        strokeWidth="2.8"
        strokeDasharray={dash}
        strokeDashoffset={dash * (1 - progress)}
        strokeLinecap="round"
      />
      <path
        d="M26 57 C37 33, 47 38, 57 56 C66 72, 76 66, 83 47"
        fill="none"
        stroke={color}
        strokeWidth="4.1"
        strokeLinecap="round"
        strokeDasharray={dash}
        strokeDashoffset={dash * (1 - progress)}
      />
      <path
        d="M28 68 C40 48, 51 51, 61 67 C69 79, 78 74, 84 62"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={dash}
        strokeDashoffset={dash * (1 - progress)}
      />
      <circle cx="51" cy="35" r="5.3" fill={C.coral} opacity={progress} />
    </svg>
  );
};

const Kicker: React.FC<{children: React.ReactNode; dark?: boolean}> = ({children, dark = false}) => (
  <div
    style={{
      color: dark ? '#9edbd3' : C.teal,
      fontFamily: fonts.body,
      fontSize: 23,
      fontWeight: 700,
      letterSpacing: '0.19em',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

const ProductFrame: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      border: `1px solid ${C.line}`,
      borderRadius: 30,
      background: 'rgba(255,255,255,.9)',
      boxShadow: '0 28px 90px rgba(15,59,52,.16)',
      ...style,
    }}
  >
    {children}
  </div>
);

const BrandOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = prog(frame, 6, 45, Easing.out(Easing.cubic));
  const settle = spring({frame: frame - 8, fps, config: {damping: 18, stiffness: 95, mass: 0.9}});
  const subtitleText = '把沉默时间，变成关系节律';
  const typed = Math.min(subtitleText.length, Math.floor(interpolate(frame, [38, 60], [0, subtitleText.length], CLAMP)));
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 43%, #ffffff 0%, ${C.porcelain} 47%, #e8f0ed 100%)`,
        color: C.ink,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {[0, 1, 2].map((ring) => {
        const ringP = prog(frame, 5 + ring * 7, 78 + ring * 3, Easing.out(Easing.cubic));
        return (
          <div
            key={ring}
            style={{
              position: 'absolute',
              left: 960,
              top: 510,
              width: 370 + ring * 190,
              height: 370 + ring * 190,
              borderRadius: '50%',
              border: `1px solid ${ring === 1 ? 'rgba(177,138,80,.30)' : 'rgba(31,117,107,.20)'}`,
              transform: `translate(-50%,-50%) scale(${0.74 + ringP * 0.26})`,
              opacity: ringP * (0.85 - ring * 0.16),
            }}
          />
        );
      })}
      <div style={{position: 'absolute', top: 166, transform: `scale(${0.88 + settle * 0.12})`}}>
        <BrandMark progress={draw} size={112} />
      </div>
      <div style={{position: 'absolute', top: 360, display: 'flex', fontFamily: fonts.brand, fontSize: 128, letterSpacing: '0.12em', lineHeight: 1}}>
        {'关系回响'.split('').map((char, index) => {
          const charP = prog(frame, 24 + index * 4, 36 + index * 4, Easing.out(Easing.cubic));
          return (
            <span
              key={char}
              style={{
                display: 'inline-block',
                opacity: charP,
                transformOrigin: '50% 100%',
                transform: `scale(${1.6 - charP * 0.6})`,
                filter: `blur(${(1 - charP) * 7}px)`,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 535, width: 210, height: 5, borderRadius: 9, background: C.brass, transform: `scaleX(${prog(frame, 38, 54, Easing.out(Easing.cubic))})`}} />
      <div
        style={{
          position: 'absolute',
          top: 615,
          fontFamily: fonts.display,
          fontSize: 46,
          letterSpacing: '0.08em',
          color: C.inkSoft,
          minWidth: 690,
          textAlign: 'center',
        }}
      >
        {subtitleText.slice(0, typed)}
        <span style={{display: 'inline-block', width: 4, height: 47, marginLeft: 7, verticalAlign: '-8px', background: C.coral, opacity: frame < 64 && frame % 8 < 5 ? 1 : 0}} />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 105,
          fontFamily: fonts.body,
          fontSize: 22,
          color: C.muted,
          letterSpacing: '0.18em',
          opacity: prog(frame, 48, 60),
        }}
      >
        LOCAL FIRST · RELATIONSHIP RHYTHM
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

const radialPolygon = (progress: number) => {
  if (progress <= 0.001) return 'polygon(50% 50%, 50% -22%, 50% -22%)';
  const steps = Math.max(2, Math.ceil(progress * 72));
  const points = ['50% 50%'];
  for (let i = 0; i <= steps; i += 1) {
    const angle = -Math.PI / 2 + Math.PI * 2 * Math.min(progress, i / 72);
    points.push(`${50 + Math.cos(angle) * 72}% ${50 + Math.sin(angle) * 72}%`);
  }
  return `polygon(${points.join(',')})`;
};

const needleSelfTestAngle = (frame: number) => {
  const start = 42;
  const target = 188;
  if (frame <= start) return 0;
  if (frame <= start + 12) {
    return interpolate(frame, [start, start + 12], [0, 270], {easing: Easing.out(Easing.cubic)});
  }
  if (frame <= start + 25) {
    return interpolate(frame, [start + 12, start + 25], [270, target - 8], {easing: Easing.inOut(Easing.cubic)});
  }
  return interpolate(frame, [start + 25, start + 32], [target - 8, target], CLAMP);
};

const RhythmScene: React.FC = () => {
  const frame = useCurrentFrame();
  const wipe = prog(frame, 0, 32, Easing.inOut(Easing.cubic));
  const copy = prog(frame, 70, 88, Easing.out(Easing.cubic));
  const pointerAngle = -90 + wipe * 360;
  const gaugeIn = prog(frame, 24, 42, Easing.out(Easing.cubic));
  const needleAngle = needleSelfTestAngle(frame);
  const selfTestDone = prog(frame, 72, 80, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{background: C.railDeep, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, clipPath: radialPolygon(wipe)}}>
        <PageCam
          src="textures/live/home-full@2x.png"
          pageH={2941}
          keys={[
            {frame: 0, cx: 960, cy: 570, zoom: 0.81, rotX: 2.5, rotY: -2, persp: 1800},
            {frame: 58, cx: 910, cy: 610, zoom: 0.96, rotX: 0.8, rotY: -0.6, persp: 1900},
            {frame: 149, cx: 755, cy: 618, zoom: 1.13, rotX: 0, rotY: 0, persp: 1900},
          ]}
          frame={frame}
        />
      </div>
      {frame < 38 ? (
        <div style={{position: 'absolute', left: 960, top: 540, width: 790, height: 18, transformOrigin: '0 50%', transform: `rotate(${pointerAngle}deg)`}}>
          <div style={{position: 'absolute', inset: '0 0 auto', height: 12, background: 'linear-gradient(90deg, rgba(5,34,31,.78), rgba(5,34,31,0))', filter: 'blur(7px)'}} />
          <div style={{position: 'absolute', inset: '5px 0 auto', height: 6, background: 'linear-gradient(90deg, rgba(143,216,207,.95), rgba(143,216,207,0))', boxShadow: '0 0 22px rgba(143,216,207,.9)'}} />
          <div style={{position: 'absolute', inset: '7px 0 auto', height: 2, background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0))'}} />
          <div style={{position: 'absolute', left: 0, top: 2, width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,.88)', boxShadow: '0 0 18px rgba(143,216,207,.9)'}} />
        </div>
      ) : null}
      <ProductFrame
        style={{
          position: 'absolute',
          left: 900,
          top: 168,
          width: 900,
          height: 718,
          overflow: 'hidden',
          opacity: gaugeIn,
          transform: `translateY(${(1 - gaugeIn) * 34}px) scale(${0.975 + gaugeIn * 0.025})`,
          boxShadow: '0 34px 100px rgba(4,39,35,.28)',
        }}
      >
        <Img src={staticFile('textures/live/chronometer@2x.png')} style={{width: 900, height: 'auto', display: 'block'}} />
        <svg width={900} height={718} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <g transform={`rotate(${-135 + needleAngle} 450 296)`}>
            <line x1="450" y1="315" x2="450" y2="94" stroke="rgba(255,255,255,.92)" strokeWidth="13" strokeLinecap="round" opacity="0.78" />
            <line x1="450" y1="315" x2="450" y2="94" stroke={C.brass} strokeWidth="7" strokeLinecap="round" />
          </g>
          <circle cx="450" cy="296" r="17" fill={C.ink} />
          <circle cx="450" cy="296" r="7" fill={C.brass} />
        </svg>
        <div style={{position: 'absolute', right: 36, top: 116, padding: '10px 17px', borderRadius: 99, background: 'rgba(9,45,40,.92)', color: '#fff', fontFamily: fonts.body, fontWeight: 700, fontSize: 32, opacity: selfTestDone}}>自检完成 · 30 天节律</div>
      </ProductFrame>
      <ProductFrame
        style={{
          position: 'absolute',
          left: 72,
          bottom: 92,
          width: 690,
          padding: '28px 34px 30px',
          opacity: copy,
          transform: `translateY(${(1 - copy) * 26}px)`,
        }}
      >
        <Kicker>30 DAY CHRONOMETER</Kicker>
        <div style={{fontFamily: fonts.display, fontSize: 58, lineHeight: 1.16, marginTop: 12, color: C.ink}}>30 天，不是压力<br />是可解释的节律</div>
        <div style={{fontFamily: fonts.body, fontSize: 32, lineHeight: 1.35, marginTop: 14, color: C.muted}}>说明为什么今天想起，决定仍留给你。</div>
      </ProductFrame>
    </AbsoluteFill>
  );
};

const ContactScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lock = prog(frame, 0, 36, Easing.out(Easing.cubic));
  const push = prog(frame, 24, 50, Easing.bezier(0.16, 1, 0.3, 1));
  const rise = prog(frame, 46, 58, Easing.bezier(0.2, 1, 0.3, 1));
  const reseat = prog(frame, 104, 122, Easing.inOut(Easing.cubic));
  const hover = frame >= 58 && frame < 104 ? Math.sin(((frame - 58) / 40) * Math.PI * 2) * 4 : 0;
  const lift = rise * (1 - reseat);
  const cardX = interpolate(push, [0, 1], [1220, 840]);
  const cardY = interpolate(push, [0, 1], [170, 64]) - lift * 24 + hover;
  const cardScale = interpolate(push, [0, 1], [0.92, 1]);
  const cardRotY = interpolate(push, [0, 1], [-15, -4]) * (1 - reseat);
  const spotX = interpolate(frame, [0, 10, 20, 30, 36], [18, 38, 62, 47, 69], CLAMP);
  const copy = prog(frame, 54, 72, Easing.out(Easing.cubic));
  const lap1 = prog(frame, 58, 72, Easing.linear);
  const lap2 = prog(frame, 76, 96, Easing.linear);
  return (
    <AbsoluteFill style={{background: C.mistDeep, overflow: 'hidden', perspective: 1400}}>
      <Img src={staticFile('textures/live/home-full@2x.png')} style={{position: 'absolute', width: 1920, height: 2941, top: -290, filter: 'blur(1.2px) saturate(.86)', transform: 'scale(1.02)'}} />
      <AbsoluteFill style={{background: `radial-gradient(circle 320px at ${spotX}% 44%, rgba(255,255,255,.08) 0 54%, rgba(7,35,32,.72) 100%)`, opacity: 0.82 - lock * 0.08}} />
      <div style={{position: 'absolute', left: cardX, top: cardY, width: 680, height: 900, transform: `scale(${cardScale}) rotateY(${cardRotY}deg)`, transformOrigin: '50% 50%', borderRadius: 32, overflow: 'hidden', boxShadow: `0 ${18 + lift * 28}px ${58 + lift * 44}px rgba(3,30,27,${0.28 + lift * 0.22})`}}>
        <Img src={staticFile('textures/live/contact-dialog@2x.png')} style={{width: 680, height: 900, display: 'block'}} />
        <svg width={680} height={900} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          <rect x="6" y="6" width="668" height="888" rx="28" fill="none" stroke={C.aqua} strokeWidth="5" pathLength="1" strokeDasharray=".14 1" strokeDashoffset={1 - lap1} opacity={lap1 < 1 ? 0.95 : 0} />
          <rect x="13" y="13" width="654" height="874" rx="24" fill="none" stroke={C.brass} strokeWidth="3" pathLength="1" strokeDasharray=".14 1" strokeDashoffset={1 - lap2} opacity={lap2 < 1 ? 0.74 : 0} />
        </svg>
      </div>
      <ProductFrame
        style={{
          position: 'absolute',
          left: 72,
          top: 570,
          width: 630,
          padding: '28px 34px 32px',
          borderLeft: `7px solid ${C.coral}`,
          opacity: copy,
          transform: `translateX(${(1 - copy) * -28}px)`,
        }}
      >
        <Kicker>REMINDER WITH REASON</Kicker>
        <div style={{fontFamily: fonts.display, fontSize: 58, lineHeight: 1.18, marginTop: 13}}>为什么现在值得想起<br />一眼就知道</div>
        <div style={{fontFamily: fonts.body, fontSize: 32, lineHeight: 1.42, color: C.muted, marginTop: 16}}>上次聊到什么、多久没联系、建议何时问候，都在同一张关系卡。</div>
      </ProductFrame>
    </AbsoluteFill>
  );
};

const PaperTitle: React.FC<{kicker: string; title: string; accent: string; subtitle: string}> = ({kicker, title, accent, subtitle}) => {
  const frame = useCurrentFrame();
  const line = prog(frame, 0, 24, Easing.out(Easing.cubic));
  const parts = title.split(accent);
  const words = [parts[0], accent, parts[1]].filter(Boolean);
  const accentColor = kicker === 'LOCAL FIRST' ? C.teal : C.coral;
  return (
    <AbsoluteFill style={{background: C.porcelain, alignItems: 'center', justifyContent: 'center', color: C.ink}}>
      <div style={{position: 'absolute', left: 230, right: 230, top: 248, height: 1, background: C.line, transform: `scaleX(${line})`}} />
      <div style={{position: 'absolute', left: 230, right: 230, bottom: 232, height: 1, background: C.line, transform: `scaleX(${line})`}} />
      <div style={{textAlign: 'center'}}>
        <Kicker>{kicker}</Kicker>
        <div style={{fontFamily: fonts.display, fontSize: 96, marginTop: 20, letterSpacing: '0.02em'}}>
          {words.map((word, index) => {
            const wordP = prog(frame, 4 + index * 5, 13 + index * 5, Easing.bezier(0.2, 0.75, 0.3, 1));
            return <span key={`${word}-${index}`} style={{display: 'inline-block', opacity: wordP, transform: `scale(${1.28 - wordP * 0.28})`, filter: `blur(${(1 - wordP) * 7}px)`, color: word === accent ? accentColor : C.ink, fontStyle: word === accent ? 'italic' : 'normal'}}>{word}</span>;
          })}
        </div>
        <div style={{fontFamily: fonts.body, fontSize: 32, color: C.muted, marginTop: 18, opacity: prog(frame, 12, 22)}}>{subtitle}</div>
      </div>
      <div style={{position: 'absolute', width: 220, height: 6, borderRadius: 10, background: C.brass, top: 550, transform: `scaleX(${prog(frame, 16, 34, Easing.out(Easing.cubic))})`}} />
      <Grain />
    </AbsoluteFill>
  );
};

const SearchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = Math.min(2, Math.floor(interpolate(frame, [14, 30], [0, 2], CLAMP)));
  const query = '最近'.slice(0, typed);
  const result = prog(frame, 58, 72, Easing.out(Easing.cubic));
  const detail = frame >= 88;
  const actionState = frame >= 112;
  const success = frame >= 136;
  const cursorIn = prog(frame, 112, 126, Easing.out(Easing.cubic));
  const click = interpolate(frame, [128, 131, 135], [0, 1, 0], CLAMP);
  const keys = [
    {frame: 0, cx: 980, cy: 1195, zoom: 0.83},
    {frame: 56, cx: 1030, cy: 1450, zoom: 0.99},
    {frame: 87, cx: 1050, cy: 1712, zoom: 1.09},
  ];
  return (
    <AbsoluteFill style={{background: C.mist, overflow: 'hidden'}}>
      {!detail ? (
        <PageCam src={frame < 56 ? 'textures/live/home-full@2x.png' : 'textures/live/search-recent-full@2x.png'} pageH={2941} keys={keys} frame={frame} />
      ) : (
        <Img src={staticFile(success ? 'textures/live/contact-dialog-success-page@2x.png' : actionState ? 'textures/live/contact-dialog-action-page@2x.png' : 'textures/live/contact-dialog-page@2x.png')} style={{position: 'absolute', width: 1920, height: 1080}} />
      )}
      {!detail ? (
      <ProductFrame
        style={{
          position: 'absolute',
          left: 555,
          top: 56,
          width: 810,
          height: 98,
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          gap: 20,
          border: `2px solid ${typed ? C.teal : C.line}`,
        }}
      >
        <div style={{fontSize: 34, color: C.teal}}>⌕</div>
        <div style={{fontFamily: fonts.body, fontSize: 34, color: query ? C.ink : C.muted, flex: 1}}>{query || '搜索联系人、话题或备注'}</div>
        <div style={{width: 3, height: 41, background: C.coral, opacity: frame % 18 < 10 ? 1 : 0}} />
        <div style={{fontFamily: fonts.body, fontSize: 19, color: C.muted, border: `1px solid ${C.line}`, borderRadius: 9, padding: '7px 10px'}}>⌘ K</div>
      </ProductFrame>
      ) : null}
      <div
        style={{
          position: 'absolute',
          right: 92,
          top: 188,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          opacity: detail ? 0 : result,
          transform: `translateY(${(1 - result) * 15}px)`,
        }}
      >
        <div style={{fontFamily: fonts.body, fontSize: 32, color: C.teal, background: '#dcf2ed', borderRadius: 99, padding: '11px 18px'}}>2 位相关联系人</div>
        <div style={{fontFamily: fonts.body, fontSize: 32, color: C.muted, background: 'rgba(255,255,255,.9)', borderRadius: 99, padding: '11px 18px'}}>结果只在本机筛选</div>
      </div>
      {!detail ? <ProductFrame
        style={{
          position: 'absolute',
          left: 84,
          bottom: 72,
          width: 570,
          padding: '26px 30px',
          opacity: result,
        }}
      >
        <Kicker>TYPE → FILTER → ACT</Kicker>
        <div style={{fontFamily: fonts.display, fontSize: 58, lineHeight: 1.18, marginTop: 10}}>搜索上次话题<br />进入真实关系卡</div>
        <div style={{fontFamily: fonts.body, fontSize: 32, color: C.muted, marginTop: 18}}>找到人，再由你记录这次问候。</div>
      </ProductFrame>
      : null}
      {actionState && !success ? (
        <>
          <div style={{position: 'absolute', right: 80, bottom: 66, width: 650, padding: '18px 24px', borderRadius: 22, background: 'rgba(9,45,40,.92)', color: '#fff', fontFamily: fonts.body, fontSize: 32}}>滚到关系卡底部，点击真实的「记录问候」</div>
          <div style={{position: 'absolute', left: interpolate(cursorIn, [0, 1], [1780, 1162]), top: interpolate(cursorIn, [0, 1], [980, 894]), transform: `scale(${1 - click * 0.14}) rotate(28deg)`, fontSize: 92, color: C.ink, filter: 'drop-shadow(0 8px 12px rgba(0,0,0,.28))'}}>➤</div>
          {click > 0 ? <div style={{position: 'absolute', left: 1210 - click * 55, top: 946 - click * 55, width: 110 * click, height: 110 * click, borderRadius: '50%', border: `4px solid rgba(31,117,107,${1 - click})`}} /> : null}
        </>
      ) : null}
      {success ? (
        <>
          <Img src={staticFile('textures/live/greeting-success-toast@2x.png')} style={{position: 'absolute', right: 66, bottom: 62, width: 740, height: 'auto', borderRadius: 26, boxShadow: '0 18px 55px rgba(0,0,0,.28)'}} />
          <div style={{position: 'absolute', left: 72, bottom: 66, padding: '20px 26px', borderRadius: 22, background: 'rgba(9,45,40,.92)', color: '#fff', fontFamily: fonts.body, fontSize: 32}}>产品内反馈已落定 · 不会自动发送消息</div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

const AxisRow: React.FC<{label: string; options: string[]; from: number; selected: number; progress: number}> = ({label, options, from, selected, progress}) => {
  const segmentW = 250;
  const x = interpolate(progress, [0, 1], [from * segmentW, selected * segmentW], {...CLAMP, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{display: 'grid', gridTemplateColumns: '245px 1fr', alignItems: 'center', gap: 30}}>
      <div style={{fontFamily: fonts.display, fontSize: 42, color: C.ink}}>{label}</div>
      <div style={{position: 'relative', width: segmentW * options.length, height: 76, padding: 6, border: `1px solid ${C.line}`, background: '#eef3f0', borderRadius: 18, display: 'flex'}}>
        <div style={{position: 'absolute', left: 6 + x, top: 6, width: segmentW - 4, height: 64, borderRadius: 14, background: C.paper, border: `1px solid ${C.line}`, boxShadow: '0 8px 24px rgba(15,59,52,.11)'}} />
        {options.map((option, index) => (
          <div key={option} style={{width: segmentW, position: 'relative', zIndex: 1, display: 'grid', placeItems: 'center', fontFamily: fonts.body, fontSize: 32, fontWeight: index === selected && progress > 0.8 ? 700 : 500, color: index === selected && progress > 0.8 ? C.teal : C.muted}}>
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

const TwoAxisScene: React.FC = () => {
  const frame = useCurrentFrame();
  const inP = prog(frame, 0, 16, Easing.out(Easing.cubic));
  const cursorIn = prog(frame, 16, 36, Easing.out(Easing.cubic));
  const press = interpolate(frame, [38, 41, 45], [0, 1, 0], CLAMP);
  const moveP = prog(frame, 42, 50, Easing.out(Easing.cubic));
  const ripple = prog(frame, 38, 50, Easing.out(Easing.quad));
  const cursorX = interpolate(cursorIn, [0, 1], [1780, 560]);
  const cursorY = interpolate(cursorIn, [0, 1], [990, 360]);
  return (
    <AbsoluteFill style={{background: `linear-gradient(135deg, ${C.porcelain}, #e7f1ed)`, color: C.ink}}>
      <div style={{position: 'absolute', left: 105, top: 90, opacity: inP}}>
        <Kicker>TWO INDEPENDENT AXES</Kicker>
        <div style={{fontFamily: fonts.display, fontSize: 72, marginTop: 12}}>联系频率 ≠ 维系意愿</div>
      </div>
      <ProductFrame style={{position: 'absolute', left: 105, top: 300, right: 105, padding: '52px 62px', display: 'flex', flexDirection: 'column', gap: 44, opacity: inP, transform: `translateY(${(1 - inP) * 28}px)`}}>
        <AxisRow label="联系频率" options={['常联系人', '不常联系人', '待校验']} from={1} selected={0} progress={moveP} />
        <div style={{height: 1, background: C.line}} />
        <AxisRow label="维系意愿" options={['需要维系', '不需要维系', '未设置']} from={0} selected={0} progress={1} />
      </ProductFrame>
      {ripple < 1 && frame >= 38 ? <div style={{position: 'absolute', left: 565 - ripple * 72, top: 391 - ripple * 72, width: ripple * 144, height: ripple * 144, borderRadius: '50%', border: `4px solid rgba(31,117,107,${1 - ripple})`, zIndex: 5}} /> : null}
      <svg width={130} height={150} viewBox="0 0 26 30" style={{position: 'absolute', left: cursorX, top: cursorY, transform: `scale(${1 - press * 0.14})`, transformOrigin: '15% 10%', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,.25))', zIndex: 7}}>
        <path d="M4 2 L4 24 L9.5 18.5 L13 27 L16.8 25.4 L13.3 17 L21 17 Z" fill="#fff" stroke={C.ink} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: 165, bottom: 82, display: 'flex', gap: 24, opacity: prog(frame, 52, 68)}}>
        {[
          ['联系频率', '不常 → 常'],
          ['维系意愿', '始终需要维系'],
        ].map(([a, b]) => (
          <div key={a} style={{display: 'flex', alignItems: 'center', gap: 13, border: `1px solid ${C.line}`, background: 'rgba(255,255,255,.8)', borderRadius: 99, padding: '14px 22px', fontFamily: fonts.body, fontSize: 32}}>
            <span style={{color: C.teal, fontWeight: 700}}>{a}</span><span style={{color: C.muted}}>{b}</span>
          </div>
        ))}
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

const TagScene: React.FC = () => {
  const frame = useCurrentFrame();
  const textValue = '#老友';
  const typed = Math.min(textValue.length, Math.floor(interpolate(frame, [8, 26], [0, textValue.length], CLAMP)));
  const morphFrame = 40;
  const move = prog(frame, 58, 72, Easing.bezier(0.5, 0, 0.25, 1));
  const revealed = frame >= 75;
  const settle = frame < morphFrame ? 1 : interpolate(frame, [morphFrame, morphFrame + 3], [1.03, 1], CLAMP);
  const px = interpolate(move, [0, 1], [960, 850]);
  const py = interpolate(move, [0, 1], [545, 704]);
  const scale = interpolate(move, [0, 1], [1, 0.48]) * settle;
  return (
    <AbsoluteFill style={{background: C.railDeep, color: '#fff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 110, top: 100}}>
        <Kicker dark>ONE MEMORY, ONE TAG</Kicker>
        <div style={{fontFamily: fonts.display, fontSize: 70, marginTop: 13}}>把关系语境，放回联系人身边</div>
      </div>
      {!revealed && frame < morphFrame ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <span style={{fontFamily: fonts.body, fontSize: 112, fontWeight: 600, color: '#f5fffd'}}>{textValue.slice(0, typed)}</span>
            <span style={{width: 7, height: 126, marginLeft: 10, borderRadius: 4, background: C.coral}} />
          </div>
        </AbsoluteFill>
      ) : null}
      {revealed ? (
        <div style={{position: 'absolute', left: 145, top: 660, width: 1630, height: 90, borderRadius: 26, overflow: 'hidden', boxShadow: '0 24px 70px rgba(0,0,0,.26)'}}>
          <Img src={staticFile('textures/live/contact-row@2x.png')} style={{width: 1630, height: 90, display: 'block'}} />
        </div>
      ) : null}
      {frame >= morphFrame ? (
        <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${px}px, ${py}px) scale(${scale})`}}>
          <div style={{width: 620, height: 180, borderRadius: 100, background: revealed ? '#cde4dc' : '#e4ebe7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34, transform: 'translate(-50%,-50%)', boxShadow: revealed ? '0 6px 14px rgba(0,0,0,.12)' : '0 22px 62px rgba(0,0,0,.22)'}}>
            <BrandMark size={82} color={revealed ? C.teal : C.inkSoft} />
            <span style={{fontFamily: fonts.body, fontSize: 84, fontWeight: 700, color: revealed ? C.teal : C.inkSoft}}>老友</span>
          </div>
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 110, bottom: 92, fontFamily: fonts.body, fontSize: 32, color: '#b9d8d2', opacity: prog(frame, 78, 88)}}>标签由你定义，关系不被系统替你命名。</div>
      <Grain dark />
    </AbsoluteFill>
  );
};

const sliderPosition = (frame: number) => {
  if (frame < 24) return interpolate(frame, [12, 24], [8, 76], {easing: Easing.out(Easing.cubic), ...CLAMP});
  if (frame < 36) return interpolate(frame, [24, 36], [76, 70], {easing: Easing.inOut(Easing.cubic), ...CLAMP});
  if (frame < 54) return 70;
  return interpolate(frame, [54, 96], [70, 40], {easing: Easing.inOut(Easing.quad), ...CLAMP});
};

const PrivacyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pos = sliderPosition(frame);
  const x = (pos / 100) * 1920;
  const velocity = Math.abs(sliderPosition(frame) - sliderPosition(frame - 1));
  const stretch = 1 + Math.min(1, velocity / 8) * 0.18;
  const caption = prog(frame, 90, 118, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{background: C.railDeep, overflow: 'hidden'}}>
      <Img src={staticFile('textures/live/home-full@2x.png')} style={{position: 'absolute', width: 1920, height: 1080}} />
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${1920 - x}px 0 0)`}}>
        <Img src={staticFile('textures/live/privacy-page@2x.png')} style={{position: 'absolute', width: 1920, height: 1080}} />
      </div>
      <div style={{position: 'absolute', left: x - 3, top: 0, width: 6, height: 1080, background: '#fff', boxShadow: '0 0 18px rgba(15,59,52,.5)'}} />
      <div style={{position: 'absolute', left: x - 48, top: 492, width: 96, height: 96, borderRadius: '50%', background: C.paper, border: `3px solid ${C.line}`, boxShadow: '0 12px 34px rgba(0,0,0,.28)', display: 'grid', placeItems: 'center', transform: `scaleX(${stretch})`}}>
        <div style={{display: 'flex', gap: 12, color: C.teal, fontFamily: fonts.body, fontSize: 30, fontWeight: 800}}><span>‹</span><span>›</span></div>
      </div>
      <div style={{position: 'absolute', left: 62, top: 70, background: 'rgba(15,59,52,.92)', color: '#fff', borderRadius: 99, padding: '13px 21px', fontFamily: fonts.body, fontSize: 32, letterSpacing: '.08em'}}>隐私模式开启</div>
      <div style={{position: 'absolute', right: 62, top: 70, background: 'rgba(255,255,255,.92)', color: C.ink, borderRadius: 99, padding: '13px 21px', fontFamily: fonts.body, fontSize: 32, letterSpacing: '.08em'}}>默认视图</div>
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 55,
          padding: '22px 30px',
          borderRadius: 24,
          background: 'rgba(9,45,40,.92)',
          border: '1px solid rgba(143,216,207,.32)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff',
          opacity: caption,
          transform: `translateY(${(1 - caption) * 22}px)`,
        }}
      >
        <div>
          <Kicker dark>PRIVATE BY DEFAULT</Kicker>
          <div style={{fontFamily: fonts.display, fontSize: 56, marginTop: 8}}>看见节律，也保留边界。</div>
        </div>
        <div style={{display: 'flex', gap: 14, fontFamily: fonts.body, fontSize: 32}}>
          <span style={{border: '1px solid rgba(143,216,207,.4)', borderRadius: 99, padding: '12px 18px'}}>SQLite 本机权威存储</span>
          <span style={{border: '1px solid rgba(143,216,207,.4)', borderRadius: 99, padding: '12px 18px'}}>不会自动发送消息</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const wobble = interpolate(frame, [8, 14, 20, 27, 32], [0, -12, 14, -18, 0], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const flip = prog(frame, 32, 44, Easing.in(Easing.cubic));
  const iconScaleX = interpolate(flip, [0, 1], [1, 0.04]);
  const exchange = 45;
  const bloom = spring({frame: frame - exchange, fps: 30, config: {damping: 11, stiffness: 130, mass: 0.85}});
  const markScaleX = interpolate(Math.min(1, bloom), [0, 1], [0.04, 1]);
  const shift = prog(frame, 64, 80, Easing.out(Easing.cubic));
  const markX = interpolate(shift, [0, 1], [960, 610]);
  const tagline = prog(frame, 102, 116, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 44%, #16443d 0%, ${C.railDeep} 54%, #061f1c 100%)`, color: '#fff', alignItems: 'center', justifyContent: 'center'}}>
      {frame < exchange ? (
        <div
          style={{
            position: 'absolute',
            left: 960,
            top: 390,
            width: 340,
            height: 120,
            marginLeft: -170,
            borderRadius: 32,
            border: '1px solid rgba(143,216,207,.6)',
            background: 'rgba(255,255,255,.10)',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            boxShadow: '0 20px 80px rgba(0,0,0,.26)',
            transform: `rotate(${wobble}deg) scaleX(${iconScaleX})`,
            transformOrigin: '50% 78%',
            filter: flip > 0.3 ? `blur(${flip * 5}px)` : 'none',
          }}
        >
          <div style={{fontFamily: fonts.body, fontSize: 34, color: '#d9f7f1', whiteSpace: 'nowrap'}}>◉ 隐私模式</div>
        </div>
      ) : null}
      {frame >= exchange ? (
        <div style={{position: 'absolute', left: markX - 91, top: 300, transform: `scaleX(${markScaleX})`, opacity: frame === exchange ? 1 : Math.min(1, bloom)}}>
          <BrandMark size={182} color="#9edbd3" progress={Math.min(1, bloom)} />
        </div>
      ) : null}
      {[0, 1, 2].map((ring) => (
        <div
          key={ring}
          style={{
            position: 'absolute',
            left: markX,
            top: 391,
            width: 250 + ring * 150,
            height: 250 + ring * 150,
            borderRadius: '50%',
            border: '1px solid rgba(143,216,207,.18)',
            transform: `translate(-50%,-50%) scale(${0.7 + bloom * 0.3})`,
            opacity: Math.max(0, bloom - ring * 0.08) * (0.75 - ring * 0.18),
          }}
        />
      ))}
      <div style={{position: 'absolute', left: 780, top: 316, display: 'flex', fontFamily: fonts.brand, fontSize: 118, letterSpacing: '.12em'}}>
        {'关系回响'.split('').map((char, index) => {
          const p = prog(frame, 72 + index * 5, 82 + index * 5, Easing.out(Easing.cubic));
          return <span key={char} style={{display: 'inline-block', opacity: p, transformOrigin: '50% 100%', transform: `scale(${1.6 - p * 0.6})`, filter: `blur(${(1 - p) * 10}px)`}}>{char}</span>;
        })}
      </div>
      <div style={{position: 'absolute', top: 585, fontFamily: fonts.display, fontSize: 56, letterSpacing: '.06em', color: '#d5e8e4', opacity: tagline}}>在合适的时候，想起值得的人</div>
      <div style={{position: 'absolute', bottom: 94, display: 'flex', gap: 18, alignItems: 'center', fontFamily: fonts.body, fontSize: 32, color: '#acd4cd', opacity: tagline}}>
        <span>本机优先</span><span style={{width: 4, height: 4, borderRadius: '50%', background: C.brass}} /><span>解释提醒</span><span style={{width: 4, height: 4, borderRadius: '50%', background: C.brass}} /><span>决定始终在你</span>
      </div>
      <Grain dark />
    </AbsoluteFill>
  );
};

const SFX_CUES = [
  {frame: 24, duration: 30, file: 'soft-hit.wav', volume: 0.42, action: '品牌逐字压印起拍'},
  {frame: 96, duration: 36, file: 'whoosh.wav', volume: 0.42, action: '圆周扫描揭示页面'},
  {frame: 138, duration: 36, file: 'whoosh.wav', volume: 0.34, action: '机械指针满弧自检'},
  {frame: 170, duration: 18, file: 'tick.wav', volume: 0.44, action: '机械指针回落真值'},
  {frame: 291, duration: 36, file: 'whoosh.wav', volume: 0.35, action: '联系人卡弹起'},
  {frame: 307, duration: 18, file: 'tick.wav', volume: 0.3, action: '第一圈轮廓扫描'},
  {frame: 370, duration: 18, file: 'tick.wav', volume: 0.34, action: '联系人卡归位'},
  {frame: 390, duration: 28, file: 'paper.wav', volume: 0.28, action: '理由字卡压印'},
  {frame: 454, duration: 12, file: 'keypress.wav', volume: 0.36, action: '搜索输入第一字'},
  {frame: 466, duration: 12, file: 'keypress.wav', volume: 0.33, action: '搜索输入第二字'},
  {frame: 566, duration: 18, file: 'tick.wav', volume: 0.42, action: '关系卡记录问候点击'},
  {frame: 574, duration: 30, file: 'soft-hit.wav', volume: 0.36, action: '产品内成功反馈'},
  {frame: 644, duration: 18, file: 'tick.wav', volume: 0.4, action: '双轴控件点击'},
  {frame: 656, duration: 30, file: 'soft-hit.wav', volume: 0.34, action: '8帧 thumb 落定'},
  {frame: 756, duration: 30, file: 'soft-hit.wav', volume: 0.34, action: '标签一帧实体化'},
  {frame: 774, duration: 36, file: 'whoosh.wav', volume: 0.28, action: '标签缩小落位'},
  {frame: 791, duration: 18, file: 'tick.wav', volume: 0.32, action: '标签成品页硬切'},
  {frame: 833, duration: 28, file: 'paper.wav', volume: 0.28, action: '隐私字卡压印'},
  {frame: 892, duration: 36, file: 'whoosh.wav', volume: 0.45, action: '隐私对照扫杆启动'},
  {frame: 1062, duration: 36, file: 'whoosh.wav', volume: 0.35, action: '隐私按钮翻扁'},
  {frame: 1075, duration: 30, file: 'soft-hit.wav', volume: 0.44, action: '最薄帧交换后品牌绽放'},
] as const;

const Soundtrack: React.FC<{includeBgm: boolean}> = ({includeBgm}) => (
  <>
    {includeBgm ? (
      <Audio
        src={staticFile('audio/relationship-echo-bed-mix.wav')}
        volume={(frame) => interpolate(frame, [0, 36, 1110, 1199], [0, 0.72, 0.72, 0], CLAMP)}
      />
    ) : null}
    {SFX_CUES.map((cue) => (
      <Sequence key={`${cue.frame}-${cue.action}`} from={cue.frame} durationInFrames={cue.duration} name={cue.action}>
        <Audio src={staticFile(`audio/${cue.file}`)} volume={cue.volume} />
      </Sequence>
    ))}
  </>
);

export const RelationshipEchoPromo: React.FC<{includeBgm: boolean}> = ({includeBgm}) => (
  <AbsoluteFill style={{background: C.porcelain}}>
    <Sequence from={0} durationInFrames={96}><BrandOpen /></Sequence>
    <Sequence from={96} durationInFrames={150}><RhythmScene /></Sequence>
    <Sequence from={246} durationInFrames={138}><ContactScene /></Sequence>
    <Sequence from={384} durationInFrames={54}>
      <PaperTitle kicker="REMINDER, NOT PRESSURE" title="提醒给出理由，决定始终在你" accent="你" subtitle="上次话题、时间位置与建议日期，在行动前先说清楚。" />
    </Sequence>
    <Sequence from={438} durationInFrames={168}><SearchScene /></Sequence>
    <Sequence from={606} durationInFrames={110}><TwoAxisScene /></Sequence>
    <Sequence from={716} durationInFrames={110}><TagScene /></Sequence>
    <Sequence from={826} durationInFrames={54}>
      <PaperTitle kicker="LOCAL FIRST" title="看见节律，也保留边界" accent="边界" subtitle="重要关系可以被记住，私密内容不必离开本机。" />
    </Sequence>
    <Sequence from={880} durationInFrames={150}><PrivacyScene /></Sequence>
    <Sequence from={1030} durationInFrames={170}><OutroScene /></Sequence>
    <Soundtrack includeBgm={includeBgm} />
  </AbsoluteFill>
);

import { useEffect, useId, useRef, useState } from 'react';
import { FIGMA_ASSETS } from '../assets/figmaAssets';

const LEFT_EYE = { cx: 72, cy: 85.5, maxR: 14.5 };
const RIGHT_EYE = { cx: 171, cy: 85.5, maxR: 14.5 };

export function MascotHead({ size = 128, mood = 'idle', trackCursor = true }) {
  const uid = useId();
  const [blinking, setBlinking] = useState(false);
  const svgRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const faceWrapRef = useRef(null);
  const targetRef = useRef({ lx: 0, ly: 0, rx: 0, ry: 0, hx: 0, hy: 0 });
  const curRef = useRef({ lx: 0, ly: 0, rx: 0, ry: 0, hx: 0, hy: 0 });

  useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;
    let blinkTimer;
    const interval = setInterval(() => {
      setBlinking(true);
      blinkTimer = setTimeout(() => setBlinking(false), 145);
    }, 3400);
    return () => {
      clearInterval(interval);
      if (blinkTimer) clearTimeout(blinkTimer);
    };
  }, []);

  useEffect(() => {
    if (mood === 'left') {
      targetRef.current = { lx: -10, ly: 0, rx: -10, ry: 0, hx: -2, hy: 0 };
    } else if (mood === 'right') {
      targetRef.current = { lx: 10, ly: 0, rx: 10, ry: 0, hx: 2, hy: 0 };
    } else if (mood === 'happy') {
      targetRef.current = { lx: 0, ly: -4, rx: 0, ry: -4, hx: 0, hy: -2 };
    }
  }, [mood]);

  //gerakin pupil mata langsung lewat ref di loop rAF biar ga bikin react re-render tiap kali mouse digeser
  useEffect(() => {
    if (!trackCursor) return undefined;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handlePointerMove = (e) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const calcOffset = (eye) => {
        const ex = rect.left + (eye.cx / 243) * rect.width;
        const ey = rect.top + (eye.cy / 243) * rect.height;
        const dx = e.clientX - ex;
        const dy = e.clientY - ey;
        const dist = Math.hypot(dx, dy);
        if (dist < 1) return { x: 0, y: 0 };
        const angle = Math.atan2(dy, dx);
        const reach = Math.min(1, dist / 240) * eye.maxR;
        return { x: Math.cos(angle) * reach, y: Math.sin(angle) * reach };
      };

      const l = calcOffset(LEFT_EYE);
      const r = calcOffset(RIGHT_EYE);
      const midX = rect.left + rect.width * 0.5;
      const midY = rect.top + rect.height * 0.5;
      const hx = Math.max(-3.5, Math.min(3.5, ((e.clientX - midX) / 380) * 3.5));
      const hy = Math.max(-3.5, Math.min(3.5, ((e.clientY - midY) / 380) * 3.5));

      targetRef.current = { lx: l.x, ly: l.y, rx: r.x, ry: r.y, hx, hy };

      if (reduced) {
        curRef.current = { ...targetRef.current };
        if (leftPupilRef.current) leftPupilRef.current.setAttribute('transform', `translate(${l.x.toFixed(2)}, ${l.y.toFixed(2)})`);
        if (rightPupilRef.current) rightPupilRef.current.setAttribute('transform', `translate(${r.x.toFixed(2)}, ${r.y.toFixed(2)})`);
      }
    };

    const handlePointerLeave = () => {
      targetRef.current = { lx: 0, ly: 0, rx: 0, ry: 0, hx: 0, hy: 0 };
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    let raf;
    const step = () => {
      const c = curRef.current;
      const t = targetRef.current;
      const ease = 0.2;
      c.lx += (t.lx - c.lx) * ease;
      c.ly += (t.ly - c.ly) * ease;
      c.rx += (t.rx - c.rx) * ease;
      c.ry += (t.ry - c.ry) * ease;
      c.hx += (t.hx - c.hx) * ease;
      c.hy += (t.hy - c.hy) * ease;

      if (leftPupilRef.current) {
        leftPupilRef.current.setAttribute('transform', `translate(${c.lx.toFixed(2)}, ${c.ly.toFixed(2)})`);
      }
      if (rightPupilRef.current) {
        rightPupilRef.current.setAttribute('transform', `translate(${c.rx.toFixed(2)}, ${c.ry.toFixed(2)})`);
      }
      if (faceWrapRef.current) {
        faceWrapRef.current.style.transform = `translate3d(${c.hx.toFixed(2)}px, ${c.hy.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(step);
    };

    if (!reduced) {
      raf = requestAnimationFrame(step);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [trackCursor]);

  const borderPx = Math.max(3, Math.round(size * 0.03));
  const headTransform =
    mood === 'happy'
      ? 'translateY(-4px) scale(1.04)'
      : mood === 'shocked'
      ? 'rotate(-4deg) scale(0.98)'
      : 'none';

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${borderPx}px solid #ffffff`,
        background: '#e88d96',
        overflow: 'hidden',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
        transition: 'transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)',
        transform: headTransform,
        flexShrink: 0,
      }}
      role="img"
      aria-label="Maskot UtakAtik"
    >
      <div ref={faceWrapRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img
          src={FIGMA_ASSETS.mascotHeadImg}
          alt=""
          draggable={false}
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', transform: 'scale(1.05)' }}
        />

        <svg
          ref={svgRef}
          viewBox="0 0 243 243"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <defs>
            <clipPath id={`${uid}-left`}>
              <circle cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="28" />
            </clipPath>
            <clipPath id={`${uid}-right`}>
              <circle cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="28" />
            </clipPath>
          </defs>

          <g clipPath={`url(#${uid}-left)`}>
            {mood === 'happy' ? (
              <path
                d={`M ${LEFT_EYE.cx - 14} ${LEFT_EYE.cy + 4} Q ${LEFT_EYE.cx} ${LEFT_EYE.cy - 12} ${LEFT_EYE.cx + 14} ${LEFT_EYE.cy + 4}`}
                fill="none"
                stroke="#1B1A18"
                strokeWidth="6"
                strokeLinecap="round"
              />
            ) : (
              <g ref={leftPupilRef}>
                <circle
                  cx={LEFT_EYE.cx}
                  cy={LEFT_EYE.cy}
                  r={mood === 'shocked' ? 6 : 9}
                  fill="#1B1A18"
                />
                <circle cx={LEFT_EYE.cx - 3} cy={LEFT_EYE.cy - 3} r="2.6" fill="#FFFFFF" opacity="0.9" />
              </g>
            )}
            <rect
              x={LEFT_EYE.cx - 32}
              y={LEFT_EYE.cy - 32}
              width="64"
              height={blinking ? 64 : 0}
              fill="#E88D96"
              style={{ transition: 'height 0.08s ease' }}
            />
          </g>

          <g clipPath={`url(#${uid}-right)`}>
            {mood === 'happy' ? (
              <path
                d={`M ${RIGHT_EYE.cx - 14} ${RIGHT_EYE.cy + 4} Q ${RIGHT_EYE.cx} ${RIGHT_EYE.cy - 12} ${RIGHT_EYE.cx + 14} ${RIGHT_EYE.cy + 4}`}
                fill="none"
                stroke="#1B1A18"
                strokeWidth="6"
                strokeLinecap="round"
              />
            ) : (
              <g ref={rightPupilRef}>
                <circle
                  cx={RIGHT_EYE.cx}
                  cy={RIGHT_EYE.cy}
                  r={mood === 'shocked' ? 6 : 9}
                  fill="#1B1A18"
                />
                <circle cx={RIGHT_EYE.cx - 3} cy={RIGHT_EYE.cy - 3} r="2.6" fill="#FFFFFF" opacity="0.9" />
              </g>
            )}
            <rect
              x={RIGHT_EYE.cx - 32}
              y={RIGHT_EYE.cy - 32}
              width="64"
              height={blinking ? 64 : 0}
              fill="#E88D96"
              style={{ transition: 'height 0.08s ease' }}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

export function MiniTableIcon() {
  const rows = [
    ['#00936d', null, null, null, null, null, null, '#4f467f'],
    ['#de3838', '#fc6e48', null, null, null, '#89cb3e', '#4e75d0', '#4f467f'],
    ['#de3838', '#fc6e48', null, null, '#ffd400', '#89cb3e', '#4e75d0', '#4f467f'],
    ['#de3838', '#fc6e48', '#feb300', '#feb300', '#ffd400', '#00936d', '#4e75d0', '#4f467f'],
    ['#de3838', '#fc6e48', '#feb300', '#feb300', '#ffd400', '#89cb3e', '#4e75d0', '#4f467f'],
  ];
  return (
    <svg width="78" height="64" viewBox="0 0 78 64" aria-hidden="true">
      {rows.map((r, ri) =>
        r.map((col, ci) =>
          col ? (
            <rect
              key={`${ri}-${ci}`}
              x={3 + ci * 9}
              y={10 + ri * 9}
              width="7.5"
              height="7.5"
              rx="1.5"
              fill={col}
            />
          ) : null
        )
      )}
      <g transform="translate(36, 4) rotate(-14)">
        <rect x="0" y="0" width="13" height="13" rx="2.5" fill="#89cb3e" stroke="#fff" strokeWidth="1.5" />
      </g>
      <rect x="14" y="56" width="52" height="6" rx="1.5" fill="#ceaf81" />
    </svg>
  );
}

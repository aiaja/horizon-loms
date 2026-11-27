import { useEffect, useRef, useState } from 'react';
import { getElectronShells } from '../data/elements';

export function BohrAtom({
  protons = 12,
  neutrons = 12,
  electrons = 12,
  size = 285,
  animateOrbit = true,
  isUnstable = false,
  onElectronClick = null,
}) {
  const [anglePhase, setAnglePhase] = useState(0);
  const [rippleTick, setRippleTick] = useState(0);
  const prevElecRef = useRef(electrons);

  useEffect(() => {
    if (electrons !== prevElecRef.current) {
      prevElecRef.current = electrons;
      setRippleTick((r) => r + 1);
    }
  }, [electrons]);

  //loop orbit biar elektronnya muter halus pake rAF
  useEffect(() => {
    if (!animateOrbit) return undefined;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    let raf;
    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setAnglePhase((a) => (a + dt) % (Math.PI * 200));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animateOrbit]);

  const shells = getElectronShells(electrons);
  const maxShells = Math.max(shells.length, 3);
  const maxRadius = 118;
  const minRadius = 46;

  // ini bagian buat nyebar proton sm neutron pake sudut spiral biar ngumpul rapi di tengah dan ga numpuk numpuk
  const nucleonCount = Math.min(protons + neutrons, 20);
  const nucleons = [];
  for (let i = 0; i < nucleonCount; i++) {
    const isProton = i % 2 === 0 ? i / 2 < protons : false;
    const angle = i * 2.39996;
    const dist = i === 0 ? 0 : 4.2 + Math.sqrt(i) * 4.0;
    nucleons.push({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      color: isProton ? '#FC6E48' : '#8BBFE7',
    });
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="-142 -142 284 284"
      role="img"
      aria-label={`Diagram atom Bohr aktif dengan ${protons} proton, ${neutrons} neutron, dan ${electrons} elektron`}
      style={{ maxWidth: '100%', height: 'auto', overflow: 'visible' }}
    >
      {rippleTick > 0 && (
        <circle
          key={rippleTick}
          cx={0}
          cy={0}
          r={118}
          fill="none"
          stroke="#8885D2"
          strokeWidth="2.5"
          opacity="0"
        >
          <animate attributeName="r" from="38" to="134" dur="0.45s" begin="0s" fill="freeze" />
          <animate attributeName="opacity" values="0.75;0" dur="0.45s" begin="0s" fill="freeze" />
        </circle>
      )}

      {shells.map((_, idx) => {
        const radius =
          maxShells === 1
            ? 68
            : minRadius + (idx / (maxShells - 1)) * (maxRadius - minRadius);
        const isValenceShell = idx === shells.length - 1;
        return (
          <circle
            key={`ring-${idx}`}
            cx={0}
            cy={0}
            r={radius}
            fill="none"
            stroke={isValenceShell ? '#FEB300' : '#C8C7EA'}
            strokeWidth={isValenceShell ? '2.4' : '2'}
            strokeDasharray={isValenceShell ? '6 4' : undefined}
            opacity={isValenceShell ? 0.85 : 0.9}
          />
        );
      })}

      <g className={isUnstable ? 'ua-nucleus-unstable' : ''}>
        <circle
          cx={0}
          cy={0}
          r={isUnstable ? 34 : 30}
          fill={isUnstable ? '#F5C1C1' : '#FFE7B0'}
          stroke={isUnstable ? '#DE3838' : 'none'}
          strokeWidth={isUnstable ? 2 : 0}
        />

        {nucleons.map((n, i) => (
          <circle
            key={`nuc-${i}`}
            cx={n.x}
            cy={n.y}
            r={5.8}
            fill={n.color}
            stroke="#ffffff"
            strokeWidth="1"
          />
        ))}
      </g>

      {shells.map((count, sIdx) => {
        const radius =
          maxShells === 1
            ? 68
            : minRadius + (sIdx / (maxShells - 1)) * (maxRadius - minRadius);
        const angularSpeed = (sIdx % 2 === 0 ? 1 : -1) * (0.95 / (sIdx + 0.8));
        const startOffset = -Math.PI / 2 + anglePhase * angularSpeed + sIdx * 0.4;
        const isValenceShell = sIdx === shells.length - 1;

        return Array.from({ length: count }).map((__, eIdx) => {
          const theta = startOffset + (eIdx * 2 * Math.PI) / count;
          const ex = Math.cos(theta) * radius;
          const ey = Math.sin(theta) * radius;
          const clickable = Boolean(onElectronClick && isValenceShell);

          return (
            <g
              key={`e-${sIdx}-${eIdx}`}
              transform={`translate(${ex.toFixed(2)}, ${ey.toFixed(2)})`}
              onClick={clickable ? onElectronClick : undefined}
              style={{ cursor: clickable ? 'pointer' : 'default' }}
            >
              {clickable && (
                <circle cx={0} cy={0} r={13} fill="transparent" />
              )}
              <circle
                cx={0}
                cy={0}
                r={isValenceShell ? 7.4 : 6.2}
                fill={isValenceShell ? '#FEB300' : '#8885D2'}
                stroke="#ffffff"
                strokeWidth="1.6"
              />
            </g>
          );
        });
      })}
    </svg>
  );
}

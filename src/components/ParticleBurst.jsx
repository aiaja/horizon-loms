const COLORS = ['#fec233', '#fc6e48', '#89cb3e', '#8bbfe7', '#8885d2', '#de3838'];

export function ParticleBurst({ burstKey }) {
  if (!burstKey) return null;

  const pieces = Array.from({ length: 18 }).map((_, idx) => {
    const angle = (idx / 18) * Math.PI * 2 + (idx % 2) * 0.15;
    const dist = 54 + (idx % 3) * 28;
    const dx = Math.round(Math.cos(angle) * dist);
    const dy = Math.round(Math.sin(angle) * dist);
    const rot = (idx * 55) % 360;
    const color = COLORS[idx % COLORS.length];
    return { dx, dy, rot, color, isCircle: idx % 3 === 0 };
  });

  return (
    <div key={burstKey} className="ua-burst-layer" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="ua-burst-piece"
          style={{
            background: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--rot': `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}

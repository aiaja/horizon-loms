import { useState } from 'react';
import { CATEGORY_THEMES, getElectronShells } from '../data/elements';
import { EverydayVisual } from './EverydayVisual';
import { SFX } from '../utils/sfx';

export function ElementFlashcard({ element }) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  if (!element) {
    return (
      <div className="ua-flashcard-wrap">
        <div className="ua-flashcard-back" style={{ background: '#9e9d99' }} />
        <div className="ua-flashcard-front" style={{ background: '#cbc9c4', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1b1a18', textAlign: 'center' }}>
            Unsur Belum Ditemukan
          </div>
          <div style={{ fontSize: 13, color: '#474643', textAlign: 'center' }}>
            Atur Proton antara 1 hingga 118
          </div>
        </div>
      </div>
    );
  }

  const theme = CATEGORY_THEMES[element.cat] || CATEGORY_THEMES.unknown;
  const shells = getElectronShells(element.z);
  const valence = shells[shells.length - 1] || 0;

  const handleMouseMove = (e) => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: Math.round(-py * 12), ry: Math.round(px * 14) });
  };

  const handleFlip = () => {
    SFX.click();
    setFlipped((f) => !f);
  };

  return (
    <div
      className="ua-flashcard-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      style={{ perspective: 900 }}
    >
      <div
        className="ua-flashcard-back"
        style={{
          background: theme.back,
          transition: 'transform 0.25s ease',
          transform: `rotate(4.12deg) rotateX(${tilt.rx * 0.5}deg) rotateY(${tilt.ry * 0.5}deg)`,
        }}
      />
      <button
        type="button"
        onClick={handleFlip}
        aria-label={`Kartu unsur ${element.nameId}, klik untuk melihat sisi belakang`}
        className="ua-flashcard-front"
        style={{
          background: theme.bg,
          border: 'none',
          textAlign: 'left',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
      >
        {!flipped ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
              <div className="ua-flashcard-badge" style={{ background: theme.softBox, color: theme.boxText }}>
                <span style={{ fontSize: 11, fontWeight: 700, alignSelf: 'flex-start', lineHeight: 1.1 }}>
                  {element.z}
                </span>
                <span style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>
                  {element.sym}
                </span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, lineHeight: '26px', color: '#1b1a18', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {element.nameId}
              </div>
            </div>

            <div className="ua-flashcard-art" style={{ background: theme.softBox, position: 'relative' }}>
              <EverydayVisual iconKey={element.iconKey} size={66} />
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1b1a18' }}>
                {element.everydayItem}
              </div>
              <span style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 9.5, fontWeight: 700, color: theme.boxText, opacity: 0.85 }}>
                Klik info kulit →
              </span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#1b1a18' }}>
                {element.sym} · #{element.z}
              </span>
              <span style={{ background: theme.softBox, color: theme.boxText, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                {theme.label}
              </span>
            </div>

            <div style={{ background: theme.softBox, borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 6, flex: 1, justifyContent: 'center', fontSize: 12.5, color: '#1b1a18' }}>
              <div><strong>Konfigurasi Kulit:</strong> ({shells.join(', ')})</div>
              <div><strong>Elektron Valensi:</strong> {valence} e⁻ terluar</div>
              <div><strong>Massa Atom:</strong> ≈ {element.mass} u</div>
              <div><strong>Posisi:</strong> Periode {element.period}, Gol. {element.group}</div>
            </div>

            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#1b1a18', textAlign: 'right', opacity: 0.8 }}>
              ← Kembali ke visual
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

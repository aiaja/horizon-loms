import { useState } from 'react';
import { FIGMA_ASSETS } from '../assets/figmaAssets';
import { TactileAmberButton } from '../components/TactileButton';
import { MascotHead, MiniTableIcon } from '../components/MascotHead';
import { SFX } from '../utils/sfx';

const QUIPS = [
  'Semua benda di dunia terbuat dari 118 jenis atom!',
  'Garam dapur berasal dari logam reaktif + gas beracun!',
  'Klik kartu mana saja untuk langsung bereksperimen.',
  'Coba rakit air (H2O) dan garam (NaCl) di Combine Challenge!',
];

export function HomeHubPage({ onNavigate }) {
  const [hoverSide, setHoverSide] = useState('idle');
  const [quipIdx, setQuipIdx] = useState(0);

  const handleGo = (page) => {
    SFX.click();
    onNavigate(page);
  };

  const handlePetMascot = () => {
    SFX.pop(6);
    setHoverSide('happy');
    setQuipIdx((i) => (i + 1) % QUIPS.length);
  };

  return (
    <div className="ua-home-stage">
      <section
        className="ua-mode-column ua-stagger-1"
        aria-label="Learning Mode"
        onMouseEnter={() => setHoverSide('left')}
        onMouseLeave={() => setHoverSide('idle')}
      >
        <div className="ua-mode-header is-learning">Learning Mode</div>
        <div className="ua-mode-body">
          <article className="ua-hub-card ua-stagger-1">
            <div className="ua-hub-icon-box">
              <MiniTableIcon />
            </div>
            <div className="ua-hub-content">
              <h2 className="ua-stroke-title ua-stroke-blue">Tabel Learning</h2>
              <p className="ua-hub-desc">
                Klik unsur untuk melihat wujud nyata, susunan atomnya, dan cerita di balik tabel periodik.
              </p>
              <TactileAmberButton onClick={() => handleGo('table')}>
                Mulai
              </TactileAmberButton>
            </div>
          </article>

          <article className="ua-hub-card ua-stagger-2">
            <div className="ua-hub-icon-box">
              <img
                src={FIGMA_ASSETS.atomLabIcon}
                alt="Ikon Atom Lab"
                width={68}
                height={77}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="ua-hub-content">
              <h2 className="ua-stroke-title ua-stroke-amber">Atom Lab</h2>
              <p className="ua-hub-desc">
                Rakit atommu secara langsung! Amati orbit elektron bergerak dan uji kestabilan inti atom.
              </p>
              <TactileAmberButton onClick={() => handleGo('lab')}>
                Mulai
              </TactileAmberButton>
            </div>
          </article>
        </div>
      </section>

      <div className="ua-mascot-center ua-stagger-2" style={{ flexDirection: 'column', gap: 8, paddingTop: 72 }}>
        <button
          type="button"
          onClick={handlePetMascot}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}
          aria-label="Sapa maskot UtakAtik"
        >
          <img
            src={FIGMA_ASSETS.utakAtikWordmark}
            alt="UtakAtik"
            width={286}
            height={107}
            style={{ display: 'block', marginBottom: -4, filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.06))' }}
          />
          <MascotHead size={208} mood={hoverSide} trackCursor />
        </button>

        <div
          style={{
            background: '#ffffff',
            border: '2px solid #ffe7b0',
            borderRadius: 16,
            padding: '8px 14px',
            fontSize: 12.5,
            fontWeight: 600,
            color: '#1b1a18',
            textAlign: 'center',
            maxWidth: 256,
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          }}
        >
          {hoverSide === 'left'
            ? 'Mulai dari mengenal unsur di Learning Mode!'
            : hoverSide === 'right'
            ? 'Uji ketangkasanmu di Challenge Mode!'
            : QUIPS[quipIdx]}
        </div>
      </div>

      <section
        className="ua-mode-column ua-stagger-3"
        aria-label="Challenge Mode"
        onMouseEnter={() => setHoverSide('right')}
        onMouseLeave={() => setHoverSide('idle')}
      >
        <div className="ua-mode-header is-challenge">Challenge Mode</div>
        <div className="ua-mode-body">
          <article className="ua-hub-card ua-stagger-3">
            <div className="ua-hub-icon-box">
              <img
                src={FIGMA_ASSETS.combineIcon}
                alt="Ikon Combine Challenge"
                width={88}
                height={50}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="ua-hub-content">
              <h2 className="ua-stroke-title ua-stroke-pink">
                Combine
                <br />
                Challange
              </h2>
              <p className="ua-hub-desc">
                Bangun dua atom dan lihat animasi reaksi saat keduanya bergabung menjadi Garam atau Air!
              </p>
              <TactileAmberButton onClick={() => handleGo('combine')}>
                Mulai
              </TactileAmberButton>
            </div>
          </article>

          <article className="ua-hub-card ua-stagger-4">
            <div className="ua-hub-icon-box" style={{ position: 'relative' }}>
              <img
                src={FIGMA_ASSETS.battleLayer1}
                alt=""
                width={60}
                height={64}
                style={{ position: 'absolute', bottom: 4, right: 6 }}
              />
              <img
                src={FIGMA_ASSETS.battleLayer2}
                alt="Ikon Atom Battle"
                width={60}
                height={71}
                style={{ position: 'absolute', top: 2, left: 6 }}
              />
            </div>
            <div className="ua-hub-content">
              <h2 className="ua-stroke-title ua-stroke-coral">Atom Battle</h2>
              <p className="ua-hub-desc">
                Tantangan kuis berhadiah skor combo &amp; pencapaian topik seputar proton, isotop, dan ikatan.
              </p>
              <TactileAmberButton onClick={() => handleGo('battle')}>
                Mulai
              </TactileAmberButton>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

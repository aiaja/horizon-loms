import { useState } from 'react';
import { ELEMENTS_BY_Z, PERIODIC_TILES } from '../data/elements';
import { FIGMA_ASSETS } from '../assets/figmaAssets';
import { AtomControlPanel } from '../components/AtomControlPanel';
import { AtomCanvasCard } from '../components/AtomCanvasCard';
import { ElementFlashcard } from '../components/ElementFlashcard';
import { MascotHead } from '../components/MascotHead';
import { ParticleBurst } from '../components/ParticleBurst';
import { TactileAmberButton } from '../components/TactileButton';
import { SFX } from '../utils/sfx';

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export function AtomLabPage({ initialAtom, onGoChallenge }) {
  const start = initialAtom || { protons: 12, neutrons: 12, electrons: 12 };
  const [atom, setAtom] = useState(start);
  const [visitedLi, setVisitedLi] = useState(start.protons === 3);
  const [missions, setMissions] = useState({
    liToBe: false,
    hydrogen: start.protons === 1 && start.electrons === 1,
    isotope: false,
    naIon: start.protons === 11 && start.electrons < 11,
  });
  const [burstKey, setBurstKey] = useState(0);

  const curElement = ELEMENTS_BY_Z[atom.protons] || null;
  const mainMiniTiles = PERIODIC_TILES.filter((t) => t.row !== null && !t.isRange);

  const checkMissions = (next) => {
    const el = ELEMENTS_BY_Z[next.protons];
    const nextVisitedLi = visitedLi || next.protons === 3;
    if (nextVisitedLi && !visitedLi) setVisitedLi(true);

    setMissions((prev) => {
      const updated = {
        liToBe: prev.liToBe || (nextVisitedLi && next.protons === 4),
        hydrogen: prev.hydrogen || (next.protons === 1 && next.electrons === 1),
        isotope: prev.isotope || Boolean(el && next.neutrons !== el.neutrons),
        naIon: prev.naIon || (next.protons === 11 && next.electrons > 0 && next.electrons < 11),
      };
      const prevCount = Object.values(prev).filter(Boolean).length;
      const nextCount = Object.values(updated).filter(Boolean).length;
      if (nextCount > prevCount) {
        SFX.success();
        setBurstKey((b) => b + 1);
      }
      return updated;
    });
  };

  const handleAdjust = (key, delta) => {
    setAtom((prev) => {
      const next = {
        ...prev,
        [key]: key === 'protons'
          ? clamp(prev[key] + delta, 1, 118)
          : clamp(prev[key] + delta, 0, 180),
      };
      checkMissions(next);
      return next;
    });
  };

  const handlePluckElectron = () => {
    SFX.remove();
    handleAdjust('electrons', -1);
  };

  const handleSelectMiniTile = (tile) => {
    SFX.pop((tile.z % 16) + 1);
    const next = { protons: tile.z, neutrons: tile.neutrons, electrons: tile.z };
    setAtom(next);
    checkMissions(next);
  };

  const handleRandomElement = () => {
    const popular = [1, 2, 3, 6, 8, 11, 12, 14, 17, 25, 29, 53, 79];
    const pickZ = popular[Math.floor(Math.random() * popular.length)];
    const targetEl = ELEMENTS_BY_Z[pickZ];
    SFX.pop(pickZ % 16);
    const next = { protons: targetEl.z, neutrons: targetEl.neutrons, electrons: targetEl.z };
    setAtom(next);
    checkMissions(next);
  };

  const handleReset = () => {
    setAtom(initialAtom || { protons: 12, neutrons: 12, electrons: 12 });
  };

  const missionList = [
    { key: 'liToBe', text: 'Ubah Litium (#3) menjadi Berilium (#4) dengan mengubah Proton.' },
    { key: 'hydrogen', text: 'Bangun atom Hidrogen netral (1 Proton, 1 Elektron).' },
    { key: 'isotope', text: 'Bandingkan dua isotop dari unsur yang sama (ubah Neutron).' },
    { key: 'naIon', text: 'Buat ion positif Natrium (Na+) dengan elektron lebih sedikit.' },
  ];

  const completedCount = Object.values(missions).filter(Boolean).length;

  return (
    <div className="ua-view-enter">
      <div className="ua-lab-grid">
        <AtomControlPanel
          title="Atom Lab"
          protons={atom.protons}
          neutrons={atom.neutrons}
          electrons={atom.electrons}
          onAdjust={handleAdjust}
        />

        <AtomCanvasCard
          element={curElement}
          protons={atom.protons}
          neutrons={atom.neutrons}
          electrons={atom.electrons}
          onReset={handleReset}
          onPluckElectron={handlePluckElectron}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          <ElementFlashcard key={curElement ? curElement.z : 'none'} element={curElement} />

          <div
            style={{
              width: '100%',
              background: '#fff',
              borderRadius: 16,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#707070' }}>Klik Unsur / Acak</span>
              <button
                type="button"
                onClick={handleRandomElement}
                style={{
                  border: '1.5px solid #feb300',
                  background: '#fff7e6',
                  color: '#6b4b00',
                  borderRadius: 14,
                  padding: '3px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                Acak Unsur
              </button>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
                gap: 2,
              }}
              aria-label="Peta mini tabel periodik"
            >
              {mainMiniTiles.map((tile) => {
                const isMatch = tile.z === atom.protons;
                return (
                  <button
                    key={tile.z}
                    type="button"
                    onClick={() => handleSelectMiniTile(tile)}
                    title={`${tile.nameId} (${tile.sym})`}
                    style={{
                      gridColumn: tile.col,
                      gridRow: tile.row,
                      aspectRatio: '1 / 1',
                      border: 'none',
                      borderRadius: 2,
                      padding: 0,
                      overflow: 'hidden',
                      fontSize: 5.5,
                      fontWeight: 700,
                      color: '#fff',
                      background: isMatch ? '#feb300' : tile.bg,
                      opacity: isMatch ? 1 : 0.36,
                      transform: isMatch ? 'scale(1.28)' : 'none',
                      zIndex: isMatch ? 2 : 1,
                    }}
                  >
                    {tile.sym}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="ua-lab-bottom">
        <div className="ua-card" style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
          <ParticleBurst burstKey={burstKey} />
          <MascotHead size={126} mood={completedCount === 4 ? 'happy' : 'idle'} />
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#000' }}>
              Challange! ({completedCount}/4)
            </h3>
            {missionList.map((m) => {
              const done = missions[m.key];
              return (
                <div key={m.key} className={`ua-mission-row ${done ? 'is-done' : ''}`}>
                  {done ? (
                    <img src={FIGMA_ASSETS.checkGreenIcon} alt="Selesai" width={24} height={24} />
                  ) : (
                    <span className="ua-mission-dot" aria-hidden="true" />
                  )}
                  <span>{m.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ua-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#000' }}>
              {completedCount === 4 ? 'Selamat!' : 'Eksplorasi Aktif'}
            </h3>
            <div style={{ background: '#f3faec', borderRadius: 12, padding: 14, fontSize: 15, lineHeight: '23px', color: '#1b1a18' }}>
              {completedCount === 4
                ? 'Luar biasa! Kamu sudah menguasai peran dasar Proton (identitas), Neutron (massa/isotop), dan Elektron (muatan & ikatan).'
                : `Selesaikan misi di kiri atau eksperimen bebas. Kamu sudah menyelesaikan ${completedCount} dari 4 misi!`}
            </div>
          </div>
          <TactileAmberButton onClick={() => { SFX.click(); onGoChallenge(); }} fullWidth>
            Lanjut ke Challange
          </TactileAmberButton>
        </div>
      </div>
    </div>
  );
}

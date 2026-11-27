import { useState } from 'react';
import { FIGMA_ASSETS } from '../assets/figmaAssets';
import { getElectronShells } from '../data/elements';
import { TactileAmberButton } from './TactileButton';
import { BohrAtom } from './BohrAtom';
import { SFX } from '../utils/sfx';

function getAtomPhysicsStatus(element, protons, neutrons, electrons) {
  if (!element) {
    return {
      isUnstable: false,
      ionBadge: `${protons}p`,
      observation: `Pengamatan: Konfigurasi ${protons} Proton, ${neutrons} Neutron, dan ${electrons} Elektron.`,
    };
  }
  const charge = protons - electrons;
  const chargeTxt =
    charge === 0
      ? 'netral'
      : charge > 0
      ? `bermuatan ion positif (+${charge})`
      : `bermuatan ion negatif (${charge})`;
  const diffN = Math.abs(neutrons - element.neutrons);
  const isUnstable = diffN >= 4 || (protons > 1 && neutrons === 0);
  const isotopeTxt =
    diffN === 0
      ? `dengan isotop umum (${element.sym}-${protons + neutrons})`
      : isUnstable
      ? `dengan isotop ${element.sym}-${protons + neutrons} yang tidak stabil (bergetar)!`
      : `dengan variasi isotop ${element.sym}-${protons + neutrons}`;

  const signStr = charge === 0 ? '' : charge > 0 ? (charge === 1 ? '⁺' : `${charge}⁺`) : charge === -1 ? '⁻' : `${Math.abs(charge)}⁻`;
  return {
    isUnstable,
    ionBadge: `${element.sym}${signStr}`,
    observation: `Pengamatan: Atom ${element.nameId} ${chargeTxt} ${isotopeTxt}`,
  };
}

export function AtomCanvasCard({ element, protons, neutrons, electrons, onReset, onPluckElectron }) {
  const [orbitPlaying, setOrbitPlaying] = useState(true);
  const physics = getAtomPhysicsStatus(element, protons, neutrons, electrons);
  const shells = getElectronShells(electrons);
  const valence = shells[shells.length - 1] || 0;

  return (
    <div className="ua-canvas-card">
      <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              background: '#f3f2f2',
              borderRadius: 20,
              padding: '5px 12px',
              fontSize: 13,
              fontWeight: 800,
              color: '#1b1a18',
            }}
          >
            Simbol: {physics.ionBadge}
          </span>
          <span
            style={{
              background: '#fff7e6',
              border: '1.5px solid #fec233',
              borderRadius: 20,
              padding: '4px 11px',
              fontSize: 12,
              fontWeight: 700,
              color: '#6b4b00',
            }}
          >
            Valensi: {valence} e⁻
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => { SFX.click(); setOrbitPlaying((p) => !p); }}
            className="ua-nav-tab"
            style={{ minHeight: 40, padding: '6px 14px', fontSize: 13 }}
          >
            {orbitPlaying ? 'Jeda Orbit' : 'Putar Orbit'}
          </button>
          <TactileAmberButton
            onClick={() => { SFX.click(); onReset(); }}
            withArrow={false}
            leftIcon={FIGMA_ASSETS.resetIcon}
          >
            Reset
          </TactileAmberButton>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 280 }}>
        <BohrAtom
          protons={protons}
          neutrons={neutrons}
          electrons={electrons}
          size={285}
          animateOrbit={orbitPlaying}
          isUnstable={physics.isUnstable}
          onElectronClick={onPluckElectron}
        />
        {onPluckElectron && electrons > 0 && (
          <div style={{ fontSize: 11.5, color: '#707070', fontWeight: 600, marginTop: 4 }}>
            Tips: Klik langsung elektron emas terluar untuk melepaskannya!
          </div>
        )}
      </div>

      <div
        className="ua-obs-banner"
        style={{ background: physics.isUnstable ? '#f5c1c1' : '#ffe7b0' }}
      >
        {physics.observation}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { FIGMA_ASSETS } from '../assets/figmaAssets';
import { SFX } from '../utils/sfx';

const STEPS = [1, 3, 5, 10];

export function AtomControlPanel({
  title = 'Atom Lab',
  protons,
  neutrons,
  electrons,
  onAdjust,
}) {
  const [mode, setMode] = useState('add');
  const sign = mode === 'add' ? 1 : -1;
  const prefix = mode === 'add' ? '+' : '-';

  const groups = [
    { key: 'protons', label: 'Proton (+)', cls: 'is-proton', val: protons },
    { key: 'neutrons', label: 'Neutron (0)', cls: 'is-neutron', val: neutrons },
    { key: 'electrons', label: 'Elektron (-)', cls: 'is-electron', val: electrons },
  ];

  const handleStep = (g, amt) => {
    if (mode === 'add') SFX.pop((g.val + amt) % 24);
    else SFX.remove();
    onAdjust(g.key, sign * amt);
  };

  return (
    <div className="ua-controls-card">
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, lineHeight: '26px', color: '#000' }}>
        {title}
      </h2>

      <div className="ua-counters-row" style={{ gap: 8 }}>
        <div className="ua-counter-box">
          <span className="lbl">Proton</span>
          <span className="val" style={{ color: '#fc6e48' }}>{protons}</span>
        </div>
        <div className="ua-counter-box">
          <span className="lbl">Neutron</span>
          <span className="val" style={{ color: '#8bbfe7' }}>{neutrons}</span>
        </div>
        <div className="ua-counter-box">
          <span className="lbl">Elektron</span>
          <span className="val" style={{ color: '#8885d2' }}>{electrons}</span>
        </div>
      </div>

      <div className="ua-mode-toggle" role="group" aria-label="Mode tambah atau kurang partikel">
        <button
          type="button"
          onClick={() => { SFX.click(); setMode('sub'); }}
          className={`ua-mode-toggle-btn ${mode === 'sub' ? 'is-on' : 'is-off'}`}
          aria-pressed={mode === 'sub'}
        >
          <img
            src={mode === 'sub' ? FIGMA_ASSETS.minusWhiteIcon : FIGMA_ASSETS.minusDarkIcon}
            alt=""
            width={20}
            height={20}
          />
          <span>Kurang</span>
        </button>
        <button
          type="button"
          onClick={() => { SFX.click(); setMode('add'); }}
          className={`ua-mode-toggle-btn ${mode === 'add' ? 'is-on' : 'is-off'}`}
          aria-pressed={mode === 'add'}
        >
          <span>Tambah</span>
          <img
            src={mode === 'add' ? FIGMA_ASSETS.plusWhiteIcon : FIGMA_ASSETS.plusDarkIcon}
            alt=""
            width={22}
            height={22}
          />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {groups.map((g) => (
          <div key={g.key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#000' }}>{g.label}</div>
            <div className="ua-step-pills">
              {STEPS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleStep(g, amt)}
                  className={`ua-step-pill ${g.cls}`}
                  aria-label={`${mode === 'add' ? 'Tambah' : 'Kurang'} ${amt} ${g.label}`}
                >
                  {prefix}{amt}x
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

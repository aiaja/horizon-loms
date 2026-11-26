import { useEffect, useRef, useState } from 'react';
import {
  CATEGORY_THEMES,
  ELEMENTS_BY_Z,
  LEGEND_ORDER,
  PERIODIC_TILES,
  getElectronShells,
} from '../data/elements';
import { BohrAtom } from '../components/BohrAtom';
import { ElementFlashcard } from '../components/ElementFlashcard';
import { TactileAmberButton } from '../components/TactileButton';
import { EverydayVisual } from '../components/EverydayVisual';
import { SFX } from '../utils/sfx';

export function TabelLearningPage({ onOpenInLab }) {
  const [selectedZ, setSelectedZ] = useState(14);
  const [hoveredTile, setHoveredTile] = useState(null);
  const [activeCat, setActiveCat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tripletTab, setTripletTab] = useState('macro');
  const [macroActive, setMacroActive] = useState(false);

  // biar angka proton sama neutronnya jalan halus tiap ganti unsur di tabel
  const element = ELEMENTS_BY_Z[selectedZ] || ELEMENTS_BY_Z[14];
  const [dispCounts, setDispCounts] = useState({ p: element.z, n: element.neutrons, e: element.z });
  const dispRef = useRef({ p: element.z, n: element.neutrons });

  useEffect(() => {
    const startP = dispRef.current.p;
    const startN = dispRef.current.n;
    const targetP = element.z;
    const targetN = element.neutrons;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const k = reduced ? 1 : Math.min(1, (now - t0) / 300);
      const ease = 1 - Math.pow(1 - k, 3);
      const next = {
        p: Math.round(startP + (targetP - startP) * ease),
        n: Math.round(startN + (targetN - startN) * ease),
        e: Math.round(startP + (targetP - startP) * ease),
      };
      dispRef.current = { p: next.p, n: next.n };
      setDispCounts(next);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [element.z, element.neutrons]);

  const theme = CATEGORY_THEMES[element.cat] || CATEGORY_THEMES.unknown;
  const shells = getElectronShells(element.z);
  const q = searchQuery.trim().toLowerCase();

  const mainTiles = PERIODIC_TILES.filter((t) => t.row !== null);
  const lanthanides = PERIODIC_TILES.filter((t) => !t.isRange && t.fRow === 1);
  const actinides = PERIODIC_TILES.filter((t) => !t.isRange && t.fRow === 2);

  const matchesFilter = (tile) => {
    if (activeCat && tile.cat !== activeCat) return false;
    if (!q) return true;
    if (tile.isRange) return false;
    return (
      tile.sym.toLowerCase().includes(q) ||
      tile.nameId.toLowerCase().includes(q) ||
      tile.enName.toLowerCase().includes(q) ||
      String(tile.z) === q
    );
  };

  const handleTileClick = (tile) => {
    const targetZ = tile.isRange ? (tile.label === '57-71' ? 57 : 89) : tile.z;
    SFX.pop((targetZ % 12) + 1);
    setSelectedZ(targetZ);
    setMacroActive(false);
  };

  const spotlights = [
    { z: 14, label: 'Si · Microchip' },
    { z: 11, label: 'Na · Garam' },
    { z: 12, label: 'Mg · Kembang Api' },
    { z: 8, label: 'O · Air & Napas' },
    { z: 53, label: 'I · Antiseptik' },
  ];

  return (
    <div className="ua-view-enter">
      <section className="ua-card" aria-label="Tabel Periodik Interaktif">
        <div className="ua-search-row">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari unsur (mis. Emas, Na, 14)..."
              className="ua-search-input"
              aria-label="Cari unsur di tabel periodik"
            />
            {spotlights.map((sp) => (
              <button
                key={sp.z}
                type="button"
                onClick={() => { SFX.pop(sp.z % 10); setSelectedZ(sp.z); setMacroActive(false); }}
                style={{
                  minHeight: 34,
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: selectedZ === sp.z ? '2px solid #1b1a18' : '2px solid #e9e8e7',
                  background: selectedZ === sp.z ? '#ffe7b0' : '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#1b1a18',
                }}
              >
                {sp.label}
              </button>
            ))}
          </div>

          <div
            style={{
              minHeight: 34,
              display: 'inline-flex',
              alignItems: 'center',
              background: '#f3f2f2',
              borderRadius: 20,
              padding: '5px 14px',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#1b1a18',
            }}
          >
            {hoveredTile && !hoveredTile.isRange
              ? `Sorot: #${hoveredTile.z} ${hoveredTile.nameId} (${hoveredTile.sym}) · ${CATEGORY_THEMES[hoveredTile.cat]?.label}`
              : `Aktif: #${element.z} ${element.nameId} (${element.sym}) · Klik ubin mana saja`}
          </div>
        </div>

        <div className="ua-legend-wrap" role="group" aria-label="Filter kategori unsur">
          {LEGEND_ORDER.map((catId) => {
            const cat = CATEGORY_THEMES[catId];
            const isSelected = activeCat === catId;
            const isDimmed = activeCat && !isSelected;
            return (
              <button
                key={catId}
                type="button"
                onClick={() => { SFX.click(); setActiveCat(isSelected ? null : catId); }}
                className={`ua-legend-pill ${isSelected ? 'is-selected' : ''} ${isDimmed ? 'is-dimmed' : ''}`}
                style={{ background: cat.pillBg }}
                aria-pressed={isSelected}
              >
                <span className="ua-legend-dot" style={{ background: cat.dot }} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="ua-ptable-scroll">
          <div className="ua-ptable-grid">
            {mainTiles.map((tile, idx) => {
              const isSelected = !tile.isRange && tile.z === selectedZ;
              const isDimmed = !matchesFilter(tile);
              return (
                <button
                  key={tile.isRange ? `range-${idx}` : tile.z}
                  type="button"
                  onClick={() => handleTileClick(tile)}
                  onMouseEnter={() => setHoveredTile(tile)}
                  onMouseLeave={() => setHoveredTile(null)}
                  className={`ua-ptile ${tile.isRange ? 'is-range' : ''} ${isSelected ? 'is-active' : ''} ${isDimmed ? 'is-dimmed' : ''}`}
                  style={{ gridColumn: tile.col, gridRow: tile.row, background: tile.bg }}
                  aria-label={tile.isRange ? `Rentang ${tile.label}` : `${tile.nameId}, nomor atom ${tile.z}`}
                  aria-pressed={isSelected}
                >
                  {tile.isRange ? (
                    <span style={{ fontSize: 10, fontWeight: 700 }}>{tile.label}</span>
                  ) : (
                    <>
                      <span className="ua-ptile-num">{tile.z}</span>
                      <span className="ua-ptile-sym">{tile.sym}</span>
                      <span className="ua-ptile-name">{tile.enName}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <div className="ua-fblock-grid">
            {[...lanthanides, ...actinides].map((tile) => {
              const isSelected = tile.z === selectedZ;
              const isDimmed = !matchesFilter(tile);
              return (
                <button
                  key={tile.z}
                  type="button"
                  onClick={() => handleTileClick(tile)}
                  onMouseEnter={() => setHoveredTile(tile)}
                  onMouseLeave={() => setHoveredTile(null)}
                  className={`ua-ptile ${isSelected ? 'is-active' : ''} ${isDimmed ? 'is-dimmed' : ''}`}
                  style={{ gridColumn: tile.fCol, gridRow: tile.fRow, background: tile.bg }}
                  aria-label={`${tile.nameId}, nomor atom ${tile.z}`}
                  aria-pressed={isSelected}
                >
                  <span className="ua-ptile-num">{tile.z}</span>
                  <span className="ua-ptile-sym">{tile.sym}</span>
                  <span className="ua-ptile-name">{tile.enName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ua-detail-layout" aria-label={`Detail unsur ${element.nameId}`}>
        <div className="ua-detail-main">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
              <div className="ua-element-square" style={{ background: theme.bg }}>
                <span style={{ fontSize: 10, fontWeight: 600 }}>{element.z}</span>
                <span style={{ fontSize: 36, fontWeight: 800, lineHeight: '42px' }}>{element.sym}</span>
                <span style={{ fontSize: 10, fontWeight: 600 }}>{element.enName}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                <div className="ua-legend-pill" style={{ background: theme.pillBg, cursor: 'default' }}>
                  <span className="ua-legend-dot" style={{ background: theme.dot }} />
                  <span>{theme.label}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, lineHeight: '36px', color: '#000' }}>
                  {element.nameId} ({element.sym}) (#{element.z})
                </h2>
                <div style={{ fontSize: 12, color: '#1b1a18' }}>
                  Periode {element.period} · Golongan {element.group} · Massa Atom ≈ {element.mass}
                </div>
              </div>
            </div>
          </div>

          <div className="ua-triplet-tabs" role="tablist" aria-label="Tingkat Pemahaman Johnstone">
            {[
              ['macro', '1. Nampak Mata (Makro)'],
              ['micro', '2. Atom & Kulit (Partikel)'],
              ['symbol', '3. Makna Simbol'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                onClick={() => { SFX.click(); setTripletTab(id); }}
                className={`ua-triplet-tab ${tripletTab === id ? 'is-active' : ''}`}
                aria-selected={tripletTab === id}
              >
                {label}
              </button>
            ))}
          </div>

          {tripletTab === 'macro' && (
            <>
              <div
                className="ua-everyday-panel"
                style={{
                  background: theme.lightCardBg,
                  borderColor: theme.bg,
                  boxShadow: `0 4px 0 ${theme.bg}`,
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#000' }}>
                    Wujud Nyata: {element.everydayItem}
                  </div>
                  <button
                    type="button"
                    onClick={() => { SFX.pop(5); setMacroActive((a) => !a); }}
                    style={{
                      minHeight: 34,
                      padding: '4px 12px',
                      borderRadius: 20,
                      border: `2px solid ${theme.bg}`,
                      background: macroActive ? theme.bg : '#ffffff',
                      color: macroActive ? '#ffffff' : '#1b1a18',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {macroActive ? 'Kembalikan Wujud' : `Simulasikan Sifat ${element.sym}`}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 14,
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease',
                      transform: macroActive ? 'scale(1.12) rotate(-6deg)' : 'none',
                      boxShadow: macroActive ? `0 0 0 6px ${theme.pillBg}` : 'none',
                    }}
                  >
                    <EverydayVisual iconKey={element.iconKey} size={52} />
                  </div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: '23px', color: '#1b1a18' }}>
                    {element.everyday}
                  </p>
                </div>
              </div>

              <div className="ua-info-panel">
                <div style={{ fontSize: 16, fontWeight: 700, color: '#000' }}>
                  Mengapa Sifatnya Seperti Ini?
                </div>
                <p style={{ margin: 0, fontSize: 15, lineHeight: '24px', color: '#1b1a18' }}>
                  {element.why}
                </p>
              </div>
            </>
          )}

          {tripletTab === 'micro' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="ua-counters-row">
                <div className="ua-counter-box">
                  <span className="lbl">Proton (+)</span>
                  <span className="val" style={{ color: '#fc6e48' }}>{dispCounts.p}</span>
                </div>
                <div className="ua-counter-box">
                  <span className="lbl">Neutron (0)</span>
                  <span className="val" style={{ color: '#8bbfe7' }}>{dispCounts.n}</span>
                </div>
                <div className="ua-counter-box">
                  <span className="lbl">Elektron (-)</span>
                  <span className="val" style={{ color: '#8885d2' }}>{dispCounts.e}</span>
                </div>
              </div>
              <div className="ua-info-panel">
                <div style={{ fontSize: 16, fontWeight: 700, color: '#000' }}>
                  Susunan Kulit Elektron ({shells.join(' · ')})
                </div>
                <p style={{ margin: 0, fontSize: 15, lineHeight: '23px', color: '#1b1a18' }}>
                  Terdapat <strong>{shells.length}</strong> lapisan kulit elektron mengitari inti. Kulit terluarnya berisi{' '}
                  <strong>{shells[shells.length - 1]} elektron valensi</strong> yang menentukan cara {element.nameId} bereaksi!
                </p>
              </div>
            </div>
          )}

          {tripletTab === 'symbol' && (
            <div className="ua-info-panel" style={{ background: '#f8f7f5' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    background: '#ffffff',
                    border: `3px solid ${theme.bg}`,
                    borderRadius: 14,
                    padding: '12px 18px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#707070' }}>Massa {element.mass}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: theme.bg, lineHeight: 1.1 }}>{element.sym}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1b1a18' }}>Proton {element.z}</div>
                </div>
                <div style={{ flex: 1, minWidth: 220, fontSize: 14.5, lineHeight: '22px', color: '#1b1a18' }}>
                  <div><strong>Huruf {element.sym}</strong> diambil dari nama ilmiah <em>{element.enName}</em>.</div>
                  <div><strong>Angka {element.z}</strong> adalah tanda tangan unik jumlah Proton di inti.</div>
                  <div><strong>Angka ≈ {element.mass}</strong> adalah jumlah Proton + Neutron (inti atom).</div>
                </div>
              </div>
            </div>
          )}

          <div>
            <TactileAmberButton onClick={() => { SFX.click(); onOpenInLab(element); }}>
              Uji Langsung di Atom Lab
            </TactileAmberButton>
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <ElementFlashcard key={element.z} element={element} />
          <div style={{ background: '#fff', borderRadius: 24, padding: 16, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <BohrAtom protons={element.z} neutrons={element.neutrons} electrons={element.z} size={230} />
          </div>
        </aside>
      </section>
    </div>
  );
}

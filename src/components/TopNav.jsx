import { useState } from 'react';
import { FIGMA_ASSETS } from '../assets/figmaAssets';
import { isBgmEnabled, isSfxMuted, SFX, toggleBgm, toggleSfxMute } from '../utils/sfx';

const TABS = [
  { id: 'table', label: 'Tabel Learning' },
  { id: 'lab', label: 'Atom Lab' },
  { id: 'combine', label: 'Combine Challange' },
  { id: 'battle', label: 'Atom Battle' },
];

export function TopNav({ page, onNavigate }) {
  const [muted, setMuted] = useState(() => isSfxMuted());
  const [bgmOn, setBgmOn] = useState(() => isBgmEnabled());

  const handleNav = (id) => {
    SFX.click();
    onNavigate(id);
  };

  const handleToggleAudio = () => {
    const nextMuted = toggleSfxMute();
    setMuted(nextMuted);
    if (!nextMuted) SFX.pop(4);
  };

  const handleToggleBgm = () => {
    const nextBgm = toggleBgm();
    setBgmOn(nextBgm);
    SFX.click();
  };

  return (
    <div className="ua-topnav-wrap" style={{ gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      <nav className="ua-topnav" aria-label="Navigasi Utama UtakAtik">
        <button
          type="button"
          onClick={() => handleNav('home')}
          aria-label="Beranda UtakAtik"
          className="ua-btn-amber-outer no-white-ring"
          aria-current={page === 'home' ? 'page' : undefined}
        >
          <span className="ua-btn-amber-inner" style={{ padding: '8px 16px 12px' }}>
            <img src={FIGMA_ASSETS.homeIcon} alt="" width={24} height={24} />
          </span>
        </button>

        {TABS.map((t) => {
          const isActive = page === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleNav(t.id)}
              className={`ua-nav-tab ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={handleToggleBgm}
          className="ua-sfx-pill"
          aria-pressed={bgmOn}
          aria-label={bgmOn ? 'Matikan musik latar' : 'Nyalakan musik latar'}
          style={{
            background: bgmOn ? '#ffe7b0' : '#ffffff',
            borderColor: bgmOn ? '#feb300' : '#e9e8e7',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" fill="currentColor" />
            <circle cx="18" cy="16" r="3" fill="currentColor" />
            {!bgmOn && <line x1="2" y1="2" x2="22" y2="22" stroke="#de3838" strokeWidth="2.4" />}
          </svg>
          <span>{bgmOn ? 'Musik' : 'Bisu'}</span>
        </button>

        <button
          type="button"
          onClick={handleToggleAudio}
          className="ua-sfx-pill"
          aria-pressed={!muted}
          aria-label={muted ? 'Aktifkan efek suara' : 'Bisukan efek suara'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
            {muted ? (
              <path d="M22 9l-6 6M16 9l6 6" />
            ) : (
              <>
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M19 5a9 9 0 0 1 0 14" />
              </>
            )}
          </svg>
          <span>{muted ? 'Hening' : 'SFX'}</span>
        </button>
      </div>
    </div>
  );
}

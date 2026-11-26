import { useEffect, useState } from 'react';
import { TopNav } from './components/TopNav';
import { HomeHubPage } from './pages/HomeHubPage';
import { TabelLearningPage } from './pages/TabelLearningPage';
import { AtomLabPage } from './pages/AtomLabPage';
import { CombineChallengePage } from './pages/CombineChallengePage';
import { AtomBattlePage } from './pages/AtomBattlePage';
import { ensureBgmStarted, stopBgmLoop } from './utils/sfx';

export function App() {
  const [page, setPage] = useState('home');
  const [labSeed, setLabSeed] = useState(null);

  //bgm baru jalan pas user klik atau pencet keyboard pertama kali biar ga kena blokir autoplay browser
  useEffect(() => {
    const unlock = () => {
      ensureBgmStarted();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      stopBgmLoop();
    };
  }, []);

  const handleOpenElementInLab = (el) => {
    setLabSeed({
      key: `${el.z}-${Date.now()}`,
      protons: el.z,
      neutrons: el.neutrons,
      electrons: el.z,
    });
    setPage('lab');
  };

  const handleNavigate = (nextPage) => {
    if (nextPage !== 'lab') {
      setLabSeed(null);
    }
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ua-app-shell">
      <div className="ua-container">
        <TopNav page={page} onNavigate={handleNavigate} />

        <main>
          {page === 'home' && <HomeHubPage onNavigate={handleNavigate} />}
          {page === 'table' && <TabelLearningPage onOpenInLab={handleOpenElementInLab} />}
          {page === 'lab' && (
            <AtomLabPage
              key={labSeed ? labSeed.key : 'default-lab'}
              initialAtom={labSeed}
              onGoChallenge={() => handleNavigate('combine')}
            />
          )}
          {page === 'combine' && (
            <CombineChallengePage onGoBattle={() => handleNavigate('battle')} />
          )}
          {page === 'battle' && (
            <AtomBattlePage onGoHome={() => handleNavigate('home')} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

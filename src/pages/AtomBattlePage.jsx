import { useState } from 'react';
import { BATTLE_PROGRESS_TRACKS, QUIZ_QUESTIONS } from '../data/challenges';
import { FIGMA_ASSETS } from '../assets/figmaAssets';
import { MascotHead } from '../components/MascotHead';
import { ParticleBurst } from '../components/ParticleBurst';
import { TactileAmberButton } from '../components/TactileButton';
import { SFX } from '../utils/sfx';

export function AtomBattlePage({ onGoHome }) {
  const [qIdx, setQIdx] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [masteredTracks, setMasteredTracks] = useState([]);
  const [finished, setFinished] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [floatingPts, setFloatingPts] = useState(null);

  const q = QUIZ_QUESTIONS[qIdx];
  const hasAnswered = selectedOpt !== null;
  const isCorrect = selectedOpt === q.correctIndex;

  const mascotMood = finished
    ? hearts > 0
      ? 'happy'
      : 'shocked'
    : !hasAnswered
    ? 'idle'
    : isCorrect
    ? 'happy'
    : 'shocked';

  const handleSelectOption = (idx) => {
    if (hasAnswered || finished) return;
    setSelectedOpt(idx);
    if (idx === q.correctIndex) {
      const nextCombo = combo + 1;
      const earned = 100 * nextCombo;
      SFX.success();
      setCorrectCount((c) => c + 1);
      setCombo(nextCombo);
      setBestCombo((b) => Math.max(b, nextCombo));
      setPoints((p) => p + earned);
      setBurstKey((k) => {
        const nextK = k + 1;
        setFloatingPts({ id: nextK, val: `+${earned}` });
        return nextK;
      });
      setMasteredTracks((prev) => (prev.includes(q.trackId) ? prev : [...prev, q.trackId]));
    } else {
      SFX.wrong();
      setCombo(0);
      setFloatingPts(null);
      setHearts((h) => Math.max(0, h - 1));
    }
  };

  const handleNextQuestion = () => {
    SFX.click();
    if (hearts === 0 || qIdx >= QUIZ_QUESTIONS.length - 1) {
      setFinished(true);
      setFloatingPts(null);
      if (hearts > 0) {
        SFX.success();
        setBurstKey((k) => k + 1);
      }
      return;
    }
    setQIdx((i) => i + 1);
    setSelectedOpt(null);
    setFloatingPts(null);
  };

  const handleRestart = () => {
    SFX.click();
    setQIdx(0);
    setHearts(3);
    setSelectedOpt(null);
    setCorrectCount(0);
    setPoints(0);
    setCombo(0);
    setBestCombo(0);
    setMasteredTracks([]);
    setFinished(false);
    setFloatingPts(null);
  };

  const accuracyPct = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
  const progressBarPct = finished ? 100 : Math.round(((qIdx + (hasAnswered ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100);
  const circ = 2 * Math.PI * 44;

  return (
    <div className="ua-battle-grid ua-view-enter">
      <div className="ua-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24 }}>
        <ParticleBurst burstKey={burstKey} />
        {floatingPts && (
          <div key={floatingPts.id} className="ua-float-score">
            {floatingPts.val} pts
          </div>
        )}

        {!finished ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#000' }}>
                    Challange!
                  </h2>
                  {combo >= 2 && (
                    <span className="ua-combo-pill">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#e7a300" aria-hidden="true">
                        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
                      </svg>
                      <span>Combo x{combo}</span>
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }} aria-label={`Nyawa tersisa: ${hearts} dari 3`}>
                    {[0, 1, 2].map((i) => (
                      <img
                        key={i}
                        src={i < hearts ? FIGMA_ASSETS.heartRedIcon : FIGMA_ASSETS.heartGrayIcon}
                        alt=""
                        width={24}
                        height={24}
                        style={{
                          transition: 'transform 0.25s ease, opacity 0.25s ease',
                          transform: i < hearts ? 'scale(1)' : 'scale(0.85)',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ background: '#e9e8e7', borderRadius: 44, padding: '5px 12px', fontSize: 14, fontWeight: 700, color: '#1b1a18' }}>
                    {qIdx + 1}/{QUIZ_QUESTIONS.length}
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', height: 8, background: '#f3f2f2', borderRadius: 10, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progressBarPct}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #fec233, #89cb3e)',
                    borderRadius: 10,
                    transition: 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                />
              </div>

              <p key={q.id} className="ua-view-enter" style={{ margin: 0, fontSize: 18, fontWeight: 600, lineHeight: '27px', color: '#000' }}>
                {q.prompt}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {q.options.map((optText, idx) => {
                  let stateCls = '';
                  if (hasAnswered) {
                    if (idx === q.correctIndex) stateCls = 'is-correct';
                    else if (idx === selectedOpt) stateCls = 'is-wrong';
                  }
                  return (
                    <button
                      key={`${q.id}-${idx}`}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`ua-option-btn ${stateCls}`}
                    >
                      {optText}
                    </button>
                  );
                })}
              </div>

              {hasAnswered && (
                <div
                  className="ua-view-enter"
                  style={{
                    background: isCorrect ? '#f3faec' : '#fde8e8',
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 14,
                    lineHeight: '21px',
                    color: '#1b1a18',
                  }}
                >
                  <strong>{isCorrect ? 'Tepat sekali!' : 'Hampir benar.'}</strong> {q.explanation}
                </div>
              )}
            </div>

            <TactileAmberButton onClick={handleNextQuestion} disabled={!hasAnswered} fullWidth>
              {hearts === 0
                ? 'Lihat Hasil'
                : qIdx >= QUIZ_QUESTIONS.length - 1
                ? 'Selesai & Lihat Skor'
                : 'Soal Selanjutnya'}
            </TactileAmberButton>
          </>
        ) : (
          <div className="ua-view-enter" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 24, flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#000' }}>
                {hearts > 0 ? 'Pertempuran Selesai!' : 'Kesempatan Habis'}
              </h2>

              <div
                style={{
                  background: hearts > 0 ? '#f3faec' : '#fff7e6',
                  borderRadius: 20,
                  padding: 20,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 20,
                }}
              >
                <svg width="108" height="108" viewBox="0 0 108 108" aria-label={`Akurasi ${accuracyPct} persen`}>
                  <circle cx="54" cy="54" r="44" fill="none" stroke="#ffffff" strokeWidth="10" />
                  <circle
                    cx="54"
                    cy="54"
                    r="44"
                    fill="none"
                    stroke={hearts > 0 ? '#89cb3e' : '#fec233'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - accuracyPct / 100)}
                    transform="rotate(-90 54 54)"
                    style={{ transition: 'stroke-dashoffset 0.7s ease-out' }}
                  />
                  <text x="54" y="59" textAnchor="middle" fontSize="20" fontWeight="800" fill="#1b1a18">
                    {accuracyPct}%
                  </text>
                </svg>

                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#1b1a18' }}>
                    {points} Poin
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#474643', marginTop: 4 }}>
                    {correctCount} dari {QUIZ_QUESTIONS.length} Benar · Combo Tertinggi x{Math.max(1, bestCombo)}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <TactileAmberButton onClick={handleRestart}>Main Lagi</TactileAmberButton>
              <button
                type="button"
                onClick={() => { SFX.click(); onGoHome(); }}
                className="ua-nav-tab"
                style={{ minHeight: 48, background: '#f3f2f2', color: '#1b1a18' }}
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}
      </div>

      <aside className="ua-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#000' }}>Progress</h3>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#6b4b00', background: '#ffe7b0', padding: '4px 10px', borderRadius: 20 }}>
              {points} pts
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BATTLE_PROGRESS_TRACKS.map((tr) => {
              const done = masteredTracks.includes(tr.id);
              return (
                <div
                  key={tr.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 14px',
                    borderRadius: 16,
                    background: done ? '#f3faec' : '#ffffff',
                    fontSize: 15,
                    color: '#1b1a18',
                    transition: 'background-color 0.25s ease',
                  }}
                >
                  <img
                    src={done ? FIGMA_ASSETS.checkGreenIcon : FIGMA_ASSETS.checkGrayIcon}
                    alt={done ? 'Tercapai' : 'Belum'}
                    width={24}
                    height={24}
                  />
                  <span>{tr.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, borderTop: '2px solid #f3f2f2' }}>
          <MascotHead size={64} mood={mascotMood} />
          <div style={{ fontSize: 12.5, lineHeight: '18px', color: '#474643', fontWeight: 600 }}>
            {mascotMood === 'happy'
              ? 'Mantap! Pertahankan kombinasi jawaban benar!'
              : mascotMood === 'shocked'
              ? 'Tenang, baca lagi penjelasan konsepnya di kiri!'
              : 'Baca petunjuknya baik-baik sebelum memilih.'}
          </div>
        </div>
      </aside>
    </div>
  );
}

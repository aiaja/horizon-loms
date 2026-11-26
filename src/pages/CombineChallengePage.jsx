import { useEffect, useState } from 'react';
import { CATEGORY_THEMES, ELEMENTS_BY_Z } from '../data/elements';
import { COMBINE_CHALLENGES } from '../data/challenges';
import { FIGMA_ASSETS } from '../assets/figmaAssets';
import { AtomControlPanel } from '../components/AtomControlPanel';
import { AtomCanvasCard } from '../components/AtomCanvasCard';
import { ElementFlashcard } from '../components/ElementFlashcard';
import { EverydayVisual } from '../components/EverydayVisual';
import { ParticleBurst } from '../components/ParticleBurst';
import { TactileAmberButton } from '../components/TactileButton';
import { SFX } from '../utils/sfx';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const makeInitialSlots = (challengeIdx) => {
  const ch = COMBINE_CHALLENGES[challengeIdx];
  return ch.slots.map((s, idx) =>
    idx === 0
      ? { protons: Math.max(1, s.targetZ - 1), neutrons: Math.max(0, s.allowNeutrons[0] - 1), electrons: Math.max(1, s.targetZ - 1) }
      : { protons: Math.max(1, s.targetZ - 2), neutrons: Math.max(0, s.allowNeutrons[0] - 2), electrons: Math.max(1, s.targetZ - 2) }
  );
};

function ReactionCinemaModal({ challenge, onNext, onClose }) {
  const [phaseP, setPhaseP] = useState(0);
  const [replayNonce, setReplayNonce] = useState(0);
  const [burstKey, setBurstKey] = useState(0);

  const el0 = ELEMENTS_BY_Z[challenge.slots[0].targetZ];
  const el1 = ELEMENTS_BY_Z[challenge.slots[1].targetZ];
  const t0 = CATEGORY_THEMES[el0.cat];
  const t1 = CATEGORY_THEMES[el1.cat];
  const isCovalent = challenge.reactionType === 'covalent';

  useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    let zapped = false;
    let celebrated = false;
    const start = performance.now();
    const duration = 2200;

    const tick = (now) => {
      const p = reduced ? 1 : clamp01((now - start) / duration);
      setPhaseP(p);
      if (!zapped && p >= 0.38) {
        zapped = true;
        SFX.zap();
      }
      if (!celebrated && p >= 0.72) {
        celebrated = true;
        SFX.success();
        setBurstKey((b) => b + 1);
      }
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [replayNonce]);

  const showResultCard = phaseP >= 0.72;
  const resultOpacity = clamp01((phaseP - 0.72) / 0.25);

  // gerak parabola elektron pas lompat dari atom kiri ke kanan (reaksi ionik)
  const flyT = easeInOutCubic(clamp01(phaseP / 0.38));
  const [ex, ey] = [
    lerp(118, 242, flyT),
    lerp(95, 95, flyT) - Math.sin(flyT * Math.PI) * 52,
  ];
  const snapT = easeOutCubic(clamp01((phaseP - 0.40) / 0.30));
  const leftX = lerp(82, 148, snapT);
  const rightX = lerp(278, 212, snapT);

  //animasi ikatan air dibikin agak bengkok sekitar 104 derajat bukan lurus soalnya bentuk molekul H2O emang sudut gitu
  const hLeftX = lerp(62, 134, easeOutCubic(clamp01(phaseP / 0.65)));
  const hRightX = lerp(298, 226, easeOutCubic(clamp01(phaseP / 0.65)));
  const hY = lerp(62, 118, easeOutCubic(clamp01(phaseP / 0.65)));

  return (
    <div className="ua-modal-backdrop" role="dialog" aria-modal="true" aria-label={`Senyawa ${challenge.compoundName} berhasil dibuat`}>
      <div className="ua-compound-modal" style={{ position: 'relative' }}>
        <ParticleBurst burstKey={burstKey} />

        <div
          style={{
            background: '#ffffff',
            borderRadius: 32,
            padding: '24px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            {[el0, el1].map((el, idx) => {
              const th = CATEGORY_THEMES[el.cat];
              return (
                <div key={el.sym} style={{ display: 'contents' }}>
                  <div className="ua-element-square" style={{ width: 84, height: 84, background: th.bg, padding: '8px 10px' }}>
                    <span style={{ fontSize: 9 }}>{el.z}</span>
                    <span style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.05 }}>{el.sym}</span>
                    <span style={{ fontSize: 8.5 }}>{el.enName}</span>
                  </div>
                  {idx === 0 && <img src={FIGMA_ASSETS.plusBigIcon} alt="+" width={30} height={30} />}
                </div>
              );
            })}
            <span style={{ fontSize: 30, fontWeight: 800 }}>=</span>
          </div>

          {!showResultCard ? (
            <div
              style={{
                width: '100%',
                borderRadius: 18,
                background: '#f8fafc',
                border: '2px solid #e9e8e7',
                padding: 12,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f766e', marginBottom: 4 }}>
                {isCovalent
                  ? 'Berbagi Elektron Kovalen Membentuk Sudut 104.5°...'
                  : phaseP < 0.40
                  ? `Elektron valensi ${el0.sym} melompat ke ${el1.sym}...`
                  : `Ion ${el0.sym}⁺ & ${el1.sym}⁻ saling tarik elektrostatik!`}
              </div>

              <svg viewBox="0 0 360 185" style={{ width: '100%', height: 180 }}>
                {!isCovalent ? (
                  <>
                    <path
                      d="M 118 95 Q 180 43 242 95"
                      fill="none"
                      stroke="#fec233"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      opacity={phaseP < 0.42 ? 0.95 : 0}
                    />
                    <g transform={`translate(${leftX}, 95)`}>
                      <circle cx={0} cy={0} r={lerp(36, 28, flyT)} fill="none" stroke={t0.bg} strokeWidth="2" opacity={lerp(1, 0.35, flyT)} />
                      <circle cx={0} cy={0} r={20} fill={t0.bg} />
                      <text x={0} y={5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">
                        {phaseP > 0.36 ? `${el0.sym}⁺` : el0.sym}
                      </text>
                    </g>
                    <g transform={`translate(${rightX}, 95)`}>
                      <circle cx={0} cy={0} r={lerp(36, 40, flyT)} fill="none" stroke={t1.bg} strokeWidth="2.5" />
                      <circle cx={0} cy={0} r={22} fill={t1.bg} />
                      <text x={0} y={5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">
                        {phaseP > 0.38 ? `${el1.sym}⁻` : el1.sym}
                      </text>
                      {phaseP >= 0.38 && (
                        <circle cx={-38} cy={0} r={6.5} fill="#feb300" stroke="#fff" strokeWidth="1.5" />
                      )}
                    </g>
                    {phaseP < 0.38 && (
                      <circle cx={ex} cy={ey} r={7.5} fill="#feb300" stroke="#fff" strokeWidth="2" />
                    )}
                    {phaseP > 0.48 && (
                      <circle
                        cx={180}
                        cy={95}
                        r={lerp(12, 64, snapT)}
                        fill="none"
                        stroke="#feb300"
                        strokeWidth="3"
                        opacity={(1 - snapT).toFixed(2)}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <line x1={180} y1={72} x2={hLeftX} y2={hY} stroke="#8bbfe7" strokeWidth="5" strokeLinecap="round" opacity={clamp01(phaseP * 2)} />
                    <line x1={180} y1={72} x2={hRightX} y2={hY} stroke="#8bbfe7" strokeWidth="5" strokeLinecap="round" opacity={clamp01(phaseP * 2)} />
                    <circle cx={180} cy={72} r={28} fill="#fc6e48" stroke="#fff" strokeWidth="2.5" />
                    <text x={180} y={77} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="800">O</text>
                    <circle cx={hLeftX} cy={hY} r={18} fill="#00936d" stroke="#fff" strokeWidth="2" />
                    <text x={hLeftX} y={hY + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">H</text>
                    <circle cx={hRightX} cy={hY} r={18} fill="#00936d" stroke="#fff" strokeWidth="2" />
                    <text x={hRightX} y={hY + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">H</text>
                  </>
                )}
              </svg>
            </div>
          ) : (
            <div style={{ transform: 'rotate(-2.5deg)', width: '100%', maxWidth: 320, opacity: resultOpacity, transition: 'opacity 0.25s ease' }}>
              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid #8bbfe7',
                  borderBottomWidth: 8,
                  borderRadius: 16,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ background: '#f3f2f2', borderRadius: 8, padding: '18px 16px', fontSize: 24, fontWeight: 800, color: '#141414' }}>
                    {challenge.formula}
                  </div>
                  <div style={{ fontSize: 19, fontWeight: 700, lineHeight: '25px', color: '#1b1a18' }}>
                    {challenge.compoundName}
                  </div>
                </div>
                <div style={{ background: '#f3f2f2', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <EverydayVisual iconKey={challenge.iconKey} size={72} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1b1a18' }}>
                    {challenge.everydayName}
                  </span>
                </div>
              </div>
            </div>
          )}

          <p style={{ margin: 0, fontSize: 13, lineHeight: '20px', color: '#474643', textAlign: 'center' }}>
            {challenge.whyMixed}
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => { SFX.click(); setReplayNonce((r) => r + 1); }}
              className="ua-nav-tab"
              style={{ minHeight: 40, fontSize: 13, padding: '6px 14px' }}
            >
              Putar Ulang Proses
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ua-nav-tab"
              style={{ minHeight: 40, fontSize: 13, padding: '6px 14px' }}
            >
              Tutup
            </button>
          </div>
        </div>

        <TactileAmberButton onClick={() => { SFX.click(); onNext(); }}>
          Lanjut Misi Berikutnya
        </TactileAmberButton>
      </div>
    </div>
  );
}

export function CombineChallengePage({ onGoBattle }) {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [activeSlot, setActiveSlot] = useState(0);
  const [slots, setSlots] = useState(() => makeInitialSlots(0));
  const [clueOpen, setClueOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [showSolvedModal, setShowSolvedModal] = useState(false);
  const [solvedMap, setSolvedMap] = useState({});

  const challenge = COMBINE_CHALLENGES[challengeIdx];
  const curAtom = slots[activeSlot];
  const curElement = ELEMENTS_BY_Z[curAtom.protons] || null;

  const isSlotSolved = (slotIdx) => {
    const built = slots[slotIdx];
    const target = challenge.slots[slotIdx];
    return built.protons === target.targetZ;
  };

  const bothSolved = isSlotSolved(0) && isSlotSolved(1);

  const switchChallenge = (idx) => {
    SFX.click();
    setChallengeIdx(idx);
    setActiveSlot(0);
    setSlots(makeInitialSlots(idx));
    setClueOpen(false);
    setFeedbackMsg('');
    setShowSolvedModal(false);
  };

  const handleAdjust = (key, delta) => {
    setFeedbackMsg('');
    setSlots((prev) =>
      prev.map((item, idx) =>
        idx === activeSlot
          ? {
              ...item,
              [key]:
                key === 'protons'
                  ? clamp(item[key] + delta, 1, 118)
                  : clamp(item[key] + delta, 0, 180),
            }
          : item
      )
    );
  };

  const handleResetSlot = () => {
    const fresh = makeInitialSlots(challengeIdx);
    setFeedbackMsg('');
    setSlots((prev) => prev.map((it, idx) => (idx === activeSlot ? fresh[idx] : it)));
  };

  const handleAutoBuildHintedSlot = () => {
    SFX.pop(8);
    const target = challenge.slots[activeSlot];
    const targetEl = ELEMENTS_BY_Z[target.targetZ];
    setSlots((prev) =>
      prev.map((it, idx) =>
        idx === activeSlot
          ? { protons: target.targetZ, neutrons: targetEl.neutrons, electrons: target.targetZ }
          : it
      )
    );
    setFeedbackMsg('');
  };

  const handleCheckOrNext = () => {
    if (bothSolved) {
      setSolvedMap((m) => ({ ...m, [challenge.id]: true }));
      setShowSolvedModal(true);
      setFeedbackMsg('');
      return;
    }
    SFX.wrong();
    const need0 = !isSlotSolved(0) ? `${challenge.slots[0].nameId} (#${challenge.slots[0].targetZ})` : null;
    const need1 = !isSlotSolved(1) ? `${challenge.slots[1].nameId} (#${challenge.slots[1].targetZ})` : null;
    const missing = [need0, need1].filter(Boolean).join(' dan ');
    setFeedbackMsg(`Belum cocok. Sesuaikan jumlah Proton untuk: ${missing}.`);
    if (!isSlotSolved(0)) setActiveSlot(0);
    else if (!isSlotSolved(1)) setActiveSlot(1);
  };

  const handleModalNext = () => {
    setShowSolvedModal(false);
    if (challengeIdx < COMBINE_CHALLENGES.length - 1) {
      switchChallenge(challengeIdx + 1);
    } else {
      onGoBattle();
    }
  };

  return (
    <div className="ua-view-enter">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
        {COMBINE_CHALLENGES.map((ch, idx) => {
          const isSolved = Boolean(solvedMap[ch.id]);
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => switchChallenge(idx)}
              className={`ua-nav-tab ${idx === challengeIdx ? 'is-active' : ''}`}
              style={{
                minHeight: 40,
                fontSize: 14,
                padding: '6px 16px',
                background: idx === challengeIdx ? '#fff' : isSolved ? '#f3faec' : '#dddcd9',
                borderColor: isSolved && idx !== challengeIdx ? '#89cb3e' : undefined,
              }}
            >
              {isSolved ? '✓ ' : ''}{idx + 1}. {ch.formula} ({ch.everydayName})
            </button>
          );
        })}
      </div>

      <div className="ua-combine-eq">
        {[0, 1].map((idx) => {
          const slotTarget = challenge.slots[idx];
          const builtEl = ELEMENTS_BY_Z[slots[idx].protons];
          const solved = isSlotSolved(idx);
          const isEditing = activeSlot === idx;
          const badgeTheme = builtEl ? CATEGORY_THEMES[builtEl.cat] : CATEGORY_THEMES.unknown;

          return (
            <div key={slotTarget.sym} style={{ display: 'contents' }}>
              <button
                type="button"
                onClick={() => { SFX.click(); setActiveSlot(idx); }}
                className={`ua-slot-card ${isEditing ? 'is-active' : ''} ${solved ? 'is-solved' : ''}`}
                aria-label={`Edit Atom ${idx + 1}: target ${slotTarget.nameId}`}
              >
                <div
                  className="ua-element-square"
                  style={{ width: 92, height: 92, background: badgeTheme.bg, padding: '8px 10px' }}
                >
                  <span style={{ fontSize: 9, fontWeight: 600 }}>{builtEl ? builtEl.z : '?'}</span>
                  <span style={{ fontSize: 32, fontWeight: 800, lineHeight: '36px' }}>
                    {builtEl ? builtEl.sym : '?'}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 600 }}>{builtEl ? builtEl.enName : 'Atur Proton'}</span>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: solved ? '#61902c' : '#707070', marginBottom: 2 }}>
                    {solved ? 'Cocok' : `Target: ${slotTarget.nameId} (#${slotTarget.targetZ})`}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#000', lineHeight: '26px' }}>
                    {builtEl ? `${builtEl.nameId} (${builtEl.sym}) (#${builtEl.z})` : `Proton ${slots[idx].protons}`}
                  </div>
                </div>
              </button>

              {idx === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={FIGMA_ASSETS.plusBigIcon} alt="+" width={36} height={36} />
                </div>
              )}
            </div>
          );
        })}

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 800, padding: '0 4px' }}>
          =
        </div>

        <div className="ua-target-pill-card">
          <div
            style={{
              background: '#f3f2f2',
              borderRadius: 8,
              padding: '10px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <EverydayVisual iconKey={challenge.iconKey} size={40} />
            <span style={{ fontSize: 20, fontWeight: 800, color: '#141414' }}>{challenge.formula}</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: '28px', color: '#1b1a18' }}>
            {challenge.compoundName}
          </div>
        </div>
      </div>

      <div className="ua-lab-grid">
        <AtomControlPanel
          title={`Combine: Atom ${activeSlot + 1}`}
          protons={curAtom.protons}
          neutrons={curAtom.neutrons}
          electrons={curAtom.electrons}
          onAdjust={handleAdjust}
        />

        <AtomCanvasCard
          element={curElement}
          protons={curAtom.protons}
          neutrons={curAtom.neutrons}
          electrons={curAtom.electrons}
          onReset={handleResetSlot}
        />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ElementFlashcard key={curElement ? curElement.z : 'none'} element={curElement} />

            <div className="ua-clue-box">
              <button
                type="button"
                className="ua-clue-btn"
                onClick={() => { SFX.click(); setClueOpen((o) => !o); }}
                aria-expanded={clueOpen}
              >
                <span>Clue?</span>
                <img
                  src={FIGMA_ASSETS.chevronIcon}
                  alt=""
                  width={24}
                  height={24}
                  style={{ transform: clueOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s ease' }}
                />
              </button>
              {clueOpen && (
                <div className="ua-clue-body">
                  <p style={{ margin: '0 0 10px' }}>{challenge.hint}</p>
                  <button
                    type="button"
                    onClick={handleAutoBuildHintedSlot}
                    style={{
                      background: '#fff',
                      border: '1px solid #e7a300',
                      borderRadius: 20,
                      padding: '4px 12px',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#6b4b00',
                    }}
                  >
                    Terapkan target {challenge.slots[activeSlot].sym} ke Atom {activeSlot + 1}
                  </button>
                </div>
              )}
            </div>

            {feedbackMsg && (
              <div style={{ background: '#fde8e8', border: '2px solid #de3838', borderRadius: 12, padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#9e2828' }}>
                {feedbackMsg}
              </div>
            )}
          </div>

          <TactileAmberButton
            onClick={handleCheckOrNext}
            fullWidth
            leftIcon={FIGMA_ASSETS.saveSolidIcon}
          >
            {bothSolved ? 'Gabungkan!' : 'Cek & Lanjut'}
          </TactileAmberButton>
        </div>
      </div>

      {showSolvedModal && (
        <ReactionCinemaModal
          challenge={challenge}
          onNext={handleModalNext}
          onClose={() => setShowSolvedModal(false)}
        />
      )}
    </div>
  );
}

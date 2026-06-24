'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ── Budget data ───────────────────────────────────────────────────────────
type CityData = {
  slug: string; name: string;
  crous: [number, number]; coloc: [number, number];
  studio: [number, number]; habitant: [number, number];
  transport: number; food: number;
};

const CITIES: CityData[] = [
  { slug: 'etudier-a-bordeaux',         name: 'Bordeaux',         crous: [180,380], coloc: [350,520], studio: [490,750],  habitant: [290,430], transport: 25, food: 260 },
  { slug: 'etudier-a-paris',            name: 'Paris',            crous: [280,500], coloc: [600,950], studio: [950,1500], habitant: [500,750], transport: 29, food: 350 },
  { slug: 'etudier-a-nantes',           name: 'Nantes',           crous: [180,350], coloc: [320,490], studio: [440,680],  habitant: [270,400], transport: 22, food: 220 },
  { slug: 'etudier-a-lyon',             name: 'Lyon',             crous: [200,400], coloc: [380,560], studio: [520,800],  habitant: [320,480], transport: 30, food: 260 },
  { slug: 'etudier-a-toulouse',         name: 'Toulouse',         crous: [200,400], coloc: [350,520], studio: [480,700],  habitant: [300,450], transport: 28, food: 230 },
  { slug: 'etudier-a-marseille',        name: 'Marseille',        crous: [180,380], coloc: [350,520], studio: [480,700],  habitant: [290,440], transport: 30, food: 250 },
  { slug: 'etudier-a-nice',             name: 'Nice',             crous: [200,420], coloc: [450,650], studio: [600,900],  habitant: [390,580], transport: 30, food: 290 },
  { slug: 'etudier-a-rennes',           name: 'Rennes',           crous: [180,370], coloc: [320,470], studio: [430,620],  habitant: [270,400], transport: 26, food: 210 },
  { slug: 'etudier-a-grenoble',         name: 'Grenoble',         crous: [180,380], coloc: [330,500], studio: [450,650],  habitant: [280,420], transport: 28, food: 220 },
  { slug: 'etudier-a-clermont-ferrand', name: 'Clermont-Ferrand', crous: [150,320], coloc: [270,400], studio: [350,520],  habitant: [220,340], transport: 22, food: 200 },
  { slug: 'etudier-a-montpellier',      name: 'Montpellier',      crous: [180,380], coloc: [360,530], studio: [500,720],  habitant: [300,450], transport: 26, food: 240 },
  { slug: 'etudier-a-strasbourg',       name: 'Strasbourg',       crous: [190,380], coloc: [340,500], studio: [480,680],  habitant: [290,430], transport: 29, food: 240 },
  { slug: 'etudier-a-lille',            name: 'Lille',            crous: [170,360], coloc: [310,460], studio: [420,620],  habitant: [260,390], transport: 27, food: 210 },
  { slug: 'etudier-a-dijon',            name: 'Dijon',            crous: [170,340], coloc: [290,430], studio: [380,550],  habitant: [240,360], transport: 24, food: 200 },
];

const mid = (range: [number, number]) => Math.round((range[0] + range[1]) / 2);

const TUITION_ANNUAL: Record<string, number> = {
  licence:  2895,
  master:   3941,
  doctorat: 397,
};
const CVEC_ANNUAL = 105;
const TUITION_MONTHLY_12: Record<string, number> = {
  licence:  241,
  master:   328,
  doctorat: 33,
};

const CAF_ESTIMATE: Record<string, { min: number; max: number }> = {
  crous:    { min: 150, max: 200 },
  coloc:    { min: 100, max: 180 },
  studio:   { min: 80,  max: 200 },
  habitant: { min: 0,   max: 80  },
};

const BOURSE_NOTE: Record<string, string> = {
  pays:   'Ta bourse nationale couvre tes frais de scolarité — la CAF française reste accessible selon ta situation.',
  eiffel: 'La bourse Eiffel (~1 181 €/mois) couvre la majorité de tes dépenses. Tu peux compléter avec la CAF.',
  aucune: 'Sans bourse, pense à demander la CAF dès ton arrivée et à vérifier ta situation CSS si tes revenus sont < 868 €/mois.',
};

// 6 questions — step 3 is the new paiement_frais step
const STEPS = ['Ville', 'Logement', 'Niveau', 'Paiement', 'Origine', 'Bourse'];

type Answers = {
  ville: string; logement: string; niveau: string;
  paiement_frais: string; pays: string; bourse: string;
};

// ── Style helpers ─────────────────────────────────────────────────────────
const card = (selected: boolean): React.CSSProperties => ({
  padding: 'clamp(12px,2vw,18px) clamp(14px,2vw,20px)',
  borderRadius: 14,
  border: selected ? '1.5px solid #4d8fff' : '1px solid rgba(255,255,255,0.09)',
  background: selected ? 'rgba(1,77,248,0.10)' : 'rgba(255,255,255,0.025)',
  boxShadow: selected ? '0 0 0 3px rgba(1,77,248,0.12)' : 'none',
  cursor: 'pointer', transition: 'all 0.18s ease',
  display: 'flex', alignItems: 'center', gap: 12,
  textAlign: 'left' as const, width: '100%',
});

const dot = (selected: boolean): React.CSSProperties => ({
  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
  border: selected ? '5px solid #4d8fff' : '2px solid rgba(255,255,255,0.25)',
  background: selected ? 'rgba(1,77,248,0.15)' : 'transparent',
  transition: 'all 0.18s ease',
});

// ── Main component ────────────────────────────────────────────────────────
export default function SimulateurBudget() {
  // steps: 0-5 = questions (6 total), 6 = email capture, 7 = results
  const [step,     setStep]     = useState(0);
  const [visible,  setVisible]  = useState(true);
  const [answers,  setAnswers]  = useState<Answers>({
    ville: '', logement: '', niveau: '', paiement_frais: '', pays: '', bourse: '',
  });
  const [email,    setEmail]    = useState('');
  const [sending,  setSending]  = useState(false);
  const [emailSent,setEmailSent]= useState(false);

  const STEP_KEYS: (keyof Answers)[] = ['ville', 'logement', 'niveau', 'paiement_frais', 'pays', 'bourse'];
  const currentKey = STEP_KEYS[step] as keyof Answers | undefined;
  const canNext = step < 6 && currentKey !== undefined && answers[currentKey] !== '';

  // ── Budget calculation ────────────────────────────────────────────────
  const city          = CITIES.find(c => c.slug === answers.ville);
  const logement      = answers.logement as 'crous' | 'coloc' | 'studio' | 'habitant';
  const niveau        = answers.niveau   as 'licence' | 'master' | 'doctorat';
  const paiementFrais = answers.paiement_frais; // 'unique' | 'mensuel'

  const housing       = city && logement ? mid(city[logement]) : 0;
  const transport     = city ? city.transport : 0;
  const food          = city ? city.food : 0;

  const tuitionAnnual = TUITION_ANNUAL[niveau] ?? 0;
  // CVEC = 105€/an paiement unique à la rentrée — pas mensuel
  const tuitionMonthly = paiementFrais === 'mensuel'
    ? (TUITION_MONTHLY_12[niveau] ?? 0)
    : 0;

  const baseTotal = housing + transport + food + 30 + 20 + 80;
  const total     = baseTotal + tuitionMonthly;

  const cafMin = logement ? CAF_ESTIMATE[logement]?.min ?? 0 : 0;
  const cafMax = logement ? CAF_ESTIMATE[logement]?.max ?? 0 : 0;
  const cafMid = Math.round((cafMin + cafMax) / 2);
  const reste  = Math.max(0, total - cafMid);

  const bourseNote = BOURSE_NOTE[answers.bourse] ?? '';

  // ── Navigation ────────────────────────────────────────────────────────
  const transition = (fn: () => void) => {
    setVisible(false);
    setTimeout(() => { fn(); setVisible(true); }, 180);
  };

  const goNext  = () => {
    if (step < 5) transition(() => setStep(s => s + 1));
    else transition(() => setStep(6)); // → email capture
  };
  const goBack  = () => { if (step > 0) transition(() => setStep(s => s - 1)); };
  const goReset = () => transition(() => {
    setStep(0);
    setAnswers({ ville: '', logement: '', niveau: '', paiement_frais: '', pays: '', bourse: '' });
    setEmail(''); setEmailSent(false); setSending(false);
  });
  const select = (key: keyof Answers, val: string) => setAnswers(a => ({ ...a, [key]: val }));

  // ── Email submission ──────────────────────────────────────────────────
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || sending) return;
    setSending(true);
    try {
      const payload = {
        email,
        ville:          answers.ville,
        logement:       answers.logement,
        niveau:         answers.niveau,
        paiement_frais: answers.paiement_frais,
        pays:           answers.pays,
        bourse:         answers.bourse,
        housing, food, transport,
        tuitionMonthly, tuitionAnnual,
        total, cafMid, reste,
      };
      console.log('[Simulateur] Envoi payload:', JSON.stringify(payload));

      const response = await fetch('/api/simulateur', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('🔵 Réponse API simulateur:', JSON.stringify(data));

      if (response.ok && data.ok) {
        setEmailSent(true);
        transition(() => setStep(7));
      } else {
        console.error('[Simulateur] Erreur API:', data);
        alert('Erreur envoi email — réessaie dans quelques secondes. (détails: ' + JSON.stringify(data) + ')');
      }
    } catch (error) {
      console.error('[Simulateur] Fetch error:', error);
      alert('Erreur réseau : ' + error);
    } finally {
      setSending(false);
    }
  };

  // ── Keyboard ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Enter' && canNext) goNext(); };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canNext, step]);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 clamp(16px,3vw,24px)' }}>

      {/* ── Questions (steps 0-5) ── */}
      {step < 6 && (
        <>
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.8)' }}>
                Étape {step + 1} sur 6 — {STEPS[step]}
              </span>
              {step > 0 && (
                <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                  ← Retour
                </button>
              )}
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2 }}>
              <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#014DF8,#4d8fff)', width: `${((step + 1) / 6) * 100}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>

          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.18s ease, transform 0.18s ease' }}>
            <StepContent step={step} answers={answers} select={select} />
          </div>

          <div className="sim-next-wrap" style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={goNext}
              disabled={!canNext}
              className="sim-next-btn"
              style={{
                padding: '14px 32px', borderRadius: 12,
                background: canNext ? 'linear-gradient(135deg,#014DF8,#4d8fff)' : 'rgba(255,255,255,0.07)',
                border: 'none', cursor: canNext ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: canNext ? '#fff' : 'rgba(255,255,255,0.25)',
                transition: 'all 0.2s ease',
                boxShadow: canNext ? '0 4px 24px rgba(1,77,248,0.35)' : 'none',
              }}
            >
              {step === 5 ? 'Voir mon budget →' : 'Suivant →'}
            </button>
          </div>
        </>
      )}

      {/* ── Email capture (step 6) ── */}
      {step === 6 && (
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.18s ease, transform 0.18s ease' }}>
          <EmailCaptureStep
            email={email} setEmail={setEmail}
            sending={sending} onSubmit={handleEmailSubmit}
            city={city} total={total}
          />
        </div>
      )}

      {/* ── Results (step 7) ── */}
      {step === 7 && (
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.18s ease, transform 0.18s ease' }}>
          {emailSent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, marginBottom: 24 }}>
              <span style={{ fontSize: '1rem' }}>📧</span>
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
                Budget envoyé sur <strong style={{ color: '#fff' }}>{email}</strong> — vérifie ta boîte (et les spams) !
              </span>
            </div>
          )}
          <ResultsPanel
            city={city} housing={housing} food={food} transport={transport}
            tuitionMonthly={tuitionMonthly} tuitionAnnual={tuitionAnnual}
            total={total} cafMin={cafMin} cafMax={cafMax} reste={reste}
            logement={logement} niveau={niveau} paiementFrais={paiementFrais}
            bourseNote={bourseNote} answers={answers} onReset={goReset}
          />
        </div>
      )}
    </div>
  );
}

// ── Email capture ─────────────────────────────────────────────────────────
function EmailCaptureStep({
  email, setEmail, sending, onSubmit, city, total,
}: {
  email: string; setEmail: (v: string) => void;
  sending: boolean; onSubmit: (e: React.FormEvent) => void;
  city: CityData | undefined; total: number;
}) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 40%, rgba(1,77,248,0.25) 0%, rgba(1,77,248,0.06) 100%)',
          border: '1px solid rgba(77,143,255,0.25)',
          boxShadow: '0 0 48px rgba(1,77,248,0.2)',
        }}>
          <span style={{ fontSize: '2.6rem' }}>🎉</span>
        </div>
      </div>

      {city && total > 0 && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', background: 'rgba(1,77,248,0.08)', border: '1px solid rgba(77,143,255,0.2)', borderRadius: 100, marginBottom: 20 }}>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
            Budget estimé à {city.name}
          </span>
          <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', letterSpacing: '0.04em', color: '#4d8fff' }}>
            {total} €/mois
          </span>
        </div>
      )}

      <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2rem,5vw,2.8rem)', letterSpacing: '0.04em', color: '#fff', margin: '0 0 16px', lineHeight: 1.1 }}>
        Ton budget est prêt !
      </h2>
      <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'clamp(0.9rem,1.8vw,1rem)', color: 'rgba(255,255,255,0.55)', margin: '0 0 36px', lineHeight: 1.75, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
        Entre ton email pour recevoir ton estimation complète en PDF + tous les guides dont tu as besoin pour préparer ton arrivée en France.
      </p>

      <form onSubmit={onSubmit} className="sim-email-form" style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="ton@email.com" required autoFocus disabled={sending}
          style={{
            width: '100%', maxWidth: 420, boxSizing: 'border-box',
            padding: '15px 20px', borderRadius: 12,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)',
            fontFamily: 'var(--font-dm-sans)', fontSize: '1rem', color: '#fff', outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(77,143,255,0.5)')}
          onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)')}
        />
        <button
          type="submit" disabled={sending || !email.includes('@')}
          style={{
            width: '100%', maxWidth: 420,
            padding: '15px 28px', borderRadius: 12,
            background: (sending || !email.includes('@')) ? 'rgba(255,255,255,0.07)' : 'linear-gradient(135deg,#014DF8,#4d8fff)',
            border: 'none', cursor: (sending || !email.includes('@')) ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-montserrat)', fontWeight: 700,
            fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: (sending || !email.includes('@')) ? 'rgba(255,255,255,0.3)' : '#fff',
            transition: 'all 0.2s ease',
            boxShadow: (sending || !email.includes('@')) ? 'none' : '0 4px 28px rgba(1,77,248,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          {sending ? (
            <>
              <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Préparation de ton budget…
            </>
          ) : 'Recevoir mon budget gratuit →'}
        </button>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @media (max-width: 640px) {
            .sim-next-wrap { justify-content: stretch !important; }
            .sim-next-btn  { width: 100% !important; justify-content: center !important; }
            .sim-city-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .sim-email-form { flex-direction: column !important; align-items: stretch !important; }
            .sim-email-form input, .sim-email-form button { max-width: 100% !important; width: 100% !important; }
          }
        `}</style>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)', margin: 0 }}>
          Gratuit · Pas de spam · Tu peux te désabonner à tout moment
        </p>
      </form>
    </div>
  );
}

// ── Step content ──────────────────────────────────────────────────────────
function StepContent({ step, answers, select }: {
  step: number; answers: Answers; select: (key: keyof Answers, val: string) => void;
}) {
  const h2Style: React.CSSProperties = { fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,2.6rem)', letterSpacing: '0.04em', color: '#fff', margin: '0 0 8px' };
  const subStyle: React.CSSProperties = { fontFamily: 'var(--font-dm-sans)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 28px' };

  // Step 0 — Ville
  if (step === 0) return (
    <div>
      <h2 style={h2Style}>Dans quelle ville tu veux étudier ?</h2>
      <p style={subStyle}>Le budget varie du simple au triple selon la ville.</p>
      <div className="sim-city-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
        {CITIES.map(c => (
          <button key={c.slug} onClick={() => select('ville', c.slug)} style={{ ...card(answers.ville === c.slug), flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
              <div style={dot(answers.ville === c.slug)} />
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.88rem', color: answers.ville === c.slug ? '#fff' : 'rgba(255,255,255,0.82)' }}>{c.name}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.38)', paddingLeft: 28 }}>{c.crous[0]}–{c.studio[1]} €/mois</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 1 — Logement
  if (step === 1) return (
    <div>
      <h2 style={h2Style}>Quel type de logement tu vises ?</h2>
      <p style={subStyle}>Le CROUS est le plus abordable — mais les places sont limitées.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { val: 'crous',    label: 'Résidence CROUS',  note: 'Le moins cher — places limitées, à demander très tôt' },
          { val: 'coloc',    label: 'Colocation',        note: 'Bon compromis budget/indépendance — très répandu chez les étudiants' },
          { val: 'studio',   label: 'Studio privé',      note: 'Plus cher mais plus de liberté — idéal si tu travailles' },
          { val: 'habitant', label: "Chez l'habitant",   note: "Rare en France — coût variable, peu d'offres sur le marché" },
        ].map(o => (
          <button key={o.val} onClick={() => select('logement', o.val)} style={card(answers.logement === o.val)}>
            <div style={dot(answers.logement === o.val)} />
            <div>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.95rem', color: answers.logement === o.val ? '#fff' : 'rgba(255,255,255,0.82)' }}>{o.label}</div>
              <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.42)', marginTop: 3 }}>{o.note}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 2 — Niveau d'études
  if (step === 2) return (
    <div>
      <h2 style={h2Style}>Quel est ton niveau d&apos;études ?</h2>
      <p style={subStyle}>Les frais d&apos;inscription varient de 397 € à 3 941 €/an selon le niveau.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { val: 'licence',  label: 'Licence (L1, L2, L3)', note: '2 895 €/an + CVEC 105 €/an · source : campusfrance.org 2025-2026' },
          { val: 'master',   label: 'Master (M1, M2)',       note: '3 941 €/an + CVEC 105 €/an · source : campusfrance.org 2025-2026' },
          { val: 'doctorat', label: 'Doctorat',              note: '397 €/an + CVEC 105 €/an · frais proches du tarif national' },
        ].map(o => (
          <button key={o.val} onClick={() => select('niveau', o.val)} style={card(answers.niveau === o.val)}>
            <div style={dot(answers.niveau === o.val)} />
            <div>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.95rem', color: answers.niveau === o.val ? '#fff' : 'rgba(255,255,255,0.82)' }}>{o.label}</div>
              <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.42)', marginTop: 3 }}>{o.note}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 3 — Paiement frais (NEW)
  if (step === 3) return (
    <div>
      <h2 style={h2Style}>Comment préfères-tu voir les frais d&apos;inscription ?</h2>
      <p style={subStyle}>
        En réalité, ces frais se paient en une seule fois à la rentrée.
        Choisis comment tu veux les visualiser dans ton budget.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          {
            val: 'unique',
            label: 'En paiement unique (une fois par an)',
            note: 'Les frais sont affichés séparément — vision la plus réaliste de ta trésorerie mensuelle',
            badge: 'Recommandé',
          },
          {
            val: 'mensuel',
            label: 'Répartis sur 12 mois (pour planifier)',
            note: 'Pratique pour calculer combien épargner chaque mois avant la rentrée',
            badge: null,
          },
        ].map(o => (
          <button key={o.val} onClick={() => select('paiement_frais', o.val)} style={card(answers.paiement_frais === o.val)}>
            <div style={dot(answers.paiement_frais === o.val)} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.95rem', color: answers.paiement_frais === o.val ? '#fff' : 'rgba(255,255,255,0.82)' }}>
                  {o.label}
                </span>
                {o.badge && (
                  <span style={{ padding: '2px 8px', borderRadius: 100, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#22C55E' }}>
                    {o.badge}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.42)', marginTop: 3 }}>{o.note}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 4 — Pays
  if (step === 4) return (
    <div>
      <h2 style={h2Style}>Tu viens de quel pays ?</h2>
      <p style={subStyle}>On personnalise les ressources selon ta procédure (Campus France, visa…).</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
        {[
          { val: 'maroc',       label: '🇲🇦 Maroc' },
          { val: 'algerie',     label: '🇩🇿 Algérie' },
          { val: 'tunisie',     label: '🇹🇳 Tunisie' },
          { val: 'senegal',     label: '🇸🇳 Sénégal' },
          { val: 'cote-ivoire', label: "🇨🇮 Côte d'Ivoire" },
          { val: 'cameroun',    label: '🇨🇲 Cameroun' },
          { val: 'autre',       label: '🌍 Autre pays' },
        ].map(o => (
          <button key={o.val} onClick={() => select('pays', o.val)} style={{ ...card(answers.pays === o.val), justifyContent: 'flex-start' }}>
            <div style={dot(answers.pays === o.val)} />
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.88rem', color: answers.pays === o.val ? '#fff' : 'rgba(255,255,255,0.82)' }}>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 5 — Bourse
  if (step === 5) return (
    <div>
      <h2 style={h2Style}>Tu as une bourse ?</h2>
      <p style={subStyle}>La situation de bourse impacte les aides disponibles et les frais.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { val: 'pays',   label: 'Boursier du gouvernement de mon pays', note: 'Bourse nationale (BGE, AMCI, MESRS…)' },
          { val: 'eiffel', label: 'Bourse Eiffel (gouvernement français)', note: '~1 181 €/mois, couvre la grande majorité des dépenses' },
          { val: 'aucune', label: 'Aucune bourse actuellement',            note: 'Tu finances tes études toi-même ou via ta famille' },
        ].map(o => (
          <button key={o.val} onClick={() => select('bourse', o.val)} style={card(answers.bourse === o.val)}>
            <div style={dot(answers.bourse === o.val)} />
            <div>
              <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.95rem', color: answers.bourse === o.val ? '#fff' : 'rgba(255,255,255,0.82)' }}>{o.label}</div>
              <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.42)', marginTop: 3 }}>{o.note}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return null;
}

// ── Results panel ─────────────────────────────────────────────────────────
function ResultsPanel({
  city, housing, food, transport,
  tuitionMonthly, tuitionAnnual,
  total, cafMin, cafMax, reste,
  logement, niveau, paiementFrais, bourseNote, answers, onReset,
}: {
  city: CityData | undefined;
  housing: number; food: number; transport: number;
  tuitionMonthly: number; tuitionAnnual: number;
  total: number; cafMin: number; cafMax: number; reste: number;
  logement: string; niveau: string; paiementFrais: string; bourseNote: string;
  answers: Answers; onReset: () => void;
}) {
  const PAYS_GUIDE: Record<string, { label: string; slug: string }> = {
    maroc:         { label: 'Étudier depuis le Maroc',          slug: 'etudier-en-france-depuis-le-maroc' },
    algerie:       { label: "Étudier depuis l'Algérie",         slug: 'etudier-en-france-depuis-algerie' },
    tunisie:       { label: 'Étudier depuis la Tunisie',        slug: 'etudier-en-france-depuis-tunisie' },
    senegal:       { label: 'Étudier depuis le Sénégal',        slug: 'etudier-en-france-depuis-senegal' },
    'cote-ivoire': { label: "Étudier depuis la Côte d'Ivoire",  slug: 'etudier-en-france-depuis-cote-ivoire' },
    cameroun:      { label: 'Étudier depuis le Cameroun',       slug: 'etudier-en-france-depuis-cameroun' },
  };
  const paysGuide = PAYS_GUIDE[answers.pays];

  const NIVEAU_LABELS: Record<string, string> = {
    licence: 'Licence hors UE', master: 'Master hors UE', doctorat: 'Doctorat',
  };
  const niveauLabel = NIVEAU_LABELS[niveau] ?? niveau;
  const logementLabel = logement === 'crous' ? 'CROUS' : logement === 'coloc' ? 'colocation' : logement === 'studio' ? 'studio privé' : "chez l'habitant";
  const isMensuel = paiementFrais === 'mensuel';
  const [showNet, setShowNet] = useState(true);

  const cafMid             = Math.round((cafMin + cafMax) / 2);
  const economieRU         = 70;
  const economieTransport  = Math.round(transport / 2);
  const economieCSS        = 40;
  const totalEconomies     = cafMid + economieRU + economieTransport + economieCSS;
  const netBudget          = Math.max(0, total - totalEconomies);

  const row = (label: string, value: string, sub?: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMensuel && sub ? 'flex-start' : 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div>
        <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.62)' }}>{label}</span>
        {sub && <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>{sub}</div>}
      </div>
      <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.95rem', color: 'rgba(255,255,255,0.82)', flexShrink: 0, marginLeft: 12 }}>{value}</span>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', padding: '4px 14px', border: '1px solid rgba(77,143,255,0.25)', borderRadius: 100, background: 'rgba(77,143,255,0.07)', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4d8fff' }}>
            Estimation personnalisée
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing: '0.04em', color: '#fff', margin: 0, lineHeight: 1.1 }}>
          Budget {isMensuel ? 'mensuel (tout compris)' : 'mensuel'} à {city?.name ?? ''}
        </h2>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', margin: '8px 0 0' }}>
          Estimation basée sur des données réelles — à affiner selon ta situation exacte.
        </p>

        {/* Toggle BRUT / NET */}
        <div style={{ display: 'inline-flex', borderRadius: 100, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', marginTop: 20, background: 'rgba(255,255,255,0.03)' }}>
          {[
            { label: 'Budget BRUT', active: !showNet, onClick: () => setShowNet(false) },
            { label: 'Budget NET ✓', active: showNet,  onClick: () => setShowNet(true)  },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={btn.onClick}
              style={{
                padding: '8px 18px',
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 700,
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                background: btn.active ? (btn.label.includes('NET') ? 'rgba(34,197,94,0.18)' : 'rgba(255,255,255,0.08)') : 'transparent',
                color: btn.active ? (btn.label.includes('NET') ? '#22c55e' : '#fff') : 'rgba(255,255,255,0.35)',
                transition: 'all 0.18s ease',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
        {showNet && (
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.72rem', color: 'rgba(34,197,94,0.7)', margin: '8px 0 0', lineHeight: 1.5 }}>
            Montant réel estimé après CAF, repas RU, transport réduit et CSS (santé gratuite).
          </p>
        )}
      </div>

      {/* ── Budget mensuel ── */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: 'clamp(20px,3vw,32px)', marginBottom: 20 }}>
        <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: '0 0 4px' }}>
          💰 {isMensuel ? 'Budget mensuel (tout compris)' : 'Dépenses mensuelles'}
        </p>
        {row(`Loyer (${logementLabel})`, `${housing} €`)}
        {row('Nourriture', `${food} €`)}
        {row('Transport', `${transport} €`)}
        {row('Téléphone', '30 €')}
        {row('Loisirs, divers & santé', '100 €')}
        {isMensuel && row(
          'Frais d\'inscription (÷12)',
          `${tuitionMonthly} €`,
          'pour planifier — se paient en 1 seule fois à la rentrée'
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 0' }}>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
            {showNet ? 'BUDGET NET ESTIMÉ' : 'TOTAL MENSUEL BRUT'}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            {showNet && (
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.28)', textDecoration: 'line-through' }}>
                {total} €
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: '2rem', letterSpacing: '0.04em', color: showNet ? '#22c55e' : '#4d8fff' }}>
              {showNet ? netBudget : total} €
            </span>
          </div>
        </div>

        {/* Savings breakdown when NET */}
        {showNet && (
          <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12 }}>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(34,197,94,0.7)', margin: '0 0 10px' }}>
              Aides déduites
            </p>
            {[
              { label: 'CAF / APL (estimation)', val: cafMid },
              { label: `Repas RU à 3,30 € (vs 8-12 €)`, val: economieRU },
              { label: `Abonnement transport (−50 %)`, val: economieTransport },
              { label: `CSS — santé gratuite`, val: economieCSS },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.78rem', color: '#22c55e' }}>−{item.val} €</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(34,197,94,0.2)', marginTop: 6 }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.78rem', color: '#22c55e' }}>Total économies</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.88rem', color: '#22c55e' }}>−{totalEconomies} €</span>
            </div>
          </div>
        )}
      </div>

      {/* ── CAF ── */}
      <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: 'clamp(20px,3vw,28px)', marginBottom: 20 }}>
        <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(34,197,94,0.8)', margin: '0 0 4px' }}>
          Aides estimées
        </p>
        {logement !== 'habitant' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>APL / CAF (estimation)</span>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.95rem', color: '#22C55E' }}>
                {cafMin > 0 ? `−${cafMin} à −${cafMax} €` : '−0 à −80 €'}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', margin: '0 0 12px', lineHeight: 1.6 }}>
              Estimation indicative — montant réel calculé sur{' '}
              <a href="https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/simulateur-de-droits" target="_blank" rel="noopener noreferrer" style={{ color: '#22C55E', textDecoration: 'underline' }}>caf.fr</a>.
            </p>
            <div style={{ height: 1, background: 'rgba(34,197,94,0.15)', marginBottom: 16 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>RESTE À FINANCER</span>
              <span style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: '2rem', letterSpacing: '0.04em', color: '#fff' }}>~{reste} €</span>
            </div>
          </>
        ) : (
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', margin: '8px 0 0' }}>
            Le logement chez l&apos;habitant est rarement éligible à l&apos;APL. Vérifie sur{' '}
            <a href="https://www.caf.fr" target="_blank" rel="noopener noreferrer" style={{ color: '#22C55E' }}>caf.fr</a>.
          </p>
        )}
      </div>

      {/* ── Frais d'inscription ── */}
      <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: 'clamp(20px,3vw,28px)', marginBottom: 20 }}>
        {isMensuel ? (
          <>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(167,139,250,0.9)', margin: '0 0 4px' }}>
              🎓 Frais d&apos;inscription — Répartis sur 12 mois
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 16px', lineHeight: 1.6 }}>
              Pour faciliter la planification de ton épargne avant la rentrée.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.62)' }}>{niveauLabel}</span>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)', display: 'block', marginTop: 2 }}>{tuitionAnnual} € ÷ 12</span>
                </div>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.95rem', color: 'rgba(255,255,255,0.82)' }}>{tuitionMonthly} €/mois</span>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: '11px 14px', background: 'rgba(77,143,255,0.06)', border: '1px solid rgba(77,143,255,0.18)', borderRadius: 8 }}>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: 'rgba(255,255,255,0.85)' }}>CVEC 105 €</strong> — paiement unique à la rentrée sur <strong style={{ color: '#fff' }}>messervices.etudiant.gouv.fr</strong>. Exonération possible si boursier.
              </p>
            </div>
            <div style={{ marginTop: 10, padding: '12px 14px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 8 }}>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.6 }}>
                ⚠️ En réalité ces frais se paient <strong style={{ color: 'rgba(255,255,255,0.8)' }}>en une seule fois</strong> à la rentrée. Cette vue mensuelle est pour planifier ton épargne.
              </p>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(167,139,250,0.9)', margin: '0 0 4px' }}>
              🎓 Frais d&apos;inscription — À prévoir à la rentrée
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 16px', lineHeight: 1.6 }}>
              À payer <strong style={{ color: 'rgba(255,255,255,0.7)' }}>une seule fois</strong> à l&apos;inscription, en plus de ton budget mensuel.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: niveauLabel, amount: `${tuitionAnnual} €` },
                { label: '+ CVEC',   amount: `${CVEC_ANNUAL} €` },
              ].map((it, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.62)' }}>{it.label}</span>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.95rem', color: 'rgba(255,255,255,0.82)' }}>{it.amount}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 0' }}>
                <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>TOTAL FRAIS D&apos;INSCRIPTION</span>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.7rem', letterSpacing: '0.04em', color: '#a78bfa' }}>{tuitionAnnual + CVEC_ANNUAL} €</span>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: '11px 14px', background: 'rgba(77,143,255,0.06)', border: '1px solid rgba(77,143,255,0.18)', borderRadius: 8 }}>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.6 }}>
                La <strong style={{ color: 'rgba(255,255,255,0.85)' }}>CVEC se paie UNE SEULE FOIS</strong> avant ton inscription sur <strong style={{ color: '#fff' }}>messervices.etudiant.gouv.fr</strong>. Exonération possible si boursier.
              </p>
            </div>
            <div style={{ marginTop: 10, padding: '12px 14px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 8 }}>
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.65 }}>
                ⚠️ La plupart des universités <strong style={{ color: 'rgba(255,255,255,0.8)' }}>exonèrent les étudiants hors UE</strong> des frais différenciés. Vérifie sur le site de ton université.
              </p>
            </div>
          </>
        )}
        <div style={{ marginTop: 14, textAlign: 'right' }}>
          <a href="https://www.campusfrance.org/fr/les-frais-d-inscription-dans-les-etablissements-d-enseignement-superieur-publics" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.75rem', color: 'rgba(167,139,250,0.7)', textDecoration: 'none' }}>
            → Guide frais scolarité — Campus France ↗
          </a>
        </div>
      </div>

      {/* ── Note visa consulat ── */}
      <div style={{ background: 'rgba(1,77,248,0.06)', border: '1px solid rgba(1,77,248,0.22)', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
        <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.9)', margin: '0 0 6px' }}>
          Visa étudiant — exigence consulaire
        </p>
        <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.7 }}>
          Le consulat français exige de justifier <strong style={{ color: '#fff' }}>615 €/mois minimum</strong> de ressources pour obtenir ton visa étudiant, soit environ <strong style={{ color: '#fff' }}>7 380 € disponibles</strong> sur ton compte bancaire pour 12 mois. Ce chiffre est une exigence administrative, pas un budget de vie.
          {showNet && (
            <> <strong style={{ color: '#f59e0b' }}>Même si ton budget réel est de {netBudget} €/mois avec les aides, tu dois prouver 615 €/mois de ressources disponibles.</strong></>
          )}
        </p>
      </div>

      {/* ── Bourse note ── */}
      {bourseNote && (
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.7 }}>
            💡 {bourseNote}
          </p>
        </div>
      )}

      {/* ── CTAs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 32 }}>
        <Link href="/checklist" style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '18px 20px', borderRadius: 14, background: 'linear-gradient(135deg,#014DF8,#4d8fff)', textDecoration: 'none', boxShadow: '0 4px 24px rgba(1,77,248,0.3)' }}>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.78rem', color: '#fff' }}>📋 Ma checklist arrivée</span>
          <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>32 démarches essentielles — PDF gratuit</span>
        </Link>
        {city && (
          <Link href={`/villes/${city.slug}`} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.78rem', color: '#fff' }}>🏙 Guide {city.name}</span>
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>Quartiers, logement, transport, vie étudiante</span>
          </Link>
        )}
        {paysGuide && (
          <Link href={`/pays/${paysGuide.slug}`} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.78rem', color: '#fff' }}>🌍 {paysGuide.label}</span>
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)' }}>Visa, Campus France, procédure complète</span>
          </Link>
        )}
      </div>

      {/* Recommencer */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button onClick={onReset} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-montserrat)', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)' }}>
          ↺ Recommencer la simulation
        </button>
      </div>

      <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.22)', margin: 0, lineHeight: 1.7 }}>
        ⚠️ Estimation indicative — juin 2026. Frais d&apos;inscription (Licence 2 895 €/an, Master 3 941 €/an, Doctorat 397 €/an) + CVEC 105 €/an. Actualisés chaque année — vérifier sur{' '}
        <a href="https://www.campusfrance.org" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.32)', textDecoration: 'underline' }}>campusfrance.org</a>{' '}et{' '}
        <a href="https://www.caf.fr" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.32)', textDecoration: 'underline' }}>caf.fr</a>.
      </p>
    </div>
  );
}

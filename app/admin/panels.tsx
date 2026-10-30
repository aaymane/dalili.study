'use client';

// Admin tabs beyond the waitlist: mentors to validate, an overview of the whole
// of DALILI, the mentoring reports, and the reports on the assistant's answers. Same look as page.tsx.

import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react';

export type AdminTab = 'inscrits' | 'mentors' | 'apercu' | 'securite' | 'ecoles' | 'signalements';

const TABS: { id: AdminTab; label: string }[] = [
  { id: 'apercu', label: 'Vue d’ensemble' },
  { id: 'mentors', label: 'Mentors' },
  { id: 'securite', label: 'Signalements mentorat' },
  { id: 'ecoles', label: 'Écoles' },
  { id: 'inscrits', label: 'Inscrits' },
  { id: 'signalements', label: 'Signalements IA' },
];

const C = {
  card: { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 } as CSSProperties,
  dim: 'rgba(255,255,255,0.62)',
  text: 'rgba(255,255,255,0.9)',
  blue: '#4d8fff',
  green: '#34d399',
  amber: '#fbbf24',
  red: '#f87171',
  violet: '#a78bfa',
};

async function call<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...init, headers: { 'content-type': 'application/json', 'x-admin-token': token, ...(init?.headers ?? {}) } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? `Erreur ${res.status}`);
  return json as T;
}

const day = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

// ── Tabs ─────────────────────────────────────────────────────────────────────
export function AdminTabs({ tab, onChange, waiting, safety, leads = 0 }: { tab: AdminTab; onChange: (t: AdminTab) => void; waiting: number; safety: number; leads?: number }) {
  return (
    <div role="tablist" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
      {TABS.map(t => {
        const on = tab === t.id;
        const badge = t.id === 'mentors' ? waiting : t.id === 'securite' ? safety : t.id === 'ecoles' ? leads : 0;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 18px', borderRadius: 100, cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: on ? 'rgba(1,77,248,0.16)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${on ? 'rgba(1,77,248,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: on ? C.blue : C.text,
            }}>
            {t.label}
            {badge > 0 ? (
              <span style={{ minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10, background: t.id === 'securite' ? C.red : C.amber, color: '#1a1300', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function State({ loading, error, onRetry, children }: { loading: boolean; error: string | null; onRetry: () => void; children: ReactNode }) {
  if (error)
    return (
      <div style={{ ...C.card, padding: 24, color: C.red, fontSize: 14 }}>
        {error}{' '}
        <button onClick={onRetry} style={{ marginLeft: 8, background: 'none', border: 'none', color: C.blue, cursor: 'pointer', fontSize: 14 }}>
          Réessayer
        </button>
      </div>
    );
  if (loading) return <div style={{ ...C.card, padding: 24, color: C.dim, fontSize: 14 }}>Chargement…</div>;
  return <>{children}</>;
}

function useAdminData<T>(token: string, path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await call<T>(token, path));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token, path]);
  useEffect(() => {
    void load();
  }, [load]);
  return { data, error, loading, reload: load, setData };
}

// ── Overview ─────────────────────────────────────────────────────────────────
type Overview = {
  accounts: { total: number; week: number };
  mentors: { active: number; waiting: number };
  calls: { pending: number; confirmed: number; done: number };
  assistant: { questions: number; refused: number; refusalRate: number; cost30: number };
  reports: number;
  /** Mentoring reports still open. */
  safety: number;
  /** « Je suis intéressé·e » not handled yet. */
  leads: number;
};

function Metric({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent: string }) {
  return (
    <div style={{ ...C.card, padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${accent}55,transparent)` }} />
      <div style={{ fontSize: 11, color: C.text, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value}</div>
      {sub ? <div style={{ fontSize: 12, color: C.dim, marginTop: 8 }}>{sub}</div> : null}
    </div>
  );
}

export function OverviewPanel({ token, onGoMentors, onGoSafety }: { token: string; onGoMentors: () => void; onGoSafety: () => void }) {
  const { data, error, loading, reload } = useAdminData<Overview>(token, '/api/admin/overview');
  return (
    <State loading={loading} error={error} onRetry={reload}>
      {data ? (
        <div style={{ display: 'grid', gap: 14 }}>
          {data.safety > 0 ? (
            <button
              onClick={onGoSafety}
              style={{ ...C.card, padding: '16px 20px', textAlign: 'left', cursor: 'pointer', borderColor: 'rgba(248,113,113,0.4)', background: 'rgba(248,113,113,0.07)', color: '#fff', fontSize: 14 }}>
              <strong style={{ color: C.red }}>
                {data.safety} signalement{data.safety > 1 ? 's' : ''} mentorat à traiter
              </strong>{' '}
              · à lire en premier →
            </button>
          ) : null}
          {data.mentors.waiting > 0 ? (
            <button
              onClick={onGoMentors}
              style={{ ...C.card, padding: '16px 20px', textAlign: 'left', cursor: 'pointer', borderColor: 'rgba(251,191,36,0.35)', background: 'rgba(251,191,36,0.06)', color: '#fff', fontSize: 14 }}>
              <strong style={{ color: C.amber }}>
                {data.mentors.waiting} fiche{data.mentors.waiting > 1 ? 's' : ''} mentor à valider
              </strong>{' '}
              · les étudiants ne les voient pas encore →
            </button>
          ) : null}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            <Metric label="Comptes dans l’app" value={data.accounts.total} sub={`+${data.accounts.week} cette semaine`} accent={C.blue} />
            <Metric label="Mentors validés" value={data.mentors.active} sub={`${data.mentors.waiting} en attente`} accent={C.green} />
            <Metric label="Demandes d’appel" value={data.calls.pending} sub="en attente de réponse" accent={C.amber} />
            <Metric label="Appels acceptés" value={data.calls.confirmed + data.calls.done} sub={`${data.calls.done} déjà passés`} accent={C.green} />
            <Metric label="Questions à l’IA" value={data.assistant.questions} sub="7 derniers jours" accent={C.violet} />
            <Metric
              label="Taux de refus IA"
              value={`${data.assistant.refusalRate} %`}
              sub={`${data.assistant.refused} sans réponse · guides à écrire`}
              accent={data.assistant.refusalRate > 30 ? C.red : C.green}
            />
            <Metric label="Signalements IA" value={data.reports} sub="7 derniers jours" accent={C.red} />
            <Metric label="Intérêts écoles" value={data.leads} sub="à recontacter" accent={C.blue} />
            <Metric label="Coût IA" value={`${data.assistant.cost30.toLocaleString('fr-FR')} $`} sub="30 derniers jours" accent={C.violet} />
          </div>
        </div>
      ) : null}
    </State>
  );
}

// ── Mentors ──────────────────────────────────────────────────────────────────
type MentorRow = {
  id: string;
  first_name: string;
  last_name: string;
  headline: string | null;
  study: string | null;
  city: string;
  origin: string | null;
  specialties: string[];
  languages: string[];
  quote: string | null;
  is_active: boolean;
  available_this_week: boolean;
  sessions_count: number;
  created_at: string;
  email: string | null;
  profile: { country: string | null; origin_city: string | null; study_level: string | null; situation: string | null } | null;
  /** Charter accepted in the app (null = not yet), and the founders' verification. */
  trust: {
    birth_year: number;
    charter_accepted_at: string;
    verified_at: string | null;
    verified_proof: Proof | null;
    verified_by: string | null;
  } | null;
  /** Residence permit and enrolment certificate sent from the app; links valid 10 minutes, deleted after the decision. */
  documents: { kind: 'titre_sejour' | 'certificat_scolarite'; url: string | null; sentAt: string }[];
};

const DOCS = { titre_sejour: 'Titre de séjour', certificat_scolarite: 'Certificat de scolarité' } as const;

const LEVELS: Record<string, string> = { bac: 'Bac', licence: 'Licence', master: 'Master', doctorat: 'Doctorat' };

type Proof = 'carte_etudiante' | 'linkedin' | 'titre_sejour';
const PROOFS: Record<Proof, string> = { carte_etudiante: 'Carte étudiante', linkedin: 'LinkedIn', titre_sejour: 'Titre de séjour' };
const field: CSSProperties = { padding: '9px 12px', borderRadius: 10, fontSize: 13, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: C.text };

// The founder's first name, remembered on this browser only: "who verified" is declared, one shared code for three.
const NAME_KEY = 'dalili-admin-name';
const savedName = () => {
  try {
    return localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
};

/** A founder looked at the documents (or saw a proof another way): we note which one and who. */
function VerifyForm({ busy, onVerify }: { busy: boolean; onVerify: (proof: Proof, by: string) => void }) {
  const [proof, setProof] = useState<Proof | ''>('');
  const [by, setBy] = useState(savedName);
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <select value={proof} onChange={e => setProof(e.target.value as Proof | '')} style={field} aria-label="Preuve vue">
        <option value="">Preuve vue…</option>
        {(Object.keys(PROOFS) as Proof[]).map(p => (
          <option key={p} value={p}>
            {PROOFS[p]}
          </option>
        ))}
      </select>
      <input value={by} onChange={e => setBy(e.target.value)} placeholder="Ton prénom" maxLength={40} style={{ ...field, width: 130 }} aria-label="Vérifié par" />
      <Btn
        tone="ghost"
        disabled={busy || !proof || by.trim().length < 2}
        onClick={() => {
          try {
            localStorage.setItem(NAME_KEY, by.trim());
          } catch {}
          if (proof) onVerify(proof, by.trim());
        }}>
        Marquer vérifié
      </Btn>
    </div>
  );
}

function Btn({ children, onClick, tone, disabled }: { children: ReactNode; onClick: () => void; tone: 'green' | 'red' | 'ghost'; disabled?: boolean }) {
  const t = {
    green: { background: 'rgba(52,211,153,0.14)', border: 'rgba(52,211,153,0.4)', color: C.green },
    red: { background: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.3)', color: C.red },
    ghost: { background: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', color: C.text },
  }[tone];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, background: t.background, border: `1px solid ${t.border}`, color: t.color }}>
      {children}
    </button>
  );
}

function MentorCard({
  m,
  busy,
  onAction,
  onVerify,
}: {
  m: MentorRow;
  busy: boolean;
  onAction: (a: 'valider' | 'suspendre' | 'refuser') => void;
  onVerify: (proof: Proof, by: string) => void;
}) {
  const t = m.trust;
  const verified = !!t?.verified_at;
  const facts = [
    m.profile?.study_level ? LEVELS[m.profile.study_level] ?? m.profile.study_level : null,
    m.profile?.situation === 'in_france' ? 'Vit en France' : m.profile?.situation === 'abroad' ? 'Pas encore en France' : null,
    m.origin || m.profile?.origin_city ? `Vient de ${m.origin || m.profile?.origin_city}` : null,
    m.is_active ? `${m.sessions_count} appel${m.sessions_count > 1 ? 's' : ''}` : null,
  ].filter(Boolean);
  return (
    <div style={{ ...C.card, padding: 20, display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>
            {m.first_name} {m.last_name} <span style={{ color: C.dim, fontWeight: 400, fontSize: 14 }}>· {m.city}</span>
          </div>
          <div style={{ fontSize: 13, color: C.dim, marginTop: 4 }}>
            {m.email ? (
              <a href={`mailto:${m.email}`} style={{ color: C.blue }}>
                {m.email}
              </a>
            ) : (
              'Pas de compte relié'
            )}{' '}
            · fiche envoyée le {day(m.created_at)}
          </div>
        </div>
        {m.is_active ? (
          <span style={{ alignSelf: 'flex-start', fontSize: 12, color: m.available_this_week ? C.green : C.dim }}>
            ● {m.available_this_week ? 'Prend des demandes' : 'En pause'}
          </span>
        ) : null}
      </div>
      {facts.length ? <div style={{ fontSize: 13, color: C.text }}>{facts.join(' · ')}</div> : null}
      {m.headline || m.study ? <div style={{ fontSize: 13, color: C.text }}>{[m.headline, m.study].filter(Boolean).join(' · ')}</div> : null}
      {m.specialties?.length ? <div style={{ fontSize: 13, color: C.dim }}>Peut aider sur : {m.specialties.join(', ')}</div> : null}
      {m.quote ? <div style={{ fontSize: 13, color: C.dim, fontStyle: 'italic' }}>« {m.quote} »</div> : null}
      <div style={{ fontSize: 13, color: t ? C.text : C.amber }}>
        {t
          ? `Charte acceptée le ${day(t.charter_accepted_at)} · né·e en ${t.birth_year} (≈ ${new Date().getFullYear() - t.birth_year} ans)`
          : '⚠ Charte pas encore acceptée dans l’app : vérification et validation impossibles.'}
      </div>
      {!m.is_active ? (
        m.documents.length ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', fontSize: 13 }}>
            {m.documents.map(d =>
              d.url ? (
                <a key={d.kind} href={d.url} target="_blank" rel="noreferrer" style={{ ...field, color: C.blue, textDecoration: 'none' }}>
                  📄 {DOCS[d.kind]}
                </a>
              ) : (
                <span key={d.kind} style={{ ...field, color: C.amber }}>
                  {DOCS[d.kind]} : lien indisponible, recharge
                </span>
              )
            )}
            <span style={{ color: C.dim }}>Liens valables 10 min · supprimés dès ta décision</span>
          </div>
        ) : (
          <div style={{ fontSize: 13, color: C.amber }}>⚠ Aucun document : fiche envoyée avant la candidature avec documents.</div>
        )
      ) : null}
      {verified && t ? (
        <div style={{ fontSize: 13, color: C.green }}>
          ✓ Vérifié le {day(t.verified_at!)} par {t.verified_by} · {t.verified_proof ? PROOFS[t.verified_proof] : ''} vu · documents supprimés à la décision
        </div>
      ) : t ? (
        <VerifyForm busy={busy} onVerify={onVerify} />
      ) : null}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {m.is_active ? (
          <Btn tone="ghost" disabled={busy} onClick={() => onAction('suspendre')}>
            Suspendre
          </Btn>
        ) : (
          <>
            <Btn tone="green" disabled={busy || !verified} onClick={() => onAction('valider')}>
              {verified ? 'Valider la fiche' : 'Valider (vérifie d’abord)'}
            </Btn>
            <Btn tone="red" disabled={busy} onClick={() => onAction('refuser')}>
              Refuser
            </Btn>
          </>
        )}
      </div>
    </div>
  );
}

export function MentorsPanel({ token, onChanged }: { token: string; onChanged: () => void }) {
  const { data, error, loading, reload, setData } = useAdminData<{ data: MentorRow[] }>(token, '/api/admin/mentors');
  const [busy, setBusy] = useState<string | null>(null);

  const act = async (m: MentorRow, action: 'valider' | 'suspendre' | 'refuser') => {
    const name = `${m.first_name} ${m.last_name}`.trim();
    let reason = '';
    if (action === 'refuser') {
      reason = (prompt(`Refuser la candidature de ${name} ?\nÉcris le motif : la personne le lira dans l’app (ex. « Certificat de scolarité illisible »). Les documents seront supprimés.`) ?? '').trim();
      if (!reason) return;
    }
    if (action === 'suspendre' && !confirm(`Suspendre ${name} ? Les étudiants ne le verront plus et ne pourront plus lui demander d’appel.`)) return;
    setBusy(m.id);
    try {
      if (action === 'refuser') {
        await call(token, '/api/admin/mentors', { method: 'DELETE', body: JSON.stringify({ id: m.id, reason }) });
        setData(d => (d ? { data: d.data.filter(x => x.id !== m.id) } : d));
      } else {
        await call(token, '/api/admin/mentors', { method: 'PATCH', body: JSON.stringify({ id: m.id, action }) });
        setData(d => (d ? { data: d.data.map(x => (x.id === m.id ? { ...x, is_active: action === 'valider', documents: action === 'valider' ? [] : x.documents } : x)) } : d));
      }
      onChanged();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const verify = async (m: MentorRow, proof: Proof, by: string) => {
    setBusy(m.id);
    try {
      await call(token, '/api/admin/mentors', { method: 'PATCH', body: JSON.stringify({ id: m.id, action: 'verifier', proof, by }) });
      const now = new Date().toISOString();
      setData(d =>
        d ? { data: d.data.map(x => (x.id === m.id && x.trust ? { ...x, trust: { ...x.trust, verified_at: now, verified_proof: proof, verified_by: by } } : x)) } : d
      );
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const all = data?.data ?? [];
  const waiting = all.filter(m => !m.is_active);
  const active = all.filter(m => m.is_active);
  const h = (text: string) => <div style={{ fontSize: 12, color: C.text, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '8px 0 12px' }}>{text}</div>;

  return (
    <State loading={loading} error={error} onRetry={reload}>
      {h(`À valider · ${waiting.length}`)}
      {waiting.length ? (
        <div style={{ display: 'grid', gap: 12, marginBottom: 32 }}>
          {waiting.map(m => (
            <MentorCard key={m.id} m={m} busy={busy === m.id} onAction={a => act(m, a)} onVerify={(p, by) => verify(m, p, by)} />
          ))}
        </div>
      ) : (
        <div style={{ ...C.card, padding: 20, color: C.dim, fontSize: 14, marginBottom: 32 }}>
          Aucune candidature en attente. Les candidatures envoyées depuis l’app (« Devenir mentor », avec titre de séjour et certificat de scolarité) arrivent ici.
        </div>
      )}
      {h(`Validés · ${active.length}`)}
      {active.length ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {active.map(m => (
            <MentorCard key={m.id} m={m} busy={busy === m.id} onAction={a => act(m, a)} onVerify={(p, by) => verify(m, p, by)} />
          ))}
        </div>
      ) : (
        <div style={{ ...C.card, padding: 20, color: C.dim, fontSize: 14 }}>Aucun mentor validé pour le moment.</div>
      )}
    </State>
  );
}

// ── Mentoring reports ────────────────────────────────────────────────────────
type Person = { name: string | null; email: string | null; country: string | null; city: string | null } | null;
type SafetyReport = {
  id: string;
  reporter_role: 'student' | 'mentor';
  reason: 'harcelement' | 'argent' | 'donnees' | 'faux_profil' | 'autre';
  comment: string | null;
  status: 'open' | 'handled' | 'dismissed';
  handled_at: string | null;
  handled_by: string | null;
  created_at: string;
  reporter: Person;
  reported: Person;
  mentor: { id: string; first_name: string; last_name: string; city: string; is_active: boolean } | null;
  booking: { starts_at: string; topic: string; status: string } | null;
  times_reported: number;
};

// Same words as the app's report sheet (src/features/safety/components/ReportSheet.tsx).
const SAFETY_REASONS: Record<SafetyReport['reason'], { label: string; color: string }> = {
  harcelement: { label: 'Propos ou gestes déplacés', color: C.red },
  argent: { label: 'Demande de l’argent', color: C.red },
  donnees: { label: 'Veut son numéro ou ses réseaux', color: C.amber },
  faux_profil: { label: 'Faux profil', color: C.amber },
  autre: { label: 'Autre chose', color: C.dim },
};
const BOOKING_STATUS: Record<string, string> = { pending: 'en attente', confirmed: 'acceptée', cancelled: 'annulée', done: 'appel passé' };

function Who({ label, p, deleted }: { label: string; p: Person; deleted: string }) {
  if (!p) return <div style={{ fontSize: 13, color: C.dim }}>{label} : {deleted}</div>;
  const place = [p.city, p.country].filter(Boolean).join(', ');
  return (
    <div style={{ fontSize: 13, color: C.text }}>
      {label} : <strong style={{ color: '#fff' }}>{p.name ?? 'Sans prénom'}</strong>
      {place ? <span style={{ color: C.dim }}> · {place}</span> : null}
      {p.email ? (
        <>
          {' · '}
          <a href={`mailto:${p.email}`} style={{ color: C.blue }}>
            {p.email}
          </a>
        </>
      ) : null}
    </div>
  );
}

function SafetyCard({
  r,
  busy,
  onClose,
  onSuspend,
}: {
  r: SafetyReport;
  busy: boolean;
  onClose: (status: 'handled' | 'dismissed', by: string) => void;
  onSuspend: () => void;
}) {
  const [by, setBy] = useState(savedName);
  const reason = SAFETY_REASONS[r.reason] ?? { label: r.reason, color: C.dim };
  const aboutMentor = r.reporter_role === 'student';
  const close = (status: 'handled' | 'dismissed') => {
    try {
      localStorage.setItem(NAME_KEY, by.trim());
    } catch {}
    onClose(status, by.trim());
  };
  return (
    <div style={{ ...C.card, padding: 20, display: 'grid', gap: 10, ...(r.status === 'open' ? { borderColor: 'rgba(248,113,113,0.3)' } : {}) }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: 12 }}>
        <span style={{ color: reason.color, fontWeight: 700 }}>● {reason.label}</span>
        <span style={{ color: C.dim }}>
          {day(r.created_at)} · {aboutMentor ? 'un étudiant signale son mentor' : 'un mentor signale un étudiant'}
        </span>
        {r.times_reported > 1 ? <span style={{ color: C.red, fontWeight: 700 }}>⚠ signalé·e {r.times_reported} fois</span> : null}
      </div>
      <Who label="Signalé·e" p={r.reported} deleted={aboutMentor && r.mentor ? `${r.mentor.first_name} ${r.mentor.last_name} (sans compte)` : 'compte supprimé'} />
      <Who label="Par" p={r.reporter} deleted="compte supprimé" />
      {aboutMentor && r.mentor ? (
        <div style={{ fontSize: 13, color: C.dim }}>
          Fiche mentor : {r.mentor.first_name} {r.mentor.last_name} · {r.mentor.city} ·{' '}
          <span style={{ color: r.mentor.is_active ? C.green : C.dim }}>{r.mentor.is_active ? 'en ligne' : 'pas en ligne'}</span>
        </div>
      ) : null}
      {r.booking ? (
        <div style={{ fontSize: 13, color: C.dim }}>
          Demande d’appel du {day(r.booking.starts_at)} · « {r.booking.topic} » · {BOOKING_STATUS[r.booking.status] ?? r.booking.status}
        </div>
      ) : null}
      {r.comment ? <div style={{ fontSize: 14, color: '#fff' }}>« {r.comment} »</div> : null}
      {r.status === 'open' ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={by} onChange={e => setBy(e.target.value)} placeholder="Ton prénom" maxLength={40} style={{ ...field, width: 130 }} aria-label="Traité par" />
          <Btn tone="green" disabled={busy || by.trim().length < 2} onClick={() => close('handled')}>
            Traité
          </Btn>
          <Btn tone="ghost" disabled={busy || by.trim().length < 2} onClick={() => close('dismissed')}>
            Sans suite
          </Btn>
          {aboutMentor && r.mentor?.is_active ? (
            <Btn tone="red" disabled={busy} onClick={onSuspend}>
              Suspendre le mentor
            </Btn>
          ) : null}
        </div>
      ) : (
        <div style={{ fontSize: 13, color: r.status === 'handled' ? C.green : C.dim }}>
          {r.status === 'handled' ? '✓ Traité' : 'Classé sans suite'} le {r.handled_at ? day(r.handled_at) : '?'} par {r.handled_by}
        </div>
      )}
    </div>
  );
}

export function SafetyPanel({ token, onChanged }: { token: string; onChanged: () => void }) {
  const { data, error, loading, reload, setData } = useAdminData<{ data: SafetyReport[] }>(token, '/api/admin/reports');
  const [busy, setBusy] = useState<string | null>(null);

  const close = async (r: SafetyReport, status: 'handled' | 'dismissed', by: string) => {
    setBusy(r.id);
    try {
      await call(token, '/api/admin/reports', { method: 'PATCH', body: JSON.stringify({ id: r.id, status, by }) });
      const now = new Date().toISOString();
      setData(d => (d ? { data: d.data.map(x => (x.id === r.id ? { ...x, status, handled_at: now, handled_by: by } : x)) } : d));
      onChanged();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const suspend = async (r: SafetyReport) => {
    const m = r.mentor;
    if (!m || !confirm(`Suspendre ${m.first_name} ${m.last_name} ? Les étudiants ne le verront plus et ne pourront plus lui demander d’appel.`)) return;
    setBusy(r.id);
    try {
      await call(token, '/api/admin/mentors', { method: 'PATCH', body: JSON.stringify({ id: m.id, action: 'suspendre' }) });
      setData(d => (d ? { data: d.data.map(x => (x.mentor?.id === m.id ? { ...x, mentor: { ...m, is_active: false } } : x)) } : d));
      onChanged();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const all = data?.data ?? [];
  const open = all.filter(r => r.status === 'open');
  const closed = all.filter(r => r.status !== 'open');
  const h = (text: string) => <div style={{ fontSize: 12, color: C.text, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '8px 0 12px' }}>{text}</div>;

  return (
    <State loading={loading} error={error} onRetry={reload}>
      {h(`À traiter · ${open.length}`)}
      {open.length ? (
        <div style={{ display: 'grid', gap: 12, marginBottom: 32 }}>
          {open.map(r => (
            <SafetyCard key={r.id} r={r} busy={busy === r.id} onClose={(s, by) => close(r, s, by)} onSuspend={() => suspend(r)} />
          ))}
        </div>
      ) : (
        <div style={{ ...C.card, padding: 20, color: C.dim, fontSize: 14, marginBottom: 32 }}>
          Aucun signalement à traiter. Ils arrivent quand quelqu’un touche « Signaler » sur une fiche mentor, pendant un appel ou sur une demande reçue.
        </div>
      )}
      {closed.length ? (
        <>
          {h(`Déjà classés · ${closed.length}`)}
          <div style={{ display: 'grid', gap: 12 }}>
            {closed.map(r => (
              <SafetyCard key={r.id} r={r} busy={false} onClose={() => {}} onSuspend={() => {}} />
            ))}
          </div>
        </>
      ) : null}
    </State>
  );
}

// ── Partner schools: « Je suis intéressé·e » ─────────────────────────────────
type Lead = {
  id: string;
  school: string;
  program: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'closed';
  handled_by: string | null;
  created_at: string;
  student: { name: string | null; email: string | null; country: string | null; city: string | null; level: string | null };
};
const COUNTRIES: Record<string, string> = { MA: 'Maroc', DZ: 'Algérie', TN: 'Tunisie' };

function LeadCard({ l, busy, onDone }: { l: Lead; busy: boolean; onDone: (status: 'contacted' | 'closed', by: string) => void }) {
  const [by, setBy] = useState(savedName);
  const done = (status: 'contacted' | 'closed') => {
    try {
      localStorage.setItem(NAME_KEY, by.trim());
    } catch {}
    onDone(status, by.trim());
  };
  const s = l.student;
  const facts = [s.country ? COUNTRIES[s.country] ?? s.country : null, s.city ? `vient de ${s.city}` : null, s.level ? LEVELS[s.level] ?? s.level : null].filter(Boolean);
  return (
    <div style={{ ...C.card, padding: 20, display: 'grid', gap: 10, ...(l.status === 'new' ? { borderColor: 'rgba(77,143,255,0.35)' } : {}) }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: 12 }}>
        <span style={{ color: C.blue, fontWeight: 700 }}>● {l.school}</span>
        <span style={{ color: C.dim }}>{day(l.created_at)}</span>
      </div>
      <div style={{ fontSize: 15, color: '#fff' }}>
        <strong>{s.name ?? 'Sans prénom'}</strong>
        {facts.length ? <span style={{ color: C.dim, fontSize: 13 }}> · {facts.join(' · ')}</span> : null}
        {s.email ? (
          <>
            {' · '}
            <a href={`mailto:${s.email}`} style={{ color: C.blue, fontSize: 13 }}>
              {s.email}
            </a>
          </>
        ) : null}
      </div>
      <div style={{ fontSize: 13, color: C.text }}>Formation : {l.program ?? 'ne sait pas encore'}</div>
      {l.message ? <div style={{ fontSize: 14, color: '#fff' }}>« {l.message} »</div> : null}
      {l.status === 'new' ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={by} onChange={e => setBy(e.target.value)} placeholder="Ton prénom" maxLength={40} style={{ ...field, width: 130 }} aria-label="Traité par" />
          <Btn tone="green" disabled={busy || by.trim().length < 2} onClick={() => done('contacted')}>
            Recontacté
          </Btn>
          <Btn tone="ghost" disabled={busy || by.trim().length < 2} onClick={() => done('closed')}>
            Classer
          </Btn>
        </div>
      ) : (
        <div style={{ fontSize: 13, color: l.status === 'contacted' ? C.green : C.dim }}>
          {l.status === 'contacted' ? '✓ Recontacté' : 'Classé'} par {l.handled_by}
        </div>
      )}
    </div>
  );
}

export function SchoolsPanel({ token, onChanged }: { token: string; onChanged: () => void }) {
  const { data, error, loading, reload, setData } = useAdminData<{ data: Lead[] }>(token, '/api/admin/schools');
  const [busy, setBusy] = useState<string | null>(null);
  const done = async (l: Lead, status: 'contacted' | 'closed', by: string) => {
    setBusy(l.id);
    try {
      await call(token, '/api/admin/schools', { method: 'PATCH', body: JSON.stringify({ id: l.id, status, by }) });
      setData(d => (d ? { data: d.data.map(x => (x.id === l.id ? { ...x, status, handled_by: by } : x)) } : d));
      onChanged();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(null);
    }
  };
  const all = data?.data ?? [];
  const fresh = all.filter(l => l.status === 'new');
  const handled = all.filter(l => l.status !== 'new');
  const h = (text: string) => <div style={{ fontSize: 12, color: C.text, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '8px 0 12px' }}>{text}</div>;
  return (
    <State loading={loading} error={error} onRetry={reload}>
      <div style={{ ...C.card, padding: 16, color: C.dim, fontSize: 13, marginBottom: 20 }}>
        Ces demandes restent chez DALILI : vous recontactez l’étudiant vous-mêmes. Rien n’est transmis à l’école sans son nouvel accord.
      </div>
      {h(`À recontacter · ${fresh.length}`)}
      {fresh.length ? (
        <div style={{ display: 'grid', gap: 12, marginBottom: 32 }}>
          {fresh.map(l => (
            <LeadCard key={l.id} l={l} busy={busy === l.id} onDone={(s, by) => done(l, s, by)} />
          ))}
        </div>
      ) : (
        <div style={{ ...C.card, padding: 20, color: C.dim, fontSize: 14, marginBottom: 32 }}>
          Aucune demande pour le moment. Elles arrivent quand un étudiant touche « Je suis intéressé·e » sur la fiche d’une école.
        </div>
      )}
      {handled.length ? (
        <>
          {h(`Déjà traitées · ${handled.length}`)}
          <div style={{ display: 'grid', gap: 12 }}>
            {handled.map(l => (
              <LeadCard key={l.id} l={l} busy={false} onDone={() => {}} />
            ))}
          </div>
        </>
      ) : null}
    </State>
  );
}

// ── Assistant reports ────────────────────────────────────────────────────────
type Report = {
  id: string;
  reason: 'faux' | 'incomplet' | 'pas_clair' | 'autre';
  comment: string | null;
  channel: string | null;
  created_at: string;
  query: { question: string; lang: string | null; country: string | null; step_id: string | null; top_similarity: number | null } | null;
};

const REASONS: Record<Report['reason'], { label: string; color: string }> = {
  faux: { label: 'C’est faux', color: C.red },
  incomplet: { label: 'Incomplet', color: C.amber },
  pas_clair: { label: 'Pas clair', color: C.blue },
  autre: { label: 'Autre', color: C.dim },
};

export function FeedbackPanel({ token }: { token: string }) {
  const { data, error, loading, reload } = useAdminData<{ data: Report[] }>(token, '/api/admin/feedback');
  const list = data?.data ?? [];
  return (
    <State loading={loading} error={error} onRetry={reload}>
      {list.length ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {list.map(r => (
            <div key={r.id} style={{ ...C.card, padding: 20, display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: 12 }}>
                <span style={{ color: REASONS[r.reason]?.color ?? C.dim, fontWeight: 700 }}>● {REASONS[r.reason]?.label ?? r.reason}</span>
                <span style={{ color: C.dim }}>
                  {day(r.created_at)}
                  {r.query?.country ? ` · ${r.query.country}` : ''}
                  {r.query?.step_id ? ` · étape ${r.query.step_id}` : ''}
                </span>
              </div>
              <div style={{ fontSize: 15, color: '#fff' }}>{r.query?.question ?? 'Question introuvable'}</div>
              {r.comment ? <div style={{ fontSize: 13, color: C.text }}>« {r.comment} »</div> : null}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ ...C.card, padding: 20, color: C.dim, fontSize: 14 }}>
          Aucun signalement pour le moment. Ils arrivent quand un étudiant touche 👎 sous une réponse de Dalili IA.
        </div>
      )}
    </State>
  );
}

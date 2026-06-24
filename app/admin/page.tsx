'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

type Status = 'pending' | 'invited' | 'converted' | 'unsubscribed';

interface SimulateurData {
  ville: string;
  logement: string;
  niveau: string;
  pays: string;
  bourse: string;
  budget_estime: number;
  caf_estimee: number;
  reste: number;
}

interface Entry {
  id: string;
  email: string;
  source: string;
  status: Status;
  created_at: string;
  metadata: Record<string, unknown>;
  simulateur_data?: SimulateurData | null;
}

interface Stats {
  total: number;
  pending: number;
  invited: number;
  converted: number;
  last_7_days: number;
  last_30_days: number;
}

const STATUS_CFG: Record<Status, { bg: string; text: string; dot: string; label: string }> = {
  pending:      { bg: 'rgba(1,77,248,0.12)',    text: '#4d8fff', dot: '#4d8fff', label: 'En attente' },
  invited:      { bg: 'rgba(52,211,153,0.12)',  text: '#34d399', dot: '#34d399', label: 'Invité' },
  converted:    { bg: 'rgba(167,139,250,0.12)', text: '#a78bfa', dot: '#a78bfa', label: 'Converti' },
  unsubscribed: { bg: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.3)', dot: 'rgba(255,255,255,0.2)', label: 'Désabonné' },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = display;
    const end   = value;
    const dur   = 800;
    const t0    = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{display.toLocaleString('fr-FR')}</>;
}

// ── Login ──────────────────────────────────────────────────────────────────────
function LoginScreen({ onAuth }: { onAuth: (token: string) => void }) {
  const [token, setToken]   = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoad]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = async () => {
    if (!token.trim() || loading) return;
    setLoad(true); setError('');
    const res = await fetch('/api/admin/waitlist', {
      headers: { 'x-admin-token': token.trim() },
    });
    if (res.status === 401) { setError('Token invalide.'); setLoad(false); return; }
    onAuth(token.trim());
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#010510', fontFamily: 'var(--font-dm-sans)',
      backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(1,77,248,0.14) 0%, transparent 60%)',
      padding: '24px',
    }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%,black 20%,transparent 80%)',
      }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#014df8', boxShadow: '0 0 16px rgba(1,77,248,0.8)' }} />
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 20, letterSpacing: '0.24em', color: '#fff' }}>DALILI</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Admin Access
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: 32,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset',
        }}>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              Token d&apos;accès
            </label>
            <input
              ref={inputRef}
              type="password"
              placeholder="••••••••••••••••••••••••••••••••"
              value={token}
              onChange={e => { setToken(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && submit()}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '13px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${error ? 'rgba(255,80,80,0.4)' : 'rgba(255,255,255,0.09)'}`,
                borderRadius: 12, color: '#fff', fontSize: 15,
                outline: 'none', letterSpacing: '0.08em',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => { if (!error) e.currentTarget.style.borderColor = 'rgba(1,77,248,0.5)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = error ? 'rgba(255,80,80,0.4)' : 'rgba(255,255,255,0.09)'; }}
            />
            {error && (
              <div style={{ color: '#f87171', fontSize: 12, marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#f87171', flexShrink: 0, display: 'inline-block' }} />
                {error}
              </div>
            )}
          </div>

          <button
            onClick={submit}
            disabled={loading}
            style={{
              width: '100%', padding: '13px 0',
              background: loading ? 'rgba(1,77,248,0.3)' : 'linear-gradient(135deg,#014df8 0%,#0052cc 100%)',
              border: 'none', borderRadius: 12,
              color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              boxShadow: loading ? 'none' : '0 8px 32px rgba(1,77,248,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Vérification…' : 'Accéder au dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent = '#4d8fff', trend }: {
  label: string; value: number; sub?: string; accent?: string; trend?: number;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, padding: '22px 24px',
      position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${accent}55,transparent)` }} />
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: sub ? 6 : 0 }}>
        <AnimatedNumber value={value} />
      </div>
      {sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 4 }}>{sub}</div>}
      {trend !== undefined && (
        <div style={{ position: 'absolute', top: 22, right: 22, fontSize: 12, color: trend >= 0 ? '#34d399' : '#f87171', fontWeight: 600 }}>
          {trend >= 0 ? '+' : ''}{trend}
        </div>
      )}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const c = STATUS_CFG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px',
      background: c.bg, borderRadius: 100,
      fontSize: 11, color: c.text, fontWeight: 500, letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token,    setToken]    = useState('');
  const [authed,   setAuthed]   = useState(false);
  const [entries,  setEntries]  = useState<Entry[]>([]);
  const [stats,    setStats]    = useState<Stats | null>(null);
  const [count,    setCount]    = useState(0);
  const [page,     setPage]     = useState(0);
  const [filter,   setFilter]   = useState<Status | ''>('');
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchData = useCallback(async (tk: string, pg = 0, st: Status | '' = '', q = '') => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pg), limit: '50' });
    if (st) params.set('status', st);
    if (q)  params.set('search', q);

    const res = await fetch(`/api/admin/waitlist?${params}`, {
      headers: { 'x-admin-token': tk },
    });
    const json = await res.json();
    setEntries(json.data ?? []);
    setCount(json.count ?? 0);
    setStats(json.stats ?? null);
    setLoading(false);
  }, []);

  const handleAuth = async (tk: string) => {
    setToken(tk);
    setAuthed(true);
    await fetchData(tk, 0, '', '');
  };

  const updateStatus = async (id: string, status: Status) => {
    setUpdating(id);
    await fetch('/api/admin/waitlist', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ id, status }),
    });
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    setUpdating(null);
  };

  const remove = async (id: string) => {
    if (!confirm('Supprimer cet inscrit de la waitlist ?')) return;
    await fetch('/api/admin/waitlist', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ id }),
    });
    setEntries(prev => prev.filter(e => e.id !== id));
    setCount(c => c - 1);
  };

  const applyFilter = (f: Status | '') => {
    setFilter(f); setPage(0);
    fetchData(token, 0, f, search);
  };

  const exportCsv = () => {
    const rows = [
      ['Email', 'Source', 'Statut', 'Date inscription'],
      ...entries.map(e => [e.email, e.source, e.status, fmt(e.created_at)]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    a.download = `dalili-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (!authed) return <LoginScreen onAuth={handleAuth} />;

  const totalPages = Math.ceil(count / 50);

  return (
    <div style={{
      minHeight: '100vh', background: '#010510',
      fontFamily: 'var(--font-dm-sans)', color: '#fff',
      backgroundImage: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(1,77,248,0.08) 0%, transparent 60%)',
    }}>
      <style>{`
        .admin-grid-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%,black 0%,transparent 80%);
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 44px;
          flex-wrap: wrap;
          gap: 20px;
        }
        .admin-header-btns {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
          margin-bottom: 40px;
        }
        .filter-outer {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }
        .filter-pills-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 2px;
        }
        .filter-pills {
          display: flex;
          gap: 6px;
          flex-wrap: nowrap;
        }
        .table-head {
          display: grid;
          grid-template-columns: 1fr 110px 120px 150px 130px;
          gap: 12px;
          padding: 12px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .table-row {
          display: grid;
          grid-template-columns: 1fr 110px 120px 150px 130px;
          gap: 12px;
          padding: 13px 24px;
          align-items: center;
          transition: background 0.15s, opacity 0.2s;
        }
        .table-row:hover { background: rgba(255,255,255,0.02); }
        .mobile-label {
          display: none;
          font-size: 10px;
          color: rgba(255,255,255,0.88);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        @media (max-width: 700px) {
          .admin-header {
            flex-direction: column;
            margin-bottom: 28px;
          }
          .admin-header-btns {
            width: 100%;
          }
          .admin-header-btns button {
            flex: 1;
            justify-content: center;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 24px;
          }
          .filter-outer {
            flex-direction: column;
            align-items: stretch;
          }
          .filter-pills-wrap {
            width: 100%;
          }
          .table-head {
            display: none !important;
          }
          .table-row {
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            padding: 16px 18px !important;
          }
          .mobile-label {
            display: block;
          }
          .row-actions-wrap {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          .row-actions-wrap select {
            flex: 1;
          }
        }
      `}</style>

      <div className="admin-grid-overlay" />

      <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(20px, 4vw, 52px)' }}>

        {/* ── Header ── */}
        <div className="admin-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#014df8', boxShadow: '0 0 12px rgba(1,77,248,0.8)' }} />
              <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 18, letterSpacing: '0.22em', color: '#fff' }}>
                DALILI
              </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.70)', letterSpacing: '0.06em' }}>/</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', letterSpacing: '0.08em' }}>Waitlist</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.70)', fontSize: 12, letterSpacing: '0.04em' }}>
              {count > 0 ? `${count} inscrits` : 'Dashboard admin'}
            </div>
          </div>

          <div className="admin-header-btns">
            <button onClick={exportCsv} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10,
              color: 'rgba(255,255,255,0.88)', fontSize: 12, cursor: 'pointer',
              letterSpacing: '0.04em', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Exporter CSV
            </button>
            <button onClick={() => fetchData(token, page, filter, search)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px',
              background: 'rgba(1,77,248,0.1)',
              border: '1px solid rgba(1,77,248,0.28)', borderRadius: 10,
              color: '#4d8fff', fontSize: 12, cursor: 'pointer',
              letterSpacing: '0.04em', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(1,77,248,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(1,77,248,0.1)'; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
              </svg>
              Actualiser
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        {stats && (
          <div className="stats-grid">
            <StatCard label="Total inscrits"    value={stats.total}        accent="#4d8fff" />
            <StatCard label="En attente"        value={stats.pending}      accent="#4d8fff" sub={`${stats.total > 0 ? Math.round(stats.pending / stats.total * 100) : 0}% du total`} />
            <StatCard label="Invités"           value={stats.invited}      accent="#34d399" />
            <StatCard label="Convertis"         value={stats.converted}    accent="#a78bfa" />
            <StatCard label="7 derniers jours"  value={stats.last_7_days}  accent="#fbbf24" />
            <StatCard label="30 derniers jours" value={stats.last_30_days} accent="#f472b6" />
          </div>
        )}

        {/* ── Search + Filters ── */}
        <div className="filter-outer">
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
            <svg style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.85)' }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher un email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchData(token, 0, filter, search)}
              style={{
                width: '100%', boxSizing: 'border-box',
                paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, color: '#fff', fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          {/* Filter pills */}
          <div className="filter-pills-wrap">
            <div className="filter-pills">
              {(['', 'pending', 'invited', 'converted', 'unsubscribed'] as const).map(f => (
                <button
                  key={f || 'all'}
                  onClick={() => applyFilter(f as Status | '')}
                  style={{
                    padding: '7px 16px',
                    background: filter === f ? 'rgba(1,77,248,0.16)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${filter === f ? 'rgba(1,77,248,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 100, color: filter === f ? '#4d8fff' : 'rgba(255,255,255,0.4)',
                    fontSize: 12, cursor: 'pointer', fontWeight: 500, letterSpacing: '0.04em',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                >
                  {f === '' ? 'Tous' : STATUS_CFG[f as Status].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, overflow: 'hidden',
        }}>
          {/* Table head — hidden on mobile */}
          <div className="table-head">
            {['Email', 'Source', 'Statut', 'Inscrit le', 'Actions'].map(h => (
              <span key={h} style={{ fontSize: 10, color: 'rgba(255,255,255,0.88)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                {h}
              </span>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ padding: '48px 0', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', gap: 6 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#014df8',
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
              <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.3} 40%{transform:scale(1);opacity:1} }`}</style>
            </div>
          )}

          {/* Empty */}
          {!loading && entries.length === 0 && (
            <div style={{ padding: '64px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em' }}>
                Aucun inscrit trouvé.
              </div>
            </div>
          )}

          {/* Rows */}
          {!loading && entries.map((e, i) => (
            <div
              key={e.id}
              className="table-row"
              style={{
                borderBottom: i < entries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                opacity: updating === e.id ? 0.35 : 1,
              }}
            >
              {/* Email */}
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.92)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.email}
                </div>
              </div>

              {/* Source */}
              <div>
                <span className="mobile-label">Source</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.70)', letterSpacing: '0.04em' }}>{e.source}</span>
                  {e.source === 'simulateur' && e.simulateur_data && (
                    <span style={{ fontSize: 10, color: 'rgba(77,143,255,0.7)', letterSpacing: '0.04em' }}>
                      {e.simulateur_data.ville} · {e.simulateur_data.budget_estime}€
                    </span>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <span className="mobile-label">Statut</span>
                <StatusBadge status={e.status} />
              </div>

              {/* Date */}
              <div>
                <span className="mobile-label">Inscrit le</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>{fmtShort(e.created_at)}</span>
              </div>

              {/* Actions */}
              <div className="row-actions-wrap">
                <select
                  value={e.status}
                  onChange={ev => updateStatus(e.id, ev.target.value as Status)}
                  style={{
                    padding: '5px 8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 7, color: 'rgba(255,255,255,0.9)',
                    fontSize: 11, cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="pending">pending</option>
                  <option value="invited">invited</option>
                  <option value="converted">converted</option>
                  <option value="unsubscribed">unsubscribed</option>
                </select>
                <button
                  onClick={() => remove(e.id)}
                  title="Supprimer"
                  style={{
                    width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(239,68,68,0.07)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    color: 'rgba(239,68,68,0.5)', cursor: 'pointer',
                    transition: 'all 0.15s', flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.07)'; e.currentTarget.style.color = 'rgba(239,68,68,0.5)'; }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 28 }}>
            <button
              disabled={page === 0}
              onClick={() => { const p = page - 1; setPage(p); fetchData(token, p, filter, search); }}
              style={{
                padding: '8px 20px',
                background: page === 0 ? 'transparent' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 9, color: page === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.55)',
                fontSize: 12, cursor: page === 0 ? 'default' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              ← Précédent
            </button>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.70)', letterSpacing: '0.04em' }}>
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={(page + 1) * 50 >= count}
              onClick={() => { const p = page + 1; setPage(p); fetchData(token, p, filter, search); }}
              style={{
                padding: '8px 20px',
                background: (page + 1) * 50 >= count ? 'transparent' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 9, color: (page + 1) * 50 >= count ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.55)',
                fontSize: 12, cursor: (page + 1) * 50 >= count ? 'default' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              Suivant →
            </button>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{ marginTop: 52, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.60)', letterSpacing: '0.08em' }}>
            DALILI Admin · Session sécurisée
          </div>
        </div>

      </div>
    </div>
  );
}

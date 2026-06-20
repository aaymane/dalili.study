'use client';

import { useState, useCallback } from 'react';

type Status = 'pending' | 'invited' | 'converted' | 'unsubscribed';

interface Entry {
  id: string;
  email: string;
  source: string;
  status: Status;
  created_at: string;
  metadata: Record<string, unknown>;
}

interface Stats {
  total: number;
  pending: number;
  invited: number;
  converted: number;
  last_7_days: number;
  last_30_days: number;
}

const STATUS_COLORS: Record<Status, string> = {
  pending:      'rgba(77,143,255,0.15)',
  invited:      'rgba(99,230,182,0.15)',
  converted:    'rgba(180,130,255,0.15)',
  unsubscribed: 'rgba(255,255,255,0.06)',
};
const STATUS_TEXT: Record<Status, string> = {
  pending:      '#4d8fff',
  invited:      '#63e6b6',
  converted:    '#b482ff',
  unsubscribed: 'rgba(255,255,255,0.3)',
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminPage() {
  const [token,    setToken]    = useState('');
  const [authed,   setAuthed]   = useState(false);
  const [error,    setError]    = useState('');
  const [entries,  setEntries]  = useState<Entry[]>([]);
  const [stats,    setStats]    = useState<Stats | null>(null);
  const [count,    setCount]    = useState(0);
  const [page,     setPage]     = useState(0);
  const [filter,   setFilter]   = useState<Status | ''>('');
  const [loading,  setLoading]  = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchData = useCallback(async (tk: string, pg = 0, st = filter) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pg), limit: '50' });
    if (st) params.set('status', st);

    const res = await fetch(`/api/admin/waitlist?${params}`, {
      headers: { 'x-admin-token': tk },
    });

    if (res.status === 401) { setError('Token invalide.'); setAuthed(false); setLoading(false); return; }

    const json = await res.json();
    setEntries(json.data ?? []);
    setCount(json.count ?? 0);
    setStats(json.stats ?? null);
    setLoading(false);
  }, [filter]);

  const login = async () => {
    if (!token.trim()) return;
    setError('');
    const res = await fetch('/api/admin/waitlist', {
      headers: { 'x-admin-token': token.trim() },
    });
    if (res.status === 401) { setError('Token invalide.'); return; }
    setAuthed(true);
    await fetchData(token.trim(), 0, filter);
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
    if (!confirm('Supprimer cet email ?')) return;
    await fetch('/api/admin/waitlist', {
      method: 'DELETE',
      headers: { 'content-type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ id }),
    });
    setEntries(prev => prev.filter(e => e.id !== id));
    setCount(c => c - 1);
  };

  const applyFilter = (f: Status | '') => {
    setFilter(f);
    setPage(0);
    fetchData(token, 0, f);
  };

  const exportCsv = () => {
    const csv = [
      'email,source,status,date',
      ...entries.map(e =>
        `${e.email},${e.source},${e.status},"${fmt(e.created_at)}"`
      ),
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `dalili-waitlist-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#010510', fontFamily: 'var(--font-dm-sans)',
    }}>
      <div style={{
        width: '100%', maxWidth: 400, padding: 40,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontFamily: 'var(--font-montserrat)', fontWeight: 900,
            fontSize: 24, letterSpacing: '0.2em', color: '#fff', marginBottom: 8,
          }}>DALILI</div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>Admin — Waitlist</div>
        </div>

        <input
          type="password"
          placeholder="Admin token"
          value={token}
          onChange={e => setToken(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, color: '#fff', fontSize: 14,
            outline: 'none', marginBottom: error ? 8 : 16,
          }}
        />

        {error && (
          <div style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 12 }}>{error}</div>
        )}

        <button
          onClick={login}
          style={{
            width: '100%', padding: '12px 0',
            background: 'linear-gradient(135deg,#014df8,#0052cc)',
            border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.04em',
          }}
        >
          Connexion
        </button>
      </div>
    </div>
  );

  // ── Dashboard ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: '#010510',
      fontFamily: 'var(--font-dm-sans)', color: '#fff',
      padding: 'clamp(24px,4vw,48px)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: 22, letterSpacing: '0.2em', color: '#fff' }}>
            DALILI — Admin
          </div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 4 }}>Waitlist Dashboard</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={exportCsv}
            style={{
              padding: '9px 20px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, color: 'rgba(255,255,255,0.7)',
              fontSize: 13, cursor: 'pointer',
            }}
          >
            Exporter CSV
          </button>
          <button
            onClick={() => fetchData(token, page, filter)}
            style={{
              padding: '9px 20px',
              background: 'rgba(1,77,248,0.12)',
              border: '1px solid rgba(1,77,248,0.3)',
              borderRadius: 8, color: '#4d8fff',
              fontSize: 13, cursor: 'pointer',
            }}
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Stats cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
          gap: 16, marginBottom: 36,
        }}>
          {[
            { label: 'Total inscrits',   value: stats.total,      color: '#fff' },
            { label: 'En attente',       value: stats.pending,    color: '#4d8fff' },
            { label: 'Invités',          value: stats.invited,    color: '#63e6b6' },
            { label: 'Convertis',        value: stats.converted,  color: '#b482ff' },
            { label: '7 derniers jours', value: stats.last_7_days, color: '#ffd166' },
            { label: '30 derniers jours',value: stats.last_30_days, color: 'rgba(255,255,255,0.5)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '20px 22px',
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color, marginBottom: 4 }}>
                {value ?? 0}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {(['', 'pending', 'invited', 'converted', 'unsubscribed'] as const).map(f => (
          <button
            key={f || 'all'}
            onClick={() => applyFilter(f as Status | '')}
            style={{
              padding: '6px 16px',
              background: filter === f ? 'rgba(1,77,248,0.18)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${filter === f ? 'rgba(1,77,248,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 100, color: filter === f ? '#4d8fff' : 'rgba(255,255,255,0.45)',
              fontSize: 12, cursor: 'pointer', fontWeight: 500,
            }}
          >
            {f || 'Tous'} {f === '' && count > 0 ? `(${count})` : ''}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, overflow: 'hidden',
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 120px 90px 180px 160px',
          gap: 16, padding: '12px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.3)', fontSize: 11,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <span>Email</span>
          <span>Source</span>
          <span>Statut</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        {loading && (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
            Chargement…
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
            Aucun inscrit trouvé.
          </div>
        )}

        {!loading && entries.map((e, i) => (
          <div
            key={e.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 90px 180px 160px',
              gap: 16, padding: '13px 20px', alignItems: 'center',
              borderBottom: i < entries.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              opacity: updating === e.id ? 0.4 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {e.email}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
              {e.source}
            </span>
            <span>
              <span style={{
                display: 'inline-block',
                padding: '3px 10px',
                background: STATUS_COLORS[e.status],
                borderRadius: 100, fontSize: 11,
                color: STATUS_TEXT[e.status],
                fontWeight: 500, letterSpacing: '0.04em',
              }}>
                {e.status}
              </span>
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              {fmt(e.created_at)}
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <select
                value={e.status}
                onChange={ev => updateStatus(e.id, ev.target.value as Status)}
                style={{
                  padding: '4px 8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6, color: 'rgba(255,255,255,0.6)',
                  fontSize: 11, cursor: 'pointer', flex: 1,
                }}
              >
                <option value="pending">pending</option>
                <option value="invited">invited</option>
                <option value="converted">converted</option>
                <option value="unsubscribed">unsubscribed</option>
              </select>
              <button
                onClick={() => remove(e.id)}
                style={{
                  padding: '4px 10px',
                  background: 'rgba(255,80,80,0.08)',
                  border: '1px solid rgba(255,80,80,0.18)',
                  borderRadius: 6, color: 'rgba(255,100,100,0.7)',
                  fontSize: 11, cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {count > 50 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24 }}>
          <button
            disabled={page === 0}
            onClick={() => { const p = page - 1; setPage(p); fetchData(token, p, filter); }}
            style={{
              padding: '8px 20px',
              background: page === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, color: page === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
              fontSize: 13, cursor: page === 0 ? 'default' : 'pointer',
            }}
          >
            ← Précédent
          </button>
          <span style={{ padding: '8px 12px', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            Page {page + 1} / {Math.ceil(count / 50)}
          </span>
          <button
            disabled={(page + 1) * 50 >= count}
            onClick={() => { const p = page + 1; setPage(p); fetchData(token, p, filter); }}
            style={{
              padding: '8px 20px',
              background: (page + 1) * 50 >= count ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              color: (page + 1) * 50 >= count ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
              fontSize: 13, cursor: (page + 1) * 50 >= count ? 'default' : 'pointer',
            }}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}

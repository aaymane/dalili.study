'use client';

import Link from 'next/link';

// ── Professional SVG icon components ─────────────────────────────────────

function IconCalculator({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10" strokeWidth="2.4" />
      <line x1="12" y1="10" x2="12" y2="10" strokeWidth="2.4" />
      <line x1="16" y1="10" x2="16" y2="10" strokeWidth="2.4" />
      <line x1="8" y1="14" x2="8" y2="14" strokeWidth="2.4" />
      <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2.4" />
      <line x1="16" y1="14" x2="16" y2="14" strokeWidth="2.4" />
      <line x1="8" y1="18" x2="12" y2="18" strokeWidth="2.4" />
      <line x1="16" y1="18" x2="16" y2="18" strokeWidth="2.4" />
    </svg>
  );
}

function IconCalendar({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="14" x2="8" y2="14" strokeWidth="2.4" />
      <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2.4" />
      <line x1="16" y1="14" x2="16" y2="14" strokeWidth="2.4" />
      <line x1="8" y1="18" x2="8" y2="18" strokeWidth="2.4" />
      <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.4" />
    </svg>
  );
}

function IconBarChart({ size = 28, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

const TOOLS = [
  {
    id:     'simulateur',
    href:   '/simulateur',
    accent: '#014DF8',
    Icon:   IconCalculator,
    tag:    '01',
    title:  'Simulateur budget',
    desc:   'Calcule ton budget mensuel exact pour étudier en France. Loyer, nourriture, transport, CAF — personnalisé par ville.',
    points: ['14 villes couvertes', 'Estimation CAF incluse', 'Résultat en 5 questions'],
    cta:    'Calculer mon budget',
    badge:  'Disponible maintenant',
    live:   true,
  },
  {
    id:     'calendrier',
    href:   '/calendrier',
    accent: '#22C55E',
    Icon:   IconCalendar,
    tag:    '02',
    title:  'Calendrier Campus France',
    desc:   'Génère ton planning mois par mois selon ton pays et ta rentrée. TCF, visa, logement CROUS — rien n\'est oublié.',
    points: ['7 pays d\'origine', '3 rentrées disponibles', 'PDF envoyé par email'],
    cta:    'Générer mon calendrier',
    badge:  'Disponible maintenant',
    live:   true,
  },
  {
    id:     'comparer',
    href:   '/comparer',
    accent: '#EFB370',
    Icon:   IconBarChart,
    tag:    '03',
    title:  'Comparateur de villes',
    desc:   'Compare 2 ou 3 villes sur le budget, les universités, l\'emploi et la communauté. Recommandation personnalisée en temps réel.',
    points: ['14 villes comparables', '5 critères clés', 'PDF comparatif par email'],
    cta:    'Comparer les villes',
    badge:  'Disponible maintenant',
    live:   true,
  },
] as const;

export default function ToolsSection() {
  return (
    <section id="outils" aria-label="Outils gratuits DALILI" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,80px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', border: '1px solid rgba(77,143,255,0.25)', borderRadius: 100, background: 'rgba(77,143,255,0.07)', marginBottom: 18 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4d8fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4d8fff' }}>
              Outils gratuits
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(2rem,5vw,3.2rem)', letterSpacing: '0.04em', color: '#ffffff', margin: '0 0 14px', lineHeight: 1.05 }}>
            Prépare ta rentrée<br />{' '}avec les bons outils
          </h2>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'clamp(0.9rem,1.6vw,1rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Simulateur de budget, calendrier personnalisé, comparateur de villes — tout ce dont tu as besoin pour choisir et préparer ta vie en France.
          </p>
        </div>

        {/* Tools grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {TOOLS.map((tool) => (
            <div
              key={tool.id}
              style={{
                position:   'relative',
                background: `linear-gradient(160deg, rgba(${tool.accent === '#014DF8' ? '1,77,248' : tool.accent === '#22C55E' ? '34,197,94' : '239,179,112'},0.09) 0%, rgba(1,5,16,0.95) 100%)`,
                border:     `1px solid rgba(${tool.accent === '#014DF8' ? '1,77,248' : tool.accent === '#22C55E' ? '34,197,94' : '239,179,112'},0.22)`,
                borderRadius: 20,
                overflow:   'hidden',
                display:    'flex',
                flexDirection: 'column',
                opacity:    tool.live ? 1 : 0.7,
              }}
            >
              {/* Top accent bar */}
              <div style={{ height: 3, background: tool.accent, flexShrink: 0 }} />

              <div style={{ padding: 'clamp(24px,3vw,32px)', display: 'flex', flexDirection: 'column', flex: 1 }}>

                {/* Tag + badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)' }}>
                    {tool.tag}
                  </span>
                  <span style={{
                    padding:     '3px 10px',
                    borderRadius: 100,
                    background:  tool.live ? `rgba(${tool.accent === '#014DF8' ? '1,77,248' : tool.accent === '#22C55E' ? '34,197,94' : '239,179,112'},0.12)` : 'rgba(255,255,255,0.06)',
                    border:      `1px solid rgba(${tool.accent === '#014DF8' ? '1,77,248' : tool.accent === '#22C55E' ? '34,197,94' : '239,179,112'},${tool.live ? '0.3' : '0.1'})`,
                    fontFamily:  'var(--font-montserrat)',
                    fontWeight:  700,
                    fontSize:    '0.52rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase' as const,
                    color:        tool.live ? tool.accent : 'rgba(255,255,255,0.35)',
                  }}>
                    {tool.live ? 'Disponible' : 'Bientôt'}
                  </span>
                </div>

                {/* Icon */}
                <div style={{
                  width:        56, height: 56,
                  borderRadius: 14,
                  background:   `rgba(${tool.accent === '#014DF8' ? '1,77,248' : tool.accent === '#22C55E' ? '34,197,94' : '239,179,112'},0.12)`,
                  border:       `1px solid rgba(${tool.accent === '#014DF8' ? '1,77,248' : tool.accent === '#22C55E' ? '34,197,94' : '239,179,112'},0.25)`,
                  display:      'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                  boxShadow:    `0 0 24px rgba(${tool.accent === '#014DF8' ? '1,77,248' : tool.accent === '#22C55E' ? '34,197,94' : '239,179,112'},0.18)`,
                }}>
                  <tool.Icon size={26} color={tool.accent} />
                </div>

                {/* Title */}
                <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: '#ffffff', margin: '0 0 10px', lineHeight: 1.25 }}>
                  {tool.title}
                </h3>

                {/* Description */}
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.87rem', color: 'rgba(255,255,255,0.55)', margin: '0 0 20px', lineHeight: 1.7, flex: 1 }}>
                  {tool.desc}
                </p>

                {/* Features */}
                <div style={{ marginBottom: 24 }}>
                  {tool.points.map(pt => (
                    <div key={pt} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tool.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>{pt}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={tool.href}
                  style={{
                    display:      'inline-flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    gap:          8,
                    padding:      '13px 24px',
                    background:    tool.live ? tool.accent : 'rgba(255,255,255,0.06)',
                    border:       `1px solid ${tool.live ? tool.accent : 'rgba(255,255,255,0.1)'}`,
                    borderRadius:  10,
                    fontFamily:   'var(--font-montserrat)',
                    fontWeight:    700,
                    fontSize:     '0.72rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase' as const,
                    color:         tool.live ? (tool.accent === '#014DF8' ? '#ffffff' : '#050914') : 'rgba(255,255,255,0.35)',
                    textDecoration: 'none',
                    pointerEvents:  tool.live ? 'auto' : 'none',
                  }}
                >
                  {tool.cta}
                  {tool.live && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </Link>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

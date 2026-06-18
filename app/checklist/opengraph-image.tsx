import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Checklist arrivée en France 2026 — PDF gratuit | Dalili';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0f1e 0%, #050914 100%)',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, transparent, #014DF8, transparent)',
          }}
        />

        {/* DALILI badge top-left */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 20px',
            border: '1px solid rgba(1,77,248,0.4)',
            borderRadius: 100,
            background: 'rgba(1,77,248,0.12)',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#014DF8' }} />
          <span style={{ fontFamily: 'sans-serif', fontSize: 14, fontWeight: 700, color: 'rgba(77,143,255,0.9)', letterSpacing: 3 }}>DALILI</span>
        </div>

        {/* PDF GRATUIT badge top-right */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 60,
            display: 'flex',
            padding: '8px 20px',
            border: '1px solid rgba(16,185,129,0.35)',
            borderRadius: 100,
            background: 'rgba(16,185,129,0.1)',
          }}
        >
          <span style={{ fontFamily: 'sans-serif', fontSize: 14, fontWeight: 700, color: 'rgba(52,211,153,0.9)', letterSpacing: 2 }}>PDF GRATUIT</span>
        </div>

        {/* Main title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginBottom: 32 }}>
          <span style={{ fontFamily: 'sans-serif', fontSize: 96, fontWeight: 900, color: '#ffffff', letterSpacing: 4, lineHeight: 1 }}>CHECKLIST</span>
          <span style={{ fontFamily: 'sans-serif', fontSize: 80, fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: 4, lineHeight: 1 }}>ARRIVÉE EN FRANCE</span>
          <span style={{ fontFamily: 'sans-serif', fontSize: 80, fontWeight: 900, color: '#014DF8', letterSpacing: 4, lineHeight: 1 }}>2026</span>
        </div>

        {/* Divider */}
        <div style={{ width: 240, height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 28 }} />

        {/* Sub copy */}
        <p style={{ fontFamily: 'sans-serif', fontSize: 20, color: 'rgba(255,255,255,0.45)', textAlign: 'center', margin: '0 0 32px' }}>
          28 points essentiels · Visa · CAF · Logement · Sécurité sociale
        </p>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { label: '✈️  Avant le départ', color: 'rgba(77,143,255,0.25)', border: 'rgba(77,143,255,0.35)', text: 'rgba(77,143,255,0.9)' },
            { label: '🏠  À l\'arrivée', color: 'rgba(1,77,248,0.2)', border: 'rgba(1,77,248,0.4)', text: 'rgba(100,140,255,0.9)' },
            { label: '📋  3 premiers mois', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.35)', text: 'rgba(52,211,153,0.9)' },
          ].map(pill => (
            <div
              key={pill.label}
              style={{
                display: 'flex',
                padding: '10px 24px',
                border: `1px solid ${pill.border}`,
                borderRadius: 100,
                background: pill.color,
              }}
            >
              <span style={{ fontFamily: 'sans-serif', fontSize: 16, fontWeight: 700, color: pill.text, letterSpacing: 1 }}>{pill.label}</span>
            </div>
          ))}
        </div>

        {/* URL watermark */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: 'sans-serif', fontSize: 16, fontWeight: 700, color: 'rgba(77,143,255,0.45)', letterSpacing: 3 }}>dalili.study</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

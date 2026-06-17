// Next.js file-based OG image convention.
// This file is auto-discovered for every /blog/[slug] route and generates a
// dynamic 1200×630 image injected as <meta property="og:image"> automatically.
import { ImageResponse } from 'next/og';
import { getRawPost } from '@/lib/blog';

export const runtime     = 'nodejs'; // needs fs access via getRawPost
export const size        = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CAT: Record<string, { accent: string; rgb: string }> = {
  Banque:   { accent: '#22C55E', rgb: '34,197,94'    },
  Logement: { accent: '#EFB370', rgb: '239,179,112'  },
  Visa:     { accent: '#4d8fff', rgb: '77,143,255'   },
  Permis:   { accent: '#7C3AED', rgb: '124,58,237'   },
};
const DEFAULT_CAT = { accent: '#4d8fff', rgb: '77,143,255' };

export default async function OgImage({ params }: { params: { slug: string } }) {
  // Defaults used if the post can't be read (e.g. 404 or edge case)
  let title    = 'Dalili — Guide pour étudiants internationaux';
  let category = '';
  let excerpt  = "L'application qui simplifie l'installation des étudiants étrangers en France.";

  try {
    const { frontmatter: fm } = getRawPost(params.slug);
    title    = fm.title;
    category = fm.category ?? '';
    excerpt  = fm.excerpt  ?? '';
  } catch { /* keep defaults */ }

  const cat      = CAT[category] ?? DEFAULT_CAT;
  // Shrink font at ~55 chars to prevent overflow
  const titleSize = title.length > 65 ? 48 : title.length > 50 ? 54 : 62;
  const excerptTrimmed = excerpt.length > 130 ? excerpt.slice(0, 130) + '…' : excerpt;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width:  '100%',
          height: '100%',
          background: '#010510',
          padding: '56px 72px 52px',
          position: 'relative',
          fontFamily: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* ── Category radial glow ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse at 18% 55%, rgba(${cat.rgb},0.22) 0%, transparent 62%)`,
          display: 'flex',
        }} />

        {/* ── Subtle grid ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '1px 72px',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '72px 1px',
          display: 'flex',
        }} />

        {/* ── Top accent bar ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 4,
          background: `linear-gradient(90deg, transparent 0%, ${cat.accent} 35%, rgba(255,255,255,0.6) 50%, ${cat.accent} 65%, transparent 100%)`,
          display: 'flex',
        }} />

        {/* ── Right-side decorative gradient edge ── */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 320,
          background: `linear-gradient(270deg, rgba(${cat.rgb},0.10) 0%, transparent 100%)`,
          display: 'flex',
        }} />

        {/* ── Header row: brand + category badge ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 44,
          zIndex: 1,
        }}>
          {/* Dalili brand */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: cat.accent,
              boxShadow: `0 0 12px ${cat.accent}`,
              display: 'flex',
            }} />
            <span style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.18em',
            }}>
              DALILI
            </span>
          </div>

          {/* Category badge — only shown when category is set */}
          {category ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 22px',
              background: `rgba(${cat.rgb},0.12)`,
              border: `1.5px solid rgba(${cat.rgb},0.50)`,
              borderRadius: 100,
              gap: 8,
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: cat.accent,
                display: 'flex',
              }} />
              <span style={{
                fontSize: 14,
                fontWeight: 700,
                color: cat.accent,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}>
                {category}
              </span>
            </div>
          ) : null}
        </div>

        {/* ── Article title ── */}
        <div style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          zIndex: 1,
        }}>
          <div style={{
            fontSize: titleSize,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.18,
            letterSpacing: '-0.015em',
            maxWidth: 920,
            display: 'flex',
          }}>
            {title}
          </div>
        </div>

        {/* ── Excerpt ── */}
        <div style={{
          fontSize: 21,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.50)',
          lineHeight: 1.55,
          maxWidth: 840,
          marginTop: 28,
          marginBottom: 36,
          zIndex: 1,
          display: 'flex',
        }}>
          {excerptTrimmed}
        </div>

        {/* ── Footer divider ── */}
        <div style={{
          height: 1,
          background: 'rgba(255,255,255,0.08)',
          marginBottom: 24,
          zIndex: 1,
          display: 'flex',
        }} />

        {/* ── Footer row ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1,
        }}>
          <span style={{
            fontSize: 15,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.32)',
            letterSpacing: '0.04em',
          }}>
            dalili.study
          </span>
          <span style={{
            fontSize: 15,
            fontWeight: 500,
            color: `rgba(${cat.rgb},0.65)`,
            letterSpacing: '0.06em',
          }}>
            Guide étudiant international · France
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}

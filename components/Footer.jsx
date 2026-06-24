'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FileText } from 'lucide-react';

const ROW1_ITEMS = [
  'DALILI', '✦', 'TON GUIDE EN FRANCE', '✦', 'MENTORS', '✦',
  'COMMUNAUTÉ', '✦', 'DÉMARCHES', '✦',
];

const ROW2_ITEMS = [
  'Logement', '·', 'CAF', '·', 'Titre de séjour', '·', 'Banque', '·',
  'Sécurité sociale', '·', 'Transport', '·', 'Emploi', '·', 'Culture', '·',
];

function MarqueeRow({ items, reverse = false, speed = 40 }) {
  const doubled = [...items, ...items];
  const animName = reverse ? 'marqueeRight' : 'marqueeLeft';

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div style={{
        display: 'flex',
        width: 'max-content',
        animation: `${animName} ${speed}s linear infinite`,
      }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              whiteSpace: 'nowrap',
              padding: '0 1rem',
              color: reverse ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.88)',
              fontFamily: reverse ? 'var(--font-montserrat)' : 'var(--font-bebas)',
              fontWeight: reverse ? 400 : 400,
              fontSize: reverse ? '0.72rem' : '1.2rem',
              letterSpacing: reverse ? '0.1em' : '0.12em',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{
      position: 'relative',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      paddingBottom: 40,
      overflow: 'hidden',
    }}>
      {/* Marquee rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '32px 0 28px' }}>
        <MarqueeRow items={ROW1_ITEMS} reverse={false} speed={35} />
        <MarqueeRow items={ROW2_ITEMS} reverse={true}  speed={28} />
      </div>

      {/* Divider */}
      <div style={{
        width: '100%',
        height: 1,
        background: 'rgba(255,255,255,0.05)',
        margin: '0 0 28px',
      }} />

      {/* Bottom row */}
      <div className="footer-bottom" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px, 5vw, 60px)',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image
            src="/images/logo-dalili.svg"
            alt="DALILI"
            width={24}
            height={24}
            style={{ display: 'block', opacity: 0.5 }}
          />
          <span style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 700,
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.92)',
            letterSpacing: '0.12em',
          }}>
            DALILI
          </span>
        </div>

        <p style={{
          margin: 0,
          fontFamily: 'var(--font-dm-sans)',
          fontWeight: 400,
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '0.04em',
        }}>
          © {new Date().getFullYear()} Dalili. Tous droits réservés.
        </p>

        <div className="footer-links" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link
            href="/checklist"
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '0.8rem',
              color: '#4d8fff',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(77,143,255,1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(77,143,255,0.8)'; }}
          >
            <FileText size={13} strokeWidth={2} style={{ flexShrink: 0 }} /> Checklist PDF
          </Link>
          {[
            { label: 'Mentions légales',  href: '/mentions-legales' },
            { label: 'Confidentialité',   href: '/confidentialite'  },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.90)',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.90)'; }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

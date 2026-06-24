'use client';

import { useEffect, useState } from 'react';

export default function TableOfContents({ headings }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      entries => {
        // Pick the topmost visible heading
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: '-72px 0px -60% 0px', // fires when heading enters top 40% of viewport
        threshold: 0,
      },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label="Table des matières" style={{ position: 'sticky', top: 100 }}>
      <div style={{
        fontFamily: 'var(--font-montserrat)',
        fontSize: '0.55rem', fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.92)',
        marginBottom: 16,
      }}>
        Sur cette page
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {headings.map(({ id, text, level }) => {
          const isActive = activeId === id;
          return (
            <li key={id} style={{ marginBottom: 2 }}>
              <a
                href={`#${id}`}
                style={{
                  display: 'block',
                  paddingLeft: level === 3 ? 14 : 0,
                  paddingTop: 5, paddingBottom: 5,
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#4d8fff' : 'rgba(255,255,255,0.75)',
                  textDecoration: 'none',
                  lineHeight: 1.4,
                  borderLeft: `2px solid ${isActive ? '#014DF8' : 'rgba(255,255,255,0.07)'}`,
                  paddingLeft: level === 3 ? 18 : 12,
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onClick={e => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                {text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

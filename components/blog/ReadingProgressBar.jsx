'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setPct(total > 0 ? Math.min(100, (scrollTop / total) * 100) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 3, zIndex: 9999,
        background: 'rgba(255,255,255,0.06)',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: 'linear-gradient(90deg, #014DF8, #4d8fff)',
        boxShadow: '0 0 10px rgba(1,77,248,0.7), 0 0 20px rgba(77,143,255,0.3)',
        transition: 'width 0.1s linear',
        transformOrigin: 'left',
      }} />
    </div>
  );
}

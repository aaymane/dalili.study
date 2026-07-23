'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MessageCircle, X } from 'lucide-react';

// Loaded only once the user actually opens the widget — keeps the chat
// logic (fetch/stream handling, message list) out of every page's initial JS.
const AssistantPanel = dynamic(() => import('./AssistantPanel'), { ssr: false });

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={open ? "Fermer l'assistant Dalili" : "Poser une question à l'assistant Dalili"}
        aria-expanded={open}
        className="fixed z-[70] flex items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 active:scale-95"
        style={{
          bottom: 'max(20px, env(safe-area-inset-bottom))',
          right: 'max(20px, env(safe-area-inset-right))',
          width: 56,
          height: 56,
          background: 'linear-gradient(135deg, #014df8 0%, #4d8fff 100%)',
          boxShadow: '0 8px 28px rgba(1,77,248,0.45), 0 0 0 1px rgba(255,255,255,0.08)',
        }}
      >
        {open ? <X size={22} color="#fff" strokeWidth={2.25} /> : <MessageCircle size={22} color="#fff" strokeWidth={2.25} />}
      </button>
      {open && <AssistantPanel onClose={() => setOpen(false)} />}
    </>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, Send, ExternalLink, Sparkles, X } from 'lucide-react';

interface SourceRef {
  title: string;
  url: string;
  category: string | null;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceRef[];
  isFallback?: boolean;
  isError?: boolean;
  pending?: boolean;
}

const STARTER_QUESTIONS = [
  'Quel est le montant du compte bloqué en 2026 ?',
  "Comment obtenir la carte Vitale en tant qu'étudiant étranger ?",
  'Quel score au TCF faut-il pour Campus France ?',
  'Comment trouver un garant pour un logement étudiant ?',
  'Combien coûte la médecine en école privée en France ?',
];

function newId(): string {
  return Math.random().toString(36).slice(2);
}

async function streamAssistantResponse(
  question: string,
  onEvent: (evt: Record<string, unknown>) => void
) {
  const res = await fetch('/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (res.status === 429) {
    onEvent({ type: 'error', message: 'Trop de questions envoyées. Réessaie dans quelques minutes.' });
    return;
  }
  if (!res.ok || !res.body) {
    onEvent({ type: 'error', message: 'Une erreur est survenue, réessaie dans un instant.' });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (line.trim()) onEvent(JSON.parse(line));
    }
  }
  if (buffer.trim()) onEvent(JSON.parse(buffer));
}

export default function AssistantPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || pending) return;

    setInput('');
    setPending(true);
    setMessages(prev => [
      ...prev,
      { id: newId(), role: 'user', content: trimmed },
      { id: newId(), role: 'assistant', content: '', pending: true },
    ]);

    await streamAssistantResponse(trimmed, evt => {
      setMessages(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (evt.type === 'fallback') {
          next[next.length - 1] = {
            ...last,
            pending: false,
            isFallback: true,
            content: String(evt.message ?? "Je n'ai pas cette information dans nos guides."),
            sources: (evt.suggestions as SourceRef[]) ?? [],
          };
        } else if (evt.type === 'text') {
          next[next.length - 1] = { ...last, pending: false, content: String(evt.delta ?? '') };
        } else if (evt.type === 'sources') {
          next[next.length - 1] = { ...last, sources: (evt.sources as SourceRef[]) ?? [] };
        } else if (evt.type === 'error') {
          next[next.length - 1] = {
            ...last,
            pending: false,
            isError: true,
            content: String(evt.message ?? 'Une erreur est survenue.'),
          };
        }
        return next;
      });
    });

    setPending(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Assistant Dalili"
      className="fixed z-[65] flex flex-col overflow-hidden"
      style={{
        // top is pinned below the 64px navbar so the panel never covers it,
        // even on short mobile viewports where 100vh is unreliable (address
        // bar collapse/expand). With both top and bottom set, height is
        // computed to fill exactly the space between them — no maxHeight
        // guesswork needed.
        top: 'calc(env(safe-area-inset-top) + 80px)',
        bottom: 'calc(max(20px, env(safe-area-inset-bottom)) + 72px)',
        right: 'max(16px, env(safe-area-inset-right))',
        width: 'min(400px, calc(100vw - 32px))',
        borderRadius: 20,
        background: 'linear-gradient(180deg, rgba(20,26,54,0.98) 0%, rgba(5,9,20,0.98) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(1,77,248,0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 36, height: 36, background: 'rgba(1,77,248,0.15)' }}
        >
          <Sparkles size={18} color="#4d8fff" />
        </div>
        <div className="min-w-0">
          <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>
            Assistant Dalili
          </p>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)' }}>
            Réponses basées uniquement sur nos guides vérifiés
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer l'assistant"
          className="ml-auto flex items-center justify-center rounded-full shrink-0 transition-colors hover:bg-white/10"
          style={{ width: 28, height: 28 }}
        >
          <X size={16} color="rgba(255,255,255,0.6)" />
        </button>
      </div>

      <div ref={scrollRef} data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>
              Pose une question sur le visa, le budget, le logement ou tes démarches. Quelques idées :
            </p>
            {STARTER_QUESTIONS.map(q => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="text-left transition-colors hover:bg-white/[0.06]"
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '0.82rem',
                  color: 'rgba(255,255,255,0.8)',
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div style={{ maxWidth: '88%' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '0.86rem',
                    lineHeight: 1.6,
                    color: m.role === 'user' ? '#fff' : 'rgba(255,255,255,0.9)',
                    background: m.role === 'user' ? 'rgba(1,77,248,0.25)' : 'rgba(255,255,255,0.05)',
                    border: m.isError ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14,
                    padding: '10px 14px',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {m.pending ? (
                    <span className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      <Loader2 size={14} className="animate-spin" /> Recherche dans nos guides…
                    </span>
                  ) : (
                    m.content
                  )}
                </div>

                {!!m.sources?.length && (
                  <div className="flex flex-col gap-1.5 mt-2">
                    {m.sources.map(s => (
                      <Link
                        key={s.url + s.title}
                        href={s.url}
                        className="flex items-center gap-2 transition-colors hover:bg-white/[0.06]"
                        style={{
                          fontFamily: 'var(--font-dm-sans)',
                          fontSize: '0.76rem',
                          color: '#4d8fff',
                          padding: '8px 12px',
                          borderRadius: 10,
                          border: '1px solid rgba(1,77,248,0.2)',
                          background: 'rgba(1,77,248,0.06)',
                        }}
                      >
                        <ExternalLink size={13} className="shrink-0" />
                        <span className="truncate">{s.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 px-4 py-3 shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Pose ta question…"
          maxLength={300}
          disabled={pending}
          className="flex-1 bg-transparent outline-none"
          style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.86rem', color: '#fff' }}
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          aria-label="Envoyer"
          className="flex items-center justify-center rounded-full shrink-0 disabled:opacity-40 transition-opacity"
          style={{ width: 34, height: 34, background: '#014df8' }}
        >
          <Send size={15} color="#fff" />
        </button>
      </form>

      <p
        style={{
          fontFamily: 'var(--font-dm-sans)',
          fontSize: '0.68rem',
          color: 'rgba(255,255,255,0.3)',
          padding: '0 16px 12px',
          textAlign: 'center',
        }}
      >
        Généré à partir de nos guides — vérifie les infos critiques sur les sources officielles.
      </p>
    </div>
  );
}

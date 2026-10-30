'use client';

// Partnership request form for /partenaires → POST /api/partenaires. Styled by the .pt-* classes of the page.
// Anti-spam handled by the server: a hidden field humans never fill and the time spent on the form.

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import Link from 'next/link';
import { PARTNER_KINDS, PARTNER_KIND_LABEL, PARTNER_LIMITS as L, isPartnerKind, partnerKindRgb, type PartnerKind } from '@/lib/partner-leads';

/** Sent by the « Pour qui » rows of the page: the form takes this type and the visitor lands on it. */
export const PICK_KIND_EVENT = 'dalili:partner-kind';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Fields {
  organization: string;
  kind: PartnerKind | '';
  contactName: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  zone: string;
  message: string;
  consent: boolean;
}

const EMPTY: Fields = {
  organization: '',
  kind: '',
  contactName: '',
  jobTitle: '',
  email: '',
  phone: '',
  website: '',
  zone: '',
  message: '',
  consent: false,
};

/** Same rules as the server, checked first so the visitor gets the message next to the field. */
function check(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.organization.trim().length < 2) e.organization = 'Indiquez le nom de votre organisation.';
  if (!f.kind) e.kind = 'Choisissez le type de votre organisation.';
  if (f.contactName.trim().length < 2) e.contactName = 'Indiquez votre nom.';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Cet email ne semble pas valide.';
  if (f.message.trim().length < L.messageMin) e.message = 'Dites-nous en quelques mots ce que vous imaginez.';
  if (!f.consent) e.consent = 'Cochez cette case pour que nous puissions vous répondre.';
  return e;
}

export default function PartnerForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const startedAt = useRef(0);
  const trap = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    const pick = (e: Event) => {
      const kind = (e as CustomEvent<string>).detail;
      if (isPartnerKind(kind)) setF(prev => ({ ...prev, kind }));
    };
    window.addEventListener(PICK_KIND_EVENT, pick);
    return () => window.removeEventListener(PICK_KIND_EVENT, pick);
  }, []);
  useEffect(() => {
    if (status === 'sent') doneRef.current?.focus();
  }, [status]);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setF(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = check(f);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      const el = e.currentTarget.querySelector<HTMLElement>(first === 'kind' ? 'input[name="kind"]' : `[name="${first}"]`);
      el?.focus();
      return;
    }
    setStatus('sending');
    setServerError('');
    try {
      const res = await fetch('/api/partenaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, website_confirm: trap.current?.value ?? '', startedAt: startedAt.current }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        setStatus('sent');
        return;
      }
      setServerError(json.error ?? 'Envoi impossible pour le moment. Réessayez, ou écrivez à bonjour@dalili.study.');
      setStatus('error');
    } catch {
      setServerError('La connexion a échoué. Vérifiez votre réseau puis réessayez.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="pt-done" role="status">
        <svg className="pt-done-check" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="30" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeWidth="2" />
          <path d="M20 33 l8 8 l16 -18" fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 ref={doneRef} tabIndex={-1} className="pt-done-title">
          Demande envoyée
        </h3>
        <p className="pt-done-text">
          Merci{f.contactName ? `, ${f.contactName.trim().split(' ')[0]}` : ''}. L’équipe a bien reçu la demande de{' '}
          <strong>{f.organization.trim()}</strong> et vous répond en général sous 48&nbsp;h, à l’adresse {f.email.trim()}.
        </p>
      </div>
    );
  }

  const err = (key: keyof Fields) =>
    errors[key] ? (
      <p id={`pt-${key}-err`} className="pt-err">
        {errors[key]}
      </p>
    ) : null;
  const a11y = (key: keyof Fields) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `pt-${key}-err` : undefined,
  });

  return (
    <form className="pt-form" onSubmit={submit} noValidate>
      <div className="pt-field">
        <label htmlFor="pt-organization">Organisation</label>
        <input
          id="pt-organization"
          name="organization"
          autoComplete="organization"
          maxLength={L.organization}
          value={f.organization}
          onChange={e => set('organization', e.target.value)}
          {...a11y('organization')}
        />
        {err('organization')}
      </div>

      <fieldset className="pt-field pt-kinds" {...(errors.kind ? { 'aria-describedby': 'pt-kind-err' } : {})}>
        <legend>Type d’organisation</legend>
        <div className="pt-chips">
          {PARTNER_KINDS.map(k => (
            <label key={k} className="pt-chip" style={{ '--kind-rgb': partnerKindRgb(k) } as CSSProperties}>
              <input type="radio" name="kind" value={k} checked={f.kind === k} onChange={() => set('kind', k)} />
              <span className="pt-chip-dot" aria-hidden="true" />
              <span>{PARTNER_KIND_LABEL[k]}</span>
            </label>
          ))}
        </div>
        {err('kind')}
      </fieldset>

      <div className="pt-row">
        <div className="pt-field">
          <label htmlFor="pt-contactName">Votre nom</label>
          <input
            id="pt-contactName"
            name="contactName"
            autoComplete="name"
            maxLength={L.contactName}
            value={f.contactName}
            onChange={e => set('contactName', e.target.value)}
            {...a11y('contactName')}
          />
          {err('contactName')}
        </div>
        <div className="pt-field">
          <label htmlFor="pt-jobTitle">
            Fonction <span className="pt-opt">facultatif</span>
          </label>
          <input
            id="pt-jobTitle"
            name="jobTitle"
            autoComplete="organization-title"
            maxLength={L.jobTitle}
            value={f.jobTitle}
            onChange={e => set('jobTitle', e.target.value)}
          />
        </div>
      </div>

      <div className="pt-row">
        <div className="pt-field">
          <label htmlFor="pt-email">Email professionnel</label>
          <input
            id="pt-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={L.email}
            value={f.email}
            onChange={e => set('email', e.target.value)}
            {...a11y('email')}
          />
          {err('email')}
        </div>
        <div className="pt-field">
          <label htmlFor="pt-phone">
            Téléphone <span className="pt-opt">facultatif</span>
          </label>
          <input
            id="pt-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={L.phone}
            value={f.phone}
            onChange={e => set('phone', e.target.value)}
          />
        </div>
      </div>

      <div className="pt-row">
        <div className="pt-field">
          <label htmlFor="pt-website">
            Site web <span className="pt-opt">facultatif</span>
          </label>
          <input
            id="pt-website"
            name="website"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://"
            maxLength={L.website}
            value={f.website}
            onChange={e => set('website', e.target.value)}
          />
        </div>
        <div className="pt-field">
          <label htmlFor="pt-zone">
            Ville ou zone <span className="pt-opt">facultatif</span>
          </label>
          <input
            id="pt-zone"
            name="zone"
            placeholder="Lyon, toute la France…"
            maxLength={L.zone}
            value={f.zone}
            onChange={e => set('zone', e.target.value)}
          />
        </div>
      </div>

      <div className="pt-field">
        <label htmlFor="pt-message">Votre idée de partenariat</label>
        <p id="pt-message-hint" className="pt-hint">
          Ce que vous proposez aux étudiants, et ce que vous attendez de Dalili.
        </p>
        <textarea
          id="pt-message"
          name="message"
          rows={5}
          maxLength={L.message}
          value={f.message}
          onChange={e => set('message', e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'pt-message-hint pt-message-err' : 'pt-message-hint'}
        />
        {err('message')}
      </div>

      {/* Left empty by people; robots fill it. */}
      <div className="pt-trap" aria-hidden="true">
        <label htmlFor="pt-website-confirm">Ne pas remplir</label>
        <input ref={trap} id="pt-website-confirm" name="website_confirm" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="pt-field">
        <label className="pt-consent">
          <input type="checkbox" name="consent" checked={f.consent} onChange={e => set('consent', e.target.checked)} {...a11y('consent')} />
          <span>
            J’accepte que Dalili utilise ces informations pour me recontacter au sujet de ce partenariat.{' '}
            <Link href="/confidentialite">Confidentialité</Link>
          </span>
        </label>
        {err('consent')}
      </div>

      {status === 'error' ? (
        <p className="pt-err pt-err-box" role="alert">
          {serverError}
        </p>
      ) : null}

      <button type="submit" className="pt-btn pt-submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
        {status === 'sending' ? 'Envoi en cours…' : 'Envoyer la demande'}
      </button>
    </form>
  );
}

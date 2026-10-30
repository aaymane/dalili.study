'use client';

import type { CSSProperties } from 'react';

import styles from '@/app/partenaires/partenaires.module.css';
import { PICK_KIND_EVENT } from '@/components/PartnerForm';
import { PARTNER_KIND_INFO, type PartnerKind } from '@/lib/partner-leads';

const ICONS: Record<Exclude<PartnerKind, 'autre'>, JSX.Element> = {
  banque: <path d="M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18M12 3l9 5H3l9-5Z" />,
  ecole: <path d="M22 9 12 4 2 9l10 5 10-5Zm-16 2.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />,
  assurance: <path d="M12 3 4 6v6c0 4.4 3.4 8.4 8 9 4.6-.6 8-4.6 8-9V6l-8-3Zm-3 9 2 2 4-4" />,
  logement: <path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6" />,
  mobilite: <path d="M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2" />,
  association: <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6 9c0-3 2.7-5 6-5s6 2 6 5m2-5c3.3 0 6 2 6 5" />,
};

/** « Pour qui » : une ligne par type de partenaire. Un clic descend au formulaire avec ce type déjà choisi. */
export default function PartnerKinds() {
  const pick = (kind: PartnerKind) => {
    window.dispatchEvent(new CustomEvent(PICK_KIND_EVENT, { detail: kind }));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('demande')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => document.getElementById('pt-organization')?.focus({ preventScroll: true }), reduce ? 0 : 700);
  };

  return (
    <div className={styles.kinds}>
      {(Object.keys(PARTNER_KIND_INFO) as Exclude<PartnerKind, 'autre'>[]).map(kind => {
        const k = PARTNER_KIND_INFO[kind];
        return (
          <button
            key={kind}
            type="button"
            className={styles.kindRow}
            style={{ '--kind-rgb': k.rgb } as CSSProperties}
            onClick={() => pick(kind)}
            aria-label={`${k.title} : ${k.offer} Proposer un partenariat`}>
            <span className={styles.kindIcon} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[kind]}
              </svg>
            </span>
            <span className={styles.kindName}>{k.title}</span>
            <span className={styles.kindOffer}>{k.offer}</span>
            <span className={styles.kindMoment}>{k.moment}</span>
            <svg className={styles.kindArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

'use client';

import { motion, useReducedMotion } from 'framer-motion';

import styles from '@/app/partenaires/partenaires.module.css';

/** Le parcours de l'étudiant, de Campus France à la CAF : à chaque étape, le partenaire qui y a sa place. */
const STEPS = [
  { x: 70, y: 46, step: 'Campus France', partner: 'Écoles', rgb: '167,139,250' },
  { x: 312, y: 124, step: 'Visa', partner: 'Assurance voyage', rgb: '52,211,153' },
  { x: 88, y: 204, step: 'Logement', partner: 'Résidences, garant', rgb: '239,179,112' },
  { x: 312, y: 284, step: 'Arrivée', partner: 'Mobilité & télécom', rgb: '34,211,238' },
  { x: 88, y: 364, step: 'Banque', partner: 'Banques', rgb: '77,143,255' },
  { x: 312, y: 444, step: 'Premiers mois', partner: 'Mutuelles, associations', rgb: '244,114,182' },
];
const PATH = 'M70 46 C230 46 312 80 312 124 S88 160 88 204 S312 240 312 284 S88 320 88 364 S312 400 312 444';
const LOOP_S = 7;

export default function JourneyVisual() {
  const reduce = useReducedMotion();
  return (
    <figure className={styles.journey} aria-label="Le parcours d’un étudiant avec DALILI, et le partenaire présent à chaque étape">
      <div className={styles.journeyHead} aria-hidden="true">
        <span>Parcours étudiant</span>
        <span className={styles.live}>
          <span className={styles.liveDot} /> En direct
        </span>
      </div>
      <svg className={styles.journeySvg} viewBox="0 0 400 490" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="pt-path" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fb4ff" />
            <stop offset="55%" stopColor="#4d8fff" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <filter id="pt-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Le chemin : une trace discrète, puis la ligne qui se dessine. */}
        <path d={PATH} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" strokeLinecap="round" />
        <motion.path
          d={PATH}
          fill="none"
          stroke="url(#pt-path)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />

        {STEPS.map((s, i) => {
          const left = s.x < 200;
          const tx = left ? s.x + 22 : s.x - 22;
          const anchor = left ? 'start' : 'end';
          const chipW = Math.round(s.partner.length * 6.3 + 26);
          const chipX = left ? tx : tx - chipW;
          return (
            <g key={s.step}>
              <circle
                className={styles.nodeRing}
                cx={s.x}
                cy={s.y}
                r="11"
                fill="none"
                stroke={`rgb(${s.rgb})`}
                strokeWidth="1.5"
                style={{ animationDuration: `${LOOP_S}s`, animationDelay: `${(i * LOOP_S) / STEPS.length}s` }}
              />
              <circle cx={s.x} cy={s.y} r="11" fill="#070d22" stroke={`rgba(${s.rgb},0.9)`} strokeWidth="2" />
              <circle cx={s.x} cy={s.y} r="4" fill={`rgb(${s.rgb})`} />
              <text x={tx} y={s.y - 4} textAnchor={anchor} fill="#fff" style={{ font: '700 15px var(--font-dm-sans)' }}>
                {s.step}
              </text>
              <g transform={`translate(${chipX} ${s.y + 6})`}>
                {/* Fond opaque d'abord : la ligne du parcours ne se voit pas à travers l'étiquette. */}
                <rect width={chipW} height="22" rx="11" fill="#0a1129" />
                <rect width={chipW} height="22" rx="11" fill={`rgba(${s.rgb},0.14)`} stroke={`rgba(${s.rgb},0.45)`} />
                <circle cx="12" cy="11" r="3" fill={`rgb(${s.rgb})`} />
                <text x="21" y="15" fill={`rgb(${s.rgb})`} style={{ font: '600 11px var(--font-dm-sans)' }}>
                  {s.partner}
                </text>
              </g>
            </g>
          );
        })}

        {/* La lumière qui parcourt le chemin, en boucle (absente si le mouvement est réduit). */}
        {reduce ? null : (
          <circle r="5" fill="#cfe0ff" filter="url(#pt-glow)">
            <animateMotion dur={`${LOOP_S}s`} repeatCount="indefinite" path={PATH} />
          </circle>
        )}
      </svg>
    </figure>
  );
}

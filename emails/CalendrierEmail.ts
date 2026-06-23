import { emailBase, divider, sectionLabel, ctaButton, FONT, SITE, BLUE } from './components/EmailBase';
import type { CalendrierStep, Urgence } from '@/lib/calendrier-data';

const URGENCE_COLOR: Record<Urgence, string> = {
  rouge:  '#dc2626',
  orange: '#d97706',
  vert:   BLUE,
};

const URGENCE_BG: Record<Urgence, string> = {
  rouge:  '#fef2f2',
  orange: '#fffbeb',
  vert:   '#eff6ff',
};

export interface CalendrierEmailProps {
  paysLabel:    string;
  paysEmoji:    string;
  rentreeLabel: string;
  etapes:       CalendrierStep[];
}

function stepCard(step: CalendrierStep, last: boolean): string {
  const color = URGENCE_COLOR[step.urgence];
  const bg    = URGENCE_BG[step.urgence];
  return `
    <div style="border-left:3px solid ${color};padding:14px 16px;background:${bg};border-radius:0 6px 6px 0;margin-bottom:${last ? '0' : '8px'}">
      ${step.isArrivee
        ? `<div style="display:inline-block;padding:2px 10px;background:#fee2e2;border:1px solid #fca5a5;border-radius:100px;margin-bottom:10px">
             <span style="font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#dc2626">Arrivee en France</span>
           </div>`
        : ''}
      <p style="margin:0 0 4px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${color}">${step.mois}</p>
      <p style="margin:0 0 6px;font-family:${FONT};font-size:14px;font-weight:700;color:#0a0a0a;line-height:1.3">${step.action}</p>
      <p style="margin:0${step.lien ? ' 0 8px' : ''};font-family:${FONT};font-size:13px;color:#374151;line-height:1.65">${step.description}</p>
      ${step.lien
        ? `<a href="${step.lien.url}" style="font-family:${FONT};font-size:12px;font-weight:600;color:${BLUE};text-decoration:none">Voir le guide →</a>`
        : ''}
    </div>
  `;
}

export function renderCalendrierEmail(props: CalendrierEmailProps): string {
  const { paysLabel, paysEmoji, rentreeLabel, etapes } = props;

  const content = `
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin-bottom:24px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <span style="font-size:32px;line-height:1">${paysEmoji}</span>
        <div>
          <p style="margin:0 0 2px;font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b7280">Ton calendrier personnalise</p>
          <h1 style="margin:0;font-family:${FONT};font-size:18px;font-weight:700;color:#0a0a0a;line-height:1.2">
            ${paysLabel} - ${rentreeLabel}
          </h1>
        </div>
      </div>
      <p style="margin:0;font-family:${FONT};font-size:13px;color:#374151;line-height:1.65">
        Ton planning mois par mois. Suis ces etapes dans l'ordre pour ne rien rater.
      </p>
    </div>

    ${divider()}

    ${sectionLabel('Ton planning')}

    ${etapes.map((step, i) => stepCard(step, i === etapes.length - 1)).join('')}

    ${divider()}

    <p style="font-family:${FONT};font-size:13px;color:#6b7280;line-height:1.6;margin:0 0 20px">
      Le PDF complet est joint a cet email avec tous les liens cliquables.
    </p>

    ${ctaButton(`${SITE}/calendrier`, 'Voir mon calendrier en ligne')}

    <p style="text-align:center;margin:14px 0 0;font-family:${FONT};font-size:12px;color:#9ca3af">
      PDF en piece jointe &middot; <a href="${SITE}/checklist" style="color:${BLUE};text-decoration:none">Checklist PDF gratuite</a>
    </p>
  `;

  return emailBase(content, `Ton calendrier Campus France ${paysLabel} - ${rentreeLabel}`);
}

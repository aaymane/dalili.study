import { emailBase, divider, sectionLabel, ctaButton, FONT, SITE, BLUE } from './components/EmailBase';
import type { CalendrierStep, Urgence } from '@/lib/calendrier-data';

const URGENCE_COLOR: Record<Urgence, string> = {
  rouge:  '#ef4444',
  orange: '#f59e0b',
  vert:   BLUE,
};

export interface CalendrierEmailProps {
  paysLabel:    string;
  paysEmoji:    string;
  rentreeLabel: string;
  etapes:       CalendrierStep[];
}

function stepCard(step: CalendrierStep, last: boolean): string {
  const color = URGENCE_COLOR[step.urgence];
  return `
    <div style="border-left:3px solid ${color};padding:16px 16px 16px 20px;background:rgba(255,255,255,0.03);border-radius:0 8px 8px 0;margin-bottom:${last ? '0' : '8px'}">
      ${step.isArrivee
        ? `<div style="display:inline-block;padding:2px 10px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.25);border-radius:100px;margin-bottom:10px">
             <span style="font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#ef4444">Arrivée en France</span>
           </div>`
        : ''}
      <p style="margin:0 0 5px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${color}">${step.mois}</p>
      <p style="margin:0 0 8px;font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff;line-height:1.3">${step.action}</p>
      <p style="margin:0${step.lien ? ' 0 10px' : ''};font-family:${FONT};font-size:13px;color:rgba(255,255,255,0.65);line-height:1.65">${step.description}</p>
      ${step.lien
        ? `<a href="${step.lien.url}" style="font-family:${FONT};font-size:12px;font-weight:600;color:${BLUE};text-decoration:none">Voir le guide →</a>`
        : ''}
    </div>
  `;
}

export function renderCalendrierEmail(props: CalendrierEmailProps): string {
  const { paysLabel, paysEmoji, rentreeLabel, etapes } = props;

  const content = `
    <div style="padding:24px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-bottom:28px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <span style="font-size:36px;line-height:1">${paysEmoji}</span>
        <div>
          <p style="margin:0 0 3px;font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4)">Ton calendrier personnalisé</p>
          <h1 style="margin:0;font-family:${FONT};font-size:20px;font-weight:700;color:#ffffff;line-height:1.2">
            ${paysLabel} → ${rentreeLabel} 🗓️
          </h1>
        </div>
      </div>
      <p style="margin:0;font-family:${FONT};font-size:14px;color:rgba(255,255,255,0.65);line-height:1.65">
        Voici ton planning personnalisé mois par mois. Suis ces étapes dans l'ordre pour ne rien rater.
      </p>
    </div>

    ${divider()}

    ${sectionLabel('Ton planning')}

    ${etapes.map((step, i) => stepCard(step, i === etapes.length - 1)).join('')}

    ${divider()}

    ${ctaButton(`${SITE}/calendrier`, 'Voir mon calendrier complet →')}

    <p style="text-align:center;margin:14px 0 0;font-family:${FONT};font-size:12px;color:rgba(255,255,255,0.4)">
      Le PDF est joint à cet email · <a href="${SITE}/checklist" style="color:rgba(77,143,255,0.7);text-decoration:none">Checklist PDF gratuite</a>
    </p>
  `;

  return emailBase(content, `Ton calendrier Campus France ${paysLabel} → ${rentreeLabel} est prêt`);
}

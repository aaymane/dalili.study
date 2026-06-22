import { emailBase, divider, sectionLabel, ctaButton, FONT, SITE, BLUE } from './components/EmailBase';

export interface VilleEmailData {
  nom:           string;
  slug:          string;
  budgetMin:     number;
  budgetMax:     number;
  avantages:     string[];
  inconvenients: string[];
  avis:          string;
  scoreBudget:   number;
  scoreEmploi:   number;
}

export interface ComparateurEmailProps {
  villes:         VilleEmailData[];
  recommandation: string;
  recoVilleNom:   string; // which city is recommended
}

const COLORS = [BLUE, '#22C55E', '#a855f7'];

function starsHtml(score: number, color: string): string {
  const full  = Math.floor(score);
  const half  = score % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const filled = `<span style="color:${color};font-size:13px">&#9733;</span>`;
  const empty_ = `<span style="color:#1e2d4a;font-size:13px">&#9733;</span>`;
  return filled.repeat(full) + (half ? filled : '') + empty_.repeat(empty);
}

function villeCard(v: VilleEmailData, color: string, isReco: boolean): string {
  const top3 = v.avantages.slice(0, 3);
  const top2c = v.inconvenients.slice(0, 2);

  const border = isReco
    ? `border:1px solid rgba(245,158,11,0.4);border-top:3px solid #f59e0b;background:rgba(245,158,11,0.04)`
    : `border:1px solid rgba(255,255,255,0.07);border-top:3px solid ${color};background:rgba(255,255,255,0.03)`;

  return `
    <div style="${border};border-radius:0 0 12px 12px;padding:20px;margin-bottom:16px">
      ${isReco ? `<div style="display:inline-block;padding:2px 10px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);border-radius:100px;margin-bottom:12px"><span style="font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#f59e0b">Recommandation Dalili</span></div>` : ''}
      <h2 style="margin:0 0 4px;font-family:${FONT};font-size:18px;font-weight:700;color:#ffffff">${v.nom}</h2>
      <p style="margin:0 0 12px;font-family:${FONT};font-size:12px;color:rgba(255,255,255,0.45)">${v.budgetMin} – ${v.budgetMax} €/mois</p>

      <table style="border-collapse:collapse;margin-bottom:14px">
        <tr>
          <td style="padding:2px 10px 2px 0;font-family:${FONT};font-size:11px;color:rgba(255,255,255,0.4);width:130px">Budget</td>
          <td>${starsHtml(v.scoreBudget, color)}</td>
        </tr>
        <tr>
          <td style="padding:2px 10px 2px 0;font-family:${FONT};font-size:11px;color:rgba(255,255,255,0.4)">Emploi / Stage</td>
          <td>${starsHtml(v.scoreEmploi, color)}</td>
        </tr>
      </table>

      ${top3.map(a => `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px"><span style="color:#34d399;font-size:12px;font-weight:700;flex-shrink:0">+</span><span style="font-family:${FONT};font-size:12px;color:rgba(255,255,255,0.72);line-height:1.5">${a}</span></div>`).join('')}
      ${top2c.map(c => `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px"><span style="color:#f59e0b;font-size:12px;font-weight:700;flex-shrink:0">-</span><span style="font-family:${FONT};font-size:12px;color:rgba(255,255,255,0.52);line-height:1.5">${c}</span></div>`).join('')}

      <p style="margin:12px 0 14px;font-family:${FONT};font-size:12px;font-style:italic;color:rgba(255,255,255,0.45);line-height:1.65;border-left:2px solid ${color}55;padding-left:10px">
        ${v.avis.slice(0, 220)}${v.avis.length > 220 ? '…' : ''}
      </p>

      <a href="${SITE}/villes/${v.slug}" style="font-family:${FONT};font-size:11px;font-weight:700;color:${color};text-decoration:none">
        Guide complet ${v.nom} →
      </a>
    </div>
  `;
}

export function renderComparateurEmail(props: ComparateurEmailProps): string {
  const { villes, recommandation, recoVilleNom } = props;
  const titreVilles = villes.map(v => v.nom).join(' vs ');

  const content = `
    <div style="padding:24px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;margin-bottom:28px">
      <h1 style="margin:0 0 10px;font-family:${FONT};font-size:20px;font-weight:700;color:#ffffff;line-height:1.25">
        ${titreVilles} — ta comparaison
      </h1>
      <p style="margin:0;font-family:${FONT};font-size:13px;color:rgba(255,255,255,0.55);line-height:1.65">
        Le PDF complet est joint à cet email. Voici l'essentiel pour choisir ta ville d'études en France.
      </p>
    </div>

    ${divider()}

    ${sectionLabel('Comparatif ville par ville')}

    ${villes.map((v, i) => villeCard(v, COLORS[i] ?? COLORS[0], v.nom === recoVilleNom)).join('')}

    ${divider()}

    <div style="border:1px solid rgba(245,158,11,0.35);background:rgba(245,158,11,0.04);border-radius:12px;padding:22px;margin-bottom:28px">
      <p style="margin:0 0 10px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#f59e0b">Recommandation Dalili</p>
      <p style="margin:0;font-family:${FONT};font-size:14px;color:rgba(255,255,255,0.82);line-height:1.7">${recommandation}</p>
    </div>

    ${divider()}

    ${sectionLabel('Guides essentiels')}

    ${[
      { label: 'Budget mensuel étudiant étranger en France 2026', href: `${SITE}/blog/budget-mensuel-etudiant-etranger-france-2026` },
      { label: 'Logement CROUS depuis l\'étranger — dossier social', href: `${SITE}/blog/logement-crous-etudiant-etranger-demande` },
      { label: 'Trouver un logement en France avant d\'arriver', href: `${SITE}/blog/trouver-logement-france-depuis-etranger` },
      { label: 'CAF étudiant étranger — délais, documents, erreurs', href: `${SITE}/blog/caf-etudiant-etranger-delais-documents-erreurs` },
    ].map(link => `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
        <div style="width:5px;height:5px;border-radius:50%;background:${BLUE};flex-shrink:0"></div>
        <a href="${link.href}" style="font-family:${FONT};font-size:13px;color:#4d8fff;text-decoration:none;line-height:1.5">${link.label}</a>
      </div>
    `).join('')}

    <div style="margin-top:24px"></div>

    ${ctaButton(`${SITE}/comparer`, 'Comparer d\'autres villes →')}

    <p style="text-align:center;margin:14px 0 0;font-family:${FONT};font-size:11px;color:rgba(255,255,255,0.3)">
      PDF en pièce jointe &middot;
      <a href="${SITE}/simulateur" style="color:rgba(77,143,255,0.6);text-decoration:none">Simulateur budget</a> &middot;
      <a href="${SITE}/calendrier" style="color:rgba(77,143,255,0.6);text-decoration:none">Calendrier Campus France</a>
    </p>
  `;

  return emailBase(content, `Ta comparaison ${titreVilles} est prête — dalili.study`);
}

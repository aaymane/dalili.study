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
  recoVilleNom:   string;
}

const COLORS       = [BLUE, '#16a34a', '#7c3aed'] as const;
const BORDER_COLORS = ['#bfdbfe', '#bbf7d0', '#ddd6fe'] as const;
const BG_COLORS     = ['#eff6ff', '#f0fdf4', '#faf5ff'] as const;

function starsHtml(score: number, color: string): string {
  const full   = Math.floor(score);
  const half   = score % 1 >= 0.5;
  const empty  = 5 - full - (half ? 1 : 0);
  const filled = `<span style="color:${color};font-size:13px">&#9733;</span>`;
  const empty_ = `<span style="color:#d1d5db;font-size:13px">&#9733;</span>`;
  return filled.repeat(full) + (half ? filled : '') + empty_.repeat(empty);
}

function villeCard(v: VilleEmailData, color: string, borderColor: string, bgColor: string, isReco: boolean): string {
  const top3  = v.avantages.slice(0, 3);
  const top2c = v.inconvenients.slice(0, 2);

  return `
    <div style="background:${isReco ? '#fffbeb' : bgColor};border:1px solid ${isReco ? '#fcd34d' : borderColor};${isReco ? 'border-top:3px solid #f59e0b;' : `border-top:3px solid ${color};`}border-radius:0 0 8px 8px;padding:18px;margin-bottom:14px">
      ${isReco ? `<div style="display:inline-block;padding:2px 10px;background:#fef3c7;border:1px solid #fcd34d;border-radius:100px;margin-bottom:10px"><span style="font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#d97706">Recommandation Dalili</span></div>` : ''}
      <h2 style="margin:0 0 3px;font-family:${FONT};font-size:17px;font-weight:700;color:#0a0a0a">${v.nom}</h2>
      <p style="margin:0 0 12px;font-family:${FONT};font-size:12px;color:#6b7280">${v.budgetMin} – ${v.budgetMax} €/mois</p>

      <table style="border-collapse:collapse;margin-bottom:12px">
        <tr>
          <td style="padding:2px 10px 2px 0;font-family:${FONT};font-size:11px;color:#6b7280;width:130px">Budget</td>
          <td>${starsHtml(v.scoreBudget, color)}</td>
        </tr>
        <tr>
          <td style="padding:2px 10px 2px 0;font-family:${FONT};font-size:11px;color:#6b7280">Emploi / Stage</td>
          <td>${starsHtml(v.scoreEmploi, color)}</td>
        </tr>
      </table>

      ${top3.map(a => `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:5px"><span style="color:#059669;font-size:12px;font-weight:700;flex-shrink:0">+</span><span style="font-family:${FONT};font-size:12px;color:#374151;line-height:1.5">${a}</span></div>`).join('')}
      ${top2c.map(c => `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:5px"><span style="color:#d97706;font-size:12px;font-weight:700;flex-shrink:0">-</span><span style="font-family:${FONT};font-size:12px;color:#6b7280;line-height:1.5">${c}</span></div>`).join('')}

      <p style="margin:10px 0 12px;font-family:${FONT};font-size:12px;font-style:italic;color:#6b7280;line-height:1.65;border-left:2px solid ${color};padding-left:10px">
        ${v.avis.slice(0, 220)}${v.avis.length > 220 ? '...' : ''}
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
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin-bottom:24px">
      <h1 style="margin:0 0 8px;font-family:${FONT};font-size:19px;font-weight:700;color:#0a0a0a;line-height:1.25">
        ${titreVilles}
      </h1>
      <p style="margin:0;font-family:${FONT};font-size:13px;color:#374151;line-height:1.65">
        Le PDF complet est joint a cet email. Voici l'essentiel pour choisir ta ville d'etudes en France.
      </p>
    </div>

    ${divider()}

    ${sectionLabel('Comparatif ville par ville')}

    ${villes.map((v, i) => villeCard(
      v,
      COLORS[i] ?? COLORS[0],
      BORDER_COLORS[i] ?? BORDER_COLORS[0],
      BG_COLORS[i] ?? BG_COLORS[0],
      v.nom === recoVilleNom,
    )).join('')}

    ${divider()}

    <div style="border:1px solid #fcd34d;background:#fffbeb;border-radius:8px;padding:20px;margin-bottom:24px">
      <p style="margin:0 0 8px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#d97706">Recommandation Dalili</p>
      <p style="margin:0;font-family:${FONT};font-size:14px;color:#374151;line-height:1.7">${recommandation}</p>
    </div>

    ${divider()}

    ${sectionLabel('Guides essentiels')}

    ${[
      { label: 'Budget mensuel etudiant etranger en France 2026', href: `${SITE}/blog/budget-mensuel-etudiant-etranger-france-2026` },
      { label: "Logement CROUS depuis l'etranger — dossier social", href: `${SITE}/blog/logement-crous-etudiant-etranger-demande` },
      { label: "Trouver un logement en France avant d'arriver",    href: `${SITE}/blog/trouver-logement-france-depuis-etranger` },
      { label: 'CAF etudiant etranger — delais, documents, erreurs', href: `${SITE}/blog/caf-etudiant-etranger-delais-documents-erreurs` },
    ].map(link => `
      <div style="padding:10px 0;border-bottom:1px solid #e5e7eb">
        <a href="${link.href}" style="font-family:${FONT};font-size:13px;color:${BLUE};text-decoration:none;font-weight:500">${link.label} →</a>
      </div>
    `).join('')}

    <div style="margin-top:20px"></div>

    ${ctaButton(`${SITE}/comparer`, 'Comparer d\'autres villes')}

    <p style="text-align:center;margin:14px 0 0;font-family:${FONT};font-size:11px;color:#9ca3af">
      PDF en piece jointe &middot;
      <a href="${SITE}/simulateur" style="color:${BLUE};text-decoration:none">Simulateur budget</a> &middot;
      <a href="${SITE}/calendrier" style="color:${BLUE};text-decoration:none">Calendrier Campus France</a>
    </p>
  `;

  return emailBase(content, `Comparatif ${titreVilles} — ta recommandation Dalili`);
}

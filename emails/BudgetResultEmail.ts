import { emailBase, divider, sectionLabel, card, ctaButton, FONT, SITE, BLUE, BLUE2 } from './components/EmailBase';

const CVEC_ANNUAL = 105;

const PAYS_ARTICLES: Record<string, { label: string; url: string }[]> = {
  maroc: [
    { label: 'Guide visa étudiant France — Maroc',         url: `${SITE}/blog/visa-etudiant-france-maroc-2026` },
    { label: 'Campus France Maroc — guide complet',        url: `${SITE}/blog/campusfrance-maroc-guide-complet` },
  ],
  algerie: [
    { label: "Guide visa étudiant France — Algérie",       url: `${SITE}/blog/visa-etudiant-france-algerie-2026` },
    { label: 'Campus France Algérie — guide CEF',          url: `${SITE}/blog/campusfrance-algerie-guide-entretien-2026` },
  ],
  tunisie: [
    { label: 'Étudier en France depuis la Tunisie',        url: `${SITE}/pays/etudier-en-france-depuis-tunisie` },
  ],
  senegal: [
    { label: 'Guide visa étudiant France — Sénégal',       url: `${SITE}/blog/visa-etudiant-france-senegal-2026` },
    { label: 'Campus France Sénégal — guide Dakar',        url: `${SITE}/blog/campusfrance-senegal-guide-inscription-dakar` },
  ],
  'cote-ivoire': [
    { label: "Étudier en France depuis la Côte d'Ivoire",  url: `${SITE}/pays/etudier-en-france-depuis-cote-ivoire` },
  ],
  cameroun: [
    { label: 'Étudier en France depuis le Cameroun',       url: `${SITE}/pays/etudier-en-france-depuis-cameroun` },
  ],
};

const COMMON_ARTICLES = [
  { label: 'Logement CROUS étudiant étranger',             url: `${SITE}/blog/logement-crous-etudiant-etranger-demande` },
  { label: 'CAF étudiant étranger — délais et erreurs',    url: `${SITE}/blog/caf-etudiant-etranger-delais-documents-erreurs` },
  { label: 'Checklist arrivée en France — PDF gratuit',    url: `${SITE}/checklist` },
];

export interface BudgetResultEmailProps {
  villeName:       string;
  logementName:    string;
  niveauName:      string;
  paysName:        string;
  paySlug:         string;
  paiement_frais:  'unique' | 'mensuel';
  housing:         number;
  food:            number;
  transport:       number;
  tuitionMonthly:  number;
  tuitionAnnual:   number;
  cvecMonthly:     number;
  totalDepenses:   number;
  cafEstimee:      number;
  resteAFinancer:  number;
}

function tableRow(label: string, value: string, last = false, green = false, italic = false): string {
  const border = last ? 'none' : '1px solid rgba(255,255,255,0.06)';
  const color  = green ? '#34d399' : italic ? 'rgba(255,255,255,0.5)' : '#ffffff';
  const fontStyle = italic ? 'italic' : 'normal';
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:${border};font-family:${FONT};font-size:14px;color:rgba(255,255,255,0.65);font-style:${fontStyle};width:60%">${label}</td>
      <td style="padding:12px 0;border-bottom:${border};font-family:${FONT};font-size:14px;font-weight:500;color:${color};text-align:right;font-style:${fontStyle}">${value}</td>
    </tr>
  `;
}

function articleLink(a: { label: string; url: string }, last = false): string {
  return `
    <a href="${a.url}" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;text-decoration:none;margin-bottom:${last ? '20px' : '8px'}">
      <span style="font-family:${FONT};font-size:14px;font-weight:500;color:rgba(255,255,255,0.8)">${a.label}</span>
      <span style="color:${BLUE};font-size:16px;flex-shrink:0">→</span>
    </a>
  `;
}

export function renderBudgetResultEmail(props: BudgetResultEmailProps): string {
  const {
    villeName, logementName, niveauName, paysName, paySlug,
    paiement_frais, housing, food, transport,
    tuitionMonthly, tuitionAnnual, cvecMonthly,
    totalDepenses, cafEstimee, resteAFinancer,
  } = props;

  const isMensuel  = paiement_frais === 'mensuel';
  const fraisTotal = tuitionAnnual + CVEC_ANNUAL;
  const articles   = [...(PAYS_ARTICLES[paySlug] ?? []), ...COMMON_ARTICLES].slice(0, 4);
  const tuitionMensuelNoCV = tuitionMonthly - cvecMonthly;

  const content = `

    <!-- Header card -->
    ${card(`
      <h1 style="margin:0 0 12px;font-family:${FONT};font-size:24px;font-weight:700;color:#ffffff;line-height:1.25">
        Ton budget pour étudier à ${villeName} est prêt 💰
      </h1>
      <p style="margin:0;font-family:${FONT};font-size:15px;color:rgba(255,255,255,0.65);line-height:1.6">
        Estimation personnalisée pour un étudiant en
        <strong style="color:rgba(255,255,255,0.85)">${niveauName}</strong>
        depuis ${paysName}.
      </p>
    `)}

    ${divider()}

    <!-- Budget breakdown -->
    ${sectionLabel(`Budget mensuel estimé${isMensuel ? ' (tout compris)' : ''}`)}

    <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
      <tbody>
        ${tableRow(`Loyer (${logementName})`, `${housing} €`)}
        ${tableRow('Nourriture', `${food} €`)}
        ${tableRow('Transport', `${transport} €`)}
        ${tableRow('Téléphone', '30 €')}
        ${tableRow('Santé (mutuelle)', '20 €')}
        ${tableRow('Loisirs & divers', '80 €', !isMensuel)}
        ${isMensuel ? tableRow("Frais d'inscription (÷12)", `${tuitionMonthly} €`, true, false, true) : ''}
      </tbody>
    </table>

    <!-- Total row -->
    <div style="background:rgba(255,255,255,0.06);border-radius:8px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <span style="font-family:${FONT};font-size:16px;font-weight:700;color:#ffffff">TOTAL DÉPENSES</span>
      <span style="font-family:${FONT};font-size:16px;font-weight:700;color:#ffffff">${totalDepenses} €/mois</span>
    </div>

    <!-- CAF row -->
    <div style="padding:12px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.06)">
      <span style="font-family:${FONT};font-size:14px;color:rgba(255,255,255,0.65)">CAF estimée</span>
      <span style="font-family:${FONT};font-size:14px;font-weight:600;color:#34d399">−${cafEstimee} €</span>
    </div>

    <!-- Reste à financer -->
    <div style="background:rgba(1,77,248,0.12);border:1px solid rgba(1,77,248,0.3);border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:28px">
      <span style="font-family:${FONT};font-size:16px;font-weight:700;color:#ffffff">RESTE À FINANCER</span>
      <span style="font-family:${FONT};font-size:18px;font-weight:700;color:${BLUE2}">${resteAFinancer} €/mois</span>
    </div>

    <!-- Frais d'inscription -->
    ${!isMensuel ? card(`
      <p style="margin:0 0 14px;font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(167,139,250,0.9)">
        🎓 Frais d'inscription — Paiement unique à la rentrée
      </p>
      <table style="width:100%;border-collapse:collapse">
        <tbody>
          ${tableRow(niveauName, `${tuitionAnnual} €`)}
          ${tableRow('+ CVEC', `${CVEC_ANNUAL} €`)}
        </tbody>
      </table>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0 0;border-top:1px solid rgba(255,255,255,0.06);margin-top:4px">
        <span style="font-family:${FONT};font-size:15px;font-weight:700;color:#ffffff">Total frais d'inscription</span>
        <span style="font-family:${FONT};font-size:16px;font-weight:700;color:rgba(167,139,250,0.9)">${fraisTotal} €</span>
      </div>
      <p style="margin:14px 0 0;font-family:${FONT};font-size:12px;color:rgba(255,255,255,0.45);line-height:1.6">
        La plupart des universités exonèrent les étudiants hors UE. Vérifiez sur le site de votre université avant de budgéter.
      </p>
    `, 'background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.2);margin-bottom:28px') : ''}

    ${isMensuel ? card(`
      <p style="margin:0 0 14px;font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(167,139,250,0.9)">
        🎓 Frais d'inscription — Répartis sur 12 mois
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
        <tbody>
          ${tableRow(`${niveauName} (÷12)`, `${tuitionMensuelNoCV} €/mois`)}
          ${tableRow('+ CVEC (÷12)', `${cvecMonthly} €/mois`, true)}
        </tbody>
      </table>
      <div style="padding:14px;background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.2);border-radius:8px">
        <p style="margin:0;font-family:${FONT};font-size:12px;color:rgba(255,255,255,0.6);line-height:1.65">
          ⚠️ <strong style="color:rgba(255,255,255,0.85)">Note :</strong>
          Les frais se paient en une seule fois à la rentrée (${fraisTotal} €).
          La vue mensuelle est uniquement pour t'aider à planifier ton épargne.
        </p>
      </div>
    `, 'background:rgba(139,92,246,0.06);border:1px solid rgba(139,92,246,0.2);margin-bottom:28px') : ''}

    ${divider()}

    ${sectionLabel('Tes prochaines étapes')}

    ${articles.map((a, i) => articleLink(a, i === articles.length - 1)).join('')}

    ${ctaButton(`${SITE}/blog`, 'Voir tous les guides DALILI →')}

    <p style="text-align:center;margin:14px 0 0;font-family:${FONT};font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6">
      Des questions ? La communauté DALILI répond à tes questions.
    </p>
  `;

  return emailBase(content, `Ton budget mensuel à ${villeName} : ${totalDepenses} €/mois 💰`);
}

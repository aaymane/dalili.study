import { emailBase, divider, sectionLabel, ctaButton, FONT, SITE, BLUE } from './components/EmailBase';

const CVEC_ANNUAL = 105;

const PAYS_ARTICLES: Record<string, { label: string; url: string }[]> = {
  maroc: [
    { label: 'Guide visa etudiant France — Maroc',         url: `${SITE}/blog/visa-etudiant-france-maroc-2026` },
    { label: 'Campus France Maroc — guide complet',        url: `${SITE}/blog/campusfrance-maroc-guide-complet` },
  ],
  algerie: [
    { label: "Guide visa etudiant France — Algerie",       url: `${SITE}/blog/visa-etudiant-france-algerie-2026` },
    { label: 'Campus France Algerie — guide CEF',          url: `${SITE}/blog/campusfrance-algerie-guide-entretien-2026` },
  ],
  tunisie: [
    { label: 'Etudier en France depuis la Tunisie',        url: `${SITE}/pays/etudier-en-france-depuis-tunisie` },
  ],
  senegal: [
    { label: 'Guide visa etudiant France — Senegal',       url: `${SITE}/blog/visa-etudiant-france-senegal-2026` },
    { label: 'Campus France Senegal — guide Dakar',        url: `${SITE}/blog/campusfrance-senegal-guide-inscription-dakar` },
  ],
  'cote-ivoire': [
    { label: "Etudier en France depuis la Cote d'Ivoire",  url: `${SITE}/pays/etudier-en-france-depuis-cote-ivoire` },
  ],
  cameroun: [
    { label: 'Etudier en France depuis le Cameroun',       url: `${SITE}/pays/etudier-en-france-depuis-cameroun` },
  ],
};

const COMMON_ARTICLES = [
  { label: 'Logement CROUS etudiant etranger',             url: `${SITE}/blog/logement-crous-etudiant-etranger-demande` },
  { label: 'CAF etudiant etranger — delais et erreurs',    url: `${SITE}/blog/caf-etudiant-etranger-delais-documents-erreurs` },
  { label: 'Checklist arrivee en France — PDF gratuit',    url: `${SITE}/checklist` },
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

function tableRow(label: string, value: string, last = false, highlight: 'green' | 'blue' | null = null, muted = false): string {
  const border    = last ? 'none' : '1px solid #e5e7eb';
  const valueColor = highlight === 'green' ? '#059669' : highlight === 'blue' ? BLUE : muted ? '#9ca3af' : '#0a0a0a';
  const labelColor = muted ? '#9ca3af' : '#6b7280';
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:${border};font-family:${FONT};font-size:14px;color:${labelColor};width:60%">${label}</td>
      <td style="padding:10px 0;border-bottom:${border};font-family:${FONT};font-size:14px;font-weight:600;color:${valueColor};text-align:right">${value}</td>
    </tr>
  `;
}

function articleLink(a: { label: string; url: string }, last = false): string {
  return `
    <a href="${a.url}" style="display:block;padding:12px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;text-decoration:none;margin-bottom:${last ? '20px' : '8px'}">
      <span style="font-family:${FONT};font-size:14px;font-weight:500;color:#0a0a0a">${a.label} <span style="color:${BLUE}">→</span></span>
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

  const isMensuel          = paiement_frais === 'mensuel';
  const fraisTotal         = tuitionAnnual + CVEC_ANNUAL;
  const articles           = [...(PAYS_ARTICLES[paySlug] ?? []), ...COMMON_ARTICLES].slice(0, 4);
  const tuitionMensuelNoCV = tuitionMonthly - cvecMonthly;

  const content = `

    <!-- Intro card -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin-bottom:24px">
      <h1 style="margin:0 0 10px;font-family:${FONT};font-size:20px;font-weight:700;color:#0a0a0a;line-height:1.25">
        Ton budget a ${villeName} est pret
      </h1>
      <p style="margin:0;font-family:${FONT};font-size:14px;color:#374151;line-height:1.6">
        Estimation personnalisee pour un etudiant en
        <strong>${niveauName}</strong> depuis ${paysName}.
      </p>
    </div>

    ${sectionLabel(`Depenses mensuelles${isMensuel ? ' (tout compris)' : ''}`)}

    <!-- Budget table -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <tbody>
        ${tableRow(`Loyer (${logementName})`, `${housing} €`)}
        ${tableRow('Nourriture', `${food} €`)}
        ${tableRow('Transport', `${transport} €`)}
        ${tableRow('Telephone', '30 €')}
        ${tableRow('Loisirs, divers & sante', '100 €', !isMensuel)}
        ${isMensuel ? tableRow("Frais d'inscription (÷12)", `${tuitionMonthly} €`, true, null, true) : ''}
      </tbody>
    </table>

    <!-- Total row -->
    <div style="background:#f3f4f6;border-radius:6px;padding:14px 16px;margin-bottom:8px">
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="font-family:${FONT};font-size:15px;font-weight:700;color:#0a0a0a">TOTAL DEPENSES</td>
          <td style="font-family:${FONT};font-size:15px;font-weight:700;color:#0a0a0a;text-align:right">${totalDepenses} €/mois</td>
        </tr>
      </table>
    </div>

    <!-- CAF row -->
    <div style="padding:10px 16px;margin-bottom:8px">
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="font-family:${FONT};font-size:14px;color:#6b7280">CAF estimee (aide logement)</td>
          <td style="font-family:${FONT};font-size:14px;font-weight:600;color:#059669;text-align:right">-${cafEstimee} €</td>
        </tr>
      </table>
    </div>

    <!-- Reste a financer — blue highlight -->
    <div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:6px;padding:16px;margin-bottom:28px">
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="font-family:${FONT};font-size:15px;font-weight:700;color:#0a0a0a">RESTE A FINANCER</td>
          <td style="font-family:${FONT};font-size:17px;font-weight:700;color:${BLUE};text-align:right">${resteAFinancer} €/mois</td>
        </tr>
      </table>
    </div>

    <!-- Frais d'inscription section -->
    ${!isMensuel ? `
    <div style="background:#faf5ff;border:1px solid #ddd6fe;border-radius:8px;padding:20px;margin-bottom:28px">
      <p style="margin:0 0 14px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7c3aed">
        Frais d'inscription — Paiement unique a la rentree
      </p>
      <table style="width:100%;border-collapse:collapse">
        <tbody>
          ${tableRow(niveauName, `${tuitionAnnual} €`)}
          ${tableRow('+ CVEC', `${CVEC_ANNUAL} €`, true)}
        </tbody>
      </table>
      <div style="display:flex;justify-content:space-between;padding-top:12px;margin-top:4px;border-top:1px solid #e5e7eb">
        <span style="font-family:${FONT};font-size:14px;font-weight:700;color:#0a0a0a">Total frais d'inscription</span>
        <span style="font-family:${FONT};font-size:15px;font-weight:700;color:#7c3aed">${fraisTotal} €</span>
      </div>
      <div style="margin-top:14px;padding:12px;background:#fef3c7;border-left:3px solid #f59e0b;border-radius:0 4px 4px 0">
        <p style="margin:0;font-family:${FONT};font-size:12px;color:#374151;line-height:1.6">
          La plupart des universites exonerent les etudiants hors UE. Verifiez sur le site de votre universite.
        </p>
      </div>
    </div>
    ` : ''}

    ${isMensuel ? `
    <div style="background:#faf5ff;border:1px solid #ddd6fe;border-radius:8px;padding:20px;margin-bottom:28px">
      <p style="margin:0 0 14px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7c3aed">
        Frais d'inscription — Repartis sur 12 mois
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
        <tbody>
          ${tableRow(`${niveauName} (÷12)`, `${tuitionMensuelNoCV} €/mois`)}
          ${tableRow('+ CVEC (÷12)', `${cvecMonthly} €/mois`, true)}
        </tbody>
      </table>
      <div style="padding:12px;background:#fef3c7;border-left:3px solid #f59e0b;border-radius:0 4px 4px 0">
        <p style="margin:0;font-family:${FONT};font-size:12px;color:#374151;line-height:1.65">
          Les frais se paient en une seule fois a la rentree (${fraisTotal} €). La vue mensuelle est pour planifier ton epargne.
        </p>
      </div>
    </div>
    ` : ''}

    ${divider()}

    ${sectionLabel('Tes prochaines etapes')}

    ${articles.map((a, i) => articleLink(a, i === articles.length - 1)).join('')}

    ${ctaButton(`${SITE}/blog`, 'Voir tous les guides DALILI')}

    <p style="text-align:center;margin:16px 0 0;font-family:${FONT};font-size:12px;color:#9ca3af;line-height:1.6">
      Des questions ? Explore dalili.study
    </p>
  `;

  return emailBase(content, `Budget ${villeName} : ${totalDepenses} €/mois — estimation personnalisee`);
}

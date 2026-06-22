import { emailBase, divider, sectionLabel, card, ctaButton, FONT, SITE, BLUE } from './components/EmailBase';

const ARTICLES = [
  {
    emoji: '🛂',
    title: 'Visa étudiant France Maroc',
    url:   `${SITE}/blog/visa-etudiant-france-maroc-2026`,
  },
  {
    emoji: '🏠',
    title: 'Logement CROUS étudiant étranger',
    url:   `${SITE}/blog/logement-crous-etudiant-etranger-demande`,
  },
  {
    emoji: '💶',
    title: 'CAF étudiant étranger',
    url:   `${SITE}/blog/caf-etudiant-etranger-delais-documents-erreurs`,
  },
];

function articleCard(a: typeof ARTICLES[0], last: boolean): string {
  return `
    <a href="${a.url}" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px;background:rgba(1,77,248,0.08);border:1px solid rgba(1,77,248,0.2);border-radius:8px;text-decoration:none;margin-bottom:${last ? '0' : '10px'}">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:18px">${a.emoji}</span>
        <span style="font-family:${FONT};font-size:14px;font-weight:500;color:rgba(255,255,255,0.85)">${a.title}</span>
      </div>
      <span style="color:${BLUE};font-size:16px;flex-shrink:0">→</span>
    </a>
  `;
}

export function renderChecklistEmail(): string {
  const content = `
    ${card(`
      <h1 style="margin:0 0 20px;font-family:${FONT};font-size:24px;font-weight:700;color:#ffffff;line-height:1.25">
        Ta checklist est prête 📋
      </h1>
      <p style="margin:0 0 14px;font-family:${FONT};font-size:16px;color:rgba(255,255,255,0.75);line-height:1.7">
        Voici ta checklist complète pour préparer ton arrivée en France.
      </p>
      <p style="margin:0;font-family:${FONT};font-size:16px;color:rgba(255,255,255,0.75);line-height:1.7">
        Garde ce PDF précieusement — il contient toutes les démarches dans le bon ordre.
      </p>
    `)}

    <div style="margin:28px 0">
      ${ctaButton(`${SITE}/api/checklist`, 'Télécharger ma checklist →')}
    </div>

    ${divider()}

    ${sectionLabel('À lire aussi')}

    ${ARTICLES.map((a, i) => articleCard(a, i === ARTICLES.length - 1)).join('')}
  `;

  return emailBase(content, 'Ta checklist arrivée en France est prête — 32 démarches dans le bon ordre 📋');
}

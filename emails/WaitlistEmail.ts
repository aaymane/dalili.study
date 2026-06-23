import { emailBase, divider, sectionLabel, card, ctaButton, bulletPoint, FONT, SITE, BLUE } from './components/EmailBase';

export function renderWaitlistEmail(): string {
  const content = `
    ${card(`
      <h1 style="margin:0 0 16px;font-family:${FONT};font-size:22px;font-weight:700;color:#0a0a0a;line-height:1.25">
        Bienvenue dans la communaute DALILI
      </h1>
      <p style="margin:0 0 14px;font-family:${FONT};font-size:16px;color:#374151;line-height:1.7">Salam,</p>
      <p style="margin:0 0 14px;font-family:${FONT};font-size:16px;color:#374151;line-height:1.7">
        Tu viens de rejoindre <strong style="color:#0a0a0a">DALILI</strong> — la plateforme gratuite pour les etudiants
        internationaux qui veulent etudier en France.
      </p>
      <p style="margin:0;font-family:${FONT};font-size:16px;color:#374151;line-height:1.7">
        Tu seras parmi les premiers a acceder a nos nouvelles fonctionnalites.
      </p>
    `)}

    ${divider()}

    ${sectionLabel("Ce qui t'attend")}

    ${bulletPoint('Guides visa, logement, CAF — verifies sur sources officielles')}
    ${bulletPoint('Simulateur de budget personnalise par ville')}
    ${bulletPoint('Calendrier personnalise Campus France')}
    ${bulletPoint('Comparateur de villes interactif')}

    ${divider()}

    ${ctaButton(SITE, 'Explorer dalili.study')}

    <p style="text-align:center;margin:14px 0 0;font-family:${FONT};font-size:12px;color:#9ca3af">
      Gratuit - Toujours
    </p>

    <div style="margin-top:24px;padding:16px;background:#eff6ff;border-left:3px solid ${BLUE};border-radius:0 6px 6px 0">
      <p style="margin:0;font-family:${FONT};font-size:13px;color:#374151;line-height:1.6">
        <strong style="color:#0a0a0a">En attendant</strong>, tu peux deja utiliser nos outils gratuits :
        <a href="${SITE}/simulateur" style="color:${BLUE};text-decoration:none;font-weight:600">simulateur de budget</a>,
        <a href="${SITE}/calendrier" style="color:${BLUE};text-decoration:none;font-weight:600">calendrier Campus France</a>
        et <a href="${SITE}/comparer" style="color:${BLUE};text-decoration:none;font-weight:600">comparateur de villes</a>.
      </p>
    </div>
  `;

  return emailBase(content, 'Bienvenue chez Dalili — tu es sur la liste');
}

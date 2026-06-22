import { emailBase, divider, sectionLabel, card, ctaButton, bulletPoint, FONT, SITE } from './components/EmailBase';

export function renderWaitlistEmail(): string {
  const content = `
    ${card(`
      <h1 style="margin:0 0 20px;font-family:${FONT};font-size:24px;font-weight:700;color:#ffffff;line-height:1.25">
        Bienvenue dans la communauté DALILI 🎓
      </h1>
      <p style="margin:0 0 14px;font-family:${FONT};font-size:16px;color:rgba(255,255,255,0.75);line-height:1.7">Salam,</p>
      <p style="margin:0 0 14px;font-family:${FONT};font-size:16px;color:rgba(255,255,255,0.75);line-height:1.7">
        Tu viens de rejoindre <strong style="color:#ffffff">DALILI</strong> — la plateforme gratuite pour les étudiants
        internationaux qui veulent étudier en France.
      </p>
      <p style="margin:0;font-family:${FONT};font-size:16px;color:rgba(255,255,255,0.75);line-height:1.7">
        Tu seras parmi les premiers à accéder à nos nouvelles fonctionnalités.
      </p>
    `)}

    ${divider()}

    ${sectionLabel("Ce qui t'attend")}

    ${bulletPoint('Guides visa, logement, CAF — vérifiés sur sources officielles')}
    ${bulletPoint('Simulateur de budget personnalisé')}
    ${bulletPoint('Mentors qui ont fait le même parcours')}

    ${divider()}

    ${ctaButton(SITE, 'Explorer dalili.study →')}

    <p style="text-align:center;margin:12px 0 0;font-family:${FONT};font-size:12px;color:rgba(255,255,255,0.4)">
      Gratuit · Toujours
    </p>
  `;

  return emailBase(content, 'Bienvenue dans la communauté DALILI — tu es sur la liste 🎓');
}

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM     = "Dalili <bonjour@dalili.study>";
const ADMIN    = "boyayman388@gmail.com";
const SITE     = "https://dalili.study";

const VILLE_LABELS: Record<string, string> = {
  'etudier-a-bordeaux':        'Bordeaux',
  'etudier-a-paris':           'Paris',
  'etudier-a-nantes':          'Nantes',
  'etudier-a-lyon':            'Lyon',
  'etudier-a-toulouse':        'Toulouse',
  'etudier-a-marseille':       'Marseille',
  'etudier-a-nice':            'Nice',
  'etudier-a-rennes':          'Rennes',
  'etudier-a-grenoble':        'Grenoble',
  'etudier-a-clermont-ferrand':'Clermont-Ferrand',
  'etudier-a-montpellier':     'Montpellier',
  'etudier-a-strasbourg':      'Strasbourg',
  'etudier-a-lille':           'Lille',
  'etudier-a-dijon':           'Dijon',
};

const LOGEMENT_LABELS: Record<string, string> = {
  crous:    'Résidence CROUS',
  coloc:    'Colocation',
  studio:   'Studio privé',
  habitant: "Chez l'habitant",
};

const NIVEAU_LABELS: Record<string, string> = {
  licence:  'Licence (L1-L3)',
  master:   'Master (M1-M2)',
  doctorat: 'Doctorat',
};

const PAYS_LABELS: Record<string, string> = {
  maroc:       'Maroc',
  algerie:     'Algérie',
  tunisie:     'Tunisie',
  senegal:     'Sénégal',
  'cote-ivoire': "Côte d'Ivoire",
  cameroun:    'Cameroun',
  autre:       'Autre',
};

const PAYS_GUIDES: Record<string, { label: string; url: string }[]> = {
  maroc: [
    { label: 'Visa étudiant France depuis le Maroc', url: `${SITE}/blog/visa-etudiant-france-maroc-2026` },
    { label: 'Campus France Maroc — guide complet', url: `${SITE}/blog/campusfrance-maroc-guide-complet` },
  ],
  algerie: [
    { label: 'Visa étudiant France depuis l\'Algérie', url: `${SITE}/blog/visa-etudiant-france-algerie-2026` },
    { label: 'Campus France Algérie — guide CEF', url: `${SITE}/blog/campusfrance-algerie-guide-entretien-2026` },
  ],
  tunisie: [
    { label: 'Étudier en France depuis la Tunisie', url: `${SITE}/pays/etudier-en-france-depuis-tunisie` },
  ],
  senegal: [
    { label: 'Visa étudiant France depuis le Sénégal', url: `${SITE}/blog/visa-etudiant-france-senegal-2026` },
    { label: 'Campus France Sénégal — guide', url: `${SITE}/blog/campusfrance-senegal-guide-inscription-dakar` },
  ],
  'cote-ivoire': [
    { label: "Étudier en France depuis la Côte d'Ivoire", url: `${SITE}/pays/etudier-en-france-depuis-cote-ivoire` },
  ],
  cameroun: [
    { label: 'Étudier en France depuis le Cameroun', url: `${SITE}/pays/etudier-en-france-depuis-cameroun` },
  ],
  autre: [],
};

const COMMON_GUIDES = [
  { label: 'Logement CROUS étudiant étranger', url: `${SITE}/blog/logement-crous-etudiant-etranger-demande` },
  { label: 'CAF étudiant étranger : délais et documents', url: `${SITE}/blog/caf-etudiant-etranger-delais-documents-erreurs` },
  { label: 'Checklist arrivée en France 2026 — PDF gratuit', url: `${SITE}/checklist` },
];

function buildBudgetEmail({
  ville, logement, niveau, pays,
  housing, food, transport, tuition, total, cafMid, reste,
}: {
  ville: string; logement: string; niveau: string; pays: string;
  housing: number; food: number; transport: number; tuition: number;
  total: number; cafMid: number; reste: number;
}) {
  const villeName   = VILLE_LABELS[ville]   ?? ville;
  const logementStr = LOGEMENT_LABELS[logement] ?? logement;
  const niveauStr   = NIVEAU_LABELS[niveau]  ?? niveau;
  const paysStr     = PAYS_LABELS[pays]      ?? pays;
  const paysGuides  = PAYS_GUIDES[pays]      ?? [];
  const allGuides   = [...paysGuides, ...COMMON_GUIDES];

  const row = (label: string, value: string) =>
    `<tr>
       <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.5);font-size:13px;width:52%">${label}</td>
       <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.82);font-size:13px;font-weight:500;text-align:right">${value}</td>
     </tr>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Ton budget pour étudier en France — Dalili</title>
</head>
<body style="margin:0;padding:24px 0;background:#06080f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <div style="max-width:580px;margin:0 auto">

    <!-- Header -->
    <div style="background:linear-gradient(145deg,#010d2e 0%,#01040f 100%);border-radius:20px 20px 0 0;border:1px solid rgba(1,77,248,0.25);border-bottom:none;padding:40px 40px 32px;text-align:center;position:relative;overflow:hidden">
      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(1,77,248,0.8),rgba(77,143,255,1),rgba(1,77,248,0.8),transparent)"></div>
      <div style="position:absolute;top:-40px;left:50%;transform:translateX(-50%);width:300px;height:200px;background:radial-gradient(ellipse at center,rgba(1,77,248,0.16) 0%,transparent 70%);border-radius:50%;pointer-events:none"></div>
      <div style="position:relative">
        <div style="font-size:28px;font-weight:900;letter-spacing:0.22em;color:#fff;margin-bottom:10px">DALILI</div>
        <div style="width:36px;height:2px;background:linear-gradient(90deg,transparent,rgba(77,143,255,0.8),transparent);margin:0 auto 12px"></div>
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.45);letter-spacing:0.08em">dalili.study</p>
      </div>
    </div>

    <!-- Body -->
    <div style="background:#010510;border:1px solid rgba(1,77,248,0.18);border-top:none;border-bottom:none;padding:44px 40px">

      <!-- Greeting -->
      <p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#fff;line-height:1.25">
        Ton budget est prêt 📚
      </p>
      <p style="margin:0 0 36px;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.75">
        Voici ton estimation personnalisée pour étudier à <strong style="color:#fff">${villeName}</strong>
        en tant qu'étudiant(e) en <strong style="color:#fff">${niveauStr}</strong>.
      </p>

      <!-- Situation -->
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px 24px;margin-bottom:28px">
        <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.3)">Ta situation</p>
        <table style="width:100%;border-collapse:collapse">
          ${row('Ville', villeName)}
          ${row('Logement', logementStr)}
          ${row('Niveau', niveauStr)}
          ${row('Pays d\'origine', paysStr)}
        </table>
      </div>

      <!-- Budget breakdown -->
      <div style="background:rgba(1,77,248,0.06);border:1px solid rgba(77,143,255,0.18);border-radius:14px;padding:24px 28px;margin-bottom:28px">
        <p style="margin:0 0 16px;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(77,143,255,0.8)">💰 Budget mensuel estimé</p>
        <table style="width:100%;border-collapse:collapse">
          ${row('Loyer', `${housing} €`)}
          ${row('Frais de scolarité (mensuel)', `${tuition} €`)}
          ${row('Nourriture', `${food} €`)}
          ${row('Transport', `${transport} €`)}
          ${row('Téléphone', '30 €')}
          ${row('Santé (mutuelle)', '20 €')}
          ${row('Loisirs & divers', '80 €')}
        </table>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;padding-top:12px;border-top:1px solid rgba(77,143,255,0.2)">
          <tr>
            <td style="padding:8px 0;color:rgba(255,255,255,0.9);font-size:14px;font-weight:700">Total dépenses</td>
            <td style="padding:8px 0;color:#4d8fff;font-size:20px;font-weight:800;text-align:right">${total} €</td>
          </tr>
        </table>
      </div>

      <!-- CAF -->
      <div style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.18);border-radius:14px;padding:24px 28px;margin-bottom:32px">
        <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(34,197,94,0.8)">🏛 APL / CAF (estimation)</p>
        <table style="width:100%;border-collapse:collapse">
          ${row('APL estimée', logement !== 'habitant' ? `−${cafMid} €/mois` : 'Non éligible')}
        </table>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;padding-top:12px;border-top:1px solid rgba(34,197,94,0.15)">
          <tr>
            <td style="padding:8px 0;color:rgba(255,255,255,0.9);font-size:14px;font-weight:700">Reste à financer</td>
            <td style="padding:8px 0;color:#22C55E;font-size:20px;font-weight:800;text-align:right">~${reste} €</td>
          </tr>
        </table>
        <p style="margin:14px 0 0;font-size:11px;color:rgba(255,255,255,0.28);line-height:1.6">
          ⚠️ Estimation indicative. Montant réel calculé sur
          <a href="https://www.caf.fr" style="color:rgba(34,197,94,0.6)">caf.fr</a>.
          Varie selon ton loyer exact et tes ressources.
        </p>
      </div>

      <!-- Prochaines étapes -->
      <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.28)">📋 Tes prochaines étapes</p>
      ${allGuides.map(g => `
        <a href="${g.url}" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;text-decoration:none;margin-bottom:8px">
          <span style="font-size:13px;font-weight:500;color:rgba(255,255,255,0.75)">${g.label}</span>
          <span style="color:rgba(77,143,255,0.6);font-size:16px;flex-shrink:0">→</span>
        </a>
      `).join('')}

      <!-- CTA -->
      <div style="text-align:center;margin:36px 0 28px">
        <a href="${SITE}/#waitlist"
           style="display:inline-block;background:linear-gradient(135deg,#014df8 0%,#4d8fff 100%);color:#fff;text-decoration:none;padding:15px 36px;border-radius:100px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;box-shadow:0 0 32px rgba(1,77,248,0.4)">
          Rejoindre DALILI →
        </a>
      </div>

      <div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:28px"></div>
      <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.4);line-height:1.8">
        À très bientôt,<br>
        <strong style="color:rgba(255,255,255,0.7)">L'équipe Dalili</strong> 🇫🇷
      </p>
    </div>

    <!-- Footer -->
    <div style="background:rgba(1,4,16,0.9);border:1px solid rgba(1,77,248,0.12);border-top:1px solid rgba(255,255,255,0.05);border-radius:0 0 20px 20px;padding:20px 40px;text-align:center">
      <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.2)">
        Tu reçois cet email car tu as utilisé le simulateur budget sur
        <a href="${SITE}" style="color:rgba(77,143,255,0.5);text-decoration:none">dalili.study</a>
      </p>
      <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.12)">
        © ${new Date().getFullYear()} Dalili — Paris, France
      </p>
    </div>

  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email    = String(body.email    ?? '').trim().toLowerCase();
    const ville    = String(body.ville    ?? '').trim();
    const logement = String(body.logement ?? '').trim();
    const niveau   = String(body.niveau   ?? '').trim();
    const pays     = String(body.pays     ?? '').trim();
    const bourse   = String(body.bourse   ?? '').trim();
    const housing  = Number(body.housing  ?? 0);
    const food     = Number(body.food     ?? 0);
    const transport = Number(body.transport ?? 0);
    const tuition  = Number(body.tuition  ?? 0);
    const total    = Number(body.total    ?? 0);
    const cafMid   = Number(body.cafMid   ?? 0);
    const reste    = Number(body.reste    ?? 0);

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'Email invalide.' }, { status: 400 });
    }

    const simulateur_data = {
      ville: VILLE_LABELS[ville] ?? ville,
      logement: LOGEMENT_LABELS[logement] ?? logement,
      niveau: NIVEAU_LABELS[niveau] ?? niveau,
      pays: PAYS_LABELS[pays] ?? pays,
      bourse,
      budget_estime: total,
      caf_estimee: cafMid,
      reste,
    };

    // ── Save to Supabase ──────────────────────────────────────────────────
    const { error: dbError } = await supabaseAdmin
      .from('waitlist')
      .upsert(
        { email, source: 'simulateur', simulateur_data },
        { onConflict: 'email', ignoreDuplicates: false }
      );

    if (dbError) {
      console.error('[simulateur] Supabase error:', dbError.message);
    }

    // ── Send emails via Resend ────────────────────────────────────────────
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[simulateur] RESEND_API_KEY not set');
      return NextResponse.json({ ok: true }); // Non-blocking
    }

    const resend    = new Resend(apiKey);
    const villeName = VILLE_LABELS[ville] ?? ville;
    const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

    try {
      await Promise.all([
        // Admin notification
        resend.emails.send({
          from:    FROM,
          to:      ADMIN,
          subject: `[Simulateur] Budget calculé — ${email} · ${villeName} · ${total}€/mois`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;background:#010510;color:#fff;border-radius:12px;border:1px solid rgba(1,77,248,0.3);overflow:hidden">
              <div style="background:linear-gradient(135deg,#014df8,#0a1628);padding:24px 28px">
                <span style="font-size:18px;font-weight:900;letter-spacing:0.18em;color:#fff">DALILI</span>
                <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.55)">Simulation budget complétée</p>
              </div>
              <div style="padding:28px">
                <table style="width:100%;border-collapse:collapse">
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px;width:120px">Email</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#4d8fff;font-size:13px;font-weight:600">${email}</td></tr>
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Ville</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);font-size:13px">${villeName}</td></tr>
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Logement</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);font-size:13px">${LOGEMENT_LABELS[logement] ?? logement}</td></tr>
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Budget total</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#4d8fff;font-size:15px;font-weight:700">${total} €/mois</td></tr>
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">CAF estimée</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#22C55E;font-size:13px">−${cafMid} €</td></tr>
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Reste financer</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);font-size:13px">${reste} €</td></tr>
                  <tr><td style="padding:9px 0;color:rgba(255,255,255,0.4);font-size:12px">Date</td><td style="padding:9px 0;color:rgba(255,255,255,0.6);font-size:12px">${timestamp}</td></tr>
                </table>
              </div>
            </div>
          `,
        }),

        // Budget email to user
        resend.emails.send({
          from:    FROM,
          to:      email,
          subject: `Ton budget pour étudier en France est prêt 📚`,
          html:    buildBudgetEmail({ ville, logement, niveau, pays, housing, food, transport, tuition, total, cafMid, reste }),
        }),
      ]);

      console.log('[simulateur] Emails sent:', email, villeName, total);
    } catch (resendErr) {
      console.error('[simulateur] Resend error:', JSON.stringify(resendErr, null, 2));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[simulateur]', err);
    return NextResponse.json({ ok: false, error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { renderBudgetResultEmail } from "@/emails/BudgetResultEmail";
import { generateSimulateurPDF } from "@/lib/simulateur-pdf";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM     = "Dalili <bonjour@dalili.study>";
const ADMIN    = "boyayman388@gmail.com";

const VILLE_LABELS: Record<string, string> = {
  'etudier-a-bordeaux':         'Bordeaux',
  'etudier-a-paris':            'Paris',
  'etudier-a-nantes':           'Nantes',
  'etudier-a-lyon':             'Lyon',
  'etudier-a-toulouse':         'Toulouse',
  'etudier-a-marseille':        'Marseille',
  'etudier-a-nice':             'Nice',
  'etudier-a-rennes':           'Rennes',
  'etudier-a-grenoble':         'Grenoble',
  'etudier-a-clermont-ferrand': 'Clermont-Ferrand',
  'etudier-a-montpellier':      'Montpellier',
  'etudier-a-strasbourg':       'Strasbourg',
  'etudier-a-lille':            'Lille',
  'etudier-a-dijon':            'Dijon',
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
  maroc:         'Maroc',
  algerie:       'Algérie',
  tunisie:       'Tunisie',
  senegal:       'Sénégal',
  'cote-ivoire': "Côte d'Ivoire",
  cameroun:      'Cameroun',
  autre:         'Autre',
};

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 ROUTE SIMULATEUR APPELÉE');
    const body = await request.json();
    console.log('📦 Body complet:', JSON.stringify(body));

    const email          = String(body.email          ?? '').trim().toLowerCase();
    console.log('📧 Email extrait:', email || '⚠️ UNDEFINED/VIDE');
    const ville          = String(body.ville          ?? '').trim();
    const logement       = String(body.logement       ?? '').trim();
    const niveau         = String(body.niveau         ?? '').trim();
    const paiement_frais = String(body.paiement_frais ?? 'unique').trim() as 'unique' | 'mensuel';
    const pays           = String(body.pays           ?? '').trim();
    const bourse         = String(body.bourse         ?? '').trim();
    const housing        = Number(body.housing        ?? 0);
    const food           = Number(body.food           ?? 0);
    const transport      = Number(body.transport      ?? 0);
    const tuitionMonthly = Number(body.tuitionMonthly ?? 0);
    const tuitionAnnual  = Number(body.tuitionAnnual  ?? 0);
    const cvecMonthly    = Number(body.cvecMonthly    ?? 0);
    const total          = Number(body.total          ?? 0);
    const cafMid         = Number(body.cafMid         ?? 0);
    const reste          = Number(body.reste          ?? 0);

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'Email invalide.' }, { status: 400 });
    }

    const villeName    = VILLE_LABELS[ville]    ?? ville;
    const logementName = LOGEMENT_LABELS[logement] ?? logement;
    const niveauName   = NIVEAU_LABELS[niveau]  ?? niveau;
    const paysName     = PAYS_LABELS[pays]      ?? pays;

    // ── Save to Supabase ──────────────────────────────────────────────────
    const simulateur_data = {
      ville: villeName, logement: logementName,
      niveau: niveauName, pays: paysName, bourse,
      budget_estime: total, caf_estimee: cafMid, reste,
    };

    const { error: dbError } = await supabaseAdmin
      .from('waitlist')
      .upsert(
        { email, source: 'simulateur', simulateur_data },
        { onConflict: 'email', ignoreDuplicates: false }
      );

    if (dbError) console.error('[simulateur] Supabase error:', dbError.message);

    // ── Send emails via Resend ────────────────────────────────────────────
    const apiKey = process.env.RESEND_API_KEY;
    console.log('🔑 RESEND_API_KEY présente:', apiKey ? `oui (${apiKey.slice(0,8)}...)` : '❌ NON — manquante');
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY non définie — email non envoyé');
      return NextResponse.json({ ok: false, success: false, error: 'RESEND_API_KEY non configurée.' }, { status: 500 });
    }

    const resend    = new Resend(apiKey);
    const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

    try {
      console.log('🔄 Génération PDF...');
      const pdfBuffer = await generateSimulateurPDF({
        villeName, logementName, niveauName, paysName, paySlug: pays,
        paiement_frais, housing, food, transport,
        tuitionMonthly, tuitionAnnual, cvecMonthly,
        totalDepenses: total, cafEstimee: cafMid, resteAFinancer: reste,
      });

      console.log('✅ PDF généré:', pdfBuffer.length, 'bytes');
      console.log('📤 Envoi Resend vers:', email);

      const [adminResult, userResult] = await Promise.all([

        // ── Admin notification ────────────────────────────────────────────
        resend.emails.send({
          from:    FROM,
          to:      ADMIN,
          subject: `[Simulateur] Budget — ${email} · ${villeName} · ${total}€/mois`,
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
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Logement</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);font-size:13px">${logementName}</td></tr>
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Niveau</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);font-size:13px">${niveauName}</td></tr>
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Pays</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);font-size:13px">${paysName}</td></tr>
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Paiement frais</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);font-size:13px">${paiement_frais}</td></tr>
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Budget total</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#4d8fff;font-size:15px;font-weight:700">${total} €/mois</td></tr>
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">CAF estimée</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#22C55E;font-size:13px">−${cafMid} €</td></tr>
                  <tr><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Reste financer</td><td style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);font-size:13px">${reste} €</td></tr>
                  <tr><td style="padding:9px 0;color:rgba(255,255,255,0.4);font-size:12px">Date</td><td style="padding:9px 0;color:rgba(255,255,255,0.6);font-size:12px">${timestamp}</td></tr>
                </table>
              </div>
            </div>
          `,
        }),

        // ── Budget email to user (template + PDF joint) ──────────────────
        resend.emails.send({
          from:    FROM,
          to:      email,
          subject: `Budget etudiant a ${villeName} — estimation Dalili`,
          headers: {
            'X-Entity-Ref-ID':  `dalili-budget-${Date.now()}`,
            'List-Unsubscribe': '<mailto:unsubscribe@dalili.study?subject=unsubscribe>',
          },
          text: `Dalili — Budget etudiant a ${villeName}\n\nLoyer : ${housing} €\nNourriture : ${food} €\nTransport : ${transport} €\nTotal depenses : ${total} €/mois\nCAF estimee : -${cafMid} €\nReste a financer : ${reste} €/mois\n\nRetrouve ton estimation complete sur : dalili.study/simulateur\n\n— L'equipe Dalili`,
          html:    renderBudgetResultEmail({
            villeName, logementName, niveauName, paysName, paySlug: pays,
            paiement_frais, housing, food, transport,
            tuitionMonthly, tuitionAnnual, cvecMonthly,
            totalDepenses:  total,
            cafEstimee:     cafMid,
            resteAFinancer: reste,
          }),
          attachments: [
            {
              filename:    `budget-dalili-${villeName.toLowerCase().replace(/\s+/g, '-')}-2026.pdf`,
              content:     pdfBuffer.toString('base64'),
              contentType: 'application/pdf',
            },
          ],
        }),

      ]);

      console.log('✅ Resend admin result:', JSON.stringify(adminResult));
      console.log('✅ Resend user result:', JSON.stringify(userResult));
      console.log('✅ Emails envoyés à:', email, '| Ville:', villeName, '| Budget:', total, '€');
    } catch (resendErr: unknown) {
      const msg = resendErr instanceof Error ? resendErr.message : JSON.stringify(resendErr);
      console.error('❌ Erreur Resend:', msg);
      return NextResponse.json({ ok: false, success: false, error: `Erreur envoi email: ${msg}` }, { status: 500 });
    }

    console.log('🏁 Route terminée — ok:true envoyé au client');
    return NextResponse.json({ ok: true, success: true });
  } catch (err) {
    console.error('[simulateur]', err);
    return NextResponse.json({ ok: false, success: false, error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

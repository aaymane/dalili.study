import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { CITIES } from '@/lib/cities';
import { getScores, recommander } from '@/lib/comparer-scores';
import { generateComparateurPDF } from '@/lib/comparer-pdf';
import { renderComparateurEmail } from '@/emails/ComparateurEmail';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM     = 'Dalili <bonjour@dalili.study>';
const ADMIN    = 'boyayman388@gmail.com';

const VILLE_COLORS = ['#014DF8', '#22C55E', '#a855f7'];

function buildRecommandation(slugs: string[], recoSlug: string): string {
  const recoCity  = CITIES[recoSlug];
  const recoScore = getScores(recoSlug);
  if (!recoCity) return '';

  const budgetOk   = recoScore.budget >= 4;
  const emploiOk   = recoScore.emploi >= 4;
  const meteoOk    = recoScore.meteo >= 4.5;
  const commuOk    = recoScore.communaute >= 4;

  const reasons: string[] = [];
  if (budgetOk)  reasons.push('son excellent rapport qualité/coût pour les étudiants');
  if (emploiOk)  reasons.push('ses nombreuses opportunités de stages et d\'emploi');
  if (meteoOk)   reasons.push('son cadre de vie exceptionnel et son climat');
  if (commuOk)   reasons.push('l\'intégration naturelle facilitée par une grande communauté');

  const reasonStr = reasons.length > 0
    ? reasons.slice(0, 2).join(' et ')
    : 'son équilibre entre budget, qualité académique et qualité de vie';

  const others = slugs
    .filter(s => s !== recoSlug)
    .map(s => CITIES[s]?.name)
    .filter(Boolean)
    .join(' et ');

  return `Parmi ${others ? `${others} et ` : ''}${recoCity.name}, notre analyse recommande **${recoCity.name}** pour ${reasonStr}. Budget mensuel estimé : ${recoCity.monthlyBudgetMin} – ${recoCity.monthlyBudgetMax} €/mois. ${recoCity.avis.slice(0, 200)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json();
    const email  = String(body.email  ?? '').trim().toLowerCase();
    const villesParam: string[] = Array.isArray(body.villes)
      ? body.villes.map((v: unknown) => String(v).trim())
      : [];

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'Email invalide.' }, { status: 400 });
    }

    // Validate slugs (1-3 cities)
    const slugs = villesParam
      .filter(s => CITIES[s])
      .slice(0, 3);

    if (slugs.length < 1) {
      return NextResponse.json({ ok: false, error: 'Aucune ville valide.' }, { status: 400 });
    }

    const recoSlug      = recommander(slugs);
    const recoCity      = CITIES[recoSlug];
    const recommandation = buildRecommandation(slugs, recoSlug);

    // ── Save to Supabase ─────────────────────────────────────────────────
    const { error: dbError } = await supabaseAdmin
      .from('waitlist')
      .upsert(
        {
          email,
          source: 'comparateur',
          simulateur_data: { villes: slugs.map(s => CITIES[s]?.name) },
        },
        { onConflict: 'email', ignoreDuplicates: false }
      );

    if (dbError) console.error('[comparer] Supabase error:', dbError.message);

    // ── Send emails ──────────────────────────────────────────────────────
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[comparer] RESEND_API_KEY not set');
      return NextResponse.json({ ok: true });
    }

    const resend    = new Resend(apiKey);
    const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

    try {
      // Build PDF data
      const villesPDFData = slugs.map((slug, idx) => ({
        city:     CITIES[slug]!,
        scores:   getScores(slug),
        color:    VILLE_COLORS[idx] ?? VILLE_COLORS[0],
        recoBest: slug === recoSlug,
      }));

      const pdfBuffer = await generateComparateurPDF(villesPDFData, recommandation);

      // Build email data
      const villesEmailData = slugs.map((slug) => {
        const city   = CITIES[slug]!;
        const scores = getScores(slug);
        return {
          nom:           city.name,
          slug:          city.slug,
          budgetMin:     city.monthlyBudgetMin,
          budgetMax:     city.monthlyBudgetMax,
          avantages:     city.pros,
          inconvenients: city.cons,
          avis:          city.avis,
          scoreBudget:   scores.budget,
          scoreEmploi:   scores.emploi,
        };
      });

      const titreVilles = villesEmailData.map(v => v.nom).join(' vs ');

      await Promise.all([

        // ── Admin notification ───────────────────────────────────────────
        resend.emails.send({
          from:    FROM,
          to:      ADMIN,
          subject: `[Comparateur] ${email} · ${titreVilles}`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;background:#010510;color:#fff;border-radius:12px;border:1px solid rgba(1,77,248,0.3);overflow:hidden">
              <div style="background:linear-gradient(135deg,#014df8,#0a1628);padding:20px 24px">
                <span style="font-size:16px;font-weight:900;letter-spacing:0.18em;color:#fff">DALILI</span>
                <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.55)">Comparateur utilisé</p>
              </div>
              <div style="padding:24px">
                <table style="width:100%;border-collapse:collapse">
                  <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px;width:100px">Email</td><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#4d8fff;font-size:13px;font-weight:600">${email}</td></tr>
                  <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Villes</td><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);font-size:13px">${titreVilles}</td></tr>
                  <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Recommandée</td><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#f59e0b;font-size:13px">${recoCity?.name ?? '-'}</td></tr>
                  <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px">Date</td><td style="padding:8px 0;color:rgba(255,255,255,0.6);font-size:12px">${timestamp}</td></tr>
                </table>
              </div>
            </div>
          `,
        }),

        // ── User email with PDF attachment ───────────────────────────────
        resend.emails.send({
          from:    FROM,
          to:      email,
          subject: `Comparatif ${titreVilles} — analyse Dalili`,
          html:    renderComparateurEmail({
            villes:         villesEmailData,
            recommandation,
            recoVilleNom:   recoCity?.name ?? '',
          }),
          attachments: [
            {
              filename: `comparatif-villes-${slugs.map(s => CITIES[s]?.name.toLowerCase()).join('-')}.pdf`,
              content:  pdfBuffer.toString('base64'),
            },
          ],
        }),

      ]);

      console.log('[comparer] Done:', email, titreVilles);
    } catch (resendErr) {
      console.error('[comparer] Resend error:', JSON.stringify(resendErr, null, 2));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[comparer]', err);
    return NextResponse.json({ ok: false, error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

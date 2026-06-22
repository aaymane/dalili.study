import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { genererCalendrier, PAYS_INFO, RENTREES } from '@/lib/calendrier-data';
import { generateCalendrierPDF } from '@/lib/calendrier-pdf';
import { renderCalendrierEmail } from '@/emails/CalendrierEmail';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM     = 'Dalili <bonjour@dalili.study>';
const ADMIN    = 'boyayman388@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body    = await request.json();
    const email   = String(body.email   ?? '').trim().toLowerCase();
    const pays    = String(body.pays    ?? '').trim();
    const rentree = String(body.rentree ?? '').trim();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'Email invalide.' }, { status: 400 });
    }

    const paysInfo    = PAYS_INFO[pays]    ?? PAYS_INFO.autre;
    const rentreeInfo = RENTREES[rentree];
    if (!rentreeInfo) {
      return NextResponse.json({ ok: false, error: 'Rentrée invalide.' }, { status: 400 });
    }

    const etapes = genererCalendrier(pays, rentree);

    // ── Save to Supabase ──────────────────────────────────────────────
    const { error: dbError } = await supabaseAdmin
      .from('waitlist')
      .upsert(
        {
          email,
          source: 'calendrier',
          simulateur_data: { pays: paysInfo.label, rentree: rentreeInfo.label },
        },
        { onConflict: 'email', ignoreDuplicates: false }
      );

    if (dbError) console.error('[calendrier] Supabase error:', dbError.message);

    // ── Send emails ───────────────────────────────────────────────────
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[calendrier] RESEND_API_KEY not set');
      return NextResponse.json({ ok: true });
    }

    const resend    = new Resend(apiKey);
    const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

    try {
      // Generate PDF attachment
      const pdfBuffer = await generateCalendrierPDF(
        paysInfo.label,
        paysInfo.emoji,
        rentreeInfo.label,
        etapes,
      );

      await Promise.all([

        // ── Admin notification ─────────────────────────────────────────
        resend.emails.send({
          from:    FROM,
          to:      ADMIN,
          subject: `[Calendrier] ${email} · ${paysInfo.label} → ${rentreeInfo.label}`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;background:#010510;color:#fff;border-radius:12px;border:1px solid rgba(1,77,248,0.3);overflow:hidden">
              <div style="background:linear-gradient(135deg,#014df8,#0a1628);padding:20px 24px">
                <span style="font-size:16px;font-weight:900;letter-spacing:0.18em;color:#fff">DALILI</span>
                <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.55)">Calendrier généré</p>
              </div>
              <div style="padding:24px">
                <table style="width:100%;border-collapse:collapse">
                  <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px;width:100px">Email</td><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:#4d8fff;font-size:13px;font-weight:600">${email}</td></tr>
                  <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Pays</td><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);font-size:13px">${paysInfo.emoji} ${paysInfo.label}</td></tr>
                  <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);font-size:12px">Rentrée</td><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.8);font-size:13px">${rentreeInfo.label}</td></tr>
                  <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px">Date</td><td style="padding:8px 0;color:rgba(255,255,255,0.6);font-size:12px">${timestamp}</td></tr>
                </table>
              </div>
            </div>
          `,
        }),

        // ── User email with PDF attachment ─────────────────────────────
        resend.emails.send({
          from:    FROM,
          to:      email,
          subject: `Ton calendrier Campus France ${paysInfo.label} → ${rentreeInfo.label} 🗓️`,
          html:    renderCalendrierEmail({
            paysLabel:    paysInfo.label,
            paysEmoji:    paysInfo.emoji,
            rentreeLabel: rentreeInfo.label,
            etapes,
          }),
          attachments: [
            {
              filename: `calendrier-campus-france-${pays}-${rentree}.pdf`,
              content:  pdfBuffer.toString('base64'),
            },
          ],
        }),

      ]);

      console.log('[calendrier] Done:', email, paysInfo.label, rentreeInfo.label);
    } catch (resendErr) {
      console.error('[calendrier] Resend error:', JSON.stringify(resendErr, null, 2));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[calendrier]', err);
    return NextResponse.json({ ok: false, error: 'Erreur serveur.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

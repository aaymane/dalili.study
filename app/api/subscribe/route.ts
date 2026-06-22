import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { renderWaitlistEmail } from "@/emails/WaitlistEmail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM     = "Dalili <bonjour@dalili.study>";
const ADMIN    = "boyayman388@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json();
    const email  = String(body.email  ?? "").trim().toLowerCase();
    const source = String(body.source ?? "web").trim();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "Email invalide." }, { status: 400 });
    }

    // ── Save to Supabase ─────────────────────────────────────────────────────
    const { error: dbError } = await supabaseAdmin
      .from("waitlist")
      .upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true });

    if (dbError) {
      console.error("[subscribe] Supabase error:", dbError.message);
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[subscribe] RESEND_API_KEY is not set");
      return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
    }

    const resend    = new Resend(apiKey);
    const timestamp = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

    try {
      await Promise.all([

        // ── Admin notification ────────────────────────────────────────────────
        resend.emails.send({
          from:    FROM,
          to:      ADMIN,
          subject: `Nouveau inscrit Dalili — ${email}`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#010510;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(1,77,248,0.3)">
              <div style="background:linear-gradient(135deg,#014df8 0%,#0a1628 100%);padding:28px 32px">
                <span style="font-size:22px;font-weight:900;letter-spacing:0.18em;color:#fff">DALILI</span>
                <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.6)">Nouveau inscrit sur la waitlist</p>
              </div>
              <div style="padding:32px">
                <table style="width:100%;border-collapse:collapse">
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.45);font-size:13px;width:110px">Email</td>
                    <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#4d8fff;font-size:14px;font-weight:600">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.45);font-size:13px">Date</td>
                    <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.8);font-size:14px">${timestamp} (Paris)</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;color:rgba(255,255,255,0.45);font-size:13px">Source</td>
                    <td style="padding:10px 0;color:rgba(255,255,255,0.8);font-size:14px">${source}</td>
                  </tr>
                </table>
              </div>
            </div>
          `,
        }),

        // ── Email de bienvenue (template premium) ─────────────────────────────
        resend.emails.send({
          from:    FROM,
          to:      email,
          subject: "Tu es sur la liste — bienvenue chez Dalili 🎓",
          html:    renderWaitlistEmail(),
        }),

      ]);

      console.log("[subscribe] Emails sent to admin and:", email);
    } catch (resendErr) {
      console.error("[subscribe] Resend error:", JSON.stringify(resendErr, null, 2));
      return NextResponse.json({ ok: false, error: "Erreur envoi email." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

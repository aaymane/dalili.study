import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

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
      // Non-blocking: don't fail the request if DB is down — email still sends
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

        // ── Admin notification ───────────────────────────────────
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

        // ── Email de bienvenue — ultra premium ───────────────────
        resend.emails.send({
          from:    FROM,
          to:      email,
          subject: "Tu es sur la liste — bienvenue chez Dalili",
          html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Bienvenue chez Dalili</title>
</head>
<body style="margin:0;padding:24px 0;background:#06080f;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">

  <div style="max-width:560px;margin:0 auto">

    <!-- Header -->
    <div style="background:linear-gradient(145deg,#010d2e 0%,#01040f 100%);border-radius:20px 20px 0 0;border:1px solid rgba(1,77,248,0.25);border-bottom:none;padding:40px 40px 36px;text-align:center;position:relative;overflow:hidden">
      <!-- Top glow line -->
      <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(1,77,248,0.8),rgba(77,143,255,1),rgba(1,77,248,0.8),transparent)"></div>
      <!-- Background radial -->
      <div style="position:absolute;top:-40px;left:50%;transform:translateX(-50%);width:300px;height:200px;background:radial-gradient(ellipse at center,rgba(1,77,248,0.18) 0%,transparent 70%);border-radius:50%;pointer-events:none"></div>
      <div style="position:relative">
        <div style="display:inline-block;font-size:30px;font-weight:900;letter-spacing:0.22em;color:#fff;margin-bottom:10px">DALILI</div>
        <div style="width:40px;height:2px;background:linear-gradient(90deg,transparent,rgba(77,143,255,0.8),transparent);margin:0 auto 12px"></div>
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.45);letter-spacing:0.08em">dalili.study</p>
      </div>
    </div>

    <!-- Body -->
    <div style="background:#010510;border:1px solid rgba(1,77,248,0.18);border-top:none;border-bottom:none;padding:44px 40px">

      <!-- Badge -->
      <div style="display:inline-flex;align-items:center;gap:8px;padding:5px 16px;background:rgba(1,77,248,0.1);border:1px solid rgba(1,77,248,0.3);border-radius:100px;margin-bottom:24px">
        <div style="width:6px;height:6px;border-radius:50%;background:#4d8fff;box-shadow:0 0 6px #4d8fff"></div>
        <span style="font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#4d8fff">Early Access</span>
      </div>

      <!-- Heading -->
      <h1 style="margin:0 0 18px;font-size:32px;font-weight:900;color:#fff;line-height:1.15;letter-spacing:-0.01em">
        Tu es officiellement<br>
        <span style="color:#4d8fff">sur la liste.</span>
      </h1>

      <p style="margin:0 0 32px;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.85">
        Bienvenue dans la communauté <strong style="color:#fff">Dalili</strong>. On construit la plateforme qui simplifie vraiment l'installation des étudiants internationaux en France — et tu feras partie des premiers à y accéder.
      </p>

      <!-- What you get -->
      <div style="background:rgba(1,77,248,0.06);border:1px solid rgba(1,77,248,0.18);border-radius:16px;padding:28px;margin-bottom:32px">
        <p style="margin:0 0 18px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(77,143,255,0.8)">Ce que Dalili fait pour toi</p>
        <table style="width:100%;border-collapse:collapse">
          ${[
            ['Visa & Campus France', 'Chaque étape expliquée, avec les vrais délais'],
            ['Logement', 'CROUS, garant, recherche depuis l\'étranger'],
            ['Banque & CAF', 'Ouvrir un compte, toucher les aides'],
            ['Sécurité sociale', 'S\'inscrire, choisir un médecin, rembourser'],
            ['Mentors', 'Des étudiants qui sont passés par là avant toi'],
          ].map(([title, desc]) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:top">
                <div style="display:flex;align-items:flex-start;gap:10px">
                  <div style="width:5px;height:5px;border-radius:50%;background:#4d8fff;flex-shrink:0;margin-top:7px"></div>
                  <div>
                    <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.85);margin-bottom:2px">${title}</div>
                    <div style="font-size:12px;color:rgba(255,255,255,0.38);line-height:1.5">${desc}</div>
                  </div>
                </div>
              </td>
            </tr>
          `).join('')}
        </table>
      </div>

      <!-- CTA button -->
      <div style="text-align:center;margin-bottom:36px">
        <a href="https://dalili.study/blog"
           style="display:inline-block;background:linear-gradient(135deg,#014df8 0%,#0052cc 100%);color:#fff;text-decoration:none;padding:15px 36px;border-radius:100px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;box-shadow:0 0 32px rgba(1,77,248,0.4)">
          Lire nos guides gratuits →
        </a>
      </div>

      <!-- Resources -->
      <div style="margin-bottom:32px">
        <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.25)">Ressources gratuites</p>
        ${[
          ['Checklist arrivée en France', 'PDF · 32 démarches · gratuit', 'https://dalili.study/checklist'],
          ['Guides visa étudiant', 'Maroc, Algérie, Sénégal', 'https://dalili.study/blog'],
          ['Villes étudiantes', 'Paris, Lyon, Bordeaux, Nantes', 'https://dalili.study/villes'],
        ].map(([title, sub, url]) => `
          <a href="${url}" style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;text-decoration:none;margin-bottom:6px">
            <div>
              <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.75);margin-bottom:2px">${title}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.3)">${sub}</div>
            </div>
            <span style="color:rgba(77,143,255,0.6);font-size:16px;flex-shrink:0">→</span>
          </a>
        `).join('')}
      </div>

      <!-- Divider -->
      <div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:28px"></div>

      <!-- Sign off -->
      <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.4);line-height:1.8">
        À très bientôt,<br>
        <strong style="color:rgba(255,255,255,0.7)">L'équipe Dalili</strong>
      </p>

    </div>

    <!-- Footer -->
    <div style="background:rgba(1,4,16,0.9);border:1px solid rgba(1,77,248,0.12);border-top:1px solid rgba(255,255,255,0.05);border-radius:0 0 20px 20px;padding:20px 40px;text-align:center">
      <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.2);letter-spacing:0.04em">
        Tu reçois cet email car tu t'es inscrit(e) sur <a href="https://dalili.study" style="color:rgba(77,143,255,0.5);text-decoration:none">dalili.study</a>
      </p>
      <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.12)">
        © ${new Date().getFullYear()} Dalili — Paris, France
      </p>
    </div>

  </div>
</body>
</html>
          `,
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

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM     = "Dalili <bonjour@dalili.study>";
const ADMIN    = "boyayman388@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json();
    const email  = String(body.email  ?? "").trim().toLowerCase();
    const source = String(body.source ?? "web").trim();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Email invalide." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[subscribe] RESEND_API_KEY is not set");
      return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
    }

    const resend    = new Resend(apiKey);
    const timestamp = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

    await Promise.all([
      // ── Admin notification ──
      resend.emails.send({
        from:    FROM,
        to:      ADMIN,
        subject: `🎉 Nouveau inscrit Dalili : ${email}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#010510;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(1,77,248,0.3)">
            <div style="background:linear-gradient(135deg,#014df8 0%,#0a1628 100%);padding:28px 32px">
              <span style="font-size:24px;font-weight:900;letter-spacing:0.18em;color:#fff">DALILI</span>
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

      // ── Welcome email to subscriber ──
      resend.emails.send({
        from:    FROM,
        to:      email,
        subject: "Bienvenue sur Dalili 🇫🇷",
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
          <body style="margin:0;padding:0;background:#0a0f1e;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
            <div style="max-width:580px;margin:0 auto;background:#010510;border-radius:16px;overflow:hidden;border:1px solid rgba(1,77,248,0.25)">

              <!-- Header -->
              <div style="background:linear-gradient(135deg,rgba(1,77,248,0.9) 0%,#010d2e 100%);padding:40px 40px 36px;text-align:center;position:relative">
                <div style="display:inline-block;font-size:28px;font-weight:900;letter-spacing:0.2em;color:#fff;margin-bottom:8px">DALILI</div>
                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.65);letter-spacing:0.05em">Ton guide pour la France 🇫🇷</p>
              </div>

              <!-- Body -->
              <div style="padding:40px">
                <h1 style="margin:0 0 16px;font-size:26px;font-weight:800;color:#fff;line-height:1.2">
                  Bienvenue sur la waitlist ! 🎉
                </h1>

                <p style="margin:0 0 20px;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.8">
                  On est ravis de t'avoir parmi nous. Tu fais désormais partie des premiers à rejoindre <strong style="color:#4d8fff">Dalili</strong> — l'application qui simplifie l'installation des étudiants internationaux en France.
                </p>

                <!-- What is Dalili -->
                <div style="background:rgba(1,77,248,0.07);border:1px solid rgba(1,77,248,0.2);border-radius:12px;padding:24px;margin-bottom:24px">
                  <p style="margin:0 0 14px;font-size:13px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#4d8fff">Ce que fait Dalili</p>
                  <ul style="margin:0;padding:0 0 0 18px;color:rgba(255,255,255,0.7);font-size:14px;line-height:2">
                    <li>Visa étudiant et titre de séjour, étape par étape</li>
                    <li>Trouver un logement depuis l'étranger</li>
                    <li>Ouvrir un compte bancaire en France</li>
                    <li>CAF, sécurité sociale, transports</li>
                    <li>Mentors étudiants qui sont passés par là</li>
                  </ul>
                </div>

                <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.65);line-height:1.8">
                  Tu seras parmi les premiers à accéder à l'application dès son lancement. On t'enverra un message dès que c'est prêt — promis, on ne spamme pas.
                </p>

                <!-- CTA -->
                <div style="text-align:center;margin-bottom:32px">
                  <a href="https://dalili-waitlist.vercel.app/blog" style="display:inline-block;background:#014df8;color:#fff;text-decoration:none;padding:14px 32px;border-radius:100px;font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase">
                    Lire nos guides →
                  </a>
                </div>

                <!-- Divider -->
                <div style="height:1px;background:rgba(255,255,255,0.07);margin-bottom:28px"></div>

                <!-- Sign off -->
                <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.8">
                  À très bientôt,<br>
                  <strong style="color:rgba(255,255,255,0.75)">L'équipe Dalili</strong>
                </p>
              </div>

              <!-- Footer -->
              <div style="background:rgba(255,255,255,0.02);border-top:1px solid rgba(255,255,255,0.06);padding:20px 40px;text-align:center">
                <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.22);letter-spacing:0.04em">
                  Tu reçois cet email car tu t'es inscrit(e) sur dalili-waitlist.vercel.app
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

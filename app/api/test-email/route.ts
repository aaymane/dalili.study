import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;

  console.log('=== TEST EMAIL ROUTE ===');
  console.log('API Key présente:', !!apiKey);
  console.log('API Key prefix:', apiKey?.slice(0, 12) + '...');
  console.log('NODE_ENV:', process.env.NODE_ENV);

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: 'RESEND_API_KEY non définie dans les variables Vercel',
      fix: 'Vercel → Settings → Environment Variables → ajouter RESEND_API_KEY',
    }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  // Test 1 — vérifier le domaine
  let domainStatus = null;
  try {
    const domains = await resend.domains.list();
    domainStatus = domains.data?.data?.map(d => ({
      name: d.name,
      status: d.status,
    }));
    console.log('Domains:', JSON.stringify(domainStatus));
  } catch (e: unknown) {
    console.log('Domain check error:', e);
  }

  // Test 2 — envoyer un email minimal (sans fond noir, sans emoji)
  const ts = new Date().toISOString();

  try {
    const result = await resend.emails.send({
      from: 'Dalili <bonjour@dalili.study>',
      to:   ['boyayman388@gmail.com'],
      subject: `Dalili — Test livraison ${ts}`,
      headers: {
        'X-Entity-Ref-ID': `test-${Date.now()}`,
        'List-Unsubscribe': '<mailto:unsubscribe@dalili.study>',
      },
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif">
          <div style="max-width:540px;margin:40px auto;padding:32px;border:1px solid #e5e7eb;border-radius:8px">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid #f3f4f6">
              <img src="https://dalili.study/images/logo-dalili.svg" width="36" height="36" alt="Dalili" />
              <span style="font-weight:900;font-size:18px;letter-spacing:0.15em;color:#0a0a0a">DALILI</span>
            </div>
            <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0a0a0a">Test de livraison</h1>
            <p style="margin:0 0 12px;font-size:15px;color:#374151;line-height:1.65">
              Cet email confirme que Resend fonctionne correctement depuis Vercel.
            </p>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:16px;margin:20px 0">
              <p style="margin:0;font-size:13px;color:#6b7280">Horodatage : <strong style="color:#0a0a0a">${ts}</strong></p>
              <p style="margin:6px 0 0;font-size:13px;color:#6b7280">Clé Resend (prefix) : <strong style="color:#0a0a0a">${apiKey.slice(0, 12)}...</strong></p>
              <p style="margin:6px 0 0;font-size:13px;color:#6b7280">Environnement : <strong style="color:#0a0a0a">${process.env.NODE_ENV}</strong></p>
            </div>
            <p style="margin:24px 0 0;font-size:13px;color:#9ca3af">
              Si tu regois cet email, Resend fonctionne. Verifie les spams si les autres emails n'arrivent pas.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Dalili — Test de livraison\nHorodatage: ${ts}\nCle Resend (prefix): ${apiKey.slice(0, 12)}...\nEnvironnement: ${process.env.NODE_ENV}`,
    });

    console.log('=== RESEND RESULT ===', JSON.stringify(result));

    if (result.error) {
      return NextResponse.json({
        success: false,
        error: result.error,
        domainStatus,
        apiKeyPrefix: apiKey.slice(0, 12) + '...',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      emailId: result.data?.id,
      sentTo: 'boyayman388@gmail.com',
      timestamp: ts,
      domainStatus,
      apiKeyPrefix: apiKey.slice(0, 12) + '...',
      note: 'Email envoyé — verifie ta boite et les SPAMS. Si pas recu dans 2 min → domaine ou quota Resend.',
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.log('=== RESEND ERROR ===', err.message, JSON.stringify(error));
    return NextResponse.json({
      success: false,
      error: err.message,
      domainStatus,
      apiKeyPrefix: apiKey.slice(0, 12) + '...',
    }, { status: 500 });
  }
}

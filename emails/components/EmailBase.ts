// ── Design tokens ─────────────────────────────────────────────────────────
export const FONT  = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
export const SITE  = 'https://dalili.study';
export const BLUE  = '#014DF8';
export const BLUE2 = '#4d8fff';

// ── Logo SVG (source: /public/images/logo-dalili.svg, filled white) ───────
const P1 = 'M45.83,124.17h-13.08s-12.61,12.62-12.61,12.62l6.87,6.9,10.2-10.03c.93-.48,3.49-.48,4.16.29l11.98,13.73-12.33,12.45c-1.41,1.43-2.43,2.99-4.05,4.34h-16.74c-1.73-1.43-2.84-2.99-4.25-4.58-5.09-5.75-10.17-11.5-15.26-17.25-.21-.22-.38-.39-.5-.5-.05-.04-.11-.1-.21-.14,0,0,0,0-.01,0,.1.12.08.58.08.84v14.73s14.37,16.39,14.37,16.39l26.56.04,2.49-2.55,23.38-23.49-21.05-23.8Z';
const P2 = 'M36.97,164.47h-16.74s16.74,0,16.74,0Z';
const P3 = 'M66.99,125.02l-14.38-16.39-26.56-.04-2.49,2.55L.19,134.62l21.05,23.8h13.08s12.61-12.62,12.61-12.62l-6.87-6.9-10.2,10.03c-.93.48-3.49.48-4.16-.29l-11.98-13.73,12.33-12.45c1.41-1.43,2.43-2.99,4.05-4.34h16.74c1.73,1.43,2.84,2.99,4.25,4.58l15.26,17.25c.28.32.46.55.73.65-.03-5.2-.05-10.39-.08-15.59Z';

const LOGO_SVG = `<svg width="52" height="52" viewBox="-1 105 70 71" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 auto">
  <path fill="#ffffff" d="${P1}"/>
  <path fill="#ffffff" d="${P2}"/>
  <path fill="#ffffff" d="${P3}"/>
</svg>`;

// ── Shared primitives ─────────────────────────────────────────────────────

export function divider(): string {
  return `<div style="border-top:1px solid rgba(255,255,255,0.08);margin:28px 0"></div>`;
}

export function sectionLabel(text: string): string {
  return `<p style="margin:0 0 16px;font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${BLUE}">${text}</p>`;
}

export function card(inner: string, extraStyle = ''): string {
  return `<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;${extraStyle}">${inner}</div>`;
}

export function ctaButton(href: string, label: string): string {
  return `<div style="text-align:center">
    <a href="${href}" style="display:inline-block;background:${BLUE};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-family:${FONT};font-size:15px;font-weight:600">${label}</a>
  </div>`;
}

export function bulletPoint(text: string): string {
  return `<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px">
    <div style="width:6px;height:6px;border-radius:50%;background:${BLUE};flex-shrink:0;margin-top:7px"></div>
    <span style="font-family:${FONT};font-size:14px;color:rgba(255,255,255,0.75);line-height:1.6">${text}</span>
  </div>`;
}

// ── Main layout ───────────────────────────────────────────────────────────

export function emailBase(children: string, previewText?: string): string {
  const year = new Date().getFullYear();

  const preview = previewText
    ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#000000">${previewText}${' ‌'.repeat(60)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Dalili</title>
</head>
<body style="margin:0;padding:32px 0;background:#000000;font-family:${FONT};-webkit-font-smoothing:antialiased">

${preview}

<div style="max-width:600px;margin:0 auto">

  <!-- Header 200px -->
  <div style="height:200px;background:linear-gradient(135deg,#0a0f1e 0%,#010510 50%,#0a1628 100%);border-radius:16px 16px 0 0;border:1px solid rgba(77,143,255,0.18);border-bottom:none;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden">
    <!-- Top accent line -->
    <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(1,77,248,0.9),rgba(77,143,255,1),rgba(1,77,248,0.9),transparent)"></div>
    <!-- Radial glow -->
    <div style="position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:320px;height:220px;background:radial-gradient(ellipse at center,rgba(1,77,248,0.18) 0%,transparent 70%);border-radius:50%;pointer-events:none"></div>

    <div style="position:relative;text-align:center">
      <!-- Logo SVG -->
      <div style="margin-bottom:12px">${LOGO_SVG}</div>
      <!-- Wordmark -->
      <div style="font-family:${FONT};font-size:11px;font-weight:600;letter-spacing:8px;color:#ffffff;text-transform:uppercase;margin-bottom:10px">DALILI</div>
      <!-- Blue line -->
      <div style="width:40px;height:2px;background:${BLUE};margin:0 auto 10px"></div>
      <!-- URL -->
      <div style="font-family:${FONT};font-size:12px;color:${BLUE};letter-spacing:0.06em">dalili.study</div>
    </div>
  </div>

  <!-- Body -->
  <div style="background:#0a0f1e;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);padding:40px">
    ${children}
  </div>

  <!-- Footer -->
  <div style="background:#050810;border-radius:0 0 16px 16px;border:1px solid rgba(255,255,255,0.06);border-top:1px solid rgba(255,255,255,0.08);padding:24px 40px;text-align:center">
    <p style="margin:0 0 6px;font-family:${FONT};font-size:11px;color:rgba(255,255,255,0.4);line-height:1.65">
      <a href="${SITE}" style="color:${BLUE};text-decoration:none">dalili.study</a>
      &nbsp;·&nbsp;
      Tu reçois cet email car tu t'es inscrit(e) sur dalili.study.
    </p>
    <p style="margin:0;font-family:${FONT};font-size:11px;color:rgba(255,255,255,0.22)">
      &copy; ${year} Dalili &mdash; Paris, France
    </p>
  </div>

</div>

</body>
</html>`;
}

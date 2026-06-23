// ── Design tokens ─────────────────────────────────────────────────────────
export const FONT  = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
export const SITE  = 'https://dalili.study';
export const BLUE  = '#014DF8';
export const BLUE2 = '#4d8fff';

// ── Logo — img externe + fallback SVG ─────────────────────────────────────
const P1 = 'M45.83,124.17h-13.08s-12.61,12.62-12.61,12.62l6.87,6.9,10.2-10.03c.93-.48,3.49-.48,4.16.29l11.98,13.73-12.33,12.45c-1.41,1.43-2.43,2.99-4.05,4.34h-16.74c-1.73-1.43-2.84-2.99-4.25-4.58-5.09-5.75-10.17-11.5-15.26-17.25-.21-.22-.38-.39-.5-.5-.05-.04-.11-.1-.21-.14,0,0,0,0-.01,0,.1.12.08.58.08.84v14.73s14.37,16.39,14.37,16.39l26.56.04,2.49-2.55,23.38-23.49-21.05-23.8Z';
const P2 = 'M36.97,164.47h-16.74s16.74,0,16.74,0Z';
const P3 = 'M66.99,125.02l-14.38-16.39-26.56-.04-2.49,2.55L.19,134.62l21.05,23.8h13.08s12.61-12.62,12.61-12.62l-6.87-6.9-10.2,10.03c-.93.48-3.49.48-4.16-.29l-11.98-13.73,12.33-12.45c1.41-1.43,2.43-2.99,4.05-4.34h16.74c1.73,1.43,2.84,2.99,4.25,4.58l15.26,17.25c.28.32.46.55.73.65-.03-5.2-.05-10.39-.08-15.59Z';

// White logo for the blue header band
const LOGO_WHITE = `<img src="https://dalili.study/images/logo-dalili.svg" width="40" height="40" alt="Dalili" style="display:block;margin:0 auto" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><svg width="40" height="40" viewBox="-1 105 70 71" xmlns="http://www.w3.org/2000/svg" style="display:none;margin:0 auto">
  <path fill="#ffffff" d="${P1}"/>
  <path fill="#ffffff" d="${P2}"/>
  <path fill="#ffffff" d="${P3}"/>
</svg>`;

// ── Shared primitives (light theme) ──────────────────────────────────────

export function divider(): string {
  return `<div style="border-top:1px solid #e5e7eb;margin:24px 0"></div>`;
}

export function sectionLabel(text: string): string {
  return `<p style="margin:0 0 14px;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BLUE}">${text}</p>`;
}

export function card(inner: string, extraStyle = ''): string {
  return `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;${extraStyle}">${inner}</div>`;
}

export function ctaButton(href: string, label: string): string {
  return `<div style="text-align:center">
    <a href="${href}" style="display:inline-block;background:${BLUE};color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:6px;font-family:${FONT};font-size:14px;font-weight:600;letter-spacing:0.02em">${label}</a>
  </div>`;
}

export function bulletPoint(text: string): string {
  return `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px">
    <div style="width:5px;height:5px;border-radius:50%;background:${BLUE};flex-shrink:0;margin-top:8px"></div>
    <span style="font-family:${FONT};font-size:14px;color:#374151;line-height:1.65">${text}</span>
  </div>`;
}

// ── Main layout — light theme (white background = inbox-friendly) ─────────
export function emailBase(children: string, previewText?: string): string {
  const year = new Date().getFullYear();

  // Hidden preview text (max ~90 chars shown by Gmail before opening)
  const preview = previewText
    ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#ffffff">${previewText}${'&zwnj;&nbsp;'.repeat(40)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Dalili</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:${FONT};-webkit-font-smoothing:antialiased">

${preview}

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;padding:32px 0">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%">

        <!-- ── Header bleu DALILI ── -->
        <tr>
          <td style="background:linear-gradient(135deg,#013ed4 0%,${BLUE} 50%,#0a52ff 100%);border-radius:10px 10px 0 0;padding:32px;text-align:center">
            <div style="margin-bottom:10px">${LOGO_WHITE}</div>
            <div style="font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:7px;color:#ffffff;text-transform:uppercase;margin-bottom:6px">DALILI</div>
            <div style="width:32px;height:2px;background:rgba(255,255,255,0.45);margin:0 auto 6px"></div>
            <div style="font-family:${FONT};font-size:11px;color:rgba(255,255,255,0.75)">dalili.study</div>
          </td>
        </tr>

        <!-- ── Corps blanc ── -->
        <tr>
          <td style="background:#ffffff;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;padding:36px 40px">
            ${children}
          </td>
        </tr>

        <!-- ── Footer ── -->
        <tr>
          <td style="background:#f9fafb;border:1px solid #e5e7eb;border-top:1px solid #e5e7eb;border-radius:0 0 10px 10px;padding:20px 40px;text-align:center">
            <p style="margin:0 0 5px;font-family:${FONT};font-size:12px;color:#6b7280;line-height:1.6">
              <a href="${SITE}" style="color:${BLUE};text-decoration:none;font-weight:600">dalili.study</a>
              &nbsp;&middot;&nbsp;
              Tu regois cet email car tu t'es inscrit(e) sur dalili.study
            </p>
            <p style="margin:0;font-family:${FONT};font-size:11px;color:#9ca3af">
              &copy; ${year} Dalili &mdash; Paris, France
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}

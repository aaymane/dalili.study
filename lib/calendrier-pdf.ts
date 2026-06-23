import { PDFDocument, StandardFonts, rgb, PageSizes, type PDFPage, type PDFFont, type RGB } from 'pdf-lib';
import type { CalendrierStep } from './calendrier-data';

// ── Nettoyage texte WinAnsi ────────────────────────────────────────────────────
function cleanText(s: string): string {
  if (!s) return '';
  return s
    .replace(/•/g, '-')
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/…/g, '...')
    .replace(/[—–]/g, '-')
    .replace(/→|➜|➡|►/g, '->')
    .replace(/[^ -ÿ]/g, '') // supprime tout hors Latin-1
    .trim();
}

// ── Logo hexagone DALILI ──────────────────────────────────────────────────────
function drawLogo(page: PDFPage, cx: number, cy: number, bold: PDFFont) {
  const r = 17;
  page.drawEllipse({ x: cx, y: cy, xScale: r, yScale: r, color: rgb(1 / 255, 77 / 255, 248 / 255) });
  for (let i = 0; i < 6; i++) {
    const a1 = (Math.PI / 3) * i - Math.PI / 6;
    const a2 = (Math.PI / 3) * (i + 1) - Math.PI / 6;
    page.drawLine({
      start: { x: cx + r * Math.cos(a1), y: cy + r * Math.sin(a1) },
      end:   { x: cx + r * Math.cos(a2), y: cy + r * Math.sin(a2) },
      thickness: 2.2,
      color: rgb(1, 1, 1),
    });
  }
  page.drawText('DALILI', { x: cx + r + 8, y: cy - 8, size: 20, font: bold, color: rgb(1, 1, 1) });
}

const C_BLUE      = rgb(1 / 255,   77 / 255,  248 / 255);  // #014DF8
const C_BLUE_DARK = rgb(10 / 255,  22 / 255,  40 / 255);   // #0a1628
const C_BODY      = rgb(7 / 255,   11 / 255,  24 / 255);   // #070b18
const C_WHITE     = rgb(1, 1, 1);
const C_MID       = rgb(136 / 255, 153 / 255, 187 / 255);  // #8899bb
const C_DARK_CARD = rgb(10 / 255,  15 / 255,  30 / 255);   // #0a0f1e

const URGENCE_COLOR: Record<string, RGB> = {
  rouge:  rgb(239 / 255, 68 / 255,  68 / 255),   // #ef4444
  orange: rgb(245 / 255, 158 / 255, 11 / 255),   // #f59e0b
  vert:   C_BLUE,
};

// State for multi-page rendering
interface PageCtx {
  page:  PDFPage;
  bold:  PDFFont;
  norm:  PDFFont;
  W:     number;
  H:     number;
}

function fillRect(ctx: PageCtx, topY: number, h: number, x: number, w: number, color: RGB) {
  ctx.page.drawRectangle({ x, y: ctx.H - topY - h, width: w, height: h, color });
}

function txt(ctx: PageCtx, s: string, topY: number, x: number, size: number, f: PDFFont, color: RGB = C_WHITE) {
  ctx.page.drawText(s, { x, y: ctx.H - topY, size, font: f, color });
}

function centered(ctx: PageCtx, s: string, topY: number, size: number, f: PDFFont, color: RGB = C_WHITE) {
  const tw = f.widthOfTextAtSize(s, size);
  ctx.page.drawText(s, { x: ctx.W / 2 - tw / 2, y: ctx.H - topY, size, font: f, color });
}

function drawHeader(ctx: PageCtx, paysLabel: string, rentreeLabel: string) {
  const { W, H } = ctx;
  fillRect(ctx, 0, H, 0, W, C_BODY);
  const HEADER_H = 130;
  fillRect(ctx, 0, HEADER_H, 0, W, C_BLUE_DARK);
  fillRect(ctx, 0, 3, 0, W, C_BLUE);

  drawLogo(ctx.page, W / 2 - 55, H - 52, ctx.bold);
  centered(ctx, 'dalili.study', 78, 9, ctx.norm, C_BLUE);
  centered(ctx, 'TON CALENDRIER PERSONNALISE', 95, 7.5, ctx.norm, C_MID);
  centered(ctx, cleanText(`${paysLabel}  -  ${rentreeLabel}`), 112, 13, ctx.bold, C_WHITE);
}

export async function generateCalendrierPDF(
  paysLabel:    string,
  paysEmoji:    string,
  rentreeLabel: string,
  etapes:       CalendrierStep[],
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`Calendrier Campus France — ${paysLabel} — ${rentreeLabel}`);
  pdfDoc.setAuthor('Dalili (dalili.study)');
  pdfDoc.setSubject('Planning Campus France personnalise');

  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const norm = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const MARGIN   = 40;
  const CARD_H   = 72;
  const CARD_GAP = 4;
  const HEADER_H = 130;
  const FOOTER_H = 40;

  // Add first page
  let page = pdfDoc.addPage(PageSizes.A4);
  const W = page.getWidth();
  const H = page.getHeight();
  let ctx: PageCtx = { page, bold, norm, W, H };
  void FOOTER_H;

  const CW = W - MARGIN * 2;

  const newPage = () => {
    page = pdfDoc.addPage(PageSizes.A4);
    ctx = { page: page, bold, norm, W, H };
    fillRect(ctx, 0, H, 0, W, C_BODY);
    fillRect(ctx, 0, 3, 0, W, C_BLUE);
    centered(ctx, 'DALILI  |  dalili.study  |  Suite', 22, 8, bold, C_BLUE);
    fillRect(ctx, 30, 0.5, MARGIN, CW, rgb(0.1, 0.16, 0.29));
    return MARGIN + 14;
  };

  drawHeader(ctx, paysLabel, rentreeLabel);

  let y = HEADER_H + 18;

  // Summary line (pas d'emoji pays — non encodable WinAnsi)
  txt(ctx, cleanText(`${etapes.length} etapes  |  De ${etapes[0]?.mois} a ${etapes[etapes.length - 1]?.mois}`), y, MARGIN, 8.5, norm, C_MID);
  y += 12;

  // Legend
  const legendItems = [
    { urgence: 'rouge',  label: 'Urgent'      },
    { urgence: 'orange', label: 'Important'   },
    { urgence: 'vert',   label: 'Preparation' },
  ];
  let lx = MARGIN;
  legendItems.forEach(item => {
    fillRect(ctx, y + 2, 9, lx, 3, URGENCE_COLOR[item.urgence]);
    txt(ctx, item.label, y + 2, lx + 7, 7.5, norm, C_MID);
    lx += 80;
  });
  y += 16;

  fillRect(ctx, y, 0.5, MARGIN, CW, rgb(0.1, 0.16, 0.29));
  y += 10;

  // ── Step cards ────────────────────────────────────────────────────────────
  for (const step of etapes) {
    const urgColor = URGENCE_COLOR[step.urgence] ?? C_BLUE;

    // Nettoie et tronque la description
    const maxDescLen = 120;
    const rawDesc = cleanText(step.description);
    const desc = rawDesc.length > maxDescLen ? rawDesc.slice(0, maxDescLen) + '...' : rawDesc;

    // Page break check
    if (y + CARD_H > H - FOOTER_H) {
      y = newPage();
    }

    // Card bg
    fillRect(ctx, y, CARD_H, MARGIN, CW, C_DARK_CARD);
    // Left urgence border
    fillRect(ctx, y, CARD_H, MARGIN, 3, urgColor);

    const cx = MARGIN + 14;
    let cy = y + 10;

    // Arrivée badge
    if (step.isArrivee) {
      ctx.page.drawRectangle({ x: cx - 2, y: ctx.H - (cy - 2) - 13, width: 110, height: 13, color: rgb(239 / 255, 68 / 255, 68 / 255), opacity: 0.2 });
      txt(ctx, 'ARRIVEE EN FRANCE', cy + 9, cx + 3, 7, bold, rgb(239 / 255, 68 / 255, 68 / 255));
      cy += 15;
    }

    // Month
    txt(ctx, cleanText(step.mois.toUpperCase()), cy + 9, cx, 7.5, bold, urgColor);
    cy += 14;

    // Action (nettoie + tronque)
    const actionMax = 75;
    const rawAction = cleanText(step.action);
    const action = rawAction.length > actionMax ? rawAction.slice(0, actionMax) + '...' : rawAction;
    txt(ctx, action, cy + 10, cx, 10.5, bold, C_WHITE);
    cy += 14;

    // Description
    txt(ctx, desc, cy + 9, cx, 8, norm, C_MID);

    // Link
    if (step.lien) {
      txt(ctx, `Voir : ${cleanText(step.lien.label)}`, y + CARD_H - 8, cx, 7.5, bold, urgColor);
    }

    y += CARD_H + CARD_GAP;
  }

  // ── Footer on last page ───────────────────────────────────────────────────
  y += 10;
  if (y + 30 > H - 10) {
    newPage();
    y = H - 80;
  }
  fillRect(ctx, y, 0.5, MARGIN, CW, rgb(0.1, 0.12, 0.25));
  y += 10;
  centered(ctx, 'dalili.study  ·  Ton guide pour etudier en France  ·  Genere gratuitement', y, 7.5, norm, C_MID);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

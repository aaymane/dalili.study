import { PDFDocument, StandardFonts, rgb, PageSizes, type PDFPage, type PDFFont, type RGB } from 'pdf-lib';
import type { City } from './cities';
import type { CityScores } from './comparer-scores';

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
const C_GOLD      = rgb(245 / 255, 158 / 255, 11 / 255);   // #f59e0b
const C_GREEN     = rgb(34 / 255,  197 / 255, 94 / 255);
const C_ORANGE    = rgb(245 / 255, 158 / 255, 11 / 255);
const C_ROW_A     = rgb(10 / 255,  16 / 255,  34 / 255);
const C_ROW_B     = rgb(12 / 255,  18 / 255,  40 / 255);
const C_ROW_HEAD  = rgb(13 / 255,  25 / 255,  48 / 255);

function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.replace('#', ''), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

export interface ComparateurPDFData {
  city:     City;
  scores:   CityScores;
  color:    string;
  recoBest: boolean;
}

interface Ctx {
  page: PDFPage;
  bold: PDFFont;
  norm: PDFFont;
  W:    number;
  H:    number;
}

function fillRect(ctx: Ctx, topY: number, h: number, x: number, w: number, color: RGB) {
  ctx.page.drawRectangle({ x, y: ctx.H - topY - h, width: w, height: h, color });
}

function txt(ctx: Ctx, s: string, topY: number, x: number, size: number, f: PDFFont, color: RGB = C_WHITE) {
  if (!s) return;
  ctx.page.drawText(s, { x, y: ctx.H - topY, size, font: f, color });
}

function centered(ctx: Ctx, s: string, topY: number, size: number, f: PDFFont, color: RGB = C_WHITE) {
  const tw = f.widthOfTextAtSize(s, size);
  ctx.page.drawText(s, { x: ctx.W / 2 - tw / 2, y: ctx.H - topY, size, font: f, color });
}

function scoreBar(ctx: Ctx, score: number, topY: number, x: number, color: RGB) {
  const maxW = 55;
  const barH = 5;
  // Background track
  fillRect(ctx, topY, barH, x, maxW, rgb(0.12, 0.18, 0.32));
  // Filled portion
  fillRect(ctx, topY, barH, x, Math.round((score / 5) * maxW), color);
}

export async function generateComparateurPDF(
  villes: ComparateurPDFData[],
  recommandation: string,
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`Comparatif — ${villes.map(v => v.city.name).join(' vs ')}`);
  pdfDoc.setAuthor('Dalili (dalili.study)');
  pdfDoc.setSubject('Comparatif villes etudiantes France');

  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const norm = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const MARGIN   = 36;
  const HEADER_H = 130;
  const FOOTER_H = 35;

  // ── Page factory ────────────────────────────────────────────────────────────
  const addPage = (): [Ctx, number] => {
    const p = pdfDoc.addPage(PageSizes.A4);
    const W = p.getWidth();
    const H = p.getHeight();
    const ctx: Ctx = { page: p, bold, norm, W, H };
    fillRect(ctx, 0, H, 0, W, C_BODY);
    return [ctx, 0];
  };

  const addContentPage = (): [Ctx, number] => {
    const [ctx] = addPage();
    const { W } = ctx;
    const CW = W - MARGIN * 2;
    fillRect(ctx, 0, 3, 0, W, C_BLUE);
    centered(ctx, 'DALILI  |  dalili.study  |  Suite', 20, 8, bold, C_BLUE);
    fillRect(ctx, 28, 0.5, MARGIN, CW, rgb(0.1, 0.16, 0.29));
    return [ctx, MARGIN + 18];
  };

  // ── First page ──────────────────────────────────────────────────────────────
  let [ctx] = addPage();
  const W   = ctx.W;
  const H   = ctx.H;
  const CW  = W - MARGIN * 2;

  // Header
  fillRect(ctx, 0, HEADER_H, 0, W, C_BLUE_DARK);
  fillRect(ctx, 0, 3, 0, W, C_BLUE);
  drawLogo(ctx.page, W / 2 - 55, H - 52, bold);
  centered(ctx, 'dalili.study', 78, 9, norm, C_BLUE);
  centered(ctx, 'COMPARATIF VILLES ETUDIANTES', 95, 7.5, norm, C_MID);
  const titre = cleanText(villes.map(v => v.city.name).join(' vs '));
  centered(ctx, titre, 112, 13, bold, C_WHITE);

  let y = HEADER_H + 18;
  fillRect(ctx, y, 0.5, MARGIN, CW, rgb(0.1, 0.16, 0.29));
  y += 14;

  // ── Section 1 — Budget & Logement ──────────────────────────────────────────
  txt(ctx, 'BUDGET & LOGEMENT', y, MARGIN, 8, bold, C_BLUE);
  y += 14;

  const colW     = CW / (villes.length + 1);
  const BUDGET_ROWS: Array<{ label: string; key: keyof City }> = [
    { label: 'Chambre CROUS',   key: 'costCrous'     },
    { label: 'Studio prive',    key: 'costStudio'    },
    { label: 'Colocation',      key: 'costColoc'     },
    { label: 'Transport/mois',  key: 'costTransport' },
    { label: 'Budget min/mois', key: 'monthlyBudgetMin' },
    { label: 'Budget max/mois', key: 'monthlyBudgetMax' },
  ];

  // Header row
  fillRect(ctx, y, 16, MARGIN, CW, C_ROW_HEAD);
  villes.forEach((v, i) => {
    const cc = hexToRgb(v.color);
    fillRect(ctx, y, 16, MARGIN + colW * (i + 1), colW, cc);
    txt(ctx, cleanText(v.city.name), y + 11, MARGIN + colW * (i + 1) + 4, 8.5, bold, C_WHITE);
  });
  y += 16;

  BUDGET_ROWS.forEach(({ label, key }, ri) => {
    fillRect(ctx, y, 15, MARGIN, CW, ri % 2 === 0 ? C_ROW_A : C_ROW_B);
    txt(ctx, label, y + 10, MARGIN + 4, 8, norm, C_MID);
    villes.forEach((v, i) => {
      const val  = v.city[key];
      const text = typeof val === 'number' ? `${val} EUR` : cleanText(String(val ?? '-'));
      txt(ctx, text, y + 10, MARGIN + colW * (i + 1) + 4, 8, norm, C_WHITE);
    });
    y += 15;
  });

  y += 16;

  // ── Section 2 — Scores ──────────────────────────────────────────────────────
  if (y + 120 > H - FOOTER_H) { [ctx, y] = addContentPage(); }

  txt(ctx, 'SCORES DALILI', y, MARGIN, 8, bold, C_BLUE);
  y += 14;

  const SCORE_ROWS = [
    { key: 'budget',     label: 'Budget' },
    { key: 'emploi',     label: 'Emploi / Stage' },
    { key: 'communaute', label: 'Communaute' },
    { key: 'meteo',      label: 'Meteo / Qualite de vie' },
    { key: 'transport',  label: 'Transport' },
  ] as const;

  fillRect(ctx, y, 15, MARGIN, CW, C_ROW_HEAD);
  villes.forEach((v, i) => {
    txt(ctx, cleanText(v.city.name), y + 10, MARGIN + colW * (i + 1) + 4, 8.5, bold, C_WHITE);
  });
  y += 15;

  SCORE_ROWS.forEach(({ key, label }, ri) => {
    fillRect(ctx, y, 17, MARGIN, CW, ri % 2 === 0 ? C_ROW_A : C_ROW_B);
    txt(ctx, label, y + 11, MARGIN + 4, 8, norm, C_MID);
    villes.forEach((v, i) => {
      const score = v.scores[key];
      const scoreColor = hexToRgb(v.color);
      scoreBar(ctx, score, y + 7, MARGIN + colW * (i + 1) + 4, scoreColor);
      txt(ctx, `${score}/5`, y + 11, MARGIN + colW * (i + 1) + 60, 7, norm, C_MID);
    });
    y += 17;
  });

  y += 16;

  // ── Section 3 — Avantages & Inconvénients ──────────────────────────────────
  if (y + 80 > H - FOOTER_H) { [ctx, y] = addContentPage(); }

  txt(ctx, 'AVANTAGES & INCONVENIENTS', y, MARGIN, 8, bold, C_BLUE);
  y += 14;

  const advColW = CW / villes.length;

  villes.forEach((v, i) => {
    fillRect(ctx, y, 14, MARGIN + advColW * i, advColW, hexToRgb(v.color));
    txt(ctx, cleanText(v.city.name), y + 10, MARGIN + advColW * i + 5, 8.5, bold, C_WHITE);
  });
  y += 14;

  const maxRows = Math.min(Math.max(...villes.map(v => Math.max(v.city.pros.length, v.city.cons.length))), 5);
  for (let row = 0; row < maxRows; row++) {
    if (y + 22 > H - FOOTER_H) { [ctx, y] = addContentPage(); }
    villes.forEach((v, i) => {
      const rawPro = v.city.pros[row] ? cleanText(v.city.pros[row]) : '';
      const rawCon = v.city.cons[row] ? cleanText(v.city.cons[row]) : '';
      const xBase = MARGIN + advColW * i + 4;
      if (rawPro) {
        const proTxt = rawPro.length > 55 ? rawPro.slice(0, 55) + '...' : rawPro;
        txt(ctx, `+ ${proTxt}`, y + 8, xBase, 6.5, norm, C_GREEN);
        y += 10;
      }
      if (rawCon) {
        const conTxt = rawCon.length > 55 ? rawCon.slice(0, 55) + '...' : rawCon;
        txt(ctx, `- ${conTxt}`, y + 8, xBase, 6.5, norm, C_ORANGE);
        y += 10;
      }
    });
    y += 4;
  }

  y += 14;

  // ── Section 4 — Avis Dalili ─────────────────────────────────────────────────
  if (y + 60 > H - FOOTER_H) { [ctx, y] = addContentPage(); }

  txt(ctx, 'AVIS DALILI', y, MARGIN, 8, bold, C_BLUE);
  y += 13;

  for (const v of villes) {
    if (y + 45 > H - FOOTER_H) { [ctx, y] = addContentPage(); }
    txt(ctx, cleanText(v.city.name), y + 9, MARGIN, 9, bold, C_WHITE);
    y += 12;
    const rawAvis = cleanText(v.city.avis);
    const avis = rawAvis.slice(0, 250) + (rawAvis.length > 250 ? '...' : '');
    const lines = Math.ceil(avis.length / 90);
    // Draw avis line by line (basic wrap approximation)
    const charsPerLine = 90;
    for (let i = 0; i < lines && i < 4; i++) {
      const line = avis.slice(i * charsPerLine, (i + 1) * charsPerLine);
      txt(ctx, line, y + 9, MARGIN + 4, 7.5, norm, C_MID);
      y += 10;
    }
    y += 8;
  }

  y += 8;

  // ── Section 5 — Recommandation ──────────────────────────────────────────────
  if (y + 70 > H - FOOTER_H) { [ctx, y] = addContentPage(); }

  fillRect(ctx, y, 0.5, MARGIN, CW, rgb(0.1, 0.16, 0.29));
  y += 12;

  txt(ctx, 'RECOMMANDATION DALILI', y, MARGIN, 8, bold, C_GOLD);
  y += 13;

  const recoText = cleanText(recommandation.replace(/\*\*/g, '')).slice(0, 380);
  const recoLines = Math.ceil(recoText.length / 88);
  const charsPerLine = 88;
  for (let i = 0; i < recoLines && i < 6; i++) {
    const line = recoText.slice(i * charsPerLine, (i + 1) * charsPerLine);
    txt(ctx, line, y + 9, MARGIN + 4, 8, norm, C_WHITE);
    y += 11;
  }

  y += 10;

  // ── Footer ──────────────────────────────────────────────────────────────────
  fillRect(ctx, y, 0.5, MARGIN, CW, rgb(0.1, 0.12, 0.25));
  y += 10;

  const blogLinks = [
    'dalili.study/blog/budget-mensuel-etudiant-etranger-france-2026',
    'dalili.study/blog/logement-crous-etudiant-etranger-demande',
    'dalili.study/blog/trouver-logement-france-depuis-etranger',
  ];
  txt(ctx, 'Guides utiles :', y, MARGIN, 7.5, norm, C_MID);
  y += 10;
  blogLinks.forEach(link => {
    txt(ctx, `-  ${link}`, y, MARGIN + 4, 7, norm, C_BLUE);
    y += 9;
  });
  y += 6;
  centered(ctx, 'dalili.study  |  Comparatif genere gratuitement  |  2026', y, 7.5, norm, C_MID);

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

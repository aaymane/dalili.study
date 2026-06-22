import type { City } from './cities';
import type { CityScores } from './comparer-scores';

const BG_BODY  = '#070b18';
const BG_HEAD  = '#0a1628';
const TEXT_W   = '#ffffff';
const TEXT_MID = '#8899bb';
const ACCENT   = '#014DF8';
const GOLD     = '#f59e0b';

// SVG logo paths — viewBox "-1 105 70 71"
const LOGO_P1 = 'M45.83,124.17h-13.08s-12.61,12.62-12.61,12.62l6.87,6.9,10.2-10.03c.93-.48,3.49-.48,4.16.29l11.98,13.73-12.33,12.45c-1.41,1.43-2.43,2.99-4.05,4.34h-16.74c-1.73-1.43-2.84-2.99-4.25-4.58-5.09-5.75-10.17-11.5-15.26-17.25-.21-.22-.38-.39-.5-.5-.05-.04-.11-.1-.21-.14,0,0,0,0-.01,0,.1.12.08.58.08.84v14.73s14.37,16.39,14.37,16.39l26.56.04,2.49-2.55,23.38-23.49-21.05-23.8Z';
const LOGO_P2 = 'M36.97,164.47h-16.74s16.74,0,16.74,0Z';
const LOGO_P3 = 'M66.99,125.02l-14.38-16.39-26.56-.04-2.49,2.55L.19,134.62l21.05,23.8h13.08s12.61-12.62,12.61-12.62l-6.87-6.9-10.2,10.03c-.93.48-3.49.48-4.16-.29l-11.98-13.73,12.33-12.45c1.41-1.43,2.43-2.99,4.05-4.34h16.74c1.73,1.43,2.84,2.99,4.25,4.58l15.26,17.25c.28.32.46.55.73.65-.03-5.2-.05-10.39-.08-15.59Z';

function drawLogo(doc: PDFKit.PDFDocument, cx: number, topY: number, size: number) {
  const s = size / 70;
  doc.save();
  doc.translate(cx - size / 2 + 1 * s, topY - 105 * s);
  doc.scale(s, s);
  doc.fillColor(TEXT_W);
  doc.path(LOGO_P1).fill();
  doc.path(LOGO_P2).fill();
  doc.path(LOGO_P3).fill();
  doc.restore();
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function drawStars(
  doc: PDFKit.PDFDocument,
  score: number,
  x: number,
  y: number,
  starSize = 7,
  color = ACCENT,
) {
  const full     = Math.floor(score);
  const hasHalf  = score % 1 >= 0.5;
  const empty    = 5 - full - (hasHalf ? 1 : 0);
  const gap      = starSize + 3;
  let cx         = x;
  const cy       = y + starSize / 2;

  const drawStar = (cx: number, filled: boolean) => {
    const pts: [number, number][] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI / 2) + (i * 2 * Math.PI) / 5;
      pts.push([cx + (starSize / 2) * Math.cos(angle), cy - (starSize / 2) * Math.sin(angle)]);
      const innerAngle = angle + Math.PI / 5;
      pts.push([cx + (starSize / 4) * Math.cos(innerAngle), cy - (starSize / 4) * Math.sin(innerAngle)]);
    }
    doc.save();
    doc.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) doc.lineTo(pts[i][0], pts[i][1]);
    doc.closePath();
    if (filled) doc.fillColor(color).fill();
    else        doc.fillColor('#1a2a4a').fill();
    doc.restore();
  };

  for (let i = 0; i < full; i++, cx += gap) drawStar(cx, true);
  if (hasHalf) { drawStar(cx, true); cx += gap; } // simplified half = filled
  for (let i = 0; i < empty; i++, cx += gap) drawStar(cx, false);
}

export interface ComparateurPDFData {
  city:     City;
  scores:   CityScores;
  color:    string;
  recoBest: boolean;
}

export async function generateComparateurPDF(
  villes: ComparateurPDFData[],
  recommandation: string,
): Promise<Buffer> {
  const PDFDocument = (await import('pdfkit')).default;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      info: {
        Title:   `Comparatif villes — ${villes.map(v => v.city.name).join(' vs ')}`,
        Author:  'Dalili (dalili.study)',
        Subject: 'Comparatif villes étudiantes France',
      },
    });

    const buffers: Buffer[] = [];
    doc.on('data',  chunk => buffers.push(chunk));
    doc.on('end',   ()    => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const W      = doc.page.width;
    const MARGIN = 36;
    const CX     = W / 2;

    const fillPage = () => doc.rect(0, 0, W, doc.page.height + 1000).fill(BG_BODY);
    fillPage();

    // ── Header ───────────────────────────────────────────────────────────
    const headerH = 160;
    doc.rect(0, 0, W, headerH).fill(BG_HEAD);
    doc.rect(0, 0, W, 3).fill(ACCENT);

    const logoSize = 38;
    drawLogo(doc, CX, 18, logoSize);

    doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(12)
       .text('DALILI', 0, 18 + logoSize + 8, { align: 'center', width: W, characterSpacing: 7 });

    const lineY = 18 + logoSize + 28;
    doc.rect(CX - 14, lineY, 28, 2).fill(ACCENT);

    doc.fillColor(ACCENT).font('Helvetica').fontSize(8)
       .text('dalili.study', 0, lineY + 7, { align: 'center', width: W });

    // ── Title ─────────────────────────────────────────────────────────────
    let y = headerH + 20;

    doc.fillColor(TEXT_MID).font('Helvetica').fontSize(8)
       .text('COMPARATIF VILLES ÉTUDIANTES', MARGIN, y, { characterSpacing: 1.5 });
    y += 16;

    const titre = villes.map(v => v.city.name).join(' vs ');
    doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(15)
       .text(titre, MARGIN, y);
    y += 22;

    doc.rect(MARGIN, y, W - MARGIN * 2, 0.5).fill('#1a2a4a');
    y += 16;

    // ── Section 1 — Budget & Logement (table) ─────────────────────────────
    doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(9)
       .text('BUDGET & LOGEMENT', MARGIN, y, { characterSpacing: 1 });
    y += 16;

    const colW = (W - MARGIN * 2) / (villes.length + 1);
    const ROWS = [
      { label: 'Chambre CROUS',   key: 'costCrous'     as keyof City },
      { label: 'Studio privé',    key: 'costStudio'    as keyof City },
      { label: 'Colocation',      key: 'costColoc'     as keyof City },
      { label: 'Transport/mois',  key: 'costTransport' as keyof City },
      { label: 'Budget min/mois', key: 'monthlyBudgetMin' as keyof City },
      { label: 'Budget max/mois', key: 'monthlyBudgetMax' as keyof City },
    ];

    // Header row
    doc.rect(MARGIN, y, W - MARGIN * 2, 18).fill('#0d1930');
    villes.forEach((v, i) => {
      const rgb = hexToRgb(v.color);
      doc.rect(MARGIN + colW * (i + 1), y, colW, 18).fill(rgb);
      doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(9)
         .text(v.city.name, MARGIN + colW * (i + 1) + 4, y + 5, { width: colW - 8, ellipsis: true });
    });
    y += 18;

    ROWS.forEach((row, ri) => {
      const rowBg = ri % 2 === 0 ? '#0a1022' : '#0c1228';
      doc.rect(MARGIN, y, W - MARGIN * 2, 16).fill(rowBg);
      doc.fillColor(TEXT_MID).font('Helvetica').fontSize(8)
         .text(row.label, MARGIN + 4, y + 4, { width: colW - 8 });
      villes.forEach((v, i) => {
        const val = v.city[row.key];
        const text = typeof val === 'number' ? `${val} €` : String(val ?? '-');
        doc.fillColor(TEXT_W).font('Helvetica').fontSize(8)
           .text(text, MARGIN + colW * (i + 1) + 4, y + 4, { width: colW - 8 });
      });
      y += 16;
    });

    y += 18;

    // ── Section 2 — Scores DALILI ─────────────────────────────────────────
    if (y + 130 > doc.page.height - 60) {
      doc.addPage(); fillPage(); y = MARGIN;
    }

    doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(9)
       .text('SCORES DALILI', MARGIN, y, { characterSpacing: 1 });
    y += 16;

    const SCORE_LABELS = [
      { key: 'budget',     label: 'Budget' },
      { key: 'emploi',     label: 'Emploi / Stage' },
      { key: 'communaute', label: 'Communauté' },
      { key: 'meteo',      label: 'Météo / Qualité de vie' },
      { key: 'transport',  label: 'Transport' },
    ] as const;

    const scoreColW = (W - MARGIN * 2) / (villes.length + 1);

    // Header
    doc.rect(MARGIN, y, W - MARGIN * 2, 16).fill('#0d1930');
    villes.forEach((v, i) => {
      doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(8)
         .text(v.city.name, MARGIN + scoreColW * (i + 1) + 4, y + 4, { width: scoreColW - 8, ellipsis: true });
    });
    y += 16;

    SCORE_LABELS.forEach(({ key, label }, ri) => {
      const rowBg = ri % 2 === 0 ? '#0a1022' : '#0c1228';
      doc.rect(MARGIN, y, W - MARGIN * 2, 18).fill(rowBg);
      doc.fillColor(TEXT_MID).font('Helvetica').fontSize(8).text(label, MARGIN + 4, y + 5, { width: scoreColW - 8 });
      villes.forEach((v, i) => {
        const score = v.scores[key];
        drawStars(doc, score, MARGIN + scoreColW * (i + 1) + 4, y + 5, 6, v.color);
      });
      y += 18;
    });

    y += 18;

    // ── Section 3 — Avantages & Inconvénients ─────────────────────────────
    if (y + 100 > doc.page.height - 60) {
      doc.addPage(); fillPage(); y = MARGIN;
    }

    doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(9)
       .text('AVANTAGES & INCONVÉNIENTS', MARGIN, y, { characterSpacing: 1 });
    y += 16;

    const advColW = (W - MARGIN * 2) / villes.length;

    villes.forEach((v, i) => {
      const rgb = hexToRgb(v.color);
      doc.rect(MARGIN + advColW * i, y, advColW, 14).fill(rgb);
      doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(9)
         .text(v.city.name, MARGIN + advColW * i + 6, y + 3, { width: advColW - 12 });
    });
    y += 14;

    const maxAdvRows = Math.max(...villes.map(v => Math.max(v.city.pros.length, v.city.cons.length)));
    const ADV_LINE_H = 11;

    for (let row = 0; row < Math.min(maxAdvRows, 5); row++) {
      if (y + ADV_LINE_H * 2 + 4 > doc.page.height - 60) {
        doc.addPage(); fillPage(); y = MARGIN;
      }
      villes.forEach((v, i) => {
        const pro = v.city.pros[row];
        const con = v.city.cons[row];
        if (pro) {
          doc.fillColor('#22c55e').font('Helvetica').fontSize(6.5)
             .text(`+ ${pro}`, MARGIN + advColW * i + 4, y, { width: advColW - 8, lineGap: 0 });
          y += ADV_LINE_H;
        }
        if (con) {
          doc.fillColor('#f59e0b').font('Helvetica').fontSize(6.5)
             .text(`- ${con}`, MARGIN + advColW * i + 4, y, { width: advColW - 8, lineGap: 0 });
          y += ADV_LINE_H;
        }
      });
      y += 4;
    }

    y += 14;

    // ── Section 4 — Avis DALILI ───────────────────────────────────────────
    if (y + 80 > doc.page.height - 60) {
      doc.addPage(); fillPage(); y = MARGIN;
    }

    doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(9)
       .text('AVIS DALILI', MARGIN, y, { characterSpacing: 1 });
    y += 14;

    villes.forEach(v => {
      if (y + 50 > doc.page.height - 60) {
        doc.addPage(); fillPage(); y = MARGIN;
      }
      doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(9).text(v.city.name, MARGIN, y);
      y += 12;
      const avisText = v.city.avis.slice(0, 320) + (v.city.avis.length > 320 ? '…' : '');
      doc.fillColor(TEXT_MID).font('Helvetica').fontSize(8)
         .text(avisText, MARGIN + 4, y, { width: W - MARGIN * 2 - 4, lineGap: 1.5 });
      y += Math.ceil(avisText.length / 90) * 10 + 12;
    });

    // ── Section 5 — Recommandation ────────────────────────────────────────
    if (y + 80 > doc.page.height - 60) {
      doc.addPage(); fillPage(); y = MARGIN;
    }

    doc.rect(MARGIN, y, W - MARGIN * 2, 0.5).fill('#1a2a4a');
    y += 14;

    doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(9)
       .text('RECOMMANDATION DALILI', MARGIN, y, { characterSpacing: 1 });
    y += 14;

    const recoLines = recommandation.slice(0, 400);
    doc.fillColor(TEXT_W).font('Helvetica').fontSize(9)
       .text(recoLines, MARGIN + 4, y, { width: W - MARGIN * 2 - 4, lineGap: 1.5 });
    y += Math.ceil(recoLines.length / 90) * 11 + 16;

    // ── Footer ────────────────────────────────────────────────────────────
    doc.rect(MARGIN, y, W - MARGIN * 2, 0.5).fill('#1a2040');
    y += 10;

    const blogLinks = [
      'dalili.study/blog/budget-mensuel-etudiant-etranger-france-2026',
      'dalili.study/blog/logement-crous-etudiant-etranger-demande',
      'dalili.study/blog/trouver-logement-france-depuis-etranger',
    ];
    doc.fillColor(TEXT_MID).font('Helvetica').fontSize(7)
       .text('Guides utiles :', MARGIN, y);
    y += 10;
    blogLinks.forEach(link => {
      doc.fillColor(ACCENT).font('Helvetica').fontSize(7).text(`• ${link}`, MARGIN + 4, y);
      y += 9;
    });

    y += 6;
    doc.fillColor(TEXT_MID).font('Helvetica').fontSize(8)
       .text('dalili.study · Comparatif généré gratuitement', MARGIN, y, {
         align: 'center', width: W - MARGIN * 2,
       });

    doc.end();
  });
}

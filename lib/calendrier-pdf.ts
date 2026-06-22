import type { CalendrierStep } from './calendrier-data';

const URGENCE_COLOR = {
  rouge:  '#ef4444',
  orange: '#f59e0b',
  vert:   '#014DF8',
} as const;

const URGENCE_RGB = {
  rouge:  [239, 68, 68],
  orange: [245, 158, 11],
  vert:   [1, 77, 248],
} as const;

const BG_DARK  = '#0a0f1e';
const BG_BODY  = '#070b18';
const TEXT_W   = '#ffffff';
const TEXT_MID = '#8899bb';
const ACCENT   = '#014DF8';

export async function generateCalendrierPDF(
  paysLabel:    string,
  paysEmoji:    string,
  rentreeLabel: string,
  etapes:       CalendrierStep[],
): Promise<Buffer> {
  const PDFDocument = (await import('pdfkit')).default;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      info: {
        Title:   `Calendrier Campus France — ${paysLabel} → ${rentreeLabel}`,
        Author:  'Dalili (dalili.study)',
        Subject: 'Planning Campus France personnalisé',
      },
    });

    const buffers: Buffer[] = [];
    doc.on('data',  chunk => buffers.push(chunk));
    doc.on('end',   ()    => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const W    = doc.page.width;   // 595.28
    const MARGIN = 40;

    // ── Background ────────────────────────────────────────────────────
    doc.rect(0, 0, W, doc.page.height * 2).fill(BG_BODY);

    // ── Header band ───────────────────────────────────────────────────
    const headerH = 120;
    doc.rect(0, 0, W, headerH).fill('#0a1628');

    // Top accent line
    doc.rect(0, 0, W, 3).fill(ACCENT);

    // DALILI wordmark
    doc.fillColor(TEXT_W)
       .font('Helvetica-Bold')
       .fontSize(22)
       .text('DALILI', MARGIN, 32, { characterSpacing: 8 });

    // Tagline
    doc.fillColor(TEXT_MID)
       .font('Helvetica')
       .fontSize(10)
       .text('dalili.study · Ton guide étudiant France', MARGIN, 60);

    // Accent line
    doc.rect(MARGIN, 80, 32, 2).fill(ACCENT);

    // ── Title section ─────────────────────────────────────────────────
    let y = headerH + 28;

    doc.fillColor(TEXT_MID)
       .font('Helvetica')
       .fontSize(9)
       .text('TON CALENDRIER PERSONNALISÉ', MARGIN, y, { characterSpacing: 1.5 });

    y += 18;

    doc.fillColor(TEXT_W)
       .font('Helvetica-Bold')
       .fontSize(18)
       .text(`${paysLabel} → ${rentreeLabel}`, MARGIN, y);

    y += 28;

    doc.fillColor(TEXT_MID)
       .font('Helvetica')
       .fontSize(10)
       .text(`${etapes.length} étapes · De ${etapes[0]?.mois} à ${etapes[etapes.length - 1]?.mois}`, MARGIN, y);

    y += 20;

    // Separator
    doc.rect(MARGIN, y, W - MARGIN * 2, 0.5).fill('rgba(255,255,255,0.1)');
    y += 16;

    // Legend
    const legendItems: Array<{ urgence: keyof typeof URGENCE_COLOR; label: string }> = [
      { urgence: 'rouge',  label: 'Urgent' },
      { urgence: 'orange', label: 'Important' },
      { urgence: 'vert',   label: 'Préparation' },
    ];
    let lx = MARGIN;
    legendItems.forEach(item => {
      const [r, g, b] = URGENCE_RGB[item.urgence];
      doc.rect(lx, y + 1, 3, 12).fill([r / 255, g / 255, b / 255]);
      doc.fillColor(TEXT_MID)
         .font('Helvetica')
         .fontSize(8)
         .text(item.label, lx + 8, y + 2);
      lx += 80;
    });

    y += 24;

    // ── Step cards ────────────────────────────────────────────────────
    const CARD_MARGIN = 3;
    const CARD_PADDING_V = 14;
    const CARD_PADDING_L = 20;

    etapes.forEach(step => {
      const [r, g, b] = URGENCE_RGB[step.urgence];
      const urgenceRGB: [number, number, number] = [r / 255, g / 255, b / 255];

      // Estimate card height
      const descLines = Math.ceil(step.description.length / 75) + 1;
      const cardH = CARD_PADDING_V * 2
                  + (step.isArrivee ? 20 : 0)
                  + 14   // mois label
                  + 18   // action title
                  + descLines * 12
                  + (step.lien ? 16 : 0);

      // Page break
      if (y + cardH > doc.page.height - 60) {
        doc.addPage();
        doc.rect(0, 0, W, doc.page.height * 2).fill(BG_BODY);
        y = MARGIN;
      }

      // Card background
      doc.rect(MARGIN, y, W - MARGIN * 2, cardH)
         .fill(BG_DARK);

      // Left accent border
      doc.rect(MARGIN, y, 3, cardH)
         .fill(urgenceRGB);

      let cy = y + CARD_PADDING_V;

      // Arrival badge
      if (step.isArrivee) {
        doc.rect(MARGIN + CARD_PADDING_L, cy - 2, 120, 14)
           .fill([239 / 255, 68 / 255, 68 / 255, 0.15]);
        doc.fillColor('#ef4444')
           .font('Helvetica-Bold')
           .fontSize(7)
           .text('✈ ARRIVÉE EN FRANCE', MARGIN + CARD_PADDING_L + 6, cy);
        cy += 18;
      }

      // Month label
      doc.fillColor(URGENCE_COLOR[step.urgence])
         .font('Helvetica-Bold')
         .fontSize(8)
         .text(step.mois.toUpperCase(), MARGIN + CARD_PADDING_L, cy, { characterSpacing: 1 });
      cy += 14;

      // Action title
      doc.fillColor(TEXT_W)
         .font('Helvetica-Bold')
         .fontSize(12)
         .text(step.action, MARGIN + CARD_PADDING_L, cy, {
           width:    W - MARGIN * 2 - CARD_PADDING_L - 10,
           lineGap:  2,
         });
      cy += 18;

      // Description
      doc.fillColor(TEXT_MID)
         .font('Helvetica')
         .fontSize(9)
         .text(step.description, MARGIN + CARD_PADDING_L, cy, {
           width:   W - MARGIN * 2 - CARD_PADDING_L - 10,
           lineGap: 1.5,
         });
      cy += descLines * 11;

      // Link
      if (step.lien) {
        doc.fillColor([r / 255, g / 255, b / 255])
           .font('Helvetica-Bold')
           .fontSize(8)
           .text(`${step.lien.label} →`, MARGIN + CARD_PADDING_L, cy + 4);
      }

      y += cardH + CARD_MARGIN;
    });

    // ── Footer ────────────────────────────────────────────────────────
    if (y + 60 > doc.page.height - 10) {
      doc.addPage();
      doc.rect(0, 0, W, doc.page.height * 2).fill(BG_BODY);
      y = MARGIN;
    }

    y += 16;
    doc.rect(MARGIN, y, W - MARGIN * 2, 0.5).fill('#1a2040');
    y += 12;

    doc.fillColor(TEXT_MID)
       .font('Helvetica')
       .fontSize(8)
       .text(
         'dalili.study · Ton guide pour étudier en France · Généré gratuitement',
         MARGIN, y,
         { align: 'center', width: W - MARGIN * 2 },
       );

    doc.end();
  });
}

// SVG logo paths — viewBox "-1 105 70 71"
const LOGO_P1 = 'M45.83,124.17h-13.08s-12.61,12.62-12.61,12.62l6.87,6.9,10.2-10.03c.93-.48,3.49-.48,4.16.29l11.98,13.73-12.33,12.45c-1.41,1.43-2.43,2.99-4.05,4.34h-16.74c-1.73-1.43-2.84-2.99-4.25-4.58-5.09-5.75-10.17-11.5-15.26-17.25-.21-.22-.38-.39-.5-.5-.05-.04-.11-.1-.21-.14,0,0,0,0-.01,0,.1.12.08.58.08.84v14.73s14.37,16.39,14.37,16.39l26.56.04,2.49-2.55,23.38-23.49-21.05-23.8Z';
const LOGO_P2 = 'M36.97,164.47h-16.74s16.74,0,16.74,0Z';
const LOGO_P3 = 'M66.99,125.02l-14.38-16.39-26.56-.04-2.49,2.55L.19,134.62l21.05,23.8h13.08s12.61-12.62,12.61-12.62l-6.87-6.9-10.2,10.03c-.93.48-3.49.48-4.16-.29l-11.98-13.73,12.33-12.45c1.41-1.43,2.43-2.99,4.05-4.34h16.74c1.73,1.43,2.84,2.99,4.25,4.58l15.26,17.25c.28.32.46.55.73.65-.03-5.2-.05-10.39-.08-15.59Z';

const ACCENT   = '#014DF8';
const ACCENT_RGB: [number, number, number] = [1 / 255, 77 / 255, 248 / 255];
const BG_BODY  = '#070b18';
const BG_HEAD  = '#0a1628';
const BG_ROW   = '#0a1022';
const BG_ROW2  = '#0c1228';
const TEXT_W   = '#ffffff';
const TEXT_MID = '#8899bb';
const GREEN    = '#22c55e';

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

export interface SimulateurPDFData {
  villeName:      string;
  logementName:   string;
  niveauName:     string;
  paysName:       string;
  paySlug:        string;
  paiement_frais: 'unique' | 'mensuel';
  housing:        number;
  food:           number;
  transport:      number;
  tuitionMonthly: number;
  tuitionAnnual:  number;
  cvecMonthly:    number;
  totalDepenses:  number;
  cafEstimee:     number;
  resteAFinancer: number;
}

export async function generateSimulateurPDF(data: SimulateurPDFData): Promise<Buffer> {
  const PDFDocument = (await import('pdfkit')).default;

  return new Promise((resolve, reject) => {
    const {
      villeName, logementName, niveauName, paysName,
      paiement_frais, housing, food, transport,
      tuitionMonthly, tuitionAnnual, cvecMonthly,
      totalDepenses, cafEstimee, resteAFinancer,
    } = data;

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      info: {
        Title:   `Budget étudiant — ${villeName} — Dalili`,
        Author:  'Dalili (dalili.study)',
        Subject: `Estimation budget mensuel étudiant étranger — ${villeName}`,
      },
    });

    const buffers: Buffer[] = [];
    doc.on('data',  c => buffers.push(c));
    doc.on('end',   () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const W      = doc.page.width;   // 595.28
    const MARGIN = 40;
    const CX     = W / 2;
    const CW     = W - MARGIN * 2;

    // ── Full background ─────────────────────────────────────────────────────
    doc.rect(0, 0, W, doc.page.height + 1000).fill(BG_BODY);

    // ── Header ──────────────────────────────────────────────────────────────
    const headerH = 155;
    doc.rect(0, 0, W, headerH).fill(BG_HEAD);
    doc.rect(0, 0, W, 3).fill(ACCENT);

    const logoSize = 38;
    drawLogo(doc, CX, 18, logoSize);

    doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(13)
       .text('DALILI', 0, 18 + logoSize + 8, { align: 'center', width: W, characterSpacing: 7 });

    const lineY = 18 + logoSize + 28;
    doc.rect(CX - 14, lineY, 28, 2).fill(ACCENT);

    doc.fillColor(ACCENT).font('Helvetica').fontSize(8)
       .text('dalili.study', 0, lineY + 7, { align: 'center', width: W });

    // ── Page title ──────────────────────────────────────────────────────────
    let y = headerH + 22;

    doc.fillColor(TEXT_MID).font('Helvetica').fontSize(8)
       .text('ESTIMATION BUDGET MENSUEL', MARGIN, y, { characterSpacing: 1.5 });
    y += 16;

    doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(16)
       .text(`Étudier à ${villeName}`, MARGIN, y);
    y += 20;

    doc.fillColor(TEXT_MID).font('Helvetica').fontSize(9)
       .text(`${niveauName} · ${logementName} · ${paysName}`, MARGIN, y);
    y += 18;

    doc.rect(MARGIN, y, CW, 0.5).fill('#1a2a4a');
    y += 18;

    // ── Budget table ─────────────────────────────────────────────────────────
    doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(9)
       .text('BUDGET MENSUEL ESTIMÉ', MARGIN, y, { characterSpacing: 1 });
    y += 16;

    const rows: Array<{ label: string; value: string; bold?: boolean; color?: string; bg?: string }> = [
      { label: `Loyer (${logementName})`, value: `${housing} €` },
      { label: 'Nourriture',              value: `${food} €` },
      { label: 'Transport mensuel',       value: `${transport} €` },
      { label: 'Téléphone / internet',    value: '30 €' },
      { label: 'Loisirs, divers & santé', value: '100 €' },
      ...(paiement_frais === 'mensuel' && tuitionMonthly > 0
        ? [{ label: 'Frais inscription (mensuel)', value: `${tuitionMonthly} €` }]
        : []),
      ...(cvecMonthly > 0
        ? [{ label: 'CVEC (mensuelle)', value: `${cvecMonthly} €` }]
        : []),
    ];

    // Column positions
    const COL_LABEL = MARGIN + 10;
    const COL_VALUE = W - MARGIN - 10;
    const ROW_H     = 20;

    // Table header row
    doc.rect(MARGIN, y, CW, 18).fill('#0d1930');
    doc.fillColor(TEXT_MID).font('Helvetica-Bold').fontSize(8)
       .text('Poste de dépense', COL_LABEL, y + 5);
    doc.fillColor(TEXT_MID).font('Helvetica-Bold').fontSize(8)
       .text('Montant/mois', COL_VALUE - 60, y + 5);
    y += 18;

    rows.forEach((row, i) => {
      doc.rect(MARGIN, y, CW, ROW_H).fill(i % 2 === 0 ? BG_ROW : BG_ROW2);
      doc.fillColor(row.color ?? TEXT_W).font(row.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(10)
         .text(row.label, COL_LABEL, y + 5, { width: CW - 90 });
      doc.fillColor(row.color ?? TEXT_W).font(row.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(10)
         .text(row.value, COL_VALUE - 60, y + 5, { width: 70, align: 'right' });
      y += ROW_H;
    });

    // Total row
    y += 4;
    doc.rect(MARGIN, y, CW, 22).fill('#0d1930');
    doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(12)
       .text('TOTAL DÉPENSES', COL_LABEL, y + 5);
    doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(13)
       .text(`${totalDepenses} €/mois`, COL_VALUE - 80, y + 4, { width: 90, align: 'right' });
    y += 22;

    // CAF row
    doc.rect(MARGIN, y, CW, 20).fill('#0a1a14');
    doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(10)
       .text('CAF estimée (aide logement)', COL_LABEL, y + 5);
    doc.fillColor(GREEN).font('Helvetica-Bold').fontSize(10)
       .text(`−${cafEstimee} €`, COL_VALUE - 80, y + 5, { width: 90, align: 'right' });
    y += 20;

    // Reste row — highlighted blue
    doc.rect(MARGIN, y, CW, 24).fill(ACCENT_RGB);
    doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(12)
       .text('RESTE À FINANCER', COL_LABEL, y + 6);
    doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(14)
       .text(`${resteAFinancer} €/mois`, COL_VALUE - 85, y + 5, { width: 95, align: 'right' });
    y += 24;

    // Frais unique section
    if (paiement_frais === 'unique' && tuitionAnnual > 0) {
      y += 14;
      doc.rect(MARGIN, y, CW, 0.5).fill('#1a2a4a');
      y += 12;
      doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(9)
         .text('FRAIS D\'INSCRIPTION (paiement unique)', MARGIN, y, { characterSpacing: 1 });
      y += 14;

      doc.rect(MARGIN, y, CW, 26).fill('#080f20');
      doc.fillColor(TEXT_W).font('Helvetica-Bold').fontSize(13)
         .text(`${tuitionAnnual} € par an`, MARGIN + 10, y + 6);
      doc.fillColor(TEXT_MID).font('Helvetica').fontSize(9)
         .text('(exonération possible selon bourse / pays d\'origine)', MARGIN + 10, y + 24);
      y += 40;
    }

    // ── Prochaines étapes ────────────────────────────────────────────────────
    y += 8;
    if (y > doc.page.height - 160) {
      doc.addPage();
      doc.rect(0, 0, W, doc.page.height + 1000).fill(BG_BODY);
      y = MARGIN;
    }

    doc.rect(MARGIN, y, CW, 0.5).fill('#1a2a4a');
    y += 14;

    doc.fillColor(ACCENT).font('Helvetica-Bold').fontSize(9)
       .text('GUIDES UTILES', MARGIN, y, { characterSpacing: 1 });
    y += 16;

    const links: Array<{ label: string; url: string }> = [
      { label: 'Budget mensuel étudiant étranger 2026',           url: 'https://dalili.study/blog/budget-mensuel-etudiant-etranger-france-2026' },
      { label: 'Logement CROUS depuis l\'étranger',               url: 'https://dalili.study/blog/logement-crous-etudiant-etranger-demande' },
      { label: 'CAF étudiant étranger — délais et documents',     url: 'https://dalili.study/blog/caf-etudiant-etranger-delais-documents-erreurs' },
      { label: 'Trouver un logement avant d\'arriver en France',  url: 'https://dalili.study/blog/trouver-logement-france-depuis-etranger' },
      { label: 'Checklist complète arrivée en France',            url: 'https://dalili.study/checklist' },
      { label: 'Simulateur budget (recommencer)',                  url: 'https://dalili.study/simulateur' },
    ];

    links.forEach(link => {
      if (y > doc.page.height - 50) {
        doc.addPage();
        doc.rect(0, 0, W, doc.page.height + 1000).fill(BG_BODY);
        y = MARGIN;
      }
      doc.save();
      // Draw clickable link
      doc.fillColor(ACCENT).font('Helvetica').fontSize(9)
         .text(`• ${link.label}`, MARGIN + 4, y, { width: CW - 4, continued: false });
      doc.link(MARGIN + 4, y - 1, CW - 4, 12, link.url);
      doc.restore();
      y += 14;
    });

    // ── Note bas de page ─────────────────────────────────────────────────────
    y += 10;
    doc.rect(MARGIN, y, CW, 0.5).fill('#1a2040');
    y += 10;

    doc.fillColor(TEXT_MID).font('Helvetica').fontSize(8)
       .text(
         'Ces chiffres sont des estimations. La CAF réelle dépend de votre situation personnelle. Vérifiez sur caf.fr',
         MARGIN, y,
         { width: CW, align: 'center' },
       );
    y += 14;

    // ── Footer ───────────────────────────────────────────────────────────────
    doc.fillColor(TEXT_MID).font('Helvetica').fontSize(8)
       .text(
         'dalili.study · Guide des étudiants internationaux en France · 2026',
         MARGIN, y,
         { width: CW, align: 'center' },
       );

    doc.end();
  });
}

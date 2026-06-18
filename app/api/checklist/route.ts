import { renderToBuffer } from '@react-pdf/renderer';
import { ChecklistDocument } from '@/lib/ChecklistPDF';
import React from 'react';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const buffer = await renderToBuffer(React.createElement(ChecklistDocument));
    const uint8 = new Uint8Array(buffer);

    return new Response(uint8, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="checklist-arrivee-france-dalili-2026.pdf"',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    console.error('PDF generation failed:', err);
    return new Response('PDF generation failed', { status: 500 });
  }
}

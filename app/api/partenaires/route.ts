// Partnership requests from dalili.study/partenaires (banks, schools, insurers, housing, mobility, associations).
// Written with the service key into public.partner_leads (no public access: see dalili-app
// supabase/migrations/20261030230000_partenaires.sql), then the team gets an email. Anti-spam: a hidden field that
// humans never fill, a minimum time on the form, and at most 3 requests per hour from the same network (hashed IP).

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getClientIp } from '@/lib/assistant/rate-limit';
import { PARTNER_KIND_LABEL, PARTNER_LIMITS as L, isPartnerKind } from '@/lib/partner-leads';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PER_HOUR = 3;
const MIN_FILL_MS = 3000;
const FROM = 'Dalili <bonjour@dalili.study>';
const TEAM = 'boyayman388@gmail.com';

const clean = (v: unknown, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: 'Requête invalide.' }, { status: 400 });

  // Robots: the hidden field is filled, or the form was sent faster than a human can type.
  if (clean(body.website_confirm, 50) || Date.now() - Number(body.startedAt ?? 0) < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  const lead = {
    organization: clean(body.organization, L.organization),
    kind: clean(body.kind, 20),
    contact_name: clean(body.contactName, L.contactName),
    job_title: clean(body.jobTitle, L.jobTitle) || null,
    email: clean(body.email, L.email).toLowerCase(),
    phone: clean(body.phone, L.phone) || null,
    website: clean(body.website, L.website) || null,
    zone: clean(body.zone, L.zone) || null,
    message: String(body.message ?? '').trim().slice(0, L.message),
  };
  if (lead.organization.length < 2 || lead.contact_name.length < 2) {
    return NextResponse.json({ ok: false, error: 'Indiquez votre organisation et votre nom.' }, { status: 400 });
  }
  if (!isPartnerKind(lead.kind)) {
    return NextResponse.json({ ok: false, error: 'Choisissez le type de votre organisation.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(lead.email)) return NextResponse.json({ ok: false, error: 'Cet email ne semble pas valide.' }, { status: 400 });
  if (lead.message.length < L.messageMin) return NextResponse.json({ ok: false, error: 'Dites-nous en quelques mots ce que vous imaginez.' }, { status: 400 });
  if (body.consent !== true) return NextResponse.json({ ok: false, error: 'Acceptez d’être recontacté pour envoyer votre demande.' }, { status: 400 });

  const ipHash = crypto.createHash('sha256').update(getClientIp(request.headers)).digest('hex');
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin.from('partner_leads').select('*', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', since);
  if ((count ?? 0) >= MAX_PER_HOUR) {
    return NextResponse.json({ ok: false, error: 'Plusieurs demandes viennent déjà d’ici. Réessayez dans une heure, ou écrivez à bonjour@dalili.study.' }, { status: 429 });
  }

  const { error } = await supabaseAdmin.from('partner_leads').insert({ ...lead, ip_hash: ipHash });
  if (error) {
    console.error('[partenaires] insert failed:', error.message);
    return NextResponse.json({ ok: false, error: 'Envoi impossible pour le moment. Réessayez, ou écrivez à bonjour@dalili.study.' }, { status: 500 });
  }

  // The team is told right away; a failed email never loses the request (it is in the admin).
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const rows: [string, string | null][] = [
      ['Organisation', lead.organization],
      ['Type', PARTNER_KIND_LABEL[lead.kind]],
      ['Contact', `${lead.contact_name}${lead.job_title ? ` · ${lead.job_title}` : ''}`],
      ['Email', lead.email],
      ['Téléphone', lead.phone],
      ['Site', lead.website],
      ['Zone', lead.zone],
    ];
    await new Resend(apiKey).emails
      .send({
        from: FROM,
        to: TEAM,
        replyTo: lead.email,
        subject: `Nouvelle demande de partenariat — ${lead.organization}`,
        html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#010510;color:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(1,77,248,0.3)">
          <div style="background:linear-gradient(135deg,#014df8 0%,#0a1628 100%);padding:24px 28px"><span style="font-size:20px;font-weight:900;letter-spacing:0.18em">DALILI</span>
          <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.7)">Nouvelle demande de partenariat</p></div>
          <div style="padding:24px 28px"><table style="width:100%;border-collapse:collapse">${rows
            .filter(([, v]) => v)
            .map(([k, v]) => `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.5);font-size:13px;width:120px">${k}</td><td style="padding:8px 0;font-size:14px">${esc(v!)}</td></tr>`)
            .join('')}</table>
          <p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.85);white-space:pre-wrap">${esc(lead.message)}</p>
          <p style="margin:20px 0 0;font-size:12px;color:rgba(255,255,255,0.5)">Répondre à cet email écrit directement au contact. Suivi : admin › Partenaires.</p></div></div>`,
      })
      .catch(err => console.error('[partenaires] email failed:', err));
  }

  return NextResponse.json({ ok: true });
}

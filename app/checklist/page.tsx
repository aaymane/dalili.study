import type { Metadata } from 'next';
import Link from 'next/link';
import { Plane, Home, ClipboardList, CreditCard, Banknote, BookOpen, MapPin } from 'lucide-react';
import DownloadBtn from '@/components/checklist/DownloadBtn';
import { REGULATORY_FIGURES, getTierAt, formatTierValue } from '@/lib/data/regulatory-figures';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study';
const cvecNow = getTierAt(REGULATORY_FIGURES.cvec);

export const metadata: Metadata = {
  title: 'Checklist arrivée en France 2026 — PDF gratuit étudiant international | Dalili',
  description:
    'Télécharge la checklist complète pour ton arrivée en France : 32 points essentiels — visa VLS-TS, ANEF, CAF, Assurance Maladie, logement, banque. PDF gratuit mis à jour juin 2026.',
  alternates: { canonical: `${SITE_URL}/checklist` },
  openGraph: {
    title: 'Checklist arrivée en France 2026 — PDF gratuit | Dalili',
    description:
      'La checklist complète pour les étudiants internationaux en France : 32 démarches essentielles organisées en 3 étapes. PDF gratuit, imprimable, partageable.',
    url: `${SITE_URL}/checklist`,
    siteName: 'Dalili',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dalilistudy',
    title: 'Checklist arrivée en France 2026 — PDF gratuit | Dalili',
    description:
      '32 démarches essentielles pour ton arrivée en France. Visa, CAF, Ameli, banque, logement. PDF gratuit.',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Checklist arrivée en France', item: `${SITE_URL}/checklist` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Checklist Arrivée en France 2026',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    description:
      "Checklist PDF complète pour les étudiants internationaux arrivant en France. 32 démarches essentielles en 3 phases : avant le départ, à l'arrivée, dans les 3 premiers mois.",
    url: `${SITE_URL}/checklist`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
    author: { '@type': 'Organization', name: 'Dalili', url: SITE_URL },
    dateModified: '2026-06-18',
    inLanguage: 'fr',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "Qu'est-ce que la checklist arrivée en France ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "La checklist arrivée en France de Dalili est un PDF gratuit de 3 pages qui liste les 32 démarches essentielles pour les étudiants internationaux : préparation avant le départ (Campus France, visa VLS-TS, logement), démarches à l'arrivée (validation ANEF, Assurance Maladie, CAF) et suivi dans les 3 premiers mois (Carte Vitale, OFII, titre de séjour).",
        },
      },
      {
        '@type': 'Question',
        name: 'La checklist est-elle gratuite ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui, entièrement gratuite. Tu peux la télécharger, l'imprimer et la partager librement. Elle est mise à jour régulièrement.",
        },
      },
      {
        '@type': 'Question',
        name: "Qu'est-ce que la validation VLS-TS sur ANEF ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "La validation VLS-TS est une démarche obligatoire à effectuer dans les 3 mois suivant ton arrivée en France sur le site administration-etrangers-en-france.interieur.gouv.fr. Sans cette validation, ton visa n'est plus valable comme titre de séjour. Elle coûte environ 50€.",
        },
      },
      {
        '@type': 'Question',
        name: 'Quand faut-il faire la demande CAF en France ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "D'abord, vérifie ton éligibilité : depuis le 1er juillet 2026, un étudiant hors UE/EEE/Suisse doit être boursier sur critères sociaux, apprenti, en contrat de professionnalisation ou salarié pour avoir droit à l'APL. Si c'est ton cas, fais la demande sur caf.fr dès le premier jour dans ton logement — l'aide n'est pas rétroactive au-delà de la date de dépôt.",
        },
      },
      {
        '@type': 'Question',
        name: 'Combien de temps pour recevoir la Carte Vitale ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Après inscription à l'Assurance Maladie sur ameli.fr, tu reçois ton numéro de sécurité sociale sous 2 à 8 semaines. La Carte Vitale arrive 2 à 4 semaines après.",
        },
      },
    ],
  },
];

const PHASES = [
  {
    num: '01',
    Icon: Plane,
    title: 'Avant le départ',
    subtitle: '4 mois minimum avant ton vol',
    accent: '77,143,255',
    items: [
      { text: 'Dossier Campus France soumis et entretien passé', note: null, urgent: false },
      { text: 'Avis Campus France favorable reçu', note: null, urgent: false },
      { text: "Lettre d'admission officielle de l'établissement reçue", note: null, urgent: false },
      { text: 'Visa VLS-TS obtenu au consulat français', note: 'À valider sur ANEF dans les 3 mois après arrivée', urgent: true },
      { text: 'Passeport valide (min 18 mois de validité restants)', note: null, urgent: false },
      { text: 'Traductions certifiées : acte de naissance + diplômes', note: null, urgent: false },
      { text: 'Assurance voyage souscrite (min 30 000€ couverture)', note: null, urgent: false },
      { text: 'Logement réservé (CROUS / Studapart / HousingAnywhere)', note: 'Commence 4-5 mois avant — les places CROUS partent vite', urgent: false },
      { text: 'Compte bancaire en ligne ouvert (Revolut ou Wise)', note: "IBAN instantané, zéro frais à l'étranger", urgent: false },
      { text: 'SIM française commandée en ligne (Free, Bouygues)', note: null, urgent: false },
      { text: "Billet d'avion acheté", note: "Attends le visa avant l'achat", urgent: false },
      { text: 'Budget 3 premiers mois préparé (min 1 500€ recommandé)', note: 'Loyer + dépôt + alimentation + transport + frais admin', urgent: false },
    ],
  },
  {
    num: '02',
    Icon: Home,
    title: "À l'arrivée en France",
    subtitle: 'Semaine 1 à mois 3 — priorités absolues',
    accent: '1,77,248',
    items: [
      { text: 'Validation VLS-TS sur ANEF dans les 3 MOIS', note: 'administration-etrangers-en-france.interieur.gouv.fr · environ 50€', urgent: true },
      { text: "Inscription à l'Assurance Maladie sur ameli.fr", note: "Section : Étudiants étrangers — envoie les documents en ligne", urgent: true },
      { text: "Inscription définitive à l'université", note: "Apporte : lettre d'admission, passeport, photos, justificatif logement", urgent: false },
      { text: `Paiement CVEC (${formatTierValue(cvecNow)}) sur messervices.etudiant.gouv.fr`, note: "Obligatoire pour s'inscrire — génère une attestation immédiate", urgent: true },
      { text: 'Si éligible (boursier critères sociaux, apprenti, pro. ou salarié) : demande APL/CAF dès le 1er jour', note: 'Réforme juillet 2026 : plus automatique pour les hors UE/EEE/Suisse — vérifier avant. Non rétroactive au-delà du dépôt', urgent: true },
      { text: 'Ouverture compte bancaire traditionnel (BNP, SG, Crédit Agricole)', note: 'Nécessaire pour la CAF et les virements de loyer', urgent: false },
      { text: "Choix d'un médecin traitant sur doctolib.fr", note: 'Recommandé pour optimiser les remboursements spécialistes — déclarer sur ameli.fr', urgent: false },
      { text: 'Abonnement transport local (Navigo Paris / TBM Bordeaux / TCL Lyon)', note: 'Tarif étudiant sur présentation de la carte étudiante', urgent: false },
      { text: 'Connexion internet souscrite (Bouygues, Free, SFR)', note: null, urgent: false },
      { text: 'Carte jeune SNCF si tu voyages en France', note: "49€/an → jusqu'à 60% de réduction sur les TGV", urgent: false },
      { text: 'Inscription bibliothèque universitaire (BU) — gratuit', note: null, urgent: false },
    ],
  },
  {
    num: '03',
    Icon: ClipboardList,
    title: 'Dans les 3 premiers mois',
    subtitle: 'Consolide ta situation administrative',
    accent: '16,185,129',
    items: [
      { text: 'Numéro de sécurité sociale reçu (ameli.fr)', note: 'Délai habituel : 2-8 semaines. Vérifie ton espace Ameli régulièrement.', urgent: false },
      { text: 'Carte Vitale commandée sur ameli.fr', note: 'Tiers payant chez le médecin — plus besoin d\'avancer les frais', urgent: false },
      { text: 'Demande CSS (Complémentaire Santé Solidaire) sur ameli.fr', note: 'Gratuite si revenus < 9 720€/an — couvre le ticket modérateur → zéro reste à charge chez le médecin', urgent: false },
      { text: 'Premiers remboursements CAF/APL reçus', note: 'Délai : 2-3 mois après la demande. Vérifie sur caf.fr', urgent: false },
      { text: 'RIB transmis à tous les organismes (CAF, bourse, employeur)', note: null, urgent: false },
      { text: 'Renouvellement titre de séjour planifié (si séjour > 1 an)', note: "Via ANEF — commence 4 mois avant l'expiration du VLS-TS", urgent: true },
      { text: 'Visite médicale OFII passée (si convoqué par courrier)', note: 'Obligatoire pour les VLS-TS. Gratuit. Convocation par l\'OFII.', urgent: false },
      { text: 'Mutuelle complémentaire souscrite (facultatif mais recommandé)', note: 'Complémentaire santé solidaire (CSS) gratuite si revenus < 9 720€/an', urgent: false },
      { text: "Découverte des associations étudiantes du campus", note: null, urgent: false },
      { text: 'Contact établi avec la communauté DALILI de ta ville', note: null, urgent: false },
    ],
  },
];

const RELATED = [
  { href: '/blog/visa-etudiant-france-maroc-2026', label: 'Guide complet visa étudiant France depuis le Maroc 2026', Icon: MapPin },
  { href: '/blog/visa-etudiant-france-algerie-2026', label: "Visa étudiant France depuis l'Algérie 2026 — tout savoir", Icon: MapPin },
  { href: '/blog/titre-sejour-etudiant-france-renouvellement', label: 'Titre de séjour étudiant — renouvellement complet', Icon: CreditCard },
  { href: '/blog/caf-etudiant-etranger-delais-documents-erreurs', label: 'CAF étudiant étranger — délais, documents et erreurs', Icon: Banknote },
  { href: '/pays/etudier-en-france-depuis-le-maroc', label: 'Étudier en France depuis le Maroc — démarches et délais', Icon: BookOpen },
];

const FAQ_ITEMS = [
  {
    q: "Qu'est-ce que la checklist arrivée en France ?",
    a: "La checklist arrivée en France de Dalili est un PDF gratuit de 3 pages qui liste les 32 démarches essentielles pour les étudiants internationaux : préparation avant le départ (Campus France, visa VLS-TS, logement), démarches à l'arrivée (validation ANEF, Assurance Maladie, CAF) et suivi dans les 3 premiers mois (Carte Vitale, OFII, titre de séjour).",
  },
  {
    q: 'La checklist est-elle gratuite ?',
    a: "Oui, entièrement gratuite. Tu peux la télécharger, l'imprimer et la partager librement dans tes groupes WhatsApp, Facebook ou Discord. Elle est mise à jour régulièrement pour rester conforme aux démarches en vigueur.",
  },
  {
    q: "Qu'est-ce que la validation VLS-TS sur ANEF ?",
    a: "La validation VLS-TS est une démarche obligatoire à effectuer dans les 3 mois suivant ton arrivée en France sur le site administration-etrangers-en-france.interieur.gouv.fr. Sans cette validation, ton visa n'est plus valable comme titre de séjour. Elle coûte environ 50€.",
  },
  {
    q: 'Quand faut-il faire la demande CAF en France ?',
    a: "D'abord, vérifie ton éligibilité : depuis le 1er juillet 2026, un étudiant hors UE/EEE/Suisse doit être boursier sur critères sociaux, apprenti, en contrat de professionnalisation ou salarié pour avoir droit à l'APL. Si c'est ton cas, fais la demande sur caf.fr dès le premier jour dans ton logement — l'aide n'est pas rétroactive au-delà de la date de dépôt.",
  },
  {
    q: 'Combien de temps pour recevoir la Carte Vitale ?',
    a: "Après inscription à l'Assurance Maladie sur ameli.fr, tu reçois ton numéro de sécurité sociale sous 2 à 8 semaines. La Carte Vitale arrive 2 à 4 semaines après. En attendant, une attestation papier suffit pour le tiers payant chez le médecin.",
  },
];

export default function ChecklistPage() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <style>{`
        .ck-hero { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,auto); gap: clamp(40px,5vw,80px); align-items: start; margin-bottom: clamp(72px,8vw,110px); }
        .ck-pdf  { width: clamp(200px,26vw,300px); flex-shrink: 0; }
        .ck-phase-divider { flex: 1; height: 1px; margin-left: 8px; }
        .ck-download-btn  { display: inline-flex; align-items: center; gap: 12px; }
        .ck-mid-cta-btn   { display: inline-flex; align-items: center; gap: 12px; }
        @media (max-width: 680px) {
          .ck-hero { grid-template-columns: 1fr; gap: 0; }
          .ck-pdf  { display: none; }
          .ck-phase-divider { display: none; }
          .ck-download-btn  { width: 100%; justify-content: center; }
          .ck-mid-cta-btn   { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Ambient glow */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20vh', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '60vh', background: 'radial-gradient(ellipse at center, rgba(1,77,248,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '35vh', right: '-10vw', width: '45vw', height: '45vh', background: 'radial-gradient(ellipse at center, rgba(77,143,255,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <main id="main-content" style={{ position: 'relative', zIndex: 1, paddingTop: 96, paddingBottom: 120, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 clamp(16px,4vw,40px)' }}>

          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'clamp(28px,4vw,52px)', flexWrap: 'wrap' }}>
            {[{ label: 'Accueil', href: '/' }, { label: 'Checklist', href: null }].map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.5)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)' }}>{item.label}</span>
                }
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: '0.55rem' }}>›</span>}
              </span>
            ))}
          </nav>

          {/* ── HERO ── */}
          <div className="ck-hero">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '6px 18px', border: '1px solid rgba(1,77,248,0.35)', borderRadius: 100, background: 'rgba(1,77,248,0.08)' }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: '#4d8fff', display: 'inline-block', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(77,143,255,0.9)' }}>
                  PDF Gratuit — Mis à jour juin 2026
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(3.2rem,8.5vw,7.5rem)', lineHeight: 0.88, letterSpacing: '0.02em', margin: '0 0 clamp(20px,2.5vw,32px)' }}>
                <span style={{ color: '#fff', display: 'block' }}>CHECKLIST</span>
                <span style={{ color: 'rgba(255,255,255,0.92)', display: 'block' }}>ARRIVÉE EN</span>
                <span style={{ color: '#014DF8', display: 'block' }}>FRANCE 2026</span>
              </h1>

              <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: 'clamp(0.88rem,1.2vw,1.02rem)', color: 'rgba(255,255,255,0.92)', maxWidth: 540, lineHeight: 1.8, margin: '0 0 clamp(28px,4vw,44px)' }}>
                Les 32 démarches essentielles pour ton arrivée en France, organisées en 3 phases. Visa VLS-TS, ANEF, CAF, Assurance Maladie, banque. Imprime, coche, avance.
              </p>

              {/* Stats */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 'clamp(28px,4vw,44px)' }}>
                {[
                  { v: '32', l: 'démarches' },
                  { v: '3', l: 'phases' },
                  { v: '200+', l: 'étudiants' },
                  { v: '100%', l: 'gratuit' },
                ].map(s => (
                  <div key={s.v} style={{ display: 'flex', alignItems: 'baseline', gap: 5, padding: '8px 18px', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100 }}>
                    <span style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.1rem', color: '#fff', letterSpacing: '0.04em', lineHeight: 1 }}>{s.v}</span>
                    <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.88)' }}>{s.l}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
                <DownloadBtn />
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.92)' }}>
                  PDF · 3 pages A4 · Partage libre
                </span>
              </div>
            </div>

            {/* PDF Preview card */}
            <div className="ck-pdf">
              <div style={{
                background: '#0a0f1e',
                border: '1px solid rgba(1,77,248,0.28)',
                borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 0 60px rgba(1,77,248,0.18), 0 32px 80px rgba(0,0,0,0.7)',
                position: 'relative',
              }}>
                <div style={{ height: 3, background: 'linear-gradient(90deg, #014DF8, #4d8fff, #014DF8)' }} />
                <div style={{ padding: '13px 15px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 5, height: 5, borderRadius: 3, background: '#014DF8' }} />
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 900, fontSize: '0.6rem', color: '#fff', letterSpacing: '0.15em' }}>DALILI</span>
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.45rem', color: 'rgba(77,143,255,0.5)', marginLeft: 3 }}>dalili.study</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.48rem', fontWeight: 600, color: 'rgba(77,143,255,0.5)' }}>1 / 3</span>
                </div>
                <div style={{ padding: '13px 15px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.42rem', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(77,143,255,0.55)', marginBottom: 3, textTransform: 'uppercase' }}>Partie 1 de 3</div>
                  <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.3rem', color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: 11 }}>AVANT LE{'\n'}DEPART ✈️</div>
                  {['Dossier Campus France', 'Visa VLS-TS obtenu', 'Logement réservé', 'Compte bancaire en ligne', 'Budget 3 mois préparé'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 7px', marginBottom: 3, background: '#0d1527', borderRadius: 3, border: '1px solid #1a2540' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, border: '1.5px solid #014DF8', background: '#0a1535', flexShrink: 0 }} />
                      <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.45rem', color: 'rgba(153,168,204,0.8)' }}>{item}</div>
                    </div>
                  ))}
                  <div style={{ marginTop: 9, textAlign: 'center', fontFamily: 'var(--font-montserrat)', fontSize: '0.4rem', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(77,143,255,0.35)', textTransform: 'uppercase' }}>+ 27 autres démarches</div>
                </div>
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 50%)', pointerEvents: 'none' }} />
              </div>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.92)' }}>Format A4 · Imprimable · Partageable</span>
              </div>
            </div>
          </div>

          {/* ── CHECKLIST PHASES ── */}
          <section aria-label="Contenu de la checklist" style={{ marginBottom: 'clamp(72px,8vw,110px)' }}>
            <div style={{ marginBottom: 'clamp(32px,4vw,52px)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)' }}>Contenu du PDF</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(40px,5vw,60px)' }}>
              {PHASES.map(phase => (
                <div key={phase.num}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(${phase.accent},0.1)`, border: `1px solid rgba(${phase.accent},0.22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <phase.Icon size={20} color={`rgb(${phase.accent})`} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.53rem', fontWeight: 700, letterSpacing: '0.2em', color: `rgba(${phase.accent},0.55)`, textTransform: 'uppercase' }}>Phase {phase.num}</span>
                        <span style={{ width: 1, height: 10, background: `rgba(${phase.accent},0.2)`, display: 'inline-block' }} />
                        <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.92)' }}>{phase.subtitle}</span>
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.4rem,2.8vw,2.2rem)', letterSpacing: '0.04em', color: '#fff', margin: 0, lineHeight: 1 }}>
                        {phase.title}
                      </h2>
                    </div>
                    <div className="ck-phase-divider" style={{ background: `linear-gradient(90deg, rgba(${phase.accent},0.25), transparent)` }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,480px),1fr))', gap: '6px 10px' }}>
                    {phase.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', background: item.urgent ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${item.urgent ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 10 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 2, border: `1.5px solid ${item.urgent ? 'rgba(239,68,68,0.65)' : `rgba(${phase.accent},0.45)`}`, background: item.urgent ? 'rgba(239,68,68,0.05)' : `rgba(${phase.accent},0.05)` }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.83rem', fontWeight: 500, color: 'rgba(255,255,255,0.92)', lineHeight: 1.45, flex: 1 }}>{item.text}</span>
                            {item.urgent && (
                              <span style={{ flexShrink: 0, padding: '2px 7px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', borderRadius: 4, fontFamily: 'var(--font-montserrat)', fontSize: '0.48rem', fontWeight: 700, letterSpacing: '0.12em', color: '#ef4444', textTransform: 'uppercase', alignSelf: 'flex-start', marginTop: 1 }}>
                                Urgent
                              </span>
                            )}
                          </div>
                          {item.note && <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.90)', margin: '4px 0 0', lineHeight: 1.55 }}>{item.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── MID-PAGE CTA ── */}
          <div style={{ marginBottom: 'clamp(72px,8vw,110px)', padding: 'clamp(32px,5vw,56px)', background: 'linear-gradient(135deg, rgba(1,77,248,0.1) 0%, rgba(1,4,16,0.6) 60%)', border: '1px solid rgba(1,77,248,0.2)', borderRadius: 24, position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(1,77,248,0.7), transparent)' }} />
            <p style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3.2rem)', letterSpacing: '0.04em', color: '#fff', margin: '0 0 8px', lineHeight: 1.1 }}>
              Télécharge la checklist complète
            </p>
            <p style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.3rem,2.8vw,2rem)', letterSpacing: '0.04em', color: '#014DF8', margin: '0 0 24px', lineHeight: 1 }}>
              3 pages · 32 points · 100% gratuit
            </p>
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '0.86rem', color: 'rgba(255,255,255,0.90)', margin: '0 0 30px', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
              Partage ce PDF dans tes groupes WhatsApp, Facebook et Discord — aide les autres étudiants à ne rien oublier.
            </p>
            <DownloadBtn label="Télécharger gratuitement" size="large" />
          </div>

          {/* ── FAQ ── */}
          <section aria-labelledby="faq-heading" style={{ marginBottom: 'clamp(72px,8vw,110px)' }}>
            <div style={{ marginBottom: 'clamp(28px,4vw,44px)' }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)', display: 'block', marginBottom: 8 }}>Réponses</span>
              <h2 id="faq-heading" style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', letterSpacing: '0.04em', color: '#fff', margin: 0, lineHeight: 1 }}>
                Questions fréquentes
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} style={{ padding: 'clamp(16px,2vw,22px)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 600, fontSize: 'clamp(0.83rem,1.1vw,0.93rem)', color: 'rgba(255,255,255,0.92)', margin: '0 0 10px', lineHeight: 1.45 }}>{item.q}</p>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: '0.82rem', color: 'rgba(255,255,255,0.88)', margin: 0, lineHeight: 1.72 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── SIMULATOR CTA ── */}
          <section style={{ marginBottom: 36 }}>
            <div style={{
              padding: 'clamp(20px,3vw,28px)',
              background: 'rgba(1,77,248,0.07)',
              border: '1px solid rgba(77,143,255,0.18)',
              borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4d8fff', margin: '0 0 6px' }}>
                  🧮 Outil gratuit
                </p>
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 600, fontSize: '0.95rem', color: '#fff', margin: '0 0 4px' }}>
                  Simulateur budget — combien ça coûte selon ta ville ?
                </p>
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.78)', margin: 0 }}>
                  Loyer, CAF, nourriture, frais de scolarité — estimation en 5 questions.
                </p>
              </div>
              <Link href="/simulateur" style={{
                display: 'inline-block', flexShrink: 0,
                padding: '11px 22px', borderRadius: 10,
                background: 'linear-gradient(135deg,#014DF8,#4d8fff)',
                fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#fff', textDecoration: 'none',
                boxShadow: '0 3px 12px rgba(1,77,248,0.28)',
                whiteSpace: 'nowrap',
              }}>
                Calculer →
              </Link>
            </div>
          </section>

          {/* ── RELATED GUIDES ── */}
          <section aria-labelledby="related-heading">
            <div style={{ marginBottom: 22 }}>
              <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)', display: 'block', marginBottom: 6 }}>Guides complémentaires</span>
              <h2 id="related-heading" style={{ fontFamily: 'var(--font-bebas)', fontWeight: 400, fontSize: 'clamp(1.4rem,2.5vw,2rem)', letterSpacing: '0.04em', color: '#fff', margin: 0, lineHeight: 1 }}>
                Approfondir tes démarches
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {RELATED.map(link => (
                <Link key={link.href} href={link.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: 'clamp(13px,2vw,17px) clamp(16px,2.5vw,22px)', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 13, textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <link.Icon size={16} color="rgba(77,143,255,0.6)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 'clamp(0.78rem,1.1vw,0.88rem)', fontWeight: 500, color: 'rgba(255,255,255,0.92)', lineHeight: 1.4 }}>{link.label}</span>
                  </div>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path d="M1.5 6.5h10M8 3l3.5 3.5L8 10" stroke="#4d8fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

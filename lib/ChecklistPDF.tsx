import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Rect,
  G,
} from '@react-pdf/renderer';
import React from 'react';

// ── Brand tokens ─────────────────────────────────────────────────────
const NAVY   = '#0a0f1e';
const BLUE   = '#014DF8';
const LIGHT  = '#4d8fff';
const WHITE  = '#ffffff';
const DIM    = '#99a8cc';
const FAINT  = '#3a4a6b';
const RED    = '#ef4444';

// ── Styles ────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    backgroundColor: NAVY,
    paddingTop: 32,
    paddingBottom: 52,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: 'Helvetica',
  },

  // ── Header (fixed on every page) ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1d2b4a',
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center' },
  logoDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: BLUE, marginRight: 7 },
  logoText: { color: WHITE, fontSize: 15, fontFamily: 'Helvetica-Bold', letterSpacing: 2 },
  logoUrl:  { color: LIGHT, fontSize: 7.5, marginLeft: 1, marginTop: 2 },
  pageNum:  { color: FAINT, fontSize: 7.5, fontFamily: 'Helvetica-Bold', marginRight: 2 },

  // ── Page title block ──
  pageBadge: {
    color: LIGHT,
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  pageTitle: {
    color: WHITE,
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.3,
    marginBottom: 6,
    lineHeight: 1.15,
  },
  pageSubtitle: {
    color: DIM,
    fontSize: 8.5,
    lineHeight: 1.5,
    marginBottom: 18,
  },

  // ── Section ──
  sectionWrap: { marginBottom: 14 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  sectionDot:  { width: 5, height: 5, borderRadius: 3, backgroundColor: BLUE, marginRight: 7 },
  sectionTitle: {
    color: WHITE,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginRight: 10,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: '#1d2b4a' },

  // ── Checklist item ──
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 3,
    borderRadius: 5,
    backgroundColor: '#0d1527',
    borderWidth: 1,
    borderColor: '#1a2540',
  },
  itemUrgent: {
    borderColor: '#3b1d1d',
    backgroundColor: '#120b0b',
  },
  checkbox: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: BLUE,
    backgroundColor: '#0a1535',
    marginTop: 1,
    marginRight: 9,
    flexShrink: 0,
  },
  checkboxUrgent: { borderColor: RED },
  itemContent: { flex: 1 },
  itemText:  { color: DIM,   fontSize: 8, lineHeight: 1.55, fontFamily: 'Helvetica' },
  itemNote:  { color: LIGHT, fontSize: 6.5, marginTop: 2,   fontFamily: 'Helvetica' },
  itemBadge: {
    backgroundColor: '#2b0e0e',
    borderWidth: 1,
    borderColor: '#5a1d1d',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  itemBadgeText: { color: RED, fontSize: 5.5, fontFamily: 'Helvetica-Bold', letterSpacing: 0.8 },

  // ── Tip callout ──
  tip: {
    flexDirection: 'row',
    backgroundColor: '#09183a',
    borderWidth: 1,
    borderColor: '#1a3a7a',
    borderRadius: 7,
    padding: 11,
    marginBottom: 14,
  },
  tipAccent: {
    width: 3,
    borderRadius: 2,
    backgroundColor: BLUE,
    marginRight: 10,
    flexShrink: 0,
  },
  tipText: { flex: 1, color: DIM, fontSize: 7.5, lineHeight: 1.65, fontFamily: 'Helvetica' },
  tipBold: { color: WHITE, fontFamily: 'Helvetica-Bold' },

  // ── CTA box (page 3) ──
  ctaBox: {
    marginTop: 14,
    padding: 16,
    backgroundColor: '#08142e',
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 9,
  },
  ctaTitle: { color: WHITE, fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 5, lineHeight: 1.4 },
  ctaText:  { color: DIM, fontSize: 7.5, lineHeight: 1.65, fontFamily: 'Helvetica', marginBottom: 8 },
  ctaUrl:   { color: LIGHT, fontSize: 8, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },

  // ── Footer (fixed) ──
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 40,
    right: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1d2b4a',
    paddingTop: 8,
  },
  footerText: { color: '#3a4a6b', fontSize: 6, fontFamily: 'Helvetica' },
  footerUrl:  { color: LIGHT,    fontSize: 6, fontFamily: 'Helvetica-Bold' },

  // ── Accent bar (top of each page) ──
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: BLUE,
  },
});

// ── Sub-components ────────────────────────────────────────────────────

function DaliliIcon() {
  return (
    <Svg viewBox="-1 105 70 71" width={22} height={22} style={{ marginRight: 8 }}>
      <Rect x="-1" y="105" width="70" height="71" rx="14" fill="#010410" />
      <G>
        <Path
          fill="#006cfd"
          d="M45.83,124.17h-13.08s-12.61,12.62-12.61,12.62l6.87,6.9,10.2-10.03c.93-.48,3.49-.48,4.16.29l11.98,13.73-12.33,12.45c-1.41,1.43-2.43,2.99-4.05,4.34h-16.74c-1.73-1.43-2.84-2.99-4.25-4.58-5.09-5.75-10.17-11.5-15.26-17.25-.21-.22-.38-.39-.5-.5-.05-.04-.11-.1-.21-.14,0,0,0,0-.01,0,.1.12.08.58.08.84v14.73s14.37,16.39,14.37,16.39l26.56.04,2.49-2.55,23.38-23.49-21.05-23.8Z"
        />
        <Path
          fill="#0078fe"
          d="M66.99,125.02l-14.38-16.39-26.56-.04-2.49,2.55L.19,134.62l21.05,23.8h13.08s12.61-12.62,12.61-12.62l-6.87-6.9-10.2,10.03c-.93.48-3.49.48-4.16-.29l-11.98-13.73,12.33-12.45c1.41-1.43,2.43-2.99,4.05-4.34h16.74c1.73,1.43,2.84,2.99,4.25,4.58l15.26,17.25c.28.32.46.55.73.65-.03-5.2-.05-10.39-.08-15.59Z"
        />
      </G>
    </Svg>
  );
}

function Header({ page }: { page: string }) {
  return (
    <View style={S.header} fixed>
      <View style={S.logoWrap}>
        <DaliliIcon />
        <View>
          <Text style={S.logoText}>DALILI</Text>
          <Text style={S.logoUrl}>dalili.study</Text>
        </View>
      </View>
      <Text style={S.pageNum}>{page}</Text>
    </View>
  );
}

function Footer() {
  return (
    <View style={S.footer} fixed>
      <Text style={S.footerText}>Partage ce PDF librement · Mis à jour juin 2026</Text>
      <Text style={S.footerUrl}>dalili.study/checklist</Text>
    </View>
  );
}

function Section({ label }: { label: string }) {
  return (
    <View style={S.sectionRow}>
      <View style={S.sectionDot} />
      <Text style={S.sectionTitle}>{label}</Text>
      <View style={S.sectionLine} />
    </View>
  );
}

function Item({
  text,
  note,
  urgent,
}: {
  text: string;
  note?: string;
  urgent?: boolean;
}) {
  return (
    <View style={[S.item, urgent ? S.itemUrgent : {}]}>
      <View style={[S.checkbox, urgent ? S.checkboxUrgent : {}]} />
      <View style={S.itemContent}>
        <Text style={S.itemText}>{text}</Text>
        {note && <Text style={S.itemNote}>{note}</Text>}
      </View>
      {urgent && (
        <View style={S.itemBadge}>
          <Text style={S.itemBadgeText}>URGENT</Text>
        </View>
      )}
    </View>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <View style={S.tip}>
      <View style={S.tipAccent} />
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

// ── Document ──────────────────────────────────────────────────────────
export function ChecklistPDF() {
  return (
    <Document
      title="Checklist Arrivée en France 2026 — Dalili"
      author="Dalili Study"
      subject="Checklist complète pour les étudiants internationaux en France"
      creator="dalili.study"
      producer="Dalili"
      language="fr"
    >

      {/* ══════════════════════════════════════════
          PAGE 1 — AVANT LE DÉPART ✈️
      ══════════════════════════════════════════ */}
      <Page size="A4" style={S.page}>
        <View style={S.accentBar} fixed />
        <Header page="1 / 3" />

        <Text style={S.pageBadge}>Partie 1 de 3</Text>
        <Text style={S.pageTitle}>AVANT LE{'\n'}DEPART ✈️</Text>
        <Text style={S.pageSubtitle}>
          Complète cette liste avant de quitter ton pays
        </Text>

        <Tip>
          <Text style={S.tipText}>
            <Text style={S.tipBold}>Conseil clé : </Text>
            Commence tes démarches au moins 4 mois à l&apos;avance.
            Campus France + visa = 10-14 semaines en été.
          </Text>
        </Tip>

        <View style={S.sectionWrap}>
          <Section label="Campus France & Visa" />
          <Item text="Dossier Campus France soumis et entretien passé" />
          <Item text="Avis Campus France favorable reçu" />
          <Item text="Lettre d'admission officielle de l'établissement reçue" />
          <Item
            text="Visa VLS-TS obtenu au consulat français"
            note="Type D — à valider sur ANEF dans les 3 mois après arrivée"
          />
        </View>

        <View style={S.sectionWrap}>
          <Section label="Documents officiels" />
          <Item text="Passeport valide (min 18 mois de validité restants)" />
          <Item text="Traductions certifiées : acte de naissance + diplômes" />
          <Item text="Assurance voyage souscrite (min 30 000€ couverture)" />
          <Item text="Photos d'identité biométriques récentes" />
        </View>

        <View style={S.sectionWrap}>
          <Section label="Logistique & finances" />
          <Item
            text="Logement réservé (CROUS / Studapart / HousingAnywhere)"
            note="Commence 4-5 mois avant — les places CROUS partent vite"
          />
          <Item
            text="Compte bancaire en ligne ouvert (Revolut ou Wise)"
            note="IBAN instantané, zéro frais à l'étranger"
          />
          <Item text="SIM française commandée en ligne (Free, Bouygues)" />
          <Item text="Billet d'avion acheté (attends le visa pour l'achat !)" />
          <Item
            text="Budget 3 premiers mois préparé (min 1 500€ recommandé)"
            note="Loyer + dépôt + alimentation + transport + frais admin"
          />
        </View>

        <Footer />
      </Page>

      {/* ══════════════════════════════════════════
          PAGE 2 — À L'ARRIVÉE EN FRANCE 🏠
      ══════════════════════════════════════════ */}
      <Page size="A4" style={S.page}>
        <View style={S.accentBar} fixed />
        <Header page="2 / 3" />

        <Text style={S.pageBadge}>Partie 2 de 3</Text>
        <Text style={S.pageTitle}>{"A L'ARRIVEE\nEN FRANCE 🏠"}</Text>
        <Text style={S.pageSubtitle}>
          {'A faire dans les 48h et les 3 premiers mois'}
        </Text>

        <Tip>
          <Text style={S.tipText}>
            <Text style={S.tipBold}>URGENT : </Text>
            La validation VLS-TS est obligatoire dans les 3 mois.
            Si tu oublies, ton titre de séjour n&apos;est plus valable.
          </Text>
        </Tip>

        <View style={S.sectionWrap}>
          <Section label="Priorité absolue (semaine 1)" />
          <Item
            text="Validation VLS-TS sur ANEF dans les 3 MOIS"
            note="administration-etrangers-en-france.interieur.gouv.fr — environ 50€"
            urgent
          />
          <Item
            text="Inscription à l'Assurance Maladie sur ameli.fr"
            note="Rubrique : Étudiants étrangers — envoie les documents demandés en ligne"
          />
          <Item
            text="Inscription définitive à l'université"
            note="Apporte : lettre d'admission, passeport, photos, justificatif de logement"
          />
          <Item
            text="Paiement CVEC (103€) sur messervices.etudiant.gouv.fr"
            note="Obligatoire pour s'inscrire — génère une attestation immédiate"
            urgent
          />
        </View>

        <View style={S.sectionWrap}>
          <Section label="Logement & aides sociales" />
          <Item
            text="Demande APL/CAF sur caf.fr dès le 1er jour dans le logement"
            note="Non rétroactive — chaque jour de retard = aide perdue définitivement"
            urgent
          />
          <Item
            text="Ouverture compte bancaire traditionnel (BNP, SG, Crédit Agricole)"
            note="Nécessaire pour la CAF et les virements de loyer"
          />
        </View>

        <View style={S.sectionWrap}>
          <Section label="Vie quotidienne" />
          <Item
            text="Choix d'un médecin traitant sur doctolib.fr"
            note="Obligatoire pour les remboursements à 70% — déclarer sur Ameli.fr"
          />
          <Item
            text="Abonnement transport local (Navigo Paris / TBM Bordeaux / TCL Lyon)"
            note="Tarif étudiant disponible sur présentation de la carte étudiante"
          />
          <Item text="Connexion internet souscrite (Bouygues, Free, SFR)" />
          <Item
            text="Carte jeune SNCF si tu voyages en France"
            note="49€/an → jusqu'à 60% de réduction sur les TGV"
          />
          <Item text="Inscription bibliothèque universitaire (BU) — gratuit" />
        </View>

        <Footer />
      </Page>

      {/* ══════════════════════════════════════════
          PAGE 3 — DANS LES 3 PREMIERS MOIS 📋
      ══════════════════════════════════════════ */}
      <Page size="A4" style={S.page}>
        <View style={S.accentBar} fixed />
        <Header page="3 / 3" />

        <Text style={S.pageBadge}>Partie 3 de 3</Text>
        <Text style={S.pageTitle}>{"DANS LES 3\nPREMIERS MOIS 📋"}</Text>
        <Text style={S.pageSubtitle}>
          {"Ne laisse pas traîner ces démarches"}
        </Text>

        <Tip>
          <Text style={S.tipText}>
            <Text style={S.tipBold}>Tu y es presque ! </Text>
            Ces démarches sont moins urgentes mais essentielles.
            Planifie-les dans tes 3 premières semaines.
          </Text>
        </Tip>

        <View style={S.sectionWrap}>
          <Section label="Sécurité sociale & santé" />
          <Item
            text="Numéro de sécurité sociale reçu (ameli.fr)"
            note="Délai habituel : 2-8 semaines. Vérifie ton espace Ameli régulièrement."
          />
          <Item
            text="Carte Vitale commandée sur ameli.fr"
            note="Tiers payant chez le médecin — plus besoin d'avancer les frais"
          />
          <Item
            text="Mutuelle complémentaire souscrite (facultatif mais recommandé)"
            note="Complémentaire santé solidaire (CSS) gratuite si revenus < 9 720€/an"
          />
        </View>

        <View style={S.sectionWrap}>
          <Section label="CAF & finances" />
          <Item
            text="Premiers remboursements CAF/APL reçus"
            note="Délai : 2-3 mois après la demande. Vérifie ton dossier sur caf.fr"
          />
          <Item
            text="RIB transmis à tous les organismes (CAF, bourse, employeur)"
            note="CAF, université, Ameli — garde le PDF du RIB facilement accessible"
          />
        </View>

        <View style={S.sectionWrap}>
          <Section label="Titre de séjour & OFII" />
          <Item
            text="Renouvellement titre de séjour planifié (si séjour > 1 an)"
            note="Via ANEF — commence 4 mois avant l'expiration du VLS-TS"
            urgent
          />
          <Item
            text="Visite médicale OFII passée (si convoqué par courrier)"
            note="Obligatoire pour les VLS-TS. Gratuit. Convocation par l'OFII."
          />
        </View>

        <View style={S.sectionWrap}>
          <Section label="Vie étudiante" />
          <Item
            text="Découverte des associations étudiantes du campus"
            note="BDE, associations culturelles, sportives — essentiel pour s'intégrer"
          />
          <Item
            text="Contact établi avec la communauté DALILI de ta ville"
            note="Des étudiants qui sont passés par là répondent à tes questions"
          />
        </View>

        {/* CTA box */}
        <View style={S.ctaBox}>
          <Text style={S.ctaTitle}>
            Tu as des questions sur ces démarches ?
          </Text>
          <Text style={S.ctaText}>
            Rejoins la communauté DALILI — des étudiants qui sont passés par là
            répondent à tes questions, gratuitement, dans ta langue.
          </Text>
          <Text style={S.ctaUrl}>dalili.study</Text>
        </View>

        <Footer />
      </Page>

    </Document>
  );
}

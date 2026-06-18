import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import React from 'react';

Font.register({
  family: 'Helvetica',
  fonts: [],
});

const NAVY = '#0a0f1e';
const BLUE = '#014DF8';
const BLUE_LIGHT = '#4d8fff';
const WHITE = '#ffffff';
const WHITE_DIM = 'rgba(255,255,255,0.6)';

const S = StyleSheet.create({
  page: {
    backgroundColor: NAVY,
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  logoBlock: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BLUE,
  },
  logoText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
  },
  headerBadge: {
    backgroundColor: 'rgba(1,77,248,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(1,77,248,0.35)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  headerBadgeText: {
    color: BLUE_LIGHT,
    fontSize: 6.5,
    letterSpacing: 1.5,
    fontFamily: 'Helvetica-Bold',
  },

  // Page title
  pageLabel: {
    color: BLUE_LIGHT,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  pageTitle: {
    color: WHITE,
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
    marginBottom: 20,
    lineHeight: 1.1,
  },
  pageTitleAccent: { color: BLUE_LIGHT },

  // Section
  section: { marginBottom: 18 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BLUE,
  },
  sectionTitle: {
    color: WHITE,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },

  // Checklist items
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  checkbox: {
    width: 13,
    height: 13,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: BLUE,
    backgroundColor: 'rgba(1,77,248,0.08)',
    marginTop: 1.5,
    flexShrink: 0,
  },
  checkText: {
    flex: 1,
    color: WHITE_DIM,
    fontSize: 8.5,
    lineHeight: 1.6,
    fontFamily: 'Helvetica',
  },
  checkNote: {
    color: BLUE_LIGHT,
    fontSize: 7,
    fontFamily: 'Helvetica',
    marginTop: 2,
  },

  // Urgent badge
  urgentBadge: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginLeft: 4,
    marginTop: 2,
  },
  urgentText: {
    color: '#ef4444',
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },

  // Tip box
  tipBox: {
    backgroundColor: 'rgba(1,77,248,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(1,77,248,0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  tipIcon: {
    color: BLUE_LIGHT,
    fontSize: 14,
    lineHeight: 1,
    marginTop: -1,
  },
  tipText: {
    flex: 1,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 7.5,
    lineHeight: 1.7,
    fontFamily: 'Helvetica',
  },
  tipBold: {
    color: WHITE,
    fontFamily: 'Helvetica-Bold',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
    paddingTop: 10,
  },
  footerText: {
    color: 'rgba(255,255,255,0.22)',
    fontSize: 6.5,
    fontFamily: 'Helvetica',
    letterSpacing: 0.5,
  },
  footerUrl: {
    color: BLUE_LIGHT,
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
  },
  pageNum: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 6.5,
    fontFamily: 'Helvetica',
  },
});

function CheckboxItem({
  text,
  note,
  urgent,
}: {
  text: string;
  note?: string;
  urgent?: boolean;
}) {
  return (
    <View style={S.checkItem}>
      <View style={S.checkbox} />
      <View style={{ flex: 1 }}>
        <Text style={S.checkText}>{text}</Text>
        {note && <Text style={S.checkNote}>{note}</Text>}
      </View>
      {urgent && (
        <View style={S.urgentBadge}>
          <Text style={S.urgentText}>URGENT</Text>
        </View>
      )}
    </View>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <View style={S.sectionHeader}>
      <View style={S.sectionDot} />
      <Text style={S.sectionTitle}>{label}</Text>
      <View style={S.sectionLine} />
    </View>
  );
}

function PageHeader() {
  return (
    <View style={S.header} fixed>
      <View style={S.logoBlock}>
        <View style={S.logoDot} />
        <Text style={S.logoText}>DALILI</Text>
      </View>
      <View style={S.headerBadge}>
        <Text style={S.headerBadgeText}>dalili.study</Text>
      </View>
    </View>
  );
}

function PageFooter() {
  return (
    <View style={S.footer} fixed>
      <Text style={S.footerText}>dalili.study — Le guide des étudiants internationaux en France</Text>
      <Text style={S.footerText}>Partage ce PDF librement |{' '}
        <Text style={S.footerUrl}>dalili.study</Text>
      </Text>
    </View>
  );
}

export function ChecklistDocument() {
  return (
    <Document
      title="Checklist Arrivée en France 2026 — Dalili"
      author="Dalili Study"
      subject="Checklist complète pour les étudiants internationaux en France"
      creator="dalili.study"
      producer="Dalili Study"
      language="fr"
    >
      {/* ── PAGE 1 — AVANT LE DÉPART ── */}
      <Page size="A4" style={S.page}>
        <PageHeader />

        <Text style={S.pageLabel}>Page 1 / 3</Text>
        <Text style={S.pageTitle}>
          Avant le{'\n'}
          <Text style={S.pageTitleAccent}>départ.</Text>
        </Text>

        <View style={S.tipBox}>
          <Text style={S.tipIcon}>💡</Text>
          <Text style={S.tipText}>
            <Text style={S.tipBold}>Conseils Dalili :</Text> Prépare tous tes documents au moins{' '}
            <Text style={S.tipBold}>4 mois avant ton départ</Text>. Les délais Campus France + visa
            peuvent prendre jusqu{"'"}à 10–14 semaines en période estivale.
          </Text>
        </View>

        <View style={S.section}>
          <SectionTitle label="Campus France & Visa" />
          <CheckboxItem text="Dossier Campus France soumis (compte en ligne créé + dossier complet)" />
          <CheckboxItem text="Entretien Campus France passé (si ton pays l'exige — ex. Maroc, Algérie, Sénégal)" />
          <CheckboxItem text="Lettre d'admission officielle reçue de ton université française" />
          <CheckboxItem
            text="Visa VLS-TS obtenu au consulat (Visa Long Séjour valant Titre de Séjour)"
            note="Type D — valable 1 an, à valider sur ANEF dans les 3 mois après arrivée"
          />
        </View>

        <View style={S.section}>
          <SectionTitle label="Documents officiels" />
          <CheckboxItem text="Traductions certifiées : acte de naissance, diplômes (traducteur assermenté)" />
          <CheckboxItem text="Assurance voyage souscrite (couverture minimum 30 000€, obligatoire)" />
          <CheckboxItem text="Passeport valide (au moins 18 mois de validité recommandés)" />
          <CheckboxItem text="Photocopies de tous les documents importants (passeport, visa, acte de naissance)" />
        </View>

        <View style={S.section}>
          <SectionTitle label="Logistique & finances" />
          <CheckboxItem text="Billet d'avion acheté (billet non remboursable = attends d'avoir le visa!)" />
          <CheckboxItem
            text="Logement réservé pour les premières semaines"
            note="Options : CROUS (trouver-un-logement.lescrous.fr), Studapart, HousingAnywhere"
          />
          <CheckboxItem
            text="Compte bancaire en ligne ouvert avant le départ"
            note="Revolut ou Wise : aucun frais à l'étranger, IBAN immédiat"
          />
          <CheckboxItem
            text="Numéro de téléphone français pré-commandé (SIM en ligne)"
            note="Free Mobile, Bouygues ou SFR — reçu à ton adresse en France"
          />
          <CheckboxItem
            text="Budget des 3 premiers mois préparé (minimum recommandé : 1 500€)"
            note="Prévois : loyer + dépôt de garantie + alimentation + transport + frais admin"
          />
        </View>

        <PageFooter />
      </Page>

      {/* ── PAGE 2 — À L'ARRIVÉE EN FRANCE ── */}
      <Page size="A4" style={S.page}>
        <PageHeader />

        <Text style={S.pageLabel}>Page 2 / 3</Text>
        <Text style={S.pageTitle}>
          {"À l'arrivée\n"}
          <Text style={S.pageTitleAccent}>en France.</Text>
        </Text>

        <View style={S.tipBox}>
          <Text style={S.tipIcon}>⚠️</Text>
          <Text style={S.tipText}>
            <Text style={S.tipBold}>Important :</Text> La validation du VLS-TS sur ANEF est{' '}
            <Text style={S.tipBold}>OBLIGATOIRE dans les 3 mois</Text> suivant ton arrivée.
            Si tu oublies, ton titre de séjour ne sera pas valable.
          </Text>
        </View>

        <View style={S.section}>
          <SectionTitle label="Démarches prioritaires (semaine 1)" />
          <CheckboxItem
            text="Valider le VLS-TS sur ANEF (dans les 3 mois — ne pas attendre !)"
            note="Sur : administration-etrangers-en-france.interieur.gouv.fr — environ 50€"
            urgent
          />
          <CheckboxItem
            text="S'inscrire à l'Assurance Maladie (Ameli.fr) pour obtenir son numéro de Sécu"
            note="Rubrique : 'Étudiants étrangers' → Envoyer les documents demandés en ligne"
          />
          <CheckboxItem
            text="Inscription définitive à l'université (en présentiel ou en ligne)"
            note="Apporte : lettre d'admission, passeport, photos d'identité, justificatif de logement"
          />
          <CheckboxItem
            text="Paiement de la CVEC (103€) sur messervices.etudiant.gouv.fr"
            note="Obligatoire pour s'inscrire à l'université — genère une attestation"
            urgent
          />
        </View>

        <View style={S.section}>
          <SectionTitle label="Logement & aides" />
          <CheckboxItem
            text="Demande APL/CAF sur caf.fr (dès le premier jour dans le logement)"
            note="Réduction sur ton loyer — rétroactive au 1er jour de résidence. N'attends pas !"
            urgent
          />
          <CheckboxItem
            text="Vérifier que le logement est compatible CAF (logement conventionné = APL, sinon ALS)"
            note="CROUS + logements privés conventionnés → APL. Autres → ALS (montant similaire)"
          />
        </View>

        <View style={S.section}>
          <SectionTitle label="Banque & quotidien" />
          <CheckboxItem
            text="Ouvrir un compte bancaire traditionnel (BNP, Société Générale, Crédit Agricole…)"
            note="Nécessaire pour la CAF, le loyer et les virements. Prends ton passeport + justificatif."
          />
          <CheckboxItem
            text="Choisir un médecin traitant sur Doctolib (chercher 'médecin généraliste' près de chez toi)"
            note="Obligatoire pour les remboursements à 70% — déclaration sur Ameli.fr"
          />
          <CheckboxItem
            text="Obtenir sa carte de transport (Navigo Paris / TBM Bordeaux / TCL Lyon…)"
            note="Tarif étudiant disponible sur présentation de ta carte étudiante"
          />
          <CheckboxItem
            text="Souscrire à un forfait mobile (Bouygues, Free, SFR — comparer les offres étudiantes)"
            note="Free Mobile : 2€/mois (1Go) ou 19,99€/mois (250Go + appels illimités)"
          />
        </View>

        <View style={S.section}>
          <SectionTitle label="Optionnel mais recommandé" />
          <CheckboxItem
            text="Abonnement carte jeune SNCF si tu prévois de voyager en France"
            note="Carte Avantage Jeune : 49€/an → jusqu'à 60% de réduction sur les TGV"
          />
        </View>

        <PageFooter />
      </Page>

      {/* ── PAGE 3 — DANS LES 3 PREMIERS MOIS ── */}
      <Page size="A4" style={S.page}>
        <PageHeader />

        <Text style={S.pageLabel}>Page 3 / 3</Text>
        <Text style={S.pageTitle}>
          Dans les{'\n'}
          <Text style={S.pageTitleAccent}>3 premiers mois.</Text>
        </Text>

        <View style={S.tipBox}>
          <Text style={S.tipIcon}>✅</Text>
          <Text style={S.tipText}>
            <Text style={S.tipBold}>Tu y es presque !</Text> Ces démarches sont moins urgentes mais
            essentielles pour être en règle et profiter de toutes les aides disponibles.
            Planifie-les dans tes premières semaines.
          </Text>
        </View>

        <View style={S.section}>
          <SectionTitle label="Sécurité sociale & santé" />
          <CheckboxItem
            text="Numéro de sécurité sociale reçu par courrier (Ameli.fr)"
            note="Délai habituel : 2–8 semaines après inscription. Vérifie ton espace Ameli."
          />
          <CheckboxItem
            text="Carte Vitale commandée sur Ameli.fr (nécessite le numéro de Sécu)"
            note="La carte Vitale permet le tiers payant chez le médecin — plus besoin d'avancer les frais"
          />
          <CheckboxItem
            text="Visite médicale OFII passée (si convoqué — lettre reçue par courrier)"
            note="Obligatoire pour les titulaires de VLS-TS. Gratuit. Convocation envoyée par l'OFII."
          />
        </View>

        <View style={S.section}>
          <SectionTitle label="CAF & finances" />
          <CheckboxItem
            text="Premiers remboursements CAF reçus (APL ou ALS)"
            note="Délai : 2–3 mois après la demande. Vérifie ton dossier en ligne sur caf.fr."
          />
          <CheckboxItem
            text="RIB enregistré pour toutes les démarches administratives"
            note="CAF, université, Ameli, employeur — garde un PDF du RIB facilement accessible"
          />
          <CheckboxItem
            text="Première déclaration de revenus (si tu travailles en France)"
            note="Même si tu es étudiant, tu dois déclarer tes revenus sur impots.gouv.fr"
          />
        </View>

        <View style={S.section}>
          <SectionTitle label="Titre de séjour" />
          <CheckboxItem
            text="Titre de séjour / carte de séjour déposée (si séjour prévu > 1 an)"
            note="Via ANEF — commence la démarche 3–4 mois avant l'expiration du VLS-TS"
            urgent
          />
        </View>

        <View style={S.section}>
          <SectionTitle label="Vie étudiante" />
          <CheckboxItem
            text="Inscription à la bibliothèque universitaire (BU)"
            note="Gratuit avec la carte étudiante — accès aux ressources numériques et salles de travail"
          />
          <CheckboxItem
            text="Découverte des associations étudiantes de ton université"
            note="BDE, associations culturelles, sportives — excellent pour s'intégrer et se faire des amis"
          />
          <CheckboxItem
            text="Inscription au CROUS pour les repas à tarif réduit"
            note="Repas à 1€ dans les restaurants universitaires — scan de la carte étudiante suffisant"
          />
        </View>

        {/* Closing note */}
        <View style={{
          marginTop: 12,
          padding: 14,
          backgroundColor: 'rgba(1,77,248,0.06)',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: 'rgba(1,77,248,0.18)',
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              color: WHITE_DIM,
              fontSize: 7.5,
              lineHeight: 1.7,
              fontFamily: 'Helvetica',
            }}>
              {"Cette checklist est mise à jour régulièrement par l'équipe Dalili."}
              Retrouve tous nos guides détaillés, nos articles et notre communauté sur{' '}
              <Text style={{ color: BLUE_LIGHT, fontFamily: 'Helvetica-Bold' }}>dalili.study</Text>
            </Text>
          </View>
        </View>

        <PageFooter />
      </Page>
    </Document>
  );
}

import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { getAllUniversitySlugs } from '@/lib/universities';
import { getAllCitySlugs } from '@/lib/cities';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dalili.study';

// Articles qui méritent une priorité 0.8 (piliers SEO)
const HIGH_PRIORITY_SLUGS = new Set([
  // TCF Maroc
  'tcf-maroc-2026-guide-complet',
  'comment-preparer-tcf-30-jours-etudiant-maroc',
  'calendrier-tcf-maroc-2026-dates-sessions',
  // Visa & Campus France
  'visa-etudiant-france-maroc-2026',
  'visa-etudiant-france-algerie-2026',
  'visa-etudiant-france-senegal-2026',
  'campusfrance-maroc-guide-complet',
  'campusfrance-algerie-guide-entretien-2026',
  'campusfrance-senegal-guide-inscription-dakar',
  // Logement & aides
  'logement-crous-etudiant-etranger-demande',
  'caf-etudiant-etranger-delais-documents-erreurs',
  // Santé
  'securite-sociale-complementaire-sante-solidaire-etudiant-etranger',
  // Écoles privées & arnaques
  'ecole-privee-france-reconnue-etat-comment-verifier',
  'arnaques-etudes-france-etudiant-etranger-eviter',
  'ecole-privee-vs-universite-publique-etudiant-etranger',
  // Banque
  'ouvrir-compte-bancaire-etudiant-etranger-2026',
  // Pays — guides par nationalité
  'etudier-en-france-depuis-tunisie',
  'etudier-en-france-depuis-cote-ivoire',
  'etudier-en-france-depuis-cameroun',
  // Études & filières
  'frais-scolarite-universite-france-etudiant-etranger-2026',
  'informatique-france-etudiant-etranger',
  // Médecine — cluster prioritaire (fort volume d'impressions GSC)
  'medecine-france-etudiant-etranger-guide-complet',
  'cout-etudes-medecine-france-etudiant-etranger',
  'faculte-medecine-france-etudiant-etranger-admission',
  'pass-las-etudiant-etranger-medecine-france',
  'equivalence-diplome-medecine-etranger-france',
  'etudier-medecine-france-depuis-maroc',
  // Campus France & démarches
  'lettre-motivation-campus-france-exemple-2026',
  'delf-dalf-vs-tcf-etudiant-etranger-france',
  'parcoursup-etudiant-etranger-guide-2026',
  'ofii-validation-visa-etudiant-france-guide',
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const posts    = getAllPosts();
  const uniSlugs = getAllUniversitySlugs();
  const citySlugs = getAllCitySlugs();
  const now      = new Date();

  // ── Blog articles ────────────────────────────────────────────────
  const articles: MetadataRoute.Sitemap = posts.map(post => ({
    url:             `${SITE_URL}/blog/${post.slug}`,
    lastModified:    post.updatedDate ? new Date(post.updatedDate) : new Date(post.date),
    changeFrequency: 'monthly',
    priority:        HIGH_PRIORITY_SLUGS.has(post.slug) ? 0.8 : 0.7,
  }));

  // ── Université pages ─────────────────────────────────────────────
  const universites: MetadataRoute.Sitemap = uniSlugs.map(slug => ({
    url:             `${SITE_URL}/universites/${slug}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.85,
  }));

  // ── Ville pages ──────────────────────────────────────────────────
  const villes: MetadataRoute.Sitemap = citySlugs.map(slug => ({
    url:             `${SITE_URL}/villes/${slug}`,
    lastModified:    now,
    changeFrequency: 'monthly',
    priority:        0.85,
  }));

  return [
    // ── Homepage — priorité maximale ─────────────────────────────
    {
      url:             `${SITE_URL}/`,
      lastModified:    now,
      changeFrequency: 'weekly',
      priority:        1.0,
    },

    // ── Index blog — haute fréquence (nouveau contenu chaque semaine) ──
    {
      url:             `${SITE_URL}/blog`,
      lastModified:    posts[0]?.updatedDate ? new Date(posts[0].updatedDate) : posts[0] ? new Date(posts[0].date) : now,
      changeFrequency: 'weekly',
      priority:        0.95,
    },

    // ── Index universités & villes ──────────────────────────────
    {
      url:             `${SITE_URL}/universites`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/villes`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },

    // ── Pays — pages piliers par nationalité ────────────────────
    {
      url:             `${SITE_URL}/pays/etudier-en-france-depuis-le-maroc`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.95,
    },
    {
      url:             `${SITE_URL}/pays/etudier-en-france-depuis-algerie`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.95,
    },
    {
      url:             `${SITE_URL}/pays/etudier-en-france-depuis-senegal`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.95,
    },
    {
      url:             `${SITE_URL}/pays/etudier-en-france-depuis-tunisie`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/pays/etudier-en-france-depuis-cote-ivoire`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/pays/etudier-en-france-depuis-cameroun`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },

    // ── Simulateur budget — outil interactif ────────────────────
    {
      url:             `${SITE_URL}/simulateur`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },

    // ── Calendrier Campus France — outil interactif ─────────────
    {
      url:             `${SITE_URL}/calendrier`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },

    // ── Comparateur villes — outil interactif ───────────────────
    {
      url:             `${SITE_URL}/comparer`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },

    // ── Checklist PDF — page conversion principale ───────────────
    {
      url:             `${SITE_URL}/checklist`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },

    // ── Pages statiques ─────────────────────────────────────────
    {
      url:             `${SITE_URL}/a-propos`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.8,
    },
    {
      url:             `${SITE_URL}/stats`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.95,
    },
    {
      url:             `${SITE_URL}/contact`,
      lastModified:    now,
      changeFrequency: 'yearly',
      priority:        0.5,
    },

    // ── Pages FAQ GEO ─────────────────────────────────────────
    {
      url:             `${SITE_URL}/faq/visa-etudiant-france`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.95,
    },
    {
      url:             `${SITE_URL}/faq/logement-etudiant-france`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/faq/budget-etudiant-france`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/faq/campus-france`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.95,
    },
    {
      url:             `${SITE_URL}/faq/arrivee-france-etudiant`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.9,
    },

    // ── Universités (dynamique) ──────────────────────────────────
    ...universites,

    // ── Villes (dynamique) ───────────────────────────────────────
    ...villes,

    // ── Articles blog ────────────────────────────────────────────
    ...articles,
  ];
}

# Audit SEO — dalili.study — 22 juin 2026

## Résumé exécutif

Le site dalili.study compte 49 articles de blog, 14 fiches universités, 14 fiches villes et 6 pages pays. La structure technique est solide : canonical correctement pointé sur dalili.study, JSON-LD Article/FAQPage/BreadcrumbList présent sur toutes les pages blog, images AVIF activées, robots.txt et sitemap dynamique bien configurés. Les principaux problèmes sont : (1) des titles trop longs sur la quasi-totalité des articles (>60 chars), (2) des descriptions trop longues sur 22 articles et trop courtes sur 6 autres, (3) une cannibalisation réelle entre `campusfrance-maroc-guide-complet` et `visa-etudiant-france-maroc-2026`, (4) 6 articles orphelins sans aucun lien entrant, (5) 10 articles avec readTime en format numérique au lieu de string, et (6) les fiches universités ont toutes leurs titles trop longs.

---

## PARTIE 1 — CANNIBALISATION DE MOTS-CLÉS

### Doublons détectés

#### 1. Campus France Maroc — CRITIQUE
- **Slug principal** : `campusfrance-maroc-guide-complet`
  - Title : "CampusFrance Maroc : guide complet de l'inscription et de l'entretien"
  - Keyword cible : **campus france maroc**
- **Slug secondaire** : `visa-etudiant-france-maroc-2026`
  - Title : "Visa étudiant France depuis le Maroc : le guide complet 2026"
  - Keyword cible : **visa étudiant france maroc 2026**
- **Problème** : Les deux articles couvrent les mêmes étapes (inscription EduFrance → entretien → visa). Le visa-maroc contient une section entière "Étape 1 : S'inscrire sur Campus France Maroc" et "Étape 2 : L'entretien Campus France" — contenu identique au campusfrance-maroc. Google ne peut pas déterminer lequel cibler pour "campus france maroc".
- **Solution recommandée** : Option B — Différencier les keywords. `campusfrance-maroc-guide-complet` cible **"campus france maroc entretien"** (focus sur la préparation entretien, questions posées, erreurs). `visa-etudiant-france-maroc-2026` cible **"visa étudiant france maroc"** (focus sur la procédure visa complète : consulat, VFS, OFII, délais). Supprimer les sections entretien du visa-maroc et y mettre un lien vers campusfrance-maroc.

#### 2. Sécurité sociale étudiante — IMPORTANT
- **Slug principal** : `securite-sociale-etudiante-france-inscription` (2046 mots, 7 liens entrants)
  - Keyword cible : **sécurité sociale étudiant étranger france**
- **Slug secondaire** : `securite-sociale-complementaire-sante-solidaire-etudiant-etranger` (2350 mots, 2 liens entrants)
  - Keyword cible : **complémentaire santé solidaire étudiant étranger**
- **Évaluation** : Les deux couvrent la sécurité sociale. Cependant, le secondaire se différencie bien par le focus sur la CSS (30% des remboursements). La différenciation est suffisante mais les introductions pourraient se chevaucher dans les SERPs.
- **Solution recommandée** : Option B — Acceptable en l'état. Ajouter un lien entre les deux en début d'article avec une phrase explicite : "Cet article couvre X. Pour Y, voir [lien]."

#### 3. Compte bancaire étudiant — IMPORTANT
- **Slug principal** : `ouvrir-compte-bancaire-etudiant-etranger-2026` (1444 mots)
  - Keyword cible : **ouvrir compte bancaire étudiant étranger france**
- **Slug secondaire** : `comment-ouvrir-compte-bancaire-france-sans-adresse-fixe` (1597 mots)
  - Keyword cible : **compte bancaire france sans adresse**
- **Évaluation** : Bonne différenciation — le secondaire cible un cas d'usage précis (sans adresse fixe). Pas de cannibalisation réelle.
- **Solution recommandée** : Pas d'action. Vérifier que les deux articles se lient mutuellement.

#### 4. Budget étudiant — MINEUR
- **Slug 1** : `budget-mensuel-etudiant-etranger-france-2026` — keyword : **budget étudiant étranger france**
- **Slug 2** : `budget-etudiant-senegalais-france-2026` — keyword : **budget étudiant sénégalais france**
- **Évaluation** : Bonne différenciation géographique. Pas de cannibalisation.

#### 5. Logement — cluster cohérent, pas de cannibalisation
Les 4 articles logement (`logement-crous-etudiant-etranger-demande`, `trouver-logement-france-depuis-etranger`, `residence-universitaire-vs-appart-prive-etudiant`, `garant-logement-etudiant-etranger-france`) couvrent des angles bien distincts. Structure H2 différenciée. Pas de cannibalisation.

---

## PARTIE 2 — CONTENU SIMILAIRE / DUPLIQUÉ

### 2.1 Articles visa — introductions

Les introductions des articles visa pays sont **bien différenciées** :
- `visa-etudiant-france-tout-savoir-avant-partir` : approche générique, ordre procédural
- `visa-etudiant-france-maroc-2026` : angle spécifique "tu as déjà une admission — maintenant le visa"
- `visa-etudiant-france-algerie-2026` : angle "100 000 algériens en France — mais procédure unique"
- `visa-etudiant-france-senegal-2026` : angle "procédure sénégalaise la plus rapide d'Afrique"
- `delai-visa-etudiant-france-tout-savoir` : angle "les vrais délais vs les délais officiels"

**Verdict** : Introductions correctement différenciées. Aucun doublon de contenu introductif.

### 2.2 FAQs — cluster visa

La présence d'une section FAQ dans 100% des articles (49/49) est excellente. Vérification rapide : les FAQ des articles Maroc/Algérie/Sénégal couvrent des questions différentes (spécifiques à chaque pays). Pas de duplication détectée sur le cluster visa.

**Exception** : `campusfrance-maroc-guide-complet` contient 2 sections FAQ (score grep = 2), ce qui peut générer un double schéma FAQPage — à vérifier.

### 2.3 Articles par pays — structure et différenciation

Les 6 articles "Étudier depuis [pays]" (Cameroun, Côte d'Ivoire, Tunisie, Maroc via visa-etudiant, Algérie, Sénégal) ont une structure H2 similaire (Campus France → Procédure CEF → Documents → Délais → Bourses → Erreurs → FAQ) mais le contenu est bien spécifique à chaque pays :
- **Cameroun** : spécificité bilingue, équivalences GCE — unique
- **Côte d'Ivoire** : différences avec Maroc/Sénégal — explicite
- **Tunisie** : tableau délais mois par mois — unique

**Verdict** : La structure similaire est normale pour ce type de contenu comparatif. Le fond est suffisamment différencié. Pas de problème de contenu dupliqué.

### 2.4 AVIS DALILI des fiches villes

Les 7 AVIS DALILI présents dans cities.ts sont **tous uniques** et adaptés à chaque ville :
- Nantes : "budget maîtrisé, ingénieurs/designers/économistes"
- Lyon : "médecine/sciences/droit, sérieux"
- Toulouse : "ingénierie aéronautique, Airbus, budget abordable"
- Montpellier : "médecine/pharmacie, faculté la plus ancienne d'Europe"
- Strasbourg : "droit international, institutions européennes"
- Lille : "budget serré, grande ville, quartier Wazemmes"
- Marseille : "communauté maghrébine, intégration facilitée"

**Verdict** : AVIS bien différenciés. Aucun problème.

### 2.5 Fiches universités — sections "Vue d'ensemble"

Toutes les 14 fiches universités partagent la même structure H2 identique :
`Vue d'ensemble → Réputation → Classements → Forces académiques → Conditions d'admission → Procédure de candidature → ...`

C'est une structure de template cohérente. Le contenu dans chaque section est spécifique à chaque université. **Pas de duplication de contenu** au sens strict, mais la similarité structurelle peut affaiblir l'autorité de pages trop proches.

**Problème** : Le titre de section `## Vue d'ensemble` est identique dans 14 fichiers. Google peut percevoir la structure répétitive. Recommandation : différencier les H2 d'introduction (ex : "Pourquoi choisir Sorbonne Université" plutôt que "Vue d'ensemble").

---

## PARTIE 3 — QUALITÉ SEO PAR PAGE

### 3.1 Titles hors norme (> 60 caractères)

La quasi-totalité des articles ont des titles trop longs. Google tronque à environ 60 caractères dans les SERPs.

| Slug | Longueur | Titre |
|------|----------|-------|
| `garant-logement-etudiant-etranger-france` | **100** | "Garant pour logement étudiant en France : toutes les solutions quand on n'a pas de famille sur place" |
| `visa-etudiant-france-algerie-2026` | **96** | "Visa étudiant France depuis l'Algérie 2026 : procédure complète, délais réels et pièges à éviter" |
| `securite-sociale-etudiante-france-inscription` | **91** | "Sécurité sociale étudiante en France : inscription, carte vitale et premiers remboursements" |
| `transport-etudiant-france-abonnements-reductions` | **91** | "Transports en commun pour étudiants en France : abonnements, réductions et carte jeune 2026" |
| `securite-sociale-complementaire-sante-solidaire-etudiant-etranger` | **88** | "Sécurité sociale et Complémentaire santé solidaire pour étudiant étranger en France 2026" |
| `comment-preparer-tcf-30-jours-etudiant-maroc` | **87** | "Comment préparer le TCF en 30 jours : plan semaine par semaine pour étudiants marocains" |
| `tcf-maroc-2026-guide-complet` | **86** | "TCF Maroc 2026 : guide complet pour les étudiants marocains (dates, prix, préparation)" |
| `ouvrir-compte-bancaire-etudiant-etranger-2026` | **85** | "Ouvrir un compte bancaire en France en tant qu'étudiant étranger : guide complet 2026" |
| `ecole-privee-vs-universite-publique-etudiant-etranger` | **90** | "École privée ou université publique en France : que choisir quand on est étranger ? (2026)" |
| `campusfrance-algerie-guide-entretien-2026` | **81** | "Campus France Algérie 2026 : guide complet de l'inscription et de l'entretien CEF" |
| `residence-universitaire-vs-appart-prive-etudiant` | **81** | "Résidence universitaire ou appart privé : que choisir quand on arrive en France ?" |
| `arnaques-etudes-france-etudiant-etranger-eviter` | **80** | "Arnaques aux études en France : 8 pièges à éviter quand on est étudiant étranger" |
| `ecole-privee-france-reconnue-etat-comment-verifier` | **80** | "École privée en France : comment vérifier qu'elle est reconnue par l'État (2026)" |
| `travailler-en-france-etudiant-etranger` | **80** | "Travailler en France en tant qu'étudiant étranger : droits, limites et démarches" |
| `litige-universite-etudiant-etranger` | **79** | "Litige avec ton université en France : tes recours en tant qu'étudiant étranger" |
| `titre-sejour-etudiant-france-renouvellement` | **78** | "Titre de séjour étudiant en France : renouvellement, délais et pièges à éviter" |
| `stage-france-etudiant-etranger-convention` | **76** | "Stage en France pour étudiant étranger : convention, gratification et droits" |
| `contester-refus-visa-campus-france` | **77** | "Refus de visa étudiant France ou avis Campus France défavorable : que faire ?" |
| `droits-etudiant-etranger-france-guide-complet` | **73** | "Tes droits en tant qu'étudiant étranger en France : le guide complet 2026" |
| `delai-visa-etudiant-france-tout-savoir` | **73** | "Délai visa étudiant France : combien de temps ça prend vraiment en 2026 ?" |
| `trouver-logement-france-depuis-etranger` | **71** | "Trouver un logement en France depuis l'étranger : guide étape par étape" |
| `informatique-france-etudiant-etranger` | **71** | "Étudier l'informatique en France : guide complet étudiant étranger 2026" |
| `alternance-etudiant-etranger-france` | **69** | "Alternance pour étudiant étranger en France : conditions et démarches" |
| `medecin-traitant-france-etudiant-etranger` | **68** | "Médecin traitant en France pour étudiant étranger : inscription et remboursements" |
| `budget-mensuel-etudiant-etranger-france-2026` | **68** | "Budget étudiant étranger en France 2026 : le vrai coût mois par mois" |
| `delf-dalf-vs-tcf-etudiant-etranger-france` | **66** | "DELF, DALF ou TCF : lequel choisir pour ton visa étudiant France ?" |
| `etudier-paris-etudiant-etranger-guide` | **65** | "Étudier à Paris en tant qu'étudiant étranger : guide complet 2026" |
| `visa-etudiant-france-tout-savoir-avant-partir` | **64** | "Visa étudiant France : tout ce qu'il faut savoir avant de partir" |

**Articles dans la norme (50–60 chars)** :
- `bourses-etudes-etudiants-etrangers-france-2026` : 56 ✓
- `etudier-en-france-depuis-tunisie` : 56 ✓
- `frais-scolarite-universite-france-etudiant-etranger-2026` : 59 ✓
- `lettre-motivation-campus-france-exemple-2026` : 59 ✓
- `parcoursup-etudiant-etranger-guide-2026` : 54 ✓
- `visa-etudiant-france-maroc-2026` : 60 ✓
- `visa-etudiant-france-senegal-2026` : 59 ✓

### 3.2 Descriptions hors norme

#### Descriptions trop longues (> 158 caractères)
| Slug | Longueur |
|------|----------|
| `caf-etudiant-etranger-delais-documents-erreurs` | **204** |
| `securite-sociale-complementaire-sante-solidaire-etudiant-etranger` | **197** |
| `visa-etudiant-france-tout-savoir-avant-partir` | **183** |
| `comment-ouvrir-compte-bancaire-france-sans-adresse-fixe` | **180** |
| `ecole-privee-france-reconnue-etat-comment-verifier` | **175** |
| `alternance-etudiant-etranger-france` | **173** |
| `arnaques-etudes-france-etudiant-etranger-eviter` | **164** |
| `campusfrance-algerie-guide-entretien-2026` | **166** |
| `comment-preparer-tcf-30-jours-etudiant-maroc` | **166** |
| `bourses-etudes-etudiants-etrangers-france-2026` | **163** |
| `campusfrance-senegal-guide-inscription-dakar` | **163** |
| `budget-etudiant-senegalais-france-2026` | **161** |
| `ouvrir-compte-bancaire-etudiant-etranger-2026` | **161** |
| `tcf-maroc-2026-guide-complet` | **161** |
| `residence-universitaire-vs-appart-prive-etudiant` | **162** |
| `travailler-en-france-etudiant-etranger` | **162** |
| `trouver-logement-france-depuis-etranger` | **165** |
| `budget-mensuel-etudiant-etranger-france-2026` | **159** |

#### Descriptions trop courtes (< 145 caractères)
| Slug | Longueur |
|------|----------|
| `delf-dalf-vs-tcf-etudiant-etranger-france` | **120** |
| `informatique-france-etudiant-etranger` | **118** |
| `medecine-france-etudiant-etranger-guide-complet` | **117** |
| `ofii-validation-visa-etudiant-france-guide` | **126** |
| `etudier-en-france-depuis-cameroun` | **134** |
| `etudier-en-france-depuis-cote-ivoire` | **127** |
| `etudier-en-france-depuis-tunisie` | **122** |
| `calendrier-tcf-maroc-2026-dates-sessions` | **136** |
| `lettre-motivation-campus-france-exemple-2026` | **124** |
| `parcoursup-etudiant-etranger-guide-2026` | **128** |
| `frais-scolarite-universite-france-etudiant-etranger-2026` | **138** |

### 3.3 Articles sans cluster

**Aucun** : les 49 articles ont tous un cluster assigné dans `lib/blog.ts` et un champ `cluster:` dans leur frontmatter.

### 3.4 Articles sans thumbnail

**Aucun** : tous les articles ont un champ `thumbnail:` renseigné.

### 3.5 Articles < 1000 mots (estimé)

**Aucun** article n'est sous la barre des 1000 mots. L'article le plus court est `ofii-validation-visa-etudiant-france-guide` (1290 mots), ce qui reste acceptable.

Articles entre 1000 et 1400 mots (à enrichir) :
- `ofii-validation-visa-etudiant-france-guide` : 1290 mots
- `etudier-en-france-depuis-cote-ivoire` : 1269 mots
- `delai-visa-etudiant-france-tout-savoir` : 1396 mots
- `delf-dalf-vs-tcf-etudiant-etranger-france` : 1403 mots
- `calendrier-tcf-maroc-2026-dates-sessions` : 1423 mots
- `etudier-en-france-depuis-cameroun` : 1317 mots
- `transport-etudiant-france-abonnements-reductions` : 1308 mots
- `frais-scolarite-universite-france-etudiant-etranger-2026` : 1371 mots

### 3.6 Articles orphelins (aucun ou très peu de liens entrants depuis le blog)

| Slug | Liens entrants | Liens sortants | Statut |
|------|---------------|----------------|--------|
| `delf-dalf-vs-tcf-etudiant-etranger-france` | **0** | 3 | ORPHELIN |
| `etudier-en-france-depuis-cameroun` | **0** | 2 | ORPHELIN |
| `etudier-en-france-depuis-cote-ivoire` | **0** | 2 | ORPHELIN |
| `etudier-en-france-depuis-tunisie` | **0** | 3 | ORPHELIN |
| `etudier-paris-etudiant-etranger-guide` | **0** | 0 | ORPHELIN + AUCUN LIEN SORTANT |
| `informatique-france-etudiant-etranger` | **0** | 4 | ORPHELIN |
| `ofii-validation-visa-etudiant-france-guide` | **0** | 4 | ORPHELIN |
| `parcoursup-etudiant-etranger-guide-2026` | **0** | 4 | ORPHELIN |
| `residence-universitaire-vs-appart-prive-etudiant` | **0** | 2 | ORPHELIN |
| `systeme-universitaire-francais-guide-etranger` | **0** | 2 | ORPHELIN |
| `visale-refuse-proprietaire-que-faire` | **0** | 3 | ORPHELIN |

**Articles avec très peu de liens entrants (1 seul)** :
- `contester-refus-visa-campus-france` : 1 entrant
- `delai-visa-etudiant-france-tout-savoir` : 1 entrant
- `lettre-motivation-campus-france-exemple-2026` : 1 entrant
- `litige-universite-etudiant-etranger` : 1 entrant
- `medecine-france-etudiant-etranger-guide-complet` : 1 entrant
- `transport-etudiant-france-abonnements-reductions` : 1 entrant

**Cas critique** : `etudier-paris-etudiant-etranger-guide` a 0 lien entrant ET 0 lien sortant — complètement isolé du reste du site.

### 3.7 Articles avec liens sortants insuffisants (< 3)

| Slug | Liens internes sortants |
|------|------------------------|
| `alternance-etudiant-etranger-france` | **0** |
| `bourses-etudes-etudiants-etrangers-france-2026` | **0** |
| `etudier-paris-etudiant-etranger-guide` | **0** |
| `stage-france-etudiant-etranger-convention` | **0** |
| `campusfrance-maroc-guide-complet` | **1** |
| `garant-logement-etudiant-etranger-france` | **1** |
| `medecin-traitant-france-etudiant-etranger` | **1** |
| `titre-sejour-etudiant-france-renouvellement` | **1** |
| `transport-etudiant-france-abonnements-reductions` | **1** |
| `visa-etudiant-france-maroc-2026` | **2** |
| `caf-etudiant-etranger-delais-documents-erreurs` | **2** |
| `delai-visa-etudiant-france-tout-savoir` | **2** |
| `etudier-en-france-depuis-cameroun` | **2** |
| `etudier-en-france-depuis-cote-ivoire` | **2** |
| `logement-crous-etudiant-etranger-demande` | **2** |
| `ouvrir-compte-bancaire-etudiant-etranger-2026` | **2** |
| `residence-universitaire-vs-appart-prive-etudiant` | **2** |
| `systeme-universitaire-francais-guide-etranger` | **2** |
| `travailler-en-france-etudiant-etranger` | **2** |

### 3.8 Frontmatter incomplet

**readTime en format numérique** (devrait être string "X min") — 10 articles :
- `delf-dalf-vs-tcf-etudiant-etranger-france` : `readTime: 9`
- `etudier-en-france-depuis-cameroun` : `readTime: 11`
- `etudier-en-france-depuis-cote-ivoire` : `readTime: 11`
- `etudier-en-france-depuis-tunisie` : `readTime: 12`
- `frais-scolarite-universite-france-etudiant-etranger-2026` : `readTime: 10`
- `informatique-france-etudiant-etranger` : `readTime: 12`
- `lettre-motivation-campus-france-exemple-2026` : `readTime: 10`
- `medecine-france-etudiant-etranger-guide-complet` : `readTime: 14`
- `ofii-validation-visa-etudiant-france-guide` : `readTime: 9`
- `parcoursup-etudiant-etranger-guide-2026` : `readTime: 10`

**Interface PostMeta attend** `readTime: string` — si le code tente `.split(' ')` ou des opérations string sur un nombre, cela peut générer une erreur silencieuse ou afficher "undefined min".

**Champs obligatoires manquants** : Aucun champ critique manquant. Tous les articles ont title, description, date, updatedDate, category, cluster, readTime, author, ogImage, thumbnail, excerpt.

**Double FAQ** : `campusfrance-maroc-guide-complet` contient deux sections avec le pattern `## FAQ` — peut générer deux blocs FAQPage dans le JSON-LD. À vérifier et corriger.

---

## PARTIE 4 — TECHNIQUE SEO

### 4.1 Canonical URLs

**Statut : CORRECT**
- `app/blog/[slug]/page.tsx` : canonical pointe sur `${siteUrl}/blog/${params.slug}` avec `siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study'`
- `.env` : `NEXT_PUBLIC_SITE_URL=https://dalili.study` — confirmé
- Aucune référence à `vercel.app` dans les canonicals

**Attention** : Les pages `/pays/` utilisent un canonical statique hardcodé (`${SITE_URL}/pays/etudier-en-france-depuis-le-maroc`). Si `NEXT_PUBLIC_SITE_URL` n'est pas défini en production, le fallback `'https://dalili.study'` s'applique. Pas de problème en l'état.

### 4.2 JSON-LD Schemas

**Blog articles** — 3 schémas générés systématiquement :
1. **Article** : `headline`, `description`, `datePublished`, `dateModified`, `author`, `publisher`, `mainEntityOfPage`, `image` ✓
2. **FAQPage** : généré conditionnellement si `extractFaqItems()` retourne des résultats — 100% des articles ont une section FAQ ✓
3. **BreadcrumbList** : Accueil → Blog → Article ✓

**Problème détecté** : `campusfrance-maroc-guide-complet` contient deux occurrences du pattern `## FAQ`. Si `extractFaqItems()` extrait les questions en doublon ou produit deux blocs séparés, Google Search Console peut signaler une erreur de structure. Vérifier le rendu.

**Pages pays** : Seul un schéma `BreadcrumbList` est généré. Pas de schéma `WebPage` ou `Article`. Pour des pages piliers, un schéma `FAQPage` ou `HowTo` apporterait une valeur ajoutée significative.

**Fiches universités** : Vérifier que le schéma `CollegeOrUniversity` est présent — non visible dans le code audité.

### 4.3 Images

**Optimisation** :
- `next.config.js` : formats AVIF/WebP activés ✓, `minimumCacheTTL: 5184000` (60 jours) ✓
- `next/image` utilisé dans `app/blog/[slug]/page.tsx` pour les images d'articles ✓
- `dangerouslyAllowSVG: false` ✓

**Problème potentiel** : Les thumbnails blog sont en formats mixtes (`.webp`, `.png`) dans le frontmatter. Les fichiers `.png` ne bénéficient pas de la conversion AVIF automatique si `next/image` n'est pas utilisé dans les composants de liste. Vérifier que `BlogPreviewSection.jsx` et `SearchableBlogGrid.tsx` utilisent bien `next/image`.

**Alt text** : Aucun `alt=""` vide détecté dans les composants principaux ✓

### 4.4 Performance

**Configuration next.config.js** :
- `compress: true` ✓
- `removeConsole: true` en production ✓
- `poweredByHeader: false` ✓
- `deviceSizes` et `imageSizes` optimisés ✓
- AVIF prioritaire ✓

**Potentiel problème** : `serverComponentsExternalPackages: ['@react-pdf/renderer']` — ce package lourd est chargé comme external package. Vérifier qu'il est bien lazy-loadé et n'impacte pas le LCP.

---

## PARTIE 5 — SITEMAP

### Structure du sitemap

Le sitemap est **dynamique** et généré dans `app/sitemap.ts` via `getAllPosts()`, `getAllUniversitySlugs()`, `getAllCitySlugs()`.

### URLs présentes

| Section | Nombre | Priorité |
|---------|--------|----------|
| Homepage | 1 | 1.0 |
| `/blog` (index) | 1 | 0.95 |
| `/universites` (index) | 1 | 0.9 |
| `/villes` (index) | 1 | 0.9 |
| `/checklist` | 1 | 0.9 |
| `/a-propos` | 1 | 0.5 |
| Pages pays (`/pays/*`) | 6 | 0.9–0.95 |
| Articles blog | 49 | 0.7–0.8 |
| Fiches universités | 14 | 0.85 |
| Fiches villes | 14 | 0.85 |
| **Total** | **89** | — |

### URLs manquantes dans le sitemap

1. **`/pays` (index)** : Il n'existe pas de page index `/pays` ni dans le filesystem ni dans le sitemap. Si des liens internes pointent vers `/pays`, c'est une page 404. Vérifier.

2. **`/admin`** : Page admin présente dans le git status (`app/admin/page.tsx`) — **à exclure explicitement du sitemap et des robots** si elle est accessible. Actuellement, `robots.txt` autorise tout (`allow: '/'`). Ajouter `disallow: /admin` si cette page ne doit pas être indexée.

### Vérification de la priorité HIGH_PRIORITY_SLUGS

Tous les 31 slugs en `HIGH_PRIORITY_SLUGS` correspondent à des articles existants dans `content/blog/`. Aucun slug fantôme. ✓

---

## ACTIONS PRIORITAIRES

### CRITIQUE (impact fort — corriger immédiatement)

- `campusfrance-maroc-guide-complet` vs `visa-etudiant-france-maroc-2026` | Cannibalisation keyword "campus france maroc" — les deux articles couvrent les mêmes étapes d'inscription et d'entretien | Supprimer les sections "Inscription Campus France" et "Entretien" du visa-maroc, les remplacer par un lien vers campusfrance-maroc, et mettre à jour les H2 pour se concentrer exclusivement sur le visa consulat + OFII | **Impact: très fort**

- `etudier-paris-etudiant-etranger-guide` | Article orphelin complet : 0 lien entrant ET 0 lien sortant — invisible pour Google et non crawlé efficacement | Ajouter 3 liens entrants depuis les articles budget-mensuel, trouver-logement et systeme-universitaire. Ajouter 5 liens sortants vers les universités parisiennes, logement CROUS, transport Paris | **Impact: fort**

- `/admin` (page admin) | robots.txt autorise tout le site — si `/app/admin/page.tsx` est accessible publiquement, Google l'indexera | Ajouter `disallow: /admin` dans robots.ts | **Impact: fort (sécurité + SEO)**

- 10 articles avec `readTime` en format numérique | `readTime: 9` au lieu de `readTime: "9 min"` — risque d'erreur silencieuse si PostMeta attend un string | Corriger dans les frontmatter : `delf-dalf-vs-tcf-etudiant-etranger-france`, `etudier-en-france-depuis-cameroun`, `etudier-en-france-depuis-cote-ivoire`, `etudier-en-france-depuis-tunisie`, `frais-scolarite-universite-france-etudiant-etranger-2026`, `informatique-france-etudiant-etranger`, `lettre-motivation-campus-france-exemple-2026`, `medecine-france-etudiant-etranger-guide-complet`, `ofii-validation-visa-etudiant-france-guide`, `parcoursup-etudiant-etranger-guide-2026` | **Impact: fort (affichage)**

### IMPORTANT (corriger cette semaine)

- `garant-logement-etudiant-etranger-france` | Title de 100 caractères : "Garant pour logement étudiant en France : toutes les solutions quand on n'a pas de famille sur place" — tronqué à 60 chars dans les SERPs | Raccourcir à : `"Garant logement étudiant étranger : 5 solutions sans famille en France"` (66 chars) ou `"Garant logement France sans famille : solutions étudiants étrangers"` (65 chars) | **Impact: moyen-fort**

- `visa-etudiant-france-algerie-2026` | Title de 96 caractères — affiché tronqué dans Google | Raccourcir à : `"Visa étudiant France Algérie 2026 : procédure et délais réels"` (61 chars) | **Impact: moyen**

- Tous les articles avec description > 158 chars (18 articles) | Google tronque les descriptions hors norme — perte de CTR | Raccourcir les descriptions à 145–158 chars en gardant le keyword principal en début de phrase. Priorité aux articles avec le plus de trafic potentiel : `caf-etudiant-etranger-delais-documents-erreurs` (204 chars), `securite-sociale-complementaire-sante-solidaire-etudiant-etranger` (197 chars), `visa-etudiant-france-tout-savoir-avant-partir` (183 chars) | **Impact: moyen (CTR)**

- 6 articles orphelins pays (`etudier-en-france-depuis-cameroun`, `etudier-en-france-depuis-cote-ivoire`, `etudier-en-france-depuis-tunisie`) + `delf-dalf-vs-tcf-etudiant-etranger-france`, `informatique-france-etudiant-etranger`, `parcoursup-etudiant-etranger-guide-2026` | Aucun lien entrant depuis les autres articles — autorité PageRank non transmise | Ajouter ces slugs dans les sections "Liens utiles" ou "Related articles" des articles des clusters correspondants | **Impact: moyen**

- `alternance-etudiant-etranger-france` | 0 lien sortant interne — article isolé dans son cluster emploi | Ajouter des liens vers `travailler-en-france-etudiant-etranger`, `stage-france-etudiant-etranger-convention`, `titre-sejour-etudiant-france-renouvellement` | **Impact: moyen**

- `bourses-etudes-etudiants-etrangers-france-2026` | 0 lien sortant interne | Ajouter des liens vers `caf-etudiant-etranger-delais-documents-erreurs`, `budget-mensuel-etudiant-etranger-france-2026`, `logement-crous-etudiant-etranger-demande` | **Impact: moyen**

- `stage-france-etudiant-etranger-convention` | 0 lien sortant interne | Ajouter des liens vers `travailler-en-france-etudiant-etranger`, `alternance-etudiant-etranger-france`, `securite-sociale-etudiante-france-inscription` | **Impact: moyen**

- Pages pays — descriptions trop courtes | `etudier-en-france-depuis-cameroun` (131 chars), `etudier-en-france-depuis-cote-ivoire` (134 chars), `etudier-en-france-depuis-senegal` (143 chars) | Enrichir les descriptions jusqu'à 148–155 chars avec des détails différenciants (ex : pour Cameroun ajouter "équivalences GCE, procédure bilingue") | **Impact: moyen (CTR)**

- Fiches universités — titles tous > 60 chars | 11/12 universités ont des titles > 60 chars (jusqu'à 77 chars pour Toulouse) | Supprimer "| Dalili" du title ou raccourcir le template. Ex : `"Université de Bordeaux : guide étudiant étranger 2026"` (53 chars ✓) | **Impact: moyen**

- Pages pays — titles tous > 60 chars | 5/6 pays ont des titles > 63 chars | Raccourcir "guide complet 2026 | Dalili" en "guide 2026" ou supprimer le brand suffix. Ex : `"Étudier en France depuis l'Algérie : guide 2026"` (48 chars ✓) | **Impact: moyen**

- `campusfrance-maroc-guide-complet` | Double section FAQ (score = 2) — risque de double FAQPage JSON-LD | Fusionner les deux sections FAQ en une seule `## FAQ — CampusFrance Maroc` | **Impact: moyen (structured data)**

- Pages pays — absence de schéma FAQPage et Article | Les 6 pages pays ont uniquement un schéma BreadcrumbList | Ajouter un schéma `FAQPage` (les pages contiennent des FAQs) et un schéma `Article` ou `WebPage` avec `datePublished` et `dateModified` | **Impact: moyen (rich snippets)**

### MINEUR (corriger quand possible)

- Articles en descriptions trop courtes (`delf-dalf-vs-tcf`, `informatique-france-etudiant-etranger`, `medecine-france-etudiant-etranger-guide-complet`, `ofii-validation-visa-etudiant-france-guide`, `calendrier-tcf-maroc-2026-dates-sessions`, `lettre-motivation-campus-france-exemple-2026`, `parcoursup-etudiant-etranger-guide-2026`, `frais-scolarite-universite-france-etudiant-etranger-2026`) | Descriptions entre 117 et 138 chars — sous la fenêtre optimale | Enrichir jusqu'à 148–155 chars | **Impact: faible**

- Fiches universités — H2 "Vue d'ensemble" identique sur 14 fiches | Google peut percevoir la répétition de template | Personnaliser le H2 d'introduction : ex "Pourquoi choisir Sorbonne Université", "Aix-Marseille en 5 chiffres" | **Impact: faible**

- `contester-refus-visa-campus-france` | 1 seul lien entrant — article sous-lié | Ajouter dans les articles visa-maroc, visa-algerie, visa-senegal un lien vers cet article en cas de refus | **Impact: faible**

- `delai-visa-etudiant-france-tout-savoir` | 1 seul lien entrant | Référencer dans les articles visa pays (maroc, algerie, senegal) | **Impact: faible**

- `transport-etudiant-france-abonnements-reductions` | 1 lien entrant, 1 lien sortant | Article isolé du cluster vie-etudiante | Ajouter dans budget-mensuel et etudier-paris un lien vers cet article | **Impact: faible**

- Pas de page index `/pays` | Le sitemap liste des pages `/pays/[slug]` mais pas `/pays` — si des liens pointent vers `/pays`, c'est une 404 | Créer une page index `/app/pays/page.tsx` ou s'assurer qu'aucun lien n'y pointe | **Impact: faible**

- Fiches universités — absence de schéma `CollegeOrUniversity` non vérifiée dans cet audit | Vérifier que `app/universites/[slug]/page.tsx` génère bien un schéma `EducationalOrganization` ou `CollegeOrUniversity` | **Impact: faible**

---

## ANNEXE — Récapitulatif des 49 articles

| Slug | Title (chars) | Desc (chars) | Mots | Liens entrants | Liens sortants |
|------|--------------|--------------|------|---------------|----------------|
| alternance-etudiant-etranger-france | 69 ⚠ | 173 ⚠ | 1747 | 3 | **0** ⚠ |
| arnaques-etudes-france-etudiant-etranger-eviter | 80 ⚠ | 164 ⚠ | 2163 | 2 | 4 |
| bourses-etudes-etudiants-etrangers-france-2026 | 56 ✓ | 163 ⚠ | 1823 | 5 | **0** ⚠ |
| budget-etudiant-senegalais-france-2026 | 62 ⚠ | 161 ⚠ | 2916 | 2 | 4 |
| budget-mensuel-etudiant-etranger-france-2026 | 68 ⚠ | 159 ⚠ | 2170 | 8 | 7 |
| caf-etudiant-etranger-delais-documents-erreurs | 61 ⚠ | 204 ⚠ | 2000 | 11 | 2 |
| calendrier-tcf-maroc-2026-dates-sessions | 70 ⚠ | 136 ⚠ | 1423 | 2 | 4 |
| campusfrance-algerie-guide-entretien-2026 | 81 ⚠ | 166 ⚠ | 3074 | 2 | 6 |
| campusfrance-maroc-guide-complet | 69 ⚠ | 157 ✓ | 1776 | 9 | **1** ⚠ |
| campusfrance-senegal-guide-inscription-dakar | 62 ⚠ | 163 ⚠ | 2481 | 2 | 3 |
| comment-ouvrir-compte-bancaire-france-sans-adresse-fixe | 61 ⚠ | 180 ⚠ | 1597 | 3 | 3 |
| comment-preparer-tcf-30-jours-etudiant-maroc | 87 ⚠ | 166 ⚠ | 1742 | 3 | 4 |
| contester-refus-visa-campus-france | 77 ⚠ | 155 ✓ | 1782 | 1 ⚠ | 3 |
| delai-visa-etudiant-france-tout-savoir | 73 ⚠ | 158 ✓ | 1396 | 1 ⚠ | 2 |
| delf-dalf-vs-tcf-etudiant-etranger-france | 66 ⚠ | 120 ⚠ | 1403 | **0** ⚠ | 3 |
| droits-etudiant-etranger-france-guide-complet | 73 ⚠ | 159 ⚠ | 1880 | 5 | 5 |
| ecole-privee-france-reconnue-etat-comment-verifier | 80 ⚠ | 175 ⚠ | 2025 | 2 | 3 |
| ecole-privee-vs-universite-publique-etudiant-etranger | 90 ⚠ | 148 ✓ | 2136 | 2 | 4 |
| etudier-en-france-depuis-cameroun | 57 ✓ | 134 ⚠ | 1317 | **0** ⚠ | 2 |
| etudier-en-france-depuis-cote-ivoire | 62 ⚠ | 127 ⚠ | 1269 | **0** ⚠ | 2 |
| etudier-en-france-depuis-tunisie | 56 ✓ | 122 ⚠ | 1519 | **0** ⚠ | 3 |
| etudier-france-algerien-temoignage-conseils | 70 ⚠ | 159 ⚠ | 2264 | 2 | 3 |
| etudier-paris-etudiant-etranger-guide | 65 ⚠ | 157 ✓ | 2024 | **0** ⚠ | **0** ⚠ |
| frais-scolarite-universite-france-etudiant-etranger-2026 | 59 ✓ | 138 ⚠ | 1371 | 3 | 4 |
| garant-logement-etudiant-etranger-france | 100 ⚠ | 154 ✓ | 1419 | 4 | **1** ⚠ |
| informatique-france-etudiant-etranger | 71 ⚠ | 118 ⚠ | 1426 | **0** ⚠ | 4 |
| lettre-motivation-campus-france-exemple-2026 | 59 ✓ | 124 ⚠ | 1638 | 1 ⚠ | 3 |
| litige-universite-etudiant-etranger | 79 ⚠ | 147 ✓ | 2031 | 1 ⚠ | 3 |
| logement-crous-etudiant-etranger-demande | 89 ⚠ | 144 ✓ | 1456 | 6 | 2 |
| medecin-traitant-france-etudiant-etranger | 68 ⚠ | 156 ✓ | 2126 | 3 | **1** ⚠ |
| medecine-france-etudiant-etranger-guide-complet | 63 ⚠ | 117 ⚠ | 1877 | 1 ⚠ | 5 |
| ofii-validation-visa-etudiant-france-guide | 69 ⚠ | 126 ⚠ | 1290 | **0** ⚠ | 4 |
| ouvrir-compte-bancaire-etudiant-etranger-2026 | 85 ⚠ | 161 ⚠ | 1444 | 3 | 2 |
| parcoursup-etudiant-etranger-guide-2026 | 54 ✓ | 128 ⚠ | 1418 | **0** ⚠ | 4 |
| residence-universitaire-vs-appart-prive-etudiant | 81 ⚠ | 162 ⚠ | 1496 | **0** ⚠ | 2 |
| securite-sociale-complementaire-sante-solidaire-etudiant-etranger | 88 ⚠ | 197 ⚠ | 2350 | 2 | 5 |
| securite-sociale-etudiante-france-inscription | 91 ⚠ | 152 ✓ | 2046 | 7 | 5 |
| stage-france-etudiant-etranger-convention | 76 ⚠ | 148 ✓ | 1791 | 2 | **0** ⚠ |
| systeme-universitaire-francais-guide-etranger | 61 ⚠ | 158 ✓ | 2299 | **0** ⚠ | 2 |
| tcf-maroc-2026-guide-complet | 86 ⚠ | 161 ⚠ | 2177 | 3 | 6 |
| titre-sejour-etudiant-france-renouvellement | 78 ⚠ | 144 ✓ | 1614 | 5 | **1** ⚠ |
| transport-etudiant-france-abonnements-reductions | 91 ⚠ | 159 ⚠ | 1308 | 1 ⚠ | **1** ⚠ |
| travailler-en-france-etudiant-etranger | 80 ⚠ | 162 ⚠ | 1930 | 7 | 2 |
| trouver-logement-france-depuis-etranger | 71 ⚠ | 165 ⚠ | 2057 | 9 | 3 |
| visa-etudiant-france-algerie-2026 | 96 ⚠ | 159 ⚠ | 2805 | 3 | 6 |
| visa-etudiant-france-maroc-2026 | 60 ✓ | 159 ⚠ | 1680 | 11 | 2 |
| visa-etudiant-france-senegal-2026 | 59 ✓ | 149 ✓ | 2478 | 3 | 4 |
| visa-etudiant-france-tout-savoir-avant-partir | 64 ⚠ | 183 ⚠ | 2109 | 8 | 4 |
| visale-refuse-proprietaire-que-faire | 73 ⚠ | 142 ✓ | 1678 | **0** ⚠ | 3 |

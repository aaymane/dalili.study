# 04 — SEO, GEO, AEO : stratégie complète et implémentation réelle

Cette section distingue systématiquement **ce qui est implémenté et vérifié dans le code** de **ce qui relève de l'ambition du skill `dalili-master`** (marqué **[ASPIRATIONNEL]**).

## Vue d'ensemble de l'inventaire indexable (au 2026-07-20)

D'après `app/sitemap.ts` et un comptage direct des fichiers :

- **65 articles de blog** (`content/blog/*.mdx` — comptés directement ; l'audit SEO du 22 juin en comptait 49, donc **16 articles ont été ajoutés depuis**)
- **14 fiches universités**, **14 fiches villes**
- **6 pages pays** (`/pays/etudier-en-france-depuis-*`)
- **5 pages FAQ dédiées** (`/faq/*`)
- **4 outils interactifs** (`/simulateur`, `/comparer`, `/calendrier`, `/checklist`)
- **1 page `/stats`** (données chiffrées, schema `Dataset`)
- Pages statiques : `/a-propos`, `/contact`, `/confidentialite`, `/mentions-legales`
- **`/admin` est explicitement exclu** du crawl (`app/robots.ts` : `disallow: ['/admin', '/api/']`) — bon réflexe déjà en place (l'audit SEO de juin recommandait cette correction, elle est faite).

## Métadonnées — pattern systématique

Chaque route dynamique (`generateMetadata`) et chaque page statique définit individuellement : `title`, `description`, `alternates.canonical`, `openGraph` (title/description/url/siteName/type/images), et pour le blog en plus `twitter` (card `summary_large_image`). Le pattern est **cohérent et répété manuellement** sur chaque type de page (pas de fonction factory commune type `buildMetadata()` — chaque `page.tsx` réécrit sa propre logique, ce qui est une petite duplication mais reste lisible).

`app/layout.tsx` définit la métadonnée racine avec `title.template: "%s | Dalili"` — donc chaque page enfant qui définit un `title` simple (string) sera automatiquement suffixée `| Dalili`, SAUF les pages qui définissent déjà un titre complet avec `| Dalili` inclus manuellement (cas de plusieurs articles/universités — à surveiller pour ne pas produire `"... | Dalili | Dalili"` par erreur si un futur article omet de retirer le suffixe redondant).

`metadataBase: new URL(SITE_URL)` est bien défini une fois dans le layout racine — toutes les URLs relatives dans les metadata enfants se résolvent correctement.

## Canonical

- **Stratégie** : chaque page pointe son propre canonical sur elle-même (`${SITE_URL}/{route}`), avec `SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dalili.study'`. Le fallback en dur garantit qu'un déploiement de preview Vercel (URL `*.vercel.app`) sans variable d'env configurée ne pointerait quand même jamais son canonical vers l'URL de preview — bonne pratique anti-duplicate-content déjà en place (et corrigée par le commit `b1f3c97 : fix: canonical/redirect confusion homepage`).
- **hreflang** : **absent du code — [ASPIRATIONNEL uniquement]**. Le site est mono-langue (français), ciblant des pays où le français est langue seconde/officielle (Maghreb, Afrique francophone) ou langue d'enseignement visée — donc l'absence de hreflang n'est pas un manque urgent tant qu'il n'existe qu'une version linguistique. Cela deviendrait pertinent uniquement si une version arabe ou anglaise du site était créée un jour.

## OpenGraph & Twitter Cards

- OG configuré partout avec image 1200×630.
- **Génération dynamique d'image OG** pour le blog via `app/blog/[slug]/opengraph-image.tsx` (route spéciale Next.js `ImageResponse`) — donc chaque article a une image de partage sociale générée automatiquement à la volée, pas une image statique unique. `app/checklist/opengraph-image.tsx` fait de même pour l'outil checklist. Les autres pages (universités, villes) utilisent une image statique (`uni.thumbnail`/`city.thumbnail`) en OG plutôt qu'une image générée.
- Twitter : `card: summary_large_image`, `site`/`creator: @dalilistudy`.

## JSON-LD / Schema.org — inventaire exact par type de page

| Page | Schémas présents | Fichier source |
|---|---|---|
| `app/layout.tsx` (racine, sur TOUTES les pages) | `WebSite` (avec `potentialAction.SearchAction` pointant vers `/blog?q=`), `Organization` (avec `knowsAbout`, `areaServed`, `sameAs`) | `app/layout.tsx` |
| Article de blog | `Article`, `FAQPage` (conditionnel — seulement si une section FAQ est détectée), `BreadcrumbList` | `app/blog/[slug]/page.tsx` |
| Fiche université | `BreadcrumbList`, `EducationalOrganization` (⚠️ pas `CollegeOrUniversity` — voir note ci-dessous), `Article`, `FAQPage` (conditionnel) | `app/universites/[slug]/page.tsx` |
| Fiche ville | (à vérifier au cas par cas — structure similaire attendue à la fiche université, non relue ligne à ligne dans cet audit, mais le pattern `extractFaqItems` + `BreadcrumbList` est importé) | `app/villes/[slug]/page.tsx` |
| Pages FAQ dédiées (`/faq/*`) | `FAQPage` uniquement | ex. `app/faq/visa-etudiant-france/page.tsx` |
| `/stats` | `Dataset` | `app/stats/page.tsx` |
| Pages pays | `BreadcrumbList` uniquement — **pas de `FAQPage` ni `Article`/`WebPage`**, alors que ces pages contiennent des FAQ (déjà signalé par l'audit SEO de juin comme gain "rich snippets" facile) | `app/pays/*/page.tsx` |

**Note importante — écart entre skill et code** : le skill `dalili-master` mandate explicitement `CollegeOrUniversity` comme type schema.org pour les fiches universités **[ASPIRATIONNEL non respecté]**. Le code réel utilise `EducationalOrganization`, un type schema.org valide mais différent (`CollegeOrUniversity` est en réalité un sous-type plus spécifique et plus adapté). Ce n'est pas cassé (Google accepte les deux), mais si un successeur cherche à "suivre le skill à la lettre", il notera cet écart — à corriger ou à assumer consciemment.

## Extraction automatique de la FAQ depuis le Markdown — le cœur du système AEO

C'est l'un des mécanismes les plus intelligents du projet et vaut la peine d'être bien compris. Fonction `extractFaqItems()` dans `lib/blog.ts` :

1. Cherche un heading `## FAQ` ou `### FAQ` (regex `/^#{2,3}\s+.*faq/i`) dans le Markdown brut de l'article.
2. À l'intérieur de cette section, reconnaît deux formats de question : soit une ligne en gras se terminant par `?` (`**Question ?**`), soit un sous-titre se terminant par `?` (`### Question ?`).
3. La réponse est le premier paragraphe non vide qui suit.
4. Le Markdown de la réponse est nettoyé (`stripMarkdown()`) — liens `[texte](url)` → `texte`, gras/italique/code retirés — pour produire du texte brut propre, adapté à un champ `acceptedAnswer.text` de schema.org.
5. Si aucune section FAQ n'est trouvée, le schema `FAQPage` n'est simplement pas injecté (pas d'erreur, dégradation silencieuse).

**Conséquence pratique pour la rédaction de contenu** : la convention `**Question se terminant par un point d'interrogation ?**` suivie d'un paragraphe est un contrat implicite avec le code — un rédacteur (humain ou IA) qui ne respecte pas exactement ce pattern (ex. oublie le `?`, ou met la réponse sur plusieurs paragraphes séparés par une ligne vide) verra sa question soit ignorée, soit tronquée dans le JSON-LD généré. **C'est une convention critique à documenter/rappeler à chaque génération de nouvel article.**

**Bug connu déjà documenté dans l'audit SEO** (juin 2026, à re-vérifier s'il est corrigé) : l'article `campusfrance-maroc-guide-complet` contenait deux sections matchant `## FAQ`, ce qui, avec la logique "cherche le premier `## FAQ`, s'arrête au prochain `## `" (`faqEnd` = premier `## ` suivant après `faqStart`), signifie en réalité que seule la **première** section FAQ trouvée est utilisée dans le JSON-LD (pas un doublon comme le redoutait l'audit — la logique de `blog.ts` s'arrête au `faqEnd` correctement). Le risque réel n'est donc pas un double schema, mais plutôt qu'une **deuxième section de FAQ légitime dans l'article soit invisible pour Google** (elle existe visuellement sur la page rendue, mais n'alimente pas le JSON-LD). À vérifier sur cet article spécifique.

## Maillage interne (internal linking) — trois mécanismes distincts

1. **`RelatedArticles` (manuel)** — chaque université/ville a un champ `relatedArticles: {slug,title}[]` renseigné à la main par l'auteur, rendu par `components/blog/RelatedArticles.tsx`. Contrôle éditorial total, mais demande une maintenance manuelle (aucune automatisation, aucune vérification que les slugs référencés existent toujours).
2. **Cluster (semi-automatique)** — `getClusterArticles(cluster, excludeSlug)` retourne tous les articles du même cluster que l'article courant (`CLUSTER_MAP`), rendu par `components/blog/ClusterLinks.tsx` en fin d'article. C'est la mécanique qui garantit qu'un article sur "visa Maroc" pointe automatiquement vers "TCF Maroc", "Campus France Maroc", etc. — tant que le cluster est bien renseigné dans le frontmatter/`CLUSTER_MAP`.
3. **"Related posts" combiné (`getRelatedPosts`)** — logique en cascade : d'abord les articles du même cluster, puis (si pas assez) les articles de la même `category`, puis n'importe quel autre article, jusqu'à combler `count` (par défaut 5, appelé avec `count=3` dans la page article). Affiché en bloc "Articles similaires" en bas de page.

**Absence de vérification d'intégrité** : aucun de ces trois mécanismes ne valide au build-time que les slugs référencés existent réellement (pas de script de lint de contenu). L'audit SEO de juin a documenté 11 "articles orphelins" (0 lien entrant) sur les 49 d'alors — vu que 16 articles ont été ajoutés depuis sans qu'on sache si ce problème a été retraité, **il est recommandé de relancer une analyse de maillage interne fraîche** plutôt que de se fier aux chiffres de juin (voir `08`).

## Sitemap (`app/sitemap.ts`)

Généré dynamiquement via l'API native `MetadataRoute.Sitemap` de Next.js (pas de `next-sitemap` package, pas de génération statique en amont). Priorités hiérarchisées à la main :

- Homepage : 1.0
- `/blog` (index) : 0.95
- Pages pays piliers (Maroc/Algérie/Sénégal) : 0.95 ; (Tunisie/Côte d'Ivoire/Cameroun) : 0.9
- `/universites`, `/villes` (index), outils (simulateur/calendrier/comparer/checklist), `/stats` : 0.9
- Fiches université/ville individuelles : 0.85
- Pages FAQ : 0.9–0.95
- Articles blog : 0.8 si dans `HIGH_PRIORITY_SLUGS` (une liste explicite de ~31 slugs jugés stratégiques — clusters TCF Maroc, visa, logement/CAF, médecine, écoles privées/arnaques), sinon 0.7
- `/a-propos` : 0.8, `/contact` : 0.5

`lastModified` utilise `post.updatedDate` en priorité, sinon `post.date` — donc **il est important de toujours renseigner/mettre à jour `updatedDate` dans le frontmatter** quand un article est corrigé, sous peine que Google perçoive un contenu "jamais mis à jour" même après correction.

**Ce qui manque par rapport au skill `dalili-master` [ASPIRATIONNEL]** : "image sitemap" et "RSS" sont mentionnés dans le skill mais **n'existent pas dans le code** — pas de flux RSS (`/feed.xml` ou équivalent), pas de sitemap d'images dédié (`<image:image>` dans le XML). Une opportunité GEO/SEO facile à ajouter (les flux RSS sont une source directement ingérée par certains agents IA et agrégateurs).

**Fichiers statiques legacy** : `public/sitemap.xml` et `public/robots.txt` existent en tant que fichiers statiques dans `public/`, **en parallèle** de `app/sitemap.ts`/`app/robots.ts` qui sont les versions dynamiques réellement servies (Next.js App Router priorise les route handlers `app/sitemap.ts`/`app/robots.ts` sur les fichiers statiques de même nom dans `public/` s'ils sont tous les deux présents — à vérifier, mais en pratique c'est un doublon mort qui peut prêter à confusion pour quiconque édite le mauvais fichier en pensant que c'est le bon).

## GEO (Generative Engine Optimization) — ce qui est réellement construit

Le GEO est le domaine où le site est le plus en avance sur ses concurrents traditionnels, et où le fondateur a investi consciemment (commit `125852a : feat: GEO optimisation — pages FAQ autoritaires, stats vérifiées, schema Organization, KeyFacts dans articles, page /stats`).

### 1. Pages FAQ dédiées, autoritaires, sourcées (`/faq/*`)

Cinq pages (`visa-etudiant-france`, `logement-etudiant-france`, `budget-etudiant-france`, `campus-france`, `arrivee-france-etudiant`) qui ne sont PAS des articles de blog classiques mais des pages Q&R pures, denses (l'exemple `visa-etudiant-france` contient 20 questions), avec un champ `source:` affiché après chaque réponse (ex. "Source : Service-public.fr"). C'est le format que les moteurs IA génératifs (Perplexity, Google AI Overview, ChatGPT Search) préfèrent citer, car la réponse est auto-suffisante, courte, sourcée, et structurée en JSON-LD `FAQPage`.

### 2. Page `/stats` comme "Dataset" citable

`app/stats/page.tsx` définit un schema `Dataset` avec un `dateModified` explicite et des `keywords` — présente des tableaux de données chiffrées par ville (budget brut/net, CAF, nombre d'étudiants, nombre d'universités). C'est conçu spécifiquement pour être la page que cite un modèle IA quand on lui demande "quel est le budget étudiant à Lyon" — une page de référence factuelle plutôt qu'un article narratif.

### 3. Composant `KeyFacts` — extraction facile pour un LLM

`components/blog/KeyFacts.tsx` est un encart visuel "📌 Points clés" injectable dans le MDX (jusqu'à 5 faits `f1`...`f5` + un champ `source`), conçu pour présenter les chiffres essentiels d'un article de façon isolée et scannable — à la fois pour l'utilisateur humain qui scanne rapidement, et pour un moteur IA qui a besoin d'extraire des faits atomiques d'une page.

### 4. Le pattern "What/Who/Why/Next" — **[ASPIRATIONNEL, partiellement observable]**

Le skill exige que chaque page réponde explicitement à "Qu'est-ce que c'est ? Pour qui ? Pourquoi c'est utile ? Que faire ensuite ?". Dans le contenu réel, cette structure est présente **implicitement** dans les introductions d'articles (souvent : contexte du pays → statistique → "ce guide couvre X, Y, Z" → CTA en fin d'article vers `WaitlistCTA`), mais ce n'est pas une section formellement balisée/nommée comme telle. Un successeur qui voudrait industrialiser le GEO pourrait envisager de rendre ces 4 réponses plus explicites et structurées (ex. un encart "TL;DR" en tête d'article), mais ce n'est pas déjà fait.

### 5. JSON-LD `Organization.knowsAbout` (root layout)

Liste explicite des sujets de compétence de Dalili ("Visa étudiant France", "Campus France CEF", "Logement étudiant CROUS France", "CAF étudiant étranger", "Compte bancaire étudiant France", "TCF DELF préparation", "OFII validation visa étudiant", "Sécurité sociale étudiante France") — un signal d'entité (entity SEO) qui aide Google/les moteurs IA à associer la marque "Dalili" à ces sujets précis dans leur knowledge graph interne.

## "Knowledge Graph" — la vérité honnête

**Il n'existe pas de knowledge graph formel dans ce projet** — ni base de données de type graphe, ni fichier de relations d'entités explicite, ni ontologie déclarée. Ce qui s'en approche le plus, dans le code réel :

- `CLUSTER_MAP` (relations implicites article↔article via un cluster commun)
- `relatedArticles` codés en dur sur chaque université/ville (relations explicites mais manuelles)
- Le JSON-LD `Organization.knowsAbout` (une liste plate de sujets, pas un graphe de relations)
- Les références croisées ville↔université (`city.universities[].slug`, avec le problème de liens morts documenté en section 03)

**Pour un successeur qui voudrait vraiment construire un knowledge graph** (ambition plausible et cohérente avec le GEO) : la fondation existe déjà sous forme de données structurées typées (`University`, `City`, `PostMeta` + `cluster`), il "suffirait" de formaliser les relations (université↔ville↔pays↔article↔cluster) dans un graphe explicite (même un simple objet JS de relations, pas besoin d'une vraie base de données graphe) et de l'exposer en JSON-LD via des types plus riches (`about`, `mentions`, `isPartOf`) sur chaque page. C'est un chantier non commencé, une opportunité claire pour la roadmap (voir `08`).

## AEO (Answer Engine Optimization) — conventions de structuration

- **Checklists** : présentes dans le contenu Markdown sous forme de listes à puces standard (pas de composant dédié "Checklist" détecté dans `components/blog/`) — donc pas de balisage spécial, juste des `<ul>` stylées par `MdxComponents.jsx`.
- **Tableaux** : très utilisés (comparatifs de frais, classements, budgets) — stylés par le composant `table` custom de `MdxComponents.jsx`, avec `overflow-x: auto` pour le responsive (bonne pratique déjà en place).
- **Callout** : composant `Callout` (info/warning/success, avec icônes 💡⚠️✅) exposé aux fichiers MDX pour mettre en avant un avertissement ou un conseil important — utilisé pour les mises en garde ("attention aux arnaques", "délai strict").
- **Résumés courts / réponses directes** : le champ `excerpt` du frontmatter sert à la fois de meta description de secours et de résumé affiché sur les cards de l'index blog — mais il n'y a pas de "résumé TL;DR" visible en tête de CHAQUE article (uniquement le paragraphe de description sous le titre, qui fait cet office de façon moins formalisée).

## Ce que le SEO audit existant (`seo-audit-report.md`, 22 juin 2026) documente — statut à réévaluer

Ce fichier, présent à la racine du repo, est un audit très détaillé (cannibalisation de mots-clés, titles/descriptions hors norme, articles orphelins, frontmatter incomplet) mené quand le site comptait 49 articles. **Il date d'un mois avant cette transmission et le site en compte 65 aujourd'hui** — plusieurs actions qu'il recommandait ont probablement déjà été traitées (les commits `957ecfa`, `bd1b725`, `ce2a7c9`, `da459e5` montrent des vagues successives de corrections de titres/descriptions basées sur Google Search Console). **Ne pas traiter ce rapport comme un état actuel** — il faut le relire comme un historique de ce qui a été trouvé à un instant T, puis relancer un audit frais (même méthodologie : grep les longueurs de title/description, compter les liens entrants/sortants par article) pour obtenir un état à jour avant de prioriser une nouvelle vague de corrections. Le détail complet de ce rapport est conservé dans le fichier lui-même (`seo-audit-report.md`) — pas dupliqué ici pour éviter la redondance.

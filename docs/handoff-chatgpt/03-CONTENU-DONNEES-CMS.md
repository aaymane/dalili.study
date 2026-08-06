# 03 — Architecture des données, taxonomie et "CMS"

## Il n'y a pas de CMS au sens classique — à comprendre en premier

Il n'existe **aucun CMS headless** (pas de Contentful, Sanity, Strapi, Notion-as-CMS, etc.) et **aucune base de données de contenu** (Supabase ne stocke QUE la table `waitlist` — voir `06-OUTILS-FEATURES.md`). Le contenu vit intégralement **dans le repo git**, sous deux formes différentes selon le type d'entité :

1. **Blog** → fichiers `.mdx` individuels dans `content/blog/`, un fichier par article, avec frontmatter YAML.
2. **Universités et Villes** → objets TypeScript codés en dur dans `lib/universities.ts` et `lib/cities.ts` (données structurées : chiffres, listes, avis courts), **complétés optionnellement** par un fichier `.mdx` de contenu long-form dans `content/universites/*.mdx` ou `content/villes/*.mdx` (texte narratif additionnel, chargé et compilé à la volée si le fichier existe — voir `app/universites/[slug]/page.tsx` ligne ~131 : `fs.existsSync(mdxPath)`).

Cette architecture à deux niveaux (données structurées TS + prose MDX optionnelle) permet d'avoir des données fiables et facilement réutilisables (dans les tableaux, le schema.org, le simulateur, le comparateur) SANS dépendre du parsing d'un Markdown libre pour les chiffres — un choix judicieux : les chiffres critiques (frais de scolarité, budget) sont dans des champs typés `number`, pas noyés dans du texte.

## Workflow de "publication" d'un article de blog (le "CMS" en pratique)

1. **Recherche concurrentielle obligatoire** avant d'écrire (règle imposée par le fondateur — voir mémoire `feedback-research-first`, détaillée dans `07-CLAUDE-CODE-WORKFLOW.md`) : identifier ce que Campus France / Studyrama / L'Étudiant / Diplomeo ratent sur le sujet.
2. **Vérification de chaque chiffre sur une source officielle** avant de l'écrire (règle imposée — mémoire `feedback-data-verification`, voir `07`). Sources de référence utilisées dans le contenu réel : `ameli.fr`, `caf.fr`, `service-public.fr`, `france-visas.gouv.fr`, `campusfrance.org`, `legifrance.gouv.fr`, `cvec.etudiant.gouv.fr`, MESR (`enseignementsup-recherche.gouv.fr`).
3. Créer un fichier `content/blog/{slug}.mdx` avec le frontmatter complet (schéma exact ci-dessous).
4. Écrire le corps en Markdown, avec une section `## FAQ` (ou `### FAQ`) en fin d'article — c'est cette section précise qui alimente automatiquement le schema.org `FAQPage` (voir `04-SEO-GEO-AEO.md`, extraction par regex dans `lib/blog.ts`).
5. Ajouter le slug à `CLUSTER_MAP` dans `lib/blog.ts` pour le rattacher à un cluster géographique/thématique (sinon il n'a pas de "related articles" automatiques par cluster).
6. Ajouter une entrée thumbnail (`public/images/blog/{nom}.{webp,png}`) référencée dans le frontmatter.
7. `git commit` + push → déploiement Vercel automatique. Le sitemap (`app/sitemap.ts`) régénère automatiquement l'URL au prochain build car il lit `getAllPosts()` dynamiquement — **aucune action manuelle de sitemap n'est requise**.

**Mise à jour d'un article existant** : éditer directement le `.mdx`, mettre à jour le champ `updatedDate` du frontmatter (affiché à l'utilisateur : "Mis à jour le [date]" et utilisé dans le JSON-LD `dateModified`). L'historique git récent montre que c'est une pratique bien suivie (chaque commit `fix:` de données obsolètes bump le `updatedDate`).

**Il n'y a pas de workflow de "validation"/review formel** (pas de pull request obligatoire visible dans les commits, pas de statut brouillon/publié dans le frontmatter) — le fondateur commit et pousse directement sur `main`. C'est cohérent avec un projet solo.

## Schéma exact du frontmatter blog (`PostMeta`, `lib/blog-client.ts`)

```ts
export interface PostMeta {
  slug: string;            // dérivé du nom de fichier, pas dans le frontmatter
  title: string;
  description: string;
  date: string;             // ISO "2026-06-18"
  updatedDate?: string;
  category: string;         // doit correspondre à une clé de CATEGORY_COLORS
  readTime: string;         // ⚠️ DOIT être une string "11 min", pas un nombre (voir bug connu dans 08)
  excerpt: string;
  author: string;
  ogImage?: string;
  thumbnail?: string;
  cluster?: string;         // doit correspondre à une clé de CLUSTER_DEFINITIONS / CLUSTER_MAP
}
```

Exemple réel (`content/blog/visa-etudiant-france-senegal-2026.mdx`) :

```yaml
---
title: "Visa étudiant France depuis le Sénégal 2026 : guide complet"
description: "Procédure visa étudiant France pour les Sénégalais en 2026 : Campus France Dakar, consulat, documents, bourses et calendrier complet étape par étape."
date: "2026-06-18"
updatedDate: "2026-06-18"
category: "Visa"
readTime: "11 min"
excerpt: "Le Sénégal affiche l'un des meilleurs taux d'acceptation visa France en Afrique..."
author: "Équipe Dalili"
ogImage: "/og/visa-etudiant-france-senegal-2026.jpg"
thumbnail: "/images/blog/senegal-visa.png"
cluster: "senegal"
---
```

## Taxonomie du blog — deux systèmes de classification qui coexistent

### 1. `category` — 10 catégories (`CATEGORY_COLORS`, `lib/blog-client.ts`)

Chaque catégorie a une couleur d'accent (utilisée pour les pastilles, bordures, glow des cards) : `Banque` (vert `#22C55E`), `Logement` (orange `#EFB370`), `Visa` (bleu `#4d8fff`), `Permis` (violet `#7C3AED`), `Emploi` (ambre `#F59E0B`), `Vie étudiante` (cyan `#06B6D4`), `Finances` (vert émeraude `#10B981`), `Démarches` (violet `#A855F7`), `Santé` (rose/rouge `#F43F5E`), `CAF` (magenta `#E879F9`).

### 2. `cluster` — 15 clusters (`CLUSTER_DEFINITIONS`, `CLUSTER_MAP`)

Deux types de clusters mélangés dans une même liste plate : des clusters **thématiques** (`visa`, `logement`, `banque`, `aides`, `emploi`, `vie-etudiante`, `sante`, `demarches`, `visa-campus-france`, `medecine`) et des clusters **géographiques par pays d'origine** (`algerie`, `senegal`, `maroc`, `tunisie`, `liban`). Un article n'a qu'**un seul** cluster (`CLUSTER_MAP: Record<string,string>` — mapping 1:1 slug→cluster), donc un article très spécifique à un pays ET à un thème (ex. "bourses pour étudiants sénégalais") est rangé dans le cluster pays (`senegal`), pas dans le cluster thème (`aides`).

**Pourquoi deux systèmes différents ?** — `category` sert à l'affichage visuel (couleur, pastille, filtre sur l'index blog) ; `cluster` sert exclusivement au maillage interne automatique (voir `04-SEO-GEO-AEO.md`, section maillage interne) via `getClusterArticles()` et `getRelatedPosts()`. Ce ne sont pas redondants, mais un successeur pourrait confondre les deux — il faut les traiter comme deux axes indépendants.

## Modèle de données — Universités (`lib/universities.ts`)

```ts
export interface University {
  slug: string; name: string; city: string; region: string; type: string;
  students: number; internationalStudents: number;
  tuitionLicence: number; tuitionMaster: number;   // ⚠️ voir incohérence dans 08
  popularPrograms: string[];
  costCrous: string; costPrivate: string; costTransport: string; costFood: string;
  monthlyBudgetMin: number; monthlyBudgetMax: number;
  pros: string[]; cons: string[]; avis: string;      // "avis" = paragraphe honnête, inclut toujours les points faibles
  websiteUrl: string; crousUrl: string; campusFranceUrl: string;
  relatedArticles: { slug: string; title: string }[];
  thumbnail: string;
}
```

**14 universités actuellement documentées** : Bordeaux, Nantes, Lille, Sorbonne (Paris), Lyon 1, Toulouse III Paul Sabatier, Montpellier, Strasbourg, Aix-Marseille, Côte d'Azur (Nice), Rennes, Grenoble Alpes, Clermont Auvergne, Bourgogne (Dijon). Ordre d'ajout historique visible : les 9 premières (Bordeaux → Aix-Marseille) partagent les mêmes tarifs `tuitionLicence: 2770` (tarifs 2019, aujourd'hui obsolètes), les 5 dernières ajoutées (Côte d'Azur, Rennes, Grenoble, Clermont, Bourgogne) ont déjà les tarifs à jour `2895`.

Chaque fiche université a en plus un objet `UNI_SEO` (dans `app/universites/[slug]/page.tsx`, pas dans `lib/`) contenant `title`/`description`/`ogDescription` sur-mesure écrits à la main pour le SEO — **dupliqué manuellement pour chacune des 14 universités**, pas généré depuis un template (voir remarque dette technique dans `08`).

## Modèle de données — Villes (`lib/cities.ts`)

```ts
export interface City {
  slug: string; name: string; region: string; tagline: string;
  population: number; students: number;
  costCrous: string; costStudio: string; costColoc: string; costTransport: string;
  monthlyBudgetMin: number; monthlyBudgetMax: number;
  monthlyBudgetBrut: number; monthlyBudgetNet: number;   // brut = sans aides, net = après CAF/RU/CSS
  cafEstimee: number; economieRU: number; economieTransport: number;
  universities: { name: string; slug: string }[];         // référence par nom+slug, PAS de foreign key réelle vers UNIVERSITIES
  neighborhoods: { name: string; description: string }[];  // 3 quartiers détaillés par ville
  pros: string[]; cons: string[]; avis: string;
  crousUrl: string; prefectureUrl: string; transportUrl: string; transportName: string; cafUrl: string;
  relatedArticles: { slug: string; title: string }[];
  thumbnail: string;
}
```

**14 villes documentées** : Bordeaux, Paris, Nantes, Lyon, Toulouse, Montpellier, Strasbourg, Lille, Marseille, Nice, Rennes, Grenoble, Clermont-Ferrand, Dijon.

**Bug vérifié (pas une hypothèse)** : le champ `universities` d'une fiche ville référence des universités par `slug`, et `app/villes/[slug]/page.tsx` génère systématiquement un `<Link href={"/universites/" + uni.slug}>` cliquable pour chaque entrée, sans vérifier que la fiche existe. Or, sur les **52 références** d'universités/écoles listées à travers les 14 fiches villes, **38 pointent vers un slug qui n'existe PAS dans `UNIVERSITIES`** (`lib/universities.ts` n'en contient que 14) — ex. `sciences-po-bordeaux`, `kedge-business-school`, `sciences-po-paris`, `universite-paris-cite`, `audencia-nantes`, `universite-lyon-2`, `insa-strasbourg`, `centrale-lille`, etc. Comme `app/universites/[slug]/page.tsx` appelle `notFound()` quand le slug est absent, **ces 38 liens mènent aujourd'hui à une page 404** sur le site en production. C'est traité en détail avec la liste complète des 38 slugs dans `08-DETTE-TECHNIQUE-ROADMAP-CRITIQUE.md` (section "Bugs vérifiés en profondeur") — c'est le problème technique le plus concret et le plus prioritaire identifié pendant cet audit, car il touche du contenu déjà indexable par Google sur les 14 pages villes.

## Le score de comparaison des villes (`lib/comparer-scores.ts`)

Système indépendant, à 5 critères notés sur 5 (increments de 0.5) : `budget`, `emploi`, `communaute` (taille/intégration de la communauté maghrébine/africaine), `meteo`, `transport`. Ces scores sont **des jugements qualitatifs assumés par l'équipe Dalili**, pas calculés depuis une source externe — à traiter comme une opinion éditoriale documentée, pas une donnée officielle (contrairement aux chiffres de `universities.ts`/`cities.ts` qui eux doivent être sourcés). La fonction `recommander(selectedSlugs)` retourne simplement le slug avec le score total (somme des 5 critères) le plus élevé parmi une sélection.

## Slugs — conventions observées

- Blog : `{sujet-descriptif}-{public-cible-optionnel}-{année-optionnelle}`, ex. `visa-etudiant-france-senegal-2026`, `budget-mensuel-etudiant-etranger-france-2026`. Toujours en minuscules, tirets, sans accents.
- Universités : `universite-de-{ville}` ou nom propre (`sorbonne-universite`, `aix-marseille-universite`).
- Villes : `etudier-a-{ville}` — convention 100% cohérente sur les 14 entrées.
- Pays : `etudier-en-france-depuis-{pays}` (note : Maroc est irrégulier — `etudier-en-france-depuis-le-maroc` avec l'article "le", contrairement aux autres pays qui n'ont pas d'article — à connaître si on génère des liens par convention automatique plutôt que par référence explicite).

**Un renommage de slug existant est arrivé au moins une fois** (`visa-etudiant-france-senegal-procedure` → `visa-etudiant-france-senegal-2026`, géré par un redirect 301 dans `vercel.json`). C'est le patron à répliquer si un futur renommage est nécessaire — ne jamais renommer un slug déjà indexé sans redirect 301 correspondant.

## Images / miniatures

- `content/miniature/` : dossier de travail contenant les images sources générées (souvent via ChatGPT/DALL-E, noms de fichiers en français avec accents et espaces — ex. `"campusfrance senegal guide d'inscription.png"`) — probablement un dossier de brouillon/staging, pas directement servi par le site.
- `public/images/blog/`, `public/images/villes/` (implicite depuis les thumbnails `/images/villes/*.webp`), `public/images/universites/` : les images réellement servies, converties en `.webp` pour les plus anciennes, mélange `.webp`/`.png` pour les plus récentes (l'audit SEO signale ce point — voir `04`).
- `content/université/` (avec accent, dossier distinct de `content/universites/` sans accent) : contient 4 images (`Sorbonne.png`, `bordeaux.png`, `lille.png`, `nantes.png`) — nom de dossier incohérent avec le reste du projet (accent + apparente redondance avec `public/images/universites/`), probablement un reliquat à nettoyer ou clarifier.

## Résumé — ce qu'un successeur doit retenir sur le contenu

1. Éditer un article = éditer un fichier `.mdx`, pas une interface d'admin.
2. Toujours vérifier les chiffres sur une source officielle avant de les écrire ou de les modifier — c'est une règle non négociable du fondateur, documentée dans la mémoire Claude Code.
3. `category` (affichage) et `cluster` (maillage) sont deux taxonomies indépendantes à maintenir séparément pour chaque nouvel article.
4. Les données structurées (universités/villes) sont dupliquées à trois endroits potentiels pour un même chiffre : l'objet TS (`lib/`), le fichier `UNI_SEO`/`CITY_SEO` (dans la page), et le `.mdx` de contenu long — **modifier un chiffre obsolète nécessite de vérifier ces trois emplacements**, comme le montre l'historique des commits `fix:` de juillet 2026 qui ont dû "sweeper" 20 fichiers pour une seule correction de tarif.

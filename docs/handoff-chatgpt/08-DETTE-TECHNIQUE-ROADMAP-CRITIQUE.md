# 08 — Dette technique, ce qu'il ne faut jamais casser, analyse critique et priorités

## Bugs vérifiés en profondeur pendant cet audit (pas des hypothèses — code lu et croisé)

### 🔴 Bug #1 — 38 liens morts vers `/universites/[slug]` depuis les 14 pages villes

**Vérifié par script** (comparaison automatique des slugs référencés vs slugs existants). `app/villes/[slug]/page.tsx` affiche, pour chaque ville, une carte cliquable vers `/universites/{slug}` pour chaque entrée de `city.universities`. Sur 52 références au total à travers les 14 fiches villes, **38 pointent vers un slug absent de `UNIVERSITIES`** (`lib/universities.ts` n'en contient que 14). Comme la page université fait `if (!uni) notFound()`, ces 38 liens mènent aujourd'hui à une **page 404 réelle en production**, cliquable par n'importe quel visiteur et crawlable par Google depuis chaque page ville.

Liste complète des 38 slugs cassés : `agrosup-dijon`, `audencia-nantes`, `bsb-dijon`, `centrale-lille`, `centrale-marseille`, `centrale-mediterranee`, `edhec-business-school`, `edhec-nice`, `em-strasbourg`, `em-toulouse`, `esc-clermont`, `grenoble-em`, `grenoble-inp`, `hear-strasbourg`, `ieseg-management`, `inpt-toulouse`, `insa-rennes`, `insa-strasbourg`, `isae-supaero`, `isima-clermont`, `kedge-business-school`, `kedge-marseille`, `montpellier-business-school`, `sciences-po-aix`, `sciences-po-bordeaux`, `sciences-po-grenoble`, `sciences-po-lille`, `sciences-po-lyon`, `sciences-po-paris`, `sciences-po-rennes`, `sciences-po-strasbourg`, `supagro-montpellier`, `universite-jean-jaures`, `universite-lyon-2`, `universite-paris-cite`, `universite-paul-valery`, `universite-rennes-2`, `universite-toulouse-capitole`.

**Deux corrections possibles, pas mutuellement exclusives** : (a) court terme — dans `app/villes/[slug]/page.tsx`, ne rendre le lien cliquable que si le slug existe dans `UNIVERSITIES` (fallback : texte non cliquable, ou lien externe vers le site de l'école), ce qui élimine le 404 immédiatement ; (b) moyen terme — créer les 38 fiches manquantes (ou au moins les plus stratégiques : Sciences Po de chaque ville, écoles d'ingénieurs type INSA/Centrale, qui sont des entités à fort volume de recherche), ce qui transforme un bug en opportunité de contenu.

### 🔴 Bug #2 — Incohérence des frais de scolarité dans `lib/universities.ts`

Les commits `fe2461f` et `67023d2` (11 juillet 2026) ont corrigé les tarifs obsolètes (2 770€/3 770€, tarifs 2019) vers les tarifs réels 2025-2026 (2 895€ Licence / 3 941€ Master / 397€ Doctorat, sourcés sur `campusfrance.org`/`service-public.gouv.fr`) — mais **uniquement dans le contenu MDX** (`content/universites/*.mdx`, `content/villes/*.mdx`, 2 articles de blog) et dans `public/press-kit.md`. **Les objets structurés `lib/universities.ts` n'ont pas été touchés par ce sweep** : les 9 premières universités ajoutées (Bordeaux, Nantes, Lille, Sorbonne, Lyon 1, Toulouse III, Montpellier, Strasbourg, Aix-Marseille) affichent encore `tuitionLicence: 2770, tuitionMaster: 3770` dans leur tableau "Informations clés" (`app/universites/[slug]/page.tsx`, section "Frais inscription"), pendant que les 5 dernières ajoutées (Côte d'Azur, Rennes, Grenoble, Clermont, Bourgogne) ont déjà `2895`/`3941`. Le site affiche donc **aujourd'hui, simultanément, deux chiffres différents pour le même frais officiel** selon la page visitée — exactement le type d'incohérence que la règle "vérifier chaque chiffre" (voir `07`) est censée empêcher, mais qui s'est glissée parce que la correction de juillet a traité le contenu narratif (MDX) sans remonter à la source de données structurées (TS) qui alimente pourtant le tableau affiché sur la même page.

**Correction** : mettre à jour `tuitionLicence`/`tuitionMaster` (et ajouter un champ `tuitionDoctorat` s'il n'existe pas — actuellement absent du type `University`) sur les 9 entrées concernées, avec la même valeur `2895`/`3941`/`397` déjà utilisée ailleurs. C'est un correctif de quelques minutes une fois localisé — l'essentiel du travail était de le trouver, ce qui est fait.

### 🟠 Bug #3 — `/api/test-email` exposé publiquement, sans authentification, avec fuite partielle de clé API

`app/api/test-email/route.ts` répond à un simple `GET` (aucun token, aucune vérification), **envoie un vrai email via Resend** à `boyayman388@gmail.com` à chaque appel, et retourne dans le JSON de réponse **les 12 premiers caractères de `RESEND_API_KEY`** (`apiKeyPrefix: apiKey.slice(0,12)+'...'`) ainsi que le statut des domaines Resend configurés. `robots.txt` bloque `/api/` du crawl, mais **cela n'empêche en rien un accès direct par URL** — n'importe qui connaissant ou devinant `dalili.study/api/test-email` peut déclencher l'envoi d'emails et obtenir un fragment de secret. Impact réel limité (12 caractères d'une clé Resend ne suffisent probablement pas à la reconstituer), mais c'est une mauvaise pratique à corriger rapidement : soit protéger la route par le même `ADMIN_TOKEN` que `/api/admin/*`, soit la supprimer si elle n'est plus utile au débogage, soit au minimum retirer le fragment de clé de la réponse JSON.

### 🟡 Bug potentiel non confirmé — vérifier la double section FAQ

L'audit SEO de juin signalait que `campusfrance-maroc-guide-complet` contient deux sections matchant `## FAQ`. La logique de `extractFaqItems()` (lue en détail dans `04-SEO-GEO-AEO.md`) s'arrête au premier `## ` suivant le début de la FAQ trouvée — donc le risque réel n'est probablement pas un double schema JSON-LD (comme le redoutait l'audit) mais plutôt qu'une deuxième section FAQ légitime soit ignorée par le schema tout en restant visible sur la page. **Non re-vérifié ligne à ligne dans cet audit** (le fichier MDX de cet article n'a pas été relu en entier) — à confirmer avant d'agir.

### Bug déjà corrigé, ne pas re-traiter

Le `readTime` en format numérique (`readTime: 9` au lieu de `"9 min"`) signalé par l'audit SEO de juin sur 10 articles a été **vérifié comme corrigé** pendant cet audit (les 10 fichiers cités ont bien `readTime: "X min"` en string aujourd'hui). Ne pas relancer cette correction — elle est déjà faite.

---

## Ce qu'il ne faut JAMAIS modifier sans réflexion approfondie (règles et conventions établies)

1. **Ne jamais renommer un slug existant sans créer le redirect 301 correspondant** dans `vercel.json` — c'est déjà la pratique suivie (voir le redirect `visa-etudiant-france-senegal-procedure` → `visa-etudiant-france-senegal-2026`). Un slug déjà indexé par Google a de l'autorité SEO ; un renommage sans redirect détruit cette autorité et casse tous les liens externes déjà pointés dessus.
2. **Ne jamais écrire un chiffre réglementaire (frais, plafonds, montants CAF, délais visa) sans vérification sur une source officielle** — règle non négociable du fondateur, documentée dans la mémoire Claude Code (`feedback-data-verification`). Les corrections répétées de juillet 2026 (décret du 19 mai 2026 sur les exonérations) montrent que la réglementation change réellement et que le contenu doit être traité comme périssable, pas statique.
3. **Ne jamais publier un article sans recherche concurrentielle préalable** — règle imposée après le rejet d'un article écrit sans cette étape (mémoire `feedback-research-first`).
4. **Ne jamais migrer le style inline vers Tailwind "pour la cohérence"** sans demande explicite — c'est un choix architectural assumé (voir `02`), pas une dette accidentelle à rembourser de sa propre initiative.
5. **Ne jamais désactiver `compiler.removeConsole` en production** sans nettoyer d'abord les nombreux `console.log` de debug (avec emojis) laissés dans les Route Handlers — sinon ils redeviennent visibles publiquement dans les logs Vercel/navigateur.
6. **Ne jamais casser la structure `## FAQ` → question en gras ou en sous-titre finissant par `?` → paragraphe de réponse** dans un article — c'est le contrat implicite dont dépend `extractFaqItems()` pour générer le schema `FAQPage`. Toute génération de contenu (humaine ou IA) doit respecter ce pattern exactement.
7. **Ne jamais oublier de mettre à jour `updatedDate`** dans le frontmatter d'un article corrigé — c'est ce qui alimente `dateModified` (JSON-LD) et `lastModified` (sitemap), et donc le signal de fraîcheur envoyé à Google.
8. **Ne jamais commit de secrets** — les 7 variables d'environnement listées en `02-ARCHITECTURE-TECHNIQUE.md` ne doivent jamais apparaître en clair dans un commit ou dans ce dossier de documentation.
9. **Le domaine canonique est `dalili.study`, jamais `www.dalili.study` ni `dalili-waitlist.vercel.app`** — ces deux variantes sont explicitement redirigées en 301 ; ne jamais construire de lien interne ou de configuration qui pointerait vers l'une d'elles.
10. **La homepage annonce une app mobile "Bientôt disponible"** — ne pas supprimer ce message/badge sans confirmation du fondateur, même si l'app n'a pas de date de sortie documentée ; c'est une promesse publique active.

---

## Dette technique — inventaire complet

### Architecture / code

- `Playwright` installé (devDependency) mais **aucun test, aucune config** — soit l'implémenter réellement, soit le retirer du `package.json` pour ne pas laisser croire à une couverture de test inexistante.
- **Aucune CI/CD** (`.github/workflows` absent) — le déploiement Vercel se fait probablement sans étape de vérification automatisée (lint, build, tests) avant mise en prod.
- `app/fonts/GeistVF.woff` et `GeistMonoVF.woff` sont commités dans git mais jamais chargés par `layout.tsx` (qui utilise Montserrat/Bebas Neue/DM Sans) — fichiers morts à supprimer.
- `tailwind.config.ts` référence une police `open-sans` qui n'est chargée nulle part — configuration obsolète depuis un changement de police non répercuté.
- `dalili-bg` (`#050914`, Tailwind) ne correspond pas au fond réel utilisé (`#010510`, `globals.css`/`layout.tsx`) — incohérence mineure de token de couleur.
- `public/sitemap.xml` et `public/robots.txt` (fichiers statiques) coexistent avec `app/sitemap.ts`/`app/robots.ts` (dynamiques) — source de confusion potentielle pour un futur éditeur qui modifierait le mauvais fichier en pensant agir sur le bon.
- `content/université/` (dossier avec accent, 4 images) semble redondant avec `public/images/universites/` (sans accent) — à clarifier/nettoyer.
- Mélange `.jsx`/`.tsx` dans `components/` — assumé (voir `02`) mais à documenter explicitement dans un futur `CONTRIBUTING.md` si l'équipe grandit, pour qu'un nouveau contributeur comprenne que ce n'est pas une migration en cours oubliée.
- Nombreux `console.log` de debug avec emojis dans les Route Handlers (`simulateur`, `test-email`) — invisibles en prod grâce à `removeConsole`, mais polluent le code source et les logs en développement local.
- `supabase/schema.sql` ne semble pas refléter le schéma complet réel (colonnes `simulateur_data` etc. utilisées dans le code mais absentes du fichier SQL versionné) — risque de dérive si ce fichier est traité comme source de vérité pour recréer la base ailleurs. Vérifier avec `mcp__supabase__list_tables` avant toute réplication d'environnement.

### SEO / contenu

- L'audit SEO existant (`seo-audit-report.md`) date d'un mois et 16 articles ont été ajoutés depuis — **relancer un audit frais** (longueur titre/description, articles orphelins, cannibalisation) plutôt que de se fier aux chiffres de juin.
- `UNI_SEO`/`CITY_SEO` (titres/descriptions sur-mesure) sont dupliqués à la main dans chaque `page.tsx`, un objet par entité — aucune génération depuis un template, donc 28 titres/descriptions à maintenir manuellement en cohérence à chaque changement de convention (ex. si demain on décide de raccourcir tous les titres à 60 caractères, il faut éditer les 28 un par un).
- Pas de hreflang (non urgent tant que le site reste mono-langue française).
- Pas de flux RSS ni de sitemap d'images, pourtant mandatés par le skill `dalili-master` **[ASPIRATIONNEL non fait]**.
- Pages pays (`/pays/*`) n'ont qu'un schema `BreadcrumbList` — pas de `FAQPage` ni `Article`/`WebPage`, alors qu'elles contiennent des FAQ (gain "rich snippet" facile déjà signalé par l'audit de juin, toujours valable).
- Fiches université utilisent `EducationalOrganization` au lieu du `CollegeOrUniversity` mandaté par le skill — écart mineur mais réel.
- `project-overview.md` (mémoire Claude Code) mentionne encore "23 articles" — à rafraîchir.

### Produit / UX

- Le scoring du Comparateur de villes (`CITY_SCORES`) est figé, pondération égale des 5 critères, pas personnalisable par l'utilisateur selon ses priorités individuelles.
- `data/emails.json` est un mécanisme de capture legacy remplacé par Supabase — fichier local mort, correctement ignoré par git, mais à supprimer du disque si encore présent pour éviter toute confusion.
- Le dashboard `/admin` utilise un unique token statique partagé — ne scale pas à une équipe (pas de rôles, pas de révocation individuelle, pas de log d'audit "qui a fait quoi").

### Sécurité

- `/api/test-email` non protégé (voir Bug #3 ci-dessus — le point de sécurité le plus concret de cet audit).
- Pas de rate-limiting visible sur les routes API publiques (`/api/subscribe`, `/api/simulateur`, etc.) — un abus (spam d'inscriptions, épuisement du quota Resend) n'est pas explicitement empêché au niveau applicatif (Vercel peut avoir des protections à la plateforme, mais rien dans le code applicatif lui-même).

---

## Analyse critique — si je devais reprendre Dalili aujourd'hui

### Ce qui est excellent

- **La discipline de vérification des données sur sources officielles** est rare et précieuse — peu de sites concurrents (même Studyrama/L'Étudiant) sourcent systématiquement leurs chiffres avec un lien vers le texte réglementaire. C'est un vrai avantage de confiance/EEAT, pas un argument marketing creux.
- **Le système de clusters pour le maillage interne** (`CLUSTER_MAP`, `getRelatedPosts`) est une architecture simple mais efficace — peu de sites de cette taille (65 articles) ont une logique de maillage aussi systématique plutôt que purement manuelle.
- **L'avance GEO réelle** (pages FAQ sourcées, page `/stats` en `Dataset` schema, `KeyFacts`) — la plupart des concurrents n'ont pas encore structuré leur contenu pour être cité par les moteurs IA génératifs ; Dalili a une longueur d'avance concrète et déjà en production, pas juste planifiée.
- **L'honnêteté éditoriale** (chaque fiche ville/université a des "cons" réels, pas seulement des "pros") — un choix de confiance qui distingue Dalili d'un site d'affiliation pur.
- **L'attention à la performance mesurée** (commits `perf:` avec métriques avant/après précises) — signe d'une vraie rigueur d'ingénierie, pas de suppositions.

### Ce qui est moyen

- **La duplication de données entre TS structuré, MDX narratif et objets SEO manuels** (UNI_SEO/CITY_SEO) — fonctionne, mais crée exactement le type de dérive constatée avec le Bug #2 (une correction faite à un endroit, oubliée ailleurs). Un futur refactor pourrait centraliser les chiffres critiques (frais de scolarité notamment) en une seule source de vérité importée partout, plutôt que copiés-collés.
- **Le style hybride inline/Tailwind** — fonctionnel et assumé, mais rend chaque page plus longue et plus difficile à scanner visuellement dans le code qu'un système de classes utilitaires cohérent l'aurait permis.
- **L'absence de vérification automatisée du maillage interne** (liens morts, articles orphelins) — actuellement détectée uniquement par des audits ponctuels manuels/IA, pas par un script qui tournerait à chaque build.

### Ce qui manque clairement

- **Un vrai knowledge graph formalisé** (voir `04-SEO-GEO-AEO.md`) — la fondation de données existe, la formalisation des relations n'a pas été faite.
- **Des tests automatisés** — Playwright installé mais orphelin ; aucune garantie de non-régression avant déploiement.
- **Un script de lint de contenu** — validation automatique du frontmatter (readTime en string, cluster existant, thumbnail existant, pas de FAQ dupliquée) qui aurait empêché plusieurs des problèmes déjà trouvés par audit manuel.
- **Une vraie roadmap documentée** — actuellement reconstruite par déduction depuis l'historique git, pas planifiée à l'avance dans un document partagé.
- **Le WebMCP mandaté par le skill** — chantier non commencé.
- **Une internationalisation** (arabe, anglais) — cohérente avec l'audience ciblée (Maghreb) mais non entamée.

---

## Priorités — punch list condensée (regroupée par thème, ~100 items)

### A. Corrections urgentes (bugs vérifiés — à traiter en premier)
1. Corriger les 38 liens morts villes→universités (fallback non-cliquable a minima)
2. Uniformiser `tuitionLicence`/`tuitionMaster`/ajouter `tuitionDoctorat` sur les 9 universités obsolètes dans `lib/universities.ts`
3. Protéger ou supprimer `/api/test-email`, retirer la fuite de fragment de clé API
4. Vérifier et corriger si besoin la double section FAQ de `campusfrance-maroc-guide-complet`
5. Nettoyer les `console.log` de debug restants dans les Route Handlers
6. Supprimer `app/fonts/GeistVF.woff`/`GeistMonoVF.woff` (morts, commités)
7. Nettoyer `tailwind.config.ts` (retirer `open-sans`, aligner `dalili-bg` sur `#010510`)
8. Rafraîchir `project-overview.md` (mémoire Claude Code — nombre d'articles obsolète)

### B. SEO technique (15)
9. Relancer un audit SEO frais sur les 65 articles actuels (title/description/longueur, cannibalisation, maillage)
10. Ajouter `FAQPage` + `Article`/`WebPage` schema aux 6 pages pays
11. Remplacer `EducationalOrganization` par `CollegeOrUniversity` sur les fiches université (ou documenter le choix inverse consciemment)
12. Générer un flux RSS (`/feed.xml`)
13. Générer un sitemap d'images dédié
14. Script de validation automatique du frontmatter blog (CI ou pre-commit hook)
15. Script de détection d'articles orphelins (0 lien entrant) à faire tourner régulièrement
16. Vérifier la cohérence des thumbnails `.webp` vs `.png` (mix signalé par l'audit de juin)
17. Centraliser `UNI_SEO`/`CITY_SEO` pour réduire la duplication manuelle
18. Ajouter des redirects 301 documentés pour tout futur renommage de slug (process à formaliser, pas juste ad hoc)
19. Auditer les descriptions meta trop longues/courtes (liste précise dans l'ancien audit, à revalider)
20. Vérifier la présence d'un `alt` pertinent sur toutes les images (spot-check, pas seulement les composants principaux)
21. Ajouter un `dateModified` cohérent sur les schémas `Article` des pages université/ville qui ont une valeur codée en dur (`'2026-06-18'`) plutôt que dynamique
22. Vérifier qu'aucun lien interne ne pointe encore vers `dalili-waitlist.vercel.app` ou `www.dalili.study`
23. Ajouter des données structurées `AggregateRating` si des avis utilisateurs sont un jour collectés (actuellement pas de note utilisateur, seulement des avis éditoriaux "Dalili")

### C. Contenu (15)
24. Créer les fiches manquantes pour les écoles les plus référencées dans les 38 liens morts (Sciences Po de chaque ville en priorité)
25. Étendre la couverture à de nouveaux pays (Guinée, Mali, Bénin, Burkina Faso — mentionnés comme pays CEF dans la FAQ mais sans page pays dédiée)
26. Étendre la couverture villes (Besançon, Angers, Reims, Le Havre, etc. — grandes villes universitaires non couvertes)
27. Ajouter des fiches "grandes écoles" (HEC, Polytechnique, CentraleSupélec — mentionnées dans le contenu ville de Paris mais sans fiche propre)
28. Réviser les articles > 1 mois pour vérifier qu'aucun chiffre n'est devenu obsolète (processus récurrent, pas un one-off)
29. Ajouter un encart "TL;DR"/résumé structuré en tête de chaque article (renforce le GEO, actuellement implicite seulement)
30. Uniformiser la longueur des articles les plus courts (identifiés dans l'audit de juin, à revalider)
31. Ajouter des témoignages vidéo/audio réels d'étudiants (renforce l'E-E-A-T "Experience")
32. Documenter une politique éditoriale écrite (ton, longueur, structure obligatoire) pour onboarder un futur rédacteur externe
33. Ajouter un glossaire transverse (VLS-TS, OFII, CEF, CVEC, PASS/LAS...) linkable depuis chaque article
34. Vérifier la fraîcheur des 6 pages pays (mêmes risques d'obsolescence réglementaire que les universités)
35. Ajouter des études de cas par filière (droit, informatique, médecine — au-delà de ville/université) déjà amorcées mais à densifier
36. Auditer les 14 fiches université pour harmoniser le H2 "Vue d'ensemble" identique (signalé par l'audit de juin)
37. Ajouter un système de "dernière vérification" visible (date + source) sur chaque chiffre clé, pas seulement `updatedDate` global
38. Créer un contenu dédié aux bourses par pays (au-delà de ce qui existe déjà pour Tunisie/Sénégal/Liban)

### D. GEO / AEO / Knowledge graph (10)
39. Formaliser un graphe de relations explicite (ville↔université↔pays↔article↔cluster) au-delà de `CLUSTER_MAP`
40. Enrichir le JSON-LD avec des relations `about`/`mentions`/`isPartOf` entre entités
41. Explorer une exposition WebMCP réelle (actions "search university", "compare universities" machine-readable) — chantier neuf mandaté par le skill
42. Ajouter un encart Q/R "What/Who/Why/Next" explicite en tête de chaque page pilier
43. Étendre `/stats` avec plus de datasets (par nationalité, par filière)
44. Tester la citabilité réelle par ChatGPT/Perplexity/Google AI Overview (recherche manuelle périodique des requêtes cibles)
45. Ajouter des FAQ dédiées par pays (actuellement seulement 5 FAQ thématiques transverses, pas par nationalité)
46. Vérifier la robustesse d'`extractFaqItems()` sur des formats de question non standards (ex. numérotées "1. Question ?")
47. Documenter le skill `dalili-master` dans le repo (actuellement seulement au niveau compte, fragile — voir `07`)
48. Explorer un format de données ouvert (API publique en lecture seule des chiffres vérifiés) pour être une source citée directement par d'autres outils

### E. Performance (10)
49. Auditer Lighthouse sur les 4 outils interactifs (Simulateur/Comparateur/Calendrier/Checklist) — non mentionné dans les commits perf existants, qui semblent focalisés sur la homepage/blog
50. Vérifier le poids du bundle `@react-pdf/renderer` sur le TTFB des routes API (signalé comme point d'attention par l'audit de juin)
51. Revalider les Core Web Vitals mobiles sur les pages université/ville (le focus perf documenté semble concentré sur la homepage)
52. Vérifier le lazy-loading effectif des images de la grille blog (`SearchableBlogGrid`)
53. Profiler l'impact GSAP/Lenis sur les appareils bas de gamme (non testé explicitement dans les commits observés)
54. Revoir la stratégie de preload (`layout.tsx` précharge 2 images fixes — vérifier la pertinence sur chaque route)
55. Auditer le poids total JS des pages outils (formulaires complexes en client component)
56. Vérifier `optimizeCss`/`critters` toujours compatible avec la version Next.js utilisée (feature expérimentale)
57. Mettre en place un budget de performance suivi dans le temps (pas seulement des corrections ponctuelles réactives)
58. Vérifier le cache HTTP des routes API PDF (seul `/api/checklist` a un `Cache-Control` explicite observé)

### F. Design / UX (10)
59. Harmoniser `dalili-bg` Tailwind avec la vraie couleur de fond
60. Documenter formellement la palette de couleurs par cluster dans un design token partagé (actuellement dupliquée entre `CATEGORY_COLORS` et `CLUSTER_DEFINITIONS`)
61. Ajouter un mode "impression" propre pour les pages avec beaucoup de tableaux (actuellement pensé écran uniquement)
62. Revoir l'accessibilité clavier complète des 4 outils interactifs (non auditée spécifiquement, contrairement à la homepage)
63. Ajouter des tests de contraste automatisés (actuellement corrections ponctuelles manuelles)
64. Vérifier la cohérence visuelle entre composants `.jsx` historiques et `.tsx` récents
65. Auditer le comportement du site avec `prefers-reduced-motion` (animations riches, GSAP/Framer Motion — non mentionné comme testé)
66. Documenter le design system dans un fichier dédié (actuellement seulement déductible du code, pas un Storybook ou équivalent)
67. Vérifier le focus visible clavier sur les cards interactives (blog, université, ville)
68. Étendre le composant `Callout` avec d'autres variantes si le contenu en a besoin (ex. "erreur fréquente")

### G. Architecture / dette technique (10)
69. Retirer ou implémenter réellement Playwright
70. Mettre en place une CI minimale (lint + build sur chaque PR/push)
71. Ajouter un script de vérification d'intégrité des données (slugs référencés existent, chiffres cohérents entre `lib/` et `content/`)
72. Nettoyer `content/université/` (dossier accentué redondant)
73. Centraliser la génération des metadata (factory commune plutôt que dupliquée par route)
74. Documenter les colonnes Supabase réelles (`simulateur_data` etc.) dans `supabase/schema.sql` pour qu'il redevienne une source de vérité fiable
75. Ajouter un rate-limiting basique sur les routes API publiques
76. Explorer une consolidation progressive du typage (`.jsx`→`.tsx`) pour les composants les plus critiques (Navbar, Footer) si un jour un refactor est demandé
77. Vérifier qu'aucune donnée sensible n'est loggée dans les `console.log` restants (emails visibles en clair dans les logs simulateur)
78. Ajouter un `CONTRIBUTING.md` documentant les conventions réelles (mélange jsx/tsx, style inline, workflow contenu) pour tout futur contributeur

### H. Outils / produit (10)
79. Permettre une pondération personnalisée des critères du Comparateur de villes
80. Documenter publiquement la méthodologie des scores villes (actuellement opinion éditoriale non explicitée à l'utilisateur)
81. Ajouter un suivi de statut plus riche au dashboard admin (au-delà de pending/invited/converted/unsubscribed)
82. Envisager un système de rôles pour le dashboard admin si l'équipe grandit au-delà d'Aymane seul
83. Ajouter une consolidation des 4 sources d'emails waitlist (aujourd'hui `source` distingue déjà les origines — vérifier que les emails de suivi sont bien segmentés en conséquence)
84. Explorer un export CSV/analytics du dashboard admin
85. Ajouter des tests de bout en bout sur le tunnel de conversion (formulaire → email → PDF) — actuellement aucune garantie automatisée que ce tunnel critique fonctionne après un déploiement
86. Revoir la gestion d'erreur utilisateur si Resend échoue (actuellement l'utilisateur ne reçoit qu'un message d'erreur générique, sans retry automatique)
87. Envisager une v2 du calendrier Campus France avec des dates réelles par session (actuellement structurel par mois, à vérifier si les dates sont mises à jour chaque année)
88. Ajouter une page de confirmation post-soumission plus riche sur les 4 outils (actuellement à vérifier composant par composant)

### I. Sécurité (5)
89. Auditer toutes les routes `/api/*` pour un pattern d'auth cohérent (actuellement `ADMIN_TOKEN` pour `/admin`, rien pour `/test-email`)
90. Revoir les headers de sécurité HTTP globaux (CSP, X-Frame-Options — non vérifiés dans cet audit au-delà de la CSP des images)
91. Vérifier la rotation possible d'`ADMIN_TOKEN` sans interruption de service
92. Auditer les policies RLS Supabase avec `mcp__supabase__get_advisors` (non fait pendant cet audit — recommandé en premier réflexe pour tout futur travail Supabase)
93. Vérifier qu'aucune clé secrète n'apparaît dans les logs Vercel accessibles

### J. Process / Ops (10)
94. Documenter une roadmap réelle avec Aymane (actuellement absente, reconstruite par déduction)
95. Mettre en place un monitoring d'erreurs applicatif (Sentry ou équivalent — absent actuellement, seulement GA4/GTM pour l'analytics, rien pour les erreurs serveur)
96. Planifier des revues SEO Google Search Console à cadence fixe (déjà pratiqué ad hoc, à formaliser en rituel récurrent)
97. Planifier une revue réglementaire trimestrielle (CVEC, frais de scolarité, plafonds horaires) plutôt que réactive après incident
98. Copier le skill `dalili-master` dans le repo pour ne plus dépendre uniquement du compte Claude Code local d'Aymane
99. Nettoyer `.claude/worktrees/` localement (résidus d'agents précédents, sans risque mais source de confusion pour l'espace disque/recherche de fichiers)
100. Établir un processus de handoff régulier comme celui-ci (ce dossier) à chaque changement d'outil ou de contributeur, plutôt qu'un exercice ponctuel

---

## Note finale pour le successeur

Ce dossier a été produit en lisant le code réel, pas en résumant des intentions. Chaque affirmation peut être re-vérifiée directement dans le repo aux chemins cités. Si une information ici semble contredire ce que tu observes dans le code au moment où tu le lis, **fais confiance au code** — ce dossier est une photo prise le 2026-07-20, pas une source de vérité vivante. La liste de 100 priorités ci-dessus n'est pas un ordre rigide : commencer par la section A (bugs vérifiés) est recommandé, le reste dépend des objectifs qu'Aymane fixera pour la suite.

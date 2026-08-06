# AUDIT TECHNIQUE — Code actuel vs DALILI KNOWLEDGE SYSTEM

**Statut** : audit en lecture seule. Aucune modification de code effectuée. S'appuie sur les documents officiels (Vision, Architecture V1/V2, `BLUEPRINT.md`, les 28 spécifications d'objets, `MASTER-IMPLEMENTATION-PLAN.md`).

**Méthode** : chaque dossier du dépôt est examiné et confronté au modèle du Knowledge System (six couches : Truth, Knowledge, Reasoning, Planning, Experience, Distribution ; 28 objets métier). Pour chaque dossier : rôle actuel, correspondance déjà existante (même embryonnaire) avec un objet KS, ce qui devra être remplacé, ce qui devra être conservé tel quel, ce qui devra être migré. L'état exact du dépôt au moment de cet audit : 68 articles de blog, 14 fiches université, 14 fiches ville (dont 9 avec contenu long-form MDX complémentaire), aucun commit nouveau depuis la conception du Blueprint.

**Ce que cet audit confirme d'emblée** : le Knowledge System n'est pas une architecture théorique déconnectée du code réel — presque chaque objet KS a déjà un **embryon** reconnaissable dans le code actuel, sous une forme non structurée, non tracée et parfois dupliquée. Ce n'est pas un hasard : le Blueprint a été conçu en réaction directe aux limites de ce code. Ce document rend cette correspondance explicite, dossier par dossier.

---

## Table des matières

1. Cartographie complète — dossier par dossier
2. Cartographie inverse — chaque objet KS, où il existe (ou n'existe pas) déjà dans le code
3. Écarts (gap analysis) par couche
4. Risques
5. Quick wins
6. Dette technique
7. Priorités

---

# 1. Cartographie complète — dossier par dossier

## `app/` — routes, pages, API Route Handlers (Next.js App Router)

**Rôle actuel** : point d'entrée de toutes les URLs publiques du site, génération des métadonnées, du JSON-LD, orchestration des appels aux fonctions de `lib/`, réception des soumissions de formulaires via les Route Handlers.

**Correspondance déjà existante** : chaque `generateMetadata()` est une `Presentation` non formalisée (title/description/OG écrits à la main par route) ; chaque bloc `<script type="application/ld+json">` (Article, FAQPage, BreadcrumbList, EducationalOrganization, WebSite, Organization) est une projection manuelle de ce qu'une vraie `Presentation` dérivée automatiquement produirait ; chaque Route Handler (`/api/simulateur`, `/api/comparer`, `/api/calendrier`, `/api/checklist`) est une proto-`Capability` : elle a déjà une entrée et une sortie identifiables, simplement non déclarées comme un contrat versionné et mêlée à sa logique métier.

**À remplacer** : les objets `UNI_SEO`/`CITY_SEO` codés en dur (28 entrées manuelles) — remplacés par `Presentation` générée. La construction manuelle et répétée du JSON-LD dans chaque `page.tsx` — remplacée par une génération dérivée des objets KS (`University`/`Content`/`Question` → schema.org).

**À conserver** : la structure de routage elle-même (App Router, fichiers `page.tsx`/`route.ts` par URL) — le Knowledge System ne remplace pas Next.js, il change ce que ces fichiers *consomment*, pas leur existence ni leur organisation. `app/sitemap.ts`/`app/robots.ts` restent l'API native Next.js adaptée, seule leur source de données évolue.

**À migrer** : la logique métier aujourd'hui écrite en ligne dans les Route Handlers (validation, calcul, upsert Supabase, génération PDF, envoi d'email, tout empilé dans un seul fichier de 200 lignes pour `/api/simulateur`) devra être scindée : la partie calcul devient l'invocation d'une `Derivation`/`RecommendationModel` via une `Capability`, la partie effet de bord (email, sauvegarde) reste propre à la route mais devient un effet documenté de cette `Capability`.

---

## `components/` — composants React

**Rôle actuel** : toute la couche de rendu visuel — homepage, blog, fiches, outils interactifs, navigation.

**Correspondance déjà existante** : `components/blog/KeyFacts.tsx` est, de tout le code actuel, le composant le **plus proche** d'une vraie brique KS — un encart de faits atomiques avec un champ `source` optionnel, exactement l'esprit de `Fact`/`Question` présenté. `components/blog/ClusterLinks.tsx` et `RelatedArticles.tsx` matérialisent déjà, visuellement, ce que la relation `USES`/maillage devrait produire automatiquement. `components/blog/MdxComponents.jsx` est un renderer de `Content` déjà fonctionnel.

**À remplacer** : rien structurellement — ce sont des composants de présentation, pas des détenteurs de vérité ; le KS ne les remplace pas, il change leurs props/sources de données au fil de la migration.

**À conserver** : la quasi-totalité des composants visuels/animation sans aucune donnée métier propre (`HeroSection`, `Navbar`, `Footer`, `StarCanvas`, `ParisSkyline`, `PlaneCinematic`, `LogoReveal`, `IntroAnimation`, `LenisProvider`) — zéro recoupement avec le Knowledge System, aucune raison de les toucher pendant toute la migration.

**À migrer** : `ClusterLinks`/`RelatedArticles` liront un jour le registre centralisé de relations plutôt que `CLUSTER_MAP`/des tableaux `relatedArticles` codés en dur. `SimulateurBudget.tsx`, `ComparateurVilles.tsx`, `CalendrierOutil.tsx` (863, 731, 486 lignes) contiennent aujourd'hui à la fois l'UI **et** une partie de la logique de calcul/scoring — cette logique migre vers `Derivation`/`RecommendationModel`/`Procedure`, les composants ne conservant que la présentation et l'appel à une `Capability`.

---

## `content/` — fichiers MDX sources + images de travail

**Rôle actuel** : le corps éditorial du site — 68 articles de blog, 14 fiches université, 9 fiches ville (avec contenu long-form), organisés en fichiers `.mdx` avec frontmatter YAML.

**Correspondance déjà existante** : chaque fichier `.mdx` **est** déjà, conceptuellement, un `Content` — il ne lui manque qu'une discipline de citation. Le frontmatter (`title`, `description`, `category`, `cluster`) est déjà une ébauche de `Presentation` + relation `BELONGS_TO_CLUSTER`. Les sections `## FAQ` sont déjà des `Question` en puissance, simplement non formalisées comme objets — elles sont extraites par un motif regex fragile (`extractFaqItems()`) plutôt qu'écrites comme telles.

**À remplacer** : aucun mécanisme de fichier n'est à remplacer — conformément au principe "pas de réécriture", l'authoring en fichiers `.mdx` versionnés par git reste le mode de production du contenu, pas un CMS à construire.

**À conserver** : le format `.mdx`, le frontmatter YAML, `gray-matter`/`next-mdx-remote` comme mécanisme de lecture — tout ce pipeline reste identique, seul ce que le texte contient change progressivement (citations plutôt que valeurs en dur).

**À migrer** : chaque chiffre actuellement tapé en dur dans la prose (frais, délais, plafonds) devient une citation vers un `Fact` (Phase 4 du plan d'implémentation) ; chaque section `## FAQ` devient une liste de `Question` explicitement rédigées ; les 5 universités et 5 villes sans contenu long-form MDX restent un manque de couverture éditoriale, indépendant du KS mais à noter.

---

## `data/`

**Rôle actuel** : un unique fichier, `data/emails.json` — mécanisme de capture d'emails hérité, confirmé non écrit par le code actuel (`app/api/subscribe/route.ts` écrit uniquement dans Supabase).

**Correspondance avec le KS** : aucune.

**À remplacer / conserver / migrer** : rien de tout cela ne s'applique — ce dossier est un résidu à supprimer, une tâche de nettoyage indépendante du Knowledge System, déjà signalée dans l'audit technique précédent.

---

## `emails/` — templates transactionnels (Resend)

**Rôle actuel** : 5 templates HTML générés en fonctions TypeScript, pour les résultats des 3 outils et la waitlist.

**Correspondance déjà existante** : c'est un renderer de sortie — l'équivalent d'une `Presentation` appliquée à un résultat de calcul, pour le canal "email". L'envoi lui-même est un effet de bord qu'une `Capability` documenterait explicitement.

**À remplacer** : rien structurellement.

**À conserver** : le mécanisme de génération HTML par fonction, Resend comme vecteur d'envoi.

**À migrer** : les données injectées dans ces templates viennent aujourd'hui de calculs faits en ligne dans le Route Handler ; elles viendront, à terme, directement d'un objet `Derivation`/`Recommendation` déjà produit et tracé, plutôt que d'un recalcul propre à chaque route.

---

## `lib/` — logique métier, accès aux données, génération PDF

**Rôle actuel** : le cœur non-visuel du projet. **C'est le dossier le plus directement concerné par le Knowledge System** — il contient à la fois la "vérité" actuelle du site (sous forme non structurée) et sa "logique de raisonnement" actuelle (sous forme de fonctions, pas d'objets déclaratifs).

### `lib/universities.ts` et `lib/cities.ts`

**Correspondance** : ce sont, très exactement, des tentatives manuelles d'objets `University`/`City` — mais avec les valeurs numériques (`tuitionLicence: 2895`) **embarquées directement dans l'entité**, exactement ce que l'invariant n°1 de `University` (spécification KS) interdit. Le champ `universities: {name, slug}[]` de chaque `City` est une liste recopiée à la main — c'est **la cause directe et unique** des 38 liens morts déjà documentés dans l'audit précédent (`docs/handoff-chatgpt/08-*`) : cette liste est exactement ce que la relation centralisée `LOCATED_IN` (avec navigation inverse) doit remplacer.

**À remplacer** : les champs numériques en valeur propre (frais, budgets, coûts) — remplacés par des références `HAS_FACT → Fact`. Le tableau `universities[]` de `City` — remplacé par la navigation inverse de la relation `LOCATED_IN`.

**À conserver** : les champs qualitatifs propres (`pros`, `cons`, `avis`, `tagline`, `neighborhoods`) — ce sont déjà, conceptuellement, des `Judgment`/`Content` narratif légitimement éditorial, pas des `Fact` à extraire.

**À migrer** : c'est le chantier exact des Phases 1 et 2 du plan d'implémentation déjà produit — rien de nouveau à ajouter ici, ce fichier **est** le domaine pilote.

### `lib/comparer-scores.ts`

**Correspondance** : `CITY_SCORES` est un embryon direct de `Judgment` (5 scores éditoriaux par ville) sans méthodologie documentée séparée — les scores et leur pondération (`totalScore`, poids égaux implicites) sont un embryon direct de `RecommendationModel`, mais figé, non ajustable, non tracé.

**À remplacer** : la fonction `recommander()` (choix du meilleur score, sans explication conservée) — remplacée par un vrai `RecommendationModel` produisant une `Recommendation` tracée.

**À conserver** : les 5 critères eux-mêmes (budget, emploi, communauté, météo, transport) restent pertinents comme point de départ des futurs `Judgment`.

**À migrer** : exactement la Phase 7-8 du plan d'implémentation (séparation `Judgment`/méthodologie, puis `RecommendationModel`).

### `lib/calendrier-data.ts`

**Correspondance** : `PAYS_INFO` et les `CalendrierStep` (avec `urgence`, `isArrivee`) sont un embryon de `Procedure` générique par pays — mais statique, non personnalisé par profil, sans notion de `Task`/`Timeline`/`Milestone` réelle. C'est le fichier qui illustre le plus clairement l'absence totale, aujourd'hui, de la couche `Planning`.

**À remplacer** : rien à ce stade — la structure de données reste une bonne base de départ pour modéliser `Procedure`.

**À conserver** : le contenu factuel des étapes (quoi faire, dans quel ordre) reste la matière première de la future `Procedure`.

**À migrer** : exactement la Phase 9 du plan (`Procedure` → `Timeline`/`Task`/`Milestone` instanciées par `LearnerProfile`), aujourd'hui totalement absente.

### `lib/simulateur-pdf.ts`, `lib/comparer-pdf.ts`, `lib/calendrier-pdf.ts`, `lib/ChecklistPDF.tsx`

**Correspondance** : ces fichiers mélangent **calcul** (une logique de type `Derivation`, ex. budget net = revenus − dépenses + aides) et **présentation** (mise en page PDF) dans un seul et même fichier — une violation directe de la séparation Reasoning/Experience du Blueprint.

**À remplacer** : rien dans l'immédiat — la génération PDF elle-même (mécanisme technique) reste utile telle quelle.

**À conserver** : le mécanisme de rendu PDF (`@react-pdf/renderer`) comme sortie de présentation.

**À migrer** : extraire la logique de calcul de `lib/simulateur-pdf.ts` vers une vraie `Derivation` indépendante (Phase 6) — le fichier PDF ne fera plus que consommer un résultat déjà calculé et tracé, il ne recalculera plus rien lui-même.

### `lib/blog.ts` / `lib/blog-client.ts`

**Correspondance** : `getAllPosts`/`getRawPost` sont un accès à `Content` déjà fonctionnel. `CLUSTER_MAP`/`CLUSTER_DEFINITIONS` sont un embryon direct de `Cluster` et de la relation `BELONGS_TO_CLUSTER`. `getRelatedPosts`/`getClusterArticles` sont un embryon du maillage que la relation centralisée automatisera. `extractFaqItems()` est l'exemple le plus concret de la fragilité que `Question` comme objet de première classe doit éliminer : une regex sur du Markdown brut, qui casse silencieusement si le format n'est pas respecté à la lettre (déjà documenté comme risque réel dans l'audit précédent, sur l'article `campusfrance-maroc-guide-complet`).

**À remplacer** : `extractFaqItems()` elle-même, à terme — remplacée par la lecture directe d'objets `Question` explicitement rédigés.

**À conserver** : `getAllPosts`, la logique de tri par date, `formatDate`.

**À migrer** : `CLUSTER_MAP` devient une vraie relation `BELONGS_TO_CLUSTER` centralisée plutôt qu'un objet `Record<string,string>` en dur dans le code source.

### `lib/faq-data.js`

**Correspondance** : un très petit embryon de `Question` pour la FAQ homepage (8 items `{q, a}`), sans `source` contrairement aux pages `/faq/*`.

**À conserver/migrer** : candidat naturel et peu coûteux pour une première migration vers `Question` (Phase 5), vu sa taille réduite.

### `lib/blur-data.ts`, `lib/pdf-logo.ts`, `lib/supabase-admin.ts`

**Correspondance** : aucune — purs détails techniques (placeholders d'image, logo PDF, client Supabase serveur). Zéro recoupement avec le Knowledge System, à conserver tels quels indéfiniment.

---

## `public/` — assets statiques

**Rôle actuel** : images, fichiers statiques, `manifest.json` (configuration des pièces de l'avion 3D, pas un manifeste PWA malgré son nom), `sitemap.xml`/`robots.txt` statiques, `press-kit.md`.

**Correspondance déjà existante** : `public/press-kit.md` est, de tout le dépôt, le document **le plus proche dans l'esprit** d'un export `Fact`+`Source` déjà lisible par un humain — un tableau de chiffres vérifiés avec leur source officielle en colonne, exactement la forme qu'un `Knowledge Pack` ou une page `/stats` régénérée automatiquement devrait produire.

**À remplacer** : `public/sitemap.xml`/`public/robots.txt` statiques — doublons morts de `app/sitemap.ts`/`app/robots.ts` déjà signalés en dette technique, sans lien avec le KS mais à nettoyer.

**À conserver** : les images, `manifest.json` (config de l'avion, sans rapport avec le KS malgré le nom trompeur).

**À migrer** : le contenu de `press-kit.md` est un candidat naturel et déjà structuré pour devenir l'un des tout premiers jeux de `Fact`+`Source` du système — potentiellement même antérieur au domaine pilote officiel (frais de scolarité), car il est déjà présenté sous une forme quasi tabulaire prête à être décomposée.

---

## `scripts/`

**Rôle actuel** : un seul script, `generateFavicon.mjs`.

**Correspondance avec le KS** : aucune. Reste tel quel.

---

## `supabase/` et `utils/supabase/`

**Rôle actuel** : schéma de la table `waitlist` (leads produit) et client Supabase SSR/serveur.

**Correspondance avec le KS** : **aucune, et c'est volontaire** — le Blueprint exclut explicitement le choix de stockage technique, et la table `waitlist` est une donnée opérationnelle (des prospects), pas une connaissance du domaine (un fait sur la France, une université, une règle). Le Knowledge System n'a pas vocation à absorber cette table.

**Remarque utile pour la suite** : la future capture d'`Outcome`/`Signal` (Phase 11) pourrait techniquement être hébergée sur la même infrastructure Supabase déjà en place, sans que cela n'engage en rien le Knowledge System sur un choix technologique — une simple réutilisation d'infrastructure existante, à décider en implémentation, pas en conception.

---

## Fichiers racine (`middleware.ts`, `next.config.mjs`, `vercel.json`, `tailwind.config.ts`, `app/globals.css`, `package.json`)

**Rôle actuel** : configuration Next.js, sécurité/performance, redirections, design system visuel, dépendances.

**Correspondance avec le KS** : aucune, à une nuance près — **la `Presentation` du Knowledge System concerne le contenu et les métadonnées (title, description, schema.org), jamais le design visuel/CSS**. `tailwind.config.ts`/`app/globals.css` ne sont donc jamais concernés par une migration KS, même indirectement ; il ne faut pas confondre "Presentation" (couche KS) et "présentation visuelle" (design system) — ce sont deux choses homonymes mais totalement disjointes.

**À conserver** : l'intégralité, sans exception, pendant toute la durée de la migration.

---

# 2. Cartographie inverse — chaque objet KS, où il existe déjà (ou pas du tout)

| Objet KS | Embryon existant dans le code actuel | Maturité de l'embryon |
|---|---|---|
| `Fact` | Aucun objet dédié — valeurs en dur dans `lib/universities.ts`, `lib/cities.ts`, `app/stats/page.tsx` (`CITY_BUDGET`), `public/press-kit.md` | Inexistant comme objet, mais données déjà identifiées et localisées |
| `Source` | Champ `source` déjà présent sur chaque item des pages `/faq/*` et dans `public/press-kit.md` | **Le plus mature de tous les embryons Truth** — la convention `{q, a, source}` existe déjà en production |
| `Regulation` | Aucun objet — mentionnée seulement en texte libre dans les articles (ex. "décret n°2026-385") | Inexistant |
| `Country` | Implicite dans les 6 pages `/pays/*` et le champ `cluster` par nationalité | Faible — pas d'entité, seulement des pages et un identifiant de cluster |
| `City` | `lib/cities.ts`, objet `CITIES` | Fort — structure de données déjà quasi complète, à corriger plutôt qu'à créer |
| `University` | `lib/universities.ts`, objet `UNIVERSITIES` | Fort — idem |
| `Organization` | Aucun objet, mentions éparses (CROUS, préfecture) en texte/liens | Inexistant comme type, mais les entités réelles (CROUS, CAF...) sont déjà nommées dans le contenu |
| `Program` | `popularPrograms: string[]` sur `University`, en texte libre non structuré | Très faible |
| `Procedure` | `lib/calendrier-data.ts` (`PAYS_INFO`, `CalendrierStep`) | Moyen — structure déjà présente mais non générique/instanciable |
| `Document` | Mentionné en texte libre dans les articles et les étapes du calendrier, jamais structuré | Inexistant comme objet |
| `Content` | `content/blog/*.mdx`, `content/universites/*.mdx`, `content/villes/*.mdx` | **Déjà l'objet le plus mature de tout le système** |
| `Question` | Sections `## FAQ` (regex-extraites) + pages `/faq/*` (structurées avec source) + `lib/faq-data.js` | Fort dans `/faq/*`, fragile dans le blog |
| `Persona` | Implicite dans le ciblage par pays (`cluster`), jamais un objet propre | Faible |
| `Judgment` | `pros`/`cons`/`avis` de `University`/`City`, `CITY_SCORES` | Moyen — le contenu existe, la séparation d'avec le Fact et la méthodologie documentée n'existent pas |
| `Cluster` | `CLUSTER_MAP`/`CLUSTER_DEFINITIONS` (`lib/blog.ts`/`blog-client.ts`) | Fort — quasiment prêt à devenir l'objet réel |
| `Rule` | Aucun objet — logique conditionnelle éparpillée en texte ("803h pour les Algériens") | Inexistant comme objet, mais la connaissance elle-même est déjà écrite et correcte |
| `Derivation` | Logique de calcul mêlée à `lib/simulateur-pdf.ts`/composants | Faible — existe en tant que code, pas en tant qu'objet déclaratif isolé |
| `RecommendationModel` | `lib/comparer-scores.ts` (`totalScore`, poids égaux) | Moyen — structure la plus proche d'un objet Reasoning dans tout le code |
| `Recommendation` | Résultat affiché du Comparateur, jamais conservé ni tracé | Faible — le résultat existe, la traçabilité n'existe pas |
| `LearnerProfile` | Props ad hoc de chaque composant d'outil, jamais un schéma partagé | Inexistant comme objet unifié |
| `Task` / `Timeline` / `Milestone` | Aucun — le Calendrier actuel est générique par pays, jamais personnalisé | Inexistant |
| `Presentation` | `UNI_SEO`/`CITY_SEO`, JSON-LD écrit à la main par page | Fort en volume, faible en structure (dupliqué 28 fois à la main) |
| `Capability` | Les 7 Route Handlers (`/api/*`) | Moyen — le contrat existe de fait, non déclaré ni versionné |
| `Knowledge Pack` | Aucun | Inexistant |
| `Outcome` | Aucun mécanisme formel — retours informels reçus par email/GSC | Inexistant comme objet |
| `Signal` | Google Search Console consulté manuellement (déjà documenté comme pratique réelle) | Le signal existe dans la pratique humaine, aucun objet système |

**Lecture de ce tableau** : la couche `Truth` est la plus en retard (aucun `Fact`/`Source`/`Regulation` formalisé malgré des données déjà correctes) ; la couche `Knowledge` est la plus mature (`Content`, `Cluster`, `City`, `University` ont déjà une forme quasi-directement migrable) ; la couche `Planning` est la plus absente (aucun embryon réel de `Task`/`Timeline`/`Milestone`/`LearnerProfile` unifié).

---

# 3. Écarts (gap analysis) par couche

## Truth
**Écart** : total. Aucun `Fact` versionné, aucune `Source` structurée hors des pages FAQ, aucune `Regulation`. Les deux bugs déjà vérifiés (frais incohérents, liens morts) sont une **conséquence directe** de cette absence, pas un hasard isolé.

## Knowledge
**Écart** : structurel plutôt qu'inexistant. Les entités existent (`University`, `City`, `Content`, `Cluster`) mais violent systématiquement l'invariant central "aucune valeur numérique en propre" — chaque chiffre est écrit en dur au lieu de référencer un `Fact`.

## Reasoning
**Écart** : quasi-total sur `Rule`/`Derivation` (logique dispersée en code impératif, jamais déclarative), partiel sur `RecommendationModel`/`Judgment` (le Comparateur en est un embryon fonctionnel mais figé et non tracé).

## Planning
**Écart** : total. Aucun `LearnerProfile` unifié, aucune personnalisation réelle du parcours — le Calendrier actuel est un contenu statique par pays, pas un plan.

## Experience
**Écart** : le plus faible de toutes les couches en volume de travail restant, mais le plus visible en dette (28 objets de métadonnées dupliqués à la main). La logique de séparation Presentation/Truth est déjà presque respectée dans la pratique (les titres ne contiennent pas de logique métier), il ne manque que la dérivation automatique.

## Distribution
**Écart** : les 7 Route Handlers sont un point de départ concret pour `Capability`, mais aucun `Knowledge Pack`, aucune exposition pensée pour un agent IA externe n'existe.

---

# 4. Risques

- **Le domaine pilote (frais de scolarité) est déjà en incohérence active** — tout retard supplémentaire dans la Phase 1-2 du plan d'implémentation prolonge un bug déjà public et déjà documenté.
- **`lib/comparer-scores.ts` et `lib/calendrier-data.ts` sont les fichiers les plus consultés indirectement** (via 3 outils à fort trafic) — toute bascule mal testée sur ces fichiers a un impact utilisateur immédiat et visible, contrairement à une bascule sur une seule fiche université.
- **La fragilité de `extractFaqItems()` est un risque silencieux actif** — un nouvel article qui ne respecte pas le format exact (déjà vu une fois sur `campusfrance-maroc-guide-complet`) dégrade le SEO/GEO sans qu'aucune alerte ne se déclenche aujourd'hui.
- **Les 5 fiches université et 5 fiches ville sans contenu long-form MDX** représentent une dette éditoriale préexistante, indépendante du KS, mais qui va se retrouver mêlée à la migration de contenu (Phase 4) si elle n'est pas traitée séparément.
- **`public/press-kit.md` et les pages `/faq/*` ne sont référencés par aucun mécanisme automatique** — si le contenu narratif change ailleurs, rien ne signale qu'ils sont devenus incohérents avec le reste du site (ils sont, eux aussi, une duplication manuelle non détectée par les audits précédents faute d'avoir été cherchée sous cet angle).

---

# 5. Quick wins

1. **`public/press-kit.md` comme tout premier `Fact`+`Source` du système** — antérieur même au domaine pilote officiel, car déjà structuré en tableau sourcé, aucune recherche supplémentaire nécessaire pour l'amorcer.
2. **Les pages `/faq/*` migrées en `Question` en premier** — elles ont déjà le champ `source`, c'est la migration `Question` la moins coûteuse de tout le périmètre (pas de reformulation nécessaire, seulement un changement de structure de stockage).
3. **`lib/faq-data.js`** — huit items seulement, migration `Question` triviale, bon exercice d'échauffement avant les pages FAQ dédiées.
4. **`CLUSTER_MAP`/`CLUSTER_DEFINITIONS` vers `Cluster`** — la donnée est déjà propre et cohérente, il ne manque qu'un changement de forme, pas de contenu.
5. **Les deux bugs déjà identifiés (Phase 1-2 du plan)** restent, de tout ce périmètre, le quick win au ratio impact/effort le plus élevé — rappelé ici car cet audit confirme, fichier par fichier, qu'aucun obstacle nouveau ne s'y oppose.

---

# 6. Dette technique (confirmée et enrichie par cet audit)

Reprend et complète la dette déjà identifiée dans `docs/handoff-chatgpt/08-*`, avec l'éclairage supplémentaire du Knowledge System :

- Duplication de vérité `lib/universities.ts`/`lib/cities.ts` ↔ `content/*.mdx` ↔ `UNI_SEO`/`CITY_SEO` (déjà connue, désormais formellement le "domaine pilote" du plan d'implémentation).
- 38 liens morts villes→universités (déjà connue, désormais formellement corrigée par la relation `LOCATED_IN` centralisée, Phase 2).
- `extractFaqItems()` fragile par regex (déjà connue, désormais formellement remplacée par `Question`, Phase 5).
- Calcul et présentation mêlés dans les fichiers `*-pdf.ts` (**nouvellement identifié par cet audit** — pas documenté dans l'audit technique précédent, qui n'avait pas examiné ces fichiers sous l'angle de la séparation Reasoning/Experience).
- Absence totale de `LearnerProfile` unifié entre les 3 outils, chacun réinventant sa représentation du profil utilisateur (déjà pressenti dans la vision stratégique, désormais localisé précisément : `SimulateurBudget.tsx`, `ComparateurVilles.tsx`, `CalendrierOutil.tsx`).
- `public/press-kit.md` et `app/stats/page.tsx` (`CITY_BUDGET`) : **deux jeux de données supplémentaires dupliqués découverts par cet audit**, non signalés dans les audits précédents, qui redisent une partie des mêmes chiffres que `lib/cities.ts` sans lien structurel avec eux — un quatrième et cinquième emplacement potentiel de divergence, en plus des trois déjà connus.

---

# 7. Priorités

Cet audit **valide** l'ordre déjà défini dans `MASTER-IMPLEMENTATION-PLAN.md` — aucun élément découvert ici ne justifie de le reséquencer. Deux ajustements mineurs, réversibles (section 6 du plan), sont suggérés à la marge :

1. **Ajouter `public/press-kit.md` et les pages `/faq/*` comme cibles de la Phase 0-1**, avant même le domaine pilote officiel des frais de scolarité — leur structure déjà sourcée en fait un échauffement à coût quasi nul pour valider le gabarit `Fact`/`Source`/`Question` sur un périmètre minuscule avant de l'appliquer aux 42 valeurs du domaine pilote.
2. **Ajouter `app/stats/page.tsx` (`CITY_BUDGET`) à la liste de vigilance de la Phase 2**, aux côtés de `lib/cities.ts` — c'est un sixième emplacement de duplication potentielle des mêmes chiffres de budget par ville, découvert par cet audit, à traiter dans le même mouvement que la bascule déjà prévue plutôt que d'attendre qu'il produise son propre bug.

Aucun autre changement de priorité n'est recommandé. Le plan reste, tel quel, la feuille de route officielle.

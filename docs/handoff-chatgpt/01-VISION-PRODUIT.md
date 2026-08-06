# 01 — Vision produit

## Source de cette section

Cette section est basée sur deux documents trouvés dans le repo et l'environnement Claude Code, plus l'analyse du produit tel qu'il existe réellement :

1. `CLAUDE.md` à la racine du repo (instructions projet, versionnées dans git — donc partagées avec toute l'équipe/futurs contributeurs)
2. Le skill `dalili-master` (`~/.claude/skills/dalili-master/SKILL.md`, niveau utilisateur — pas dans le repo, propre à l'environnement Claude Code d'Aymane)
3. Le contenu réel du site (homepage, `/a-propos`, `/stats`, `public/press-kit.md`)

Le `CLAUDE.md` du repo dit littéralement :

> "Dalili Study exists to become the most trusted platform for international students who want to study in France. The goal is not to create pages. The goal is to become the definitive reference for studying in France. Every page should be more useful, more complete and more trustworthy than competing websites."

C'est la phrase la plus importante du projet. Chaque décision de contenu, de structure ou de feature doit être jugée à cette aune : **est-ce que ça rend Dalili plus digne de confiance et plus complet qu'un concurrent sur ce sujet précis ?**

---

## Mission

Devenir la référence de confiance n°1 pour les étudiants internationaux (francophones, principalement originaires du Maghreb et d'Afrique subsaharienne francophone, plus le Liban) qui veulent étudier en France — de la décision initiale jusqu'à l'installation complète sur le territoire français.

Le mot clé du positionnement, répété dans le press-kit et dans le contenu, est **"vérifié sur sources officielles"**. Dalili se différencie explicitement en citant ses sources (ameli.fr, caf.fr, service-public.fr, france-visas.gouv.fr, campusfrance.org, legifrance.gouv.fr) directement dans le contenu, y compris dans les pages FAQ où chaque réponse a un champ `source:` affiché à l'utilisateur (voir `app/faq/visa-etudiant-france/page.tsx`).

## Concurrents identifiés (explicitement nommés dans le CLAUDE.md du repo)

- **Campus France** — l'organisme officiel français, la référence institutionnelle mais souvent perçue comme bureaucratique/générique
- **Studyrama**
- **L'Étudiant**
- **Study.eu**
- **Mastersportal**
- **Top Universities**

Le principe directeur explicite : *"For every feature, article or page, compare against competitors and aim to provide superior value."* Ce n'est pas une intention vague — dans la pratique, la mémoire Claude Code (`feedback-research-first.md`) documente que le fondateur a **rejeté et supprimé un article** écrit sans recherche concurrentielle préalable, et a imposé la règle : rechercher les pages concurrentes existantes AVANT d'écrire, identifier ce qu'elles ratent, et ne publier que si l'article est substantiellement meilleur.

## Produit final vs. produit actuel

Il y a une distinction importante à saisir :

- **Le produit final annoncé** est une **application mobile** ("Dalili" — l'app), visible dans les mockups (`components/DALILIMockup.jsx`, `components/DALILIPhones.jsx`, dossier `public/mockups`), avec un statut "Bientôt disponible" affiché sur la homepage (`.hero-cards-badge` dans `globals.css`, "Bientôt disponible" badge). L'app promet d'accompagner l'étudiant à chaque étape : visa, logement, CAF, budget, mentors.
- **Le produit actuel réellement en production** est un site de contenu (blog + fiches + outils interactifs) qui sert deux fonctions : (1) capter et convertir du trafic SEO/GEO en inscriptions waitlist en attendant le lancement de l'app, et (2) déjà apporter de la valeur autonome via les outils (simulateur de budget, comparateur de villes, calendrier Campus France, checklist PDF téléchargeable).

Autrement dit : **le site actuel est une stratégie de contenu pré-lancement (pre-launch content marketing) doublée d'un vrai produit utilitaire gratuit (les 4 outils).** Ce n'est pas un simple "coming soon" — c'est un hub de référence qui a de la valeur dès aujourd'hui, indépendamment du lancement de l'app.

## Entités primaires (définies dans le CLAUDE.md du repo)

Le CLAUDE.md définit deux entités de contenu comme structurantes :

### Universités
> "Each university page should become a complete decision-making resource." Doit inclure : Overview, Rankings, Tuition fees, Admission process, Application requirements, Programs, Scholarships, Housing, Student life, International students, FAQ.

### Villes
> "Each city page should become the best student guide available." Doit inclure : Cost of living, Housing, Transportation, Safety, Student jobs, Student life, Weather, Advantages, Disadvantages, Universities, FAQ.

Dans le code réel, ces deux entités existent bien comme sections dédiées de l'app (`/universites/[slug]`, `/villes/[slug]`), avec des modèles de données typés (`University`, `City` interfaces dans `lib/universities.ts` et `lib/cities.ts` — détaillé dans `03-CONTENU-DONNEES-CMS.md`). Une troisième entité de fait, non nommée explicitement dans le CLAUDE.md mais bien présente et centrale dans le code, est le **guide par pays d'origine** (`/pays/etudier-en-france-depuis-*`, 6 pages) — probablement l'entité la plus stratégique du point de vue conversion, car elle capte l'utilisateur au moment précis où il décide "je veux partir depuis mon pays X."

## Principes produit (ordre de priorité explicite, CLAUDE.md du repo)

1. User value (valeur utilisateur)
2. Trust (confiance)
3. Clarity (clarté)
4. Conversion
5. SEO
6. AI Search
7. Performance

> "Never optimize only for search engines. Users come first."

C'est un ordre de priorité explicite et volontairement anti-"SEO spam" : le SEO et l'AI Search sont en position 5 et 6, PAS en première position. Dans la pratique du code, cela se traduit par : des articles longs (1300 à 3000+ mots) qui répondent réellement à la question posée, des FAQ sourcées, des avis honnêtes qui incluent des inconvénients ("cons") et pas seulement des avantages sur chaque fiche ville/université — un choix délibéré de crédibilité plutôt que de promotion pure.

## Directive globale (niveau utilisateur, s'applique à TOUS les projets d'Aymane, pas seulement Dalili)

Le fichier `~/.claude/CLAUDE.md` (instructions globales, hors du repo) impose un standard de qualité "élite" à tout projet :

- Références de design : Apple, Stripe, Linear, Vercel, Notion, Airbnb, Awwwards, SiteInspire, Godly
- Cibles de performance : Lighthouse Performance ≥ 95, SEO ≥ 100, Accessibility ≥ 100, Best Practices ≥ 100
- Cibles Core Web Vitals : LCP < 1.5s (le skill dalili-master), INP < 100ms, CLS < 0.02
- Workflow imposé avant tout code : **Audit → Analyze → Plan → Implement → Test → Optimize**. *"Never jump directly to implementation."*
- Philosophie visuelle : cinématique, immersive, premium, moderne, sophistiquée, polie, mémorable. Éviter : layouts génériques, designs "template", landing pages ennuyeuses, animations excessives, clutter visuel.

Cette directive globale explique pourquoi le design du site (voir `05-DESIGN-SYSTEM-UX.md`) est aussi chargé en animations (Framer Motion, GSAP, Lenis smooth-scroll, effets de parallaxe, avion 3D démonté en pièces sur la homepage) — ce n'est pas un accident, c'est une exigence système imposée à chaque session Claude Code.

## Le skill `dalili-master` — la vision "augmentée" **[ASPIRATIONNEL]**

Le skill utilisateur `dalili-master` (chargé automatiquement disponible pour ce projet, voir `07-CLAUDE-CODE-WORKFLOW.md` pour le texte intégral) va plus loin que le CLAUDE.md du repo et définit une ambition élargie : optimiser **simultanément** pour UX, SEO, **GEO (Generative Engine Optimization)**, **AEO (Answer Engine Optimization)**, AI Search, Accessibilité, Performance, Conversion, Trust, Authority, Content Quality — et introduit même un concept **WebMCP** (rendre chaque action du site "machine-readable" pour que des agents IA puissent comprendre et déclencher des actions comme "search university", "compare universities", "submit application").

**Important pour la continuité** : ce skill est un **système de directives que Claude doit suivre pendant le développement**, pas une description de fonctionnalités déjà construites. À la lecture du code réel (détaillée dans `04-SEO-GEO-AEO.md`), le GEO et l'AEO sont substantiellement implémentés (pages FAQ dédiées, schema.org riche, page `/stats` en `Dataset` schema, composant `KeyFacts`), mais le **WebMCP n'existe pas du tout dans le code** — c'est une direction non commencée. Le prochain agent doit distinguer clairement, à chaque tâche, ce qui est déjà construit de ce qui reste une intention du skill.

## Roadmap / stratégie long terme — ce qui est documenté vs. ce qui ne l'est pas

**Il n'existe aucun document de roadmap formel dans le repo** (pas de `ROADMAP.md`, pas de board Linear/Jira référencé dans la mémoire Claude Code, pas de fichier de planning). La roadmap doit être reconstruite par déduction à partir de :

- L'historique git récent (voir `07-CLAUDE-CODE-WORKFLOW.md` pour la chronologie complète) : le rythme de travail montre un cycle constant de (a) ajout de nouveaux articles/clusters géographiques, (b) corrections SEO ciblées basées sur Google Search Console, (c) corrections de données obsolètes détectées a posteriori.
- Le skill `dalili-master` qui indique où l'ambition veut aller (WebMCP, RSS, image sitemap — non implémentés).
- La section `08-DETTE-TECHNIQUE-ROADMAP-CRITIQUE.md` de ce dossier, qui propose une priorisation raisonnée basée sur l'état réel du code.

**Recommandation pour le successeur** : avant de proposer une nouvelle direction produit, demander explicitement à Aymane s'il a une roadmap non documentée en tête (dates de lancement de l'app, nouveaux pays cibles, nouvelles villes/universités à couvrir) — ne pas supposer que l'absence de document signifie l'absence de plan.

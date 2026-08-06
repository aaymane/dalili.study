# DALILI STUDY — Dossier de transmission complet

**Généré le** : 2026-07-20, par Claude (Sonnet 5 / Claude Code), à la demande d'Aymane Amri, fondateur du projet.

**Objectif de ce dossier** : permettre à un autre modèle (ChatGPT GPT-5.5, ou tout autre LLM/développeur) de reprendre le projet Dalili Study immédiatement, sans perte de contexte, avec une compréhension aussi complète que possible de CE QUI existe et POURQUOI.

**Méthode utilisée pour produire ce dossier** : chaque affirmation factuelle ci-dessous provient d'une lecture directe du code source, des fichiers de configuration, de l'historique git (`git log`), des fichiers de mémoire Claude Code, et d'un audit SEO existant dans le repo. Rien n'est deviné ni extrapolé sans le signaler explicitement. Quand une information vient d'un document "aspirationnel" (le skill Claude `dalili-master`, qui décrit ce que le système DEVRAIT faire) plutôt que du code réel, c'est marqué **[ASPIRATIONNEL — pas encore implémenté ou partiellement implémenté]**.

---

## Comment lire ce dossier

Les fichiers sont numérotés dans un ordre de lecture recommandé, mais chacun est autonome — tu peux sauter directement à la section qui t'intéresse.

| Fichier | Contenu |
|---|---|
| `00-INDEX.md` | Ce fichier — vue d'ensemble et mode d'emploi |
| `01-VISION-PRODUIT.md` | Mission, objectifs, différenciation concurrentielle, roadmap, stratégie long terme |
| `02-ARCHITECTURE-TECHNIQUE.md` | Stack complète, structure des dossiers, conventions de code, configuration Next.js/Vercel/Supabase |
| `03-CONTENU-DONNEES-CMS.md` | Modèle de données, taxonomie, "CMS" (workflow de création/publication de contenu), structure des 3 entités de contenu |
| `04-SEO-GEO-AEO.md` | Stratégie SEO complète, GEO (optimisation pour IA génératives), AEO (optimisation réponses), schémas JSON-LD, maillage interne, sitemap |
| `05-DESIGN-SYSTEM-UX.md` | Palette, typographie, animations, composants, responsive, accessibilité, philosophie UX |
| `06-OUTILS-FEATURES.md` | Simulateur budget, Comparateur villes, Calendrier Campus France, Checklist PDF, emails transactionnels, Supabase, dashboard admin |
| `07-CLAUDE-CODE-WORKFLOW.md` | Comment Claude Code a été utilisé sur ce projet : skill `dalili-master`, mémoire, MCP, conventions, historique des décisions |
| `08-DETTE-TECHNIQUE-ROADMAP-CRITIQUE.md` | Bugs connus (dont un vérifié en profondeur), dette technique, ce qu'il ne faut jamais casser, analyse critique et 100 prochaines priorités |
| `09-METHODE-DE-TRAVAIL-IMPLICITE.md` | Ce qui n'est PAS dans le dépôt : workflow exact de génération d'article, méthode de recherche/analyse concurrentielle, choix des sources officielles, détection des changements réglementaires, usage de Google Search Console, priorisation, MCP/outils réellement utilisés, erreurs toujours évitées, décisions prises avant de coder, projets prévus non implémentés |
| `10-VISION-STRATEGIQUE-PROFONDE.md` | Mission profonde (pourquoi "دليلي"), Dalili dans 2 ans, fonctionnalités prioritaires vs. refusées, perception utilisateur visée, KPI en cascade, méthode d'arbitrage entre options, niveau d'exigence design, définition de "travail terminé" |
| `11-ETAT-SEO-COURANT.md` | Brief de synchro daté (2026-08-06) : quels bugs de `08` sont réellement corrigés depuis, conventions non écrites (règle 301, `cluster:` frontmatter vs `CLUSTER_MAP`, `HIGH_PRIORITY_SLUGS`, process `regulatory-figures.ts`), `updatedDate` manquants, état build/lint/Graphify à HEAD |

---

## Résumé en 30 secondes (si tu ne lis qu'une chose)

**Dalili Study** (dalili.study) est un site Next.js 14 (App Router, TypeScript) qui vise à devenir LA référence francophone pour les étudiants africains et maghrébins (Maroc, Algérie, Tunisie, Sénégal, Côte d'Ivoire, Cameroun, Liban) qui veulent étudier en France. Le produit final annoncé est une application mobile ("Bientôt disponible" sur le site) ; en attendant, le site est un immense hub de contenu SEO/GEO (65+ articles de blog, 14 fiches universités, 14 fiches villes, 6 pages pays, 5 pages FAQ, 4 outils interactifs) conçu pour capter le trafic de recherche ET pour être cité par ChatGPT/Claude/Perplexity/Google AI Overview quand ils répondent à des questions sur les études en France.

Le site n'a **pas de CMS traditionnel** : le contenu blog vit dans des fichiers `.mdx` avec frontmatter (`gray-matter`), et les données universités/villes vivent dans des objets TypeScript codés en dur dans `lib/universities.ts` et `lib/cities.ts`. Publier un article = créer un fichier `.mdx` et déployer (Vercel, déploiement continu sur push `main` a priori — pas de CI/CD formalisée trouvée dans le repo).

Le fondateur (Aymane Amri) code avec Claude Code depuis plusieurs mois, avec une discipline stricte : **jamais de chiffre écrit de mémoire** — tout montant (frais de scolarité, CVEC, plafonds horaires de travail, montants CAF) doit être vérifié sur une source officielle avant publication. Cette discipline a une trace concrète dans l'historique git (une série de commits `fix:` corrigeant des chiffres obsolètes détectés a posteriori).

**Point d'attention immédiat** trouvé pendant cet audit : une incohérence de données réelle et non corrigée existe aujourd'hui dans `lib/universities.ts` — voir `08-DETTE-TECHNIQUE-ROADMAP-CRITIQUE.md`, section "Bug vérifié en profondeur".

---

## Informations de contact / identité projet

- Domaine de production : **dalili.study** (`NEXT_PUBLIC_SITE_URL`)
- Ancien domaine (redirigé en 301 vers dalili.study) : `dalili-waitlist.vercel.app`
- `www.dalili.study` est aussi redirigé en 301 vers `dalili.study` (voir `vercel.json`)
- Repo local : `/Users/macdc/Desktop/work/dalili-next`
- Git user configuré : Aymane Amri
- Email admin (reçoit les notifications waitlist/simulateur) : `boyayman388@gmail.com`
- Réseaux mentionnés dans le schema.org Organization : Facebook `dalili.guide`, Twitter/X `@dalilistudy`
- Fondation : 2025 (`foundingDate` dans le JSON-LD Organization), lancement du contenu blog en volume : ~mai-juillet 2026
- Hébergement : Vercel (voir `vercel.json`, `@vercel/speed-insights` en dépendance — bien que le commit `ac994eb` ait justement **retiré** le badge Speed Insights visible)
- Base de données : Supabase (projet ref visible dans `.mcp.json` : `aiyyvgdrtaxvtedcuxnn`), utilisée uniquement pour la table `waitlist`
- Emails transactionnels : Resend (`bonjour@dalili.study`)
- Analytics : Google Tag Manager (`GTM-WTNNC952`) + Google Analytics 4 (`G-95T08PB2MV`)

---

## Ce que ce dossier NE contient PAS

- Les secrets (clés API, tokens) — jamais copiés, seulement les noms de variables d'environnement.
- Une copie exhaustive des 65+ articles de blog — seuls des extraits représentatifs sont cités pour illustrer les conventions. Le contenu réel est dans `content/blog/*.mdx`.
- Des captures d'écran ou rendus visuels — ce dossier est uniquement textuel. Pour voir le rendu réel, lancer `npm run dev` et ouvrir `localhost:3000`.

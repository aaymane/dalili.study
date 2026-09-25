# Graph Report - dalili-next  (2026-08-06)

## Corpus Check
- 285 files · ~8,315,249 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1472 nodes · 1833 edges · 117 communities (105 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5e456495`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- calendrier-pdf.ts
- dependencies
- CalendrierEmail.ts
- RelatedArticles.tsx
- ClientHomePage.tsx
- devDependencies
- assistant/route.ts
- app/layout.tsx
- SearchableBlogGrid.tsx
- compilerOptions
- universites/[slug]/page.tsx
- comparer-pdf.ts
- simulateur-pdf.ts
- SimulateurBudget.tsx
- cities.ts
- site-stats.ts
- stats/page.tsx
- ChecklistPDF.tsx
- visa-etudiant-france-algerie-2026.mdx
- a-propos/page.tsx
- ComparateurVilles.tsx
- admin/page.tsx
- regulatory-figures.ts
- generate-embeddings.mjs
- checklist/page.tsx
- x
- x
- comparer/route.ts
- IntroAnimation.tsx
- CLAUDE.md
- campusfrance-senegal-guide-inscription-dakar.mdx
- AssistantPanel.tsx
- BlogPreviewSection.jsx
- engine-left
- engine-right
- fuselage
- landing-gear
- nose
- tail
- tail-h
- wing-left
- wing-right
- checklist/opengraph-image.tsx
- comparer/page.tsx
- PartnersSection.jsx
- blog/layout.tsx
- arrivee-france-etudiant/page.tsx
- budget-etudiant-france/page.tsx
- campus-france/page.tsx
- logement-etudiant-france/page.tsx
- visa-etudiant-france/page.tsx
- Footer.jsx
- carte-vitale-etudiant-etranger-guide.mdx
- TestimonialsSection.jsx
- middleware.ts
- parts
- confidentialite/page.tsx
- mentions-legales/page.tsx
- DALILIMockup.jsx
- extends
- generateFavicon.mjs
- test-email/route.ts
- contact/page.tsx
- PlaneCinematic.jsx
- declarations.d.ts
- .mcp.json
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- vercel.json
- titre-sejour-etudiant-france-renouvellement.mdx
- contester-refus-visa-campus-france.mdx
- delf-dalf-vs-tcf-etudiant-etranger-france.mdx
- DALILI STUDY — Dossier de transmission complet
- 11 — État SEO courant (brief de synchronisation)
- reforme-apl-etudiant-etranger-2026.mdx
- visa-etudiant-france-tout-savoir-avant-partir.mdx
- blog.ts
- garant-logement-etudiant-etranger-france.mdx
- logement-crous-etudiant-etranger-demande.mdx
- app/page.tsx
- compte-bloque-visa-etudiant-france-guide.mdx
- securite-sociale-etudiante-france-inscription.mdx
- frais-scolarite-universite-france-etudiant-etranger-2026.mdx
- visa-etudiant-france-maroc-2026.mdx
- getAllPosts
- pass-las-etudiant-etranger-medecine-france.mdx
- etudier-a-lyon.mdx
- [slug]/opengraph-image.tsx
- JourneySection.jsx
- etudier-a-nantes.mdx
- etudier-a-bordeaux.mdx
- etudier-a-paris.mdx
- etudier-a-lille.mdx
- etudier-a-toulouse.mdx
- etudier-a-grenoble.mdx
- etudier-a-montpellier.mdx
- etudier-a-rennes.mdx
- etudier-a-strasbourg.mdx
- etudier-a-clermont-ferrand.mdx
- etudier-a-dijon.mdx
- etudier-a-marseille.mdx
- etudier-a-nice.mdx
- ToolsSection.tsx
- CalendrierOutil.tsx
- HeroSection.jsx
- DALILIPhones.jsx
- calendrier-data.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `getAllPosts()` - 13 edges
3. `divider()` - 11 edges
4. `sectionLabel()` - 11 edges
5. `ctaButton()` - 11 edges
6. `emailBase()` - 11 edges
7. `generateComparateurPDF()` - 11 edges
8. `ArticlePage()` - 10 edges
9. `getTierAt()` - 10 edges
10. `formatTierValue()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `generateStaticParams()` --calls--> `getAllUniversitySlugs()`  [EXTRACTED]
  app/universites/[slug]/page.tsx → lib/universities.ts
- `POST()` --calls--> `renderWaitlistEmail()`  [EXTRACTED]
  app/api/subscribe/route.ts → emails/WaitlistEmail.ts
- `generateStaticParams()` --calls--> `getAllCitySlugs()`  [EXTRACTED]
  app/villes/[slug]/page.tsx → lib/cities.ts
- `Props` --references--> `City`  [EXTRACTED]
  components/villes/SearchableVillesGrid.tsx → lib/cities.ts
- `POST()` --calls--> `renderCalendrierEmail()`  [EXTRACTED]
  app/api/calendrier/route.ts → emails/CalendrierEmail.ts

## Import Cycles
- None detected.

## Communities (117 total, 12 thin omitted)

### Community 0 - "calendrier-pdf.ts"
Cohesion: 0.20
Nodes (15): C_BLUE, C_BLUE_DARK, C_BODY, C_DARK_CARD, C_MID, C_WHITE, centered(), cleanText() (+7 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (47): @anthropic-ai/sdk, framer-motion, gray-matter, gsap, @gsap/react, lenis, lucide-react, next (+39 more)

### Community 2 - "CalendrierEmail.ts"
Cohesion: 0.15
Nodes (32): articleLink(), BudgetResultEmailProps, COMMON_ARTICLES, PAYS_ARTICLES, renderBudgetResultEmail(), tableRow(), renderCalendrierEmail(), stepCard() (+24 more)

### Community 3 - "RelatedArticles.tsx"
Cohesion: 0.06
Nodes (21): faqJsonLd, jsonLd, metadata, faqJsonLd, jsonLd, metadata, faqJsonLd, jsonLd (+13 more)

### Community 4 - "ClientHomePage.tsx"
Cohesion: 0.14
Nodes (12): BlogPreviewSection, EmailCapture, FAQSection, FeaturesSection, Footer, HomePageProps, IntroAnimation, JourneySection (+4 more)

### Community 5 - "devDependencies"
Cohesion: 0.06
Nodes (34): critters, eslint, eslint-config-next, devDependencies, critters, eslint, eslint-config-next, playwright (+26 more)

### Community 6 - "assistant/route.ts"
Cohesion: 0.10
Nodes (28): checkAuth(), DELETE(), GET(), PATCH(), unauthorized(), MatchedChunk, ndjsonLine(), POST() (+20 more)

### Community 7 - "app/layout.tsx"
Cohesion: 0.07
Nodes (24): breadcrumbSchema, ctaButtonStyle, FAQ_ITEMS, faqSchema, metadata, TOPICS, bebasNeue, dmSans (+16 more)

### Community 8 - "SearchableBlogGrid.tsx"
Cohesion: 0.24
Nodes (9): Props, Props, normalize(), Props, SearchableBlogGrid(), CATEGORY_COLORS, CLUSTER_DEFINITIONS, formatDate() (+1 more)

### Community 9 - "compilerOptions"
Cohesion: 0.08
Nodes (25): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+17 more)

### Community 10 - "universites/[slug]/page.tsx"
Cohesion: 0.18
Nodes (12): generateMetadata(), generateStaticParams(), UNI_SEO, UniversityPage(), CITY_SEO, generateMetadata(), VillePage(), extractFaqItems() (+4 more)

### Community 11 - "comparer-pdf.ts"
Cohesion: 0.12
Nodes (22): C_BLUE, C_BLUE_DARK, C_BODY, C_GOLD, C_GREEN, C_MID, C_ORANGE, C_ROW_A (+14 more)

### Community 12 - "simulateur-pdf.ts"
Cohesion: 0.11
Nodes (19): LOGEMENT_LABELS, NIVEAU_LABELS, PAYS_LABELS, POST(), VILLE_LABELS, getDaliliLogoPng(), C_BLUE, C_BLUE_DARK (+11 more)

### Community 13 - "SimulateurBudget.tsx"
Cohesion: 0.12
Nodes (18): Answers, BOURSE_NOTE, CAF_ELIGIBLE_BOURSE, CAF_ESTIMATE, card(), CITIES, CityData, compteBloqueAdjacent (+10 more)

### Community 14 - "cities.ts"
Cohesion: 0.17
Nodes (11): jsonLd, metadata, ACCENT, jsonLd, metadata, ACCENT, normalize(), Props (+3 more)

### Community 15 - "site-stats.ts"
Cohesion: 0.18
Nodes (11): ACCENT, COMPARISON, jsonLd, metadata, ACCENT, normalize(), Props, SearchableUniversitesGrid() (+3 more)

### Community 16 - "stats/page.tsx"
Cohesion: 0.14
Nodes (14): BORDEAUX_BREAKDOWN, CITY_BUDGET, compteBloqueAdjacent, compteBloqueNow, cvecNow, datasetSchema, doctoratNow, licenceNow (+6 more)

### Community 17 - "ChecklistPDF.tsx"
Cohesion: 0.14
Nodes (8): dynamic, GET(), runtime, ChecklistPDF(), cvecTier, S, react, react

### Community 18 - "visa-etudiant-france-algerie-2026.mdx"
Cohesion: 0.06
Nodes (31): 1. Attendre la fin de l'année universitaire algérienne pour commencer Campus France, 2. Ne pas prendre le rendez-vous VFS Global assez tôt, 3. Mal préparer l'entretien Campus France, 4. Ne pas avoir les bons actes de naissance algériens, 5. Oublier la restriction de travail dans le calcul budgétaire, CAF — vérifier ton éligibilité, puis demander dès le premier jour, Candidatures en Master (M1 ou M2), Ce que cela représente concrètement (+23 more)

### Community 19 - "a-propos/page.tsx"
Cohesion: 0.25
Nodes (6): coverage, { guidesCount, villesCount, paysNommesCount }, jsonLd, metadata, stats, AboutJoinForm()

### Community 20 - "ComparateurVilles.tsx"
Cohesion: 0.14
Nodes (5): CITY_LIST, SCORE_LABELS, tdStyle, thStyle, VILLE_COLORS

### Community 21 - "admin/page.tsx"
Cohesion: 0.18
Nodes (8): AdminPage(), Entry, fmt(), fmtShort(), SimulateurData, Stats, Status, STATUS_CFG

### Community 22 - "regulatory-figures.ts"
Cohesion: 0.28
Nodes (11): buildStats(), ProblemSection(), describeAdjacentTier(), FigureTier, formatIsoDateFr(), getNextTier(), getPreviousTier(), getTierAt() (+3 more)

### Community 23 - "generate-embeddings.mjs"
Cohesion: 0.29
Nodes (11): chunkPost(), embedDocuments(), extractFaqItems(), extractKeyFacts(), main(), POSTS_DIR, slugifyHeading(), splitH2Sections() (+3 more)

### Community 24 - "checklist/page.tsx"
Cohesion: 0.20
Nodes (8): cvecNow, FAQ_ITEMS, jsonLd, metadata, PHASES, RELATED, DownloadBtn(), Props

### Community 25 - "x"
Cohesion: 0.33
Nodes (11): x, y, center, center, center, center, center, center (+3 more)

### Community 26 - "x"
Cohesion: 0.33
Nodes (11): explode, explode, x, y, explode, explode, explode, explode (+3 more)

### Community 27 - "comparer/route.ts"
Cohesion: 0.42
Nodes (7): buildRecommandation(), POST(), VILLE_COLORS, ComparateurVilles(), getScores(), recommander(), totalScore()

### Community 28 - "IntroAnimation.tsx"
Cohesion: 0.22
Nodes (8): computeSizes(), EXIT_EASE, EXPO_OUT, IntroAnimation(), PARTICLES, Phase, Sizes, SNAP

### Community 29 - "CLAUDE.md"
Cohesion: 0.09
Nodes (22): Accessibility, AI Search, Architecture, Before Writing Code, Cities, Code Review Checklist, Component Rules, Content Rules (+14 more)

### Community 30 - "campusfrance-senegal-guide-inscription-dakar.mdx"
Cohesion: 0.08
Nodes (23): Après le dépôt du dossier, Avis défavorable, Avis favorable, Calendrier optimal pour un étudiant sénégalais, Créer son compte, Documents à uploader sur la plateforme, Délai de traitement, En résumé (+15 more)

### Community 31 - "AssistantPanel.tsx"
Cohesion: 0.22
Nodes (4): ChatMessage, markdownComponents, SourceRef, STARTER_QUESTIONS

### Community 32 - "BlogPreviewSection.jsx"
Cohesion: 0.25
Nodes (6): arrowVariants, ARTICLES, containerVariants, ctaUnderlineVariants, headerOverlayVariants, itemVariants

### Community 33 - "engine-left"
Cohesion: 0.29
Nodes (7): file, height, visible, width, x, y, engine-left

### Community 34 - "engine-right"
Cohesion: 0.29
Nodes (7): file, height, visible, width, x, y, engine-right

### Community 35 - "fuselage"
Cohesion: 0.29
Nodes (7): file, height, visible, width, x, y, fuselage

### Community 36 - "landing-gear"
Cohesion: 0.29
Nodes (7): file, height, visible, width, x, y, landing-gear

### Community 37 - "nose"
Cohesion: 0.29
Nodes (7): file, height, visible, width, x, y, nose

### Community 38 - "tail"
Cohesion: 0.29
Nodes (7): tail, file, height, visible, width, x, y

### Community 39 - "tail-h"
Cohesion: 0.29
Nodes (7): tail-h, file, height, visible, width, x, y

### Community 40 - "wing-left"
Cohesion: 0.29
Nodes (7): wing-left, file, height, visible, width, x, y

### Community 41 - "wing-right"
Cohesion: 0.29
Nodes (7): wing-right, file, height, visible, width, x, y

### Community 42 - "checklist/opengraph-image.tsx"
Cohesion: 0.33
Nodes (4): alt, contentType, runtime, size

### Community 43 - "comparer/page.tsx"
Cohesion: 0.33
Nodes (4): ComparateurVilles, jsonLd, metadata, CITY_SCORES

### Community 44 - "PartnersSection.jsx"
Cohesion: 0.33
Nodes (4): cardVariants, CAT, containerVariants, PARTNERS

### Community 45 - "blog/layout.tsx"
Cohesion: 0.40
Nodes (3): Footer, metadata, Navbar

### Community 46 - "arrivee-france-etudiant/page.tsx"
Cohesion: 0.40
Nodes (3): FAQ_ITEMS, faqSchema, metadata

### Community 47 - "budget-etudiant-france/page.tsx"
Cohesion: 0.40
Nodes (3): FAQ_ITEMS, faqSchema, metadata

### Community 48 - "campus-france/page.tsx"
Cohesion: 0.40
Nodes (3): FAQ_ITEMS, faqSchema, metadata

### Community 49 - "logement-etudiant-france/page.tsx"
Cohesion: 0.40
Nodes (3): FAQ_ITEMS, faqSchema, metadata

### Community 50 - "visa-etudiant-france/page.tsx"
Cohesion: 0.40
Nodes (3): FAQ_ITEMS, faqSchema, metadata

### Community 52 - "carte-vitale-etudiant-etranger-guide.mdx"
Cohesion: 0.15
Nodes (12): Ce que fait Dalili, "CMU" n'existe plus : ce qu'il faut dire aujourd'hui, Combien de temps au total, réalistement ?, FAQ — Carte Vitale étudiant étranger, Les blocages fréquents et comment les débloquer, Liens utiles, Numéro de sécu, attestation, carte Vitale : ce que chaque terme désigne, Que faire en attendant ta Carte Vitale (+4 more)

### Community 53 - "TestimonialsSection.jsx"
Cohesion: 0.40
Nodes (3): cardVariants, containerVariants, TESTIMONIALS

### Community 54 - "middleware.ts"
Cohesion: 0.60
Nodes (3): config, middleware(), createClient()

### Community 55 - "parts"
Cohesion: 0.40
Nodes (4): parts, sourceSize, height, width

### Community 59 - "extends"
Cohesion: 0.50
Nodes (3): extends, next/core-web-vitals, next/typescript

### Community 60 - "generateFavicon.mjs"
Cohesion: 0.50
Nodes (3): pngs, svgContent, svgPath

### Community 61 - "test-email/route.ts"
Cohesion: 0.60
Nodes (4): checkAuth(), dynamic, GET(), unauthorized()

### Community 79 - "titre-sejour-etudiant-france-renouvellement.mdx"
Cohesion: 0.11
Nodes (17): Cas spéciaux : changement de formation et césure, Ce que fait Dalili, Documents nécessaires pour le renouvellement, FAQ — Titre de séjour étudiant France renouvellement, La procédure de renouvellement sur ANEF, Le récépissé : ton titre de séjour provisoire, Les délais en préfecture : la vérité, Les erreurs à éviter (+9 more)

### Community 80 - "contester-refus-visa-campus-france.mdx"
Cohesion: 0.12
Nodes (16): Avis défavorable Campus France vs refus de visa consulaire — quelle différence ?, Comment éviter un deuxième refus — checklist complète, En résumé, FAQ — Refus de visa et Campus France défavorable, Les vrais motifs de refus — ce que les consulats ne disent jamais clairement, Peut-on déposer un dossier visa malgré un avis défavorable ?, Que faire après un avis défavorable Campus France, Que faire après un refus de visa consulaire (+8 more)

### Community 81 - "delf-dalf-vs-tcf-etudiant-etranger-france.mdx"
Cohesion: 0.12
Nodes (16): Algérie, Ce qu'accepte Campus France, Ce que fait Dalili, DALF (Diplôme Approfondi de Langue Française), DELF (Diplôme d'Études en Langue Française), FAQ — DELF DALF TCF pour visa étudiant France, La différence cruciale : validité à vie vs 2 ans, Les trois certifications : différences fondamentales (+8 more)

### Community 82 - "DALILI STUDY — Dossier de transmission complet"
Cohesion: 0.33
Nodes (5): Ce que ce dossier NE contient PAS, Comment lire ce dossier, DALILI STUDY — Dossier de transmission complet, Informations de contact / identité projet, Résumé en 30 secondes (si tu ne lis qu'une chose)

### Community 83 - "11 — État SEO courant (brief de synchronisation)"
Cohesion: 0.33
Nodes (5): 11 — État SEO courant (brief de synchronisation), 1. Roadmap SEO — où on en est réellement, 2. Conventions non écrites, 3. Problèmes connus non corrigés, 4. État technique

### Community 84 - "reforme-apl-etudiant-etranger-2026.mdx"
Cohesion: 0.12
Nodes (16): 1. Tu es ressortissant UE, EEE ou Suisse, 2. Tu es boursier sur critères sociaux (CROUS), 3. Tu es en contrat d'apprentissage, 4. Tu es en contrat de professionnalisation, 5. Tu exerces une activité professionnelle, Ce que fait Dalili, Ce qui a changé, en une phrase, Cela s'applique-t-il si je touchais déjà l'APL avant juillet 2026 ? (+8 more)

### Community 85 - "visa-etudiant-france-tout-savoir-avant-partir.mdx"
Cohesion: 0.12
Nodes (16): Après l'arrivée : la validation OFII — étape critique souvent oubliée, Ce que fait Dalili, Checklist complète avant le départ, Combien ça coûte ?, Comment valider l'OFII ?, Documents à préparer pour le dossier visa, FAQ — Visa étudiant France, La procédure Campus France — pays par pays (+8 more)

### Community 86 - "blog.ts"
Cohesion: 0.17
Nodes (16): ArticlePage(), ReadingProgressBar, TableOfContents, ClusterLinks(), KeyFacts(), KeyFactsProps, Callout(), WaitlistCTA() (+8 more)

### Community 87 - "garant-logement-etudiant-etranger-france.mdx"
Cohesion: 0.12
Nodes (15): Ce que fait Dalili, Comment convaincre un propriétaire sans garant, Comment s'inscrire sur visale.fr, Comment ça fonctionne, D'autres éléments qui rassurent un propriétaire, FAQ — Garant logement étudiant étranger France, Les erreurs à éviter, Limites de VISALE (+7 more)

### Community 88 - "logement-crous-etudiant-etranger-demande.mdx"
Cohesion: 0.14
Nodes (13): Ce qu'il faut renseigner dans le DSE, Ce que fait Dalili, Comment fonctionnent les points de priorité ?, Comment optimiser son dossier, FAQ — Logement CROUS étudiant étranger, Le calendrier : l'erreur que font 80 % des étudiants étrangers, Le CROUS : qu'est-ce que c'est et quels logements propose-t-il ?, Le DSE : l'étape clé que beaucoup ratent (+5 more)

### Community 89 - "app/page.tsx"
Cohesion: 0.19
Nodes (9): faqSchema, Home(), metadata, orgSchema, websiteSchema, ClientHomePage(), rowVariants, getSiteStats() (+1 more)

### Community 90 - "compte-bloque-visa-etudiant-france-guide.mdx"
Cohesion: 0.17
Nodes (11): Ce que fait Dalili, Comment ouvrir un compte bloqué ou une AVI depuis la Tunisie, Comment se passe le déblocage des fonds une fois en France, Compte bloqué : de quoi parle-t-on exactement ?, Compte bloqué vs garant vs bourse : quelle solution choisir ?, FAQ — Compte bloqué visa étudiant France, Les erreurs à éviter, Liens utiles (+3 more)

### Community 91 - "securite-sociale-etudiante-france-inscription.mdx"
Cohesion: 0.40
Nodes (4): Ce que fait Dalili, Ce qui a changé en 2019 : la réforme étudiante, FAQ — Sécurité sociale étudiante France, Les 3 étapes, en bref

### Community 92 - "frais-scolarite-universite-france-etudiant-etranger-2026.mdx"
Cohesion: 0.18
Nodes (10): Ce qu'il faut faire avant de choisir ton université, Ce que fait Dalili, Comparatif France vs Europe, CVEC 2026 : contribution obligatoire, Exonérations 2026-2027 : un nouveau plafond de 30 %, Exonérations possibles, FAQ — Frais de scolarité en France pour étudiants étrangers, Frais réels université par université (+2 more)

### Community 93 - "visa-etudiant-france-maroc-2026.mdx"
Cohesion: 0.18
Nodes (10): Ce que fait Dalili, Comment valider ton VLS-TS, Documents à préparer pour le visa étudiant maroc, FAQ — Visa étudiant France depuis le Maroc, Les délais réels : combien de temps prévoir ?, Les erreurs à éviter, Pourquoi la procédure est différente depuis le Maroc, Étape 1 : Campus France Maroc (+2 more)

### Community 94 - "getAllPosts"
Cohesion: 0.24
Nodes (10): BlogPage(), FEATURED_SLUGS, metadata, generateStaticParams(), HIGH_PRIORITY_SLUGS, sitemap(), generateStaticParams(), getAllPosts() (+2 more)

### Community 95 - "pass-las-etudiant-etranger-medecine-france.mdx"
Cohesion: 0.20
Nodes (9): Ce que fait Dalili, Ce qui a vraiment changé en 2025 : la loi Neuder, FAQ — Numerus apertus et PASS/LAS pour étudiant étranger, Le LAS (Licence avec Accès Santé), Le PASS (Parcours d'Accès Spécifique Santé), Le taux de passage réel, Les formations accessibles au-delà de la médecine, PASS et LAS : les deux portes d'entrée (+1 more)

### Community 96 - "etudier-a-lyon.mdx"
Cohesion: 0.06
Nodes (30): 1er et 4e arrondissements — Croix-Rousse / Pentes, 3e arrondissement — Part-Dieu / Montchat, 7e arrondissement — Jean Macé / Guillotière, 8e arrondissement — Mermoz / Laennec, Alimentation, Autres dépenses, Budget confortable (colocation + sorties modérées), Budget serré (chambre CROUS + discipline) (+22 more)

### Community 97 - "[slug]/opengraph-image.tsx"
Cohesion: 0.25
Nodes (8): CAT, contentType, DEFAULT_CAT, OgImage(), runtime, size, generateMetadata(), getRawPost()

### Community 98 - "JourneySection.jsx"
Cohesion: 0.40
Nodes (3): containerVariants, STEPS, stepVariants

### Community 99 - "etudier-a-nantes.mdx"
Cohesion: 0.07
Nodes (29): Alimentation, Audencia Business School, Autres dépenses, Budget confortable (colocation + sorties), Budget serré (chambre CROUS + rigueur), Budget à l'aise (studio privé + vie active), Budgets types pour un étudiant à Nantes, Canclaux / Procé — Le Quartier Résidentiel Calme (+21 more)

### Community 100 - "etudier-a-bordeaux.mdx"
Cohesion: 0.07
Nodes (26): Alimentation, Autres dépenses, Bacalan / Darwin — Le quartier alternatif, Bordeaux Centre / Triangle d'Or, Bordeaux vs Paris : que choisir ?, Bordeaux vs Toulouse, Budget confortable (studio + sorties modérées), Budget serré (chambre CROUS + discipline) (+18 more)

### Community 101 - "etudier-a-paris.mdx"
Cohesion: 0.07
Nodes (26): 13e arrondissement — Tolbiac / Ivry, 18e arrondissement — Barbès / La Chapelle, 19e / 20e arrondissements — Buttes Chaumont / Belleville, 5e arrondissement — Le Quartier Latin, Alimentation, Autres dépenses, Budget confortable (studio + vie sociale active), Budget minimum viable (banlieue + discipline absolue) (+18 more)

### Community 102 - "etudier-a-lille.mdx"
Cohesion: 0.10
Nodes (20): Alimentation, Budget confortable (colocation Wazemmes), Budget très serré (chambre CROUS + discipline), Budget à l'aise (studio Vieux-Lille), Budgets types pour un étudiant à Lille, Centrale Lille, Coût de la vie à Lille en 2026, EDHEC Business School (+12 more)

### Community 103 - "etudier-a-toulouse.mdx"
Cohesion: 0.10
Nodes (20): Alimentation, Budget confortable (colocation + sorties modérées), Budget serré (chambre CROUS + discipline), Budget à l'aise (studio privé), Budgets types pour un étudiant à Toulouse, Coût de la vie à Toulouse en 2026, FAQ — Étudier à Toulouse en tant qu'étudiant étranger, INP Toulouse et EM Toulouse Business School (+12 more)

### Community 104 - "etudier-a-grenoble.mdx"
Cohesion: 0.10
Nodes (19): Alimentation, Budget confortable (colocation), Budget serré (chambre CROUS + discipline), Budget à l'aise (studio privé), Budgets types pour un étudiant à Grenoble, Coût de la vie à Grenoble en 2026, FAQ — Étudier à Grenoble en tant qu'étudiant étranger, Grenoble INP (+11 more)

### Community 105 - "etudier-a-montpellier.mdx"
Cohesion: 0.10
Nodes (19): Alimentation et vie quotidienne, Budget confortable (colocation + plage le week-end), Budget serré (chambre CROUS + rigueur), Budget à l'aise (studio près du centre), Budgets types pour un étudiant à Montpellier, Coût de la vie à Montpellier en 2026, FAQ — Étudier à Montpellier en tant qu'étudiant étranger, Jobs étudiants à Montpellier (+11 more)

### Community 106 - "etudier-a-rennes.mdx"
Cohesion: 0.10
Nodes (19): Alimentation, Budget confortable (colocation), Budget serré (chambre CROUS + discipline), Budget à l'aise (studio privé), Budgets types pour un étudiant à Rennes, Coût de la vie à Rennes en 2026, FAQ — Étudier à Rennes en tant qu'étudiant étranger, INSA Rennes (+11 more)

### Community 107 - "etudier-a-strasbourg.mdx"
Cohesion: 0.10
Nodes (19): Alimentation, Budget confortable (colocation + sorties), Budget serré (chambre CROUS + vélo), Budget à l'aise (studio), Budgets types pour un étudiant à Strasbourg, Coût de la vie à Strasbourg en 2026, EM Strasbourg Business School, FAQ — Étudier à Strasbourg en tant qu'étudiant étranger (+11 more)

### Community 108 - "etudier-a-clermont-ferrand.mdx"
Cohesion: 0.11
Nodes (18): Alimentation, Budget confortable (colocation), Budget serré (chambre CROUS + discipline), Budget à l'aise (studio privé), Budgets types pour un étudiant à Clermont-Ferrand, Clermont-Ferrand vs Dijon, Coût de la vie à Clermont-Ferrand en 2026, ESC Clermont Business School (+10 more)

### Community 109 - "etudier-a-dijon.mdx"
Cohesion: 0.11
Nodes (18): AgroSup Dijon, Alimentation, BSB — Burgundy School of Business, Budget confortable (colocation), Budget serré (chambre CROUS + discipline), Budget à l'aise (studio privé), Budgets types pour un étudiant à Dijon, Coût de la vie à Dijon en 2026 (+10 more)

### Community 110 - "etudier-a-marseille.mdx"
Cohesion: 0.11
Nodes (18): Aix-Marseille Université, Alimentation, Budget confortable (colocation quartier résidentiel), Budget très serré (CROUS + discipline), Budget à l'aise (studio centre ou bord de mer), Budgets types pour un étudiant à Marseille, Coût de la vie à Marseille en 2026, FAQ — Étudier à Marseille en tant qu'étudiant étranger (+10 more)

### Community 111 - "etudier-a-nice.mdx"
Cohesion: 0.11
Nodes (18): Alimentation, Budget confortable (colocation), Budget serré (chambre CROUS + discipline), Budget à l'aise (studio privé), Budgets types pour un étudiant à Nice, Coût de la vie à Nice en 2026, EDHEC Nice, FAQ — Étudier à Nice en tant qu'étudiant étranger (+10 more)

### Community 112 - "ToolsSection.tsx"
Cohesion: 0.14
Nodes (7): jsonLd, metadata, CalendrierOutil(), ACCENT_RGB, TOOLS, PAYS_INFO, RENTREES

### Community 113 - "CalendrierOutil.tsx"
Cohesion: 0.14
Nodes (7): PAYS_LIST, RENTREE_LIST, URGENCE_BG, URGENCE_COLOR, URGENCE_LABEL, CalendrierEmailProps, CalendrierStep

### Community 114 - "HeroSection.jsx"
Cohesion: 0.25
Nodes (8): HeroSection(), LINES, ParisSkyline, PlaneCinematic, LenisProvider(), Props, NOTE: No lagSmoothing(0) — it breaks concurrent GSAP timelines (LogoReveal,…, loadGsap()

### Community 115 - "DALILIPhones.jsx"
Cohesion: 0.24
Nodes (8): BACK_STY, backPos(), DALILIPhones(), FRONT_STY, frontPos(), P1_H, P2_H, PHONES

### Community 116 - "calendrier-data.ts"
Cohesion: 0.31
Nodes (6): POST(), genererCalendrier(), monthLabel(), MONTHS_FR, PaysInfo, Urgence

## Knowledge Gaps
- **877 isolated node(s):** `Pourquoi choisir Bordeaux pour ses études ?`, `Université de Bordeaux`, `Sciences Po Bordeaux`, `KEDGE Business School`, `Logement — votre plus grande dépense` (+872 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `ChecklistPDF.tsx`, `devDependencies`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `LenisProvider()` connect `HeroSection.jsx` to `dependencies`, `ClientHomePage.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `lenis` connect `dependencies` to `HeroSection.jsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `Pourquoi choisir Bordeaux pour ses études ?`, `Université de Bordeaux`, `Sciences Po Bordeaux` to the rest of the system?**
  _877 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `CalendrierEmail.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14793741109530584 - nodes in this community are weakly interconnected._
- **Should `RelatedArticles.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05731707317073171 - nodes in this community are weakly interconnected._
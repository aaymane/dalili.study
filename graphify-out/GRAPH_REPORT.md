# Graph Report - dalili-next  (2026-08-06)

## Corpus Check
- 277 files · ~8,309,921 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 911 nodes · 1303 edges · 79 communities (66 shown, 13 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `19c6f792`
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
- blog.ts
- compilerOptions
- universites/[slug]/page.tsx
- comparer-pdf.ts
- simulateur-pdf.ts
- SimulateurBudget.tsx
- cities.ts
- universites/page.tsx
- stats/page.tsx
- ChecklistPDF.tsx
- blog/[slug]/page.tsx
- site-stats.ts
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
- [slug]/opengraph-image.tsx
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
- sitemap.ts
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
- `POST()` --calls--> `renderWaitlistEmail()`  [EXTRACTED]
  app/api/subscribe/route.ts → emails/WaitlistEmail.ts
- `generateStaticParams()` --calls--> `getAllPosts()`  [EXTRACTED]
  app/blog/[slug]/page.tsx → lib/blog.ts
- `generateStaticParams()` --calls--> `getAllCitySlugs()`  [EXTRACTED]
  app/villes/[slug]/page.tsx → lib/cities.ts
- `Props` --references--> `City`  [EXTRACTED]
  components/villes/SearchableVillesGrid.tsx → lib/cities.ts
- `generateStaticParams()` --calls--> `getAllUniversitySlugs()`  [EXTRACTED]
  app/universites/[slug]/page.tsx → lib/universities.ts

## Import Cycles
- None detected.

## Communities (79 total, 13 thin omitted)

### Community 0 - "calendrier-pdf.ts"
Cohesion: 0.06
Nodes (36): POST(), jsonLd, metadata, CalendrierOutil(), PAYS_LIST, RENTREE_LIST, URGENCE_BG, URGENCE_COLOR (+28 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (47): @anthropic-ai/sdk, framer-motion, gray-matter, gsap, @gsap/react, lucide-react, next, next-mdx-remote (+39 more)

### Community 2 - "CalendrierEmail.ts"
Cohesion: 0.15
Nodes (32): articleLink(), BudgetResultEmailProps, COMMON_ARTICLES, PAYS_ARTICLES, renderBudgetResultEmail(), tableRow(), renderCalendrierEmail(), stepCard() (+24 more)

### Community 3 - "RelatedArticles.tsx"
Cohesion: 0.06
Nodes (20): faqJsonLd, jsonLd, metadata, faqJsonLd, jsonLd, metadata, faqJsonLd, jsonLd (+12 more)

### Community 4 - "ClientHomePage.tsx"
Cohesion: 0.07
Nodes (30): BlogPreviewSection, EmailCapture, FAQSection, FeaturesSection, Footer, HomePageProps, IntroAnimation, JourneySection (+22 more)

### Community 5 - "devDependencies"
Cohesion: 0.06
Nodes (34): critters, eslint, eslint-config-next, devDependencies, critters, eslint, eslint-config-next, playwright (+26 more)

### Community 6 - "assistant/route.ts"
Cohesion: 0.10
Nodes (28): checkAuth(), DELETE(), GET(), PATCH(), unauthorized(), MatchedChunk, ndjsonLine(), POST() (+20 more)

### Community 7 - "app/layout.tsx"
Cohesion: 0.07
Nodes (24): breadcrumbSchema, ctaButtonStyle, FAQ_ITEMS, faqSchema, metadata, TOPICS, bebasNeue, dmSans (+16 more)

### Community 8 - "blog.ts"
Cohesion: 0.14
Nodes (19): FEATURED_SLUGS, metadata, ClusterLinks(), Props, Props, normalize(), Props, SearchableBlogGrid() (+11 more)

### Community 9 - "compilerOptions"
Cohesion: 0.08
Nodes (25): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+17 more)

### Community 10 - "universites/[slug]/page.tsx"
Cohesion: 0.22
Nodes (10): generateMetadata(), UNI_SEO, UniversityPage(), CITY_SEO, generateMetadata(), VillePage(), extractFaqItems(), BLUR_DATA (+2 more)

### Community 11 - "comparer-pdf.ts"
Cohesion: 0.12
Nodes (22): C_BLUE, C_BLUE_DARK, C_BODY, C_GOLD, C_GREEN, C_MID, C_ORANGE, C_ROW_A (+14 more)

### Community 12 - "simulateur-pdf.ts"
Cohesion: 0.11
Nodes (18): LOGEMENT_LABELS, NIVEAU_LABELS, PAYS_LABELS, POST(), VILLE_LABELS, C_BLUE, C_BLUE_DARK, C_BODY (+10 more)

### Community 13 - "SimulateurBudget.tsx"
Cohesion: 0.12
Nodes (18): Answers, BOURSE_NOTE, CAF_ELIGIBLE_BOURSE, CAF_ESTIMATE, card(), CITIES, CityData, compteBloqueAdjacent (+10 more)

### Community 14 - "cities.ts"
Cohesion: 0.17
Nodes (11): jsonLd, metadata, ACCENT, jsonLd, metadata, ACCENT, normalize(), Props (+3 more)

### Community 15 - "universites/page.tsx"
Cohesion: 0.21
Nodes (10): ACCENT, COMPARISON, jsonLd, metadata, ACCENT, normalize(), Props, SearchableUniversitesGrid() (+2 more)

### Community 16 - "stats/page.tsx"
Cohesion: 0.14
Nodes (14): BORDEAUX_BREAKDOWN, CITY_BUDGET, compteBloqueAdjacent, compteBloqueNow, cvecNow, datasetSchema, doctoratNow, licenceNow (+6 more)

### Community 17 - "ChecklistPDF.tsx"
Cohesion: 0.16
Nodes (6): dynamic, GET(), runtime, ChecklistPDF(), cvecTier, S

### Community 18 - "blog/[slug]/page.tsx"
Cohesion: 0.22
Nodes (11): ArticlePage(), generateStaticParams(), ReadingProgressBar, TableOfContents, KeyFacts(), KeyFactsProps, Callout(), mdxComponents (+3 more)

### Community 19 - "site-stats.ts"
Cohesion: 0.08
Nodes (21): coverage, { guidesCount, villesCount, paysNommesCount }, jsonLd, metadata, stats, BlogPage(), faqSchema, Home() (+13 more)

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

### Community 30 - "[slug]/opengraph-image.tsx"
Cohesion: 0.25
Nodes (8): CAT, contentType, DEFAULT_CAT, OgImage(), runtime, size, generateMetadata(), getRawPost()

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

### Community 52 - "sitemap.ts"
Cohesion: 0.43
Nodes (6): HIGH_PRIORITY_SLUGS, sitemap(), generateStaticParams(), generateStaticParams(), getAllCitySlugs(), getAllUniversitySlugs()

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

## Knowledge Gaps
- **424 isolated node(s):** `Mission`, `Product Vision`, `Product Principles`, `Development Philosophy`, `Architecture` (+419 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `ClientHomePage.tsx`, `devDependencies`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `lenis` connect `ClientHomePage.tsx` to `dependencies`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `Mission`, `Product Vision`, `Product Principles` to the rest of the system?**
  _424 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `calendrier-pdf.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05584415584415584 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `CalendrierEmail.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14793741109530584 - nodes in this community are weakly interconnected._
- **Should `RelatedArticles.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.059379217273954114 - nodes in this community are weakly interconnected._
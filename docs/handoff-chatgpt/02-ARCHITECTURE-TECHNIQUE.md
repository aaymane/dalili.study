# 02 — Architecture technique

Tout ce qui suit a été vérifié directement dans les fichiers de configuration du repo au 2026-07-20.

## Stack complète

| Couche | Techno | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 14.2.35 | **App Router** (pas Pages Router) |
| Langage | TypeScript | ^5 | `strict: true` dans tsconfig, mais plusieurs fichiers `.jsx`/`.js` coexistent (voir plus bas) |
| UI | React | ^18 | Server Components par défaut, Client Components explicites (`'use client'`) |
| Style | Tailwind CSS | ^3.4.1 | Configuré mais **peu utilisé** — la majorité des composants stylent en inline `style={{}}` (voir note "Approche de style hybride" plus bas) |
| Animation | Framer Motion | ^12.40.0 | Animations de composants React |
| Animation | GSAP + `@gsap/react` | ^3.15.0 / ^2.1.2 | Animations complexes (hero, avion, scroll-triggered) |
| Smooth scroll | Lenis | ^1.3.23 | Via `components/LenisProvider.tsx` |
| Contenu | MDX | `next-mdx-remote` ^6.0.0 | Compilation à la demande via `compileMDX` (RSC), pas de build-time MDX (pas de Contentlayer/Velite) |
| Frontmatter | `gray-matter` | ^4.0.3 | Parse le frontmatter YAML des fichiers `.mdx` |
| Markdown plugins | `remark-gfm`, `rehype-slug`, `rehype-autolink-headings` | — | GFM (tables, listes de tâches) + slugs auto sur les headings pour le sommaire (ToC) |
| Base de données | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) | ^2.108.2 / ^0.12.0 | Une seule table utilisée : `waitlist` |
| Emails transactionnels | Resend | ^6.12.4 | 5 templates dans `emails/` |
| PDF | `@react-pdf/renderer`, `pdf-lib` | ^4.5.1 / ^1.17.1 | Génération de PDF téléchargeables (checklist, résultats simulateur/comparateur/calendrier) |
| Images SVG→raster | `@resvg/resvg-js` | ^2.6.2 | Rendu de favicon/OG images |
| Analytics | `@next/third-parties` (GTM + GA4) | ^14.2.35 | Intégré nativement (pas de `<script>` manuel) |
| Perf monitoring | `@vercel/speed-insights` | ^2.0.0 | Package présent, mais le badge visuel Vercel a été retiré volontairement (commit `ac994eb`) |
| Icônes | `lucide-react` | ^1.21.0 | `optimizePackageImports` activé pour ce package dans `next.config.mjs` |
| Tests | Playwright (`@playwright/test`) | ^1.60.0 | **Installé en devDependency mais aucun fichier de test trouvé, aucun `playwright.config.*`** — dépendance inutilisée actuellement |
| Lint | ESLint (`eslint-config-next`) | ^8 / 14.2.35 | Config minimale (`.eslintrc.json` : 1 ligne) |
| Hébergement | Vercel | — | `vercel.json` gère uniquement des redirects, pas de config de build custom |

## Structure des dossiers (racine du repo)

```
dalili-next/
├── app/                    # App Router — routes, layouts, API routes
├── components/             # Composants React partagés (JSX et TSX mélangés)
├── content/                 # Contenu MDX : blog/, universites/, villes/ + images miniatures
├── data/                    # data/emails.json — fichier hérité, plus utilisé (voir 08)
├── emails/                  # Templates d'emails transactionnels (Resend)
├── lib/                     # Logique métier, accès aux données, générateurs PDF
├── public/                  # Assets statiques, sitemap.xml/robots.txt statiques (legacy — voir note), images
├── scripts/                 # scripts/generateFavicon.mjs — seul script du repo
├── supabase/                # schema.sql — schéma de la table waitlist
├── utils/supabase/          # Clients Supabase (browser/server/middleware)
├── middleware.ts            # Middleware Next.js — uniquement pour Supabase SSR
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json               # Redirects de domaine
├── seo-audit-report.md      # Audit SEO daté du 22 juin 2026 (voir 04 et 08)
└── CLAUDE.md                 # Instructions produit (voir 01)
```

### `app/` en détail

Routes statiques et dynamiques (App Router, tout en Server Components sauf mention `'use client'`) :

- `app/page.tsx` — homepage (compose `HeroSection`, `ProblemSection`, `FeaturesSection`, `JourneySection`, `TestimonialsSection`, `PartnersSection`, `BlogPreviewSection`, `EmailCapture`, `Footer` — tous dans `components/`)
- `app/layout.tsx` — root layout : fonts (Montserrat, Bebas Neue, DM Sans via `next/font/google`), metadata globale, JSON-LD `WebSite` + `Organization`, GTM/GA4, `<StarCanvas />` (fond animé partagé par toutes les pages), `<Navbar />`
- `app/blog/page.tsx` + `app/blog/[slug]/page.tsx` + `app/blog/[slug]/opengraph-image.tsx` + `app/blog/layout.tsx`
- `app/universites/page.tsx` + `app/universites/[slug]/page.tsx`
- `app/villes/page.tsx` + `app/villes/[slug]/page.tsx`
- `app/pays/etudier-en-france-depuis-{algerie,cameroun,cote-ivoire,le-maroc,senegal,tunisie}/page.tsx` — 6 pages statiques dédiées (pas de route dynamique `[pays]` — chaque pays a son propre fichier, donc son propre contenu 100% sur-mesure, pas un template générique)
- `app/faq/{arrivee-france-etudiant,budget-etudiant-france,campus-france,logement-etudiant-france,visa-etudiant-france}/page.tsx` — 5 pages FAQ dédiées GEO/AEO (détail dans `04-SEO-GEO-AEO.md`)
- `app/simulateur/page.tsx`, `app/comparer/page.tsx`, `app/calendrier/page.tsx`, `app/checklist/page.tsx` (+ `opengraph-image.tsx`) — les 4 outils interactifs
- `app/stats/page.tsx` — page de données chiffrées avec schema.org `Dataset`, pensée GEO
- `app/a-propos/page.tsx`, `app/contact/page.tsx`, `app/confidentialite/page.tsx`, `app/mentions-legales/page.tsx`
- `app/admin/page.tsx` — dashboard interne (liste des inscrits waitlist), protégé par un token statique (`ADMIN_TOKEN` env var), **pas d'authentification utilisateur réelle**
- `app/api/{admin/waitlist, calendrier, checklist, comparer, simulateur, subscribe, test-email}/route.ts` — route handlers Next.js (Route Handlers, pas API Pages Router)
- `app/sitemap.ts`, `app/robots.ts` — génération dynamique native Next.js (`MetadataRoute.Sitemap` / `MetadataRoute.Robots`)
- `app/globals.css` — feuille de style globale (voir `05-DESIGN-SYSTEM-UX.md`)
- `app/fonts/` — fichiers de police locaux Geist (héritage du template `create-next-app`, **non utilisés** dans `layout.tsx` qui charge Montserrat/Bebas Neue/DM Sans via Google Fonts à la place — dépendance/fichier mort probable)

### `components/` en détail

- Composants homepage en `.jsx` (pas `.tsx`) : `HeroSection`, `ProblemSection`, `FeaturesSection`, `JourneySection`, `TestimonialsSection`, `PartnersSection`, `BlogPreviewSection`, `Navbar`, `Footer`, `FAQSection`, `DALILIMockup`, `DALILIPhones`, `ParisSkyline`, `StarCanvas`, `PlaneCinematic`, `LogoReveal`, `EmailCapture`
- Composants plus récents/utilitaires en `.tsx` : `IntroAnimation`, `ClientHomePage`, `LenisProvider`, `AboutJoinForm`, `SimulateurBudget`, `ComparateurVilles`, `CalendrierOutil`, `ToolsSection`
- `components/blog/` — écosystème dédié au blog : `MdxComponents.jsx` (styles des balises MD rendues), `KeyFacts.tsx` (encart GEO), `ClusterLinks.tsx` (maillage par cluster géographique/thématique), `RelatedArticles.tsx` (maillage manuel), `NextReading.tsx`, `TableOfContents.jsx`, `ReadingProgressBar.jsx`, `SearchableBlogGrid.tsx` (recherche côté client sur l'index blog), `WaitlistCTA.tsx`
- `components/universites/SearchableUniversitesGrid.tsx`, `components/villes/SearchableVillesGrid.tsx` — recherche/filtre côté client sur les index
- `components/checklist/DownloadBtn.tsx`

**Note de convention** : le mélange `.jsx`/`.tsx` n'est pas un accident de migration incomplète évidente — les composants historiques (homepage, hero) sont restés en `.jsx`, et tout ce qui a été ajouté plus récemment (outils interactifs, blog) est en `.tsx` typé. `tsconfig.json` a `"allowJs": true` précisément pour permettre cette coexistence.

### `lib/` en détail — la couche "logique métier"

C'est le cœur non-visuel du projet. Fichiers clés :

- `lib/blog.ts` — accès aux fichiers MDX (`getAllPosts`, `getRawPost`), extraction de headings pour le ToC, **extraction de FAQ par regex depuis le Markdown brut** (`extractFaqItems`), système de clusters (`CLUSTER_MAP`, `getClusterArticles`, `getRelatedPosts`)
- `lib/blog-client.ts` — types et constantes partageables entre serveur et client (`PostMeta`, `CLUSTER_DEFINITIONS`, `CATEGORY_COLORS`, `formatDate`) — séparé de `blog.ts` car ce dernier importe `fs`/`path` (Node-only, ne peut pas être bundlé côté client)
- `lib/universities.ts` — objet `UNIVERSITIES: Record<string, University>` **codé en dur** (pas de fichiers séparés, pas de base de données) — 14 entrées
- `lib/cities.ts` — objet `CITIES: Record<string, City>` codé en dur — 14 entrées
- `lib/faq-data.js` — données pour la FAQ de la homepage (`FAQSection.jsx`)
- `lib/comparer-scores.ts` — scoring des villes pour l'outil Comparateur (5 critères sur 5 points chacun)
- `lib/calendrier-data.ts` — données du calendrier Campus France par pays
- `lib/blur-data.ts` — dictionnaire de placeholders blur (base64) pour `next/image`, mappés par chemin d'image
- `lib/{simulateur,comparer,calendrier}-pdf.ts`, `lib/ChecklistPDF.tsx`, `lib/pdf-logo.ts` — génération de PDF avec `@react-pdf/renderer`
- `lib/supabase-admin.ts` — client Supabase côté serveur (clé secrète, utilisé dans les Route Handlers)

## Configuration Next.js (`next.config.mjs`)

Points notables, tous vérifiés dans le fichier réel :

```js
poweredByHeader: false,          // sécurité mineure — cache la stack
compress: true,
experimental: {
  serverComponentsExternalPackages: ['@react-pdf/renderer', '@resvg/resvg-js'],
  optimizeCss: true,             // nécessite `critters` en devDependency
  optimizePackageImports: ['lucide-react', 'framer-motion'],
},
compiler: { removeConsole: true }, // supprime tous les console.log en production
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 5184000,       // 60 jours
  deviceSizes: [640, 828, 1080, 1200, 1920],
  imageSizes: [320, 480, 640, 800],
  dangerouslyAllowSVG: false,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
},
```

**Attention** : `compiler.removeConsole: true` supprime TOUS les `console.log` en prod — y compris ceux utilisés comme debug temporaire dans les Route Handlers (`app/api/simulateur/route.ts` en contient beaucoup, avec des emojis 🚀📦📧 — clairement du debug laissé en place, invisible en prod grâce à ce réglage mais qui pollue le code source et les logs en dev).

## Configuration TypeScript

`strict: true`, `moduleResolution: "bundler"`, alias `@/*` → racine du repo. `jsx: "preserve"` (Next.js gère la transformation). Un `tsconfig.tsbuildinfo` de 238 Ko est présent en local (cache d'incrémental build) — correctement exclu par `.gitignore` (`*.tsbuildinfo`), donc pas un problème réel, juste du bruit local à ignorer.

## Middleware et Supabase SSR

`middleware.ts` délègue entièrement à `utils/supabase/middleware.ts` (`createClient(request)`), sur toutes les routes sauf assets statiques (matcher exclut `_next/static`, `_next/image`, `favicon.ico`, extensions d'image/police). Ce middleware sert uniquement à rafraîchir la session Supabase SSR — il n'y a **pas d'authentification utilisateur** sur le site public (pas de login, pas de compte utilisateur). Son seul rôle pratique actuel est de préparer le terrain pour une éventuelle authentification future, ou pour l'accès admin.

## Approche de style — hybride, à connaître avant de toucher au design

**Point d'architecture le plus surprenant du projet pour quelqu'un qui arrive de l'extérieur** : bien que Tailwind CSS soit installé et configuré (`tailwind.config.ts` définit `dalili-dark`, `dalili-blue`, `dalili-bg`, les fonts `montserrat`/`open-sans`), **la quasi-totalité des pages et composants stylent via des objets `style={{...}}` inline directement en JSX/TSX**, avec des valeurs `clamp()` CSS pour le responsive, plutôt que via des classes Tailwind utilitaires (`text-lg`, `p-4`, etc.). Tailwind semble n'être utilisé que pour les directives de base (`@tailwind base/components/utilities`) et quelques classes éparses.

Les vraies "classes utilitaires" custom du projet sont dans `app/globals.css` (`.blog-card`, `.city-mdx-body`, `.hero-phones-wrap`, etc.) — un système de classes CSS globales maison, pas du Tailwind. Voir `05-DESIGN-SYSTEM-UX.md` pour le détail.

**Implication pratique pour un successeur** : ne pas essayer de "convertir en Tailwind" par réflexe de cohérence — ce serait un chantier de refactoring massif et risqué non demandé. Travailler dans le style existant (inline `style={{}}` + classes globales dans `globals.css` pour les animations/media queries qu'on ne peut pas exprimer inline) sauf si le fondateur demande explicitement une migration.

## Variables d'environnement (`.env.local`, noms seulement — jamais les valeurs)

```
RESEND_API_KEY
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
ADMIN_TOKEN
```

`ADMIN_TOKEN` protège `/admin` et `app/api/admin/waitlist/route.ts` — c'est un unique token statique, pas un système d'auth par utilisateur/rôle. Suffisant pour un dashboard interne à un seul opérateur (Aymane), mais à ne pas faire évoluer vers du multi-utilisateur sans revoir ce mécanisme.

## Déploiement

- Plateforme : **Vercel** (déduit de `vercel.json`, `@vercel/speed-insights`, et des redirects `dalili-waitlist.vercel.app`)
- `vercel.json` ne gère QUE des redirects HTTP 301 :
  1. `dalili-waitlist.vercel.app/*` → `dalili.study/*`
  2. `www.dalili.study/*` → `dalili.study/*`
  3. Un redirect spécifique d'ancien slug d'article (`/blog/visa-etudiant-france-senegal-procedure` → `/blog/visa-etudiant-france-senegal-2026`) — preuve qu'un renommage de slug a déjà eu lieu et a été géré proprement avec un 301 (bonne pratique SEO à répliquer si un slug doit être renommé un jour).
- **Aucun fichier CI/CD trouvé** (`.github/workflows` absent) — le déploiement est très probablement le déploiement automatique Vercel-Git natif (push sur `main` → build → déploiement), sans étape de test automatisée avant mise en prod.
- `npm run build` / `npm run start` sont les scripts standards `create-next-app`, rien de custom.

## Ce qui manque structurellement (résumé technique, détaillé dans `08`)

- Pas de tests automatisés actifs (Playwright installé mais orphelin)
- Pas de CI/CD formalisée
- Pas de CMS headless — tout changement de contenu = édition de fichier + déploiement
- Fichiers legacy **committés dans git et donc réellement à nettoyer** : `app/fonts/GeistVF.woff` et `app/fonts/GeistMonoVF.woff` (police Geist du template `create-next-app` d'origine, jamais chargée par `layout.tsx` qui utilise Montserrat/Bebas Neue/DM Sans à la place — fichiers morts mais versionnés)
- Fichiers legacy **locaux seulement, déjà correctement ignorés par git** (pas un vrai problème, juste à connaître) : `data/emails.json` (ancien mécanisme de capture d'emails en fichier plat, remplacé par la table Supabase `waitlist` — le fichier n'est plus écrit par le code actuel), `tsconfig.tsbuildinfo`, `.DS_Store`
- `.claude/worktrees/` : résidus de sessions d'agents Claude Code précédents (isolation de type `worktree`), présents localement mais exclus via `.git/info/exclude` — sans danger, mais peuvent être supprimés (`rm -rf .claude/worktrees`) pour faire de la place si besoin

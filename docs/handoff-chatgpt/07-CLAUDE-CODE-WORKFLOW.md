# 07 — Comment ce projet a été construit avec Claude Code

Cette section s'adresse spécifiquement à un successeur qui reprendrait le rôle "assistant IA de développement" sur ce projet (que ce soit Claude Code à nouveau, ou ChatGPT/un autre outil). Elle documente les outils, conventions et la philosophie de collaboration établis avec Aymane.

## Note méthodologique sur cette section

L'historique git complet n'a pas pu être énuméré intégralement pendant cet audit (`git rev-list --count HEAD` et `git log` au-delà d'environ 55 commits en arrière ont timeout dans l'environnement sandbox utilisé — probablement une limite d'I/O locale, pas un signal sur l'état du repo). Ce qui suit se base sur les **55 commits les plus récents**, qui suffisent largement à établir le pattern de travail. Un successeur qui veut l'historique complet doit lancer `git log --oneline` directement dans un terminal normal (hors sandbox).

## Configuration Claude Code du projet

- `.mcp.json` (versionné dans le repo) : un seul serveur MCP configuré, **Supabase** (`https://mcp.supabase.com/mcp?project_ref=aiyyvgdrtaxvtedcuxnn`), en HTTP. Cela donne à Claude Code un accès direct aux outils Supabase (lister les tables, exécuter du SQL, voir les logs, les advisors de sécurité, etc.) sans passer par le dashboard web.
- `.claude/settings.local.json` : configuration locale (permissions, non versionnée dans l'esprit — à vérifier si elle est trackée ou non selon l'environnement de qui reprend le projet).
- **Pas de commandes slash custom** (`.claude/commands/`) ni d'agents custom (`.claude/agents/`) trouvés dans le repo — la personnalisation Claude Code de ce projet se fait entièrement via le CLAUDE.md du repo + le skill utilisateur `dalili-master` (niveau compte, pas repo).

## Le skill `dalili-master` — texte intégral et rôle

Ce skill vit à `~/.claude/skills/dalili-master/SKILL.md`, **au niveau du compte Claude Code d'Aymane, pas dans le repo git** — donc il ne se transmet pas automatiquement si quelqu'un d'autre clone le repo ou si Aymane change de machine sans copier son dossier `~/.claude/skills/`. **C'est un point de fragilité de continuité à connaître** : toute la partie "philosophie augmentée" du projet (GEO/AEO/WebMCP/exigences de performance) n'existe que dans ce fichier hors-repo. Si ce skill devait être formalisé pour être transmis à une équipe ou à un autre outil (ChatGPT), il faudrait soit le copier dans le repo (ex. un fichier `docs/claude-skill-dalili-master.md`), soit s'assurer qu'il est reproduit dans les instructions système de l'outil qui reprend le projet.

Texte intégral (reproduit ici pour ne rien perdre) :

```
---
name: dalili-master
description: Elite engineering, SEO, GEO, AEO, AI Search, WebMCP, Content and UX system for Dalili Study.
---

# DALILI MASTER SYSTEM

You are the Lead Architect, SEO Director, Growth Engineer, Content Strategist,
UX Director, AI Search Specialist and Performance Engineer for Dalili Study.

Your only mission: Make Dalili Study the highest quality student platform for
studying in France.

Every action must optimize simultaneously: User Experience, SEO, GEO
(Generative Engine Optimization), AEO (Answer Engine Optimization), AI Search,
Accessibility, Performance, Conversion, Trust, Authority, Content Quality.

WEB.DEV FIRST — Before coding anything: follow web.dev, Core Web Vitals,
Lighthouse, Chrome, Next.js and Vercel best practices. Reject outdated
implementations.

PERFORMANCE — Target: Performance 100, Accessibility 100, SEO 100, Best
Practices 100. Core Web Vitals: LCP < 1.5s, INP < 100ms, CLS < 0.02. Always:
AVIF images, responsive images, preload critical assets, remove unused JS/CSS,
code splitting, lazy loading, dynamic imports, optimize bundles/hydration/rendering.

BLOG SYSTEM — Every article must contain: strong introduction, table of
contents, rich sections, FAQ section, internal links, related articles, strong
conclusion. Must demonstrate Experience/Expertise/Authority/Trustworthiness.
Avoid generic AI content. Create content better than competitors. Generate for
every article: SEO title, meta description, OpenGraph, Twitter Card, Canonical,
FAQ Schema, Article Schema, Breadcrumb Schema.

UNIVERSITIES — Always include: Overview, Rankings, Tuition, Admissions, Student
life, Campus, Housing, Scholarships, International students, FAQ. Structured
data: CollegeOrUniversity, EducationalOrganization, FAQPage, BreadcrumbList.

CITIES — Include: Cost of living, Housing, Student life, Transport,
Universities, Jobs, Weather, Advantages, Disadvantages, FAQ. Generate: City
schema, FAQ schema, Breadcrumb schema.

SEO — Every page: unique title, unique meta description, canonical, hreflang,
open graph, twitter card. Generate: XML sitemap, image sitemap, robots.txt, RSS.

INTERNAL LINKING — Automatically identify: related universities, related
cities, related articles. Create intelligent internal links.

AI SEARCH OPTIMIZATION — Optimize for ChatGPT Search, Claude Search, Gemini,
Perplexity, Google AI Mode. Every page must clearly answer: What is this? Who
is it for? Why is it useful? What should the user do next?

WEBMCP — Every important action must be machine-readable. Actions: search
university, search city, compare universities, save university, contact
advisor, submit application, read article. Expose: action, intent, inputs,
outputs, expected result. Agents must understand the website instantly.

CONTENT QUALITY — Never produce mediocre content. Always: outperform
competitors, improve readability/trust/structure/depth/engagement.

OUTPUT — For every task provide: Audit, Issues detected, Recommended fixes,
Code changes, SEO impact, Performance impact, Accessibility impact, AI Search
impact, WebMCP impact. Always choose the highest quality solution, never the
quickest one.
```

**Rappel important déjà fait dans les sections précédentes** : ce skill décrit une **discipline de travail à appliquer**, pas un état déjà atteint. La section "WebMCP" en particulier n'a **aucune trace dans le code réel** — aucune action du site n'est exposée de façon machine-readable au-delà du JSON-LD standard (qui n'est pas du WebMCP au sens agentique décrit ici). Un successeur qui voudrait industrialiser cette ambition devrait la traiter comme un chantier neuf.

## Instructions globales du compte (`~/.claude/CLAUDE.md`) — s'appliquent à TOUS les projets d'Aymane

Détaillées dans `01-VISION-PRODUIT.md`. Résumé : standards de design "élite" (Apple/Stripe/Linear/Vercel), cibles Lighthouse ≥ 95-100 partout, workflow obligatoire Audit→Analyze→Plan→Implement→Test→Optimize, interdiction de "jump directly to implementation". **Ce fichier n'est pas spécifique à Dalili** — un successeur travaillant sur un autre projet du même compte verra les mêmes exigences ; il n'y a rien de Dalili-spécifique à en retirer au-delà de ce qui est déjà répété dans le CLAUDE.md du repo et le skill.

## Mémoire Claude Code (auto-memory, propre à ce projet)

Fichiers dans `~/.claude/projects/-Users-macdc-Desktop-work-dalili-next/memory/` (hors repo, spécifique à la machine/compte) :

- **`project-overview.md`** — vue d'ensemble stack + fichiers clés (partiellement obsolète : mentionne "23 articles" alors qu'il y en a 65 aujourd'hui — la mémoire n'a pas été mise à jour au même rythme que le contenu ; à rafraîchir).
- **`blog-content-strategy.md`** — liste de 10 articles écrits en juin 2026 avec les faits différenciants trouvés par recherche (ex. repas CROUS à 1€ étendu à tous depuis le 4 mai 2026, quota de 964h calculé depuis la date du titre de séjour et pas depuis le 1er janvier, spécificités de l'accord franco-algérien de 1968, etc.) — utile comme **exemple de méthode** pour tout nouvel article, pas comme liste exhaustive à jour.
- **`feedback-research-first.md`** *(type feedback)* — règle : ne jamais écrire un article sans recherche concurrentielle préalable. **Origine** : un article a été écrit sans recherche, rejeté et supprimé par Aymane, règle imposée depuis. C'est la règle de méthode la plus importante pour quiconque génère du contenu sur ce projet.
- **`feedback-data-verification.md`** *(type feedback)* — règle : ne jamais écrire un chiffre (prix, montant, délai) de mémoire ; toujours vérifier sur une source officielle (ameli.fr, caf.fr, france-visas.gouv.fr, etc.) avant publication. C'est la règle la plus importante pour la fiabilité produit — et l'historique git (voir plus bas) montre concrètement pourquoi : plusieurs vagues de commits `fix:` ont dû corriger des chiffres devenus obsolètes (tarifs 2019 encore affichés en 2026, CVEC incorrecte, plafond d'exonération de frais de scolarité changé par décret).

**Recommandation pour la suite** : mettre à jour `project-overview.md` (nombre d'articles obsolète) et envisager de consigner une nouvelle mémoire `feedback` si Aymane formule une nouvelle règle de méthode pendant les prochaines sessions — c'est le mécanisme qui a permis à Claude Code de ne pas répéter les mêmes erreurs (recherche manquante, chiffres non sourcés) au fil du temps.

## Chronologie de travail observée (55 derniers commits, du plus récent au plus ancien)

Cette chronologie donne le "rythme" réel du projet — utile pour comprendre le tempo de travail attendu par Aymane :

1. **Vague de corrections de données obsolètes** (commits les plus récents, mi-juillet 2026) : `chore: retire fichiers dupliqués`, `fix: FAQ Bordeaux confondait Sécurité Sociale et CVEC`, `fix: frais de scolarité et CVEC obsolètes sur 20 pages`, `fix: exonérations frais de scolarité obsolètes (décret 30% du 19 mai 2026)` — une série de corrections déclenchées par un changement réglementaire réel (le décret du 19 mai 2026) qui a rendu obsolète une affirmation ("90-100% d'exonération") présente dans le contenu. Le correctif a été fait avec un grep systématique du dossier `content/` pour vérifier qu'aucune autre occurrence du framing obsolète ne subsistait — méthode à répliquer pour toute future correction réglementaire.
2. **Corrections SEO ciblées sur données Google Search Console** : `seo: titres + meta descriptions alignés sur les vraies requêtes GSC`, `seo: CTR — titres/descriptions réécrits sur 6 articles à fort impressions/faible clics`, `seo: optimisation CTR — titres/descriptions avec chiffres concrets sur 12 pages haute-impression` — Aymane (ou une session Claude Code précédente) a un accès Google Search Console et boucle régulièrement dessus pour identifier les pages à fort volume d'impressions mais faible CTR, et réécrit les titres/descriptions en conséquence. **C'est une pratique récurrente à poursuivre**, pas un one-off.
3. **Corrections de performance mesurées, pas supposées** : `perf: LCP mobile 6.4s→2.3s — hero et LenisProvider passent en SSR`, `fix: CLS 0.23→0 sur mobile + contraste WCAG AA — 2 bugs trouvés via Lighthouse/trace réel` — les métriques avant/après sont systématiquement citées dans le message de commit, preuve d'un vrai mesurage (Lighthouse, trace de performance réelle), pas une estimation. **Convention de message de commit à répliquer** : `perf: {métrique} {avant}→{après} — {cause racine}`.
4. **Ajout de contenu par vagues géographiques** : `feat: cluster Médecine — 5 nouveaux articles`, `feat: 15 nouveaux articles — Tunisie (5), Liban (5), Sénégal (5)` — le contenu est ajouté par lots thématiques ou géographiques cohérents plutôt qu'article par article isolé, avec systématiquement une correction de miniatures dans le commit suivant (preuve que les images sont souvent une réflexion après-coup, pas anticipée en même temps que le texte — voir `08` pour une piste d'amélioration de ce processus).
5. **Installation d'outils tiers** : GTM puis GA4 (deux commits séparés à quelques minutes d'intervalle), suppression du badge Vercel Speed Insights (`ac994eb`) — Aymane est attentif à ce qui est visible publiquement sur le site (le badge Vercel a été retiré volontairement, probablement pour ne pas révéler la stack d'hébergement / pour un rendu plus "propre marque").
6. **Itérations UX fines et récurrentes sur la homepage** : plusieurs commits `fix:` sur `/a-propos` concernant la visibilité du logo/texte arabe "دليلي" sur mobile, l'alignement d'un badge avec une animation de téléphones — preuve d'un souci du détail pixel-perfect poussé, avec des allers-retours multiples sur le même élément jusqu'à satisfaction (`ba18067` → `3b0a724` → `b2ba25d` → `0d39547`, quatre commits successifs sur le même sujet).
7. **Refactoring de la génération PDF** (plus loin dans l'historique, ~commits 41-55) : migration de `pdfkit` vers `pdf-lib` (`15a8452 : fix: remplace pdfkit par pdf-lib — polices intégrées sans fichiers système`), séparation des erreurs PDF et Resend pour un débogage plus clair (`44089eb`), correction d'encodage WinAnsi et de logo (`ee74c42`) — montre que la génération de PDF a été un point de friction technique réel, résolu par itérations.

## Philosophie de collaboration à retenir (synthèse actionnable pour le successeur)

1. **Toujours vérifier les chiffres** avant de les écrire ou de les corriger — ne jamais faire confiance à une connaissance générale du sujet (réglementation française changeante : CVEC, frais de scolarité, plafonds horaires, montants CAF).
2. **Toujours rechercher les pages concurrentes existantes** avant d'écrire un nouvel article — ne jamais écrire "à partir de rien".
3. **Citer les métriques avant/après** dans les commits de performance — Aymane mesure, ne suppose pas.
4. **Traiter Google Search Console comme une boucle de feedback continue**, pas un audit ponctuel — revenir régulièrement corriger titres/descriptions des pages à fort volume/faible CTR.
5. **Ne pas migrer/refactorer par réflexe de "propreté"** (voir la note sur le style hybride Tailwind/inline dans `02`) — les choix historiques (mélange `.jsx`/`.tsx`, style inline) sont assumés, pas des dettes à rembourser d'urgence sauf demande explicite.
6. **Documenter le "pourquoi" dans les commentaires de code** quand une décision de performance/UX n'est pas évidente (le codebase le fait déjà bien par endroits, ex. le commentaire sur `.hero-section` dans `globals.css` — à imiter).

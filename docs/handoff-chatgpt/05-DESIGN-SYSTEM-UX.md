# 05 — Design system, UX et philosophie visuelle

## Philosophie générale

Imposée par les instructions globales Claude Code (hors repo, `~/.claude/CLAUDE.md`) : s'inspirer d'Apple, Stripe, Linear, Vercel, Notion, Airbnb, Awwwards, SiteInspire, Godly. Le résultat concret est un site **dark-mode uniquement** (pas de bascule light/dark — la marque Dalili EST sombre), à forte dominante spatiale/cinématique : fond étoilé animé (`StarCanvas`), avion en 3D qui se désassemble/réassemble en scroll sur la homepage (`PlaneCinematic`, piloté par `public/manifest.json` qui décrit chaque pièce de l'avion avec position/offset "explosé"), silhouette de Paris animée (`ParisSkyline`).

## Palette de couleurs

### Couleurs de marque (`tailwind.config.ts`)

```
dalili-dark : #1F2850
dalili-blue : #014df8   (= #014DF8, la couleur d'accent principale du site)
dalili-bg   : #050914
```

### Couleur de fond réelle utilisée en production

Le fond réel du `<body>` (défini dans `app/layout.tsx` et `app/globals.css`) est **`#010510`**, légèrement différent de `dalili-bg` (`#050914`) défini dans Tailwind — **incohérence mineure** : soit `dalili-bg` est une valeur historique jamais synchronisée avec le vrai fond utilisé, soit c'est volontaire (deux nuances de "presque noir" utilisées à des endroits différents). Le `themeColor` du `viewport` (metadata PWA/mobile) est `#014DF8`.

### Couleurs d'accent par cluster/catégorie (système de couleur sémantique)

Chaque catégorie de blog (`CATEGORY_COLORS`) et chaque cluster (`CLUSTER_DEFINITIONS`) a sa propre couleur d'accent RGB, utilisée de façon cohérente pour les bordures, glows, pastilles :

| Élément | Couleur | RGB |
|---|---|---|
| Visa | `#4d8fff` (bleu clair) | 77,143,255 |
| Logement | `#EFB370` (orange/ambre) | 239,179,112 |
| Banque/Finances | `#22C55E` / `#10B981` (vert) | 34,197,94 / 16,185,129 |
| CAF | `#E879F9` (magenta) | 232,121,249 |
| Emploi | `#F59E0B` (ambre) | 245,158,11 |
| Vie étudiante | `#06B6D4` (cyan) | 6,182,212 |
| Santé | `#F43F5E` (rose/rouge) | 244,63,94 |
| Démarches | `#A855F7` (violet) | 168,85,247 |
| Permis | `#7C3AED` (violet foncé) | 124,58,237 |
| Maroc (cluster pays) | `#C8102E` (rouge, couleur du drapeau marocain) | 200,16,46 |
| Algérie | `#34D399` (vert) | 52,211,153 |
| Sénégal | `#FB923C` (orange) | 251,146,60 |
| Tunisie | `#E70013` (rouge, drapeau tunisien) | 231,0,19 |
| Liban | `#ED1C24` (rouge, drapeau libanais) | 237,28,36 |
| Médecine | `#14B8A6` (teal) | 20,184,166 |

**Observation** : les couleurs des clusters "pays" reprennent délibérément les couleurs des drapeaux nationaux (Maroc rouge, Tunisie rouge, Liban rouge — mais légèrement différenciées en teinte pour rester visuellement distinctes entre elles malgré la coïncidence des trois rouges). C'est un choix éditorial intelligent de connexion émotionnelle avec chaque communauté nationale ciblée.

L'accent bleu `#4d8fff` / `#014DF8` reste la couleur "par défaut" du site (liens, CTA, logo, Callout `info`) en dehors du contexte d'un cluster spécifique.

## Typographie

Trois polices Google Fonts chargées via `next/font/google` dans `app/layout.tsx` (`display: 'optional'`, `preload: true`) :

- **Montserrat** (`--font-montserrat`) — UI, labels, boutons, badges, breadcrumbs, métadonnées (toujours en majuscules avec `letter-spacing` large, ex. `0.16em`–`0.22em`) — c'est la police "petits caractères techniques/UI"
- **Bebas Neue** (`--font-bebas`) — tous les titres `h1`/`h2` d'article, titres de fiches université/ville — police condensée impactante, `font-weight: 400` uniquement, `line-height` très serré (0.9–1.0) pour un effet "affiche"
- **DM Sans** (`--font-dm-sans`) — corps de texte, paragraphes, descriptions — la police de lecture

**Incohérence à connaître** : `tailwind.config.ts` déclare des familles Tailwind `montserrat` et `open-sans` (`fontFamily: { montserrat: [...], "open-sans": [...] }`), mais **"Open Sans" n'est chargée nulle part dans `layout.tsx`** — c'est DM Sans qui est réellement utilisée. La config Tailwind est donc partiellement obsolète/jamais nettoyée après un changement de police. Comme noté en section 02, Tailwind est de toute façon peu utilisé pour le style réel (inline `style={{}}` domine), donc cette incohérence a un impact pratique faible, mais elle induirait en erreur quiconque chercherait "open-sans" dans le code en pensant qu'elle est utilisée.

`display: 'optional'` sur les trois polices est un choix de performance délibéré (évite tout FOIT/FOUT — la police système s'affiche si la police custom n'est pas encore chargée à temps, sans jamais re-layout après coup) — cohérent avec l'objectif CLS < 0.02 du skill.

## Spacing et responsive

**Pas de système de spacing tokenisé** (pas de `--space-1`, `--space-2` en variables CSS, pas d'échelle Tailwind personnalisée). Le responsive est géré presque exclusivement via **`clamp(min, préféré-en-vw, max)`** directement dans les valeurs inline (`fontSize: 'clamp(2.2rem,5.5vw,4.2rem)'`, `padding: 'clamp(48px,8vw,96px) ...'`) — un choix fluide/continu plutôt qu'un système de breakpoints discrets pour la majorité des valeurs de taille/espacement.

Les vrais breakpoints discrets (`@media (max-width: 767px)`, `(min-width: 768px)`, `(min-width: 1024px)`) sont réservés dans `globals.css` aux cas que `clamp()` ne peut pas résoudre seul : changement de `grid-template-columns` (3→2→1 colonnes), bascule complète de layout (nav desktop liens+CTA vs. nav mobile hamburger), masquage/affichage d'éléments (`.hero-plane-wrap { display: none }` sur mobile, remplacé par les phones), repositionnement absolu (le badge "Bientôt disponible", les phones du hero).

## Animations — catalogue

### Librairies

- **Framer Motion** : animations de composants React déclaratives (entrées, transitions d'état)
- **GSAP + `@gsap/react`** : animations complexes scroll-driven (le hero, l'avion `PlaneCinematic`)
- **Lenis** (`components/LenisProvider.tsx`) : smooth-scroll — mais **désactivé/neutralisé explicitement** sur mobile pour raison de performance (voir `.hero-section { height: 200vh }` en commentaire dans `globals.css` : "Setting it in a useEffect caused a ~0.2 CLS", donc les hauteurs critiques sont fixées en CSS pur, pas recalculées en JS après montage — leçon de performance apprise et documentée en commentaire)

### Catalogue des animations CSS custom (`globals.css`, `@keyframes`)

| Animation | Usage |
|---|---|
| `aurora1/2/3` | Blobs de fond façon "aurora" (translate+scale lents, désynchronisés) |
| `heroPulse` | Indicateur de scroll ("scroll cue") qui pulse |
| `marqueeLeft/Right` | Bandeau défilant du footer (logos partenaires) |
| `floatSlow`, `phoneFloat`, `chipFloat0/1/2` | Flottement vertical doux (avion, phones mockup, chips de stats du hero) |
| `glowPulse`, `badgeGlow` | Pulsation de lueur (badges) |
| `shimmerSweep`, `chipShimmer` | Effet de balayage lumineux diagonal (cards, chips) |
| `spin` + conic-gradient | Bordure animée en rotation (`.waitlist-border-anim`) — technique "composable" : un pseudo-élément `::before` plus grand que le parent tourne en boucle, seul le `overflow:hidden` du parent révèle un arc lumineux qui semble parcourir la bordure — évite d'animer `background-position` coûteux |
| `iconPulse` | Icônes de feature cards, désynchronisées par `animation-delay` négatif, **mises en pause au survol** (`.feature-card:hover .card-icon { animation-play-state: paused }`) — détail UX soigné : arrête le mouvement décoratif quand l'utilisateur interagit, pour ne pas distraire |
| `progressFill` | Barres de progression (stats), remplissage `scaleX(0)→1` avec délais échelonnés |
| `statusRipple` | Onde de pulsation autour d'un point de statut "en ligne" (vert) |
| `antennaBlink` | Clignotement de l'antenne sur `ParisSkyline` |
| `grainShift` | Léger bruit/grain animé (texture premium, subtile) |
| `scanDown` | Ligne de "scan" verticale (probablement un effet décoratif futuriste) |
| `popIn`, `fadeSlideUp` | Apparition de confirmation (succès de formulaire) |

C'est un système d'animation riche mais **cohérent et documenté par des commentaires expliquant le "pourquoi"** à plusieurs endroits (rare et positif à noter — le code CSS explique ses propres décisions de performance, ex. le commentaire sur `.hero-section` cité plus haut).

## Effets de "glass" et profondeur

`backdropFilter: 'blur(18px)'` + `WebkitBackdropFilter` sur les cards (blog cards, ex.), gradients de fond `linear-gradient(160deg, rgba(accent,0.07) 0%, rgba(1,4,16,0.97) 60%)`, `boxShadow` multicouches (`0 8px 32px rgba(0,0,0,0.4)`), bordures `rgba(accent,0.18)` très subtiles — c'est le "glass effect" et les "tasteful gradients" demandés explicitement par les instructions globales.

## Composants transverses

- **`StarCanvas`** — fond étoilé animé, monté une seule fois dans le layout racine et partagé par toutes les pages ("Fixed background — mounted once, shared across all pages, zero re-init cost", commentaire dans `layout.tsx`) — évite de recréer un canvas coûteux à chaque navigation.
- **`Navbar`** — desktop : liens horizontaux + CTA ; mobile : hamburger + menu plein écran (bascule via classes `.nav-hamburger`/`.nav-links-desktop`/`.nav-mobile-menu`, pas de JS de détection de largeur — pur CSS media query, donc pas de flash/mismatch).
- **`Footer`** — bandeau de logos partenaires en marquee infini (`marqueeLeft`/`marqueeRight`).
- **`TableOfContents`** (`components/blog/TableOfContents.jsx`) — sommaire sticky en sidebar sur article, généré depuis `extractHeadings()` (regex sur `##`/`###`), chargé en dynamique client-only (`dynamic(..., {ssr:false})`) car il a besoin de mesurer le DOM/scroll.
- **`ReadingProgressBar`** — barre de progression de lecture, également client-only.

## Accessibilité

- **Skip link** (`"Aller au contenu principal"`) — premier élément focusable du `<body>`, caché hors écran par défaut, visible au focus clavier (`top: -100%` → `top: 0` on `:focus`) — implémentation standard et correcte.
- `aria-hidden="true"` posé sur les éléments strictement décoratifs (glows, overlays).
- Contraste : un commit dédié (`5f98e7a : fix: CLS 0.23→0 sur mobile + contraste WCAG AA — 2 bugs trouvés via Lighthouse/trace réel`) montre une correction consciente de contraste WCAG AA, et un autre commit (`b7135a9 : fix: textes blancs sur toute la plateforme — suppression des grises illisibles`) confirme une préoccupation active et récurrente de lisibilité — mais **pas d'audit d'accessibilité automatisé en CI** (pas de `axe-core`, pas de test Lighthouse CI trouvé) : les corrections sont ponctuelles, déclenchées manuellement.
- `lang="fr"` posé sur `<html>`.

## Responsive — stratégie mobile spécifique au Hero

Le Hero a une gestion mobile entièrement différente du desktop, pas juste une version "réduite" :
- Desktop : avion 3D animé (`PlaneCinematic`) + chips de stats flottants positionnés en colonne verticale absolue à gauche.
- Mobile : l'avion est **complètement masqué** (`.hero-plane-wrap { display: none }`) et remplacé par les mockups de téléphone (`hero-phones-wrap`), les chips passent en diagonale alternée droite/gauche/droite, le hero devient un flex centré au lieu d'un scroll-driven pinning en `200vh`.

C'est une décision UX consciente : l'animation scroll-driven complexe de l'avion (coûteuse en JS/GSAP, pensée pour un grand viewport) est purement et simplement désactivée sur mobile plutôt que d'essayer de la faire fonctionner en plus petit — un compromis pragmatique performance > exhaustivité visuelle sur mobile.

## Dark mode

Il n'existe **pas de mode clair du tout** — pas de bascule, pas de media query `prefers-color-scheme: light` gérée. Le site est nativement et exclusivement sombre. À la différence des consignes générales de conception d'Artifacts Claude (`prefers-color-scheme` obligatoire pour les deux thèmes), **ce n'est pas applicable ici** — Dalili est un produit de marque à identité visuelle fixe, pas une page utilitaire multi-contexte.

## Composants "server-safe hover" — une astuce notable

`globals.css` contient des classes comme `.sc-card-hover:hover { border-color: ...; transform: translateY(-3px) }` — nommées explicitement "Server-component hover classes (no JS handlers)". C'est une technique pour obtenir des effets `:hover` sur des **React Server Components** (qui ne peuvent pas avoir de gestionnaires d'événements `onMouseEnter`/`onMouseLeave` côté serveur) : au lieu de convertir le composant en Client Component juste pour un hover, le hover est exprimé en CSS pur via une classe utilitaire, et la variable de couleur (`--hover-rgb`) est injectée en inline `style` (calculable côté serveur). C'est un pattern à répliquer pour tout futur composant qui a besoin d'un hover simple sans vraie interactivité JS — évite d'alourdir le bundle client inutilement.

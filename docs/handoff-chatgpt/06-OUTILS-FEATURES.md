# 06 — Outils interactifs, emails, Supabase, dashboard admin

Ces 4 outils sont la partie "produit utilitaire gratuit" de Dalili — ils apportent de la valeur indépendamment de l'app mobile à venir, et chacun suit le même pattern d'architecture : formulaire client (`components/*.tsx`) → calcul local → soumission à une route API (`app/api/*/route.ts`) → sauvegarde Supabase (table `waitlist`, avec une colonne JSON dédiée par outil) → génération PDF (`@react-pdf/renderer`) → envoi de deux emails via Resend (un pour l'utilisateur avec le PDF en pièce jointe, un de notification pour l'admin).

## 1. Simulateur de budget (`/simulateur`)

- Composant : `components/SimulateurBudget.tsx` (863 lignes — le plus gros composant du site)
- Logique : l'utilisateur choisit une ville, un type de logement (CROUS/colocation/studio/chez l'habitant), un niveau d'études, un pays d'origine, une bourse éventuelle, un mode de paiement des frais (annuel/mensuel) → calcul du budget total mensuel, de la CAF/APL estimée, et du "reste à financer"
- Route : `app/api/simulateur/route.ts` — valide l'email (regex simple), upsert dans `waitlist` avec `source: 'simulateur'` et une colonne `simulateur_data` (JSONB : ville, logement, niveau, pays, bourse, budget_estime, caf_estimee, reste), génère un PDF (`lib/simulateur-pdf.ts`), envoie en parallèle (`Promise.all`) un email de notification à l'admin (`boyayman388@gmail.com`) et un email à l'utilisateur avec le PDF en pièce jointe (`emails/BudgetResultEmail.ts` pour le HTML, PDF attaché en base64)
- **Note qualité de code** : cette route contient de nombreux `console.log` de debug avec emojis (🚀📦📧🔑🔄✅❌🏁) laissés en production — invisibles grâce à `compiler.removeConsole: true` en prod, mais à nettoyer si le code est un jour audité ou repris pour un autre contexte (ex. si `removeConsole` est retiré un jour, ces logs redeviendraient visibles en prod)

## 2. Comparateur de villes (`/comparer`)

- Composant : `components/ComparateurVilles.tsx` (731 lignes)
- Logique de scoring : `lib/comparer-scores.ts` — 5 critères (`budget`, `emploi`, `communaute`, `meteo`, `transport`), chacun noté sur 5 (pas par 0.5), pour les 14 villes. `totalScore()` fait une simple somme (les 5 critères ont donc un poids égal implicite — pas de pondération personnalisable par l'utilisateur, ex. un étudiant qui privilégie le budget par rapport à la météo obtient la même recommandation qu'un autre qui a les priorités inverses). `recommander(selectedSlugs)` retourne la ville au score total le plus élevé parmi celles sélectionnées par l'utilisateur pour comparaison.
- Route : `app/api/comparer/route.ts` (212 lignes) — pattern identique au simulateur (Supabase + PDF `lib/comparer-pdf.ts` + email `emails/ComparateurEmail.ts`)
- **Limite produit à connaître** : les scores (`CITY_SCORES`) sont des jugements éditoriaux fixes de l'équipe Dalili, pas recalculés depuis des données objectives — voir remarque dans `03-CONTENU-DONNEES-CMS.md`. Si un utilisateur conteste une note, il n'y a pas de méthodologie publique détaillée à lui opposer au-delà de "avis de l'équipe Dalili".

## 3. Calendrier Campus France (`/calendrier`)

- Composant : `components/CalendrierOutil.tsx` (486 lignes)
- Données : `lib/calendrier-data.ts` — un objet `PAYS_INFO` par pays (Maroc, Algérie, Sénégal, etc.) avec liens vers les articles Campus France/visa correspondants et un flag `tcfRequired`, plus une liste d'étapes (`CalendrierStep`) avec un niveau d'urgence (`rouge`/`orange`/`vert`) et un mois cible — génère un calendrier personnalisé des démarches à faire selon le pays et la date d'arrivée visée
- Route : `app/api/calendrier/route.ts` (154 lignes) — même pattern (Supabase + PDF `lib/calendrier-pdf.ts` + email `emails/CalendrierEmail.ts`)

## 4. Checklist PDF (`/checklist`)

- Le plus simple des 4 outils : **pas de formulaire, pas d'email, pas de Supabase** — `app/api/checklist/route.ts` (25 lignes) génère et sert directement un PDF statique (`lib/ChecklistPDF.tsx`, 525 lignes de mise en page `@react-pdf/renderer`) en réponse à un simple `GET`, avec un header `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` (cache 24h, revalidation en arrière-plan jusqu'à 7 jours) — bon réflexe de perf pour un contenu qui ne change pas à chaque requête
- `components/checklist/DownloadBtn.tsx` déclenche simplement le téléchargement
- A sa propre image OG dynamique : `app/checklist/opengraph-image.tsx`
- C'est la page de conversion identifiée comme prioritaire dans le sitemap (priorité 0.9, cf. `04-SEO-GEO-AEO.md`)

## Waitlist "simple" (`/api/subscribe`, homepage `EmailCapture.jsx`)

Route la plus simple des mécanismes d'email : valide l'email, upsert dans `waitlist` (`ignoreDuplicates: true` — donc une ré-inscription avec le même email ne renvoie pas d'erreur mais n'écrase pas non plus les données existantes), envoie une notification admin + un email de bienvenue (`emails/WaitlistEmail.ts`). C'est le point d'entrée générique de la homepage, par opposition aux 3 outils qui capturent l'email en échange d'un résultat personnalisé (lead magnet plus qualifié).

## Supabase — schéma réel (`supabase/schema.sql`)

**Une seule table** : `public.waitlist`.

```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
email       TEXT NOT NULL UNIQUE
source      TEXT NOT NULL DEFAULT 'website'   -- 'website' | 'simulateur' | 'comparateur' | 'calendrier' | ...
status      TEXT NOT NULL DEFAULT 'pending'   -- 'pending' | 'invited' | 'converted' | 'unsubscribed'
created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at  TIMESTAMPTZ NOT NULL DEFAULT now() -- auto-maintenu par un trigger (set_updated_at())
metadata    JSONB DEFAULT '{}'::jsonb
```

Note : les colonnes `simulateur_data`, etc., référencées dans les Route Handlers (`app/api/simulateur/route.ts` upsert un champ `simulateur_data`) **ne sont pas déclarées dans `supabase/schema.sql`** — soit elles ont été ajoutées via une migration ultérieure non tracée dans ce fichier SQL (le schema.sql n'est peut-être pas maintenu comme source de vérité continue mais comme snapshot initial), soit Supabase les accepte de façon permissive (colonnes JSONB additionnelles ajoutées manuellement dans le dashboard, hors du fichier versionné). **À vérifier directement dans le dashboard Supabase (via le MCP `mcp__supabase__list_tables`) avant de faire confiance à `schema.sql` comme source unique de vérité du schéma réel.**

- **RLS (Row Level Security)** activée : `anon`/`authenticated` peuvent seulement `INSERT` (formulaire public), `anon` explicitement refusé en `SELECT`. Seul `service_role` (utilisé par `lib/supabase-admin.ts` côté serveur, jamais exposé au client) peut lire/modifier/supprimer — bonne pratique de sécurité déjà en place.
- Une vue `waitlist_stats` pré-calcule les compteurs (total, par statut, 7/30 derniers jours) — utilisée par le dashboard admin.

## Dashboard admin (`/admin`)

- `app/admin/page.tsx` (Client Component) : liste paginée/filtrable/cherchable des inscrits, avec changement de statut et suppression.
- Auth : **un unique token statique** comparé côté serveur (`app/api/admin/waitlist/route.ts` : header `x-admin-token` comparé à `process.env.ADMIN_TOKEN`). Pas de session, pas de cookie, pas de rôle — un secret partagé simple. Adapté à un opérateur unique (Aymane), **pas scalable en l'état à une équipe** (pas de révocation individuelle, pas d'audit de qui a fait quoi).
- Exclu du crawl (`app/robots.ts` : `disallow: ['/admin']`).

## Emails transactionnels (Resend, `emails/`)

5 templates, tous en fonctions TypeScript qui retournent une string HTML (pas de JSX email framework type `react-email` — HTML généré à la main avec du CSS inline, standard pour la compatibilité clients mail) :

- `WaitlistEmail.ts` — email de bienvenue générique
- `BudgetResultEmail.ts` (202 lignes) — résultat du simulateur, avec PDF joint
- `ComparateurEmail.ts` (129 lignes) — résultat du comparateur
- `CalendrierEmail.ts` (82 lignes) — calendrier personnalisé
- `ChecklistEmail.ts` (59 lignes)
- `emails/components/EmailBase.ts` — wrapper/style de base partagé

Toutes les routes envoient systématiquement **deux emails en parallèle** (`Promise.all`) : un vers `boyayman388@gmail.com` (notification admin format tableau HTML) et un vers l'utilisateur (contenu + PDF le cas échéant). Toutes incluent un header `List-Unsubscribe` (bonne pratique anti-spam/délivrabilité).

`app/api/test-email/route.ts` (108 lignes) existe comme route de test manuel d'envoi d'email — probablement un outil de debug interne, à vérifier s'il doit rester accessible publiquement ou être davantage protégé/retiré (il n'est pas dans le `disallow` du robots.txt, mais `/api/` l'est entièrement — donc non indexable, mais reste **exécutable** par quiconque connaît l'URL si la route n'a pas de protection interne. À vérifier son contenu exact avant de le considérer sûr en prod.)

## Résumé du flux de données pour un successeur qui doit déboguer un outil

1. L'utilisateur remplit un formulaire client (`components/{Simulateur,Comparateur,Calendrier}*.tsx`)
2. Le composant calcule déjà le résultat côté client (affiché immédiatement, sans attendre le serveur) — l'email/PDF est un "bonus" envoyé en second temps
3. À la soumission de l'email, `fetch('/api/{outil}', { method: 'POST', body: JSON.stringify({...}) })`
4. La route valide, upsert Supabase, génère le PDF, envoie les 2 emails, retourne `{ ok: true/false }`
5. Si `RESEND_API_KEY` n'est pas configurée en environnement (ex. preview branch sans les secrets), la route échoue explicitement avec un message clair plutôt qu'un échec silencieux (`if (!apiKey) return NextResponse.json({ ok:false, error: 'RESEND_API_KEY non configurée.' }, {status:500})`) — bon réflexe pour le débogage.

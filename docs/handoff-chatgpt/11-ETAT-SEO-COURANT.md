# 11 — État SEO courant (brief de synchronisation)

Ce fichier ne redit pas ce qui est déjà dans `CLAUDE.md`, les messages de commit ou
`docs/knowledge-system/`. Il comble les trous : le raisonnement et les vérifications
qui n'existent nulle part ailleurs par écrit. Rédigé le 2026-08-06, HEAD = `d32b46b`.

---

## 1. Roadmap SEO — où on en est réellement

**Lot E : aucune trace.** Recherche exhaustive (git log, grep `"Lot E"` sur tout le
repo, `docs/`) — rien. Aucun Lot E n'est planifié ni en discussion à ma connaissance.
Si le fondateur en mentionne un, ce sera une information nouvelle, pas un oubli de
ma part.

**Pages/clusters identifiés comme problématiques mais non traités** : la liste
exhaustive est dans `08-DETTE-TECHNIQUE-ROADMAP-CRITIQUE.md`, sections B (SEO
technique, 15 items) et C (Contenu, 15 items) — non reproduite ici. Ce qui a changé
depuis l'écriture de ce fichier (il datait de 65 articles ; le site en compte
**72** aujourd'hui) :

- **Bug #1 (liens morts) et Bug #2 (frais de scolarité incohérents)**, décrits en
  détail dans `08-DETTE-TECHNIQUE-ROADMAP-CRITIQUE.md` §1, sont **entièrement
  corrigés** (session du 2026-08-06, commits `6ffcc23` → `748e984`). Ne pas les
  retraiter. Détail utile : ce document listait **38** slugs cassés ; un seul
  (`sciences-po-lyon`) avait déjà été corrigé avant cette session (précédent que le
  fondateur a explicitement cité comme modèle) — il restait donc 37 slugs au moment
  de l'audit de cette session, tous corrigés en liens externes vérifiés (pas de
  301, pas de nouvelle page).
- **Bug non documenté découvert pendant ce travail** : 6 pages villes
  (`lille`, `marseille`, `montpellier`, `strasbourg`, `toulouse` + la ville
  cassée d'origine) et 6 fiches université (`bordeaux`, `aix-marseille`, `lyon-1`,
  `montpellier`, `strasbourg`, `toulouse-3`) partageaient **le même fichier image**
  (MD5 identique) — un bug de duplication de photo, symétrique au bug des frais de
  scolarité mais jamais recensé dans les audits précédents. Corrigé (24 fichiers
  photo remplacés, commits `6559689` → `2ac074f`). Les 14 villes et 14 universités
  ont maintenant chacune une photo unique.
- **Bug #3 (`/api/test-email` exposé sans auth)** : **toujours ouvert**, vérifié en
  lisant le fichier à HEAD aujourd'hui. Le fragment de clé API et l'envoi d'email
  sans authentification sont toujours dans `app/api/test-email/route.ts`.
- **Bug 🟡 (double section FAQ)** : toujours non confirmé, personne ne l'a revérifié
  depuis l'audit de juin cité dans `08-DETTE-TECHNIQUE-ROADMAP-CRITIQUE.md`.
- `seo-audit-report.md` (racine du repo) date du 2026-06-22 et portait déjà la
  recommandation de le relancer quand le site avait 65 articles. Il en a 72
  aujourd'hui — l'écart s'est creusé, pas résorbé.

---

## 2. Conventions non écrites

**Pourquoi pas de 301 sur la dédup du Lot D** — choix délibéré, pas une contrainte
technique. Vérifié dans le message du commit `cdcf2f4` : les blocs allégés
n'étaient pas des pages concurrentes sur la même URL/intention (cas qui appellerait
un 301), mais des **sections dupliquées à l'intérieur de pages qui restent
distinctes et légitimes** (page pays généraliste vs guide visa dédié qui ranke
mieux). Un 301 supprimerait une page qui a sa propre raison d'être ; la bonne
réponse était d'alléger + lier, pas de fusionner les URLs.

**Le champ frontmatter `cluster:` ne sert PAS au maillage interne.** Découverte
concrète, pas déductible du code sans creuser : deux systèmes de cluster
coexistent, indépendants l'un de l'autre, sans synchronisation vérifiée.
- Le maillage réel (`getRelatedPosts()`, `getClusterArticles()`, composant
  `ClusterLinks`) est piloté entièrement par `CLUSTER_MAP` dans `lib/blog.ts`
  (~70 entrées, `Record<slug, cluster>` codé en dur, ignore complètement le
  frontmatter).
- Le champ `cluster:` du frontmatter (présent dans les 72 fichiers `.mdx`) n'est
  lu que dans `components/blog/SearchableBlogGrid.tsx` — uniquement pour l'UI de
  recherche/filtre de la page listing blog (libellé via `CLUSTER_DEFINITIONS` +
  matching texte).
- Conséquence pratique : ajouter/modifier `cluster:` dans le frontmatter d'un
  article n'a **aucun effet** sur ses articles liés ni sur `ClusterLinks` — il faut
  éditer `CLUSTER_MAP` séparément dans `lib/blog.ts`. Aucune vérification
  automatique ne détecte un désaccord entre les deux (non audité ici si un tel
  désaccord existe déjà — juste que rien ne l'empêcherait).

**`HIGH_PRIORITY_SLUGS` (`app/sitemap.ts`)** : une liste manuelle (`Set`, ~37 slugs,
groupés par commentaire en thèmes — TCF Maroc, Visa & Campus France, Logement,
Santé, Écoles privées, Banque, Pays, Médecine, etc.) qui fait passer la priorité
sitemap de 0.7 à 0.8. Aucune dérivation automatique (pas de lecture GSC, pas de
calcul) — c'est un jugement éditorial figé dans le code. Tout nouvel article
"pilier" doit y être ajouté manuellement pour bénéficier du boost ; rien ne le
rappelle si on l'oublie.

**Process de vérification de `lib/data/regulatory-figures.ts`** : le fichier est
la source unique de vérité (modèle de "tiers" avec `validFrom`/`validUntil` +
`source`/`sourceLabel` cité par figure — Légifrance, service-public.gouv.fr,
Campus France). Mais **aucun process de vérification n'est encodé dans le repo** :
pas de CI qui vérifie la fraîcheur des sources, pas de changelog, pas de champ
"dernière vérification". La seule garde-fou est une convention de session Claude
Code (mémoire `feedback-data-verification`), externe au repo — donc invisible pour
Cowork ou tout agent qui ne partage pas cette mémoire. Autrement dit : rien
n'empêche techniquement un futur agent d'ajouter un tier sans source vérifiée.

---

## 3. Problèmes connus non corrigés

Pas de todo list distincte de `08-DETTE-TECHNIQUE-ROADMAP-CRITIQUE.md` (sections
A→J, ~100 items) — c'est la référence, non dupliquée ici.

**`updatedDate` non mis à jour sur plusieurs fichiers modifiés récemment** —
vérifié fichier par fichier, ce n'est **pas volontaire**, c'est une omission
répétée qui contredit une règle explicitement écrite (`08-DETTE...` §"Ce qu'il ne
faut JAMAIS...", règle 7 : "Ne jamais oublier de mettre à jour `updatedDate`").
Preuve par contraste : le commit `bb70b06` (Lot D, cluster santé) a correctement
bumpé `updatedDate` (`2026-06-22` → `2026-08-05`) sur le fichier qu'il modifiait —
donc la pratique est connue et appliquée par endroits. Mais ces fichiers ne l'ont
**pas** eue alors que leur contenu a changé le 2026-08-05 :
- `contester-refus-visa-campus-france.mdx` (titre changé, Lot A)
- `logement-crous-etudiant-etranger-demande.mdx` (titre changé, Lot A)
- `pass-las-etudiant-etranger-medecine-france.mdx` (titre changé, Lot A)
- `reforme-apl-etudiant-etranger-2026.mdx` (titre changé, Lot A)
- `titre-sejour-etudiant-france-renouvellement.mdx` (titre changé, Lot A)
- `visa-etudiant-france-algerie-2026.mdx` (titre changé, Lot A)
- `visa-etudiant-france-maroc-2026.mdx` (titre changé, Lot A)
- `compte-bloque-visa-etudiant-france-guide.mdx` (liens internes ajoutés, Lot B)
- `visa-etudiant-france-tout-savoir-avant-partir.mdx` (section réduite, Lot D)

Impact concret, pas cosmétique : `app/sitemap.ts` utilise
`post.updatedDate ?? post.date` pour `lastModified` — ces 9 pages envoient
actuellement à Google un signal de fraîcheur daté d'avant leur dernière
modification réelle. Correctif mécanique : mettre `updatedDate: "2026-08-05"` sur
les 9 fichiers ci-dessus.

**Autres points sans réponse trouvée dans le repo** (aucune trace ni dans les
commits, ni dans les docs, ni dans le code — pas d'hypothèse avancée ici) :
- Fréquence de re-vérification prévue pour `regulatory-figures.ts` : RAS, aucune
  mention nulle part.
- Qui valide un nouveau `tier` avant merge : RAS, pas de process encodé.

---

## 4. État technique

**Build** : `npm run build` réussi à HEAD (`d32b46b`), vérifié dans cette session
(pas une supposition). `npx tsc --noEmit` : 0 erreur. `npx eslint .` : exit 0, 0
warning/erreur.

**Graphify — piège pour Cowork** : seul `graphify-out/GRAPH_REPORT.md` est suivi
par git (`.gitignore` lignes 41-43 : `graphify-out/*` ignoré, sauf ce fichier).
`graph.json`, `graph.html` et tout le reste sont **régénérés localement à chaque
commit par un hook** et n'existent que dans le checkout où ils ont été générés —
**un clone frais (donc Cowork, sauf s'il travaille dans ce même checkout) n'aura
pas `graph.json`** tant qu'il n'aura pas lancé `graphify update .` lui-même. Ne pas
supposer que le graphe est disponible sans vérifier `test -f graphify-out/graph.json`
d'abord.

`GRAPH_REPORT.md` (le seul artefact versionné) est à jour par rapport à HEAD — commit
`d32b46b`, le plus récent du repo.

---

## 5. Chantier backlinks — identifié le 2026-08-06, pas encore démarré

**Constat, pas une hypothèse.** GSC → Liens (`sc-domain:dalili.study`) : **11 backlinks
externes au total**, tous vers la homepage ou des pages génériques
(linkedin.com ×7, vercel.app ×2, producthunt.com ×1, reddit.com ×1). **Zéro
backlink externe vers un article de blog**, quel qu'il soit.

**Pourquoi ça compte** : le cluster sécurité sociale / carte Vitale sous-performe
malgré un contenu déjà solide (`carte-vitale-etudiant-etranger-guide.mdx`,
`securite-sociale-etudiante-france-inscription.mdx` — vérifiés, pas de contenu
mince) et un maillage interne déjà présent (12 pages pointent vers ces deux
articles). Diagnostic vérifié par recherche Google réelle (pas de test d'URL
directe) :
- `sécurité sociale étudiant étranger` : top 7 organique = 100 % domaines
  institutionnels (ameli.fr, service-public.gouv.fr, etudiant.gouv.fr,
  campusfrance.org...). Mur structurel, peu franchissable par du contenu privé
  seul — le vrai levier serait le featured snippet, pas le top 3.
- `carte vitale étudiant étranger` : concurrence mixte, avec **meridiane.fr**
  (startup services administratifs étudiants, même modèle éditorial que
  Dalili) qui nous dépasse avec un **titre quasi identique** au nôtre. Le titre
  n'est donc pas le facteur différenciant ici — l'écart est l'autorité de
  domaine/backlinks.

**Ce qui a été fait pour ce cluster (2026-08-06)** : deux micro-ajustements de
titre uniquement (ajout de "attestation" et "étranger", requêtes réelles
absentes des titres), pas de réécriture de contenu — le diagnostic ne
justifiait pas un chantier de contenu plus lourd.

**Ce qui reste à faire, hors scope code** : acquisition de backlinks — annuaires
étudiants/éducation, partenariats associations d'étudiants étrangers, guest
posts, RP. Aucun outil de mesure de backlinks tiers (Ahrefs/Semrush) connecté à
ce jour ; le seul chiffre disponible est celui de GSC → Liens ci-dessus. À
transformer en action concrète quand le fondateur aura une stratégie
d'acquisition (hors périmètre d'un agent de code).

# Objet métier : Fact

**Couche** : Truth
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Fact` existe pour porter **une seule affirmation vérifiable, atomique et datée** — un chiffre, une durée, un plafond, un montant. C'est l'unité la plus petite et la plus fondamentale de tout le système : tout le reste (une fiche université, un article, une recommandation) ne fait que *citer* des `Fact`, jamais en recréer.

Il est indispensable parce que le problème que Dalili a déjà rencontré concrètement — un même chiffre (les frais de scolarité) existant à plusieurs endroits, corrigé à un seul et resté faux ailleurs — n'est pas un accident de discipline, c'est l'absence structurelle d'un objet comme `Fact`. Tant qu'un chiffre peut être tapé directement dans un article, une fiche, ou un objet de configuration SEO, la duplication est possible. `Fact` rend cette duplication **impossible**, pas seulement découragée : il n'existe qu'un seul endroit légitime où un chiffre peut être écrit.

Le problème qu'il résout : *"comment garantir qu'un même chiffre ne peut jamais diverger entre deux surfaces, deux pages, deux moments"*.

---

## 2. Responsabilités

**Autorisé à** :
- Porter une valeur unique (numérique, textuelle courte, énumérée) associée à un sujet et un prédicat précis (ex. sujet = Université de Bordeaux, prédicat = frais_licence, valeur = 2895€).
- Porter une période de validité (`valid_from`, `valid_to`).
- Être cité par n'importe quel autre objet (`Content`, `Recommendation`, `Derivation`, `Rule`...).
- Porter un statut de confiance dérivé du niveau d'autorité de sa `Source`.

**Ne doit JAMAIS** :
- Contenir un jugement, une opinion, une appréciation qualitative (c'est le rôle de `Judgment`).
- Contenir une mise en forme, une traduction, un style éditorial (c'est le rôle de `Presentation`).
- Être modifié en place une fois publié — une correction crée toujours un nouveau `Fact`.
- Exister sans `Source` à l'état publié (il peut exister à l'état `draft` sans source, jamais au-delà).
- Porter une logique conditionnelle ("si... alors...") — ça, c'est le rôle de `Rule`.
- Référencer directement un `LearnerProfile` — un `Fact` est une vérité générale, jamais personnalisée pour un individu (la personnalisation vient plus tard, via `Rule`/`Derivation`).

---

## 3. Cycle de vie

1. **Création** : un `Fact` est créé à l'état `draft` dès qu'une affirmation candidate est identifiée (par recherche, par une correction en cours). À ce stade, il peut ne pas encore avoir de `Source` liée.
2. **Vérification** : une `Source` d'autorité suffisante est liée. Le `Fact` passe à `active` seulement si au moins une `Source` valide est présente.
3. **Évolution** : le `Fact` n'est jamais modifié en place. Toute mise à jour de valeur crée un **nouveau** `Fact`, qui pointe vers l'ancien via `SUPERSEDES`, et l'ancien devient `superseded`.
4. **Versionnement** : chaque version porte sa propre période de validité (`valid_from`/`valid_to`). La version "actuelle" n'est jamais un champ qu'on lit directement — c'est le résultat d'une requête "quelle est la version active à cette date, pour ce sujet+prédicat".
5. **Obsolescence** : un `Fact` devient `superseded` quand une nouvelle version le remplace ; il devient `retracted` si l'ancienne valeur s'avère avoir été une erreur (pas juste un changement réglementaire légitime — une vraie erreur de saisie ou de sourçage).
6. **Archivage** : un `Fact` `superseded` ou `retracted` n'est jamais supprimé — il reste consultable indéfiniment pour l'historique et l'audit, simplement exclu des résolutions "valeur actuelle".

---

## 4. Invariants

- Un `Fact` à l'état `active` ou `published` possède **toujours** au moins une `Source`.
- Un `Fact` n'a **jamais** plus d'une version `active` simultanément pour un même (sujet, prédicat) à un instant donné — les périodes de validité ne se chevauchent jamais pour un même couple (sujet, prédicat).
- Une fois `active`, la valeur elle-même d'un `Fact` ne change **jamais** — seule l'existence d'une nouvelle version peut le rendre `superseded`.
- Un `Fact` `retracted` ne peut plus jamais redevenir `active`.
- Toute chaîne `SUPERSEDES` est linéaire — elle ne forme jamais de boucle ni de branche (un `Fact` ne peut être remplacé que par un seul successeur direct).

---

## 5. Relations

**Obligatoires** :
- `SOURCED_BY → Source` (au moins une, dès l'état `active`).

**Optionnelles** :
- `DERIVED_FROM → Regulation` (quand le fait découle directement d'un texte réglementaire).
- `SUPERSEDES / SUPERSEDED_BY → Fact` (chaîne de versions).

**Relations entrantes (qui référence un `Fact`)** :
- `CITED_BY ← Content`, `← Recommendation`, `← Derivation`, `← Rule` (indirectement, via les faits qu'une règle transforme).
- `HAS_FACT ← toute entité de la couche Knowledge` (`University`, `City`, etc.).

**Contraintes** : un `Fact` ne peut être cité (`CITED_BY`) que s'il est au moins `active` — jamais un `Fact` `draft` ne peut être cité publiquement.

---

## 6. États

| État | Description |
|---|---|
| `draft` | Créé, valeur candidate, pas encore sourcé ou pas encore vérifié suffisamment. Invisible de tout consommateur externe. |
| `active` | Sourcé, vérifié, actuellement en vigueur. C'est la valeur retournée par toute requête "valeur actuelle". |
| `needs_review` | Était `active`, mais un changement de `Regulation` ou un signalement (`Signal`) suggère qu'il doit être revérifié — reste utilisable en attendant, mais signalé. |
| `superseded` | Remplacé par une version plus récente. Toujours consultable, jamais retourné comme "valeur actuelle". |
| `retracted` | S'est avéré incorrect (erreur, pas un changement légitime). Conservé pour l'audit, jamais utilisable, jamais cité pour du nouveau contenu. |
| `archived` | Ancien, hors de toute pertinence opérationnelle (ex. un `Fact` sur un sujet qui n'existe plus), conservé uniquement pour la mémoire historique. |

---

## 7. Transitions

**Autorisées** :
- `draft → active` (dès qu'une `Source` valide est liée).
- `active → needs_review` (déclenché par un changement de `Regulation` liée, ou un `Signal`).
- `needs_review → active` (revérifié, confirmé toujours exact).
- `needs_review → superseded` (revérifié, remplacé par une nouvelle version).
- `active → superseded` (une nouvelle version est créée et validée).
- `active` ou `superseded → retracted` (une erreur est découverte, à tout moment, y compris rétroactivement).
- `superseded → archived` (ancienneté, plus aucune pertinence même historique active).

**Interdites** :
- `retracted → active` (jamais — un fait rétracté ne peut pas redevenir vrai sans être recréé comme un `Fact` entièrement nouveau, pour ne jamais effacer la trace de l'erreur).
- `draft → superseded` (un brouillon ne peut pas être "remplacé", il n'a jamais été en vigueur — il est simplement abandonné ou complété jusqu'à `active`).
- Toute transition qui casserait l'invariant de non-chevauchement des périodes de validité pour un même (sujet, prédicat).

---

## 8. Validation

Avant de passer à `active` (et donc avant de pouvoir être cité), un `Fact` doit satisfaire :
- Au moins une `Source` liée, de tier suffisant pour la nature du fait (un chiffre réglementaire à fort enjeu doit viser un tier 1 ou 2, pas seulement un tier 4).
- Une période de validité cohérente (`valid_from` renseigné, pas dans le futur sans raison explicite).
- Absence de chevauchement avec un autre `Fact` déjà `active` pour le même (sujet, prédicat).
- Un sujet et un prédicat qui référencent des entités/concepts réellement existants dans la couche Knowledge.

---

## 9. Erreurs, cas limites, incohérences

- **Deux sources de même tier se contredisent** : le `Fact` ne peut pas être `active` simultanément avec deux valeurs — le conflit doit être résolu (choix argumenté d'une des deux, ou statut `disputed` explicite plutôt qu'un choix arbitraire silencieux) avant publication.
- **Une `Source` devient invalide après coup** (lien mort, page modifiée) : le `Fact` ne devient pas automatiquement faux, mais passe en `needs_review` pour re-vérification humaine.
- **Un `Fact` `retracted` a déjà été cité par du `Content` publié** : le `Content` concerné doit être signalé pour révision (voir flux "changement réglementaire" du Blueprint) — le système ne corrige jamais silencieusement le sens narratif autour d'un chiffre corrigé.
- **Une période de validité future est créée par erreur** (ex. une nouvelle règle annoncée mais pas encore en vigueur) : le `Fact` doit rester `draft` jusqu'à la date d'entrée en vigueur réelle, jamais `active` en avance.
- **Deux `Fact` valides sans chevauchement mais avec un "trou" temporel** (aucune valeur active entre deux dates) : cas limite acceptable si documenté (ex. un vide réglementaire réel), mais doit être signalé comme anormal par défaut plutôt que silencieusement toléré.

---

## 10. Exemples

**Cas simple** : `Fact(sujet=Université de Bordeaux, prédicat=frais_licence, valeur=2895, devise=EUR, valid_from=2025-09-01, source=MESR-2025)`.

**Cas complexe** : le plafond horaire de travail étudiant, qui a en réalité **deux** `Fact` actifs simultanément selon la nationalité — un `Fact` général (964h, sujet="étudiant hors UE") et un `Fact` spécifique (803h, sujet="étudiant algérien") — la coexistence n'est pas une violation de l'invariant de non-chevauchement car les deux ont des **sujets différents** ; c'est la `Rule` qui décide ensuite lequel s'applique à un profil donné.

**Cas exceptionnel** : un `Fact` publié (le plafond d'exonération de frais à 90-100%) est frappé d'obsolescence par un décret (plafond à 30%) — l'ancien `Fact` passe `superseded`, un nouveau `Fact` (30%) est créé avec `DERIVED_FROM → Regulation(décret 2026-385)`, et **tous** les `Content` citant l'ancien `Fact` sont automatiquement listés pour revue humaine, sans qu'aucun ne soit resté silencieusement obsolète.

---

## 11. Interactions avec les autres objets

**Consomme** : rien — `Fact` est la base, il ne dépend d'aucun autre objet pour exister (hormis sa `Source` obligatoire).

**Produit / alimente** : `Content` (via `CITES`), `Rule` (les conditions et conséquences d'une règle s'appuient sur des `Fact`), `Derivation` (les calculs consomment des `Fact` en entrée), `Recommendation` (la trace d'explication référence les `Fact` mobilisés), les entités de la couche Knowledge (`University`, `City`... via `HAS_FACT`).

**En dépendent directement** : à peu près tout objet situé au-dessus de la couche Truth dans la chaîne de dépendance — `Fact` est l'objet le plus référencé de tout le système.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : support de faits non numériques plus riches (listes, structures — ex. "documents requis" pourrait un jour devenir un `Fact` structuré plutôt qu'une relation `REQUIRES` séparée, à trancher plus tard sans urgence).
- **Multilingue** : la valeur d'un `Fact` reste indépendante de la langue (un chiffre est un chiffre) — seule sa `Presentation` varie par langue, donc `Fact` n'a strictement rien à changer pour supporter de nouvelles langues.
- **Nouveaux pays/juridictions** : `Fact` reste identique quel que soit le pays d'origine ou de destination concerné — le concept est déjà générique (sujet+prédicat+valeur+source), aucune contrainte de compatibilité à anticiper au-delà de la richesse du vocabulaire de prédicats utilisé.
- **Contrainte de compatibilité à préserver** : quel que soit l'enrichissement futur, l'invariant central ("un `Fact` actif jamais modifié en place, toute correction crée une nouvelle version tracée") ne doit **jamais** être assoupli — c'est la garantie fondatrice de tout le système, pas un détail d'implémentation.

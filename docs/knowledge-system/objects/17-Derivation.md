# Objet métier : Derivation

**Couche** : Reasoning
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Derivation` existe pour porter une **formule de calcul déclarée explicitement** — un budget mensuel, un score composite — comme un objet de connaissance inspectable, plutôt qu'une boîte noire de code. Une `Derivation` documente ses entrées nécessaires, son opération, et son unité de sortie.

Il est indispensable parce qu'un calcul comme "budget net = loyer + nourriture + transport − CAF − économie RU − CSS" représente une vraie connaissance métier (la méthode de calcul du budget étudiant), qui mérite d'être versionnée et sourcée comme un `Fact`, pas seulement écrite une fois dans une fonction de code que personne ne relit plus.

---

## 2. Responsabilités

**Autorisé à** :
- Déclarer ses entrées nécessaires (des `Fact`, d'autres `Derivation`, ou des variables d'un `LearnerProfile`).
- Déclarer son opération (l'agencement des entrées) et son unité de sortie.
- Être invoquée par un `RecommendationModel`, une `Capability`, ou directement par un utilisateur/agent via une capacité de type "calculer".

**Ne doit JAMAIS** :
- Consommer un `Fact` sans le documenter explicitement dans ses entrées déclarées.
- Produire une valeur sans que celle-ci reste traçable jusqu'aux `Fact`/`Derivation` qui l'ont alimentée.
- Intégrer elle-même une logique conditionnelle complexe par profil — ce type de logique passe par une `Rule` appliquée en amont, la `Derivation` reste un calcul, pas une décision.

---

## 3. Cycle de vie

1. **Création** : créée quand une méthode de calcul récurrente est identifiée (budget, score).
2. **Révision** : versionnée exactement comme un `Fact` — si la méthode change (ex. nouvelle formule officielle de calcul de la CAF), une nouvelle version est créée, l'ancienne devient `superseded`.
3. **Obsolescence** : une `Derivation` devient `deprecated` si le besoin de calcul lui-même disparaît.

---

## 4. Invariants

- Une `Derivation` documente toujours explicitement la liste complète de ses entrées — aucune entrée "cachée" non déclarée.
- Une `Derivation` `active` ne change jamais silencieusement de formule — un changement crée une nouvelle version.
- Le résultat produit par une `Derivation` est toujours traçable jusqu'aux `Fact`/`Derivation` mobilisés (pas de "boîte noire" même en interne).

---

## 5. Relations

**Obligatoires** : `USES → Fact` et/ou `USES → Derivation` (au moins une entrée).

**Optionnelles** : `SOURCED_BY → Source` (si la méthode de calcul elle-même est officielle, ex. la formule légale de calcul d'une aide).

**Relations entrantes** : `USED_BY ← RecommendationModel/Capability`.

---

## 6. États

| État | Description |
|---|---|
| `draft` | Formule en cours de définition. |
| `active` | Utilisée en production par les capacités qui l'invoquent. |
| `needs_review` | Une des `Fact`/`Derivation` qu'elle utilise a changé de nature (pas seulement de valeur), méthode à revalider. |
| `superseded` | Remplacée par une nouvelle version de formule. |
| `deprecated` | Plus aucun besoin de ce calcul. |

---

## 7. Transitions

**Autorisées** : `draft → active`, `active → needs_review → active`/`superseded`, `active/superseded → deprecated`.

**Interdites** : modifier la formule d'une `Derivation` `active` en place — toujours une nouvelle version.

---

## 8. Validation

Avant `active` : toutes les entrées déclarées existent réellement et sont au moins `active`, l'opération est cohérente avec l'unité de sortie annoncée.

---

## 9. Erreurs, cas limites, incohérences

- **Une entrée nécessaire n'est pas disponible** (ex. un `Fact` de coût de la vie manquant pour une ville peu documentée) : la `Derivation` ne doit jamais produire une valeur approximée silencieusement — elle retourne un résultat marqué incomplet, avec la liste des entrées manquantes (voir aussi le moteur de raisonnement, section 6 du Blueprint, étape de gestion de la confiance).
- **Une `Derivation` en utilise une autre qui devient elle-même `needs_review`** : la première hérite du statut de vigilance, ne peut pas rester `active` sans réserve tant que sa dépendance n't est pas confirmée.
- **Une formule change mais un résultat déjà calculé et affiché ailleurs (ex. dans une `Recommendation` déjà produite) reste basé sur l'ancienne version** : c'est acceptable et attendu — une `Recommendation` déjà produite conserve sa trace historique exacte, elle n'est jamais recalculée rétroactivement silencieusement.

---

## 10. Exemples

**Cas simple** : `Derivation("Budget net mensuel")`, `USES → Fact(loyer)`, `Fact(caf_estimee)`, `Fact(economie_ru)`.

**Cas complexe** : `Derivation("Plafond de travail effectif")`, qui `USES → Fact(964h)` transformé par une `Rule` selon la nationalité avant d'aboutir à la valeur effective (803h ou 964h) — illustre la composition entre `Rule` et `Derivation`.

**Cas exceptionnel** : une `Derivation` de score composite (ex. le score global du Comparateur) utilise à la fois des `Fact` (données de coût objectives) et des `Judgment` (scores éditoriaux qualitatifs) — la documentation de cette `Derivation` doit explicitement distinguer, dans sa formule, quelle part vient de faits vérifiés et quelle part vient d'une appréciation éditoriale, pour que la trace d'explication finale (dans une `Recommendation`) puisse elle-même faire cette distinction.

---

## 11. Interactions avec les autres objets

**Consomme** : `Fact`, `Rule` (via leur application en amont), d'autres `Derivation`, `Judgment` (le cas échéant).

**Produit / alimente** : `RecommendationModel`, `Capability` de type calcul, la trace d'explication d'une `Recommendation`.

**En dépendent directement** : le Simulateur (futur), le Comparateur (futur), toute capacité de calcul exposée à un agent.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : des `Derivation` de plus en plus composées (calculs qui s'appuient sur d'autres calculs), à mesure que la richesse du raisonnement grandit.
- **Contrainte de compatibilité à préserver** : la déclaration explicite et complète des entrées ne doit jamais être contournée pour une "optimisation" ou une "simplicité" apparente — c'est elle qui garantit la traçabilité de tout résultat calculé.

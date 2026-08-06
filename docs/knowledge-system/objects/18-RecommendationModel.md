# Objet métier : RecommendationModel

**Couche** : Reasoning
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`RecommendationModel` existe pour porter la **politique de pondération et de scoring** utilisée pour comparer plusieurs options (villes, universités) et produire un classement personnalisé. C'est la déclaration explicite de quels critères comptent, et avec quel poids — jamais une pondération figée et invisible dans du code.

Il est indispensable pour transformer le Comparateur actuel (poids égaux, fixes, non personnalisables) en un véritable outil de raisonnement, où les poids peuvent être ajustés selon les priorités réelles du `LearnerProfile`, tout en restant toujours explicable.

---

## 2. Responsabilités

**Autorisé à** :
- Déclarer les critères pris en compte (chacun étant un `Fact`, une `Derivation`, ou un `Judgment`) et leur poids par défaut.
- Accepter un ajustement de ces poids fourni par un `LearnerProfile` au moment de l'exécution.
- Produire une `Recommendation` en réponse à une demande de comparaison.

**Ne doit JAMAIS** :
- Mélanger dans un même critère une donnée factuelle et une donnée éditoriale sans les distinguer explicitement (chaque critère doit être identifiable comme reposant sur un `Fact`/`Derivation` ou sur un `Judgment`).
- Produire un classement sans conserver la trace de la pondération effectivement utilisée pour cette exécution précise.

---

## 3. Cycle de vie

1. **Création** : créé par décision éditoriale, avec ses critères et poids par défaut documentés.
2. **Révision** : révisé à la lumière d'`Outcome`/`Signal` accumulés (ex. les utilisateurs contestent régulièrement le poids donné à un critère).
3. **Versionnement** : une révision de la liste des critères ou des poids par défaut crée une nouvelle version.
4. **Obsolescence** : un modèle devient `deprecated` s'il est remplacé par une approche entièrement différente.

---

## 4. Invariants

- Un `RecommendationModel` `active` documente toujours explicitement chacun de ses critères et leur nature (`Fact`/`Derivation` vs `Judgment`).
- Toute `Recommendation` produite par un `RecommendationModel` conserve la pondération exacte utilisée à ce moment précis, même si les poids par défaut changent ensuite.

---

## 5. Relations

**Obligatoires** : `USES → Fact/Derivation/Judgment` (au moins un critère).

**Optionnelles** : `ADJUSTABLE_BY → LearnerProfile` (poids personnalisables).

**Relations entrantes/sortantes** : `PRODUCES → Recommendation`.

---

## 6. États

| État | Description |
|---|---|
| `draft` | Critères et poids en cours de définition. |
| `active` | Utilisé en production pour produire des `Recommendation`. |
| `superseded` | Remplacé par une nouvelle version de modèle. |
| `deprecated` | N'est plus utilisé. |

---

## 7. Transitions

**Autorisées** : `draft → active → superseded/deprecated`.

**Interdites** : modifier les poids par défaut d'un modèle `active` sans créer une nouvelle version — pour ne pas altérer rétroactivement l'interprétation de `Recommendation` déjà produites et conservées.

---

## 8. Validation

Avant `active` : chaque critère est un `Fact`/`Derivation`/`Judgment` réellement existant, la somme des poids par défaut est cohérente (ex. normalisée), la nature de chaque critère (factuel vs éditorial) est explicitement documentée.

---

## 9. Erreurs, cas limites, incohérences

- **Un critère devient indisponible pour une option donnée** (ex. un `Judgment` manquant pour une ville peu couverte) : le modèle doit soit exclure cette option du classement, soit la signaler explicitement comme incomplète — jamais lui attribuer une valeur par défaut arbitraire non signalée.
- **Un utilisateur fournit des poids qui ne somment pas à une valeur cohérente** (ex. tout à zéro) : cas limite à gérer explicitement — retour à une pondération par défaut documentée plutôt qu'un comportement indéfini.
- **Deux versions d'un même modèle coexistent temporairement** (migration en cours) : acceptable tant que chaque `Recommendation` produite référence sans ambiguïté la version exacte utilisée.

---

## 10. Exemples

**Cas simple** : `RecommendationModel("Comparateur villes v1")`, critères = budget (Derivation), emploi (Judgment), communauté (Judgment), météo (Judgment), transport (Judgment), poids égaux par défaut.

**Cas complexe** : le même modèle, avec des poids fournis par un `LearnerProfile` qui privilégie fortement le budget — le classement produit diffère du classement par défaut, tout en utilisant exactement les mêmes critères sous-jacents.

**Cas exceptionnel** : un `RecommendationModel` doit comparer des options dont l'une manque cruellement de données (ville récemment ajoutée, peu de `Fact`/`Judgment` renseignés) — le modèle signale cette option comme "confiance insuffisante" plutôt que de l'exclure silencieusement ou de la classer avec la même assurance que les autres.

---

## 11. Interactions avec les autres objets

**Consomme** : `Fact`, `Derivation`, `Judgment`, `LearnerProfile` (pour l'ajustement des poids).

**Produit / alimente** : `Recommendation`.

**En dépendent directement** : le futur Comparateur de villes/universités, toute `Capability` de type "recommander".

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : des modèles de recommandation plus riches (multi-critères hiérarchiques, seuils d'exclusion explicites) à mesure que la sophistication du raisonnement grandit.
- **Contrainte de compatibilité à préserver** : la distinction explicite entre critères factuels et éditoriaux (invariant central) ne doit jamais s'estomper, quelle que soit la sophistication future du modèle.

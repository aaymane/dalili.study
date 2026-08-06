# Objet métier : Recommendation

**Couche** : Reasoning
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Recommendation` existe pour porter **le résultat produit et conservé** d'un raisonnement — un classement, un conseil — accompagné de sa **chaîne d'explication complète**. Ce n'est jamais un affichage éphémère : c'est un objet traçable, qui peut être questionné après coup ("pourquoi cette réponse ?") et sur lequel un `Outcome` peut se rattacher plus tard.

Il est indispensable parce qu'une recommandation sans explication conservée est une boîte noire — incompatible avec la mission de confiance de Dalili. Un étudiant doit pouvoir demander "pourquoi Toulouse plutôt que Lille" et recevoir une vraie réponse, pas une affirmation qui s'évapore dès l'affichage.

---

## 2. Responsabilités

**Autorisé à** :
- Porter un classement/résultat produit par un `RecommendationModel`.
- Porter, de façon obligatoire, la trace complète (`USES`) des `Fact`/`Rule`/`Derivation`/`Judgment` mobilisés, avec les poids effectivement appliqués.
- Porter un niveau de confiance calculé.
- Être rattachée ultérieurement à un `Outcome`.

**Ne doit JAMAIS** :
- Être produite sans trace d'explication — c'est l'invariant le plus important de cet objet (donné en exemple dès la validation du Blueprint : "une Recommendation possède toujours une explication").
- Présenter un classement avec une confiance uniforme si les données mobilisées pour chaque option ne sont pas d'une fiabilité comparable.

---

## 3. Cycle de vie

1. **Création** : produite à chaque exécution d'un `RecommendationModel`/`Capability` de recommandation, jamais recalculée en place ensuite.
2. **Conservation** : conservée telle quelle, même si les `Fact`/`Rule`/`Judgment` sous-jacents évoluent ensuite — une `Recommendation` passée reste un instantané fidèle du raisonnement tel qu'il était à ce moment précis.
3. **Rattachement d'`Outcome`** : peut recevoir, plus tard, un ou plusieurs `Outcome` qui documentent ce qui s'est réellement passé.
4. **Archivage** : archivée après une durée de pertinence opérationnelle, jamais supprimée (utile pour l'audit et la révision des `RecommendationModel`).

---

## 4. Invariants

- Une `Recommendation` possède **toujours** une trace d'explication non vide (`USES`) — jamais un résultat sans justification.
- Une `Recommendation` porte toujours un niveau de confiance explicite, jamais implicite.
- Une `Recommendation` déjà produite n'est **jamais** modifiée rétroactivement, même si les faits sous-jacents changent ensuite — seule une nouvelle `Recommendation` peut refléter un nouvel état de connaissance.

---

## 5. Relations

**Obligatoires** : `USES → Fact/Rule/Derivation/Judgment` (au moins un), `PRODUCED_BY → RecommendationModel`.

**Optionnelles** : `MEASURED_BY ← Outcome/Signal`, `FOR → LearnerProfile` (si personnalisée pour un profil réel plutôt qu'hypothétique).

---

## 6. États

| État | Description |
|---|---|
| `produced` | Générée, disponible pour affichage/consultation. |
| `delivered` | Effectivement présentée à un utilisateur ou un agent. |
| `measured` | Un `Outcome` lui a été rattaché. |
| `archived` | Ancienne, conservée pour l'audit uniquement. |

---

## 7. Transitions

**Autorisées** : `produced → delivered → measured → archived` (une progression naturelle, pas nécessairement strictement séquentielle — `measured` peut survenir longtemps après `delivered`).

**Interdites** : toute transition qui impliquerait une modification du contenu de la recommandation elle-même — les états ne concernent que son cycle de vie opérationnel, jamais sa substance.

---

## 8. Validation

Avant `produced` (c'est-à-dire, condition de production elle-même) : trace d'explication complète et non vide, niveau de confiance calculé, `RecommendationModel` source identifié.

---

## 9. Erreurs, cas limites, incohérences

- **La confiance calculée est sous le seuil acceptable pour une ou plusieurs options** : ces options sont explicitement signalées comme incertaines dans la `Recommendation` elle-même, jamais classées avec la même assurance que les autres (voir moteur de raisonnement, section 6 du Blueprint).
- **Aucune option ne dépasse le seuil de confiance minimal** : la `Recommendation` produite documente ce refus de trancher avec assurance plutôt que de forcer un classement — c'est un résultat valide, pas un échec du système.
- **Un `Fact` utilisé dans la trace devient `retracted` après coup** : la `Recommendation` déjà produite n'est pas modifiée (elle reste un instantané historique fidèle), mais elle est marquée d'un avertissement rétroactif ("s'appuyait sur un fait depuis corrigé") si elle est encore consultée.

---

## 10. Exemples

**Cas simple** : `Recommendation("Pour ce profil, Toulouse avant Lille")`, avec trace complète des critères et poids utilisés.

**Cas complexe** : une `Recommendation` qui exclut explicitement une ville candidate faute de données suffisantes, en le signalant clairement plutôt qu'en l'omettant silencieusement de la liste.

**Cas exceptionnel** : une `Recommendation` produite pour un profil hypothétique (pas un `LearnerProfile` réel suivi) dans le cadre d'une simulation demandée par un agent IA tiers — reste un objet `Recommendation` à part entière, avec la même exigence de traçabilité, même si elle n'est jamais rattachée à un `Outcome` réel par la suite.

---

## 11. Interactions avec les autres objets

**Consomme** : `Fact`, `Rule`, `Derivation`, `Judgment`, `RecommendationModel`, `LearnerProfile` (si applicable).

**Produit / alimente** : de la matière pour un futur `Outcome`, une entrée pour `Planning` (si l'utilisateur suit la recommandation, ça peut déclencher une `Timeline`).

**En dépendent directement** : la couche `Experience` (mise en forme de la recommandation pour affichage), la couche `Distribution` (retournée par une `Capability`).

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : agrégation d'`Outcome` à grande échelle pour identifier des motifs de révision de `RecommendationModel`.
- **Contrainte de compatibilité à préserver** : l'obligation de trace d'explication non vide reste, avec le versionnement des `Fact`, la garantie la plus fondamentale de toute la couche `Reasoning` — elle ne doit jamais être assouplie, même pour des raisons de performance ou de simplicité perçue.

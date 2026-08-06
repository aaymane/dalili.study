# Objet métier : Judgment

**Couche** : Knowledge
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Judgment` existe pour porter une **évaluation éditoriale assumée par Dalili** — un score, un avis, une note qualitative — explicitement distincte d'un `Fact` officiel. C'est l'objet qui formalise la séparation entre "ce qui est vrai et sourcé officiellement" et "ce que Dalili pense, en toute transparence".

Il est indispensable pour la mission de confiance de Dalili : un système qui mélangerait sans distinction un fait officiel (le montant du CVEC) et une opinion maison (le score "communauté" d'une ville) produirait des réponses qui *paraissent* toutes aussi sûres, ce qui trahirait la promesse d'honnêteté du produit. `Judgment` rend cette distinction structurelle, pas seulement une bonne intention rédactionnelle.

---

## 2. Responsabilités

**Autorisé à** :
- Porter un score, une note, un avis qualitatif sur une entité (`University`, `City`).
- Être rattaché à une méthodologie éditoriale documentée (comment le score est construit, quels critères, quels poids).
- Être utilisé par un `RecommendationModel` comme un critère parmi d'autres, explicitement identifié comme non-officiel dans la trace d'explication.

**Ne doit JAMAIS** :
- Être présenté avec la même autorité qu'un `Fact` sourcé officiellement — toute présentation d'un `Judgment` doit rester identifiable comme tel.
- Exister sans méthodologie documentée — un score sans explication de comment il a été construit n'est pas un `Judgment` valide, c'est une affirmation arbitraire.
- Prétendre découler d'une `Source` officielle — sa seule "source" légitime est la méthodologie éditoriale de Dalili elle-même, explicitement assumée comme un jugement, pas une preuve externe.

---

## 3. Cycle de vie

1. **Création** : créé quand l'équipe éditoriale formalise une évaluation (ex. les scores du Comparateur de villes), avec sa méthodologie rédigée en même temps, pas après coup.
2. **Révision** : révisé périodiquement, notamment à la lumière d'`Outcome`/`Signal` accumulés (ex. des étudiants contestent régulièrement un score).
3. **Versionnement** : une révision de méthodologie ou de valeur crée une nouvelle version, l'ancienne devenant `superseded` — la transparence sur "ce jugement a changé, et pourquoi" fait partie de l'honnêteté attendue.
4. **Obsolescence** : un `Judgment` devient obsolète si l'entité qu'il évalue change trop pour que l'ancienne évaluation reste pertinente (ex. une ville dont le contexte économique change fortement).

---

## 4. Invariants

- Un `Judgment` publié possède toujours une méthodologie documentée et accessible.
- Un `Judgment` n'est jamais confondu avec un `Fact` dans une trace d'explication de `Recommendation` — les deux sont toujours distingués explicitement.
- Un `Judgment` ne référence jamais une `Source` officielle comme s'il s'agissait d'une preuve de sa valeur — seulement, éventuellement, comme un des éléments pris en compte par la méthodologie.

---

## 5. Relations

**Obligatoires** : `DOCUMENTED_BY → méthodologie éditoriale` (une description structurée des critères et de leur pondération).

**Optionnelles** : `ASSESSES → University/City`, `USED_BY ← RecommendationModel`.

**Contraintes** : un `Judgment` sans méthodologie associée ne peut jamais atteindre l'état `published`.

---

## 6. États

| État | Description |
|---|---|
| `draft` | En cours de construction, méthodologie pas encore finalisée. |
| `published` | Publié, méthodologie documentée et accessible. |
| `superseded` | Remplacé par une révision plus récente. |
| `contested` | Signalé comme contesté par des retours réels (`Outcome`/`Signal`), en attente de révision. |

---

## 7. Transitions

**Autorisées** : `draft → published`, `published → superseded` (nouvelle version), `published → contested`, `contested → published` (révisé et confirmé) ou `→ superseded` (révisé et changé).

**Interdites** : `draft → contested` (on ne peut contester un jugement qui n'a jamais été publié).

---

## 8. Validation

Avant `published` : méthodologie rédigée et accessible, critères explicites, cohérence avec les autres `Judgment` du même type (ex. tous les scores de ville utilisent la même échelle et la même méthodologie).

---

## 9. Erreurs, cas limites, incohérences

- **Un `Judgment` est perçu comme un fait officiel par un utilisateur** (risque de confusion) : le système de `Presentation` doit systématiquement afficher un marqueur explicite ("évaluation Dalili", pas "donnée officielle") partout où un `Judgment` apparaît.
- **La méthodologie change mais les scores existants ne sont pas recalculés** : incohérence à éviter — un changement de méthodologie doit déclencher une revue de tous les `Judgment` qui s'appuyaient sur l'ancienne version.
- **Deux `Judgment` sur la même entité se contredisent** (ex. deux équipes éditoriales, ou une évolution non tracée) : ne doit jamais arriver — un seul `Judgment` actif par (entité, méthodologie) à la fois, sur le même modèle que l'invariant de non-chevauchement des `Fact`.

---

## 10. Exemples

**Cas simple** : `Judgment(entité=City("Toulouse"), critère="communauté", valeur=5/5, méthodologie=ScoringMethodology("Comparateur villes v1"))`.

**Cas complexe** : le paragraphe "avis Dalili" d'une fiche université, qui combine plusieurs `Judgment` distincts (avantages, inconvénients, note globale) sous une seule méthodologie éditoriale cohérente.

**Cas exceptionnel** : un `Judgment` est massivement contesté par les retours utilisateurs (`Outcome` accumulés) au point de déclencher une révision complète de la méthodologie elle-même, pas seulement de la valeur — la nouvelle méthodologie devient elle-même un nouvel objet documenté, avec un historique clair de ce qui a changé et pourquoi.

---

## 11. Interactions avec les autres objets

**Consomme** : `University`/`City` (ce qu'il évalue), potentiellement des `Fact` comme éléments d'entrée de sa méthodologie (ex. le score "budget" s'appuie en partie sur des `Fact` de coût de la vie).

**Produit / alimente** : `RecommendationModel` (un critère de scoring parmi d'autres), `Content` (le paragraphe d'avis).

**En dépendent directement** : le Comparateur de villes/universités, toute recommandation qui inclut une dimension qualitative.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : méthodologies plus sophistiquées, éventuellement alimentées par des `Outcome` agrégés (retours réels d'étudiants) plutôt que purement éditoriales — toujours révisées par des humains, jamais par un apprentissage automatique autonome (voir Blueprint, exclusions).
- **Contrainte de compatibilité à préserver** : la séparation stricte `Fact` (vérifiable) / `Judgment` (assumé) est la contrainte la plus critique de cet objet — elle ne doit jamais s'estomper, même si les méthodologies deviennent plus sophistiquées avec le temps.

# Objet métier : Question

**Couche** : Knowledge
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Question` existe pour porter une unité question/réponse — la brique de l'AEO (Answer Engine Optimization) — comme objet de première classe, plutôt que d'être devinée après-coup par une analyse fragile de motifs Markdown (le mécanisme actuel, qui casse silencieusement si le format n'est pas respecté à la lettre).

Il est indispensable parce qu'une réponse destinée à être citée par un moteur de réponse (Google AI Overview, Perplexity, un agent conversationnel) doit être **structurellement garantie** d'avoir une question et une réponse claires, jamais dépendante de la façon dont un rédacteur a formaté son Markdown ce jour-là.

---

## 2. Responsabilités

**Autorisé à** :
- Porter une question et sa réponse, sous forme structurée et non ambiguë.
- Être sourcée (`SOURCED_BY → Source`) quand la réponse contient un fait vérifiable.
- Appartenir à un `Content` (`PART_OF`), ou exister de façon autonome pour une page FAQ dédiée.

**Ne doit JAMAIS** :
- Être extraite/devinée automatiquement depuis du texte libre non structuré — elle est toujours rédigée explicitement comme telle.
- Contenir une valeur chiffrée non citée depuis un `Fact` — même règle que `Content`.

---

## 3. Cycle de vie

1. **Création** : rédigée en même temps que son `Content` parent, ou indépendamment pour une page FAQ dédiée par thème.
2. **Révision** : mise à jour si le `Fact` sous-jacent change de sens narratif, ou si une meilleure formulation est identifiée (ex. alignement sur une requête réelle observée via GSC).
3. **Obsolescence** : une `Question` peut devenir `deprecated` si son sujet n'est plus pertinent, ou fusionnée avec une autre si elles se recoupent trop.

---

## 4. Invariants

- Une `Question` publiée possède toujours une réponse non vide et sourcée si elle contient une affirmation vérifiable.
- Une `Question` appartient toujours soit à un `Content` (`PART_OF`), soit explicitement à une page FAQ autonome — jamais orpheline sans aucun rattachement.

---

## 5. Relations

**Obligatoires** : rattachement à un `Content` OU à un regroupement FAQ autonome (au moins un des deux).

**Optionnelles** : `SOURCED_BY → Source`, `CITES → Fact`.

---

## 6. États

| État | Description |
|---|---|
| `draft` | Rédigée, non publiée. |
| `published` | Publique, citable. |
| `needs_review` | Fait sous-jacent modifié significativement. |
| `deprecated` | Sujet plus pertinent, remplacée par une meilleure formulation ou fusionnée avec une autre. |

---

## 7. Transitions

**Autorisées** : `draft → published → needs_review → published`, `published → deprecated`.

**Interdites** : `deprecated → published` sans révision complète.

---

## 8. Validation

Avant `published` : question formulée clairement (idéalement alignée sur une requête réelle observée), réponse complète et sourcée si elle contient un fait vérifiable.

---

## 9. Erreurs, cas limites, incohérences

- **La même question apparaît, formulée différemment, dans plusieurs `Content`** : à repérer et fusionner ou différencier explicitement, jamais laissée dupliquée sans intention.
- **Une réponse devient partiellement fausse après un changement de `Fact`** (le sens de la réponse change, pas seulement le chiffre cité) : passage en `needs_review`, jamais une mise à jour silencieuse du chiffre sans relecture du sens de la phrase entière.

---

## 10. Exemples

**Cas simple** : `Question("Combien de temps pour un visa étudiant depuis le Maroc ?")`, réponse sourcée sur les délais consulaires observés.

**Cas complexe** : une `Question` appartenant à la fois à un article spécifique ET reprise, légèrement reformulée, dans une page FAQ dédiée — les deux restent des objets `Question` distincts mais peuvent référencer les mêmes `Fact`/`Source` sous-jacents.

**Cas exceptionnel** : une `Question` devient fausse dans son intégralité suite à un changement réglementaire majeur (pas seulement un chiffre) — passe directement en `needs_review` avec priorité maximale, potentiellement retirée temporairement de la mise en avant publique le temps de la relecture plutôt que laissée visible avec un sens erroné.

---

## 11. Interactions avec les autres objets

**Consomme** : `Fact`, `Source`.

**Produit / alimente** : le schema.org `FAQPage` (via `Presentation`), les réponses directement citables par les moteurs IA génératifs.

**En dépendent directement** : toute la stratégie AEO du site, les `Capability` de type "réponse directe" pour les agents.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : alignement systématique sur les requêtes réelles observées (GSC ou équivalent futur) plutôt que sur une intuition éditoriale.
- **Contrainte de compatibilité à préserver** : ne jamais revenir à une extraction devinée depuis du texte libre — le gain de fiabilité de `Question` comme objet explicite ne doit jamais être sacrifié pour une facilité de rédaction.

# Objet métier : City

**Couche** : Knowledge
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`City` existe pour représenter une ville universitaire française, comme point de rattachement des `University` qui s'y trouvent et comme porteuse de ses propres `Fact` (coût de la vie, transport, logement).

Il est indispensable parce que c'est l'une des deux entités piliers du produit Dalili (avec `University`) — la décision "où étudier" se pose autant en termes de ville que d'établissement, et le Comparateur de villes (futur `RecommendationModel`) en dépend entièrement.

---

## 2. Responsabilités

**Autorisé à** :
- Être localisée dans un `Country` (`LOCATED_IN`).
- Porter ses propres `Fact` (population, coût de la vie, transport).
- Être citée par du `Content`, ciblée par un `Judgment` (score éditorial de ville).

**Ne doit JAMAIS** :
- Maintenir une liste recopiée de ses universités — cette liste doit **toujours** être obtenue par navigation inverse de `LOCATED_IN` depuis `University`, jamais stockée en double dans `City`. C'est la correction directe et non négociable du bug des 38 liens morts déjà identifié dans l'architecture actuelle.
- Porter elle-même un score/jugement qualitatif en dur — ce type d'appréciation vit dans `Judgment`, référencé depuis `City` mais jamais fusionné avec elle.

---

## 3. Cycle de vie

1. **Création** : créée dès la décision éditoriale de couvrir cette ville, avant même que toutes ses universités ne soient documentées.
2. **Enrichissement** : ses `Fact` et son `Content` associé s'enrichissent progressivement sans changer sa nature.
3. **Versionnement** : `City` elle-même n'est pas versionnée — ses `Fact` le sont individuellement.
4. **Obsolescence** : n'existe pas en pratique (une ville ne "disparaît" pas).
5. **Archivage** : non applicable en usage normal.

---

## 4. Invariants

- Une `City` est toujours reliée à un `Country` existant via `LOCATED_IN` — jamais orpheline.
- La liste de ses universités n'est **jamais** stockée directement sur l'objet `City` — elle est toujours dérivée par requête inverse.
- Un `Fact` rattaché à une `City` (ex. coût de la vie) suit exactement le même cycle de vie que tout `Fact` (sourcé, versionné, jamais modifié en place).

---

## 5. Relations

**Obligatoires** : `LOCATED_IN → Country`.

**Optionnelles** : `HAS_FACT → Fact`, navigation inverse depuis `University` (`LOCATED_IN`), `ASSESSED_BY → Judgment`.

**Contraintes** : toute relation entrante depuis `University` doit pointer vers une `City` réellement existante — enforcé structurellement (voir Blueprint, section 4).

---

## 6. États

| État | Description |
|---|---|
| `covered` | Documentée, avec `Content`/`Fact` associés maintenus à jour. |
| `planned` | Identifiée comme future ville à couvrir, sans contenu de fond encore attaché. |
| `stale` | Couverte mais dont les `Fact`/`Content` n'ont pas été revus depuis longtemps — signal de priorité de revue, pas un état bloquant. |

---

## 7. Transitions

**Autorisées** : `planned → covered`, `covered → stale` (par ancienneté détectée), `stale → covered` (après revue).

**Interdites** : aucune ville "couverte" ne peut redevenir silencieusement `planned` — un retrait de couverture serait une décision éditoriale explicite et documentée, jamais une régression automatique.

---

## 8. Validation

Avant `covered` : un `Country` valide associé, au moins un `Fact` de base (coût de la vie a minima) sourcé.

---

## 9. Erreurs, cas limites, incohérences

- **Une ville fusionne administrativement avec une autre** (rare) : traité comme une décision éditoriale explicite de fusion des entités, avec redirection documentée — jamais une suppression silencieuse.
- **Deux `City` du même nom existent dans des pays différents** (cas non applicable ici puisque `City` est toujours en France dans le scope actuel de Dalili, mais à anticiper si la couverture s'étendait un jour) : l'unicité doit être garantie par la relation `LOCATED_IN`, pas seulement par le nom.
- **Une université prétend être "à" une ville mais son campus réel est dans une commune voisine** (cas réel déjà observé, ex. Aix-Marseille dispersée entre deux villes) : la relation `LOCATED_IN` doit refléter la réalité géographique précise, y compris si cela signifie qu'une université est reliée à plusieurs `City` avec des campus distincts.

---

## 10. Exemples

**Cas simple** : `City("Bordeaux") —LOCATED_IN→ Country("France")`.

**Cas complexe** : `City("Marseille")` et `City("Aix-en-Provence")` reliées toutes deux à `University("Aix-Marseille Université")`, reflétant la dispersion réelle des campus plutôt qu'un rattachement arbitraire à une seule ville.

**Cas exceptionnel** : une ville nouvellement `planned` est mentionnée dans un `Content` existant avant d'être `covered` (ex. un article sur un pays mentionne une ville non encore documentée) — le système doit permettre cette mention sans lien cliquable actif tant que la ville n'est pas `covered`, plutôt que de générer un lien mort.

---

## 11. Interactions avec les autres objets

**Consomme** : `Country`.

**Produit / alimente** : `University` (via navigation inverse), `Content`, `Judgment`, `RecommendationModel` (le Comparateur s'appuie sur les `Fact`/`Judgment` d'une ville).

**En dépendent directement** : `University`, `Content` géographiquement ciblé, `RecommendationModel`.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : granularité infra-urbaine (quartiers) déjà présente en pratique dans le contenu actuel — pourrait devenir un objet propre (`Neighborhood`) relié à `City` si le besoin de structuration se confirme.
- **Contrainte de compatibilité à préserver** : la règle "jamais de liste d'universités recopiée" doit rester absolue même si un jour un cache de performance est introduit à l'implémentation — le cache doit toujours être dérivé de la relation centrale, jamais une source parallèle.

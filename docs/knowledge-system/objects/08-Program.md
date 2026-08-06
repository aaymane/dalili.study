# Objet métier : Program

**Couche** : Knowledge
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Program` existe pour représenter une filière ou un domaine d'étude (droit, médecine, informatique) indépendamment de tout établissement précis, permettant de regrouper les `University` qui l'offrent et de raisonner "par filière" plutôt qu'uniquement "par ville" ou "par université".

Il est indispensable parce qu'un étudiant choisit rarement une ville ou une université dans l'absolu — il choisit d'abord (souvent) une filière, puis cherche où elle est la mieux offerte. Sans `Program` comme entité transverse, cette dimension de recherche resterait implicite dans le texte narratif plutôt que d'être interrogeable.

---

## 2. Responsabilités

**Autorisé à** :
- Être offert par plusieurs `University` (`OFFERED_BY`, inverse d'`OFFERS`).
- Servir de critère de filtrage/regroupement pour du `Content` ou une future recherche intelligente.

**Ne doit JAMAIS** :
- Porter les modalités d'admission détaillées d'un établissement précis — ça reste propre à la relation `University —OFFERS→ Program`, enrichie si besoin de `Fact` spécifiques à cette combinaison précise (ex. le taux de sélectivité d'un programme dans une université donnée, pas du `Program` en général).

---

## 3. Cycle de vie

1. **Création** : créé dès qu'un domaine d'étude devient pertinent pour regrouper plusieurs universités.
2. **Évolution** : stable — les filières changent rarement de nature (le "droit" reste le "droit").
3. **Granularité** : peut être affiné avec le temps (ex. "Médecine" scindé en "PASS"/"LAS" si le besoin de précision se confirme) — un raffinement de granularité crée de nouveaux `Program` plus précis, reliés à l'ancien de façon explicite, jamais un renommage silencieux qui casserait les relations existantes.

---

## 4. Invariants

- Un `Program` référencé par `University —OFFERS→ Program` doit toujours exister réellement dans le référentiel `Program` — pas de filière inventée à la volée dans une fiche université.
- Deux `Program` ne se chevauchent jamais totalement sans qu'un choix éditorial explicite ne documente le lien (ex. "PASS" et "Médecine" doivent avoir une relation explicite si les deux existent, pas une ambiguïté silencieuse).

---

## 5. Relations

**Obligatoires** : aucune propre.

**Optionnelles** : `OFFERED_BY ← University` (plusieurs), `REFINES → Program` (si un programme plus précis dérive d'un programme plus général).

---

## 6. États

| État | Description |
|---|---|
| `active` | Utilisé et rattaché à au moins une université. |
| `deprecated` | Remplacé par une granularité plus précise, conservé pour compatibilité des anciennes relations. |

---

## 7. Transitions

**Autorisées** : `active → deprecated` (affinement de granularité).

**Interdites** : suppression pure — un `Program` déprécié reste accessible pour ne pas casser les relations historiques qui le référencent.

---

## 8. Validation

Avant utilisation : nom non ambigu, rattaché à au moins une `University` réelle via `OFFERS`.

---

## 9. Erreurs, cas limites, incohérences

- **Deux `Program` très proches créés indépendamment par erreur** (ex. "Info" et "Informatique") : à fusionner explicitement, avec redirection, dès détection.
- **Un `Program` change de nom officiel** (réforme des filières, ex. la réforme PASS/LAS elle-même) : traité comme une évolution documentée, avec le lien `REFINES` vers l'ancien programme pour ne pas perdre le contexte historique.

---

## 10. Exemples

**Cas simple** : `Program("Droit")`.

**Cas complexe** : `Program("Médecine (PASS/LAS)")`, reflétant une réforme réelle du système d'admission, relié aux universités qui l'offrent chacune avec des modalités propres.

**Cas exceptionnel** : un `Program` extrêmement spécialisé n'est offert que par une seule université (ex. "Droit viti-vinicole" à Dijon) — reste un `Program` à part entière même avec une seule relation `OFFERED_BY`, pas fusionné arbitrairement dans une catégorie plus large pour "simplifier".

---

## 11. Interactions avec les autres objets

**Consomme** : rien directement.

**Produit / alimente** : recherche/filtrage de `University` par filière, `Content` thématique par filière (ex. le cluster "médecine" déjà existant).

**En dépendent directement** : toute future capacité de recherche par filière plutôt que par ville/université uniquement.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : hiérarchie de filières plus riche (spécialisations, niveaux) si le besoin se confirme.
- **Contrainte de compatibilité à préserver** : un raffinement de granularité ne doit jamais casser silencieusement les relations `OFFERS` existantes — toujours un lien `REFINES` explicite.

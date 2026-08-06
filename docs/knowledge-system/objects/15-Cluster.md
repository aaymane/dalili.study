# Objet métier : Cluster

**Couche** : Knowledge
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Cluster` existe pour regrouper un ensemble cohérent de `Content` — thématiquement (visa, logement, santé) ou géographiquement (par pays d'origine) — et alimenter le maillage interne automatique entre contenus proches.

Il est indispensable parce que sans regroupement structurel, le maillage entre articles resterait entièrement manuel — c'est le mécanisme qui garantit qu'un article sur le "visa Maroc" pointe naturellement vers "TCF Maroc" et "Campus France Maroc" sans que chaque lien ne soit ressaisi à la main pour chaque nouvel article du même groupe.

---

## 2. Responsabilités

**Autorisé à** :
- Regrouper plusieurs `Content` (`GROUPS`).
- Porter une identité propre (label, description, éventuellement une couleur d'accent pour la présentation).

**Ne doit JAMAIS** :
- Porter lui-même du contenu narratif — un `Cluster` est un regroupement, pas un article.
- Se substituer à `Persona` — un cluster géographique ("Maroc") regroupe du contenu, un `Persona` ("étudiant marocain") cible une audience ; les deux peuvent coexister sur un même sujet sans être confondus.

---

## 3. Cycle de vie

1. **Création** : créé par décision éditoriale quand un ensemble de contenus futurs justifie un regroupement propre (nouveau pays couvert, nouveau grand thème).
2. **Évolution** : stable — la liste des clusters évolue rarement, volontairement limitée pour rester un outil de structuration utile plutôt qu'une taxonomie qui prolifère sans discipline.
3. **Fusion/scission** : un cluster peut être fusionné avec un autre s'il s'avère redondant, ou scindé si un thème devient assez riche pour mériter sa propre subdivision.

---

## 4. Invariants

- Tout `Content` `published` appartient à exactement **un** `Cluster` principal — jamais zéro, jamais plusieurs (cohérent avec le système déjà en usage aujourd'hui).
- Un `Cluster` référencé par `BELONGS_TO_CLUSTER` existe toujours réellement — pas de cluster fantôme créé implicitement par une faute de frappe.

---

## 5. Relations

**Obligatoires** : aucune propre.

**Optionnelles** : `GROUPS ← Content` (plusieurs).

---

## 6. États

| État | Description |
|---|---|
| `active` | Utilisé par au moins un `Content`. |
| `merged` | Fusionné avec un autre cluster. |
| `split` | Scindé en plusieurs clusters plus précis. |

---

## 7. Transitions

**Autorisées** : `active → merged`/`split`.

**Interdites** : suppression pure sans redirection — tout `Content` déjà rattaché à un cluster fusionné/scindé doit pouvoir être ré-associé sans perte.

---

## 8. Validation

Avant utilisation : label non ambigu, distinct des clusters déjà existants.

---

## 9. Erreurs, cas limites, incohérences

- **Un `Content` semble appartenir à deux clusters à la fois** (ex. un article à la fois "Maroc" et "médecine") : décision éditoriale explicite requise — un seul cluster principal, l'autre dimension peut être capturée par un `Persona`/tag secondaire, jamais par un deuxième `BELONGS_TO_CLUSTER`.
- **Un cluster devient trop large et perd sa valeur de regroupement** (ex. "vie étudiante" devenu fourre-tout) : signal (`Signal`) de nécessité de scission.

---

## 10. Exemples

**Cas simple** : `Cluster("visa")`, regroupant les articles génériques sur la procédure visa.

**Cas complexe** : `Cluster("medecine")`, regroupant des articles à la fois transversaux (coût des études de médecine) et par pays (médecine depuis le Maroc) — nécessitant une réflexion éditoriale sur la priorité du regroupement (thématique vs géographique) quand un article pourrait légitimement appartenir aux deux.

**Cas exceptionnel** : un cluster géographique ("Côte d'Ivoire") ne contient qu'un seul article — reste un cluster à part entière tant que le regroupement a du sens, pas fusionné arbitrairement dans un cluster plus large "Afrique" pour "simplifier", ce qui diluerait la pertinence du maillage pour ce pays.

---

## 11. Interactions avec les autres objets

**Consomme** : rien directement.

**Produit / alimente** : le maillage interne automatique entre `Content` (via `getClusterArticles` conceptuel), la navigation de l'index blog par thème.

**En dépendent directement** : toute la stratégie de maillage interne du site.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : hiérarchie de clusters (sous-clusters) si la richesse thématique grandit au point de nécessiter plusieurs niveaux de regroupement.
- **Contrainte de compatibilité à préserver** : garder un nombre de clusters volontairement maîtrisé — la valeur de l'objet dépend de sa capacité à structurer, pas de son exhaustivité.

# Objet métier : Organization

**Couche** : Knowledge
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Organization` existe comme **supertype** des institutions administratives ou éducatives impliquées dans le parcours étudiant — CROUS, préfecture, consulat, CAF, et `University` elle-même. Sa mission est de porter les champs communs à toutes ces institutions (nom, URL officielle, type d'organisme, coordonnées) une seule fois, pour que chaque sous-type n'ait à définir que ce qui lui est propre.

Il est indispensable pour éviter qu'un même type de champ ("URL officielle", "nom d'organisme") soit redéfini indépendamment et incohéremment pour chaque type d'institution rencontré dans le parcours étudiant.

---

## 2. Responsabilités

**Autorisé à** :
- Porter les champs communs hérités par tous ses sous-types (`University`, `CROUS`, `Prefecture`, `Consulate`, `CAF`).
- Être référencée par une `Procedure` comme l'organisme responsable d'une étape (ex. "déposer le dossier auprès du CROUS").

**Ne doit JAMAIS** :
- Être instanciée directement sans passer par un sous-type précis — `Organization` seule n'a pas vocation à représenter une institution réelle, uniquement à porter la structure commune.
- Porter un chiffre non sourcé (comme toute entité de la couche `Knowledge`, ses valeurs numériques passent par `Fact`).

---

## 3. Cycle de vie

1. **Création** : un sous-type d'`Organization` est créé quand une institution précise devient pertinente pour une `Procedure` ou un `Content`.
2. **Évolution** : rarement modifiée dans sa nature ; ses coordonnées/URL peuvent changer, ce qui reste une simple mise à jour de champ (pas de versionnement à la manière d'un `Fact`, sauf si l'information change de valeur officielle vérifiable, auquel cas un `Fact` séparé documente ce changement).
4. **Obsolescence** : une organisation peut être restructurée (ex. fusion de deux CROUS régionaux) — traité comme pour `University`, avec état explicite et redirection.
5. **Archivage** : conservée pour l'historique en cas de restructuration/disparition.

---

## 4. Invariants

- Toute instance réelle d'`Organization` appartient à exactement un sous-type précis (`University`, `CROUS`, `Prefecture`, `Consulate`, `CAF`, ou un futur sous-type) — jamais une instance générique non typée.
- Les champs communs (nom, URL) sont toujours présents, quel que soit le sous-type.

---

## 5. Relations

**Obligatoires** : aucune propre au supertype (chaque sous-type porte ses relations spécifiques — ex. `University —LOCATED_IN→ City`, `CROUS —SERVES→ City`).

**Optionnelles** : `RESPONSIBLE_FOR ← Procedure` (l'organisme en charge d'une étape administrative).

---

## 6. États

| État | Description |
|---|---|
| `active` | L'organisation existe et fonctionne normalement. |
| `restructured` | A fusionné/changé de périmètre, redirection documentée vers la nouvelle entité. |
| `archived` | N'existe plus, conservée pour l'historique. |

---

## 7. Transitions

**Autorisées** : `active → restructured → archived`.

**Interdites** : `archived → active` directement — une réouverture serait une nouvelle entité, pas une résurrection de l'ancienne.

---

## 8. Validation

Avant `active` : appartenance à un sous-type précis, nom et URL officielle vérifiés.

---

## 9. Erreurs, cas limites, incohérences

- **Un organisme change de nom sans changer de périmètre réel** (rebranding administratif) : mise à jour de champ, pas un changement d'état.
- **Deux organismes fusionnent** : le même traitement que pour `University` (section 9 de ce document jumeau) — état `restructured`, redirection documentée, historique conservé.

---

## 10. Exemples

**Cas simple** : `CROUS("CROUS de Bordeaux") is_a Organization`.

**Cas complexe** : `University("Université de Bordeaux") is_a Organization`, héritant des champs communs tout en ajoutant ses champs spécifiques (effectifs, programmes) — illustre concrètement le mécanisme d'héritage central du modèle.

**Cas exceptionnel** : une réforme administrative fusionne deux CROUS régionaux en un seul — les deux anciennes entités passent `restructured`, reliées à la nouvelle, tout le contenu et les procédures qui les référençaient sont redirigés sans perte d'historique.

---

## 11. Interactions avec les autres objets

**Consomme** : rien directement en tant que supertype.

**Produit / alimente** : sert de base à `University` ; référencée par `Procedure` (organisme responsable d'une étape).

**En dépendent directement** : tous les sous-types listés, toute `Procedure` qui désigne un organisme responsable.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : de nouveaux sous-types à mesure que Dalili documente plus finement le parcours (ex. `Insurance` pour les organismes d'assurance santé complémentaire).
- **Contrainte de compatibilité à préserver** : le mécanisme d'héritage doit rester simple — un sous-type ajoute des champs, il n'en redéfinit jamais le sens des champs communs hérités.

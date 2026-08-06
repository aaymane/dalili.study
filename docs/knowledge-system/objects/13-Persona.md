# Objet métier : Persona

**Couche** : Knowledge
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Persona` existe pour représenter un **segment d'audience type** (étudiant marocain primo-arrivant, étudiante sénégalaise niveau Master, étudiant libanais en médecine) — une catégorie éditoriale généralisée, distincte d'un `LearnerProfile` qui représente, lui, une personne réelle et précise.

Il est indispensable pour cibler du `Content` et qualifier des `Rule` ("cette règle s'applique aux profils qui ressemblent à ce persona") sans jamais avoir besoin de référencer une personne réelle — `Persona` est un outil éditorial et de raisonnement générique, pas un profil individuel.

---

## 2. Responsabilités

**Autorisé à** :
- Être ciblé par du `Content` (`TARGETS_PERSONA`).
- Être référencé par une `Rule` comme motif de correspondance (une règle "s'applique à" un ou plusieurs personas).
- Décrire des caractéristiques typiques (origine, niveau d'étude typique, contraintes typiques).

**Ne doit JAMAIS** :
- Représenter une personne réelle suivie individuellement (ça, c'est `LearnerProfile`).
- Porter une donnée personnelle identifiable.

---

## 3. Cycle de vie

1. **Création** : créé par décision éditoriale quand un segment d'audience devient suffisamment distinct pour mériter un ciblage propre.
2. **Évolution** : rarement modifié dans sa nature, le nombre de personas gérés reste volontairement limité et stable.
3. **Obsolescence** : un persona peut être fusionné avec un autre s'il s'avère trop proche, ou affiné en plusieurs personas plus précis si le besoin de segmentation grandit.

---

## 4. Invariants

- Un `Persona` ne contient jamais de donnée personnelle identifiable — c'est une catégorie, jamais un individu.
- Un `Content` qui cible un `Persona` référence un persona réellement défini dans le référentiel, jamais une catégorie ad hoc inventée dans le texte.

---

## 5. Relations

**Obligatoires** : aucune propre.

**Optionnelles** : `TARGETED_BY ← Content`, `MATCHED_BY ← Rule`, `RELATED_TO → Country` (l'origine typique de ce persona).

---

## 6. États

| État | Description |
|---|---|
| `active` | Utilisé activement pour du ciblage éditorial. |
| `merged` | Fusionné avec un autre persona plus englobant. |
| `refined` | Remplacé par des personas plus précis (relation `REFINES` explicite, sur le modèle de `Program`). |

---

## 7. Transitions

**Autorisées** : `active → merged`/`refined`.

**Interdites** : suppression pure sans redirection — tout `Content`/`Rule` qui référençait un persona fusionné/affiné doit pouvoir retrouver son équivalent.

---

## 8. Validation

Avant `active` : description suffisamment distincte d'un autre persona existant pour justifier sa création propre.

---

## 9. Erreurs, cas limites, incohérences

- **Deux personas se chevauchent presque totalement** : à fusionner explicitement plutôt que laissés coexister, pour éviter un ciblage éditorial dispersé sans valeur ajoutée.
- **Un persona devient trop générique pour être utile au raisonnement** (ex. "étudiant international" sans autre précision) : signal qu'il devrait être affiné en personas plus précis (par pays, par niveau) plutôt que d'être utilisé tel quel pour des `Rule` qui ont besoin de précision.

---

## 10. Exemples

**Cas simple** : `Persona("Étudiant marocain, primo-arrivant, niveau Licence")`.

**Cas complexe** : `Persona("Étudiante sénégalaise, niveau Master, boursière")` — assez précis pour qualifier des `Rule` spécifiques (ex. éligibilité à certaines bourses) sans devenir un profil individuel.

**Cas exceptionnel** : un persona initialement générique ("étudiant algérien") doit être affiné en deux personas distincts car une `Rule` réglementaire (plafond horaire) s'applique différemment selon un critère qui n'était pas encore capturé (ex. le statut du titre de séjour) — affinement documenté via `REFINES`, sans casser le ciblage `Content` déjà existant sur le persona d'origine.

---

## 11. Interactions avec les autres objets

**Consomme** : `Country` (souvent, pour l'origine typique).

**Produit / alimente** : le ciblage éditorial de `Content`, les conditions de `Rule`.

**En dépendent directement** : `LearnerProfile` peut se référer à un `Persona` proche comme point de départ (sans jamais s'y substituer), les recommandations personnalisées.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : de nouveaux personas à mesure que la couverture géographique/thématique s'étend (nouveaux pays, nouvelles filières).
- **Multilingue** : un `Persona` pourrait un jour porter une dimension linguistique si Dalili couvre des publics non-francophones — reste compatible sans changement structurel.
- **Contrainte de compatibilité à préserver** : ne jamais laisser `Persona` glisser vers une donnée personnelle identifiable, même partiellement — la frontière avec `LearnerProfile` doit rester nette.

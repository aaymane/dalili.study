# Objet métier : Document

**Couche** : Knowledge
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Document` existe pour représenter un **type** de pièce justificative requise par une ou plusieurs `Procedure` (ex. "passeport", "lettre d'admission", "justificatif de ressources 615€/mois") — jamais un fichier réel déposé par un utilisateur.

Il est indispensable pour que la liste des pièces requises par une démarche soit une donnée structurée et réutilisable, plutôt qu'un texte libre répété différemment dans chaque article qui mentionne la même exigence.

---

## 2. Responsabilités

**Autorisé à** :
- Décrire la nature attendue d'une pièce (nom, format attendu, éventuellement un `Fact` associé si le document a un seuil chiffré, ex. le montant de ressources exigé).
- Être requis par plusieurs `Procedure` différentes (un passeport valide est requis par de nombreuses démarches).

**Ne doit JAMAIS** :
- Représenter un fichier réel appartenant à un individu (ce n'est pas un objet de gestion documentaire personnelle, seulement un type/référentiel).
- Porter lui-même le chiffre d'un seuil (ex. les 615€/mois) — ce chiffre reste un `Fact`, référencé depuis le `Document` si pertinent, jamais recopié en dur dans sa description.

---

## 3. Cycle de vie

1. **Création** : créé dès qu'un type de pièce devient pertinent pour au moins une `Procedure`.
2. **Évolution** : rarement modifié dans sa nature (un "passeport" reste un "passeport") ; ses exigences précises (validité, seuil) évoluent via les `Fact` qui lui sont associés, pas via une modification du `Document` lui-même.
4. **Obsolescence** : un type de document peut cesser d'être requis (simplification administrative) sans que l'objet `Document` disparaisse — il devient simplement non référencé par aucune `Procedure` active.

---

## 4. Invariants

- Un `Document` référencé par `REQUIRES` depuis une `Procedure` existe toujours réellement dans le référentiel — jamais un texte libre non structuré à la place.
- Un seuil chiffré associé à un `Document` (ex. montant minimum de ressources) est toujours un `Fact` référencé, jamais une valeur écrite en dur sur le `Document`.

---

## 5. Relations

**Obligatoires** : aucune propre à sa création la plus minimale.

**Optionnelles** : `REQUIRED_BY ← Procedure` (plusieurs), `HAS_FACT → Fact` (si un seuil chiffré est associé).

---

## 6. États

| État | Description |
|---|---|
| `active` | Actuellement requis par au moins une `Procedure` active. |
| `unused` | N'est plus requis par aucune `Procedure` active, conservé au cas où il redeviendrait pertinent. |
| `archived` | N'a plus aucune pertinence prévisible, conservé pour l'historique uniquement. |

---

## 7. Transitions

**Autorisées** : `active ↔ unused` (selon que des `Procedure` actives le référencent ou non), `unused → archived`.

**Interdites** : suppression pure — un `Document` reste toujours consultable pour l'historique des `Procedure` passées qui le référençaient.

---

## 8. Validation

Avant `active` : nom non ambigu, format attendu décrit si pertinent, au moins une `Procedure` qui le référence.

---

## 9. Erreurs, cas limites, incohérences

- **Deux `Document` très proches créés indépendamment** (ex. "justificatif de ressources" et "attestation financière") : à fusionner explicitement dès détection pour éviter la confusion dans les `Procedure` qui les référencent.
- **Un `Document` a des seuils différents selon le pays d'origine** (ex. montant de ressources exigé qui pourrait varier) : modélisé par plusieurs `Fact` distincts rattachés au même `Document`, avec le sujet du `Fact` précisant le pays concerné — jamais par plusieurs `Document` quasi-identiques.

---

## 10. Exemples

**Cas simple** : `Document("Passeport valide")`.

**Cas complexe** : `Document("Justificatif de ressources")` avec un `Fact` associé (615€/mois) sourcé sur service-public.fr — si ce montant change, seul le `Fact` est mis à jour, le `Document` lui-même ne change pas.

**Cas exceptionnel** : un document requis diffère de nature selon la nationalité (ex. un "certificat de résidence algérien" remplaçant le "titre de séjour étudiant" standard pour les ressortissants algériens, en vertu de l'accord de 1968) — modélisé comme deux `Document` distincts, chacun requis conditionnellement via une `Rule` associée à l'étape de `Procedure` concernée.

---

## 11. Interactions avec les autres objets

**Consomme** : `Fact` (pour ses seuils chiffrés éventuels).

**Produit / alimente** : `Procedure` (`REQUIRES`), `Task` (une tâche personnalisée peut porter l'exigence de fournir tel document).

**En dépendent directement** : toute `Procedure` qui décrit des exigences documentaires, toute `Timeline` qui matérialise ces exigences en tâches concrètes.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : validation automatisée de format (hors scope de ce blueprint, relèverait d'une future capacité applicative), traduction des libellés par langue (relève de `Presentation`, pas de `Document` lui-même).
- **Contrainte de compatibilité à préserver** : ne jamais laisser un seuil chiffré migrer du `Fact` vers une valeur en dur sur le `Document`, même pour une "simplification" apparente.

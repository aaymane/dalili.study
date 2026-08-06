# Objet métier : Content

**Couche** : Knowledge
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Content` existe pour porter le **contenu narratif** de Dalili — article, guide, page pilier — celui qui raconte, contextualise et explique, par opposition à `Fact` qui porte la vérité brute. `Content` est un contenant : il ne fait que **citer** des `Fact`/`Source`, jamais en embarquer la valeur directement.

Il est indispensable parce que c'est le cœur de la stratégie éditoriale de Dalili (65+ articles), mais surtout parce que c'est l'objet dont la discipline de citation (plutôt que d'incrustation de chiffres) élimine à la racine le type de bug déjà documenté (frais de scolarité incohérents entre articles et fiches).

---

## 2. Responsabilités

**Autorisé à** :
- Contenir du texte narratif, structuré en sections.
- Citer des `Fact`/`Source` via `CITES` pour toute affirmation chiffrée ou vérifiable.
- Contenir des `Question` (section FAQ).
- Être rattaché à un `Cluster` (un seul, principal) et cibler un ou plusieurs `Persona`.

**Ne doit JAMAIS** :
- Écrire une valeur numérique en dur sans passer par une citation de `Fact` — c'est la règle la plus importante de cet objet, celle qui garantit qu'aucune correction de `Fact` ne peut laisser un `Content` silencieusement obsolète.
- Porter lui-même une logique de calcul ou une règle conditionnelle (ça reste dans `Reasoning`).
- Dupliquer une méthodologie de `Judgment` — un article peut *référencer* un `Judgment` existant, jamais en recréer un ad hoc pour lui-même.

---

## 3. Cycle de vie

1. **Recherche** : avant rédaction, identification des `Fact` nécessaires (créés s'ils n'existent pas encore) et de l'angle éditorial différenciant.
2. **Rédaction** : le `Content` est écrit à l'état `draft`, citant les `Fact` existants.
3. **Publication** : passe à `published` une fois relu et jugé conforme à la ligne éditoriale (profondeur, honnêteté, différenciation concurrentielle).
4. **Révision** : une correction factuelle ou éditoriale crée une nouvelle version du `Content` (pas nécessairement un nouvel objet séparé comme pour `Fact`, mais un historique de versions doit être conservé).
5. **Signalement automatique** : si un `Fact` cité change de version de façon significative sur le plan du sens (pas seulement la valeur), le `Content` est marqué `needs_review` même si sa citation reste techniquement à jour.
6. **Obsolescence** : un `Content` peut devenir `deprecated` si son sujet n'est plus pertinent (remplacé par un contenu plus complet), ou `archived` si le sujet disparaît entièrement.

---

## 4. Invariants

- Toute affirmation chiffrée dans un `Content` publié correspond à une citation `CITES → Fact`, jamais à une valeur écrite en dur.
- Un `Content` publié possède toujours au moins un `Cluster` principal.
- Toute `Question` contenue est un objet `Question` structuré, jamais un texte devinable seulement par un motif de formatage fragile.

---

## 5. Relations

**Obligatoires** : `BELONGS_TO_CLUSTER → Cluster` (un seul, principal) dès la publication.

**Optionnelles** : `CITES → Fact/Source` (autant que nécessaire), `TARGETS_PERSONA → Persona` (plusieurs), `CONTAINS → Question` (plusieurs), `RELATED_TO → Content` (maillage manuel additionnel).

**Contraintes** : le `Cluster` référencé doit exister ; les `Fact` cités doivent être au moins `active` (jamais un `Fact` `draft` cité publiquement).

---

## 6. États

| État | Description |
|---|---|
| `draft` | En rédaction, non public. |
| `published` | Public, à jour. |
| `needs_review` | Public, mais un `Fact`/`Regulation` cité a changé de façon significative — la prose elle-même pourrait nécessiter une relecture humaine même si les valeurs citées se mettent à jour seules. |
| `deprecated` | Remplacé par un contenu plus complet/à jour sur le même sujet, conservé mais dépriorité (peut recevoir un signal de redirection vers le nouveau contenu). |
| `archived` | Sujet disparu ou plus jamais pertinent, retiré de toute mise en avant active. |

---

## 7. Transitions

**Autorisées** : `draft → published`, `published → needs_review`, `needs_review → published` (revu, confirmé toujours pertinent), `published → deprecated`, `deprecated → archived`.

**Interdites** : `archived → published` directement (une reprise nécessiterait une relecture complète comme pour un nouveau contenu, pas une simple réactivation).

---

## 8. Validation

Avant `published` : recherche concurrentielle documentée réalisée, tous les chiffres cités via des `Fact` existants et sourcés, au moins une section `Question` si le sujet s'y prête, un `Cluster` assigné.

---

## 9. Erreurs, cas limites, incohérences

- **Deux `Content` couvrent le même mot-clé cible** (cannibalisation, déjà observée dans l'architecture actuelle) : à résoudre en différenciant explicitement leur angle éditorial respectif, jamais en les laissant coexister sans distinction.
- **Un `Content` cite un `Fact` qui devient `retracted`** (erreur découverte a posteriori, pas un simple changement réglementaire) : passage immédiat et automatique en `needs_review`, priorité de traitement maximale (contrairement à un simple changement de `Regulation` qui peut être traité selon une priorité normale).
- **Un `Content` n'a aucun lien entrant depuis d'autres `Content`** (orphelin, déjà documenté comme problème réel) : signalé par un `Signal` de maillage insuffisant, à corriger éditorialement.

---

## 10. Exemples

**Cas simple** : un article "Visa étudiant France depuis le Sénégal 2026", citant plusieurs `Fact` sur les délais et montants, rattaché au `Cluster("senegal")`.

**Cas complexe** : un article traitant à la fois d'un sujet réglementaire (frais de scolarité) et d'un jugement éditorial (avis sur telle université) — cite des `Fact` pour les chiffres ET référence un `Judgment` existant pour l'avis, sans jamais mélanger les deux dans une même affirmation non distinguée.

**Cas exceptionnel** : un `Content` doit rester honnête sur une donnée qui était vraie à sa date de publication mais ne l'est plus — grâce au versionnement de `Fact` (section 5 du Blueprint), l'article peut soit toujours citer la valeur courante (comportement par défaut), soit, si le sujet l'exige explicitement (ex. un article historique "combien coûtaient les études en 2019"), citer une version spécifique et datée du `Fact` plutôt que la version actuelle.

---

## 11. Interactions avec les autres objets

**Consomme** : `Fact`, `Source`, `Judgment`, `Cluster`, `Persona`, `Question`.

**Produit / alimente** : `Presentation` (métadonnées dérivées), `Capability` (`readArticle`), `Knowledge Pack` (inclusion dans un bundle).

**En dépendent directement** : le SEO/GEO/AEO du site, la citation par des agents IA externes.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : versions localisées (arabe, anglais) du même `Content` — une dimension `locale` à ajouter, sans changer sa structure narrative de fond.
- **Contrainte de compatibilité à préserver** : la discipline de citation (jamais de chiffre en dur) reste la contrainte la plus critique de tout l'objet, quelle que soit l'évolution du format de rédaction.

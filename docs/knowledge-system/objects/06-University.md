# Objet métier : University

**Couche** : Knowledge
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`University` existe pour représenter un établissement d'enseignement supérieur comme entité stable, dont **tous** les chiffres (frais, effectifs, budget) sont des références à des `Fact`, jamais des valeurs propres. C'est l'objet directement responsable de corriger le bug le plus documenté de l'architecture actuelle : l'incohérence des frais de scolarité entre plusieurs universités.

Il est indispensable parce que c'est l'entité pilier n°1 de Dalili — la décision-métier centrale ("où étudier") s'articule autour d'elle.

---

## 2. Responsabilités

**Autorisé à** :
- Porter une identité stable (nom, type, URL officielle).
- Référencer ses chiffres via `HAS_FACT`, jamais les porter en valeur propre.
- Offrir des `Program`, être localisée dans une `City`.
- Hériter des champs communs d'`Organization` (son supertype).

**Ne doit JAMAIS** :
- Porter un champ `tuitionLicence: 2895` en dur — uniquement une relation vers un `Fact` qui, lui, porte cette valeur, sourcée et versionnée.
- Dupliquer sa propre description dans plusieurs objets de métadonnées SEO manuels — cette duplication (`UNI_SEO` dans l'architecture actuelle) doit être entièrement absorbée par `Presentation`.
- Porter elle-même un score qualitatif ("4,5/5") sans passer par `Judgment` avec sa méthodologie documentée.

---

## 3. Cycle de vie

1. **Création** : créée une fois la décision éditoriale prise de la couvrir, avec ses `Fact` de base (frais, effectifs) créés en même temps ou juste après, jamais laissée "sans chiffres" plus que temporairement.
2. **Enrichissement** : programmes, avantages/inconvénients (`Judgment`), contenu narratif s'ajoutent progressivement.
3. **Versionnement** : l'entité elle-même change rarement de nature ; ce sont ses `Fact` associés qui portent le versionnement réel (un changement de frais crée une nouvelle version du `Fact`, pas une modification de l'entité).
4. **Obsolescence** : une université peut fermer ou fusionner (rare mais réel dans l'enseignement supérieur français) — traité par un changement d'état explicite, jamais une suppression.
5. **Archivage** : en cas de fermeture/fusion confirmée, archivée avec redirection documentée vers l'entité qui lui succède le cas échéant.

---

## 4. Invariants

- Toute valeur numérique affichée pour une `University` (frais, effectifs, budget) provient **toujours** d'un `Fact` actif via `HAS_FACT` — jamais d'un champ propre à l'entité.
- Une `University` est toujours reliée à au moins une `City` via `LOCATED_IN` (y compris si elle a plusieurs campus dans des villes différentes — relation multiple alors explicitement assumée, pas approximée).
- Une `University` hérite toujours des champs communs de son supertype `Organization` (nom, URL officielle) — pas de duplication de ces champs propres à `University`.

---

## 5. Relations

**Obligatoires** : `LOCATED_IN → City` (au moins une), `is_a → Organization` (héritage de type).

**Optionnelles** : `OFFERS → Program`, `HAS_FACT → Fact`, `ASSESSED_BY → Judgment`, `CITED_BY ← Content`, `RELATED_TO ← Content` (articles connexes).

**Contraintes** : toute référence entrante depuis une `City` (navigation inverse de `LOCATED_IN`) doit correspondre à une `University` réellement existante — c'est la garantie structurelle qui élimine la classe de bug des liens morts.

---

## 6. États

| État | Description |
|---|---|
| `draft` | Identifiée pour couverture, chiffres/contenu pas encore complets. |
| `published` | Couverte, ses `Fact` de base sont sourcés et actifs, sa fiche est consultable publiquement. |
| `needs_review` | Un `Fact`/`Regulation` associé a changé, la fiche entière est signalée pour revue de cohérence. |
| `merged` | A fusionné avec une autre université (restructuration réelle du paysage universitaire) — reliée à l'entité résultante. |
| `closed` | A cessé d'exister sans fusion identifiable. |
| `archived` | `merged` ou `closed` depuis assez longtemps pour ne plus nécessiter de maintenance active, conservée pour l'historique. |

---

## 7. Transitions

**Autorisées** : `draft → published`, `published → needs_review`, `needs_review → published` (revérifiée), `published → merged`/`closed`, `merged`/`closed → archived`.

**Interdites** : `merged`/`closed → published` directement (une université fermée qui rouvrirait serait a minima revue entièrement, pas simplement réactivée) ; `draft → merged`/`closed` (on ne "ferme" pas une entité qui n'a jamais été publiée, on l'abandonne simplement).

---

## 8. Validation

Avant `published` : `Fact` de base sourcés (frais, effectifs), au moins une `City` de rattachement valide, au moins un lien officiel vérifié (site web de l'université).

---

## 9. Erreurs, cas limites, incohérences

- **Deux entrées `University` créées par erreur pour le même établissement** (doublon) : à fusionner explicitement avec redirection, jamais laissées coexister silencieusement (impact direct sur la crédibilité si une fiche affiche des chiffres différents de l'autre pour le "même" établissement).
- **Une université a des campus dans plusieurs villes** (Aix-Marseille) : modélisée avec plusieurs relations `LOCATED_IN`, jamais forcée à n'en choisir qu'une par simplification.
- **Un `Fact` de frais devient `needs_review` mais la fiche reste consultée entre-temps** : la fiche continue d'afficher la dernière valeur `active` connue (jamais un vide), avec éventuellement un signal de fraîcheur visible pour l'utilisateur si le délai de revue s'allonge anormalement.

---

## 10. Exemples

**Cas simple** : `University("Université de Bordeaux") —LOCATED_IN→ City("Bordeaux")`, `—HAS_FACT→ Fact(frais_licence=2895€)`.

**Cas complexe** : `University("Aix-Marseille Université")` reliée à deux `City` distinctes, avec un `Judgment` qui signale explicitement cette dispersion comme un inconvénient documenté (cohérent avec le contenu éditorial déjà existant sur ce point).

**Cas exceptionnel** : deux universités historiquement distinctes fusionnent (précédent réel : Paris IV + Paris VI → Sorbonne Université) — modélisé comme deux entités passées à `merged`, reliées à une troisième entité nouvellement créée, avec tout l'historique de `Fact`/`Content` des deux anciennes entités conservé et accessible, pas perdu dans la fusion.

---

## 11. Interactions avec les autres objets

**Consomme** : `City`, `Fact`, `Organization` (héritage), `Program`.

**Produit / alimente** : `Content` (via `CITES`), `Judgment`, `RecommendationModel` (le Comparateur/futur outil de recommandation d'université s'appuie dessus), `Capability` (`recommendUniversity`).

**En dépendent directement** : `Content` type "fiche université", `Timeline`/`Procedure` d'admission qui la référencent.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : classements internationaux comme `Fact` datés et sourcés (au lieu du tableau statique actuel), historique de fusions/scissions structuré.
- **Nouveaux pays** : si Dalili couvre un jour des établissements hors de France (peu probable vu la mission, mais pas structurellement exclu), `University` reste générique — seul son rattachement `LOCATED_IN`/`Country` change.
- **Contrainte de compatibilité à préserver** : l'invariant "aucun chiffre en valeur propre, toujours via `Fact`" est la contrainte la plus critique à ne jamais assouplir, quelle que soit l'évolution future — c'est elle qui rend le bug déjà documenté structurellement impossible.

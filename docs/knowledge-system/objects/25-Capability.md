# Objet métier : Capability

**Couche** : Distribution
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Capability` existe pour porter un **contrat formel d'action invocable** — `recommendCity`, `simulateBudget`, `nextStep`, `readArticle` — par un consommateur externe (agent IA, application, automatisation interne). C'est l'implémentation concrète et enfin réalisée de l'ambition "WebMCP" que le skill `dalili-master` visait sans jamais la construire.

Il est indispensable pour qu'un agent IA ou un autre système puisse **utiliser** Dalili — déclencher un calcul, obtenir une recommandation — plutôt que seulement **lire** du contenu statique. Sans `Capability`, chaque intégration externe devrait deviner comment interagir avec le système, de façon ad hoc et fragile.

---

## 2. Responsabilités

**Autorisé à** :
- Déclarer une entrée attendue (typiquement un `LearnerProfile` ou des paramètres simples), une logique invoquée (`Derivation`/`RecommendationModel`/`Procedure`), une sortie produite, et si elle a un effet de bord (ex. envoyer un email) ou non (pure lecture).
- Être versionnée, pour qu'une évolution ne casse jamais un consommateur déjà intégré sur une version antérieure.

**Ne doit JAMAIS** :
- Contenir elle-même une logique métier propre — elle expose ce que `Reasoning`/`Planning`/`Knowledge` ont déjà produit, elle ne décide jamais rien par elle-même.
- Être invoquée sans que ses effets de bord éventuels soient explicitement déclarés et connus du consommateur.

---

## 3. Cycle de vie

1. **Création** : créée quand une action existante (calcul, recommandation, lecture) devient pertinente à exposer formellement à des consommateurs externes.
2. **Évolution** : une évolution de contrat (nouveaux paramètres, nouvelle forme de sortie) crée une nouvelle version, l'ancienne restant disponible et fonctionnelle un temps de transition défini.
3. **Dépréciation** : une ancienne version est dépréciée avec un délai annoncé avant retrait effectif, jamais retirée sans préavis.

---

## 4. Invariants

- Une `Capability` documente toujours explicitement ses effets de bord (ou leur absence) — jamais un effet caché.
- Une version de `Capability` déjà publiée et utilisée par des consommateurs externes ne change jamais son contrat en place — toute évolution substantielle crée une nouvelle version.

---

## 5. Relations

**Obligatoires** : `EXPOSES → Derivation/RecommendationModel/Procedure/Content` (au moins un).

**Optionnelles** : `REQUIRES → LearnerProfile` (schéma d'entrée attendu).

---

## 6. États

| État | Description |
|---|---|
| `draft` | Contrat en cours de définition, non exposé. |
| `active` | Exposée et invocable. |
| `deprecated` | Toujours fonctionnelle mais annoncée comme destinée à être retirée, un délai de transition est en cours. |
| `retired` | Retirée, ne répond plus. |

---

## 7. Transitions

**Autorisées** : `draft → active → deprecated → retired`.

**Interdites** : `active → retired` directement sans passer par `deprecated` (pas de retrait brutal sans préavis, sauf cas de sécurité exceptionnel documenté séparément).

---

## 8. Validation

Avant `active` : contrat d'entrée/sortie non ambigu, logique sous-jacente (`Derivation`/`RecommendationModel`/`Procedure`) elle-même `active`, effets de bord explicitement déclarés.

---

## 9. Erreurs, cas limites, incohérences

- **Un consommateur invoque une `Capability` avec un `LearnerProfile` incomplet** : la réponse doit signaler précisément ce qui manque plutôt que d'échouer silencieusement ou de deviner (cohérent avec le moteur de raisonnement, section 6 du Blueprint).
- **Une logique sous-jacente (ex. un `RecommendationModel`) devient `needs_review`** : la `Capability` qui l'expose doit refléter cette incertitude dans sa réponse plutôt que produire un résultat avec une assurance non justifiée.
- **Deux versions d'une même `Capability` coexistent** pendant la transition : chaque appel doit préciser explicitement la version utilisée, jamais une ambiguïté sur laquelle a répondu.

---

## 10. Exemples

**Cas simple** : `Capability("readArticle")`, pure lecture, aucun effet de bord, expose un `Content`.

**Cas complexe** : `Capability("recommendCity")`, expose un `RecommendationModel`, requiert un `LearnerProfile` avec au minimum origine et budget, retourne une `Recommendation` complète avec sa trace d'explication.

**Cas exceptionnel** : `Capability("subscribeToUpdates")` a un effet de bord réel (inscription à une notification future) — sa documentation doit rendre cet effet de bord immédiatement visible à tout consommateur, agent IA compris, pour qu'aucune invocation ne déclenche un effet non anticipé.

---

## 11. Interactions avec les autres objets

**Consomme** : `Derivation`, `RecommendationModel`, `Procedure`, `Content`, `LearnerProfile`.

**Produit / alimente** : les réponses consommées par le site, l'application, les agents IA tiers, les automatisations internes.

**En dépendent directement** : toute intégration externe, le futur WebMCP réel.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : de nouvelles capacités à mesure que de nouvelles fonctionnalités (section 7 du Blueprint) sont construites — chacune devient naturellement une nouvelle `Capability`.
- **Contrainte de compatibilité à préserver** : le versionnement strict des contrats (jamais de rupture silencieuse) est la garantie la plus critique pour la confiance des consommateurs externes, en particulier des agents IA qui ne peuvent pas "s'adapter" à un changement non annoncé.

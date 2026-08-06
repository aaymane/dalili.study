# Objet métier : Outcome

**Couche** : transverse (boucle de retour)
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Outcome` existe pour capturer un **résultat réel observé** après qu'une `Recommendation` a été produite ou qu'une `Rule` a été appliquée — ce qui s'est effectivement passé dans la vie réelle d'un étudiant, par opposition à ce qui avait été calculé/recommandé.

Il est indispensable pour qu'un système de raisonnement ne reste pas figé indéfiniment sur ses hypothèses initiales : sans `Outcome`, un `RecommendationModel` ou une `Rule` pourrait rester inadapté pendant des années sans que personne ne le sache jamais formellement.

---

## 2. Responsabilités

**Autorisé à** :
- Rattacher un fait du monde réel (l'étudiant a suivi la recommandation, l'a contestée, un résultat différent s'est produit) à la `Recommendation`/`Rule`/`Fact` concerné.
- Alimenter les révisions périodiques de `RecommendationModel`/`Judgment`/`Rule`.

**Ne doit JAMAIS** :
- Déclencher automatiquement une modification d'un `RecommendationModel`/`Rule` sans revue humaine — la boucle de retour reste pilotée par des personnes, jamais par un apprentissage automatique autonome (voir Blueprint, exclusions explicites).
- Porter des données personnelles au-delà de ce qui est strictement nécessaire pour comprendre le résultat observé.

---

## 3. Cycle de vie

1. **Création** : enregistré ponctuellement, quand un résultat réel devient connu (déclaration de l'étudiant, observation indirecte).
2. **Agrégation** : consulté, généralement en groupe avec d'autres `Outcome` similaires, lors des révisions périodiques des objets de raisonnement.
3. **Archivage** : conservé indéfiniment pour l'historique et l'analyse de tendance à long terme.

---

## 4. Invariants

- Un `Outcome` référence toujours au moins un objet qu'il mesure (`Recommendation`, `Rule`, ou `Fact`).
- Un `Outcome` ne modifie jamais directement l'objet qu'il mesure — il est toujours consulté séparément lors d'une révision explicite.

---

## 5. Relations

**Obligatoires** : `MEASURES → Recommendation/Rule/Fact` (au moins un).

**Optionnelles** : `FOR → LearnerProfile` (si rattaché à une personne précise).

---

## 6. États

| État | Description |
|---|---|
| `recorded` | Enregistré, pas encore pris en compte dans une révision. |
| `reviewed` | Pris en compte lors d'une révision d'un `RecommendationModel`/`Rule`/`Judgment`. |
| `archived` | Conservé pour l'analyse historique de long terme. |

---

## 7. Transitions

**Autorisées** : `recorded → reviewed → archived`.

**Interdites** : aucune — un `Outcome` ne "redevient" jamais non-enregistré, c'est un fait historique immuable une fois créé.

---

## 8. Validation

Avant enregistrement : référence claire à l'objet mesuré, description factuelle du résultat observé (pas une interprétation déjà biaisée).

---

## 9. Erreurs, cas limites, incohérences

- **Un `Outcome` semble contredire fortement une `Recommendation`** (l'étudiant a eu un résultat très différent de ce qui était prévu) : ne remet pas en cause automatiquement le `RecommendationModel` — c'est un signal à examiner parmi d'autres, jamais une preuve isolée suffisante pour une révision automatique.
- **Volume d'`Outcome` trop faible pour être significatif** : la révision d'un `RecommendationModel`/`Rule` doit tenir compte de la taille de l'échantillon, jamais réagir à un seul cas isolé comme s'il était représentatif.

---

## 10. Exemples

**Cas simple** : `Outcome(mesure=Recommendation("Toulouse avant Lille"), résultat="L'étudiant a choisi Lille — raison déclarée : proximité familiale")`.

**Cas complexe** : plusieurs `Outcome` accumulés sur plusieurs mois montrant qu'un `Judgment` de score "communauté" est régulièrement perçu comme trop optimiste pour une ville donnée — motive une révision de la méthodologie du `Judgment`, pas seulement de sa valeur.

**Cas exceptionnel** : un `Outcome` révèle qu'une `Rule` réglementaire a été mal appliquée dans une `Recommendation` passée (erreur de logique, pas juste un désaccord d'opinion) — ce cas prend une priorité de traitement bien supérieure à un simple retour d'expérience qualitatif, car il touche à l'exactitude factuelle, pas à une préférence.

---

## 11. Interactions avec les autres objets

**Consomme** : `Recommendation`, `Rule`, `Fact`.

**Produit / alimente** : les révisions de `RecommendationModel`, `Rule`, `Judgment`.

**En dépendent directement** : la qualité et la pertinence du raisonnement dans la durée.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : agrégation et analyse plus systématiques des `Outcome` à mesure que leur volume grandit, toujours avec une révision humaine au centre du processus.
- **Contrainte de compatibilité à préserver** : la règle "jamais de modification automatique déclenchée uniquement par un `Outcome`" reste une décision de gouvernance fondamentale à ne jamais assouplir sans une décision consciente et documentée distincte de ce blueprint.

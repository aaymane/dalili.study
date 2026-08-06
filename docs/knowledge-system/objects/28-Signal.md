# Objet métier : Signal

**Couche** : transverse (boucle de retour)
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Signal` existe pour capter un **indicateur agrégé** — comportemental ou analytique — qui suggère qu'une partie du système mérite une révision, sans pour autant constituer la preuve définitive qu'apporte un `Outcome` individuel documenté. C'est un signal faible, un motif statistique, pas un fait précis rattaché à une personne.

Il est indispensable pour capter des motifs que l'observation individuelle (`Outcome`) ne révèle pas facilement — par exemple, un volume de recherches sur un sujet non couvert, ou un chiffre régulièrement contesté sans qu'aucun `Outcome` isolé ne le prouve formellement.

---

## 2. Responsabilités

**Autorisé à** :
- Agréger une observation quantitative (volume, fréquence, tendance) et la rattacher à un `Fact`/`Content`/`RecommendationModel` concerné.
- Alimenter une file de revue périodique consultée par l'équipe éditoriale.

**Ne doit JAMAIS** :
- Déclencher une action automatique sur l'objet concerné — comme pour `Outcome`, la boucle de retour reste pilotée par des humains.
- Être confondu avec un `Outcome` — un `Signal` est un motif agrégé et statistique, un `Outcome` est un fait individuel et précis ; les deux sont complémentaires, jamais interchangeables.

---

## 3. Cycle de vie

1. **Accumulation** : capté en continu ou à intervalle régulier (ex. volume d'impressions Google Search Console sur une requête non couverte).
2. **Consultation** : examiné périodiquement lors des revues éditoriales.
3. **Résolution** : marqué `addressed` une fois qu'une action éditoriale a été prise en réponse (nouveau `Content`, révision d'un `RecommendationModel`), ou `dismissed` si jugé non pertinent après examen.

---

## 4. Invariants

- Un `Signal` référence toujours l'objet ou le domaine qu'il concerne (`Fact`, `Content`, `RecommendationModel`).
- Un `Signal` ne modifie jamais directement l'objet qu'il concerne — il est toujours consulté séparément.

---

## 5. Relations

**Obligatoires** : `MEASURES → Fact/Content/RecommendationModel` (au moins un).

---

## 6. États

| État | Description |
|---|---|
| `open` | Accumulé, en attente d'examen. |
| `addressed` | Une action éditoriale a été prise en réponse. |
| `dismissed` | Examiné et jugé non pertinent ou non actionnable. |

---

## 7. Transitions

**Autorisées** : `open → addressed`/`dismissed`.

**Interdites** : `addressed`/`dismissed → open` sans qu'un nouveau motif ne soit réellement détecté (pas une simple réouverture arbitraire).

---

## 8. Validation

Avant prise en compte formelle dans une revue : volume/motif suffisamment significatif pour ne pas être un simple bruit statistique (seuil à définir éditorialement, hors scope de ce blueprint).

---

## 9. Erreurs, cas limites, incohérences

- **Un `Signal` isolé et ponctuel est confondu avec une tendance réelle** : à éviter — un `Signal` doit refléter une accumulation, pas un pic isolé sans confirmation dans la durée.
- **Un volume de `Signal` important s'accumule sans jamais être traité** (file de revue négligée) : c'est un risque de gouvernance déjà identifié dans le Blueprint (section 9, questions ouvertes, et section 10, risques de la V2) — la valeur de `Signal` dépend entièrement de la discipline de revue humaine qui le consulte.

---

## 10. Exemples

**Cas simple** : `Signal(mesure=Content, motif="volume d'impressions élevé sur une requête non couverte par un article existant")`.

**Cas complexe** : un `Signal` agrégé sur plusieurs mois montrant qu'un `Fact` particulier est fréquemment contesté dans les échanges avec les utilisateurs, sans qu'aucun `Outcome` individuel ne documente une erreur précise — motive une vérification proactive de ce `Fact` plutôt que d'attendre une preuve individuelle formelle.

**Cas exceptionnel** : un `Signal` détecte un motif inattendu et à fort enjeu (ex. un pic soudain de recherches sur un sujet lié à un changement réglementaire pas encore repéré par l'équipe éditoriale) — ce type de `Signal` doit pouvoir être priorisé au-dessus de la file normale, car il peut être le premier indice d'un changement de `Regulation` non encore formellement enregistré dans le système.

---

## 11. Interactions avec les autres objets

**Consomme** : des données comportementales/analytiques externes (hors scope de ce blueprint quant à leur origine précise).

**Produit / alimente** : les revues éditoriales, la priorisation du travail de maintenance du contenu et des `RecommendationModel`.

**En dépendent directement** : la fraîcheur et la pertinence continue du système dans son ensemble.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : des sources de signal plus riches et plus variées à mesure que le système grandit (comportement dans l'application, retours d'agents IA tiers).
- **Contrainte de compatibilité à préserver** : `Signal` doit rester un déclencheur de revue humaine, jamais un déclencheur d'action automatique — la même limite de gouvernance que pour `Outcome`, à ne jamais franchir sans une décision consciente et séparée de ce blueprint.

# Objet métier : Milestone

**Couche** : Planning
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Milestone` existe pour marquer un **jalon structurant** dans une `Timeline` — un point de repère important, distinct d'une simple `Task`, qui représente souvent un point de non-retour ou une échéance critique (ex. la clôture d'une session Campus France).

Il est indispensable pour donner à l'étudiant une lecture à haut niveau de son parcours ("les 3-4 dates qui comptent vraiment"), sans noyer cette lecture dans le détail de chaque `Task` individuelle.

---

## 2. Responsabilités

**Autorisé à** :
- Marquer une date-repère importante, potentiellement partagée entre plusieurs `Procedure` instanciées dans une même `Timeline` (point de synchronisation).
- Être atteint ou manqué, avec des conséquences documentées (ex. "si ce jalon est manqué, telle conséquence").

**Ne doit JAMAIS** :
- Se substituer à une `Task` — un `Milestone` ne porte pas d'action à réaliser lui-même, il marque un moment ; les actions associées restent des `Task` distinctes qui y mènent.
- Exister hors d'une `Timeline`.

---

## 3. Cycle de vie

1. **Création** : créé lors de l'instanciation d'une `Timeline`, à partir des points-clés identifiés dans la/les `Procedure` sous-jacentes.
2. **Suivi** : marqué atteint ou manqué au fil du temps réel.
3. **Recalcul** : peut être décalé si un délai officiel change, avec le même principe de non-modification rétroactive de l'historique que pour `Task`.

---

## 4. Invariants

- Un `Milestone` appartient toujours à exactement une `Timeline`.
- Un `Milestone` manqué reste visible dans l'historique — jamais effacé, même après recalcul du reste de la `Timeline`.

---

## 5. Relations

**Obligatoires** : `BELONGS_TO → Timeline`.

**Optionnelles** : lié à une ou plusieurs `Task` qui y mènent.

---

## 6. États

| État | Description |
|---|---|
| `upcoming` | À venir. |
| `reached` | Atteint avec succès. |
| `missed` | Manqué — les conséquences documentées s'appliquent. |

---

## 7. Transitions

**Autorisées** : `upcoming → reached`/`missed`.

**Interdites** : `reached`/`missed → upcoming` sans une réouverture explicite et documentée du parcours concerné.

---

## 8. Validation

Avant création : rattachement à une `Timeline` existante, date cohérente avec les délais officiels connus au moment de l'instanciation.

---

## 9. Erreurs, cas limites, incohérences

- **Un `Milestone` critique est sur le point d'être manqué** : signal prioritaire à faire remonter dans l'expérience utilisateur (relève de la couche `Experience`, mais l'objet doit permettre cette identification de priorité par construction).
- **Un `Milestone` partagé par plusieurs `Procedure`** devient incohérent si l'une des procédures change de délai sans que l'autre ne suive : signalé explicitement comme une tension à arbitrer, jamais résolu silencieusement par une moyenne ou un choix arbitraire.

---

## 10. Exemples

**Cas simple** : `Milestone("Clôture Campus France Maroc")`.

**Cas complexe** : un `Milestone("Arrivée en France")` partagé entre `VisaProcedure` et `HousingProcedure` au sein de la même `Timeline`, servant de point de synchronisation entre les deux démarches.

**Cas exceptionnel** : un `Milestone` est manqué, avec une conséquence documentée sérieuse (ex. perte d'une session d'admission pour l'année) — le système ne minimise jamais cette conséquence, il la documente clairement pour que l'étudiant comprenne l'ampleur réelle de la situation plutôt que de traiter ça comme une simple `Task` en retard parmi d'autres.

---

## 11. Interactions avec les autres objets

**Consomme** : `Procedure` (les points-clés génériques dont il découle), `Timeline` (son contenant).

**Produit / alimente** : l'affichage prioritaire de l'expérience de suivi de parcours.

**En dépendent directement** : les alertes/priorisations affichées à l'utilisateur.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : des conséquences de plus en plus précisément documentées par type de jalon manqué, à mesure que l'expérience accumule des retours réels.
- **Contrainte de compatibilité à préserver** : la distinction nette entre `Milestone` (repère) et `Task` (action) doit rester claire, même si l'un des deux objets s'enrichit fonctionnellement avec le temps.

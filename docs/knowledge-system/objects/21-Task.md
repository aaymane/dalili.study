# Objet métier : Task

**Couche** : Planning
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Task` existe pour porter une **action concrète et datée** à réaliser par une personne précise — l'instanciation, pour un `LearnerProfile` donné, d'une étape générique définie par une `Procedure`.

Il est indispensable pour transformer une connaissance générale ("il faut déposer un dossier Campus France") en une consigne personnelle et actionnable ("dépose TON dossier avant le 15 janvier 2027"), qui est ce qu'un étudiant attend réellement d'un guide, au-delà de la seule information.

---

## 2. Responsabilités

**Autorisé à** :
- Porter un statut d'avancement (à faire, fait, en retard, non applicable), une échéance, un lien vers l'étape générique de `Procedure` dont elle découle.
- Appartenir à une `Timeline` (`BELONGS_TO`).
- Référencer le `Document` requis, le cas échéant.

**Ne doit JAMAIS** :
- Exister sans être rattachée à une `Timeline` (elle-même toujours rattachée à un `LearnerProfile`) — une `Task` sans contexte personnel n'a pas de sens, ce serait alors une étape de `Procedure` générique, pas une `Task`.
- Redéfinir elle-même les exigences d'une étape (ex. les documents requis) — elle référence la définition générique, ne la duplique jamais.

---

## 3. Cycle de vie

1. **Création** : créée lors de l'instanciation d'une `Timeline` à partir d'une `Procedure`, avec une échéance calculée selon le profil (date d'arrivée visée, délais officiels connus).
2. **Suivi** : son statut évolue au fil de l'avancement réel déclaré par l'étudiant ou détecté par le système.
3. **Recalcul** : si une `Procedure`/`Rule` sous-jacente change de façon significative pendant que la `Task` est encore active, elle peut être recalculée (nouvelle échéance) sans perdre son historique de statut déjà enregistré.
4. **Clôture** : marquée `done`, `skipped` (non applicable finalement) ou `cancelled` (le parcours change de nature).

---

## 4. Invariants

- Une `Task` appartient toujours à exactement une `Timeline`.
- Une `Task` référence toujours l'étape générique de `Procedure` dont elle découle — jamais une action inventée sans ancrage dans la connaissance générique.
- Le statut d'une `Task` ne peut jamais revenir en arrière silencieusement (ex. de `done` à `todo`) sans une action explicite et journalisée.

---

## 5. Relations

**Obligatoires** : `BELONGS_TO → Timeline`, `INSTANTIATES → étape de Procedure`.

**Optionnelles** : `REQUIRES → Document`.

---

## 6. États

| État | Description |
|---|---|
| `todo` | À faire, échéance à venir. |
| `overdue` | Échéance dépassée, non complétée. |
| `done` | Complétée. |
| `skipped` | Jugée non applicable pour ce profil en définitive (ex. une étape conditionnelle qui ne s'applique finalement pas). |
| `cancelled` | Le parcours a changé de nature, la tâche n'a plus lieu d'être. |

---

## 7. Transitions

**Autorisées** : `todo → overdue` (par écoulement du temps), `todo/overdue → done`/`skipped`/`cancelled`.

**Interdites** : `done → todo` sans action explicite documentée (une réouverture doit être un acte volontaire tracé, jamais un effet de bord silencieux d'un recalcul).

---

## 8. Validation

Avant création : `Timeline` parente existante, échéance calculée cohérente avec les `Fact`/`Rule` de délais connus au moment de l'instanciation.

---

## 9. Erreurs, cas limites, incohérences

- **Un délai officiel change alors qu'une `Task` a déjà une échéance calculée** : signalé à l'étudiant plutôt que silencieusement recalculé sans notification — la `Task` peut être mise à jour, mais l'historique de l'ancienne échéance reste consultable.
- **Une `Task` devient `overdue` alors qu'elle dépendait d'une étape antérieure non complétée** (ordre logique rompu) : signalé comme une incohérence de séquence, pas juste un simple retard isolé.

---

## 10. Exemples

**Cas simple** : `Task("Déposer le dossier Campus France")`, échéance 15 janvier 2027, statut `todo`.

**Cas complexe** : une `Task` conditionnelle qui devient `skipped` parce que la `Rule` associée à l'étape générique ne s'applique finalement pas à ce profil précis (ex. un pays non-CEF).

**Cas exceptionnel** : un délai officiel se resserre brutalement (annonce tardive d'une clôture anticipée de Campus France) — toutes les `Task` correspondantes à travers toutes les `Timeline` actives concernées doivent pouvoir être identifiées et recalculées en urgence, un cas analogue au flux de changement réglementaire mais appliqué à la couche `Planning`.

---

## 11. Interactions avec les autres objets

**Consomme** : `Procedure` (l'étape générique), `Document` (si requis), `Rule` (pour déterminer son applicabilité et son échéance).

**Produit / alimente** : le suivi de progression affiché à l'utilisateur (`Experience`), potentiellement un `Signal` si de nombreuses `Task` similaires deviennent `overdue` (signe d'un délai irréaliste ou d'une procédure mal calibrée).

**En dépendent directement** : `Timeline` (qui l'agrège), l'expérience utilisateur de suivi de parcours.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : rappels/notifications proactifs (relève d'une capacité applicative future, pas de la définition de l'objet lui-même).
- **Contrainte de compatibilité à préserver** : une `Task` doit toujours rester traçable jusqu'à l'étape générique de `Procedure` dont elle découle, même si le système de notification ou d'affichage évolue fortement.

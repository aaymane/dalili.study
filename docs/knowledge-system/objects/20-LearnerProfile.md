# Objet métier : LearnerProfile

**Couche** : Planning
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`LearnerProfile` existe pour porter, dans un **format unique et partagé**, le contexte d'une personne réelle (ou hypothétique) — origine, niveau d'étude, filière, budget, priorités, dates visées. C'est le "pour qui" de toute réponse personnalisée, consommé par `Reasoning` et possédé par `Planning`.

Il est indispensable parce qu'aujourd'hui, cinq outils différents (Simulateur, Comparateur, Calendrier...) réinventent chacun leur propre façon de représenter "qui pose la question" — `LearnerProfile` élimine cette duplication de représentation, exactement comme `Fact` élimine la duplication de vérité.

---

## 2. Responsabilités

**Autorisé à** :
- Porter les variables structurées nécessaires à toute personnalisation (nationalité, niveau, filière, budget cible, dates, priorités déclarées).
- Être fourni en entrée à `Reasoning` (Rule, Derivation, RecommendationModel) sans que ces objets n'en deviennent propriétaires.
- Être enrichi/mis à jour au fil du parcours réel d'un étudiant suivi dans le temps.
- Piloter l'instanciation d'une `Timeline` à partir d'une `Procedure` générique.

**Ne doit JAMAIS** :
- Porter une logique de calcul ou une règle — il est une donnée d'entrée, jamais un objet actif.
- Être confondu avec `Persona` — un `Persona` est une catégorie éditoriale générale, un `LearnerProfile` est une instance concrète, réelle ou hypothétique, mais toujours singulière.
- Être partagé ou fusionné entre deux personnes différentes, même si leurs profils se ressemblent fortement.

---

## 3. Cycle de vie

1. **Création** : créé au début d'une interaction (un outil, une conversation avec un agent) ou au moment où un étudiant commence à être suivi dans son parcours réel.
2. **Évolution** : mis à jour au fil du temps — un profil n'est pas figé, il reflète la situation réelle et changeante d'une personne (nouvelle date d'arrivée décidée, changement de budget).
3. **Anonymisation/clôture** : un profil peut être clôturé (l'étudiant a terminé son parcours, ou a cessé d'interagir) — ses données ne sont alors plus activement mises à jour, sans être nécessairement supprimées (selon les règles de conservation applicables, hors scope de ce blueprint).

---

## 4. Invariants

- Un `LearnerProfile` ne porte jamais de logique conditionnelle propre — toute règle qui s'y applique vient de `Rule`, appliquée depuis l'extérieur.
- Une `Timeline` possède **toujours** un `LearnerProfile` associé (invariant donné en exemple lors de la validation du Blueprint) — jamais de plan d'action sans un "pour qui" identifié, même hypothétique.
- Un `LearnerProfile` hypothétique (utilisé pour une simulation ou une démonstration à un agent) est structurellement identique à un profil réel — la différence est uniquement dans son usage, jamais dans sa structure.

---

## 5. Relations

**Obligatoires** : aucune à sa création la plus minimale (un profil peut exister avec très peu de champs renseignés, enrichi progressivement).

**Optionnelles** : `RELATED_TO → Persona` (point de départ éditorial, sans jamais s'y substituer), `DRIVES → Recommendation/Task/Timeline`.

---

## 6. États

| État | Description |
|---|---|
| `active` | En cours d'utilisation/de suivi. |
| `dormant` | Créé mais sans interaction récente, potentiellement obsolète sans être clôturé. |
| `closed` | Le parcours est terminé ou l'étudiant a cessé d'interagir. |

---

## 7. Transitions

**Autorisées** : `active → dormant → active` (reprise d'interaction), `active`/`dormant → closed`.

**Interdites** : `closed → active` directement sans une décision explicite de réouverture (par exemple si l'étudiant revient bien plus tard pour un parcours entièrement différent, un nouveau profil est généralement plus approprié qu'une réouverture).

---

## 8. Validation

Avant utilisation par `Reasoning`/`Planning` : au minimum les champs strictement nécessaires à la capacité invoquée (ex. une recommandation de ville nécessite au moins l'origine et un budget indicatif ; un calcul de budget nécessite la ville visée).

---

## 9. Erreurs, cas limites, incohérences

- **Des champs contradictoires sont fournis** (ex. une date d'arrivée dans le passé) : signalé explicitement, jamais silencieusement ignoré ou corrigé à la place de l'utilisateur.
- **Un profil est incomplet pour la capacité demandée** : le moteur de raisonnement doit réclamer l'information manquante plutôt que de deviner une valeur par défaut non signalée (cohérent avec le principe "le doute est un résultat valide").
- **Deux profils très proches sont créés pour la même personne** (ex. par deux canaux différents, site et app, sans lien) : cas à éviter par conception si possible côté distribution, mais si ça arrive, aucun des deux profils n'est fusionné automatiquement sans confirmation explicite de l'utilisateur.

---

## 10. Exemples

**Cas simple** : `LearnerProfile(nationalité=Sénégal, niveau=Master, budget_cible=700€/mois)`.

**Cas complexe** : un profil enrichi au fil du temps — créé avec seulement une nationalité et un niveau d'étude au moment d'une première simulation de budget, puis enrichi de priorités précises (poids du Comparateur) lors d'une interaction ultérieure, puis d'une date d'arrivée précise au moment de démarrer une `Timeline`.

**Cas exceptionnel** : un agent IA tiers interroge une `Capability` de recommandation avec un profil entièrement hypothétique ("un étudiant marocain typique avec 600€/mois") sans qu'aucune personne réelle ne soit derrière — le `LearnerProfile` généré pour cette requête suit exactement les mêmes règles de structure, mais n'est jamais confondu avec un profil suivi dans la durée, et n'accumule pas d'historique au-delà de cette requête ponctuelle.

---

## 11. Interactions avec les autres objets

**Consomme** : `Persona` (optionnellement, comme point de départ).

**Produit / alimente** : `Recommendation` (entrée du raisonnement), `Timeline`/`Task` (instanciation personnalisée d'une `Procedure`).

**En dépendent directement** : toute la couche `Reasoning` (comme entrée) et toute la couche `Planning` (comme possesseur).

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : enrichissement progressif des variables capturées à mesure que de nouvelles capacités de personnalisation apparaissent (ex. préférences de logement plus fines).
- **Multilingue** : la langue préférée de l'utilisateur pourrait devenir un champ de `LearnerProfile`, orientant quelle `Presentation` lui est servie.
- **Contrainte de compatibilité à préserver** : ne jamais laisser `LearnerProfile` accumuler une logique active — il reste, pour toujours, une donnée d'entrée consommée par d'autres couches, jamais un objet qui décide de quoi que ce soit par lui-même.

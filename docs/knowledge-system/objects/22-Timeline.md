# Objet métier : Timeline

**Couche** : Planning
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Timeline` existe pour porter **le plan complet et daté** d'un parcours pour une personne précise — l'assemblage cohérent de `Task`/`Milestone`, instancié à partir d'une ou plusieurs `Procedure` génériques et d'un `LearnerProfile` réel.

Il est indispensable pour transformer le Calendrier actuel (générique par pays, identique pour tout le monde) en un véritable plan personnel — c'est l'objet qui porte la promesse produit "que dois-je faire, moi, cette semaine".

---

## 2. Responsabilités

**Autorisé à** :
- Regrouper des `Task`/`Milestone` dans un ordre et un calendrier cohérents.
- Être instanciée à partir d'une ou plusieurs `Procedure` génériques, pour un `LearnerProfile` précis.
- Être recalculée si le profil change ou si une règle/délai officiel change.

**Ne doit JAMAIS** :
- Exister sans `LearnerProfile` associé — invariant explicitement validé dès la conception du Blueprint.
- Contenir elle-même une logique de démarche générique — celle-ci reste dans `Procedure`, la `Timeline` ne fait qu'instancier et dater.

---

## 3. Cycle de vie

1. **Création** : instanciée à la demande, à partir d'une ou plusieurs `Procedure` pertinentes pour le profil (ex. visa + logement CROUS + ouverture de compte, combinées en une seule timeline de vie si pertinent).
2. **Évolution** : recalculée si le profil ou une règle sous-jacente change de façon significative, sans perdre l'historique des `Task` déjà closes.
3. **Clôture** : une `Timeline` est clôturée quand toutes ses `Task`/`Milestone` sont closes (ou que le parcours est abandonné).
4. **Archivage** : conservée pour l'historique, jamais supprimée — utile pour comprendre a posteriori comment un parcours réel s'est déroulé.

---

## 4. Invariants

- Une `Timeline` possède **toujours** un `LearnerProfile` associé — jamais de plan sans un "pour qui" identifié (invariant donné en exemple, cité tel quel dans la demande de spécification).
- Une `Timeline` instancie toujours au moins une `Procedure` réelle — jamais une séquence d'actions inventée sans ancrage générique.
- Le recalcul d'une `Timeline` ne supprime jamais l'historique des `Task` déjà complétées.

---

## 5. Relations

**Obligatoires** : `FOR → LearnerProfile`, `INSTANTIATES → Procedure` (au moins une).

**Optionnelles** : `CONTAINS → Task`, `CONTAINS → Milestone`.

---

## 6. États

| État | Description |
|---|---|
| `active` | En cours, `Task`/`Milestone` en progression. |
| `completed` | Toutes les étapes closes avec succès. |
| `abandoned` | Le parcours a été interrompu (changement de projet, d'orientation). |
| `archived` | Ancienne, conservée pour historique uniquement. |

---

## 7. Transitions

**Autorisées** : `active → completed`/`abandoned`, `completed`/`abandoned → archived`.

**Interdites** : `archived → active` directement — une reprise de parcours créerait une nouvelle `Timeline`, potentiellement liée à l'ancienne pour le contexte, mais pas une réactivation de l'objet lui-même.

---

## 8. Validation

Avant `active` : `LearnerProfile` valide et suffisamment renseigné pour la ou les `Procedure` concernées, `Task`/`Milestone` initiaux générés de façon cohérente avec les délais officiels connus au moment de l'instanciation.

---

## 9. Erreurs, cas limites, incohérences

- **Un profil change de façon substantielle en cours de route** (ex. changement de pays de destination visé, cas rare mais possible) : la `Timeline` existante ne peut pas être simplement "réparée" — une revue complète, voire une nouvelle instanciation, est nécessaire plutôt qu'un ajustement partiel qui laisserait des incohérences.
- **Deux `Procedure` instanciées dans la même `Timeline` ont des exigences temporelles contradictoires** (ex. deux délais qui se chevauchent de façon intenable) : signalé explicitement à l'utilisateur comme une tension réelle de planning, jamais résolu silencieusement par le système.

---

## 10. Exemples

**Cas simple** : `Timeline("Départ pour la France depuis le Maroc, rentrée 2027")`, instanciant `VisaProcedure` uniquement.

**Cas complexe** : une `Timeline` combinant `VisaProcedure`, `HousingProcedure`, et `BankingProcedure` pour un même `LearnerProfile`, avec des `Milestone` partagés (ex. "arrivée en France") qui servent de point de synchronisation entre les trois procédures.

**Cas exceptionnel** : un délai officiel se resserre après que la `Timeline` a déjà été instanciée et suivie pendant plusieurs semaines — la `Timeline` est recalculée, mais les `Task` déjà `done` restent inchangées dans l'historique, seules les `Task` futures voient leurs échéances ajustées, avec un signalement explicite du changement à l'étudiant.

---

## 11. Interactions avec les autres objets

**Consomme** : `LearnerProfile`, `Procedure` (une ou plusieurs).

**Produit / alimente** : `Task`, `Milestone`, l'expérience de suivi de parcours (`Experience`), potentiellement `Outcome` (le parcours a-t-il abouti comme prévu).

**En dépendent directement** : la future capacité "Timeline"/suivi personnalisé du produit.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : combinaison de plusieurs `Timeline` de vie successives pour un même étudiant (ex. Licence puis Master, chacune avec ses propres démarches).
- **Contrainte de compatibilité à préserver** : l'invariant central (toujours un `LearnerProfile`) ne doit jamais être assoupli, même pour des cas d'usage de démonstration ou de test — utiliser alors un profil hypothétique explicitement marqué comme tel, jamais une `Timeline` sans aucun profil.

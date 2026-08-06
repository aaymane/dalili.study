# Objet métier : Procedure

**Couche** : Knowledge
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Procedure` existe pour porter la **définition générique et réutilisable** d'une démarche administrative — demande de visa, logement CROUS, ouverture de compte bancaire — indépendamment de toute personne réelle. C'est la connaissance abstraite "comment ça marche en général", distincte de "ce que telle personne doit faire, quand" (qui vit dans `Planning`, sous forme de `Timeline`/`Task`).

Il est indispensable parce que sans cette séparation, chaque plan personnalisé (`Timeline`) devrait redéfinir sa propre logique de démarche depuis zéro — `Procedure` est le patron générique instancié à volonté, une seule fois écrit, appliqué à des milliers de profils différents.

---

## 2. Responsabilités

**Autorisé à** :
- Décrire une séquence d'étapes génériques, chacune pouvant `REQUIRES` un ou plusieurs `Document`.
- Être spécialisée par sous-type (`VisaProcedure`, `HousingProcedure`, `BankingProcedure`, `HealthProcedure`) héritant d'une structure d'étapes commune.
- Être associée à un `Country` (une procédure de visa diffère selon le pays d'origine) et/ou une `Organization` responsable.
- Être référencée par une `Rule` qui en conditionne certaines étapes selon le profil.

**Ne doit JAMAIS** :
- Porter une date ou une échéance précise — les échéances datées appartiennent à `Timeline`/`Milestone`, jamais à la définition générique.
- Référencer un `LearnerProfile` réel — `Procedure` reste anonyme et générique par construction.
- Dupliquer les données d'un `Document` requis — elle référence le type de document, ne le redéfinit pas.

---

## 3. Cycle de vie

1. **Création** : créée dès qu'une démarche administrative devient pertinente à documenter formellement.
2. **Révision** : révisée quand une `Regulation` sous-jacente change (ex. une nouvelle procédure consulaire).
3. **Versionnement** : une révision substantielle d'une `Procedure` (nouvelle séquence d'étapes) crée une nouvelle version, avec l'ancienne marquée `superseded` — les `Timeline` déjà instanciées sur l'ancienne version restent valides telles quelles pour ne pas perturber un parcours déjà engagé.
4. **Obsolescence** : une procédure peut disparaître (ex. suppression d'une étape administrative par simplification réglementaire) — passe à `deprecated`.
5. **Archivage** : conservée pour l'historique, jamais supprimée.

---

## 4. Invariants

- Une `Procedure` ne référence jamais un `LearnerProfile` — elle reste générique, la personnalisation se fait exclusivement au moment de l'instanciation en `Timeline`.
- Toute étape d'une `Procedure` qui requiert un document référence un `Document` réellement défini dans le référentiel, jamais un texte libre non structuré.
- Une révision substantielle d'une `Procedure` ne modifie jamais silencieusement une `Timeline` déjà instanciée sur une version antérieure.

---

## 5. Relations

**Obligatoires** : aucune à sa création la plus minimale.

**Optionnelles** : `REQUIRES → Document` (plusieurs), `FOR_COUNTRY → Country`, `RESPONSIBLE_ORGANIZATION → Organization`, `DERIVED_FROM → Regulation`, `is_a` (sous-type de Procedure).

**Relations entrantes** : `INSTANTIATES ← Timeline`/`Task`.

**Contraintes** : une `Procedure` spécifique à un pays (`FOR_COUNTRY`) ne doit jamais être appliquée par erreur à un profil d'un autre pays — c'est une contrainte vérifiée au moment de l'instanciation, pas une possibilité laissée ouverte.

---

## 6. États

| État | Description |
|---|---|
| `active` | En vigueur, instanciable pour de nouvelles `Timeline`. |
| `needs_review` | Une `Regulation`/`Rule` associée a changé, revue nécessaire avant de continuer à l'utiliser pour de nouvelles instanciations. |
| `superseded` | Remplacée par une nouvelle version, les anciennes `Timeline` déjà créées restent valables sur cette version. |
| `deprecated` | La démarche elle-même n'existe plus (simplification administrative). |
| `archived` | Ancienne, conservée pour mémoire. |

---

## 7. Transitions

**Autorisées** : `active → needs_review → active` (revue confirmée) ou `→ superseded` (remplacée), `active/superseded → deprecated`, `deprecated → archived`.

**Interdites** : `deprecated → active` directement (une démarche réintroduite serait revue entièrement comme une nouvelle procédure, pas simplement réactivée).

---

## 8. Validation

Avant `active` : au moins une étape définie, ses `Document` requis identifiés, son organisme responsable si applicable identifié.

---

## 9. Erreurs, cas limites, incohérences

- **Une étape de procédure est conditionnelle selon le profil** (ex. "obligatoire pour les pays CEF, facultative sinon") : modélisée via une `Rule` associée à l'étape, jamais par une branche codée en dur dans la `Procedure` elle-même.
- **Une `Procedure` change en cours d'année scolaire, pendant que des `Timeline` sont déjà en cours** : les `Timeline` déjà instanciées ne sont jamais silencieusement modifiées — un signalement explicite est envoyé aux profils concernés si le changement les affecte réellement, mais leur plan reste basé sur la version au moment de sa création.
- **Deux `Procedure` se chevauchent partiellement** (ex. "demande de visa" et "validation OFII" pourraient être une seule procédure en plusieurs étapes ou deux procédures liées) : décision éditoriale à trancher au cas par cas, mais toujours documentée explicitement, jamais laissée ambiguë.

---

## 10. Exemples

**Cas simple** : `Procedure("Ouverture de compte bancaire étudiant")`, avec deux étapes (choisir une banque, fournir les documents), `REQUIRES → Document("Passeport")`.

**Cas complexe** : `VisaProcedure("Demande de visa étudiant — pays CEF")`, avec une étape conditionnelle "Campus France" présente uniquement si le `Country` d'origine est CEF (vérifié via une `Rule` associée), sinon l'étape est omise.

**Cas exceptionnel** : une réforme administrative fusionne deux procédures distinctes en une seule (ex. simplification d'une double démarche consulat+OFII) — l'ancienne paire de `Procedure` passe `deprecated`, une nouvelle `Procedure` unifiée est créée, avec un lien explicite de continuité pour ne pas perdre le contexte historique des anciennes `Timeline`.

---

## 11. Interactions avec les autres objets

**Consomme** : `Document`, `Country`, `Organization`, `Regulation`, `Rule` (pour les conditions).

**Produit / alimente** : `Timeline`/`Task` (via `INSTANTIATES`), `Content` (des guides pratiques peuvent décrire une `Procedure`).

**En dépendent directement** : toute la couche `Planning` — sans `Procedure`, aucune `Timeline` personnalisée ne peut être construite.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : granularité plus fine des sous-types (`VisaProcedure` pourrait se spécialiser encore par statut CEF/non-CEF si le besoin se confirme).
- **Nouveaux pays** : chaque nouveau pays d'origine documenté peut nécessiter ses propres variantes de `Procedure` (`FOR_COUNTRY`), sans changement structurel de l'objet lui-même.
- **Contrainte de compatibilité à préserver** : `Procedure` doit rester strictement générique — la tentation d'y intégrer une personnalisation "pour aller plus vite" doit toujours être résistée, au profit de la séparation stricte avec `Planning`.

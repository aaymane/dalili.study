# Objet métier : Rule

**Couche** : Reasoning
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Rule` existe pour porter une **connaissance conditionnelle** — "si tel profil ou telle situation, alors telle conséquence" — de manière déclarative et lisible, jamais enfouie dans du code applicatif invisible et non-auditable.

Il est indispensable parce que le raisonnement, par définition, consiste à appliquer des règles à des faits. Sans `Rule` comme objet du système, cette logique reste dispersée dans des fonctions de code isolées (aujourd'hui : un `if` caché dans `lib/comparer-scores.ts` ou équivalent), impossible à interroger globalement ("quelles règles s'appliquent à tel persona ?") et risquée à faire évoluer proprement.

---

## 2. Responsabilités

**Autorisé à** :
- Exprimer une condition portant sur un `Persona`/motif de `LearnerProfile`, et une conséquence (une contrainte, une exclusion, ou une transformation d'un `Fact` générique en valeur effective).
- Dériver explicitement d'une `Regulation` (`DERIVED_FROM`) quand elle a une origine légale, ou d'une décision éditoriale documentée sinon.
- Être appliquée par le moteur de raisonnement (section 6 du Blueprint) lors de la résolution d'une `Recommendation`/`Derivation`.

**Ne doit JAMAIS** :
- Porter elle-même une valeur numérique brute — elle transforme ou contraint un `Fact` existant, elle n'en invente pas un nouveau de toutes pièces sans traçabilité.
- Référencer un `LearnerProfile` réel et individuel — elle reste générale, applicable à quiconque correspond à sa condition, jamais écrite "pour" une personne précise.
- Être appliquée silencieusement sans laisser de trace dans l'explication d'une `Recommendation`/`Derivation` qui l'utilise.

---

## 3. Cycle de vie

1. **Création** : créée quand une logique conditionnelle récurrente est identifiée (ex. le plafond de travail spécifique aux étudiants algériens).
2. **Révision** : révisée automatiquement mise en `needs_review` si la `Regulation` dont elle dérive change (flux B du Blueprint).
3. **Versionnement** : une révision de la condition ou de la conséquence crée une nouvelle version, l'ancienne devenant `superseded`.
4. **Obsolescence** : une règle devient `deprecated` si le contexte qui la justifiait disparaît (ex. un accord bilatéral abrogé sans remplacement).

---

## 4. Invariants

- Une `Rule` `active` possède toujours une origine identifiable (une `Regulation`, ou une méthodologie éditoriale documentée si elle n'a pas d'origine légale).
- Toute application d'une `Rule` dans un raisonnement laisse une trace explicite dans l'objet qui l'utilise (`Derivation`/`Recommendation`) — jamais une application silencieuse.
- Deux `Rule` `active` ne peuvent pas produire des conséquences contradictoires pour un même profil sans qu'une priorité explicite entre elles soit définie.

---

## 5. Relations

**Obligatoires** : une origine — `DERIVED_FROM → Regulation` ou une méthodologie éditoriale documentée.

**Optionnelles** : `APPLIES_TO → Persona` (motif de correspondance), `PRODUCES → Fact effectif/contrainte`.

**Relations entrantes** : `USES ← Recommendation/Derivation` (traçabilité de l'application).

---

## 6. États

| État | Description |
|---|---|
| `draft` | Identifiée, condition/conséquence pas encore finalisées. |
| `active` | Appliquée par le moteur de raisonnement. |
| `needs_review` | Sa `Regulation` d'origine a changé, revue nécessaire avant de continuer à l'appliquer avec confiance. |
| `superseded` | Remplacée par une nouvelle version. |
| `deprecated` | N'a plus lieu de s'appliquer (contexte disparu). |

---

## 7. Transitions

**Autorisées** : `draft → active`, `active → needs_review → active`/`superseded`, `active/superseded → deprecated`.

**Interdites** : `deprecated → active` directement (une règle réintroduite serait revue comme entièrement nouvelle).

---

## 8. Validation

Avant `active` : origine identifiée et documentée, condition et conséquence non ambiguës, absence de contradiction non résolue avec une autre `Rule` déjà active sur le même périmètre.

---

## 9. Erreurs, cas limites, incohérences

- **Deux `Rule` s'appliquent au même profil avec des conséquences contradictoires** : jamais résolu arbitrairement par le moteur — soit une priorité explicite est définie entre les deux règles au niveau de leur définition, soit le conflit est signalé comme un cas à trancher éditorialement avant publication.
- **Une `Rule` dérive d'une `Regulation` qui devient `superseded`** : passage automatique en `needs_review`, jamais une application continue silencieuse de l'ancienne conséquence.
- **Une `Rule` éditoriale (sans origine légale) est contestée** (via `Outcome`/`Signal`) : traitée comme n'importe quelle révision de connaissance éditoriale, avec la même rigueur qu'un `Judgment` contesté.

---

## 10. Exemples

**Cas simple** : `Rule("Si nationalité = Algérie, alors plafond de travail = 803h/an")`, `DERIVED_FROM → Regulation(Accord franco-algérien 1968)`.

**Cas complexe** : une `Rule` qui exclut certaines `University` d'une recommandation pour un profil donné (ex. un niveau d'étude non proposé) — sa "conséquence" n'est pas une valeur transformée mais une exclusion d'option, un type de conséquence différent à bien distinguer dans la trace d'explication.

**Cas exceptionnel** : une `Rule` éditoriale (pas issue d'un texte de loi) est créée pour capturer une pratique observée mais non écrite dans un texte officiel (ex. un délai de traitement consulaire "de fait" plus long en période estivale) — sa méthodologie documentée doit alors préciser explicitement qu'il s'agit d'une observation empirique, pas d'une règle légale, pour ne jamais induire en erreur sur son niveau d'autorité.

---

## 11. Interactions avec les autres objets

**Consomme** : `Regulation` (origine), `Fact` (ce qu'elle transforme/contraint), `Persona` (condition d'application).

**Produit / alimente** : `Derivation` (une règle peut transformer une entrée avant calcul), `Recommendation` (exclusion/contrainte sur les options), `Procedure` (une étape peut être conditionnelle via une `Rule`).

**En dépendent directement** : tout le moteur de raisonnement (section 6 du Blueprint).

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : un mécanisme explicite de priorité entre règles si leur nombre grandit au point que les conflits deviennent plus fréquents.
- **Nouveaux pays** : chaque nouvel accord bilatéral ou spécificité nationale se traduit par une nouvelle `Rule`, sans changement structurel de l'objet.
- **Contrainte de compatibilité à préserver** : la traçabilité systématique de toute application d'une règle (invariant central) ne doit jamais devenir optionnelle, même si le volume de règles actives grandit fortement.

# Objet métier : Source

**Couche** : Truth
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Source` existe pour porter **la preuve** qu'un `Fact`, une `Rule`, ou une méthodologie de `Judgment` est réellement fondé sur quelque chose de vérifiable, extérieur au jugement de Dalili elle-même. Sans `Source`, un `Fact` n'est qu'une affirmation — avec `Source`, c'est une affirmation traçable jusqu'à son origine.

Il est indispensable parce que la mission profonde de Dalili (être un guide de confiance, pas une agence qui approxime) dépend entièrement de la capacité à répondre "d'où vient ce chiffre" à tout moment. Le problème qu'il résout : *"comment garantir qu'aucune information n'est publiée sans preuve vérifiable, et que cette preuve reste retrouvable même si le document d'origine change ou disparaît"*.

---

## 2. Responsabilités

**Autorisé à** :
- Porter une référence à un document externe (URL, titre, éditeur/organisme émetteur).
- Porter un niveau d'autorité (tier) qui qualifie la fiabilité relative de la source.
- Porter une date de consultation (`retrieved_at`) et, si possible, une copie archivée pour se prémunir du lien mort ou du contenu modifié après coup.
- Être réutilisée par de nombreux `Fact`/`Rule`/méthodologies de `Judgment` différents (une même source officielle sert souvent plusieurs faits).

**Ne doit JAMAIS** :
- Porter elle-même une valeur de fait (`Source` prouve, elle n'affirme pas — l'affirmation vit dans `Fact`).
- Être un autre contenu de Dalili (un article Dalili ne peut jamais être la `Source` d'un `Fact` Dalili — ce serait une preuve circulaire).
- Être créée sans URL ni identifiant vérifiable — une "source" qu'on ne peut pas retrouver n'en est pas une.
- Servir de prétexte à ne pas vérifier un fait précis — une `Source` générale ("le site du gouvernement") ne suffit jamais, elle doit pointer vers le document ou la page précise qui contient l'affirmation.

---

## 3. Cycle de vie

1. **Création** : une `Source` est créée dès qu'un document officiel pertinent est identifié pendant une recherche, avant même de savoir combien de `Fact` elle servira.
2. **Réutilisation** : une `Source` existante est réutilisée pour tout nouveau `Fact` qui s'appuie sur le même document — elle n'est jamais recréée en double pour la même URL/document.
3. **Évolution** : une `Source` elle-même change rarement de contenu (le document externe qu'elle référence peut évoluer, mais la `Source` telle qu'enregistrée à une date de consultation donnée reste un instantané fixe). Si le document source est mis à jour de façon significative, une **nouvelle** `Source` est créée (nouvelle date de consultation), l'ancienne n'est pas modifiée en place.
4. **Dégradation** : une `Source` peut devenir `stale` si son URL ne résout plus, ou si le document a changé de contenu sans qu'une nouvelle `Source` n'ait encore été créée pour capturer ce changement.
5. **Archivage** : une `Source` n'est jamais supprimée, même `stale` — elle reste la preuve historique de ce qui justifiait un `Fact` à une époque donnée.

---

## 4. Invariants

- Une `Source` possède toujours une URL ou une référence documentaire vérifiable (jamais une simple mention textuelle du type "selon le gouvernement").
- Une `Source` possède toujours une date de consultation (`retrieved_at`) — jamais "intemporelle".
- Un tier d'autorité est toujours assigné, jamais laissé indéfini — un `Fact` sans tier connu de sa source ne peut pas calculer son niveau de confiance (voir `Recommendation`, section confiance).
- Une `Source` `stale` ne peut plus servir à valider un **nouveau** `Fact`, mais reste valide comme preuve historique pour les `Fact` déjà publiés qui s'appuyaient dessus au moment de leur création.

---

## 5. Relations

**Obligatoires** : aucune — `Source` est un objet autonome, il n'a besoin de rien d'autre pour exister (à l'inverse de `Fact` qui a besoin d'elle).

**Relations entrantes (qui s'appuie sur une `Source`)** :
- `SOURCES ← Fact` (une ou plusieurs).
- `SOURCES ← Rule` (quand la règle dérive directement d'un texte, indépendamment de la `Regulation` associée si elle existe).
- `DOCUMENTS ← méthodologie de Judgment`.

**Contraintes** : une `Source` de tier 4 ("autre") ne peut pas à elle seule justifier un `Fact` à fort enjeu réglementaire (frais, plafonds légaux) — ce type de fait exige au moins un tier 1 ou 2 (voir Blueprint, section 4, hiérarchie d'autorité).

---

## 6. États

| État | Description |
|---|---|
| `active` | La source est consultable, son URL résout, elle peut justifier de nouveaux `Fact`. |
| `stale` | L'URL ne résout plus, ou le contenu a visiblement changé sans nouvelle capture — ne peut plus fonder de nouveau `Fact`, déclenche une revue des `Fact` existants qui s'appuient dessus. |
| `archived` | Conservée uniquement pour la mémoire historique, sans plus aucune pertinence opérationnelle (ex. un organisme qui a cessé d'exister). |

---

## 7. Transitions

**Autorisées** :
- `active → stale` (détection d'un lien mort ou d'un changement de contenu, automatique ou signalé humainement).
- `stale → active` (revérifiée, l'URL est de nouveau valide et le contenu confirmé identique).
- `active`/`stale → archived` (décision éditoriale que la source n'a plus aucune pertinence, même historique active).

**Interdites** :
- Modifier le contenu référencé d'une `Source` déjà utilisée par un `Fact` publié sans créer une nouvelle `Source` — ça romprait la preuve historique de ce qui justifiait le `Fact` au moment de sa création.
- `archived → active` directement — une source archivée qui redevient pertinente doit être réévaluée comme si elle était nouvelle (nouvelle date de consultation), pas simplement réactivée telle quelle.

---

## 8. Validation

Avant qu'une `Source` puisse justifier un `Fact` publié :
- URL ou référence résolvable et vérifiée au moment de la création.
- Tier d'autorité assigné explicitement (jamais par défaut).
- Date de consultation renseignée.
- Si la source sert un fait à fort enjeu (montant réglementaire), le tier doit être suffisant (1 ou 2) — sinon le `Fact` reste bloqué à l'état `draft`/`needs_review` en attendant une source plus autoritaire.

---

## 9. Erreurs, cas limites, incohérences

- **Lien mort découvert a posteriori** : ne remet pas en cause automatiquement le `Fact` associé (il restait vrai au moment de la vérification), mais déclenche `needs_review`.
- **Deux organismes officiels publient des chiffres différents pour la même chose** (ex. deux ministères) : chacun devient une `Source` distincte, et le conflit se résout au niveau du `Fact` (statut `disputed`), pas en supprimant l'une des deux sources.
- **Une source est en réalité un agrégateur non officiel** (ex. un site tiers qui recopie un texte de loi) : elle doit être classée à un tier inférieur à la source primaire, jamais confondue avec elle.
- **Absence totale de source officielle disponible pour un fait pourtant nécessaire** : le `Fact` correspondant reste `draft` indéfiniment plutôt que d'être publié avec une source insuffisante — mieux vaut une absence de donnée qu'une donnée mal sourcée.

---

## 10. Exemples

**Cas simple** : `Source(url=legifrance.gouv.fr/..., titre="Décret n°2026-385", tier=1, retrieved_at=2026-07-11)`.

**Cas complexe** : une `Source` de tier 3 (campusfrance.org) documente la procédure CEF, mais un `Fact` sur les frais de dossier CEF par pays nécessite de recouper avec les pages spécifiques par pays du même site — chacune devient sa propre `Source` (URL distincte), même si elles appartiennent au même organisme.

**Cas exceptionnel** : une `Source` gouvernementale change de plateforme entière (refonte d'un site officiel) — toutes les anciennes URLs deviennent `stale` en masse, déclenchant une vague de `needs_review` sur tous les `Fact` concernés simultanément — un cas qui doit être géré comme un événement exceptionnel de maintenance, pas silencieusement absorbé.

---

## 11. Interactions avec les autres objets

**Consomme** : rien.

**Produit / alimente** : `Fact` (`SOURCED_BY`), `Rule`, la méthodologie documentée d'un `Judgment`.

**En dépendent directement** : tout `Fact` publié, indirectement tout ce qui cite ces `Fact`.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : un mécanisme d'archivage systématique (copie horodatée du contenu au moment de la consultation) pour ne plus dépendre de la pérennité des sites externes.
- **Nouveaux types de sources** : à mesure que la couverture géographique s'étend, de nouveaux organismes officiels par pays d'origine (ministères étrangers, ambassades) viendront enrichir le registre de tiers — la structure n'a pas besoin de changer, seulement la liste des organismes reconnus.
- **Contrainte de compatibilité à préserver** : la hiérarchie de tiers doit rester interprétable de la même façon dans 10 ans qu'aujourd'hui — un tier 1 doit toujours signifier "texte de loi brut", jamais glisser vers une définition plus laxiste au fil du temps.

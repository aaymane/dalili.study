# Objet métier : Regulation

**Couche** : Truth
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Regulation` existe pour traiter un texte de loi ou un décret comme un **objet de première classe**, distinct d'une simple `Source`. Une `Source` prouve une affirmation ponctuelle ; une `Regulation` représente **la règle elle-même**, dont peuvent dépendre plusieurs `Fact` et plusieurs `Rule` simultanément.

Il est indispensable parce qu'un changement réglementaire (ex. le décret plafonnant les exonérations de frais de scolarité) n'affecte jamais un seul chiffre isolé — il affecte potentiellement des dizaines de `Fact` et de `Rule` à travers tout le système. Sans `Regulation` comme objet distinct, retrouver "tout ce qui dépend de cette règle précise" exige un travail de recherche manuel (le grep du dossier `content/`, déjà pratiqué et déjà pris en défaut une fois). Avec `Regulation`, cette question devient une requête directe et garantie exhaustive.

---

## 2. Responsabilités

**Autorisé à** :
- Représenter un texte réglementaire ou légal précis, avec sa date d'effet et sa référence officielle.
- Être la cible de la relation `DERIVED_FROM`/`GOVERNS` depuis n'importe quel `Fact` ou `Rule` qui en découle directement.
- Être elle-même remplacée par une nouvelle `Regulation` (un nouveau décret abroge et remplace l'ancien).

**Ne doit JAMAIS** :
- Porter directement une valeur numérique utilisable (le chiffre lui-même vit dans le `Fact` qui en dérive, pas dans la `Regulation`).
- Être confondue avec une `Source` générique — une `Regulation` est le texte réglementaire en tant que règle qui gouverne, une `Source` est la preuve documentaire d'un fait quelconque (une `Regulation` a d'ailleurs presque toujours sa propre `Source` de tier 1 associée).
- Être supprimée, même quand elle est abrogée — l'histoire réglementaire doit rester consultable.

---

## 3. Cycle de vie

1. **Création** : une `Regulation` est créée dès qu'un texte réglementaire pertinent pour le domaine de Dalili est identifié (promulgation d'une loi, publication d'un décret, signature d'un accord bilatéral).
2. **Vigueur** : elle devient `in_force` à sa date d'effet réelle (qui peut être postérieure à sa date de publication).
3. **Remplacement** : quand un nouveau texte l'abroge ou la modifie substantiellement, elle devient `superseded`, reliée au nouveau texte via `SUPERSEDED_BY`.
4. **Déclenchement en cascade** : dès qu'une `Regulation` devient `superseded`, tous les `Fact`/`Rule` qui la référencent via `DERIVED_FROM`/`GOVERNS` sont automatiquement listés pour revue (`needs_review`) — c'est la responsabilité la plus importante de cet objet.
5. **Archivage** : une `Regulation` très ancienne, sans plus aucun `Fact`/`Rule` actif qui en dépend, peut être archivée pour alléger la surface active, sans jamais être supprimée.

---

## 4. Invariants

- Une `Regulation` `in_force` a toujours une date d'effet renseignée et cohérente (pas dans le futur sans qu'elle soit alors à l'état `announced`, voir section états).
- Le remplacement d'une `Regulation` (passage à `superseded`) déclenche **toujours** et **automatiquement** la mise en revue de tout ce qui en dépend — ce n'est jamais une étape manuelle optionnelle.
- Une `Regulation` ne peut jamais être son propre remplaçant (pas de cycle `SUPERSEDES`).
- Deux `Regulation` `in_force` simultanément ne peuvent pas gouverner exactement le même domaine de manière contradictoire sans qu'un des deux textes soit explicitement marqué comme prioritaire (hiérarchie des normes) — sinon la couche `Reasoning` ne saurait pas laquelle appliquer.

---

## 5. Relations

**Obligatoires** : une `Regulation` possède idéalement une `Source` de tier 1 (le texte officiel lui-même), mais peut exister brièvement sans, le temps de la retrouver, tant qu'elle n'est pas encore `in_force`.

**Optionnelles** :
- `SUPERSEDES` / `SUPERSEDED_BY → Regulation` (chaîne de remplacement des textes).

**Relations entrantes** :
- `GOVERNS ← Fact`, `← Rule` — tout fait ou règle qui découle directement de ce texte.

**Contraintes** : la relation `GOVERNS` entrante doit toujours être interrogeable dans les deux sens — c'est cette navigation bidirectionnelle qui rend le flux "changement réglementaire" (Blueprint, section 5) possible sans recherche manuelle.

---

## 6. États

| État | Description |
|---|---|
| `announced` | Le texte a été voté/signé mais sa date d'effet n'est pas encore atteinte — les `Fact` qui en découleront restent `draft` jusqu'à l'entrée en vigueur réelle. |
| `in_force` | En application. Toute `Rule`/`Fact` qui en dérive peut être `active`. |
| `superseded` | Remplacée par un texte plus récent. Déclenche la revue de tout ce qui en dépendait. |
| `archived` | Ancienne, sans plus aucune dépendance active, conservée pour mémoire historique uniquement. |

---

## 7. Transitions

**Autorisées** :
- `announced → in_force` (à la date d'effet, jamais avant).
- `in_force → superseded` (un nouveau texte la remplace).
- `superseded → archived` (plus aucune dépendance active, décision éditoriale d'alléger).

**Interdites** :
- `announced → superseded` directement (un texte ne peut être "remplacé" qu'après être réellement entré en vigueur — sinon ce n'est qu'une annulation avant application, un cas différent à traiter comme un simple retrait, pas un remplacement).
- `superseded → in_force` (un texte abrogé ne redevient jamais en vigueur automatiquement — une réintroduction législative créerait une nouvelle `Regulation`).

---

## 8. Validation

Avant qu'une `Regulation` puisse passer à `in_force` :
- Référence légale précise et vérifiable.
- Date d'effet cohérente et atteinte.
- Idéalement une `Source` de tier 1 liée (le texte lui-même) — tolérée en son absence uniquement de façon temporaire et signalée.

---

## 9. Erreurs, cas limites, incohérences

- **Un décret est annoncé puis retiré avant son entrée en vigueur** : la `Regulation` ne passe jamais `in_force`, elle est marquée `withdrawn` (variante d'archivage précoce) plutôt que de suivre le cycle normal `in_force → superseded`.
- **Deux textes réglementaires se contredisent sans qu'aucun n'abroge explicitement l'autre** : cas à signaler explicitement comme un conflit de hiérarchie des normes (nécessite un arbitrage humain/juridique, jamais résolu automatiquement par le système).
- **Une `Regulation` entre en vigueur rétroactivement** (rare mais possible en droit) : la date d'effet peut être antérieure à la date de création de l'objet — cas explicitement toléré, mais les `Fact` qui en découlent doivent porter la vraie date d'effet rétroactive, pas la date de découverte par Dalili.
- **Une cascade de revue déclenchée par une `Regulation` génère un volume de `Fact` à revoir trop important pour être traité immédiatement** : le système doit pouvoir prioriser (ex. par trafic/impact des `Content` concernés) plutôt que de traiter la liste dans un ordre arbitraire.

---

## 10. Exemples

**Cas simple** : `Regulation(titre="Décret n°2026-385 relatif au plafonnement des exonérations de frais de scolarité", date_effet=2026-09-01, tier=1)`.

**Cas complexe** : l'accord franco-algérien du 27 décembre 1968, toujours `in_force` près de 60 ans plus tard, qui gouverne simultanément plusieurs `Rule` distinctes (plafond horaire de travail, nature du titre de séjour) — une seule `Regulation` peut gouverner plusieurs `Rule` de domaines différents.

**Cas exceptionnel** : un texte réglementaire prévoit une entrée en vigueur progressive sur plusieurs années (le décret de mai 2026 prévoit 30% en 2026-2027, 25% en 2027-2028, 20% à partir de 2028-2029) — modélisé comme **une seule** `Regulation`, mais qui gouverne **plusieurs** `Fact` successifs déjà planifiés à l'avance, chacun avec sa propre période de validité future connue dès aujourd'hui.

---

## 11. Interactions avec les autres objets

**Consomme** : une `Source` (le texte officiel lui-même).

**Produit / alimente** : `Fact` et `Rule` qui en dérivent directement (`GOVERNS`).

**En dépendent directement** : tout le mécanisme de détection de changement réglementaire (flux B du Blueprint), et donc indirectement toute la fraîcheur du système.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : modélisation plus fine de la hiérarchie des normes (loi > décret > circulaire > jurisprudence) si le volume de textes suivis grandit au point de nécessiter d'arbitrer entre eux automatiquement.
- **Nouveaux pays** : à mesure que Dalili couvre plus de nationalités d'origine, des `Regulation` de droit étranger (accords bilatéraux avec d'autres pays que l'Algérie) viendront s'ajouter — la structure reste identique.
- **Contrainte de compatibilité à préserver** : la déclenchement automatique de revue en cascade (invariant central) ne doit jamais devenir optionnel ou différé, même si le volume de textes suivis grandit fortement — c'est la garantie que Dalili ne peut plus "rater" un changement réglementaire comme cela s'est déjà produit une fois.

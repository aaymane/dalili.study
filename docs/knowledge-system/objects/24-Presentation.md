# Objet métier : Presentation

**Couche** : Experience
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Presentation` existe pour porter la **mise en forme** d'une entité ou d'un contenu pour un canal et une langue donnés — title/description SEO, structuration GEO/AEO, format d'affichage — sans jamais porter la moindre valeur de vérité elle-même.

Il est indispensable pour éliminer la duplication manuelle actuelle des métadonnées SEO (`UNI_SEO`/`CITY_SEO`, 28 objets tenus à la main) et pour permettre qu'une même connaissance soit présentée différemment selon qu'elle s'adresse à un navigateur web, un agent IA, ou une notification d'application, sans jamais recréer la connaissance elle-même pour chaque canal.

---

## 2. Responsabilités

**Autorisé à** :
- Porter un title, une description, un format schema.org, une structuration de question-réponse — pour une combinaison précise (entité ou contenu, canal, langue).
- Être régénérée automatiquement à partir de l'entité/contenu source, avec une possibilité de surcharge éditoriale assumée si une formulation sur-mesure a une valeur ajoutée réelle (ex. optimisation CTR).

**Ne doit JAMAIS** :
- Porter une valeur de vérité (un chiffre) — elle ne fait que mettre en forme ce que `Fact`/`Content` fournissent déjà.
- Être la seule copie d'une information — si une information n'existe que dans une `Presentation` et nulle part ailleurs, c'est une erreur de conception, pas un usage normal de cet objet.

---

## 3. Cycle de vie

1. **Génération** : produite (automatiquement ou avec surcharge éditoriale) pour chaque nouvelle combinaison (entité/contenu, canal, langue) pertinente.
2. **Régénération** : régénérée si la convention de présentation change (ex. raccourcir tous les titres à 60 caractères) — un changement de règle de présentation ne touche jamais l'entité/contenu source.
3. **Obsolescence** : devient obsolète si l'entité/contenu source disparaît, ou si le canal/langue n'est plus supporté.

---

## 4. Invariants

- Une `Presentation` ne contient jamais une valeur qui n'existe pas déjà dans l'entité/contenu qu'elle met en forme, ou dans les `Fact` qu'il cite.
- Une même entité/contenu peut avoir plusieurs `Presentation` simultanées (une par canal+langue), sans qu'aucune ne soit "la seule vraie version".

---

## 5. Relations

**Obligatoires** : `PRESENTS → Entity ou Content` (pour un canal+langue donnés).

---

## 6. États

| État | Description |
|---|---|
| `generated` | Produite automatiquement depuis la source. |
| `overridden` | Une surcharge éditoriale a été appliquée (ex. titre optimisé CTR manuellement). |
| `stale` | La source a changé de façon significative depuis la dernière génération/surcharge, régénération recommandée. |

---

## 7. Transitions

**Autorisées** : `generated → overridden` (surcharge éditoriale), `generated/overridden → stale` (source modifiée), `stale → generated`/`overridden` (régénérée).

**Interdites** : aucune transition ne doit jamais faire porter à la `Presentation` une valeur qui contredirait sa source — une surcharge concerne la formulation, jamais le fait sous-jacent.

---

## 8. Validation

Avant utilisation en production : cohérence avec l'entité/contenu source (pas de contradiction factuelle), respect des conventions de format du canal ciblé (longueur, structure).

---

## 9. Erreurs, cas limites, incohérences

- **Une surcharge éditoriale (`overridden`) contredit factuellement la source** (ex. un titre qui affirme un chiffre différent de celui du `Fact` cité) : ne doit jamais être possible — la validation doit détecter et bloquer ce type d'incohérence avant publication.
- **Un canal nouvellement supporté n'a pas encore de `Presentation` pour une entité déjà ancienne** : traité par génération automatique à la demande plutôt que par un vide non signalé.

---

## 10. Exemples

**Cas simple** : `Presentation(entité=University("Bordeaux"), canal=web, langue=fr, title="Université de Bordeaux : guide 2026")`.

**Cas complexe** : la même `University` avec une `Presentation` distincte pour le canal `ai_agent` — une version condensée, factuelle, sans arguments marketing, pensée pour être reformulée fidèlement par un moteur IA plutôt que pour maximiser un CTR humain.

**Cas exceptionnel** : une convention de présentation change globalement (ex. décision de raccourcir tous les titres) — toutes les `Presentation` `generated` concernées sont régénérées en masse, tandis que celles `overridden` (surcharge éditoriale volontaire) sont signalées pour une revue humaine plutôt que réécrasées automatiquement, pour respecter l'intention éditoriale déjà investie.

---

## 11. Interactions avec les autres objets

**Consomme** : `University`, `City`, `Content`, `Question`, `Fact` (indirectement, via ce qu'il présente).

**Produit / alimente** : le rendu final consommé par le site, un agent IA, l'application.

**En dépendent directement** : `Capability`/`Knowledge Pack` qui retournent une réponse mise en forme.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : de nouveaux canaux (ex. un futur assistant vocal) n'exigent que l'ajout d'une nouvelle valeur de dimension "canal", sans changement structurel.
- **Multilingue** : la dimension "langue" existe déjà dans la conception — ajouter l'arabe ou l'anglais consiste à peupler de nouvelles `Presentation`, jamais à re-concevoir l'objet.
- **Contrainte de compatibilité à préserver** : `Presentation` ne doit jamais devenir un lieu où une vérité existe uniquement — c'est la garantie qui la maintient strictement dans la couche `Experience`.

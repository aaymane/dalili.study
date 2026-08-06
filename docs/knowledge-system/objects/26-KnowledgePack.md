# Objet métier : Knowledge Pack

**Couche** : Distribution
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Knowledge Pack` existe pour porter un **bundle cohérent et versionné** d'un sous-ensemble du système — assemblé pour un usage précis (un agent IA tiers, une synchronisation hors-ligne de l'application mobile) — plutôt que d'obliger chaque consommateur à interroger le système fait par fait.

Il est indispensable parce qu'un agent IA qui devrait reconstruire sa compréhension de "étudier en France depuis le Sénégal" en enchaînant des centaines de petites requêtes serait lent, coûteux, et risquerait des incohérences entre deux moments de lecture. Un `Knowledge Pack` offre une vue stable, datée, auto-suffisante.

---

## 2. Responsabilités

**Autorisé à** :
- Regrouper un ensemble cohérent d'entités, `Fact`, `Content` pertinents pour un périmètre précis (ex. un pays, un thème, une combinaison).
- Porter sa propre date de génération, permettant de savoir exactement "à quel instant cette connaissance a été figée".

**Ne doit JAMAIS** :
- Devenir lui-même une source de vérité parallèle — un `Knowledge Pack` est toujours une **projection** de l'état du système à un instant donné, jamais un lieu où une information est éditée directement.
- Être utilisé comme référence permanente sans régénération — un pack ancien doit toujours être identifiable comme potentiellement dépassé.

---

## 3. Cycle de vie

1. **Génération** : produit à intervalle régulier ou à la demande, à partir de l'état courant du système pour un périmètre défini.
2. **Consommation** : téléchargé/utilisé par un consommateur externe (agent, app hors-ligne) pendant une période donnée.
3. **Péremption** : un pack devient `outdated` dès qu'une nouvelle génération plus récente existe pour le même périmètre — les consommateurs doivent pouvoir détecter cette péremption.
4. **Archivage** : les anciennes générations restent consultables pour l'audit (ex. "que savait Dalili sur ce sujet à telle date").

---

## 4. Invariants

- Un `Knowledge Pack` porte toujours une date de génération explicite.
- Un `Knowledge Pack` ne contient jamais une information qui n'existe pas déjà, à cette date, dans les couches `Truth`/`Knowledge`/`Experience` du système — il n'invente rien, il assemble.

---

## 5. Relations

**Obligatoires** : `BUNDLES → Entity/Fact/Content` (plusieurs).

---

## 6. États

| État | Description |
|---|---|
| `current` | La génération la plus récente pour ce périmètre. |
| `outdated` | Une génération plus récente existe désormais. |
| `archived` | Conservé pour l'audit historique uniquement. |

---

## 7. Transitions

**Autorisées** : `current → outdated` (dès qu'une nouvelle génération existe), `outdated → archived`.

**Interdites** : modifier un `Knowledge Pack` déjà généré — toute mise à jour crée une nouvelle génération, l'ancienne n'est jamais éditée en place (cohérent avec le principe de versionnement de `Fact`).

---

## 8. Validation

Avant mise à disposition : cohérence interne (aucune contradiction entre les éléments bundlés), toutes les entités/faits inclus sont au moins `active`/`published`, date de génération renseignée.

---

## 9. Erreurs, cas limites, incohérences

- **Un consommateur utilise un `Knowledge Pack` `outdated` sans le savoir** : le pack doit porter une information de péremption suffisamment explicite pour que ce cas soit détectable par le consommateur, jamais une simple absence silencieuse d'indication.
- **Le périmètre demandé est trop large pour rester cohérent** (ex. "tout Dalili" en un seul pack) : à éviter par conception — la granularité doit rester pensée pour un usage précis (question 9 du Blueprint, laissée ouverte sur la granularité exacte à adopter).

---

## 10. Exemples

**Cas simple** : `Knowledge Pack("Sénégal × Visa × 2026-07")`, regroupant les `Fact`/`Content` pertinents pour ce périmètre précis.

**Cas complexe** : un `Knowledge Pack` destiné à une synchronisation hors-ligne de l'application mobile, incluant non seulement du contenu mais aussi les `Procedure`/`Document` nécessaires pour qu'un étudiant puisse consulter sa `Timeline` même sans connexion.

**Cas exceptionnel** : un changement réglementaire majeur intervient juste après la génération d'un `Knowledge Pack` largement diffusé à des agents tiers — le pack devient `outdated` immédiatement, et le système doit pouvoir signaler activement (pas seulement passivement) aux consommateurs connus qu'une nouvelle génération est disponible, si le mécanisme de distribution le permet.

---

## 11. Interactions avec les autres objets

**Consomme** : toute entité/Fact/Content pertinent au périmètre défini.

**Produit / alimente** : les agents IA tiers, l'application mobile en mode hors-ligne, tout consommateur externe qui préfère un accès en bloc plutôt que requête par requête.

**En dépendent directement** : la stratégie GEO d'exposition à des agents IA externes.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : granularité de périmètre affinée avec l'usage réel observé (question ouverte du Blueprint).
- **Contrainte de compatibilité à préserver** : ne jamais laisser un `Knowledge Pack` devenir une source de vérité éditable en parallèle du système — il reste, pour toujours, une projection dérivée et datée.

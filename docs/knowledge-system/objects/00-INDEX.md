# Index — Spécifications des objets métier du DALILI KNOWLEDGE SYSTEM

Chaque objet est documenté dans son propre fichier, lisible indépendamment des autres, selon un plan fixe en 12 sections : Mission, Responsabilités, Cycle de vie, Invariants, Relations, États, Transitions, Validation, Erreurs, Exemples, Interactions, Évolution à 5–10 ans.

Ce dossier complète `docs/knowledge-system/BLUEPRINT.md` (la vision d'ensemble, les couches, les flux, le moteur de raisonnement) — il ne le remplace pas. À lire après le Blueprint, pas à sa place.

**Statut** : spécifications métier. Aucun code, aucun schéma de base de données, aucune API n'a été écrit — uniquement des définitions de comportement attendu, destinées à guider une future implémentation sans ambiguïté.

---

## Couche Truth

| Fichier | Objet | Rôle en une ligne |
|---|---|---|
| `01-Fact.md` | Fact | L'unité atomique de vérité — un chiffre, sourcé, versionné, jamais dupliqué. |
| `02-Source.md` | Source | La preuve documentaire qui justifie un Fact/Rule. |
| `03-Regulation.md` | Regulation | Un texte réglementaire, dont dépendent en cascade des Fact/Rule. |

## Couche Knowledge

| Fichier | Objet | Rôle en une ligne |
|---|---|---|
| `04-Country.md` | Country | Un pays d'origine ou de destination. |
| `05-City.md` | City | Une ville universitaire, ses universités toujours dérivées par relation, jamais recopiées. |
| `06-University.md` | University | Un établissement — tous ses chiffres référencent des Fact. |
| `07-Organization.md` | Organization | Supertype des institutions administratives (CROUS, préfecture, consulat...). |
| `08-Program.md` | Program | Une filière/domaine d'étude, transverse aux universités. |
| `09-Procedure.md` | Procedure | La définition générique d'une démarche administrative. |
| `10-Document.md` | Document | Un type de pièce justificative requis par une Procedure. |
| `11-Content.md` | Content | Un article/guide narratif — cite les Fact, ne les recopie jamais. |
| `12-Question.md` | Question | Une unité question/réponse, objet de première classe (AEO). |
| `13-Persona.md` | Persona | Un segment d'audience type, distinct d'un LearnerProfile réel. |
| `14-Judgment.md` | Judgment | Une évaluation éditoriale assumée, jamais confondue avec un Fact officiel. |
| `15-Cluster.md` | Cluster | Un regroupement thématique/géographique pour le maillage interne. |

## Couche Reasoning

| Fichier | Objet | Rôle en une ligne |
|---|---|---|
| `16-Rule.md` | Rule | Une connaissance conditionnelle déclarative — "si..., alors...". |
| `17-Derivation.md` | Derivation | Une formule de calcul déclarée, traçable, versionnée comme un Fact. |
| `18-RecommendationModel.md` | RecommendationModel | La politique de pondération utilisée pour comparer des options. |
| `19-Recommendation.md` | Recommendation | Le résultat produit d'un raisonnement, toujours accompagné de sa trace d'explication. |

## Couche Planning

| Fichier | Objet | Rôle en une ligne |
|---|---|---|
| `20-LearnerProfile.md` | LearnerProfile | Le contexte structuré d'une personne réelle ou hypothétique. |
| `21-Task.md` | Task | Une action datée à réaliser, instanciée d'une étape générique de Procedure. |
| `22-Timeline.md` | Timeline | Le plan complet et daté d'un parcours pour un LearnerProfile précis. |
| `23-Milestone.md` | Milestone | Un jalon structurant au sein d'une Timeline. |

## Couche Experience

| Fichier | Objet | Rôle en une ligne |
|---|---|---|
| `24-Presentation.md` | Presentation | La mise en forme d'une entité/contenu pour un canal et une langue. |

## Couche Distribution

| Fichier | Objet | Rôle en une ligne |
|---|---|---|
| `25-Capability.md` | Capability | Un contrat formel d'action invocable par un agent/app/automatisation. |
| `26-KnowledgePack.md` | KnowledgePack | Un bundle cohérent et versionné exposé aux consommateurs externes. |

## Transverse — boucle de retour

| Fichier | Objet | Rôle en une ligne |
|---|---|---|
| `27-Outcome.md` | Outcome | Un résultat réel observé, rattaché à une Recommendation/Rule. |
| `28-Signal.md` | Signal | Un indicateur agrégé suggérant qu'une révision est nécessaire. |

---

## Invariants transverses les plus critiques (rappel, détaillés dans chaque fiche)

- Un `Fact` publié possède toujours une `Source`.
- Une `Recommendation` possède toujours une explication (`USES`) non vide.
- Une `Timeline` possède toujours un `LearnerProfile`.
- Aucune relation ne peut pointer vers une entité inexistante (intégrité référentielle imposée partout, pas seulement recommandée).
- Aucun objet de la couche `Knowledge` ne porte de valeur numérique en propre — toujours via `Fact`.
- Aucune modification en place d'un `Fact`/`Regulation`/`Derivation` `active` — toute correction crée une nouvelle version tracée.
- `Judgment` n'est jamais confondu avec `Fact` dans une trace d'explication ou une présentation.
- `Outcome`/`Signal` ne déclenchent jamais une modification automatique — la révision reste toujours humaine.

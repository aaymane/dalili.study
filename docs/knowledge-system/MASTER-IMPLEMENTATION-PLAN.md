# MASTER IMPLEMENTATION PLAN — DALILI KNOWLEDGE SYSTEM

**Statut** : roadmap officielle d'implémentation. S'appuie sur les documents validés : Vision, Architecture V1, Architecture V2, `BLUEPRINT.md`, et les 28 spécifications métier (`objects/`). Ces documents ne sont plus rediscutés ici, seulement exécutés.

**Rôle de ce document** : transformer une conception validée en un système réel, sans réécriture, sans big bang, sans régression, avec le site actuel qui continue de fonctionner à chaque instant de la migration.

**Ce que ce document N'EST PAS** : aucun choix technologique, aucun langage, aucun schéma de base de données, aucune ligne de code. Uniquement la stratégie, l'ordre, le découpage et les critères de réussite.

**Note sur les durées** : les estimations sont exprimées en jours-effort d'un développeur seul, concentré sur cette tâche — pas en semaines calendaires. Le rythme réel dépendra de l'arbitrage d'Aymane entre ce chantier et la production de contenu courante (qui reste, comme rappelé dans la vision, la priorité business immédiate). Ces chiffres servent à comparer les sprints entre eux, pas à fixer un engagement de date.

---

## Table des matières

0. Principes d'ingénierie de la migration
1. Graphe de dépendances entre les 28 objets
2. Meilleur ordre d'implémentation
3. Pistes parallélisables et chemin critique
4. Quick wins
5. Risques majeurs
6. Décisions irréversibles vs réversibles
7. Roadmap détaillée — Phases et Sprints (Phase 0 → Phase 11)
8. Vue d'ensemble finale

---

# 0. Principes d'ingénierie de la migration

Quatre règles gouvernent chaque décision de ce plan, sans exception :

1. **Coexistence avant remplacement** — à chaque phase, le nouveau mécanisme est construit et validé **à côté** de l'ancien avant que l'ancien ne soit retiré. L'ancien n'est jamais supprimé "en même temps" que le nouveau est créé — toujours en deux temps distincts, avec une période de coexistence entre les deux.
2. **Bascule progressive, jamais totale** — quand un remplacement est prêt, il est activé progressivement (une université à la fois, un article à la fois), jamais sur l'ensemble du périmètre en une seule opération.
3. **Réversibilité par construction** — chaque bascule doit pouvoir être annulée en revenant simplement à l'ancienne source de lecture, sans opération de récupération complexe. Ça implique que l'ancienne source de données n'est jamais détruite avant que la nouvelle ait fait ses preuves sur une période d'observation.
4. **Chaque sprint est déployable et utile seul** — aucun sprint ne laisse le système dans un état intermédiaire cassé. Un sprint qui doit être interrompu à mi-chemin (imprévu, changement de priorité) ne doit jamais empêcher un déploiement normal du site.

Cette approche correspond à un remplacement progressif par la périphérie plutôt qu'un remplacement par le centre — on commence par les points de lecture les plus à risque (ceux qui ont déjà produit un bug réel), pas par une refonte totale du cœur du site.

---

# 1. Graphe de dépendances entre les 28 objets

La dépendance se lit : *l'objet en aval a besoin que l'objet en amont existe déjà pour être pleinement utile* (une définition minimale peut parfois exister avant, mais son utilisation réelle attend la dépendance).

```
NIVEAU 0 — Aucune dépendance, peuvent être créés à tout moment
  Source · Country · Document · Cluster · Organization · Program

NIVEAU 1 — Dépendent uniquement du Niveau 0
  Fact (← Source)
  Regulation (← Source)
  City (← Country)

NIVEAU 2 — Dépendent des Niveaux 0-1
  University (← City, Organization, Fact)
  Persona (← Country, optionnel)
  Procedure (← Document, Country, Organization, Regulation)
  LearnerProfile (← Persona, optionnel — peu de dépendances réelles, peut être défini tôt)

NIVEAU 3 — Dépendent des Niveaux 0-2
  Rule (← Regulation, Persona, Fact)
  Content (← Fact, Cluster, Persona)
  Judgment (← University/City, méthodologie propre)

NIVEAU 4 — Dépendent des Niveaux 0-3
  Question (← Fact, Content)
  Derivation (← Fact, Rule)
  Task / Timeline / Milestone (← Procedure, LearnerProfile)
  Presentation (← Content, University, City, Question — PAS de dépendance à Reasoning/Planning)

NIVEAU 5 — Dépendent des Niveaux 0-4
  RecommendationModel (← Fact, Derivation, Judgment)

NIVEAU 6 — Dépendent du Niveau 5
  Recommendation (← RecommendationModel + tout ce qu'il mobilise)

NIVEAU 7 — Dépendent de tout ce qui précède, selon ce qu'ils exposent
  Capability (← Derivation, RecommendationModel, Procedure, Content)

NIVEAU 8 — Dépend du Niveau 7
  Knowledge Pack (← Capability, Content, Fact, entités bundlées)

NIVEAU 9 — Boucle de retour, jamais bloquante en aval
  Outcome (← Recommendation, Rule, Fact)
  Signal (← Fact, Content, RecommendationModel)
```

**Observation clé** : `Presentation` (Niveau 4) ne dépend que de la couche `Knowledge` — elle n'a strictement aucune dépendance vers `Reasoning`/`Planning`. C'est l'objet le plus facilement parallélisable de tout le graphe : son chantier peut avancer entièrement pendant que `Rule`/`Derivation`/`RecommendationModel` sont construits, sans jamais les attendre.

**Deuxième observation clé** : `Task`/`Timeline`/`Milestone` (Niveau 4) ne dépendent que de `Procedure` et `LearnerProfile` — pas de `RecommendationModel`/`Recommendation`. La couche `Planning` peut donc être construite en parallèle de la fin de la couche `Reasoning`, pas nécessairement après elle.

---

# 2. Meilleur ordre d'implémentation

L'ordre n'est **pas** simplement le graphe de dépendances parcouru dans l'ordre — il est ajusté par un critère de priorité supplémentaire : **traiter en premier les domaines où un bug réel et vérifié existe déjà** (frais de scolarité incohérents, 38 liens morts villes→universités). Ça donne trois raisons de commencer par là plutôt que par un autre point d'entrée théoriquement équivalent dans le graphe :

1. Valeur immédiate et mesurable (un bug connu disparaît réellement).
2. Preuve concrète de la valeur du nouveau système avant d'investir dans les couches plus abstraites (`Reasoning`, `Planning`).
3. Domaine déjà bien compris (pas de découverte métier nécessaire, seulement de la modélisation).

L'ordre retenu, phase par phase, est détaillé en section 7. Le résumé de la logique de priorisation :

`Truth (domaine à risque)` → `Bascule de lecture + Relations centralisées (corrige les 2 bugs connus)` → `Regulation/workflow de revue` → *(en parallèle, dès ce point : Content-cite-des-faits, Presentation)* → `Reasoning (Rule, Derivation)` → *(en parallèle, dès ce point : Planning)* → `RecommendationModel/Recommendation` → `Distribution (Capability, Knowledge Pack)` → `Boucle de retour (Outcome/Signal)`.

---

# 3. Pistes parallélisables et chemin critique

## Chemin critique (séquentiel, ne peut pas être parallélisé)

`Source/Fact` → `Bascule de lecture University` → `Relations centralisées City↔University` → `Regulation + Rule (fondations)` → `Derivation` → `RecommendationModel` → `Recommendation` → `Capability` → `Knowledge Pack`.

C'est la colonne vertébrale : chaque maillon a réellement besoin du précédent pour avoir un sens. C'est cette chaîne qui détermine la durée totale minimale du projet, quelle que soit la parallélisation du reste.

## Piste B — parallélisable dès que Truth + Knowledge de base existent (Phase 2 terminée)

- Migration progressive du `Content` (65 articles) vers la citation de `Fact` plutôt que l'embarquement de chiffres.
- Consolidation de `Presentation` (remplacement de `UNI_SEO`/`CITY_SEO`).
- Formalisation de `Question` comme objet de première classe.
- Séparation `Judgment`/méthodologie.

Cette piste ne bloque et n'est bloquée par aucun élément du chemin critique au-delà de la Phase 2 — elle peut avancer à un rythme propre, y compris en s'interrompant et en reprenant selon la disponibilité, sans jamais retarder `Reasoning`/`Distribution`.

## Piste C — parallélisable dès que `Procedure` et `LearnerProfile` existent (fin de Phase 1/2)

- Construction de `Planning` (`Task`/`Timeline`/`Milestone`), refonte du Calendrier.

Peut avancer en même temps que la fin du chemin critique (`RecommendationModel`/`Recommendation`), à condition que `Rule` de base existe pour les démarches conditionnelles les plus simples (ce qui arrive tôt dans le chemin critique, Phase 3).

## Piste D — continue, jamais bloquante

- Collecte d'`Outcome`/`Signal` dès que `Recommendation`/`Rule`/`Content` existent — n'a pas de "fin", s'alimente en continu et est consultée périodiquement, sans jamais retarder quoi que ce soit en aval.

---

# 4. Quick wins

1. **Correction du bug des frais de scolarité** (Phase 1-2) — un des deux bugs déjà vérifiés disparaît, avec une preuve publique et mesurable (les 14 universités affichent enfin le même tarif).
2. **Correction des 38 liens morts** (Phase 2) — le second bug déjà vérifié disparaît, immédiatement visible pour tout visiteur qui clique sur un lien université depuis une fiche ville.
3. **Premier `Knowledge Pack` pilote sur un seul pays** (Phase 10) — démontre concrètement la citabilité par un agent IA externe, un résultat visible et communicable même en V1 partielle.
4. **Premier calcul de budget migré vers `Derivation`** (Phase 6) — invisible pour l'utilisateur final (même UX), mais élimine un point de duplication de logique de calcul, gain de maintenabilité immédiat.

---

# 5. Risques majeurs

- **Sur-ingénierie face à la vélocité de contenu actuelle** — le risque le plus documenté depuis le début de cette conception (déjà signalé dans le Blueprint). Mitigation : la Piste B (migration du contenu) n'est jamais imposée comme un blocage, elle avance à un rythme choisi, jamais forcé.
- **Fatigue de migration sur 65 articles** — mitigation : un seul patron de migration défini une fois (Phase 4), appliqué en petits lots répétables, jamais traité comme un chantier fini d'un coup.
- **Gouvernance négligée** (`Fact`/`Regulation` non revus, file `needs_review` qui s'accumule) — mitigation : chaque phase inclut un critère de fin qui vérifie explicitement l'absence d'accumulation anormale.
- **Double source de vérité pendant la transition** — mitigation : le principe de coexistence (section 0) impose toujours un sens de lecture unique et documenté à chaque instant (soit l'ancien, soit le nouveau, jamais un mélange ambigu au sein d'une même entité).
- **Dégradation de performance perçue** si la résolution de `Fact`/`Derivation` est mal placée dans le cycle de rendu — mitigation : chaque phase de bascule inclut un critère de validation de performance avant retrait de l'ancien mécanisme.
- **Exposition prématurée à des agents IA externes** avant que la traçabilité soit fiable — mitigation : `Capability`/`Knowledge Pack` (Phase 10) arrivent volontairement en fin de roadmap, jamais en amont.

---

# 6. Décisions irréversibles vs réversibles

## Irréversibles (à valider avec un soin particulier avant de les prendre)

- La séparation stricte des six couches (déjà validée dans le Blueprint) — irréversible par nature, revenir dessus signifierait recommencer la conception.
- Le choix des objets "supertype" (`Organization`, `Procedure`, `Content`) et de leurs sous-types — difficile à changer une fois de nombreux sous-types et relations construits dessus.
- Le retrait définitif d'un champ dupliqué historique (ex. suppression finale de `tuitionLicence` en valeur propre sur `University` une fois la bascule vers `Fact` validée) — irréversible au sens où revenir en arrière nécessiterait de recréer l'ancien mécanisme, pas simplement de rouvrir un interrupteur.
- La convention d'unicité (un seul `Fact` actif par sujet+prédicat, un seul `Cluster` principal par `Content`) — fondation structurelle, changer cette règle plus tard casserait toute donnée déjà migrée.

## Réversibles (peuvent être ajustées sans coût majeur)

- Les poids par défaut d'un `RecommendationModel`.
- L'ordre de migration des articles (Piste B) — le choix "par trafic" vs "par ancienneté" vs "par cluster" est un simple choix de priorisation, changeable à tout moment.
- La granularité initiale d'un `Knowledge Pack` (par pays, par thème) — ajustable après un premier pilote.
- Le seuil de confiance minimal avant qu'une `Recommendation` refuse de trancher — un paramètre à calibrer avec l'usage réel.
- Le choix des premiers `Persona` définis — peuvent être fusionnés/affinés sans casser la structure.

---

# 7. Roadmap détaillée — Phases et Sprints

## PHASE 0 — Fondations et gouvernance

**Objectif** : aligner le vocabulaire opérationnel et choisir le domaine pilote, sans toucher à une seule donnée de production.

**Prérequis** : Blueprint et 28 spécifications validés (déjà acquis).

**Dépendances** : aucune.

**Livrables** : un domaine pilote choisi (frais de scolarité des 14 universités), une liste exhaustive et nommée des `Fact` à créer pour ce domaine, un gabarit de méthodologie pour documenter une `Source`.

**Risques** : aucun — phase purement préparatoire, à risque nul par construction.

**Stratégie de rollback** : sans objet (rien n'est encore engagé en production).

**Critères de validation** : la liste des `Fact` du domaine pilote est exhaustive (les 14 universités × 3 chiffres : licence, master, doctorat) et chacun a déjà une piste de `Source` identifiée avant de passer en Phase 1.

**Critères de fin** : le domaine pilote est documenté sur papier, prêt à être instancié réellement.

| N° | Sprint | Durée | Difficulté | Impact | Tâches principales | Dépendances |
|---|---|---|---|---|---|---|
| 1 | Vocabulaire & gabarit de travail | 2 jours | Faible | Faible | Confirmer le gabarit `Fact`/`Source` à utiliser pour toute la suite ; lister les 42 valeurs (14×3) du domaine pilote | Aucune |
| 2 | Cartographie des sources officielles | 3 jours | Moyen | Moyen | Identifier/valider une `Source` de tier suffisant pour chacune des 42 valeurs ; noter les cas où deux sources se contredisent | Sprint 1 |

---

## PHASE 1 — Truth Layer sur le domaine à risque

**Objectif** : créer réellement les `Fact`/`Source` du domaine pilote, sans encore les brancher à l'affichage.

**Prérequis** : Phase 0 terminée.

**Dépendances** : `Source` (Niveau 0), `Fact` (Niveau 1).

**Livrables** : 42 `Fact` créés, sourcés, à l'état `active`, couvrant les 14 universités × 3 niveaux de frais.

**Risques** : double saisie temporaire (l'ancien champ dans `lib/universities.ts`-équivalent et le nouveau `Fact` coexistent sans lien automatique pendant cette phase) — accepté et documenté, résolu en Phase 2.

**Stratégie de rollback** : aucune action de rollback nécessaire — cette phase ne modifie rien de ce qui est déjà affiché publiquement, elle ne fait qu'ajouter une nouvelle couche de données en parallèle.

**Critères de validation** : les 42 `Fact` sont cohérents entre eux (aucune contradiction non résolue entre deux universités qui devraient légalement avoir le même tarif de base), chacun sourcé à un tier suffisant.

**Critères de fin** : un audit croisé (les 42 valeurs comparées entre elles et avec le contenu narratif déjà existant) ne révèle plus aucune incohérence.

| N° | Sprint | Durée | Difficulté | Impact | Tâches principales | Dépendances |
|---|---|---|---|---|---|---|
| 3 | Création des Fact — 7 premières universités | 3 jours | Faible | Élevé | Créer et sourcer les Fact frais pour la moitié des universités | Phase 0 |
| 4 | Création des Fact — 7 universités restantes | 3 jours | Faible | Élevé | Idem pour la seconde moitié | Sprint 3 (méthode validée) |
| 5 | Audit croisé de cohérence | 2 jours | Moyen | Élevé | Comparer les 42 valeurs entre elles et avec les articles existants, corriger les écarts trouvés | Sprints 3-4 |

---

## PHASE 2 — Correction structurelle des deux bugs connus

**Objectif** : faire lire les pages université existantes depuis les `Fact` réels (élimine le bug des frais incohérents), et centraliser les relations ville↔université (élimine les 38 liens morts). C'est la phase de la roadmap avec le ratio valeur/effort le plus élevé — les deux "quick wins" principaux y sont livrés.

**Prérequis** : Phase 1 terminée (42 Fact disponibles).

**Dépendances** : `Fact` (Phase 1), `University`, `City` (déjà existantes en tant qu'entités du site actuel, à faire évoluer).

**Livrables** : les 14 pages université affichent une valeur unique et cohérente issue des `Fact` ; le registre centralisé de relations `City↔University` existe et est validé ; les pages ville affichent leur liste d'universités par navigation plutôt que par liste recopiée ; une décision est prise et appliquée pour les 38 écoles aujourd'hui référencées sans fiche.

**Risques** : nécessite un pont technique entre l'ancien mode de rendu et le nouveau magasin de faits (non conçu ici, mais anticipé comme un vrai effort d'ingénierie, pas un détail) ; décider du sort des 38 écoles manquantes est une décision éditoriale, pas seulement technique, et peut prendre plus de temps que prévu si elle nécessite de la rédaction de contenu.

**Stratégie de rollback** : la bascule se fait université par université — si une bascule pose un problème, cette université précise revient à l'ancien mode d'affichage sans affecter les autres, déjà basculées ou non. Le champ dupliqué historique n'est retiré qu'après une période d'observation sur l'ensemble des 14 universités, jamais avant.

**Critères de validation** : les 14 pages université affichent, sans exception, la même paire de valeurs frais licence/master déjà vérifiée en Phase 1 ; zéro lien mort détecté sur les 14 pages ville après bascule.

**Critères de fin** : le champ dupliqué historique est retiré (décision irréversible, voir section 6) ; les deux bugs, testés manuellement page par page, sont confirmés résolus.

| N° | Sprint | Durée | Difficulté | Impact | Tâches principales | Dépendances |
|---|---|---|---|---|---|---|
| 6 | Bascule de lecture — 5 premières universités | 4 jours | Élevé | Élevé | Faire lire ces 5 pages depuis les Fact, ancien champ conservé en fallback | Phase 1 |
| 7 | Bascule de lecture — universités restantes | 4 jours | Moyen | Élevé | Étendre aux 9 restantes, méthode déjà validée au sprint 6 | Sprint 6 |
| 8 | Retrait de l'ancien champ dupliqué | 2 jours | Faible | Moyen | Nettoyage définitif une fois la période d'observation passée | Sprint 7, période d'observation écoulée |
| 9 | Registre centralisé de relations City↔University | 3 jours | Élevé | Élevé | Construire le registre, migrer les 52 références existantes avec validation d'intégrité | Phase 1 (peut démarrer en parallèle des sprints 6-8) |
| 10 | Bascule de rendu des pages ville + décision sur les 38 écoles manquantes | 4 jours | Moyen | Élevé | Rendu par navigation inverse ; créer des fiches minimales pour les écoles prioritaires (Sciences Po de chaque ville en premier), ou lien externe temporaire documenté pour les autres | Sprint 9 |

---

## PHASE 3 — Regulation et workflow de revue réglementaire

**Objectif** : formaliser les textes réglementaires déjà identifiés (décret plafonnant les exonérations, accord franco-algérien de 1968) et rendre la file `needs_review` réellement interrogeable.

**Prérequis** : Phase 1-2 terminées (le domaine des frais, déjà en `Fact`, sert de premier cas d'usage réel).

**Dépendances** : `Regulation` (Niveau 1), `Fact`/`Rule` déjà créés ou en cours.

**Livrables** : les `Regulation` du domaine déjà couvert sont créées et reliées à leurs `Fact`, un processus de revue (pas un outil technique, un processus documenté) est testé sur un cas réel simulé.

**Risques** : le volume de faits à relier rétroactivement à leur `Regulation` d'origine peut être sous-estimé si l'historique n'a pas été bien documenté jusqu'ici.

**Stratégie de rollback** : sans objet — cette phase ajoute de la traçabilité, elle ne change aucun comportement d'affichage existant.

**Critères de validation** : un changement réglementaire test (rejoué a posteriori sur le cas déjà connu du décret de mai 2026) peut être tracé du texte de loi jusqu'à la liste exhaustive des `Fact` impactés, sans recherche manuelle.

**Critères de fin** : le processus de revue est documenté et a été exécuté au moins une fois de bout en bout sur un cas réel.

| N° | Sprint | Durée | Difficulté | Impact | Tâches principales | Dépendances |
|---|---|---|---|---|---|---|
| 11 | Modélisation des Regulation du domaine déjà couvert | 3 jours | Moyen | Moyen | Créer les Regulation (décret 2026-385, accord 1968...), les relier aux Fact/Rule existants | Phase 1-2 |
| 12 | Test du processus de revue en cascade | 2 jours | Moyen | Élevé | Rejouer le cas du décret de mai 2026 pour valider que la liste des Fact impactés est bien exhaustive et automatique | Sprint 11 |

---

## PHASE 4 — Contenu citant les faits (flux continu)

**Objectif** : migrer progressivement les 65 articles pour qu'ils citent des `Fact` plutôt que d'embarquer des chiffres. **Cette phase n'est volontairement pas découpée en sprints séquentiels classiques** — elle définit un patron de migration une fois, puis avance en tâche de fond continue (Piste B), au rythme choisi, en parallèle de toutes les phases suivantes.

**Prérequis** : Phase 1 terminée (au moins le domaine des frais disponible en `Fact` ; d'autres domaines de `Fact` seront créés au fil de cette migration, à la demande).

**Dépendances** : `Fact`, `Content`, `Cluster`.

**Livrables** : un patron de migration validé sur un premier article pilote ; un rythme de traitement du backlog établi (ex. un article migré par petite session de travail) ; priorité donnée aux articles à fort trafic/fort enjeu factuel en premier (choix réversible, voir section 6).

**Risques** : fatigue de migration si traitée comme un chantier à finir d'un coup plutôt qu'un flux continu — c'est précisément pour éviter ce risque que cette phase n'a pas de "fin" fixe.

**Stratégie de rollback** : chaque article migré individuellement peut revenir à sa version précédente sans affecter les autres.

**Critères de validation** : chaque article migré survit à un changement test du `Fact` qu'il cite, sans édition manuelle du texte.

**Critères de fin** : il n'y a pas de "fin" formelle à cette phase — un critère de suivi continu remplace le critère de fin : le pourcentage d'articles migrés est mesuré et suivi comme un indicateur de santé du système, pas comme une case à cocher.

| N° | Sprint (patron répétable) | Durée | Difficulté | Impact | Tâches principales | Dépendances |
|---|---|---|---|---|---|---|
| 13 | Migration de l'article pilote | 2 jours | Moyen | Moyen | Choisir un article à fort trafic, le migrer entièrement, documenter le patron exact suivi | Phase 1 |
| — | Migration en lot (répétée, rythme libre) | ~0,5 jour / article | Faible | Cumulatif | Appliquer le patron validé, article par article, sans blocage sur les autres phases | Sprint 13 |

---

## PHASE 5 — Presentation consolidée

**Objectif** : remplacer la duplication manuelle des métadonnées SEO (28 objets tenus à la main) par des `Presentation` dérivées, et formaliser `Question` comme objet de première classe.

**Prérequis** : Phase 2 terminée (Truth de base fiable).

**Dépendances** : `Content`, `University`, `City`, `Question` — **aucune dépendance à `Reasoning`/`Planning`** : cette phase peut démarrer dès que la Phase 2 est terminée, en parallèle des Phases 3-4 et du début de la Phase 6.

**Livrables** : les métadonnées des 14 fiches université et 14 fiches ville sont générées depuis `Presentation` plutôt que ressaisies manuellement ; les sections FAQ des articles migrés (Phase 4) utilisent `Question` plutôt qu'une extraction par motif de texte.

**Risques** : perte de finesse éditoriale si la génération automatique est trop mécanique — mitigation : garder un mécanisme de surcharge manuelle assumée (déjà prévu dans la spécification de `Presentation`, état `overridden`).

**Stratégie de rollback** : les anciennes métadonnées manuelles restent en fallback tant que la génération automatique n'est pas validée sur l'ensemble du périmètre.

**Critères de validation** : les métadonnées générées restent au moins aussi pertinentes que les précédentes, mesuré via les indicateurs déjà suivis (Google Search Console ou équivalent).

**Critères de fin** : les 28 objets de métadonnées manuels historiques sont retirés (décision irréversible).

| N° | Sprint | Durée | Difficulté | Impact | Tâches principales | Dépendances |
|---|---|---|---|---|---|---|
| 14 | Modèle de Presentation pour université/ville | 3 jours | Moyen | Moyen | Génération automatique depuis Content/Fact, avec mécanisme de surcharge | Phase 2 |
| 15 | Migration des 28 métadonnées manuelles | 3 jours | Faible | Moyen | Basculer chaque fiche, comparer avant/après | Sprint 14 |
| 16 | Question comme objet de première classe | 3 jours | Moyen | Moyen | Remplacer l'extraction par motif par une rédaction structurée explicite, sur les articles déjà migrés (Phase 4) | Sprint 14, Phase 4 (partielle) |

---

## PHASE 6 — LearnerProfile et première Derivation

**Objectif** : formaliser le calcul du Simulateur de budget comme une `Derivation` s'appuyant sur les `Fact`, avec un `LearnerProfile` minimal partagé.

**Prérequis** : Phase 1-2 terminées (des `Fact` de coût de la vie doivent exister, à créer si absents du domaine pilote initial).

**Dépendances** : `Fact`, `Derivation`, `LearnerProfile`.

**Livrables** : un schéma `LearnerProfile` minimal défini et utilisé ; la `Derivation` "budget net mensuel" documentée et validée ; le Simulateur existant bascule vers ce moteur sans changement visible pour l'utilisateur.

**Risques** : l'interface utilisateur actuelle ne doit visiblement pas changer — tout le risque est dans la fidélité du calcul migré, pas dans l'expérience.

**Stratégie de rollback** : l'ancien mécanisme de calcul reste disponible en parallèle jusqu'à ce qu'un jeu de cas de test confirme une parfaite équivalence de résultat.

**Critères de validation** : sur un jeu de cas de test couvrant les 14 villes, le résultat de la nouvelle `Derivation` est strictement identique à l'ancien calcul.

**Critères de fin** : l'ancien mécanisme de calcul est retiré, seule la `Derivation` sert désormais de source du résultat affiché.

| N° | Sprint | Durée | Difficulté | Impact | Tâches principales | Dépendances |
|---|---|---|---|---|---|---|
| 17 | Schéma LearnerProfile minimal | 2 jours | Faible | Élevé (structurant) | Définir les champs nécessaires aux premiers cas d'usage (origine, ville, niveau, budget) | Phase 2 |
| 18 | Derivation budget net | 4 jours | Élevé | Élevé | Documenter la formule, créer les Fact de coût de la vie manquants | Sprint 17 |
| 19 | Bascule du Simulateur + recette de non-régression | 3 jours | Moyen | Élevé | Comparer ancien/nouveau calcul sur toutes les villes, basculer si identique | Sprint 18 |

---

## PHASE 7 — Rule et Judgment séparés

**Objectif** : formaliser les règles d'éligibilité conditionnelles (plafond horaire par nationalité) et séparer les scores actuels du Comparateur en `Judgment` documentés, distincts des `Fact`.

**Prérequis** : Phase 3 (Regulation) terminée pour les règles à origine légale ; Phase 1-2 pour les données factuelles utilisées par les scores.

**Dépendances** : `Rule`, `Judgment`.

**Livrables** : les règles d'éligibilité identifiées sont créées et reliées à leur `Regulation` ; les 5 critères du Comparateur actuel sont documentés comme `Judgment` avec une méthodologie explicite écrite pour la première fois.

**Risques** : écrire une méthodologie éditoriale explicite pour des scores jusqu'ici intuitifs est un vrai travail éditorial, pas seulement technique — à ne pas sous-estimer.

**Stratégie de rollback** : les scores actuels restent affichés tels quels tant que la méthodologie documentée n'est pas validée en interne.

**Critères de validation** : chaque score affiché peut être tracé jusqu'à sa méthodologie documentée, sans exception.

**Critères de fin** : plus aucun score n'est affiché sans méthodologie associée.

| N° | Sprint | Durée | Difficulté | Impact | Tâches principales | Dépendances |
|---|---|---|---|---|---|---|
| 20 | Rule d'éligibilité (plafonds horaires, cas franco-algérien) | 3 jours | Moyen | Moyen | Créer les Rule, les relier à leur Regulation | Phase 3 |
| 21 | Méthodologie éditoriale des scores du Comparateur | 4 jours | Élevé | Élevé | Rédiger la méthodologie, migrer les 5 critères existants en Judgment documentés | Phase 1-2 |

---

## PHASE 8 — RecommendationModel et explicabilité

**Objectif** : reconstruire le Comparateur comme un véritable `RecommendationModel`, avec poids ajustables et trace de raisonnement visible — la première fonctionnalité réellement "intelligente" et personnalisée du site.

**Prérequis** : Phase 6 (Derivation), Phase 7 (Rule/Judgment) terminées.

**Dépendances** : `RecommendationModel`, `Recommendation`.

**Livrables** : un `RecommendationModel` fonctionnel, produisant des `Recommendation` tracées et pondérables via `LearnerProfile` ; une expérience utilisateur de restitution de l'explication ("pourquoi cette ville").

**Risques** : la complexité perçue par l'utilisateur si l'explication est mal présentée — c'est un risque d'expérience utilisateur autant que technique.

**Stratégie de rollback** : l'ancien Comparateur (poids fixes, sans explication) reste disponible en parallèle jusqu'à validation qualitative du nouveau.

**Critères de validation** : un utilisateur test peut demander "pourquoi cette ville" et recevoir une réponse compréhensible et exacte, vérifiée manuellement sur plusieurs cas.

**Critères de fin** : l'ancien Comparateur est retiré, le nouveau devient la seule version en production.

| N° | Sprint | Durée | Difficulté | Impact | Tâches principales | Dépendances |
|---|---|---|---|---|---|---|
| 22 | Construction du RecommendationModel | 4 jours | Élevé | Élevé | Assembler Fact/Derivation/Judgment pondérés, poids ajustables par LearnerProfile | Phase 6-7 |
| 23 | Trace d'explication et restitution utilisateur | 3 jours | Moyen | Élevé | Générer et afficher la chaîne "pourquoi cette recommandation" | Sprint 22 |
| 24 | Bascule progressive et retrait de l'ancien Comparateur | 3 jours | Moyen | Élevé | Test qualitatif comparatif, bascule, retrait | Sprint 23 |

---

## PHASE 9 — Planning natif

**Objectif** : reconstruire le Calendrier Campus France comme une instanciation réelle de `Procedure` contre un `LearnerProfile`, avec des `Task`/`Timeline`/`Milestone` personnalisés plutôt qu'un calendrier générique par pays.

**Prérequis** : `Procedure` définies pour les démarches déjà couvertes (visa, logement CROUS, banque) ; `LearnerProfile` (Phase 6) disponible. Peut démarrer **en parallèle** de la Phase 8, dès que ces prérequis sont réunis (Piste C, section 3).

**Dépendances** : `Procedure`, `Task`, `Timeline`, `Milestone`.

**Livrables** : les `Procedure` génériques des démarches déjà documentées par le site ; une `Timeline` personnalisée par profil, remplaçant le calendrier générique actuel.

**Risques** : nécessite des `Procedure` bien modélisées en amont — un travail de modélisation, pas seulement de code, potentiellement sous-estimé si les démarches ont plus de variantes conditionnelles que prévu.

**Stratégie de rollback** : l'ancien calendrier générique par pays reste affiché en parallèle jusqu'à ce que la personnalisation soit validée sur plusieurs profils de test distincts.

**Critères de validation** : deux profils différents dans le même pays reçoivent des `Timeline` réellement différentes si leur situation diffère (ex. niveau d'étude, date d'arrivée).

**Critères de fin** : l'ancien calendrier générique est retiré.

| N° | Sprint | Durée | Difficulté | Impact | Tâches principales | Dépendances |
|---|---|---|---|---|---|---|
| 25 | Modélisation des Procedure (visa, logement, banque) | 4 jours | Élevé | Élevé | Définir les étapes génériques et Document requis par démarche | Phase 1-3 |
| 26 | Instanciation de Timeline personnalisée | 4 jours | Élevé | Élevé | Générer Task/Milestone datés à partir d'un LearnerProfile réel | Sprint 25, Phase 6 |
| 27 | Bascule du Calendrier existant | 3 jours | Moyen | Élevé | Test sur plusieurs profils, bascule, retrait de l'ancien calendrier générique | Sprint 26 |

---

## PHASE 10 — Distribution : Capability et Knowledge Pack

**Objectif** : exposer formellement des capacités invocables et un premier bundle exportable, ouvrant la voie à une intégration réelle avec des agents IA externes et une future application mobile.

**Prérequis** : au moins `Derivation` (Phase 6), `RecommendationModel` (Phase 8) et `Procedure`/`Planning` (Phase 9) disponibles pour avoir des capacités substantielles à exposer.

**Dépendances** : `Capability`, `Knowledge Pack`.

**Livrables** : un premier jeu de `Capability` (lecture d'article, calcul de budget, recommandation de ville) documentées et invocables ; un premier `Knowledge Pack` pilote sur un seul pays ; un test réel avec un agent IA externe.

**Risques** : première exposition externe du système — les décisions de sécurité/limitation d'usage (authentification, rate-limiting) restent hors du scope de ce plan (voir questions ouvertes du Blueprint) mais doivent être traitées avant toute exposition publique large.

**Stratégie de rollback** : les `Capability` sont versionnées dès la première publication — un retrait ou une régression peut cibler une version précise sans affecter d'éventuels autres consommateurs déjà intégrés.

**Critères de validation** : un agent IA externe invoque au moins une `Capability` et une consultation d'un `Knowledge Pack`, produit une réponse correcte et traçable, vérifiée manuellement.

**Critères de fin** : au moins trois `Capability` sont en production, un `Knowledge Pack` pilote est généré et documenté comme reproductible.

| N° | Sprint | Durée | Difficulté | Impact | Tâches principales | Dépendances |
|---|---|---|---|---|---|---|
| 28 | Définition et exposition des premières Capability | 4 jours | Élevé | Élevé | Documenter et exposer lecture/calcul/recommandation | Phases 6, 8, 9 |
| 29 | Premier Knowledge Pack pilote | 3 jours | Moyen | Élevé | Assembler un bundle cohérent sur un pays, avec date de génération | Sprint 28 |
| 30 | Test réel avec un agent IA externe | 2 jours | Moyen | Élevé (validation GEO) | Vérifier l'usage réel, la fidélité et la traçabilité de la réponse produite | Sprint 29 |

---

## PHASE 11 — Boucle de retour et clôture de la V1

**Objectif** : mettre en place la capture d'`Outcome`/`Signal`, exécuter un premier cycle de revue humaine documenté, et arrêter formellement le périmètre de la "V1 complète" du Knowledge System.

**Prérequis** : au moins une `Recommendation` et une `Rule` en production (Phases 7-8) pour avoir quelque chose à mesurer.

**Dépendances** : `Outcome`, `Signal`.

**Livrables** : les points de capture d'`Outcome`/`Signal` définis ; un premier cycle de revue exécuté et documenté ; un bilan de fin de V1.

**Risques** : le risque de gouvernance déjà identifié (une file de revue négligée) — mitigation : le critère de fin de cette phase inclut explicitement la preuve qu'un cycle complet a été exécuté, pas seulement que le mécanisme existe.

**Stratégie de rollback** : sans objet — cette phase ajoute de l'observation, elle ne modifie rien de ce qui est déjà en production.

**Critères de validation** : au moins un `Outcome` et un `Signal` réels ont été capturés et ont motivé une décision de revue documentée (même si la décision est "pas de changement nécessaire").

**Critères de fin** : le bilan de fin de V1 est rédigé, listant explicitement ce qui a été construit, ce qui reste en Piste B (contenu encore à migrer, traité comme un flux continu et non comme une dette de cette V1), et les priorités de la prochaine itération.

| N° | Sprint | Durée | Difficulté | Impact | Tâches principales | Dépendances |
|---|---|---|---|---|---|---|
| 31 | Points de capture Outcome/Signal | 2 jours | Faible | Moyen | Définir où et comment ces objets sont créés dans le parcours réel | Phases 7-8 |
| 32 | Premier cycle de revue et bilan de V1 | 2 jours | Faible | Élevé | Exécuter une revue réelle, documenter, arrêter le périmètre de la V1 | Sprint 31 |

---

# 8. Vue d'ensemble finale

```
Phase 0 — Fondations et gouvernance
  Sprint 1  · Vocabulaire & gabarit de travail
  Sprint 2  · Cartographie des sources officielles

Phase 1 — Truth Layer sur le domaine à risque
  Sprint 3  · Création des Fact — 7 premières universités
  Sprint 4  · Création des Fact — 7 universités restantes
  Sprint 5  · Audit croisé de cohérence

Phase 2 — Correction structurelle des deux bugs connus
  Sprint 6  · Bascule de lecture — 5 premières universités
  Sprint 7  · Bascule de lecture — universités restantes
  Sprint 8  · Retrait de l'ancien champ dupliqué
  Sprint 9  · Registre centralisé de relations City↔University
  Sprint 10 · Bascule de rendu des pages ville + 38 écoles manquantes

Phase 3 — Regulation et workflow de revue réglementaire
  Sprint 11 · Modélisation des Regulation du domaine couvert
  Sprint 12 · Test du processus de revue en cascade

Phase 4 — Contenu citant les faits (flux continu, en parallèle dès ici)
  Sprint 13 · Migration de l'article pilote
  (puis migration en lot continue, rythme libre, jamais bloquante)

Phase 5 — Presentation consolidée (parallélisable dès la fin de Phase 2)
  Sprint 14 · Modèle de Presentation université/ville
  Sprint 15 · Migration des 28 métadonnées manuelles
  Sprint 16 · Question comme objet de première classe

Phase 6 — LearnerProfile et première Derivation
  Sprint 17 · Schéma LearnerProfile minimal
  Sprint 18 · Derivation budget net
  Sprint 19 · Bascule du Simulateur + recette de non-régression

Phase 7 — Rule et Judgment séparés
  Sprint 20 · Rule d'éligibilité
  Sprint 21 · Méthodologie éditoriale des scores du Comparateur

Phase 8 — RecommendationModel et explicabilité
  Sprint 22 · Construction du RecommendationModel
  Sprint 23 · Trace d'explication et restitution utilisateur
  Sprint 24 · Bascule progressive et retrait de l'ancien Comparateur

Phase 9 — Planning natif (parallélisable avec la Phase 8 dès que les prérequis sont réunis)
  Sprint 25 · Modélisation des Procedure
  Sprint 26 · Instanciation de Timeline personnalisée
  Sprint 27 · Bascule du Calendrier existant

Phase 10 — Distribution : Capability et Knowledge Pack
  Sprint 28 · Définition et exposition des premières Capability
  Sprint 29 · Premier Knowledge Pack pilote
  Sprint 30 · Test réel avec un agent IA externe

Phase 11 — Boucle de retour et clôture de la V1
  Sprint 31 · Points de capture Outcome/Signal
  Sprint 32 · Premier cycle de revue et bilan de V1

─────────────────────────────────────────────
→ DALILI KNOWLEDGE SYSTEM V1 COMPLÈTE
─────────────────────────────────────────────
```

**32 sprints au total** sur le chemin critique + la piste parallèle continue de migration de contenu (Phase 4), pour atteindre une première version complète du Knowledge System — sans qu'à aucun instant de ce parcours le site Dalili actuel n'ait cessé de fonctionner, et avec deux bugs réels déjà vérifiés corrigés dès la Phase 2, soit environ un cinquième du chemin.

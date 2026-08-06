# DALILI KNOWLEDGE SYSTEM — Blueprint officiel

**Statut** : conception validée (V1 + V2 discutées et actées). Ce document est la référence unique à partir de laquelle toute implémentation future doit partir.

**Ce que ce document EST** : la conception complète — couches, objets métier, relations, flux, moteur de raisonnement, capacités permises, stratégie de migration, questions ouvertes.

**Ce que ce document N'EST PAS** : aucune ligne de code, aucun schéma de base de données, aucun choix technologique (langage, moteur de stockage, hébergement), aucune maquette d'interface, aucun contenu réel (aucun `Fact` n'est écrit ici, seulement sa forme). Tout choix d'implémentation est volontairement hors-scope et devra faire l'objet d'un document séparé, une fois ce blueprint validé.

**Comment lire ce document** : les sections 1 à 4 posent le vocabulaire (couches, objets, relations) — à lire une fois et à garder comme référence. Les sections 5 à 7 montrent le système *en fonctionnement*. La section 8 est le pont vers l'action (migration). Les sections 9 et 10 cadrent ce qui reste à trancher et où tout ça mène.

---

## Table des matières

1. Vision générale
2. Les six couches
3. Les objets métier
4. Les relations
5. Les flux complets
6. Le moteur de raisonnement
7. Les capacités futures
8. Stratégie de migration
9. Questions ouvertes
10. Conclusion — Dalili une fois ce système achevé

---

# 1. Vision générale

## Mission du Knowledge System

Être le **cerveau unique, vérifiable et raisonnant** derrière chaque surface de Dalili — site, application, API, dashboards, agents IA — de sorte qu'une même question, posée à n'importe quel endroit, reçoive une réponse identique, exacte, expliquée, et jamais silencieusement obsolète.

Le Knowledge System ne remplace pas la mission de Dalili (être le guide de confiance des étudiants internationaux) — il en est l'**infrastructure de confiance**. Une mission de confiance ne peut pas reposer sur une architecture où le même chiffre existe à trois endroits et peut diverger sans que personne ne le remarque (précédent réel : les frais de scolarité). Le Knowledge System est la garantie structurelle, pas seulement disciplinaire, que ça ne se reproduit pas.

## Objectifs

1. **Zéro duplication de vérité** — un fait n'existe qu'à un seul endroit, peu importe combien de surfaces le citent.
2. **Zéro incohérence inter-canal** — le site, l'app, un agent IA et un dashboard ne peuvent structurellement pas afficher deux valeurs différentes pour la même chose au même moment.
3. **Traçabilité complète** — toute affirmation, tout calcul, toute recommandation peut être retracé jusqu'à sa source officielle d'origine, sans exception.
4. **Raisonnement, pas seulement stockage** — le système doit pouvoir combiner des faits, appliquer des règles, calculer, comparer et recommander pour une situation personnelle précise — pas seulement restituer un article.
5. **Extensibilité à 10 ans** — nouveaux pays, nouvelles langues, nouveaux canaux, nouveaux types d'agents doivent pouvoir s'ajouter sans réécriture du socle.
6. **Consommation identique humains/machines** — un étudiant lisant un article et un agent IA interrogeant une capacité obtiennent leur réponse de la même source, avec la même garantie de fraîcheur et de preuve.
7. **Le droit de dire "je ne sais pas"** — un système de confiance doit pouvoir refuser une réponse ou signaler une incertitude plutôt que de deviner avec assurance.

## Principes fondamentaux

- **Séparation stricte des six couches** (section 2) — aucune couche n'emprunte la responsabilité d'une autre.
- **Une vérité, une seule fois** — un chiffre, une règle, une source : jamais recopiés, toujours référencés.
- **Rien n'est écrasé, tout est versionné** — une correction crée une nouvelle version, elle n'efface jamais l'ancienne.
- **Aucun fait sans preuve** — un `Fact` sans `Source` ne peut pas être publié.
- **Aucune recommandation sans explication** — un résultat calculé doit pouvoir dérouler la chaîne qui l'a produit.
- **Aucune règle sans origine** — une `Rule` sait toujours d'où elle vient (une `Regulation`, ou une décision éditoriale assumée).
- **Le doute est un résultat valide** — le système est conçu pour pouvoir répondre "incertain" ou "je ne sais pas", jamais pour deviner silencieusement.
- **Les jugements éditoriaux ne se déguisent jamais en faits officiels** — les deux natures de connaissance sont typées différemment et ne se confondent jamais dans une réponse.
- **Évolution additive uniquement** — on ajoute, on déprécie, on ne renomme ni ne supprime jamais un concept déjà en usage.
- **La confiance prime sur la performance technique en cas de conflit** — un système plus lent mais honnête est préférable à un système rapide mais qui approxime.

## Ce qui est volontairement exclu de ce blueprint

- Le choix d'un langage, d'un moteur de stockage, d'une plateforme d'hébergement.
- Le schéma physique d'une base de données (tables, index, format de sérialisation).
- Toute maquette ou décision d'interface utilisateur.
- Les décisions de monétisation ou de modèle économique.
- L'apprentissage automatique réel — la boucle de rétroaction (`Outcome`/`Signal`, section 3) est conçue pour être révisée par des humains, pas pour entraîner un modèle de manière autonome ; si du machine learning est envisagé un jour, ce sera un chantier séparé, postérieur à ce blueprint.
- La sécurité applicative détaillée (authentification, autorisation fine, rate-limiting) — mentionnée comme nécessaire (section 9) mais pas conçue ici.
- Tout contenu réel — aucune donnée, aucun article, aucune valeur n'est produite par ce document.

---

# 2. Les six couches

Le système est composé de six couches strictement séparées. Une couche ne peut dépendre que des couches qui la précèdent dans cet ordre — jamais l'inverse.

```
TRUTH  →  KNOWLEDGE  →  REASONING  →  PLANNING  →  EXPERIENCE  →  DISTRIBUTION
```

## TRUTH

**Responsabilité** : être le socle irréfutable du système — chaque affirmation vérifiable, sourcée et versionnée dans le temps. Rien n'est "vrai" ailleurs dans le système si ce n'est pas ici, ou dérivé d'ici.

**Contient** : `Fact`, `Source`, `Regulation`.

**Ne contient jamais** : une opinion éditoriale (ça vit dans `Knowledge`, en tant que `Judgment`), un texte narratif, une mise en forme, une logique conditionnelle (une `Rule` vit dans `Reasoning`, même si elle dérive souvent d'une `Regulation` d'ici).

**Dépendances** : aucune — c'est la couche fondatrice, elle ne dépend de rien d'autre dans le système.

**Exemple** : `Fact(sujet=Université de Bordeaux, prédicat=frais_licence, valeur=2895, devise=EUR, valide_depuis=2025-09, source=MESR-2025-2026)`.

## KNOWLEDGE

**Responsabilité** : donner une forme au monde réel à partir de la vérité — les entités qui le composent, leurs relations, le contenu narratif qui les décrit, et les jugements éditoriaux assumés par Dalili. C'est "ce que Dalili sait et pense du monde".

**Contient** : `Country`, `City`, `University`, `Program`, `Organization`, `Procedure` (définition générique), `Document` (type de pièce justificative), `Content`, `Question`, `Persona`, `Judgment`, `Cluster`/`Topic`, ainsi que toutes les relations structurelles entre ces objets.

**Ne contient jamais** : un chiffre brut non sourcé (toute valeur numérique doit référencer un `Fact` de la couche `Truth`), une décision personnalisée pour un individu précis (ça, c'est `Reasoning`/`Planning`), une mise en forme SEO/GEO/AEO (ça, c'est `Experience`).

**Dépendances** : `Truth` uniquement.

**Exemple** : `University("Université de Bordeaux") —OFFERS→ Program("Droit")`, `Content("guide-bordeaux") —CITES→ Fact(...)`.

## REASONING

**Responsabilité** : transformer `Knowledge` + `Truth` + un contexte (un profil, même hypothétique) en une réponse calculée, pondérée et **expliquée**. C'est la couche qui pense activement — elle ne stocke rien de permanent sur le monde, elle produit des réponses à des questions.

**Contient** : `Rule`, `Derivation`, `RecommendationModel`, `Recommendation` (le résultat produit, conservé pour traçabilité et retour d'expérience), le mécanisme de `Confidence`.

**Ne contient jamais** : du texte narratif destiné à un humain (ça, c'est `Experience`), une séquence d'actions dans le temps pour une personne réelle (ça, c'est `Planning`), une donnée non traçable jusqu'à `Truth`/`Knowledge`.

**Dépendances** : `Truth` + `Knowledge`. Elle reçoit un `LearnerProfile` en entrée (objet qui *vit* dans `Planning`, voir plus bas) sans jamais le posséder — `Reasoning` peut raisonner sur un profil hypothétique ou anonyme tout autant que sur un profil réel suivi dans le temps.

**Exemple** : `Rule("plafond travail étudiant algérien")` + `Fact(964h)` + profil(nationalité=Algérie) → `Derivation(plafond effectif=803h)`.

## PLANNING

**Responsabilité** : transformer une `Procedure` générique (`Knowledge`) et un profil réel (`LearnerProfile`) — enrichis des résultats du `Reasoning` — en un **plan d'action concret et daté** pour une personne précise : quoi faire, dans quel ordre, avant quelle échéance.

**Contient** : `LearnerProfile`, `Task`, `Timeline`, `Milestone` — toutes des instanciations concrètes, jamais des définitions génériques (les définitions génériques vivent dans `Knowledge`, sous forme de `Procedure`).

**Ne contient jamais** : la définition générique d'une démarche (`Procedure` appartient à `Knowledge`), un calcul brut (`Reasoning` produit les valeurs, `Planning` les séquence dans le temps pour quelqu'un).

**Dépendances** : `Knowledge` (pour les `Procedure`/`Document` génériques) et `Reasoning` (pour savoir si une étape s'applique à ce profil précis, et avec quelles valeurs).

**Exemple** : `Procedure` générique "Demande de visa étudiant — Maroc" + `LearnerProfile`(Maroc, départ visé septembre 2026) → une `Timeline` avec des `Milestone`("Campus France avant janvier") et des `Task` assignées.

**Pourquoi `LearnerProfile` vit ici et pas dans `Reasoning`** : `Planning` est la seule couche qui concerne une personne réelle suivie dans son parcours dans la durée ; `Reasoning` reste capable de raisonner sur des profils hypothétiques (ex. pour une recommandation générale, un agent IA qui simule "un étudiant sénégalais avec 600€/mois") sans qu'un vrai parcours individuel existe. Séparer les deux évite que toute la couche de calcul devienne dépendante d'un système de suivi utilisateur.

## EXPERIENCE

**Responsabilité** : transformer tout ce qui précède en quelque chose qu'un humain ou un agent reçoit réellement — un article rendu, une réponse conversationnelle, une fiche PDF, une notification — adapté au canal et à la langue.

**Contient** : les métadonnées de présentation (title/description/schema.org/format de question-réponse) par (entité ou contenu, canal, langue), le rendu final du `Content`, la mise en forme des `Recommendation`/`Timeline` pour affichage.

**Ne contient jamais** : une vérité, une règle, un calcul — uniquement de la mise en forme et de la traduction vers un format consommable.

**Dépendances** : `Knowledge`, `Reasoning`, `Planning` — tout ce qui précède.

**Exemple** : le même `Fact` + `Recommendation` est rendu en tableau comparatif sur le site, en réponse conversationnelle pour un agent IA, en notification push pour l'app — trois présentations, une seule vérité sous-jacente.

## DISTRIBUTION

**Responsabilité** : exposer un point d'accès unique, stable et versionné par lequel **tout** consommateur — site, application, dashboard, agent IA, automatisation interne — interroge ou déclenche le système. Aucun consommateur n'accède jamais directement aux couches internes.

**Contient** : les contrats de requête, `Capability` (les actions invocables), `Knowledge Pack` (les bundles exportables).

**Ne contient jamais** : de logique métier propre — elle expose ce que les couches précédentes ont produit, elle ne décide rien elle-même.

**Dépendances** : toutes les couches précédentes.

**Exemple** : un agent IA appelle `Capability("recommendCity", profile)` et reçoit une `Recommendation` déjà expliquée et mise en forme — sans jamais avoir eu besoin de comprendre comment `Reasoning`/`Knowledge`/`Truth` fonctionnent en interne.

---

# 3. Les objets métier

Chaque objet est présenté avec : **rôle**, **responsabilité**, **cycle de vie**, **relations principales**, **exemple**. Les objets sont regroupés par couche pour renforcer la cohérence avec la section 2. Deux objets de support (`Cluster`/`Topic` et `Presentation`), non explicitement nommés dans la demande mais nécessaires à la cohérence du modèle, sont ajoutés et signalés comme tels.

## Couche TRUTH

### `Fact`
- **Rôle** : l'unité atomique de vérité vérifiable — une affirmation, un chiffre, une durée, un plafond.
- **Responsabilité** : porter une valeur unique, datée, sourcée, jamais dupliquée ailleurs dans le système.
- **Cycle de vie** : créé à l'état `draft` tant qu'aucune `Source` n'est liée ; passe à `active` une fois sourcé ; jamais modifié en place — une correction crée un nouveau `Fact` qui `SUPERSEDES` l'ancien (`superseded` puis, si erroné, `retracted`).
- **Relations** : `CITED_BY` (Content, Recommendation), `DERIVED_FROM` (Regulation, optionnel), `SUPERSEDES`/`SUPERSEDED_BY` (autre Fact), `SOURCED_BY` (Source, obligatoire).
- **Exemple** : "Plafond horaire de travail étudiant hors UE = 964h/an".

### `Source`
- **Rôle** : la preuve — un document officiel qui justifie un ou plusieurs `Fact`/`Rule`.
- **Responsabilité** : porter une URL, un niveau d'autorité (tier), une date de consultation, idéalement une copie archivée.
- **Cycle de vie** : créée une fois, réutilisable par de nombreux `Fact` ; peut être marquée `stale` si son URL devient invalide ou son contenu change, déclenchant une revue des `Fact` qui s'appuient dessus.
- **Relations** : `SOURCES` (Fact, Rule, Judgment/méthodologie).
- **Exemple** : `legifrance.gouv.fr`, décret n°2026-385, consulté le 2026-07-11.

### `Regulation`
- **Rôle** : un texte réglementaire ou légal, traité comme une entité à part entière plutôt qu'une simple mention dans un `Source`.
- **Responsabilité** : porter une date d'effet, une référence légale, et permettre de retrouver **tous** les `Fact`/`Rule` qui en dépendent quand elle change.
- **Cycle de vie** : créée à sa promulgation ; marquée `superseded` quand un nouveau texte la remplace, ce qui déclenche automatiquement une revue de tout ce qui en dérive.
- **Relations** : `GOVERNS` (Fact, Rule), `SUPERSEDES`/`SUPERSEDED_BY` (autre Regulation).
- **Exemple** : le décret plafonnant les exonérations de frais de scolarité à 30 % pour 2026-2027.

## Couche KNOWLEDGE

### `Country`
- **Rôle** : un pays, d'origine (ex. Sénégal) ou de destination (France).
- **Responsabilité** : regrouper les `City`/`University`/`Procedure` qui lui sont propres, porter les spécificités administratives par nationalité (accords bilatéraux, statut CEF).
- **Cycle de vie** : rarement modifiée une fois créée ; stable.
- **Relations** : `CONTAINS` (City), `HAS_PROCEDURE` (Procedure spécifique à ce pays d'origine).
- **Exemple** : Maroc, Sénégal, France.

### `City`
- **Rôle** : une ville universitaire française.
- **Responsabilité** : regrouper les `University` qui s'y trouvent (par relation `LOCATED_IN` inversée, jamais par une liste recopiée), porter ses propres `Fact` (coût de la vie, transport).
- **Cycle de vie** : créée une fois, enrichie au fil du temps de nouveaux `Fact`/`Content`.
- **Relations** : `LOCATED_IN` (Country), navigable en sens inverse pour obtenir les `University` qu'elle contient.
- **Exemple** : Bordeaux, Lyon.

### `University`
- **Rôle** : un établissement d'enseignement supérieur.
- **Responsabilité** : porter son identité propre ; tous ses chiffres (frais, effectifs) sont des références à des `Fact`, jamais des valeurs propres.
- **Cycle de vie** : créée une fois la décision éditoriale prise de la couvrir ; enrichie progressivement.
- **Relations** : `LOCATED_IN` (City), `OFFERS` (Program), `HAS_FACT` (Fact), sous-type d'`Organization` (hérite des champs communs : nom, URL officielle).
- **Exemple** : Université de Bordeaux.

### `Program`
- **Rôle** : une filière/formation (droit, médecine, informatique).
- **Responsabilité** : permettre de regrouper des `University` par domaine d'étude, indépendamment de la ville.
- **Cycle de vie** : stable, peu de changements.
- **Relations** : `OFFERED_BY` (University, inverse d'OFFERS).
- **Exemple** : "Médecine (PASS/LAS)".

### `Organization`
- **Rôle** : supertype des institutions administratives ou éducatives impliquées dans le parcours étudiant.
- **Responsabilité** : porter les informations communes (nom, URL officielle, type) partagées par ses sous-types.
- **Cycle de vie** : stable.
- **Relations** : sert de type parent à `University`, `CROUS`, `Prefecture`, `Consulate`, `CAF` (héritage : chaque sous-type ajoute des champs spécifiques à son domaine tout en héritant des champs communs).
- **Exemple** : CROUS de Bordeaux, Préfecture de Gironde.

### `Procedure` *(définition générique)*
- **Rôle** : la définition abstraite et réutilisable d'une démarche administrative (visa, logement CROUS, ouverture de compte bancaire).
- **Responsabilité** : décrire les étapes génériques et les `Document` requis, indépendamment de toute personne réelle — ce n'est **pas** un plan personnel (ça, c'est `Timeline`/`Task` dans `Planning`).
- **Cycle de vie** : révisée quand une `Regulation` sous-jacente change.
- **Relations** : `REQUIRES` (Document), supertype possible pour des sous-types (`VisaProcedure`, `HousingProcedure`, `BankingProcedure`) partageant une structure d'étapes commune mais des champs spécifiques.
- **Exemple** : "Procédure CEF Campus France" (générique, avant instanciation pour un profil précis).

### `Document`
- **Rôle** : un type de pièce justificative requise par une ou plusieurs `Procedure`.
- **Responsabilité** : décrire ce qui est attendu (nature, format), pas un fichier réel déposé par un utilisateur.
- **Cycle de vie** : stable, révisé si une procédure change ses exigences.
- **Relations** : `REQUIRED_BY` (Procedure, inverse de REQUIRES).
- **Exemple** : "Lettre d'admission", "Justificatif de ressources 615€/mois".

### `Content`
- **Rôle** : un contenu narratif — article, guide, page pilier.
- **Responsabilité** : raconter, contextualiser, citer des `Fact`/`Source` — jamais embarquer un chiffre en dur.
- **Cycle de vie** : rédigé, publié, révisé (nouvelle version) en cas de correction factuelle ou éditoriale.
- **Relations** : `CITES` (Fact, Source), `BELONGS_TO_CLUSTER` (Cluster, un seul), `TARGETS_PERSONA` (Persona, plusieurs possibles), `CONTAINS` (Question).
- **Exemple** : l'article "Visa étudiant France depuis le Sénégal 2026".

### `Question`
- **Rôle** : une unité de type question/réponse — la brique de l'AEO — traitée comme un objet de première classe plutôt qu'extraite par analyse de texte.
- **Responsabilité** : porter une question, une réponse, une ou plusieurs `Source` de sourçage.
- **Cycle de vie** : créée avec son `Content` parent, ou indépendamment pour une page FAQ dédiée.
- **Relations** : `PART_OF` (Content), `SOURCED_BY` (Source).
- **Exemple** : "Combien de temps pour un visa étudiant depuis le Maroc ?".

### `Persona`
- **Rôle** : un segment d'audience type (étudiant marocain, sénégalais, libanais...).
- **Responsabilité** : permettre de cibler du `Content` et de qualifier des `Rule` sans référencer une personne réelle.
- **Cycle de vie** : stable, un nombre limité de personas gérés éditorialement.
- **Relations** : `TARGETED_BY` (Content), `MATCHED_BY` (Rule).
- **Exemple** : "Étudiant marocain, primo-arrivant, niveau Licence".

### `Judgment`
- **Rôle** : une évaluation éditoriale assumée par Dalili — distincte d'un `Fact` officiel.
- **Responsabilité** : porter un avis, un score, une note qualitative, toujours rattaché à une méthodologie éditoriale documentée (jamais présenté avec l'autorité d'un `Fact` sourcé officiellement).
- **Cycle de vie** : révisé périodiquement par l'équipe éditoriale, jamais confondu avec une mise à jour de `Fact`.
- **Relations** : `ASSESSES` (University, City), `DOCUMENTED_BY` (une méthodologie éditoriale).
- **Exemple** : le score "communauté" 5/5 attribué à Toulouse.

### `Cluster` / `Topic` *(objet de support, non demandé explicitement mais nécessaire)*
- **Rôle** : le regroupement thématique ou géographique qui alimente le maillage interne.
- **Responsabilité** : rattacher un `Content` à un ensemble cohérent d'autres contenus proches.
- **Cycle de vie** : stable, la liste des clusters évolue rarement.
- **Relations** : `GROUPS` (Content).
- **Exemple** : cluster "Maroc", cluster "Médecine".

## Couche REASONING

### `Rule`
- **Rôle** : une connaissance conditionnelle — "si tel profil, alors telle conséquence".
- **Responsabilité** : exprimer une logique de manière déclarative et lisible, jamais enfouie dans du code applicatif.
- **Cycle de vie** : créée avec une origine (`Regulation` ou décision éditoriale), révisée si sa source change.
- **Relations** : `DERIVED_FROM` (Regulation, optionnel), `APPLIES_TO` (Persona ou motif de profil), `PRODUCES` (Fact effectif ou contrainte).
- **Exemple** : "Si nationalité = Algérie, alors plafond de travail = 803h/an (et non 964h)".

### `Derivation`
- **Rôle** : une formule de calcul déclarée, réutilisable, traçable.
- **Responsabilité** : définir des entrées nécessaires, une opération, une unité de sortie — jamais une boîte noire de code.
- **Cycle de vie** : versionnée comme un `Fact` — une méthode de calcul qui change (ex. nouvelle formule CAF) crée une nouvelle version.
- **Relations** : `USES` (Fact, autre Derivation), `SOURCED_BY` (Source, si la méthode elle-même est officielle).
- **Exemple** : "Budget net mensuel = loyer + nourriture + transport − CAF − économie RU − CSS".

### `RecommendationModel`
- **Rôle** : la politique de pondération et de scoring utilisée pour comparer plusieurs options.
- **Responsabilité** : déclarer explicitement les critères pris en compte et leurs poids par défaut — les poids restant ajustables via le `LearnerProfile`.
- **Cycle de vie** : révisé par l'équipe éditoriale, potentiellement à la lumière d'`Outcome`/`Signal` accumulés.
- **Relations** : `USES` (Judgment, Derivation, Fact), `PRODUCES` (Recommendation).
- **Exemple** : le modèle de scoring du Comparateur de villes (budget, emploi, communauté, météo, transport).

### `Recommendation`
- **Rôle** : le résultat produit et conservé d'un raisonnement — pas un affichage éphémère, un objet traçable.
- **Responsabilité** : porter le classement produit ET la chaîne complète qui y a mené (quels `Fact`/`Rule`/`Derivation`/`Judgment` ont été utilisés, avec quels poids).
- **Cycle de vie** : créée à chaque exécution, conservée pour permettre un futur `Outcome` de s'y rattacher.
- **Relations** : `USES` (Fact, Rule, Derivation, Judgment), `PRODUCED_BY` (RecommendationModel), `MEASURED_BY` (Outcome, Signal).
- **Exemple** : "Pour ce profil, Toulouse est recommandée avant Lille, avec le détail des critères".

## Couche PLANNING

### `LearnerProfile`
- **Rôle** : le contexte structuré d'une personne réelle (ou hypothétique) — le "pour qui" de toute réponse personnalisée.
- **Responsabilité** : porter les variables dont dépendent les calculs et recommandations (origine, niveau, filière, budget, priorités, dates visées) dans un format unique, partagé par tous les outils.
- **Cycle de vie** : créé au début d'une interaction, mis à jour au fil du parcours réel de l'étudiant.
- **Relations** : `DRIVES` (Recommendation, Task, Timeline).
- **Exemple** : "Étudiant sénégalais, niveau Master, budget cible 700€/mois, départ prévu septembre 2026".

### `Task`
- **Rôle** : une action concrète et datée à réaliser par une personne précise.
- **Responsabilité** : porter un statut (à faire/fait/en retard), une échéance, un lien vers le `Document`/étape générique dont elle découle.
- **Cycle de vie** : créée lors de l'instanciation d'une `Timeline`, mise à jour au fil de l'avancement réel.
- **Relations** : `INSTANTIATES` (étape d'une Procedure), `BELONGS_TO` (Timeline).
- **Exemple** : "Déposer le dossier Campus France avant le 15 janvier 2027".

### `Timeline`
- **Rôle** : le plan complet et daté d'un parcours pour une personne précise.
- **Responsabilité** : séquencer les `Task`/`Milestone` dans le temps, à partir d'une `Procedure` générique et d'un `LearnerProfile`.
- **Cycle de vie** : créée à la demande, révisée si le profil ou une règle change (ex. un délai officiel change, la Timeline se recalcule).
- **Relations** : `INSTANTIATES` (Procedure), `CONTAINS` (Task, Milestone), `FOR` (LearnerProfile).
- **Exemple** : la timeline complète "Départ pour la France depuis le Maroc, rentrée 2027".

### `Milestone`
- **Rôle** : une étape-repère importante dans une `Timeline` (pas une simple tâche, un jalon structurant).
- **Responsabilité** : marquer un point de non-retour ou une échéance critique (ex. fin de la période de dépôt Campus France).
- **Cycle de vie** : créé avec la Timeline, peut être marqué atteint/manqué.
- **Relations** : `BELONGS_TO` (Timeline).
- **Exemple** : "Clôture Campus France Maroc".

## Couche EXPERIENCE

### `Presentation` *(objet de support, non demandé explicitement mais nécessaire)*
- **Rôle** : la mise en forme d'une entité ou d'un contenu pour un canal et une langue donnés.
- **Responsabilité** : porter title/description/schema.org/format de FAQ — jamais une valeur de vérité.
- **Cycle de vie** : régénérée à chaque changement de convention de présentation (ex. raccourcir tous les titres), sans jamais toucher au contenu ou aux faits sous-jacents.
- **Relations** : `PRESENTS` (Entity ou Content, pour un canal+langue donnés).
- **Exemple** : la meta description optimisée CTR de la fiche Sorbonne pour le canal "web", vs. sa version condensée pour un agent IA.

## Couche DISTRIBUTION

### `Capability`
- **Rôle** : une action formellement invocable par un consommateur externe (agent IA, app, automatisation).
- **Responsabilité** : déclarer un contrat clair — entrée attendue (`LearnerProfile` ou paramètres), logique invoquée (`Derivation`/`RecommendationModel`/`Procedure`), sortie produite, effets de bord éventuels.
- **Cycle de vie** : versionnée (une capacité peut évoluer sans casser les consommateurs existants d'une version antérieure).
- **Relations** : `EXPOSES` (Derivation, RecommendationModel, Procedure).
- **Exemple** : `recommendCity(profile)`, `simulateBudget(profile)`, `nextStep(profile)`.

### `Knowledge Pack`
- **Rôle** : un bundle cohérent et versionné d'un sous-ensemble du système, assemblé pour un usage précis (un agent IA, une synchronisation hors-ligne de l'app).
- **Responsabilité** : offrir une vue stable et datée (ex. "tout ce qui concerne étudier en France depuis le Sénégal, au 2026-07") plutôt que d'obliger chaque consommateur à interroger fait par fait.
- **Cycle de vie** : régénéré à intervalle régulier ou à la demande, chaque génération étant elle-même datée et traçable.
- **Relations** : `BUNDLES` (Entity, Fact, Content).
- **Exemple** : un pack "Sénégal × Visa × 2026" consommé par un agent IA tiers pour répondre sans halluciner.

## Objets transverses (boucle de retour)

### `Outcome`
- **Rôle** : un résultat réel observé après une recommandation ou une règle appliquée.
- **Responsabilité** : rattacher un fait du monde réel (l'étudiant a suivi la recommandation, ou l'a contestée) à l'objet qui l'a produit.
- **Cycle de vie** : créé ponctuellement, consulté lors des révisions périodiques du `RecommendationModel`/`Rule` concerné.
- **Relations** : `MEASURES` (Recommendation, Rule, Fact).
- **Exemple** : "L'étudiant a choisi Lille malgré la recommandation de Toulouse — raison déclarée : proximité familiale".

### `Signal`
- **Rôle** : un indicateur agrégé (comportemental, analytique) qui suggère qu'une partie du système mérite une révision.
- **Responsabilité** : capter un motif (ex. beaucoup de recherches sur un sujet non couvert, un chiffre contesté plusieurs fois) sans déclencher d'action automatique.
- **Cycle de vie** : accumulé, consulté périodiquement par une revue humaine.
- **Relations** : `MEASURES` (Fact, Content, RecommendationModel).
- **Exemple** : un volume d'impressions Google Search Console élevé sur une requête non couverte par un `Content` existant.

---

# 4. Les relations

## Principe général

Toute relation est un **objet de première classe**, stockée une seule fois dans un registre central — jamais un tableau recopié à l'intérieur d'une entité. C'est la correction structurelle directe du bug des 38 liens morts villes→universités identifié dans l'architecture actuelle : une relation qui pointerait vers une entité inexistante est structurellement impossible, pas seulement improbable.

## Cardinalités et contraintes — tableau de référence

| Relation | Sujet → Objet | Cardinalité | Contrainte |
|---|---|---|---|
| `LOCATED_IN` | City/University → Country/City | N:1 | l'objet référencé doit exister (intégrité référentielle stricte) |
| `OFFERS` | University → Program | N:N | — |
| `REQUIRES` | Procedure → Document | N:N | peut être conditionnelle (qualifiée par une `Rule`) |
| `HAS_FACT` | toute Entity → Fact | N:N | un seul `Fact` **actif** par (entité, prédicat) à un instant donné — les autres sont `superseded` |
| `CITES` | Content/Recommendation → Fact/Source | N:N | — |
| `DERIVED_FROM` | Fact/Rule → Regulation | N:1 (optionnel) | si présent, doit pointer vers une Regulation existante |
| `SUPERSEDES` / `SUPERSEDED_BY` | Fact → Fact | 1:1 | forme une chaîne linéaire par (entité, prédicat), jamais un cycle |
| `APPLIES_TO` | Rule → Persona | N:N | — |
| `BELONGS_TO_CLUSTER` | Content → Cluster | N:1 | un contenu a exactement **un** cluster principal (cohérent avec le système déjà en usage) |
| `TARGETS_PERSONA` | Content → Persona | N:N | — |
| `USES` | Recommendation → Fact/Rule/Derivation/Judgment | N:N | constitue la chaîne d'explication, ne peut pas être vide pour une Recommendation publiée |
| `INSTANTIATES` | Task/Timeline → Procedure | N:1 | — |
| `BELONGS_TO` | Task/Milestone → Timeline | N:1 | — |
| `MEASURES` | Outcome/Signal → Recommendation/Rule/Fact | N:N | — |
| `BUNDLES` | Knowledge Pack → Entity/Fact/Content | N:N | — |
| `EXPOSES` | Capability → Derivation/RecommendationModel/Procedure | N:N | — |

## Héritage (inheritance)

Trois hiérarchies de types sont prévues, pour éviter de dupliquer des champs communs tout en gardant les spécificités de chaque sous-type :

- **`Organization`** (supertype) → `University`, `CROUS`, `Prefecture`, `Consulate`, `CAF` (sous-types). Les champs communs (nom, URL officielle, type d'organisme) sont hérités ; chaque sous-type ajoute ses champs propres (`University` ajoute effectifs/programmes, `Prefecture` ajoute une juridiction géographique).
- **`Procedure`** (supertype) → `VisaProcedure`, `HousingProcedure`, `BankingProcedure`, `HealthProcedure` (sous-types). Tous partagent une structure commune d'étapes/`Document` requis, chacun ajoutant ses champs spécifiques (ex. `VisaProcedure` ajoute un statut CEF/non-CEF par pays).
- **`Content`** (supertype) → `Article`, `FAQPage`, `PillarGuide` (sous-types). Reprend la distinction déjà utile aujourd'hui entre `category` (affichage) et une nature structurelle du contenu.

## Navigation

Toute relation est **navigable dans les deux sens par construction**, puisqu'elle est stockée une seule fois dans le registre central plutôt que comme un tableau à sens unique dans une seule entité. Exemple concret : `Country —CONTAINS→ City` est déclarée une seule fois ; interroger "quelles villes contient la France" ou "à quel pays appartient Bordeaux" sont deux requêtes sur la **même** ligne de relation, jamais deux structures de données différentes à maintenir en synchronisation.

## Exemple illustratif complet

```
Country("France")
   ↑ LOCATED_IN
City("Bordeaux") ← (navigable : "quelles universités sont à Bordeaux ?")
   ↑ LOCATED_IN
University("Université de Bordeaux")
   → OFFERS → Program("Droit")
   → HAS_FACT → Fact("frais_licence=2895€", SOURCED_BY → Source(MESR))
   ← CITES ← Content("guide-bordeaux")
                → BELONGS_TO_CLUSTER → Cluster("visa-campus-france")... (exemple, dépend du contenu)
```

---

# 5. Les flux complets

## Flux A — Création d'une université

1. **Truth** : les `Fact` nécessaires (frais, effectifs, budget de vie) sont identifiés et leurs `Source` créées/liées **avant** toute autre étape — rien n'est écrit sans preuve dès l'origine.
2. **Knowledge** : l'entité `University` est créée, reliée par `LOCATED_IN` à sa `City`, ses `Program` associés via `OFFERS`, ses chiffres référencés via `HAS_FACT` (jamais recopiés).
3. **Reasoning** : aucune action spécifique requise — les `Rule` déjà existantes (ex. plafond de travail par nationalité) s'appliquent automatiquement dès qu'un `LearnerProfile` interroge cette université, parce qu'elles sont génériques et non liées à une entité particulière.
4. **Knowledge (Content)** : un ou plusieurs `Content` sont rédigés, citant les `Fact` de cette université via `CITES`, rattachés à un `Cluster`.
5. **Experience** : les `Presentation` (title/description/schema.org/format Question) sont générées pour cette entité et son contenu — dérivées automatiquement, jamais ressaisies à la main comme c'est le cas aujourd'hui (`UNI_SEO`).
6. **Distribution** : l'entité et son contenu deviennent immédiatement interrogeables via les `Capability`/`Knowledge Pack` par le site, un agent IA, l'app mobile — sans travail d'intégration additionnel.

## Flux B — Modification réglementaire

1. **Truth** : une nouvelle `Regulation` est enregistrée (ex. le décret plafonnant les exonérations de frais).
2. **Truth** : une requête structurelle "quels `Fact` dérivent de la `Regulation` remplacée" retourne la liste **exhaustive et garantie** des faits concernés — contrairement au grep manuel actuel, qui a déjà raté une donnée dupliquée une fois. Chacun est marqué `needs_review`.
3. **Truth** : une fois vérifiée sur la nouvelle source, chaque `Fact` concerné reçoit une nouvelle version (`SUPERSEDES` l'ancienne).
4. **Reasoning** : toute `Rule` dérivée de cette `Regulation` est elle-même révisée si nécessaire.
5. **Knowledge (Content)** : les articles qui **citent** ces `Fact` (plutôt que de recopier leur valeur) n'ont rien à changer techniquement — mais une liste de `Content` à relire humainement est générée automatiquement dès qu'un changement de `Regulation` touche un fait qu'ils citent, car le sens narratif autour du chiffre peut avoir changé même si la citation, elle, se met à jour seule.
6. **Experience/Distribution** : toutes les surfaces reflètent la nouvelle valeur au rendu suivant, sans sweep manuel de fichiers.

## Flux C — Nouvelle ville

Même schéma que le flux A, avec une différence clé : la liste des universités d'une ville n'est **jamais** une liste maintenue à la main (source du bug des 38 liens morts) — elle est obtenue en interrogeant `LOCATED_IN` en sens inverse. Une ville nouvellement créée "sait" immédiatement, sans travail supplémentaire, quelles universités déjà existantes s'y trouvent, et inversement toute université future qui s'y ajoute apparaît automatiquement dans la liste de la ville — sans qu'aucune des deux entités n'ait besoin d'être modifiée pour "informer" l'autre.

## Flux D — Nouvel article

1. **Knowledge** : le `Content` est créé, un `Cluster` et un ou plusieurs `Persona` cibles lui sont assignés dès la création.
2. **Truth** : tout chiffre mentionné doit résoudre vers un `Fact` existant, ou en créer un nouveau (avec sa `Source`) avant rédaction — le processus d'écriture impose de citer, jamais de taper un chiffre.
3. **Knowledge** : les `Question` de la FAQ sont créées comme objets explicites (rédigées comme telles), pas devinées après-coup par une analyse du Markdown — élimine la fragilité actuelle de l'extraction par regex.
4. **Experience** : les métadonnées sont générées ; le schema.org `Article`/`FAQPage` est assemblé directement depuis les objets `Content`/`Question`, pas reconstruit en interprétant du texte libre.
5. **Distribution** : immédiatement citable par un agent, immédiatement inclus dans un `Knowledge Pack` pertinent.

## Flux E — Nouvelle recommandation

1. **Distribution** : un agent ou l'application appelle `Capability("recommendCity", profile)`.
2. **Planning** : le `LearnerProfile` fourni est résolu/validé (nationalité, budget, priorités déclarées).
3. **Reasoning** : le `RecommendationModel` pertinent est sélectionné ; les `Rule` applicables filtrent/ajustent les options (ex. exclusion, plafond spécifique) ; les `Derivation` nécessaires sont invoquées (ex. budget net par ville pour ce profil précis) ; les `Judgment` (scores éditoriaux) sont pondérés selon les priorités du profil.
4. **Reasoning** : une `Recommendation` est produite, avec sa trace complète via `USES` (quels `Fact`, `Rule`, `Derivation`, `Judgment`, avec quels poids).
5. **Reasoning** : le niveau de confiance est évalué — si une ville candidate manque de données suffisamment fraîches/fiables, elle est exclue du classement ou explicitement signalée incertaine, jamais classée avec la même assurance que les autres.
6. **Experience** : la `Recommendation` est mise en forme selon le canal — tableau comparatif web, réponse conversationnelle pour un agent, notification pour l'app.
7. **Planning** *(optionnel)* : si l'étudiant retient la ville recommandée, ça peut déclencher l'instanciation d'une `Timeline` pour la démarche correspondante.
8. **Boucle de retour** : un `Outcome` peut être enregistré plus tard (l'étudiant a suivi ou contesté la recommandation), alimentant une future révision du `RecommendationModel`.

---

# 6. Le moteur de raisonnement

Aucun code, uniquement le déroulé conceptuel — une suite d'étapes déterministes, chacune inspectable, jamais une boîte noire :

1. **Résolution du contexte** : le moteur reçoit un `LearnerProfile` (réel ou hypothétique) et une question ou une `Capability` à exécuter.
2. **Résolution des faits pertinents "à cet instant, pour cette entité"** : le moteur interroge `Truth` pour obtenir la version **actuellement valide** de chaque `Fact` nécessaire — jamais une valeur en cache non datée.
3. **Application des `Rule`** : chaque règle dont la condition correspond au profil est appliquée — elle peut poser une contrainte (un plafond effectif différent), exclure une option (une université qui n'accepte pas ce niveau), ou transformer un fait générique en fait "effectif" pour ce profil précis.
4. **Invocation des `Derivation`** : les valeurs calculées (budget net, score composite) sont produites à partir des faits déjà filtrés par les règles — chaque `Derivation` documente explicitement quelles entrées elle a mobilisées.
5. **Construction de la `Recommendation`** (si l'action en produit une) : le `RecommendationModel` combine faits, dérivations et jugements selon des poids (par défaut, ou fournis par le profil), et produit un classement.
6. **Construction de l'explication** : à chaque étape précédente, une trace s'accumule (quel fait, quelle source, quelle règle, quelle dérivation, quel poids) — l'explication n'est **pas** générée après coup en résumant le résultat, elle est le sous-produit naturel du calcul lui-même. C'est ce qui distingue ce moteur d'un modèle qui "justifierait" une réponse a posteriori.
7. **Évaluation de la confiance** : le moteur calcule un niveau de complétude à partir du tier des sources mobilisées, de la fraîcheur des faits, et de l'absence éventuelle de données nécessaires — un signal opérationnel, pas un argument marketing.
8. **Décision de répondre ou de refuser** : si la confiance est sous un seuil défini, ou si un fait indispensable manque purement et simplement, le moteur **ne produit pas** une réponse assurée. Il retourne soit une réponse partielle explicitement marquée incomplète, soit une demande de clarification, soit un refus documenté — c'est un résultat valide du raisonnement, jamais un échec silencieux ni une supposition déguisée en certitude.
9. **Gestion des conflits de sources** : si deux `Fact` valides de même niveau d'autorité se contredisent, le moteur ne tranche jamais arbitrairement — il signale le conflit (statut `disputed`) et l'expose plutôt que de choisir en silence.

---

# 7. Les capacités futures

Cette architecture ne construit aucune de ces fonctionnalités elle-même — elle les rend possibles sans réécriture supplémentaire :

- **Comparateur** — devient une instance de `RecommendationModel`, avec pondération ajustable par le `LearnerProfile` plutôt que des poids égaux figés.
- **Simulateur** — devient une `Derivation` générique, réutilisable telle quelle par le site, l'app, ou un agent IA, plutôt qu'une logique de calcul isolée par outil.
- **Checklist** — devient une instanciation de `Procedure` en `Task`/`Timeline` personnalisée pour chaque étudiant, plutôt qu'un PDF statique identique pour tous.
- **Timeline** — capacité native de la couche `Planning`, pas un outil à part.
- **Assistant IA conversationnel** — combine `Capability` + `Reasoning` + `Experience` en dialogue, avec la même garantie de traçabilité que n'importe quelle autre surface.
- **Recherche intelligente** — interroge directement `Knowledge`/`Truth` (entités, faits, relations), plutôt qu'un index de texte flou sur du Markdown.
- **API publique** — la couche `Distribution` déjà conçue pour être stable et versionnée, simplement ouverte à des consommateurs externes.
- **Application mobile** — consomme la même `Distribution` que le site, sans jamais ressaisir de logique séparée.
- **Dashboard interne** — interroge `Outcome`/`Signal`/fraîcheur des `Fact` pour du monitoring éditorial (quels faits vieillissent, quelles règles n'ont jamais été revues).
- **Agents IA tiers** — consomment des `Knowledge Pack`, invoquent des `Capability`, sans jamais avoir besoin d'accéder aux couches internes.
- **WebMCP** — cesse d'être une ambition non concrétisée : c'est l'implémentation directe de `Capability`.

---

# 8. Stratégie de migration

**Principe directeur** : aucune réécriture. Chaque phase livre une valeur immédiate, corrige si possible un problème déjà connu, et coexiste avec l'existant tant que la phase suivante n'est pas prête. L'ordre est pensé pour traiter en premier les problèmes déjà identifiés et vérifiés (frais de scolarité, liens morts), ce qui construit la confiance dans le nouveau système par la preuve plutôt que par la promesse.

### Phase 0 — Vocabulaire et fondations, sans rien migrer
- **Objectif** : formaliser les schémas des objets `Fact`/`Source`/`Regulation` sans toucher à une seule donnée existante.
- **Bénéfices** : aligne l'équipe sur le vocabulaire avant tout effort de migration ; zéro risque, rien n'est encore branché.
- **Risques** : aucun, phase purement conceptuelle.
- **Critères de validation** : le vocabulaire est compris et accepté ; un exemple concret (les frais de scolarité) est modélisé sur le papier avec ce vocabulaire.

### Phase 1 — `Truth` sur le domaine le plus à risque
- **Objectif** : créer réellement les `Fact`/`Source` pour les données qui ont déjà causé un bug (frais de scolarité, CVEC, plafonds horaires).
- **Bénéfices** : preuve concrète et immédiate de la valeur du système sur un cas déjà douloureux.
- **Risques** : double saisie temporaire (l'ancien `lib/universities.ts` et les nouveaux `Fact` coexistent sans lien automatique).
- **Critères de validation** : les 14 universités ont un `Fact` correctement sourcé pour leurs frais, sans incohérence entre elles.

### Phase 2 — Les pages existantes lisent depuis `Truth`
- **Objectif** : faire en sorte que les pages université/ville actuelles affichent la valeur en lisant le `Fact` plutôt qu'un champ recopié dans `lib/*.ts`.
- **Bénéfices** : élimine structurellement la classe de bug des frais de scolarité incohérents — un seul endroit à corriger désormais, pour de vrai.
- **Risques** : nécessite un pont technique entre l'ancien système de rendu et le nouveau magasin de faits (non conçu ici, mais anticipé).
- **Critères de validation** : modifier un `Fact` met à jour toutes les pages qui le citent, sans édition supplémentaire.

### Phase 3 — `Regulation` et workflow de revue
- **Objectif** : formaliser les textes réglementaires et rendre `needs_review` interrogeable plutôt que découvert par grep manuel.
- **Bénéfices** : le prochain changement réglementaire (il y en aura un) est traité de façon exhaustive et vérifiable.
- **Risques** : demande une discipline de revue régulière pour ne pas laisser la file `needs_review` s'accumuler sans traitement.
- **Critères de validation** : un changement réglementaire test peut être tracé du texte de loi jusqu'à la liste exhaustive des faits impactés.

### Phase 4 — Relations centralisées
- **Objectif** : migrer les relations ville↔université dans un registre central avec intégrité référentielle imposée.
- **Bénéfices** : corrige immédiatement et visiblement les 38 liens morts déjà identifiés — un second succès concret qui construit la confiance dans la migration.
- **Risques** : nécessite de décider quoi faire des 38 écoles aujourd'hui référencées sans fiche (les créer, ou les retirer proprement).
- **Critères de validation** : aucune relation du système ne peut plus pointer vers une entité inexistante.

### Phase 5 — Contenu citant les faits
- **Objectif** : migrer progressivement les articles (en commençant par les plus stratégiques) pour qu'ils citent des `Fact` plutôt que d'embarquer des chiffres.
- **Bénéfices** : réduit le risque d'obsolescence article par article, sans big-bang.
- **Risques** : c'est le chantier le plus long (65 articles) — doit rester incrémental, jamais un objectif "tout ou rien".
- **Critères de validation** : un échantillon d'articles migrés survit à un changement de `Fact` sans édition manuelle du texte.

### Phase 6 — `Presentation` consolidée
- **Objectif** : remplacer les objets `UNI_SEO`/`CITY_SEO` dupliqués par des `Presentation` générées.
- **Bénéfices** : élimine la maintenance manuelle de 28 objets de métadonnées SEO.
- **Risques** : risque de perte de finesse éditoriale si la génération est trop mécanique — garder un espace de surcharge manuelle assumée.
- **Critères de validation** : les métadonnées restent aussi pertinentes qu'avant, mesurées via Google Search Console.

### Phase 7 — `LearnerProfile` et premières `Derivation`
- **Objectif** : formaliser le calcul du Simulateur comme une `Derivation` s'appuyant sur les nouveaux `Fact`.
- **Bénéfices** : un calcul, plusieurs surfaces potentielles (site, futur agent) sans le recoder.
- **Risques** : l'interface utilisateur actuelle du Simulateur ne change pas visuellement — seul son "moteur" est remplacé, ce qui doit rester invisible pour l'utilisateur final.
- **Critères de validation** : le résultat du Simulateur migré est identique à l'ancien sur un jeu de cas de test.

### Phase 8 — `Rule` et `Judgment` séparés
- **Objectif** : formaliser les règles d'éligibilité (plafonds horaires par nationalité) et séparer les scores du Comparateur en `Judgment` documentés.
- **Bénéfices** : clarifie enfin, structurellement, ce qui est un fait officiel et ce qui est un avis Dalili — plus de risque de confusion.
- **Risques** : demande d'écrire, pour la première fois, une méthodologie éditoriale explicite pour les scores — un travail éditorial, pas seulement technique.
- **Critères de validation** : chaque score affiché peut être tracé jusqu'à sa méthodologie documentée.

### Phase 9 — Moteur de recommandation et explicabilité
- **Objectif** : reconstruire le Comparateur comme un vrai `RecommendationModel` avec poids ajustables et trace de raisonnement visible.
- **Bénéfices** : première fonctionnalité réellement "intelligente" et personnalisée du site.
- **Risques** : complexité perçue par l'utilisateur si l'explication est mal présentée — nécessite un travail d'expérience utilisateur, pas seulement technique.
- **Critères de validation** : un utilisateur peut demander "pourquoi cette ville" et recevoir une réponse compréhensible et exacte.

### Phase 10 — `Planning` natif
- **Objectif** : reconstruire le Calendrier comme une instanciation réelle de `Procedure` contre un `LearnerProfile`, plutôt qu'un calendrier générique par pays.
- **Bénéfices** : personnalisation réelle du parcours, base de la future application mobile.
- **Risques** : nécessite d'avoir déjà des `Procedure` bien modélisées (dépend des phases précédentes).
- **Critères de validation** : deux profils différents dans le même pays reçoivent des timelines différentes si leur situation diffère réellement.

### Phase 11 — `Capability` et `Knowledge Pack` pour les agents
- **Objectif** : exposer formellement des capacités invocables et des bundles exportables.
- **Bénéfices** : ouvre la voie à une intégration réelle avec des agents IA tiers et une API publique.
- **Risques** : première exposition externe du système — nécessite des décisions de sécurité/limitation d'usage non couvertes par ce blueprint (voir section 9).
- **Critères de validation** : un agent externe peut invoquer une capacité et recevoir une réponse tracée, sans connaître l'interne du système.

### Phase 12 — Application mobile sur la même distribution
- **Objectif** : construire l'application mobile comme un simple nouveau consommateur de la couche `Distribution` déjà existante, jamais une resaisie parallèle.
- **Bénéfices** : garantit que l'app et le site ne peuvent structurellement pas diverger.
- **Risques** : dépend de la maturité de toutes les phases précédentes — une app construite trop tôt recréerait le problème que tout ce blueprint cherche à éviter.
- **Critères de validation** : l'app et le site affichent une réponse identique à une même question, au même moment.

---

# 9. Questions ouvertes

Les choix suivants restent délibérément non tranchés par ce blueprint :

- Qui possède la gouvernance finale d'un `Fact` contesté (arbitrage entre deux sources de même tier) ?
- Les poids par défaut d'un `RecommendationModel` sont-ils ajustables en temps réel par l'utilisateur final, ou uniquement révisés périodiquement par l'équipe éditoriale ?
- Les versions historiques d'un `Fact` sont-elles exposées publiquement (transparence totale) ou uniquement conservées en interne ?
- Quelle granularité adopter pour un `Knowledge Pack` (par pays, par persona, par thème, par combinaison) ?
- Le moteur de raisonnement s'exécute-t-il uniquement côté serveur/API, ou une partie peut-elle un jour tourner côté application (mode hors-ligne) ?
- Comment authentifier et limiter l'usage des `Capability` exposées publiquement (sécurité applicative, hors scope de ce document) ?
- À quel moment introduire une deuxième langue (arabe, anglais) dans `Persona`/`Content`/`Presentation` — dès la conception ou après stabilisation du français ?
- Une veille réglementaire automatisée (scraping/alertes) sera-t-elle un jour construite, ou la détection reste-t-elle volontairement humaine/manuelle ?
- Le `Feedback` (`Outcome`/`Signal`) restera-t-il toujours à révision humaine, ou un jour une forme d'apprentissage automatique encadré sera-t-elle envisagée ?
- Qui décide, en pratique, du niveau de tier d'une nouvelle `Source` (une grille figée, ou un jugement au cas par cas) ?
- Comment financer/prioriser le temps de migration (section 8) face à la production de contenu courante, qui reste la priorité business immédiate ?

---

# 10. Conclusion — Dalili une fois ce système achevé

Dans plusieurs années, une fois ce Knowledge System pleinement construit, Dalili ne sera plus "un site avec des articles et quelques outils" — ce sera **un seul cerveau vérifiable, interrogé de six manières différentes** : par un étudiant qui lit un guide, par le même étudiant plus tard dans l'application qui suit sa timeline personnelle, par un agent ChatGPT ou Perplexity qui cite Dalili en réponse à une question sur les études en France, par un partenaire qui interroge l'API publique, par l'équipe elle-même via un dashboard qui montre où la connaissance vieillit, et par des automatisations internes qui maintiennent tout ça à jour.

Chacune de ces six surfaces racontera exactement la même vérité, au même moment, parce qu'il n'existera littéralement qu'un seul endroit où cette vérité est écrite. Une recommandation ne sera jamais une boîte noire : un étudiant pourra toujours demander "pourquoi" et obtenir une réponse réelle, remontant jusqu'au texte de loi ou à la source officielle d'origine. Et quand le système ne saura pas — parce qu'une donnée manque, parce qu'une réglementation vient de changer, parce que deux sources se contredisent — il le dira honnêtement, plutôt que de deviner.

C'est exactement ce que le nom du produit promet depuis le début : **دليلي — mon guide** — pas un moteur de recherche, pas un générateur de contenu, un guide qui sait ce qu'il sait, sait ce qu'il ne sait pas encore, et peut toujours expliquer pourquoi il dit ce qu'il dit.

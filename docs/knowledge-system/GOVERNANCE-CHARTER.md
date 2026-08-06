# GOVERNANCE CHARTER — DALILI KNOWLEDGE SYSTEM

**Statut** : document officiel de gouvernance. Complète les documents d'architecture déjà validés (Vision, Architecture V1/V2, Blueprint, 28 spécifications, Gap Analysis, Master Implementation Plan, Readiness Review) — ne les modifie pas, ne les remplace pas, n'introduit aucune nouvelle architecture.

**Ce document décrit** : qui décide quoi, selon quelle procédure, à quelle fréquence, et ce qui se passe quand une règle n'est pas respectée. Aucun code, aucune technologie, aucun SQL, aucune API.

**Origine directe de ce document** : la Readiness Review a noté la Gouvernance 5/10 — le point le plus faible de toute l'évaluation, avec un constat précis : *"revue humaine" invoqué partout, jamais formalisé en cadence, ni en plan de continuité*. Cette charte existe pour combler exactement ce manque, pas pour ajouter une couche administrative superflue.

---

## 1. Mission

Cette gouvernance existe parce qu'une architecture, aussi rigoureuse soit-elle, ne garantit rien par elle-même. Le Knowledge System peut techniquement empêcher qu'un chiffre soit dupliqué — il ne peut pas empêcher qu'un `Fact` correct devienne faux avec le temps et que personne ne s'en aperçoive. Les deux bugs qui ont motivé la conception entière de ce système (frais de scolarité incohérents, 38 liens morts) n'étaient pas des échecs d'architecture — l'ancienne architecture n'avait simplement aucune, et un chiffre corrigé à un endroit restait faux ailleurs faute de processus pour le vérifier partout. Le Knowledge System rend cette classe d'erreur structurellement plus difficile. Cette charte rend la classe d'erreur suivante — la connaissance qui vieillit sans que personne ne le remarque — organisationnellement impossible à ignorer.

**Elle est indispensable pour trois raisons** :
1. Un objet du Knowledge System (`Fact`, `Rule`, `Regulation`) n'a de valeur que tant qu'il reste vrai — sans discipline de revue, la fraîcheur se dégrade silencieusement, exactement comme avant.
2. Le système repose sur une séparation stricte entre ce qui est vérifié (`Fact`) et ce qui est une opinion assumée (`Judgment`) — cette séparation ne survit que si quelqu'un l'applique à chaque nouvelle contribution, humaine ou IA.
3. Le projet est aujourd'hui porté par une seule personne — la gouvernance doit fonctionner sans dépendre en permanence de sa disponibilité immédiate, sous peine de s'effondrer au premier empêchement.

**Risques qu'elle évite** : la dérive silencieuse de fraîcheur (un `Fact` jamais revérifié), la confusion entre fait et opinion dans une réponse publiée, la dette de gouvernance invisible (une file de revue qui grossit sans que personne ne le sache), la publication d'une connaissance non tracée, et la dépendance à une seule personne sans plan de continuité.

---

## 2. Principes

### Single Source of Truth
Une donnée n'existe qu'à un seul endroit habilité à la porter. Aucune exception, y compris pour une "petite" duplication temporaire jugée pratique — c'est exactement ce raisonnement qui a produit le bug des frais de scolarité. Toute violation détectée est traitée comme un défaut de gouvernance à corriger, pas comme un détail d'implémentation à tolérer.

### Fact First
Aucun chiffre, aucune règle, aucune affirmation vérifiable n'est écrite avant qu'un `Fact` (même à l'état `draft`) n'existe pour la porter. Écrire d'abord dans un article "pour aller vite" et créer le `Fact` après coup est une inversion de ce principe — elle n'est jamais acceptée, même sous pression de délai.

### Evidence Before Publication
Rien n'atteint l'état `Published` sans une `Source` d'un niveau d'autorité suffisant au regard de l'enjeu de la donnée. Ce principe s'applique aussi bien à un humain qu'à un assistant IA — l'origine de la contribution ne change rien à l'exigence de preuve.

### Progressive Migration
Aucun domaine n'est migré en une seule fois. Chaque lot de migration reste suffisamment petit pour être vérifié intégralement avant le suivant — c'est la discipline déjà appliquée dans le Master Implementation Plan (universités migrées par lots de 5 à 7, jamais les 14 d'un coup), et cette charte en fait une règle permanente, pas seulement une méthode de démarrage.

### No Big Bang
L'ancien mécanisme n'est jamais retiré au moment où le nouveau est activé — toujours après une période d'observation. Cette charte fixe cette période à **un minimum de deux semaines d'utilisation réelle sans anomalie détectée**, ou un seuil équivalent explicitement documenté si la nature du domaine l'exige (ex. un cycle de candidature universitaire complet pour une `Procedure` saisonnière).

### Explainability
Aucune `Recommendation` ni aucun résultat produit par la couche `Reasoning` n'est présenté sans sa chaîne d'explication complète. Un résultat qui ne peut pas être expliqué n'est pas publié, quelle que soit sa plausibilité apparente.

### Human Review
La revue humaine porte sur le **système** (les `Rule`, les méthodologies de `Judgment`, les `RecommendationModel`, l'interprétation d'une `Regulation`), pas sur chaque exécution individuelle — il serait impraticable et inutile qu'un humain valide chaque `Recommendation` produite une à une. Ce qui exige systématiquement un humain : la création ou la modification d'une règle, d'une méthodologie, ou d'une `Regulation`. Ce qui n'en a pas besoin : l'exécution normale d'un raisonnement déjà validé.

### Backward Compatibility
L'évolution du système est additive. Un objet, une relation ou une règle n'est jamais supprimée ni renommée silencieusement — elle est dépréciée, avec une fenêtre de transition documentée, jamais retirée du jour au lendemain.

---

## 3. Rôles

**Note de réalisme** : le projet est aujourd'hui porté par une seule personne, qui occupe simultanément les rôles de Founder, CTO, Content Editor et Reviewer. Cette charte définit ces rôles comme des **fonctions aux frontières d'autorité distinctes**, pas comme des postes — précisément pour que la gouvernance survive et se répartisse naturellement le jour où une deuxième personne rejoint le projet, sans qu'aucune règle n'ait à être réécrite. Porter plusieurs rôles à la fois n'autorise pas à fusionner leurs décisions : même une seule personne doit appliquer la séparation Content Editor / Reviewer comme deux passes distinctes et délibérées, pas une seule.

### Founder
- **Responsabilités** : fixe la vision et les priorités, arbitre les conflits entre principes, approuve les changements en cascade déclenchés par une nouvelle `Regulation` majeure, est seul habilité à modifier cette charte elle-même.
- **Limites** : n'est pas tenu de revoir personnellement chaque `Fact` — délègue via les rôles ci-dessous, mais reste responsable si la gouvernance se dégrade faute de délégation effective.
- **Décisions autorisées** : toutes les décisions irréversibles listées dans le Master Implementation Plan (§6), l'arrêt ou la reprise d'une Phase, la modification de cette charte.

### CTO
- **Responsabilités** : garantit la santé technique du système (score de maturité, intégrité du graphe de dépendances, exécution des phases du Master Plan), autorise le passage d'une phase à la suivante, décide si un bug découvert doit interrompre l'ordre de priorité prévu.
- **Limites** : ne peut jamais approuver seul un `Fact` ou une `Regulation` à fort enjeu sans preuve suffisante (ne peut pas outrepasser *Evidence Before Publication*).
- **Décisions autorisées** : ouverture/clôture de Phase et de Sprint, arbitrage technique entre deux options réversibles (Master Plan §6).

### Content Editor
- **Responsabilités** : rédige et maintient `Content`/`Question`, propose des `Fact` candidats avec leur `Source`, applique la discipline déjà établie (recherche concurrentielle avant rédaction, vérification de chaque chiffre avant publication).
- **Limites** : peut faire passer un objet à `Draft` ou le soumettre en `Review` — ne peut jamais s'auto-approuver sur un `Fact` à enjeu réglementaire, même s'il est aussi Reviewer ce jour-là (obligation de double passe, voir principe *Human Review*).
- **Décisions autorisées** : rédaction, proposition, retrait volontaire d'un brouillon.

### Reviewer
- **Responsabilités** : applique la grille de qualité (§7) avant `Approved`/`Published` — vérifie le niveau de la `Source`, le respect des invariants (aucune valeur en propre), la présence d'une explication complète.
- **Limites** : ne peut ni inventer de nouveaux critères de qualité ni s'affranchir de cette charte ; peut refuser et renvoyer en `Draft`, ne peut pas publier lui-même un objet qu'il vient de créer en tant que Content Editor le même jour sans une pause ou un second regard documenté.
- **Décisions autorisées** : approbation, refus, demande de complément de preuve.

### AI Assistant
- **Responsabilités** : recherche, rédige des `Fact`/`Source`/`Content`/`Rule` candidats, exécute des audits (exactement le travail déjà produit dans ce projet), signale les incohérences détectées.
- **Limites** — les plus strictes de tous les rôles, sciemment : **ne publie jamais seul un objet à enjeu réglementaire ou une `Regulation`**, ne peut pas décider unilatéralement de sauter une Phase, de retirer un ancien mécanisme, ou de prendre une décision listée comme irréversible (Master Plan §6). Toute proposition de l'AI Assistant reste à l'état `Draft`/`Review` tant qu'un humain (Content Editor ou Reviewer selon le cas) ne l'a pas explicitement fait progresser.
- **Décisions autorisées** : recherche, rédaction de brouillons, exécution d'audits et de vérifications de cohérence, signalement — jamais approbation finale d'un objet à fort enjeu, jamais modification de cette charte.

---

## 4. Workflow de validation

Ce workflow générique s'applique à tout objet de connaissance (`Fact`, `Rule`, `Regulation`, `Content`, `Question`, `Judgment`, `Capability`...), en complément — jamais en remplacement — des états spécifiques déjà définis dans chacune des 28 spécifications.

| Étape | Qui peut l'initier | Qui valide | Qui publie | Qui peut archiver |
|---|---|---|---|---|
| **Draft** | Content Editor, AI Assistant, CTO | — | — | — |
| **Review** | Content Editor (soumission) | Reviewer | — | — |
| **Approved** | — | Reviewer (grille §7 satisfaite) | — | — |
| **Published** | — | — | Reviewer ou CTO (jamais l'auteur seul sur un enjeu réglementaire) | — |
| **Deprecated** | CTO, Founder, ou déclenché automatiquement par une `Regulation` remplacée | CTO | — | — |
| **Archived** | CTO | — | — | CTO ou Founder |

**Précision de correspondance avec les 28 spécifications** : `Approved` et `Published` peuvent être un seul et même instant pour un objet à faible enjeu (ex. un `Cluster`), mais restent deux étapes distinctes et documentées pour tout objet à fort enjeu (un `Fact` réglementaire, une `Regulation`, une `Capability` exposée à des consommateurs externes) — c'est la charte, pas les spécifications, qui impose cette distinction opérationnelle.

---

## 5. Revue humaine

### Revue hebdomadaire (léger, ~30 minutes)
Vérifie : la file `needs_review` a-t-elle grossi de façon anormale ; y a-t-il un nouveau `Signal` à trier ; le backlog de la Phase 4 (migration de contenu) avance-t-il à un rythme non nul, même faible.

### Revue mensuelle (approfondi)
Vérifie : fraîcheur des `Fact` (aucun `Fact` à enjeu réglementaire non revérifié au-delà du SLA de son tier, §6) ; cohérence `Rule`/`Regulation` ; dérive éventuelle d'un `RecommendationModel` révélée par les `Outcome` accumulés ; pourcentage de contenu migré ; absence de relation orpheline dans le registre centralisé.

### Revue trimestrielle (gouvernance complète)
Vérifie : recalcul du score de maturité (comparaison avec la Gap Analysis de référence et la revue précédente) ; contrôle de type Readiness Review avant toute nouvelle Phase envisagée ; pertinence de cette charte elle-même ; tableau de bord complet des métriques (§10).

### Une revue est **obligatoire**, hors cadence normale, dans les cas suivants
- Avant l'ouverture de toute nouvelle Phase du Master Implementation Plan.
- Dès qu'une `Regulation` change (déclenchement en cascade décrit dans le Blueprint, flux B).
- Avant toute exposition d'une nouvelle `Capability` à un consommateur externe.
- Après tout incident, mineur ou majeur (§9).
- Dès que le volume de `Signal` ouverts dépasse un seuil jugé anormal par le CTO.

### Si une revue est manquée
- **Hebdomadaire manquée** : risque faible — rattrapée à la suivante, aucune action corrective requise.
- **Mensuelle manquée** : déclenche un état de **dette de gouvernance** — aucune approbation de changement en cascade lié à une `Regulation`, ni aucune nouvelle `Capability`, n'est autorisée tant que la revue n'est pas rattrapée.
- **Trimestrielle manquée** : bloque explicitement l'ouverture de toute nouvelle Phase du Master Plan jusqu'à exécution de la revue — c'est la seule sanction procédurale ferme de toute cette charte, précisément parce que c'est le point de défaillance identifié par la Readiness Review.

---

## 6. Gestion des Sources

**Une `Source` devient obsolète** quand son URL ne résout plus, quand son contenu a visiblement changé sans qu'une nouvelle capture n'ait été faite, ou quand l'organisme émetteur a changé de plateforme.

**Un `Fact` passe en `needs_review`** dans quatre cas : sa `Source` devient obsolète ; la `Regulation` dont il dérive est remplacée ; un `Signal` répété le désigne comme contesté ; son ancienneté dépasse le SLA de son tier (ci-dessous) sans revérification.

**Une `Regulation` doit être revue** dès qu'un texte susceptible de la remplacer ou de la modifier est identifié — la revue vérifie si elle doit passer `superseded`, et déclenche automatiquement la mise en revue de tout ce qui en dépend (Blueprint, flux B).

### SLA de mise à jour par niveau de criticité

| Tier | Nature | Revérification périodique | Délai après changement connu |
|---|---|---|---|
| Tier 1 | Chiffres/règles à portée légale directe (frais de scolarité, plafonds horaires, montants réglementaires) | Tous les 6 mois même sans alerte | 7 jours |
| Tier 2 | Procédures/informations officielles moins volatiles (démarches CROUS, transport) | Tous les 12 mois | 30 jours |
| Tier 3 | Méthodologies éditoriales (`Judgment`) | Tous les 6 mois, ou dès accumulation de `Signal`/`Outcome` significatifs | 30 jours après le seuil de contestation atteint |

---

## 7. Qualité — critères minimaux avant publication

Aucun objet ne franchit `Approved` sans satisfaire, sans exception, les six critères suivants :

1. **Fact vérifié** — la valeur a été confirmée sur la `Source`, pas recopiée d'une version antérieure sans nouvelle vérification.
2. **Source valide** — présente, d'un tier suffisant pour l'enjeu de la donnée, non `stale`.
3. **Explication disponible** — pour tout objet issu du raisonnement (`Recommendation`, `Derivation`), la chaîne complète est présente et lisible.
4. **Traçabilité complète** — aucune relation orpheline, aucune référence vers un objet inexistant.
5. **Vérifications de non-régression effectuées** — le résultat a été comparé à l'attendu (manuellement ou par un contrôle systématique) avant bascule, conformément aux critères de validation déjà définis phase par phase dans le Master Implementation Plan.
6. **Documentation à jour** — tout changement de règle ou de méthodologie s'accompagne d'une mise à jour de sa description, jamais d'un changement silencieux de comportement.

---

## 8. Gestion des changements — procédures officielles

**Nouvelle université** : Content Editor identifie et documente les `Fact` de base avec leur `Source` avant toute création de contenu narratif → Reviewer valide les `Fact` → l'entité passe `Published` seulement une fois ses chiffres essentiels sourcés (jamais publiée "à compléter plus tard" sur ses données chiffrées).

**Nouveau pays** : Founder ou CTO valide la décision éditoriale de couverture → Content Editor documente les spécificités réglementaires (statut CEF, accords bilatéraux) comme `Regulation`/`Rule` avant tout contenu narratif → Reviewer valide.

**Changement réglementaire** : toute personne (y compris AI Assistant) peut signaler un changement potentiel → CTO ou Founder confirme et crée/actualise la `Regulation` → déclenchement automatique de la revue en cascade → chaque `Fact`/`Rule` impacté suit individuellement le workflow standard (§4) avant republication.

**Suppression d'un `Fact`** : n'existe pas au sens strict — un `Fact` erroné passe `retracted` (jamais supprimé), un `Fact` obsolète passe `superseded`. Seul le CTO ou le Founder peut initier ce changement d'état, avec justification écrite obligatoire.

**Modification d'une `Rule`** : exige systématiquement une revue humaine (jamais déléguée à l'AI Assistant seul), une nouvelle version créée (l'ancienne devient `superseded`), et une vérification qu'aucune contradiction n'apparaît avec une autre `Rule` déjà active sur le même périmètre.

**Évolution d'une `Recommendation`** : une `Recommendation` déjà produite n'est jamais modifiée rétroactivement (invariant des spécifications) — seule la révision du `RecommendationModel` sous-jacent peut faire évoluer les recommandations *futures*, et cette révision suit le même processus que celui d'une `Rule` (revue humaine obligatoire, jamais automatique même sur signal fort d'`Outcome`).

---

## 9. Gestion des incidents

**Incident mineur** : un `Fact` erroné isolé, une `Question` mal formulée, un lien cassé localisé — impact limité à une page ou une entité. Corrigé dans le cycle normal (§4), signalé à la revue hebdomadaire suivante, aucune communication particulière requise au-delà de la mise à jour habituelle de fraîcheur (`updatedDate`).

**Incident majeur** : une duplication systémique de vérité (comme le précédent des frais de scolarité), une `Recommendation` ayant induit un utilisateur en erreur de façon significative, une `Capability` exposée à un agent externe ayant produit une réponse incorrecte et non sourcée, ou une dette de gouvernance non traitée ayant laissé une donnée fausse en production pendant une durée dépassant son SLA (§6).

**Rollback** : autorité exclusive du CTO ou du Founder — retour immédiat à la dernière version connue comme correcte de l'objet concerné, jamais une correction "à la volée" sans passer par le workflow standard une fois la situation stabilisée.

**Communication** : un incident mineur ne fait l'objet d'aucune communication externe. Un incident majeur touchant du contenu déjà publié fait l'objet d'une correction visible (mise à jour de `updatedDate`, mention explicite si l'ampleur le justifie) — la transparence sur les erreurs corrigées est cohérente avec la mission de confiance du produit, jamais dissimulée.

**Revue post-incident** : obligatoire pour tout incident majeur, intégrée à la revue trimestrielle suivante au plus tard (ou avant, si le CTO le juge urgent) — documente la cause racine, pourquoi la gouvernance ne l'a pas empêché ou détecté plus tôt, et la mesure corrective apportée à cette charte elle-même si la cause racine est un manque de la gouvernance et non un simple aléa.

---

## 10. Métriques — KPI officiels

| Métrique | Définition | Lecture |
|---|---|---|
| Couverture des Facts | % des chiffres/affirmations vérifiables du site effectivement portés par un `Fact` plutôt qu'écrits en dur | Doit croître phase après phase, jamais régresser |
| Couverture des Sources | % des `Fact` `Published` disposant d'une `Source` de tier suffisant à leur enjeu | Doit tendre vers 100 % pour les Tier 1 |
| Contenu migré | % des `Content` existants citant des `Fact` plutôt qu'embarquant des valeurs (Phase 4) | Suivi en flux continu, cible non bloquante mais jamais à l'arrêt |
| Dette technique | Nombre d'écarts connus et non traités recensés dans les audits (ex. duplications non résolues) | Doit diminuer ou rester stable, jamais croître sans décision explicite |
| Backlog | Nombre d'objets en `Draft`/`Review` en attente au-delà d'un délai raisonnable | Suivi hebdomadaire, alerte si croissance continue |
| Temps moyen de mise à jour | Délai entre la détection d'un changement (`Signal`, `Regulation`) et le passage effectif en `Published` de la correction | Doit respecter le SLA du tier concerné (§6) |
| Nombre de Facts obsolètes | `Fact` `needs_review` ou dépassant leur SLA de revérification sans action | Cible zéro pour le Tier 1 en continu |
| Nombre de Rules non revues | `Rule` dont la `Regulation` d'origine a changé sans que la règle n'ait encore été réexaminée | Cible zéro, tolérance temporaire uniquement pendant le délai de SLA |

Ces métriques constituent le tableau de bord de la revue trimestrielle (§5) et la base de comparaison avec le score de maturité de la Gap Analysis (17 % au point zéro).

---

## 11. Cadence des réunions

**Après chaque Sprint** — objectif : vérifier que les critères de fin du sprint (déjà définis dans le Master Implementation Plan) sont réellement atteints, mettre à jour les métriques du §10, décider consciemment d'enchaîner sur le sprint suivant plutôt que de l'assumer par défaut.

**Fin de Phase** — objectif : revérifier les critères de validation et de fin de la Phase concernée, relancer la portion pertinente de la Gap Analysis, produire une décision explicite de type Readiness Review ("prêt pour la Phase suivante" ou non) plutôt que d'enchaîner automatiquement — c'est la condition n°1 posée par la Readiness Review, rendue ici obligatoire et non optionnelle.

**Revue trimestrielle** — objectif : gouvernance complète telle que définie au §5, incluant la revue post-incident en attente s'il y en a une.

**Audit annuel** — objectif : revalider la pertinence de l'ensemble des documents officiels (Vision, Architecture, Blueprint, Spécifications, cette charte), comparer la tendance de maturité sur douze mois, décider si un principe ou un rôle de cette charte doit évoluer (autorité du Founder uniquement, §3).

**Précision pour une équipe d'une personne** : ces "réunions" sont aujourd'hui des points de contrôle documentés que le Founder s'impose à lui-même, pas des réunions au sens littéral — leur valeur vient de leur formalisation et de leur trace écrite, pas du nombre de participants. Le jour où une deuxième personne rejoint le projet, cette cadence n'a pas besoin d'être créée : elle existe déjà et se répartit naturellement entre les rôles déjà définis au §3.

---

## 12. Évolution du système à 5–10 ans

Ce que cette charte protège en permanence, quelle que soit l'évolution du système : la séparation des six couches, les invariants de chaque objet déjà spécifiés (aucune valeur en propre, aucune recommandation sans explication, aucun fait sans preuve), et la liste des décisions irréversibles du Master Implementation Plan (§6 de ce document). Aucune évolution future, aussi utile paraisse-t-elle, ne peut justifier de les assouplir sans passer par une modification explicite de cette charte, réservée au Founder.

Ce qui est conçu pour évoluer librement, sans jamais remettre en cause les fondations : la répartition des rôles (§3) s'étend naturellement à une équipe plus grande sans réécriture — chaque nouveau rôle s'ajoute avec des limites aussi strictes que celles déjà définies, jamais plus permissives par défaut. Les seuils de SLA (§6) et les cibles de métriques (§10) sont révisables à la revue trimestrielle, sans modification de la charte elle-même. La cadence de revue (§5) peut se resserrer si le volume de connaissance croît, ou se répartir entre plusieurs Reviewers, sans changer la logique qui la sous-tend. De nouveaux types d'incidents (§9) peuvent être définis à mesure que de nouvelles capacités (agents IA tiers, application mobile) exposent le système à de nouvelles formes de risque, en s'ajoutant à la liste existante plutôt qu'en la remplaçant.

Le test de toute évolution future de cette charte est simple : une modification qui rend une vérification plus facile à contourner, une preuve plus facile à omettre, ou une revue plus facile à sauter, n'est pas une évolution — c'est une régression de gouvernance, et elle doit être refusée quel que soit l'argument de rapidité qui la motive.

---

## Note de clôture

Cette charte ne prétend pas rendre la gouvernance du Knowledge System parfaite dès le premier jour — elle la rend **observable et corrigible**, ce qui est la seule propriété qui compte réellement sur dix ans. Une gouvernance qu'on ne peut pas mesurer ne peut pas s'améliorer ; celle-ci se mesure explicitement à chaque revue (§5), à chaque métrique (§10), à chaque audit annuel (§11), et prévoit sa propre correction quand elle échoue à se faire respecter elle-même (§9, revue post-incident appliquée à la gouvernance).
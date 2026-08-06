# READINESS REVIEW — DALILI KNOWLEDGE SYSTEM

**Rôle tenu pour ce document** : CTO indépendant, mandaté pour autoriser ou refuser le démarrage du développement — pas l'auteur des documents examinés. Ce document challenge le travail produit, il ne le défend pas.

**Périmètre examiné** : Vision, Architecture V1, Architecture V2, `BLUEPRINT.md`, les 28 spécifications d'objets, `GAP-ANALYSIS.md`, `MASTER-IMPLEMENTATION-PLAN.md`, et l'état réel du dépôt tel qu'audité (`CURRENT-STATE-AUDIT.md`).

**Ce document ne fait pas** : il ne propose aucune nouvelle architecture, ne code rien, ne remet pas en cause les décisions déjà validées. Il évalue si l'ensemble est suffisamment solide pour commencer à construire.

---

## 1–12. Analyse point par point

### 1. Cohérence de la Vision

**État** : cohérente en interne — la hiérarchie de priorités (valeur utilisateur > confiance > clarté > conversion > SEO > AI Search > performance) se retrouve appliquée sans contradiction dans tous les documents suivants (choix d'architecture, ordre du plan, refus de fonctionnalités). Point d'attention honnête : ce document a été rédigé en synthèse par l'IA à partir d'indices déjà présents dans le projet (CLAUDE.md, historique de décisions), puis validé par acceptation — pas débattu point par point avec le fondateur dans un aller-retour contradictoire.

**Niveau de risque** : Faible.

**Impact si problème avéré** : Élevé — toute la hiérarchie d'arbitrage du Master Implementation Plan en dépend.

**Recommandation** : ne bloque pas le démarrage. Une relecture critique par le fondateur avant la Phase 0, sans en attendre une réécriture, suffit.

---

### 2. Cohérence de l'Architecture (V1 + V2)

**État** : le modèle à six couches est acyclique par construction (aucune couche ne dépend d'une couche postérieure), et chaque décision structurante répond à un problème réel déjà vérifié dans le code (frais incohérents, liens morts) plutôt qu'à une préoccupation théorique. La frontière `Knowledge`/`Reasoning` pour `Judgment` reste la plus fragile sur le papier — l'audit du dépôt a déjà montré que le contenu réel (`avis` dans `lib/cities.ts`) mélange aujourd'hui fait et opinion dans un même paragraphe, ce que l'architecture sépare en théorie mais n'a jamais eu à trancher sur un cas réel.

**Niveau de risque** : Faible à Moyen.

**Impact** : Moyen — un ajustement de frontière en cours de route reste absorbable, ce n'est pas une faille structurelle.

**Recommandation** : ne bloque pas le démarrage. Traiter le premier cas réel de séparation Fact/Judgment (Phase 1) comme un test de l'architecture elle-même, pas seulement comme de la saisie de données.

---

### 3. Cohérence du Blueprint

**État** : les dix sections s'enchaînent sans contradiction, et le Blueprint assume explicitement neuf questions ouvertes plutôt que de les dissimuler (gouvernance des faits contestés, pondération ajustable en temps réel, granularité du Knowledge Pack, authentification des Capability...). Aucune de ces neuf questions n'est résolue à ce jour, ni dans les spécifications, ni dans le plan.

**Niveau de risque** : Moyen.

**Impact** : Moyen — la majorité de ces questions ne deviennent bloquantes qu'à partir de la Phase 8-10 (Distribution), pas dès la Phase 0.

**Recommandation** : ne bloque pas le démarrage des phases précoces. Exiger que la question de l'authentification/limitation d'usage des `Capability` soit tranchée avant l'ouverture de la Phase 10, pas pendant.

---

### 4. Qualité des spécifications (28 objets)

**État** : élevée sur la forme — plan fixe en 12 sections respecté sans exception, invariants cohérents et croisés correctement d'un objet à l'autre (ex. `Fact.SOURCED_BY` et `Source.SOURCES` se répondent). Faiblesse réelle : ces spécifications n'ont jamais été confrontées à une seule migration réelle de bout en bout — elles sont rigoureuses sur le papier, non éprouvées sur un cas concret et imparfait.

**Niveau de risque** : Moyen.

**Impact** : Moyen — des ajustements mineurs de spécification pendant la Phase 1 sont probables et normaux, pas un signe d'échec de la conception.

**Recommandation** : ne bloque pas le démarrage. Documenter explicitement tout écart entre une spécification et un cas réel rencontré en Phase 1, plutôt que de forcer la donnée à rentrer dans un gabarit qui ne lui correspond pas.

---

### 5. Qualité du Master Implementation Plan

**État** : respecte rigoureusement ses propres contraintes (pas de réécriture, pas de big bang, toujours déployable), séquence correctement les deux quick wins en premier, identifie honnêtement les pistes parallélisables. Faiblesse : aucune date, aucun engagement de calendrier (assumé et documenté comme tel), donc aucune garantie que le rythme réel de production suivra les 32 sprints estimés — et aucun point de contrôle formel n'est prévu après la Phase 2 (la plus difficile, "Élevé" en difficulté sur trois de ses cinq sprints) avant de poursuivre.

**Niveau de risque** : Moyen.

**Impact** : Moyen — un dérapage de calendrier dégrade la vitesse d'exécution, pas la sécurité de la migration elle-même (le principe de coexistence protège déjà contre ça).

**Recommandation** : ne bloque pas le démarrage. Ajouter un point de contrôle explicite après la Phase 2 : décision consciente de continuer, ralentir, ou geler, plutôt qu'un enchaînement automatique vers la Phase 3.

---

### 6. Résultat de la Gap Analysis

**État** : 0/28 objets pleinement conformes, maturité globale à 17 %. Ce chiffre doit être interprété correctement : il ne mesure pas la préparation à démarrer, il mesure l'état actuel du système cible — qui est, par construction, à son minimum puisque rien n'a encore été construit. Confondre "maturité du système à 17 %" et "readiness du projet à 17 %" serait une erreur d'interprétation à ne pas commettre.

**Niveau de risque** : Faible (en tant que signal de readiness) — la Gap Analysis a rempli son rôle, qui était de mesurer honnêtement, pas de rassurer.

**Impact** : Faible sur la décision de démarrage, Élevé comme baseline de référence pour mesurer le progrès futur.

**Recommandation** : conserver ce chiffre comme point zéro officiel, à comparer après chaque phase majeure.

---

### 7. État actuel du repository

**État** : site en production fonctionnel, deux bugs vérifiés et actifs (frais de scolarité incohérents sur 9/14 universités, 38 liens morts), aucune CI/CD, aucun test automatisé actif (Playwright installé mais orphelin), déploiement direct sur push vers `main`. C'est le point le plus concret et le moins abstrait de toute cette revue.

**Niveau de risque** : Moyen — pas à cause du Knowledge System, mais parce que le filet de sécurité opérationnel (tests, CI) qui rendrait une bascule "toujours réversible" réellement automatique et fiable n'existe pas ; la réversibilité promise par le plan repose aujourd'hui sur une vérification manuelle, pas sur un outillage.

**Impact** : Moyen — gérable à l'échelle de la Phase 1-2 (périmètre restreint, 14 universités, vérifiable à la main), plus risqué si cette absence d'outillage n'est jamais comblée pour les phases ultérieures à plus large surface (Phase 4, 65+ articles).

**Recommandation** : ne bloque pas le démarrage de la Phase 0-2. Poser, avant la Phase 4 (migration de contenu en masse), la question explicite de savoir si un minimum de vérification automatisée doit être introduit — sans que ce soit un préalable au tout début.

---

### 8. Risques techniques

**État** : correctement identifiés et déjà documentés dans le Master Plan (double source de vérité pendant la transition, dégradation de performance si mal placée, exposition prématurée d'agents IA). Rien de nouveau n'apparaît à l'examen qui ne soit déjà nommé quelque part dans les documents existants — c'est un signe de rigueur, pas une absence de risque.

**Niveau de risque** : Moyen, mais déjà couvert par des mitigations explicites dans le plan (coexistence, bascule par université, retrait différé).

**Impact** : Variable selon la phase, jamais catastrophique par construction (aucune phase ne supprime l'ancien mécanisme avant validation).

**Recommandation** : aucune action supplémentaire requise avant démarrage.

---

### 9. Risques métier

**État** : le risque le plus répété dans l'ensemble du corpus documentaire, depuis la première analyse critique jusqu'au Master Plan — la vélocité de production de contenu, qui reste la priorité business actuelle explicite du projet, pourrait être compromise par l'investissement en ingénierie. Aucune échéance business n'impose ce projet (ce n'est pas un correctif d'urgence, à l'exception des deux bugs déjà connus) — la décision de le lancer maintenant est un choix stratégique, pas une nécessité immédiate.

**Niveau de risque** : Moyen.

**Impact** : Élevé si mal géré — c'est le risque qui pourrait le plus concrètement faire échouer le projet, pas un risque technique.

**Recommandation** : ne bloque pas le démarrage des Phases 0-2 (effort limité, forte valeur, bugs déjà publics). Traiter la Phase 4 comme un flux continu non prioritaire est déjà la bonne mitigation — à faire respecter strictement en pratique, pas seulement sur le papier.

---

### 10. Risques de migration

**État** : déjà exhaustivement couverts dans le Master Plan et le Blueprint (fatigue de migration, gouvernance négligée, double source de vérité). Rien de nouveau identifié par cette revue au-delà de ce qui est déjà écrit.

**Niveau de risque** : Moyen, mitigations déjà conçues dans le plan lui-même.

**Impact** : Moyen.

**Recommandation** : aucune action supplémentaire requise avant démarrage — exécuter le plan tel que conçu.

---

### 11. Zones encore ambiguës

**État** : au-delà des neuf questions ouvertes déjà listées dans le Blueprint, cette revue identifie deux ambiguïtés supplémentaires non nommées jusqu'ici : (a) le mécanisme concret de bascule "coexistence puis retrait" repose sur un principe de conception, jamais sur un mécanisme opérationnel vérifié (pas de feature flag ni d'environnement de test confirmé dans le dépôt) ; (b) la gouvernance repose entièrement sur "une revue humaine", systématiquement invoquée mais jamais assortie d'une cadence, d'un délai, ni d'un plan de continuité si le fondateur est indisponible — un point unique de défaillance non documenté comme tel jusqu'à présent.

**Niveau de risque** : Moyen.

**Impact** : Faible à court terme (Phase 0-2), Moyen à long terme (à partir du moment où la file `needs_review`/`Signal` commence à exister réellement, Phase 3 et au-delà).

**Recommandation** : ne bloque pas le démarrage. Définir une cadence minimale de revue (même approximative, ex. "une fois par mois") avant la fin de la Phase 3, pas avant la Phase 0.

---

### 12. Décisions qui devront être prises pendant le développement

**État** — liste consolidée, aucune de ces décisions n'est bloquante pour démarrer, toutes sont déjà anticipées comme réversibles ou situées plus loin dans le plan :
- Poids par défaut du premier `RecommendationModel`.
- Granularité initiale des `Persona`.
- Ordre de priorisation exact des articles migrés en Phase 4.
- Seuil de confiance minimal avant qu'une `Recommendation` refuse de trancher.
- Sort exact des 38 écoles référencées sans fiche (créer des fiches minimales vs. lien externe documenté).
- Mécanisme d'authentification/limitation d'usage avant toute exposition de `Capability` en Phase 10.
- Granularité d'un `Knowledge Pack` (par pays, par thème, combinaison).
- Cadence formelle de revue de gouvernance (point 11).

**Niveau de risque** : Faible individuellement, Moyen cumulé si plusieurs restent non tranchées simultanément en fin de plan.

**Impact** : Faible à court terme.

**Recommandation** : traiter cette liste comme un registre de décisions à tenir à jour phase par phase, pas comme un obstacle au démarrage.

---

## Notes sur 10

| Dimension | Note | Justification courte |
|---|---|---|
| Architecture | 8/10 | Rigoureuse, acyclique, ancrée dans des bugs réels — non encore éprouvée sur un cas réel complet |
| Documentation | 9/10 | Exceptionnellement complète et cohérente pour un projet solo — manque un index unique reliant les sept documents entre eux |
| Migration | 7/10 | Plan incrémental solide et réversible par conception — filet de sécurité opérationnel (tests/CI) absent en pratique |
| Maintenabilité | 7/10 | Objectif central du système, bien conçu sur le papier — dépend aujourd'hui d'une discipline manuelle plus que d'un outillage |
| Scalabilité | 8/10 | Pensée pour 10 ans dès la conception (IDs stables, évolution additive, multilingue prêt) — non testée à l'échelle |
| Gouvernance | 5/10 | Le point le plus faible — "revue humaine" répété partout, jamais formalisé en cadence, ni en plan de continuité |

---

## Conclusion

# READY FOR IMPLEMENTATION

**Justification** : aucun des risques identifiés dans cette revue n'est de nature à empêcher un démarrage maîtrisé — chacun est soit déjà mitigé par construction (coexistence, bascule progressive, rollback par université), soit situé suffisamment loin dans le plan pour être tranché en temps voulu (authentification en Phase 10, pas en Phase 0), soit d'un impact limité au périmètre restreint et bien compris des premières phases (14 universités, 42 valeurs, domaine déjà vérifié). Le point le plus faible de toute la revue — la gouvernance (5/10) — n'affecte pas la capacité à démarrer une Phase 0 d'une semaine sur un domaine sans ambiguïté ; il devra être renforcé avant que le système ne gère un volume réel de faits contestés, pas avant la première ligne de travail.

Cette autorisation est **scopée à la Phase 0 et à la Phase 1-2**, pas à l'ensemble des douze phases sans contrôle. Trois conditions accompagnent ce feu vert, à vérifier avant de poursuivre au-delà de la Phase 2 :

1. Le point de contrôle explicite en fin de Phase 2 (déjà recommandé au point 5) est réellement tenu, pas sauté.
2. Une cadence minimale de gouvernance est définie avant la fin de la Phase 3 (point 11).
3. La discipline "Phase 4 = flux continu, jamais prioritaire sur la production de contenu" est respectée dans les faits, pas seulement sur le papier (point 9) — c'est le seul risque de cette revue qui pourrait réellement compromettre le projet s'il n'est pas tenu.

Le projet est prêt à passer de la conception à l'exécution.

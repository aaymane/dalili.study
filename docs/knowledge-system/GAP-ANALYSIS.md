# GAP ANALYSIS — DALILI KNOWLEDGE SYSTEM vs Repository actuel

**Source** : `BLUEPRINT.md`, 28 spécifications d'objets, `CURRENT-STATE-AUDIT.md`. Document de constat uniquement — aucun développement, aucune recommandation nouvelle au-delà du score final.

---

## 1. Objets métier — statut

| Objet | Statut | Justification |
|---|---|---|
| Fact | N'existe pas | Valeurs numériques en dur, aucune Source liée, aucun versionnement |
| Source | Partiel | Champ `source` présent sur `/faq/*` et `press-kit.md`, absent partout ailleurs |
| Regulation | N'existe pas | Mentionnée en texte libre uniquement, jamais comme objet |
| Country | Partiel | Implicite via `/pays/*` et `cluster`, aucune entité propre |
| City | Partiel | `lib/cities.ts` structuré mais viole l'invariant "aucun chiffre en propre" |
| University | Partiel | `lib/universities.ts` idem, cause du bug de frais incohérents |
| Organization | N'existe pas | CROUS/préfecture/CAF mentionnés en texte, jamais typés |
| Program | N'existe pas | `popularPrograms: string[]` en texte libre, non structuré |
| Procedure | Partiel | `lib/calendrier-data.ts` existe mais statique, non générique/instanciable |
| Document | N'existe pas | Pièces justificatives mentionnées en texte uniquement |
| Content | Partiel | 68 articles + 23 fiches matures, mais ne citent pas de Fact |
| Question | Partiel | Fort sur `/faq/*` (sourcé), fragile sur le blog (regex) |
| Persona | N'existe pas | Implicite dans `cluster` par pays, jamais objectivé |
| Judgment | Partiel | `pros`/`cons`/`avis`/scores existent, aucune méthodologie séparée |
| Cluster | Partiel | `CLUSTER_MAP` fonctionnel, pas encore un objet relationnel |
| Rule | N'existe pas | Logique conditionnelle dispersée en texte et en code |
| Derivation | N'existe pas | Calcul mêlé au code de présentation (PDF, composants) |
| RecommendationModel | Partiel | `lib/comparer-scores.ts`, poids figés, non tracé |
| Recommendation | N'existe pas | Résultat affiché, jamais conservé ni expliqué |
| LearnerProfile | N'existe pas | Chaque outil réinvente sa propre représentation du profil |
| Task | N'existe pas | — |
| Timeline | N'existe pas | Le Calendrier est générique par pays, non personnalisé |
| Milestone | N'existe pas | — |
| Presentation | Partiel | `UNI_SEO`/`CITY_SEO` + JSON-LD manuels, dupliqués 28 fois |
| Capability | Partiel | 7 Route Handlers, contrat implicite non déclaré/versionné |
| Knowledge Pack | N'existe pas | — |
| Outcome | N'existe pas | Aucun mécanisme formel de capture |
| Signal | Partiel | GSC consulté manuellement, aucun objet système |

**Total : 0/28 conformes · 13/28 partiels · 15/28 absents.**

---

## 2. Fonctionnalités — conformité

| Fonctionnalité | Statut | Justification |
|---|---|---|
| Comparateur | Partiellement conforme | Existe, mais poids figés, pas de trace d'explication |
| Simulateur | Partiellement conforme | Existe, calcul non isolé en Derivation, pas de LearnerProfile partagé |
| Checklist | Partiellement conforme | Existe, mais statique — pas d'instanciation Procedure→Timeline |
| Timeline | Absente | Aucune personnalisation réelle du parcours |
| Assistant IA conversationnel | Absente | — |
| Recherche intelligente | Absente | Filtre texte côté client uniquement, pas d'interrogation Truth/Knowledge |
| API publique | Absente | Routes internes non documentées, non versionnées |
| Mobile | Absente | Application non lancée |
| Dashboard interne | Partiellement conforme | `/admin` existe, basique, sans Outcome/Signal/fraîcheur |
| Agents IA tiers | Absente | Aucune Capability ni Knowledge Pack exposés |
| WebMCP | Absente | — |

---

## 3. Couches — maturité, manques, priorité, complexité

| Couche | Maturité | Ce qui manque | Priorité | Complexité |
|---|---|---|---|---|
| Truth | 5 % | Fact, Source généralisée, Regulation | Critique | Moyenne |
| Knowledge | 35 % | Conformité aux invariants (chiffres en propre), Organization, Program, Document, Persona | Critique | Élevée |
| Reasoning | 15 % | Rule, Derivation, traçabilité de RecommendationModel | Moyenne | Élevée |
| Planning | 5 % | LearnerProfile, Task, Timeline, Milestone — quasi tout | Moyenne-basse | Élevée |
| Experience | 30 % | Génération automatique (Presentation), Question de première classe | Moyenne | Faible-Moyenne |
| Distribution | 10 % | Capability formalisée, Knowledge Pack, API publique | Basse (pour l'instant) | Moyenne |

---

## 4. Score de maturité global

```
Truth        5 %
Knowledge   35 %
Reasoning   15 %
Planning     5 %
Experience  30 %
Distribution 10 %
──────────────────
Moyenne     17 %
```

**Score global : 17 % — Niveau 1/5 (Embryonnaire).**

Aucune couche n'atteint la conformité. La couche `Knowledge` est la plus avancée (données déjà structurées, non conformes) ; `Truth` et `Planning` sont les moins avancées (quasi inexistantes comme objets, malgré des données ou des besoins déjà identifiés).

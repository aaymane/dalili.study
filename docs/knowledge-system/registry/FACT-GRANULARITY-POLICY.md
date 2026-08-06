# FACT GRANULARITY POLICY

**Statut** : politique officielle — référence obligatoire avant la création de tout `Fact`, présent ou futur.

**Ne remplace pas** : `FACT-TEMPLATE.md` (structure de saisie d'un `Fact`) ni les spécifications `docs/knowledge-system/objects/01-Fact.md` / `02-Source.md` (contrat de l'objet). Cette policy répond à une seule question, en amont de tout le reste : **quel est le sujet ?**

**Origine** : distillée de l'analyse de granularité menée sur l'ensemble des domaines factuels déjà présents dans Dalili (Sprint 1, Phase 0, Tâche 1).

---

## 1. Principe fondateur

Le sujet d'un `Fact` n'est jamais choisi par convenance, par habitude du code existant, ou par défaut. Il est déterminé par une seule question : **à quel niveau cette information varie-t-elle réellement**, indépendamment de l'endroit où le code actuel la range aujourd'hui.

**Pourquoi cette règle existe** : le bug fondateur du projet (frais de scolarité incohérents entre universités) n'est pas né d'une faute de frappe isolée — il est né d'une information rangée à un niveau de granularité qui ne correspondait pas à sa vraie nature, jamais interrogé avant d'être codée. Cette policy existe pour qu'aucun futur `Fact` ne reproduise cette erreur, quel que soit le domaine.

**Corollaire** : une décision de granularité fondée uniquement sur l'**absence** de preuve du contraire (et non sur une confirmation positive) doit être marquée **provisoire** jusqu'à vérification par une `Source` de tier suffisant (voir §6).

---

## 2. Sujets autorisés

Six types d'entité, et six seulement, peuvent porter un `Fact` comme sujet :

| Sujet | Ce qu'il représente |
|---|---|
| `Country` (rôle France) | Une règle ou une valeur valable sur tout le territoire, sans exception |
| `Country` (rôle Origine) | Une règle ou une valeur qui varie selon le pays d'origine de l'étudiant — **équivaut à la nationalité**, ce n'est pas un septième type séparé (`docs/knowledge-system/objects/04-Country.md` §10) |
| `City` | Une valeur qui varie selon la ville |
| `University` | Une valeur qui varie selon l'établissement |
| `Program` | Une valeur qui varie selon la formation suivie, au sein d'un même établissement |
| `Organization` | Une règle propre à une organisation nommée (une banque, un CROUS, un consulat précis), indépendante du territoire qu'elle couvre |

Aucun autre type de sujet n'est autorisé. En particulier : pas d'objet "Nationalité" séparé de `Country`, pas d'objet "Consulat" séparé d'`Organization`.

---

## 3. Règle générale

- Identique pour toute la France, sans exception connue → **`Country` (France)**
- Varie selon le pays d'origine de l'étudiant → **`Country` (Origine)**
- Varie selon la ville → **`City`**
- Varie selon l'établissement → **`University`**
- Varie selon la formation suivie → **`Program`**
- Propre à une organisation nommée, indépendamment du territoire → **`Organization`**

Cette règle s'applique à **tout futur `Fact`**, sur n'importe quel domaine — pas seulement au domaine pilote des frais de scolarité.

---

## 4. Arbre de décision officiel — "Comment choisir le sujet d'un Fact"

```
1. Est-ce une règle propre à une organisation nommée (une banque précise,
   un CROUS précis, un consulat précis), indépendante du territoire qu'elle couvre ?
   → Oui → Organization
   → Non ↓

2. Varie-t-elle selon la formation suivie, au sein d'un même établissement ?
   → Oui → Program
   → Non ↓

3. Varie-t-elle selon l'université / l'établissement ?
   → Oui → University
   → Non ↓

4. Varie-t-elle selon la ville ?
   → Oui → City
   → Non ↓

5. Varie-t-elle selon le pays d'origine de l'étudiant ?
   → Oui → Country (Origine)
   → Non ↓

6. Est-elle identique pour toute la France ?
   → Oui → Country (France)
   → Non → Revoir le modèle métier — la variation ne correspond
            à aucune entité connue. Ne jamais forcer un sujet approximatif.
```

**Règle de priorité** : parcourir l'arbre dans cet ordre exact, du plus spécifique (`Organization`, `Program`, `University`) au plus large (`Country` France). S'arrêter à la première réponse "Oui" — ne jamais continuer à vérifier les niveaux suivants une fois un sujet trouvé.

---

## 5. Exemples validés

| Fact | Sujet retenu | Raison |
|---|---|---|
| Frais de licence | `University` | Droits différenciés confirmés entre établissements (2770€ vs 2895€) |
| Frais de doctorat | **`Country` (France) — granularité provisoire, sous réserve de validation réglementaire lors du Sprint 2** | Seule valeur trouvée à ce jour est nationale et unique (`public/press-kit.md`) ; décision fondée sur l'état du dépôt, pas encore sur une confirmation réglementaire positive |
| Délai de traitement visa | `Country` (Origine) | Varie fortement par consulat (8-14 sem. Maroc vs 3-6 sem. Sénégal) |
| Plafond horaire travail — cas général | `Country` (France) | 964h/an, valeur par défaut |
| Plafond horaire travail — cas dérogatoire | `Country` (Origine = Algérie) | 803h/an, accord bilatéral de 1968 — même prédicat, sujet différent, coexistence légitime |
| Montant CAF estimé | `City` | Varie avec le niveau de loyer local |
| Budget mensuel / coût de la vie | `City` | Ne doit jamais être porté par `University` — anti-pattern déjà présent dans le code actuel (voir §6) |
| Ouverture de compte sans justificatif de domicile | `Organization` (ex. N26) | Politique propre à la banque, indépendante du pays ou de la ville |

---

## 6. Exceptions et cas particuliers

- **Un même prédicat peut porter plusieurs `Fact` actifs simultanément, à condition que leurs sujets diffèrent** (ex. plafond horaire : France + Algérie). Ce n'est pas une violation de l'invariant de non-chevauchement de `Fact` — cet invariant porte sur le couple (sujet, prédicat), jamais sur le prédicat seul.
- **Anti-pattern déjà identifié dans le code actuel** : `lib/universities.ts` porte ses propres champs de budget/coût de la vie (`costCrous`, `costPrivate`, `costTransport`, `costFood`, `monthlyBudgetMin/Max`), dupliquant une donnée qui appartient en réalité à la ville. Toute future modélisation doit faire porter cette donnée par `City` ; `University` la référence sans jamais la reporter en valeur propre.
- **Décisions provisoires** : toute granularité déduite par absence de preuve contraire (et non par confirmation positive d'une source) doit porter la mention explicite "granularité provisoire" jusqu'à revue en Sprint 2. Le cas du doctorat (§5) est le premier exemple de ce statut — pas une exception isolée, un cas d'application du corollaire du §1.
- **`Program` et `Organization` n'ont, à ce jour, aucun cas d'usage réel confirmé dans le dépôt.** Ils sont inclus par anticipation (ex. une exigence d'admission propre à une formation, une règle propre à une banque) et ne doivent jamais être utilisés "par précaution" en l'absence d'une variation réellement constatée — leur emploi doit rester aussi rigoureux que celui des quatre autres sujets.

---

Cette Policy s'applique à tout `Fact` créé à partir de maintenant. Elle est réputée stable — toute évolution future doit être explicite et documentée, jamais silencieuse (cohérent avec le principe *Backward Compatibility* de `GOVERNANCE-CHARTER.md`).

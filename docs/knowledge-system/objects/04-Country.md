# Objet métier : Country

**Couche** : Knowledge
**Statut du document** : spécification métier — aucune implémentation

---

## 1. Mission

`Country` existe pour représenter un pays — qu'il s'agisse d'un pays d'origine (Maroc, Sénégal, Liban...) ou du pays de destination (France) — comme une entité stable qui regroupe des `City`, porte des spécificités administratives par nationalité, et sert de point d'ancrage à toute personnalisation liée à l'origine d'un étudiant.

Il est indispensable parce que la quasi-totalité des règles, procédures et contenus de Dalili varient selon le pays d'origine (statut CEF ou non, accords bilatéraux, délais consulaires différents). Sans `Country` comme entité propre, cette variation serait éparpillée dans du texte libre plutôt que d'être une dimension structurée et interrogeable.

---

## 2. Responsabilités

**Autorisé à** :
- Regrouper les `City` qui lui appartiennent (navigation `CONTAINS`).
- Porter des `Fact` propres (ex. statut CEF, délai consulaire moyen).
- Être la cible de `Rule` spécifiques par nationalité, et de `Persona` rattachés à ce pays d'origine.
- Être référencé par une `Procedure` propre à ce pays (ex. "Procédure CEF Sénégal").

**Ne doit JAMAIS** :
- Porter directement le contenu narratif d'un guide pays (ça vit dans `Content`, relié par `TARGETS_PERSONA`/`ABOUT`, pas embarqué dans `Country`).
- Dupliquer une liste de villes en son sein (la relation `CONTAINS` est navigable, jamais une liste recopiée — c'est la leçon directe du bug des 38 liens morts).
- Porter un jugement qualitatif ("le Maroc est un bon pays pour...") — ce type d'appréciation, s'il devait exister, relèverait de `Judgment`, pas de `Country`.

---

## 3. Cycle de vie

1. **Création** : un `Country` est créé une fois la décision éditoriale prise de couvrir ce pays (comme origine ou comme destination).
2. **Évolution** : rarement modifié dans sa nature — un pays ne "change" pas, seuls les `Fact`/`Rule` qui lui sont rattachés évoluent.
3. **Versionnement** : `Country` lui-même n'est pas versionné (il n'a pas de valeur qui change) — ce sont ses `Fact` associés qui le sont.
4. **Obsolescence** : quasiment jamais — un pays ne devient pas obsolète (à l'exception de cas géopolitiques exceptionnels, hors du scope réaliste de Dalili).
5. **Archivage** : non applicable en pratique.

---

## 4. Invariants

- Un `Country` de destination (la France) est unique dans le système — il n'y a jamais deux entités `Country` pour un même pays réel.
- Toute `City` référencée par `LOCATED_IN` pointe vers un `Country` qui existe réellement — pas de ville "orpheline" sans pays.
- Un `Country` d'origine ne peut être cible de `Rule`/`Persona` que s'il est explicitement couvert par la ligne éditoriale de Dalili (pas de couverture fantôme d'un pays jamais traité).

---

## 5. Relations

**Obligatoires** : aucune à sa création (un `Country` peut exister avant même d'avoir des `City` ou du contenu associé).

**Optionnelles** :
- `CONTAINS → City` (pour un pays de destination).
- `HAS_PROCEDURE → Procedure` (procédures spécifiques à ce pays d'origine).
- `HAS_FACT → Fact`.

**Contraintes** : un `Country` de destination et un `Country` d'origine partagent le même objet type, mais leurs relations utiles diffèrent en pratique (un pays d'origine n'a typiquement pas de `City` rattachées dans le système, sauf si Dalili commence un jour à documenter des villes d'origine — non prévu aujourd'hui).

---

## 6. États

| État | Description |
|---|---|
| `active` | Couvert éditorialement, ses `Fact`/`Content`/`Rule` associés sont maintenus. |
| `planned` | Identifié comme futur pays à couvrir, mais sans contenu/règle encore attaché — utile pour la planification éditoriale sans encore engager de travail de fond. |
| `archived` | Ne fait plus l'objet de couverture active (cas rare). |

---

## 7. Transitions

**Autorisées** : `planned → active` (début de couverture réelle), `active → archived` (décision éditoriale rare de cesser la couverture).

**Interdites** : `archived → planned` directement (une reprise de couverture doit repartir d'une décision `planned → active` explicite, pas d'une résurrection automatique).

---

## 8. Validation

Avant `active` : au moins une décision éditoriale documentée de couvrir ce pays, un nom et une identification non ambiguë (éviter toute confusion entre pays au nom proche).

---

## 9. Erreurs, cas limites, incohérences

- **Un pays change de nom ou de frontières** (cas rare mais réel en géopolitique) : traité comme une évolution de l'entité existante si la continuité administrative le permet, ou comme un nouveau `Country` avec relation explicite à l'ancien si la rupture est trop importante — décision éditoriale au cas par cas, pas une règle automatique.
- **Un étudiant a une double nationalité** : `Country` reste un objet neutre ; c'est le `LearnerProfile` qui porte la ou les nationalités pertinentes pour son cas, `Country` ne modélise jamais lui-même une combinaison de nationalités.

---

## 10. Exemples

**Cas simple** : `Country("France")`, `Country("Maroc")`.

**Cas complexe** : `Country("Algérie")` porte une `Rule` spécifique (plafond de travail à 803h) qui dérive d'une `Regulation` unique (l'accord de 1968) — un exemple de pays dont le traitement réglementaire est structurellement différent des autres pays du même statut CEF.

**Cas exceptionnel** : un pays actuellement `planned` (jamais encore couvert) reçoit une demande ponctuelle d'un utilisateur — le système doit pouvoir répondre honnêtement qu'il n'a pas encore de couverture pour ce pays plutôt que d'improviser une réponse non vérifiée.

---

## 11. Interactions avec les autres objets

**Consomme** : rien directement.

**Produit / alimente** : `City` (via `CONTAINS`), `Procedure` par pays, `Rule` par nationalité, `Persona`.

**En dépendent directement** : `City`, `LearnerProfile` (la nationalité est une des variables centrales du profil), `Procedure` spécifiques par pays.

---

## 12. Évolution à 5–10 ans

- **Extensions prévues** : accords bilatéraux additionnels si Dalili couvre de nouveaux pays avec un statut spécifique comme l'Algérie.
- **Multilingue** : un `Country` pourrait un jour porter un nom localisé par langue — actuellement hors scope, mais compatible sans changement structurel (c'est une question de `Presentation`, pas de `Country` lui-même).
- **Contrainte de compatibilité à préserver** : ne jamais faire porter à `Country` une logique conditionnelle propre — toute règle par nationalité doit toujours passer par `Rule`, jamais être codée en dur comme un attribut spécial de tel ou tel `Country`.

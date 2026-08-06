# 09 — Méthode de travail implicite (ce qui n'est pas dans le code)

Ce fichier complète les 8 précédents. Il ne parle ni de code ni d'architecture — uniquement de la méthode de travail réelle appliquée sur ce projet par Claude Code, avec Aymane, session après session. Rien ici n'est dans le repo : c'est la partie "tacite" du processus.

**Base de preuve** : les mémoires Claude Code (`feedback-research-first.md`, `feedback-data-verification.md`), les messages de commit (qui décrivent souvent la méthode, pas seulement le résultat — ex. `fe2461f`, `67023d2`), le skill `dalili-master` et le `CLAUDE.md` global (qui sont des instructions opérationnelles réellement suivies, pas de la théorie). Là où j'extrapole au-delà de ces preuves directes, je le signale.

---

## 1. Workflow exact de génération d'un nouvel article

1. **Brief** : sujet + mot-clé cible donné par Aymane, ou identifié via un gap concurrentiel repéré pendant la recherche (étape 2).
2. **Recherche** (étape 2 et 3 ci-dessous) — jamais sautée, c'est la règle la plus stricte du projet.
3. **Plan de l'article** : structure H2/H3 pensée pour être *strictement supérieure* à ce qui existe déjà en SERP — pas un plan générique. Si un concurrent a 6 sections, Dalili en couvre 8, ou couvre les 6 mêmes avec un niveau de détail et de sourçage qu'eux n'ont pas.
4. **Rédaction** avec les contraintes de format qui alimentent le code (contrats implicites, à respecter à la lettre) :
   - Une section `## FAQ` en fin d'article, questions en `**gras finissant par ?**` ou `### sous-titre finissant par ?`, réponse en un seul paragraphe juste après (sinon `extractFaqItems()` ne la capte pas).
   - Chiffre = jamais écrit sans une source officielle ouverte et lue au préalable (étape 4 ci-dessous).
   - `cluster` assigné dès la rédaction (pas après) pour que le maillage automatique fonctionne dès la publication.
   - Frontmatter complet dès le premier jet (`readTime` en string, `thumbnail` déjà choisi) — pas de champ "à compléter plus tard".
5. **Maillage manuel** : ajouter des liens sortants vers 2-4 articles déjà publiés du même cluster/thème (le maillage automatique par cluster ne remplace pas des liens contextuels placés à la main dans le corps du texte).
6. **Vignette** : choisie/générée après le texte (pattern observé dans l'historique : plusieurs commits de "miniatures" arrivent juste après le commit de contenu, jamais dans le même commit) — c'est un point faible du process à améliorer, pas une méthode à imiter (voir fichier 08, mais je ne le développe pas ici puisque déjà couvert).
7. **Publication** = commit + push. Pas d'étape de relecture formalisée séparée observée (pas de brouillon/statut, pas de second reviewer) — le contrôle qualité se fait pendant la rédaction elle-même, pas après.

## 2. Recherche avant d'écrire — méthode concrète

- Recherche web ciblée (WebSearch) en deux passes distinctes, jamais fusionnées :
  - **Passe réglementaire/factuelle** : chercher directement sur les sites officiels (voir point 4) les chiffres, délais, procédures en vigueur à la date de rédaction — jamais se fier à une connaissance générale déjà en mémoire, car la réglementation française évolue souvent (voir point 5).
  - **Passe concurrentielle** : chercher ce que les concurrents nommés publient sur le même sujet exact (voir point 3).
- Objectif explicite de la recherche : sortir avec une liste de **faits différenciants** — des informations correctes, précises, sourcées, que les concurrents n'ont pas ou ont mal expliquées. La mémoire `blog-content-strategy.md` documente des exemples réels de ce type de fait trouvé (extension du repas CROUS à 1€ à tous les étudiants depuis le 4 mai 2026, période de référence des 964h calculée depuis la date du titre de séjour et non le 1er janvier, exemption "1 an en France" pour l'alternance en master depuis un décret de décembre 2021, etc.). Ce ne sont pas des détails anodins — ce sont précisément les points qui manquent chez Campus France/Studyrama/L'Étudiant et qui justifient l'existence de l'article.
- Si la recherche ne permet pas d'identifier au moins un ou deux faits différenciants réels, c'est un signal que le sujet ne mérite peut-être pas un nouvel article (ou qu'il faut chercher plus profondément avant d'écrire).

## 3. Analyse concurrentielle — méthode concrète

- Concurrents systématiquement regardés pour chaque sujet : **Campus France** (référence institutionnelle), **Studyrama**, **L'Étudiant**, **Study.eu**, **Mastersportal**, **Top Universities**, et ponctuellement **Diplomeo**.
- Pour chaque sujet, la question posée n'est pas "est-ce que ces sites ont un article sur ce sujet" (ils en ont presque toujours un) mais : *qu'est-ce qu'ils omettent, simplifient à l'excès, ou laissent obsolète ?* — c'est la logique qui a produit, par exemple, la différenciation entre deux articles proches (`campusfrance-maroc-guide-complet` axé "entretien/inscription" vs `visa-etudiant-france-maroc-2026` axé "procédure consulaire/OFII" — cannibalisation identifiée et résolue en séparant les angles plutôt qu'en fusionnant les articles).
- Un article jugé "pas assez supérieur" au résultat de cette analyse n'est pas publié — précédent direct : un article a été écrit sans cette étape, jugé insuffisant, et supprimé (voir mémoire `feedback-research-first`).

## 4. Comment les sources officielles sont choisies — hiérarchie réelle

Ordre de confiance appliqué, du plus haut au plus bas, pour tout chiffre ou règle citée :

1. **Texte de loi/décret brut** — `legifrance.gouv.fr` (source primaire absolue ; utilisé notamment pour le décret n°2026-385 du 19 mai 2026 sur le plafonnement des exonérations de frais de scolarité).
2. **Sites gouvernementaux d'application/vulgarisation officielle** — `service-public.fr`, `service-public.gouv.fr`, `enseignementsup-recherche.gouv.fr` (MESR), `france-visas.gouv.fr`, `administration-etrangers-en-france.interieur.gouv.fr` (ANEF).
3. **Organismes officiels spécialisés par domaine** — `campusfrance.org` (procédure CEF/visa), `ameli.fr` (santé/sécurité sociale), `caf.fr` (aides logement), `cvec.etudiant.gouv.fr` (CVEC).
4. **Jamais utilisés comme source primaire** : forums, blogs d'expatriés, réponses de chatbots génériques, ou les sites concurrents eux-mêmes (ils sont analysés pour leur structure/angle, jamais cités comme preuve d'un chiffre).
- Règle de recoupement implicite : quand un chiffre a un impact fort (frais de scolarité, plafond horaire de travail, montant CAF), il est vérifié sur **au moins deux sources concordantes** avant publication quand c'est possible (le texte de loi + sa vulgarisation officielle), pas une seule.

## 5. Comment un changement réglementaire est détecté

Il n'existe pas de veille automatisée (pas d'alerte, pas de flux RSS gouvernemental surveillé par un script). La détection est **réactive et déclenchée par une vérification ponctuelle** qui révèle qu'un chiffre a changé, suivie systématiquement d'un réflexe précis observé deux fois dans l'historique récent (commits `fe2461f`/`67023d2`) : **dès qu'une occurrence obsolète est trouvée et corrigée, faire un grep de tout le dossier `content/` sur le motif exact de l'ancienne affirmation** (ex. `"exonération" + "90%"/"100%"`) pour vérifier qu'aucune autre page ne répète la même erreur, avant de considérer la correction terminée. C'est ce réflexe de sweep complet — pas juste corriger l'endroit trouvé — qui est la vraie méthode à retenir, plus que la détection elle-même (qui reste largement le fruit d'une vérification ponctuelle, pas d'une surveillance continue).

**Conséquence directe pour un successeur** : il n'y a aujourd'hui aucune garantie qu'un changement réglementaire survenu sans qu'Aymane (ou une session Claude Code) tombe dessus par hasard soit détecté avant qu'un utilisateur ou Google Search Console ne signale une anomalie. C'est un point de fragilité assumé, pas un système couvert.

## 6. Exploitation quotidienne de Google Search Console

- Usage réel observé (via les messages de commit, qui citent explicitement "vraies requêtes GSC", "fort impressions/faible clics") : **boucle récurrente**, pas un audit ponctuel — revenir régulièrement dans GSC, trier les pages par volume d'impressions élevé et CTR faible, et considérer ces pages comme prioritaires pour une réécriture de title/meta description.
- Deuxième usage : comparer la **requête réelle** qui génère les impressions (visible dans GSC, colonne "requêtes") avec le **mot-clé supposé** ciblé par la page — quand ils divergent, le titre/la description est réécrit pour coller à la requête réelle plutôt qu'à l'intention initiale de l'auteur. C'est ce qui a produit les vagues de commits `seo:` successives.
- Troisième usage, plus rare mais présent : identifier une confusion de contenu réelle signalée indirectement par le comportement de recherche (ex. le commit `9e2b83e : fix: FAQ Bordeaux confondait Sécurité Sociale et CVEC` suggère qu'une confusion a été repérée et corrigée à la source, pas seulement au niveau du titre).
- Il n'y a pas d'automatisation de récupération des données GSC (pas d'API GSC branchée, pas de script d'export) — la lecture se fait manuellement dans l'interface Google Search Console par Aymane, qui transmet ensuite les pages à traiter.

## 7. Comment la priorité des pages à améliorer est décidée

Critères combinés, par ordre d'influence observée :
1. **Impact SEO immédiat mesuré** (impressions élevées + CTR faible dans GSC) — le critère le plus fréquemment déclencheur d'une session de travail.
2. **Alerte réglementaire** (un chiffre vient de changer, ou une confusion factuelle est découverte) — traité en urgence, avec sweep complet (point 5), passe devant tout le reste.
3. **Cannibalisation/duplication détectée** — deux pages qui se battent sur le même mot-clé sont retravaillées pour se différencier plutôt que fusionnées (précédent Maroc, point 3).
4. **Statut "pilier" déjà assigné** — les pages classées `HIGH_PRIORITY_SLUGS` dans le sitemap (clusters TCF Maroc, visa, logement/CAF, médecine, arnaques/écoles privées) reçoivent l'attention en premier à volume d'effort égal, car leur potentiel de trafic est jugé plus élevé a priori.
5. **Signal utilisateur direct** — remontée manuelle d'Aymane ("cette page est fausse/confuse") prime sur tout calcul.

Il n'y a pas de méthode de scoring formalisée (pas de feuille de calcul de priorisation) — c'est un jugement combiné exercé à chaque session, pas un algorithme.

## 8. MCP, outils et automatisations réellement utilisés pendant le développement

Pour être honnête sur ce point plutôt que de survendre une infrastructure qui n'existe pas :

- **Un seul MCP configuré pour ce projet** : Supabase (`.mcp.json`), utilisé pour inspecter/interroger la table `waitlist` directement depuis Claude Code sans passer par le dashboard web.
- **WebSearch** (et occasionnellement WebFetch) — l'outil de recherche réel utilisé pour les étapes 2, 3 et 4 ci-dessus. C'est le cœur de la méthode "research-first" : pas de base de connaissances propriétaire, pas d'agent de veille — une recherche web faite à chaque nouvel article ou chaque vérification de chiffre.
- **Bash/git** — utilisé non seulement pour committer, mais aussi pour des vérifications ad hoc à la demande (grep de motifs obsolètes dans `content/`, comptage d'occurrences, petits scripts Node jetables pour croiser des données — c'est exactement cette méthode qui a permis de trouver les 38 liens morts documentés dans le fichier 08 : un script Node d'une dizaine de lignes écrit à la volée pour croiser deux listes, pas un outil permanent du repo).
- **Aucune automatisation programmée** (pas de cron, pas d'agent planifié, pas de CI) ne surveille le contenu, les liens, ou la conformité réglementaire en continu — tout est déclenché à la demande pendant une session de travail.
- **Aucun MCP Figma, navigateur ou design** utilisé sur ce projet — le design est écrit directement en code (style inline, voir fichier 05), pas dérivé d'une maquette externe.
- Test visuel des changements UI : lancement du serveur de dev local (`npm run dev`) et vérification directe dans le navigateur avant de considérer un correctif visuel terminé — pas de suite de tests automatisés (cohérent avec l'absence de configuration Playwright active notée dans le fichier 02).

## 9. Workflows systématiques mais invisibles dans le code

- **Sweep complet après toute correction de donnée obsolète** (point 5) — jamais une correction locale sans vérifier qu'elle n'est pas dupliquée ailleurs (même si, comme documenté dans le fichier 08, ce sweep a lui-même raté `lib/universities.ts` une fois — la discipline existe mais n'est pas infaillible).
- **`updatedDate` du frontmatter systématiquement bumpé** à chaque correction de contenu, jamais laissé à l'ancienne date.
- **Mesure avant/après obligatoire pour tout correctif de performance**, citée dans le message de commit lui-même (`LCP mobile 6.4s→2.3s`, `CLS 0.23→0`) — jamais un correctif de perf mergé sans preuve mesurée.
- **Redirect 301 systématique avant tout renommage de slug** déjà indexé.
- **Vérification en navigateur réel avant de déclarer un correctif UI terminé**, jamais une confiance aveugle dans le code seul.
- **Écriture d'un script jetable plutôt qu'une supposition** dès qu'une question porte sur "combien de X référencent Y" ou "est-ce cohérent partout" — la vérité est établie par exécution, pas par lecture visuelle approximative du code.

## 10. Erreurs systématiquement évitées

- Écrire un article sans recherche concurrentielle préalable (a coûté la suppression d'un article publié).
- Écrire un chiffre réglementaire de mémoire sans vérification sur source officielle.
- Casser le format `## FAQ` / question-en-gras-ou-titre-finissant-par-`?` (romprait `extractFaqItems()` silencieusement, sans erreur visible).
- Renommer un slug déjà publié sans ajouter le redirect 301 correspondant dans `vercel.json`.
- Oublier de mettre à jour `updatedDate` après une correction factuelle.
- Corriger un seul endroit d'une donnée dupliquée sans vérifier les autres emplacements (leçon apprise a posteriori avec le bug des frais de scolarité — voir fichier 08).
- Refactorer/migrer un pan du code (ex. style inline → Tailwind) par réflexe de "propreté" sans demande explicite.
- Prendre une action destructive (force-push, reset --hard, suppression de fichiers non créés dans la session) sans confirmation explicite.
- Ajouter de la documentation, des commentaires ou des abstractions non demandées "au cas où".
- Déclarer une fonctionnalité UI terminée sans l'avoir vue tourner dans un vrai navigateur.

## 11. Décisions prises avant de développer une fonctionnalité

- **Toujours Audit → Analyse → Plan → Implémentation → Test → Optimisation**, jamais l'inverse — c'est une règle explicite (skill + CLAUDE.md global), pas une préférence de style : sauter directement à l'implémentation est explicitement interdit par les instructions opérationnelles de ce compte.
- Avant d'écrire une ligne de contenu : la source officielle est déjà identifiée et lue, pas "à vérifier plus tard".
- Avant de créer une nouvelle page/entité : décider où elle s'insère dans la taxonomie existante (`category` ET `cluster` pour un article ; quelle ville/pays pour une université) — jamais une page orpheline de la taxonomie dès sa création.
- Avant de changer une URL ou un slug existant : vérifier s'il est déjà indexé (implicitement : s'il existe déjà en production) et prévoir le redirect en même temps que le changement, pas après coup.
- Avant un correctif de performance : mesurer l'état actuel réel (Lighthouse, trace), pas supposer la cause du problème.
- Avant toute automatisation ou fonctionnalité technique nouvelle : jugée à l'aune de l'ordre de priorité produit explicite (User value > Trust > Clarity > Conversion > SEO > AI Search > Performance) — une fonctionnalité qui optimiserait le SEO au détriment de la clarté utilisateur serait a priori écartée ou reformulée.

## 12. Idées, projets ou systèmes prévus mais non encore implémentés

(Volontairement bref ici — le détail technique de chacun est déjà dans les fichiers 04 et 08 ; ne sont listées que les intentions elles-mêmes, pour que ChatGPT sache qu'elles existent dans l'intention du fondateur/du skill, sans redonder le "comment".)

- **L'application mobile Dalili** elle-même — le produit final annoncé ("Bientôt disponible"), pas encore lancé ; le site actuel est une stratégie de contenu pré-lancement, pas juste un teaser.
- **WebMCP** — rendre les actions du site machine-readable pour des agents IA (mandaté par le skill, aucun début d'implémentation).
- **Un knowledge graph formalisé** des relations entre entités (ville/université/pays/article/cluster), au-delà du `CLUSTER_MAP` actuel.
- **Flux RSS et sitemap d'images** — mandatés par le skill, absents du code.
- **Extension géographique** — d'autres pays CEF non encore couverts par une page pays dédiée (mentionnés en passant dans le contenu FAQ mais sans traitement éditorial complet).
- **Une version multilingue** (arabe et/ou anglais) — cohérente avec l'audience mais non entamée, pas de hreflang en préparation à ce jour.
- **Formalisation écrite d'une roadmap produit** — n'existe dans aucun document ; à ce jour, elle vit uniquement dans la tête d'Aymane et se révèle session après session.

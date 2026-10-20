# Guides à écrire (questions refusées par l'assistant)

> Source : `assistant_queries` (`fallback_triggered = true`). Extraction du 19/10/2026 : **58 refus sur 123 questions** (47 %).
> Les questions sont **reformulées et anonymisées**, jamais copiées telles quelles. Depuis le 19/10/2026, le journal masque les emails, téléphones, IBAN, n° de sécu et numéros de dossier (`lib/assistant/redact.ts`).
> Mise à jour : relancer la requête SQL en bas de page chaque lundi.

## 1. Lecture rapide

| Cause du refus | Refus | Ce qu'il faut faire |
|---|---|---|
| **Le guide existe, mais la recherche ne le trouve pas** (similarité entre 0,50 et 0,59, juste sous le seuil de 0,6) | ≈ 20 | Améliorer la recherche (§3) : **ce n'est pas un manque de contenu** |
| Index vide ou en panne le 24/07 (similarité = 0,00) | 8 | Incident passé. Ajouter une alerte si plus de 3 refus à 0,00 en une heure |
| **Vrai manque de contenu** | ≈ 18 | Écrire ou compléter les guides du §2 |
| Hors sujet, salutations, tests (« capitale du Japon », « salut », « mok mok ») | ≈ 9 | Réponses d'accueil fixes, sans appel à l'IA (§4) |
| Hors périmètre (Canada, Québec, Mauritanie, support du compte Études en France) | 4 | Refus poli + renvoi vers le bon interlocuteur |

## 2. Guides à écrire ou compléter (par fréquence)

| # | Thème | Refus | Questions types (reformulées) | Action | Guide concerné |
|---|---|---|---|---|---|
| 1 | **Compte bloqué : cas particuliers** | 9 | Le compte peut-il être au nom d'un parent ? dans une banque du pays (compte « scolarité ») ? Combien pour un seul semestre ? Peut-on combiner garant + hébergement + demi-compte bloqué ? | **Compléter** avec une section « Alternatives et combinaisons acceptées » (attestation de prise en charge, garant, bourse), avec sources consulaires | `compte-bloque-visa-etudiant-france-guide` |
| 2 | **Montant 615 € → 877,50 € : quelle date compte ?** | 4 | Le seuil dépend-il de la date du formulaire France-Visas ou du rendez-vous TLS/VFS ? | Le guide dit déjà « date de dépôt » (encadré). **Préciser** ce que « dépôt » veut dire (formulaire en ligne ou rendez-vous), à **valider avec une source officielle** (sujet sensible) | `compte-bloque-…`, `visa-etudiant-france-*` |
| 3 | **Garant : conditions** | 5 | Le garant doit-il vivre dans la même ville que l'université ? Un garant en France réduit-il le compte bloqué ? | **Compléter** la FAQ (garant pour le logement ≠ justificatif de ressources pour le visa) | `garant-logement-etudiant-etranger-france` |
| 4 | **Bourses** | 4 | Bourse complète ou partielle, bourse de master en énergie, bourse pour une classe préparatoire (IPEST) | Compléter la FAQ + tableau par profil (licence/master, domaine) | `bourse-complete-partielle-…`, `bourses-etudes-france-etudiants-tunisiens` |
| 5 | **Cas d'admission atypiques** | 4 | Bac tunisien mais résidence en Allemagne ; admission dans une école hors Campus France ; titre RNCP niveau 7 en alternance dès la 1re année ; réorientation vers le privé après le bac en Côte d'Ivoire | **Nouveau guide** : « Mon cas sort du parcours classique : qui contacter ? » | — |
| 6 | **Lexique** : apostille, CEF, « procédures de l'université » | 4 | « Que veut dire apostillé ? », « c'est quoi CEF ? » | Indexer le **lexique** dans `content_chunks` (une définition = un extrait) | `glossary` (API v1) |
| 7 | **Étudiant mineur** | 1 | Réservation d'hôtel pour le dossier visa quand on est mineur | **Nouveau guide** court : « Partir étudier en France avant 18 ans » | — |
| 8 | **Stage** | 1 | Deux stages consécutifs de 6 mois ? | Compléter la FAQ | `stage-france-etudiant-etranger-convention` |
| 9 | **Ville pas chère + informatique** | 3 | Quelle ville pour l'informatique sans se ruiner ? Alternatives à moins de 650 €/mois ? | Le contenu existe : relier les deux guides et ajouter une FAQ croisée | `villes-etudiantes-moins-cheres-france-2026`, `informatique-france-etudiant-etranger` |
| 10 | Questions déjà couvertes mais refusées | 4 | Score TCF pour Campus France, carte Vitale, coût de la médecine en école privée, montant du compte bloqué (×3) | **Aucun contenu à écrire** : problème de recherche (§3) | `tcf-*`, `carte-vitale-…`, `faculte-medecine-privee-france-prix`, `compte-bloque-…` |

## 3. Améliorer la recherche (jalon M1, cerveau commun)

1. **Recherche hybride** : vecteurs + plein texte Postgres (`tsvector` français) pour les mots courts et rares (« CEF », « apostille », « Vitale »).
2. **Requête enrichie par le lexique** : « c quoi CEF » → « CEF (Centre pour les études en France) Campus France ».
3. **Contexte pays (app)** : favoriser les guides du `cluster` du pays de l'étudiant.
4. **Seuil** : ne pas l'abaisser globalement. Accepter 0,55 seulement si le guide en tête est aussi trouvé par le plein texte (double confirmation).
5. **Message de refus** (site et app) : toujours **le guide le plus proche**, **« Demander à un mentor »** et **« On l'ajoute à nos guides »** (ce bouton enregistre la question masquée avec `requested = true`). ✅ Fait dans l'app en M1 (`/api/v1/assistant/request`).

**Fait en M1, pour le site et l'app** : requête enrichie par le lexique (point 2) et contexte pays (point 3, app seulement : les guides d'un autre pays sont exclus). **Reste à faire** : recherche hybride (point 1), qui demande une migration (`tsvector`), et double confirmation à 0,55 (point 4).

## 4. Réponses fixes (sans IA)

| Intention | Réponse |
|---|---|
| Salutation (« salut », « bonjour ») | « Salut ! Pose-moi ta question sur tes études en France : visa, logement, budget… » |
| « D'où viennent tes infos ? » | « Uniquement des guides DALILI, vérifiés par l'équipe. Chaque réponse cite son guide. » (**question de confiance, à ne jamais refuser**) |
| Frustration (« trop nul ») | « Désolé, je n'ai pas trouvé. Dis-moi ce que tu cherches en une phrase, ou parle à un mentor. » |

## Requête de suivi

```sql
select date_trunc('week', created_at) semaine,
       count(*) filter (where fallback_triggered) refus,
       count(*) total,
       round(100.0 * count(*) filter (where fallback_triggered) / count(*)) pct
from assistant_queries group by 1 order by 1 desc;

-- Depuis M1 : les sujets que les étudiants ont demandé d'ajouter (« On l'ajoute à nos guides »)
select created_at::date jour, channel, country, question
from assistant_queries where requested order by created_at desc limit 100;
```

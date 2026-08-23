# Catalogue des showcases Bandaa

Ce catalogue décrit des briefs réutilisables. Il ne publie ni les titres, ni
les claims, ni les modèles qui n'ont pas encore été vérifiés dans le build.

## Baseline stable — soirée entre amis

| Identifiant | Modèle vérifié | FR | EN | ES | Preuve prioritaire | État |
| --- | --- | --- | --- | --- | --- | --- |
| `friends-night` | `freeform` dans `store-capture.ts` | `Les potes` | `The Crew` | `El coro` | Mission → Book → Reveal | stable pour le run Store |

Commande de fixture actuelle :

```bash
bun run tools/demo-assets/scenarios/store-capture.ts \
  create --collection full-party-v3 --locale <fr|en|es>
```

Le runner utilise des pseudonymes synthétiques, une Mission active et la
collection d'images `full-party-v3`. Les identifiants de sortie restent locaux.

## Briefs landing par modèle

Les titres ci-dessous sont des candidats de travail : ils doivent être relus
par un humain natif avant toute capture ou publication. Ils sont conçus comme
des noms de groupe plausibles, pas comme la traduction du mot « modèle ».

| Identifiant | Modèle documenté | Titre FR candidat | Titre EN candidat | Titre ES candidat | Artwork de départ | Frames landing visées | Claim autorisé | État |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `wedding` | `Mariage` | `Le grand jour` | `The Big Day` | `El gran día` | bouquet, papier, lumière dorée, tissus ; sans texte ni visage identifiable | `party`, `mission`, `book`, `reveal` | événement privé, Missions, Book, Reveal | brief-only |
| `birthday` | `Anniversaire` | `Bon anniversaire !` | `Birthday Crew` | `¡Feliz cumple!` | gâteau, bougies, confettis, couleurs heritage/corail ; sans nom réel | `party`, `mission`, `book`, `reveal` | événement privé, Missions, Book, Reveal | brief-only |
| `baptism` | `Baptême` | `Dimanche en famille` | `Family Sunday` | `Domingo en familia` | linge clair, fleurs, table familiale, lumière diurne ; sans enfant identifiable | `party`, `mission`, `book`, `reveal` | événement privé, Missions, Book, Reveal | brief-only |

La spécification des modèles rend le contexte éditorial disponible, mais elle
indique aussi que les textes de promesse, les symboles et les Quests thématiques
restent des livrables éditoriaux. Tant que le code de création et les textes
publiés ne sont pas vérifiés, utiliser ces lignes pour cadrer un artwork ou une
section de landing, pas pour fabriquer une capture de modèle.

Le set `party → mission → book → reveal` est une cible de composition, pas une
preuve déjà disponible pour ces trois modèles. Tant que l'état reste
`brief-only`, la landing peut montrer un brief ou un artwork identifié comme
tel, mais elle ne doit pas présenter les captures `friends-night` comme si elles
étaient Mariage, Anniversaire ou Baptême.

## Règles de titre par locale

1. Écrire chaque titre directement dans la langue cible ; ne pas traduire
   automatiquement `Les potes`.
2. Employer une formulation qu'un groupe d'amis ou une famille pourrait donner
   à sa sortie ; garder une lecture immédiate sur une ou deux lignes iPhone.
3. Faire correspondre le titre, la palette, les images seedées et la Mission au
   même contexte ; le titre seul ne doit pas promettre une fonction dédiée.
4. Préférer des noms génériques ou synthétiques ; exclure nom réel, adresse,
   numéro de téléphone, lien, QR et token.
5. Marquer le titre `draft` jusqu'à la relecture native FR/EN/ES. Si le texte
   visible ne correspond pas à la locale de l'appareil, recapturer la Party.

## Futur B2B

Les boîtes de nuit, salles de concert, wedding planners, agences, clubs de
sport et entreprises restent des pistes de marché dans le guide d'assets. Aucun
showcase B2B ne doit être généré avant de disposer d'un audience précis, d'un
modèle réellement livré, de claims approuvés et d'une décision sur les droits
des assets de marque.

## Contrat d'une section landing

Chaque exemple publié doit fournir :

```text
showcaseId, locale, eventTemplate, title, oneClaim, artworkPath?,
proofFrames[], sourceBuild, sourceDevice, sourceRoute, copyStatus, reviewOwner
```

Une section commence par un brief et peut rester `brief-only`. Elle passe à
`capture-ready` quand la fixture est réellement créable, puis à `approved`
uniquement après revue de la locale, de l'image, du claim et du rendu mobile.

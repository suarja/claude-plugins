---
name: bandaa-showcase-assets
description: Use when creating or refreshing localized Bandaa showcase assets for a landing page, Store listing, event-template example, generated artwork, demo Party, or real-build capture.
---

# Bandaa Showcase Assets

Un showcase Bandaa est un petit dossier de preuve, pas une image isolée. Il
relie une fixture de soirée localisée, un artwork éventuel, des captures du
build réel et une composition destinée au Store ou à la landing page. Utiliser
ce workflow pour garder la différence entre ce qui est généré, ce qui existe
réellement dans l'application et ce qui est seulement composé.

## Contrat du showcase

Créer un manifeste de travail avec au minimum :

```text
showcaseId, surface, eventTemplate, locale, devices, claim, frames,
artworkStatus, fixtureStatus, captureStatus, copyStatus, ownerDecision
```

Classer chaque artefact par source :

| Source | Usage | Preuve attendue |
| --- | --- | --- |
| `fixture-data` | Party, membres synthétiques, Missions et statut Book | commande ou route réelle vérifiée |
| `generated-artwork` | ambiance, hero ou illustration décorative | prompt, provider, modèle, taille et contrôle humain |
| `real-capture` | interface mobile montrée au Store ou à la landing | appareil, locale, route et dimension source |
| `composition` | overlay, coque, mise en page et export | manifest du workbench et chemin source |

Une composition ne transforme jamais un artwork en preuve d'interface. Une
capture réelle ne reçoit jamais un texte retouché pour masquer une mauvaise
locale ou une fixture erronée.

## Sources de vérité

Le kit du skill est composé de `SKILL.md`, du document
`references/asset-workshop.md`, de la carte `references/documentation-map.md`,
du catalogue `references/showcase-catalog.md` et des scripts
`scripts/create-showcase-manifest.ts` et `scripts/validate-showcase.ts`.
Charger seulement la branche utile :

- Styles, providers, briefs, chemins, fixture, devices et versionnage :
  `references/asset-workshop.md`.
- Inventaire des documents, scripts, scénarios et sorties déjà utilisés :
  `references/documentation-map.md`.
- Titres et briefs par modèle : `references/showcase-catalog.md`.
- Matrice, fixture, frames et preuves de capture Store :
  `references/store-capture-protocol.md`.
- Nouveau manifeste :
  `bun run scripts/create-showcase-manifest.ts` depuis le dossier du skill.
- Contrôle d'un manifeste :
  `bun run scripts/validate-showcase.ts` depuis le dossier du skill.

Les sources de dépôt qui prouvent l'état actuel sont :

- Produit et vocabulaire : `docs/PRD.md`, `CONTEXT.md`,
  `docs/design-direction.md`.
- Modèles réellement disponibles : `docs/specs/shipaton/e-event-templates-scheduling.md`,
  puis les routes et mutations présentes dans `app/`, `src/` et `convex/`.
  Une spécification seule ne prouve pas qu'un modèle peut être capturé.
- Génération : `references/asset-workshop.md`, puis les scripts exécutables
  (`scripts/` et `tools/demo-assets/`) et les manifestes de provenance dans
  `docs/assets/`.
- Captures et Store : `references/store-capture-protocol.md` et
  `docs/assets/bandaa-mobile/app-store-generator/README.md`.
- Positionnement : `docs/research/marketing-workshop-bandaa.md`.
- État propriétaire des listings et de l'ASO : dans le dépôt privé, lire
  `.agents/skills/bandaa-store-listings`.
- État propriétaire des listings et de la matrice Store : dans le dépôt privé,
  lire `.agents/skills/bandaa-store-listings`; ce skill marketplace ne porte
  pas les brouillons ni les décisions spécifiques du propriétaire.
- Landing en cours : `docs/agents/landing-handoff.md` et le plan présent dans
  `docs/plans/` ; ne pas supposer que les assets attendus sont déjà livrés.

## Workflow

### 1. Cadrer la preuve

Choisir un seul objectif pour le showcase : faire comprendre la promesse
Missions → Book → Reveal, illustrer un modèle d'événement, ou prouver un
parcours Store. Déclarer la surface (`landing`, `apple-store`, `google-play` ou
`design-review`), la locale (`fr`, `en`, `es`), le device et le claim source.

Utiliser l'iPhone comme cible par défaut. Ajouter l'iPad seulement pour une
sortie Apple, une vérification responsive ou une composition qui gagne
réellement à montrer la tablette. Réserver Android aux captures natives utiles
à Google Play ; ne pas lui appliquer une coque marketing par défaut.

Critère de fin : le manifeste nomme exactement un objectif, une locale, un
device, un claim vérifiable, les frames attendues et le statut de l'artwork ;
toute capacité non confirmée est `à vérifier`, jamais implicite.

Pour éviter un manifeste incomplet, le créer avec le script du skill :

```bash
bun run scripts/create-showcase-manifest.ts \
  --id friends-night-fr \
  --surface landing \
  --template freeform \
  --locale fr \
  --device iphone \
  --title "Les potes" \
  --claim "Des Missions pour vivre la soirée. Un Book pour la retrouver." \
  --out /tmp/friends-night-fr.json
```

### 2. Vérifier le produit et les sources

Vérifier que chaque route, état et commande cités existent. Pour une capture
Store, partir de `tools/demo-assets/scenarios/store-capture.ts` et du protocole
Store ; pour un écran de landing, partir d'une capture Store approuvée ou d'un
build réel. Lire le code de la route avant de rédiger sa légende.

Le runner actuel crée la fixture stable `full-party-v3` en `freeform` avec les
titres `Les potes`, `The Crew` et `El coro`. Les modèles Mariage, Baptême et
Anniversaire sont documentés dans la spécification, mais leur runner et leurs
textes éditoriaux doivent être vérifiés séparément.

Critère de fin : chaque frame a une route ou un état réel, chaque modèle a une
preuve d'implémentation actuelle, et le manifeste indique `brief-only` lorsque
la vérification n'est pas faite.

### 3. Écrire le pack de locale et de fixture

Préparer ensemble le nom de la soirée, les pseudonymes synthétiques, le texte
de la Mission, les labels visibles, la date et le statut attendu du Book. La
locale de l'application et la `Membership Locale` doivent être réglées
explicitement ; le changement de langue système ne suffit pas.

Choisir le titre comme un vrai nom de groupe ou de sortie : idiomatique dans la
locale, court, lisible sur une ou deux lignes, sans jargon produit et sans
traduction littérale obligatoire. Une langue peut avoir un titre différent des
autres. Le titre, la Mission et les autres textes injectés dans la fixture
doivent raconter le même contexte. Employer uniquement des personnes et des
lieux synthétiques ; l'utilisateur-authored text reste verbatim.

### Règle éditoriale des Missions

Une Mission de showcase n'est pas une phrase générique réutilisée d'un modèle à
l'autre. Séparer toujours :

- `missionTitle` : un intitulé court, idiomatique et spécifique au scénario ;
- `missionInstruction` : une consigne observable et immédiatement actionnable
  par les invités, dans la locale de la Party.

Le titre doit donner envie de capturer un moment propre au contexte (Mariage,
Anniversaire, Baptême, Vacances ou soirée libre). La consigne doit préciser ce
que l'invité peut photographier, sans dépendre d'une interprétation abstraite,
d'une émotion supposée ou d'une fonction qui n'existe pas. Une Mission doit
être vérifiable par une photo réelle et rester cohérente avec les assets, le
Book attendu et le moment de l'événement.

`unnoticed-detail` / « Le détail que personne ne remarque » reste la baseline
historique du runner `freeform` et un secours technique. Ne pas le recopier
comme Mission éditoriale d'un scénario thématique. Tant qu'un scénario n'a pas
de titre et d'instruction propres relus dans chaque locale, le manifeste reste
`brief-only` ou `draft` ; on ne maquille pas une Mission générique en preuve du
modèle.

Exemple de distinction de travail, non validé pour publication :

```text
Mariage
  missionTitle: « Le détail du grand jour »
  missionInstruction: « Photographiez un ruban, un bouquet ou une lumière de la cérémonie. »
```

Pour chaque fixture ou brief, consigner séparément la locale, le scénario,
`missionTitle`, `missionInstruction`, la source du texte et son statut de
relecture. Ne pas utiliser le même titre simplement parce que la route ou le
template technique est identique.

Charger `references/showcase-catalog.md` pour les titres de base et les briefs
Mariage, Anniversaire et Baptême. Les titres proposés pour ces derniers sont
des brouillons à relire, pas une décision de copywriting.

Critère de fin : un tableau répertorie chaque chaîne visible avec locale,
source, statut `draft`/`à relire`/`validé` et justification ; aucune capture ne
commence avec un titre d'une autre langue, une donnée personnelle ou un ancien
nom.

### 4. Produire l'artwork, si l'objectif en a besoin

Réutiliser les scripts et la direction existants. Pour une scène avec des
personnes, suivre la stratégie Replicate/Flux documentée ; pour une ambiance
sans visage, un prototype Pollinations est possible ; pour un asset marketing
final, choisir le provider de qualité approuvé dans le guide et l'inscrire dans
le manifeste. Ne pas créer un nouveau générateur ou une nouvelle dépendance
pour un seul showcase.

Composer un prompt avec le style `flash-nuit` ou `heritage` adapté au modèle,
une intention unique, une palette, une orientation et une liste d'exclusions.
Garder l'image sans texte lisible, logo, interface, QR, badge ou fausse capture.
Pour les exemples généralistes, privilégier une scène sûre et sans alcool ;
pour Mariage, Anniversaire et Baptême, préférer objets, lumière, décor et
gestes non identifiants aux visages générés.

Conserver avec l'asset : provider, modèle, prompt final, seed si disponible,
dimensions, date, licence ou source et empreinte. Ne jamais enregistrer une
clé API. Contrôler l'image entière avant de l'appeler « approuvée ».

Critère de fin : l'artwork a une provenance complète, les dimensions sont
vérifiées, il ne contient ni texte accidentel ni interface et le manifeste le
marque `draft` ou `approved` ; sans artwork requis, le statut vaut
`not-needed`.

### 5. Créer puis capturer la vraie Party

Exécuter une locale et un device à la fois. Créer une Party neuve avec le
runner existant, conserver les identifiants uniquement dans le terminal ou un
fichier temporaire local, régler la langue Bandaa, puis contrôler le nom, les
labels, la Mission et les membres dans le build.

Pour le set Store, suivre les six frames du protocole : `party`, `mission`,
`book`, `route`, `table`, `reveal`. Pour la landing, sélectionner seulement
les frames qui prouvent le claim du showcase. Capturer depuis le build réel sur
iPhone ; ajouter iPad si le manifeste le demande. Garder Android natif pour la
sortie Google. Une frame absente reste `CAPTURE DU BUILD RÉEL REQUISE`.

Versionner les sources dans les chemins déjà contractuels :

```text
docs/assets/bandaa-mobile/app-store-generator/public/screenshots/
  apple/iphone/<locale>/<frame>.png
  apple/ipad/<locale>/<frame>.png
  google/android-phone/<locale>/<frame>.png
  google/android-tablet/<locale>/<frame>.png
```

Critère de fin : chaque frame requise possède la dimension native attendue,
la route et le titre de locale corrects ; les captures n'ont ni permission,
overlay de développement, QR, token, ID, donnée personnelle ni débordement.

### 6. Composer la sortie

Utiliser le workbench local pour les overlays, la coque Apple, les captions et
les exports. La source reste immuable ; le workbench conserve les réglages de
composition et son `manifest.json`. Pour Android, respecter le rendu natif
décrit dans son README. Pour la landing, ne copier dans `web/public/landing/`
qu'une capture acceptée, avec sa provenance et sa locale ; l'artwork décoratif
reste identifiable comme artwork.

Associer dans le manifeste de sortie : `showcaseId`, surface, locale, device,
frame, claim, `sourceKind`, chemin source, chemin export, texte de caption,
compteur, statut de relecture et auteur de la validation. Garder les ZIP
transitoires hors du dépôt sauf demande explicite.

Critère de fin : l'export s'ouvre à sa taille réelle, chaque pixel vient d'une
source déclarée, chaque caption est dans la bonne locale et aucune composition
ne présente un placeholder comme une capture terminée.

### 7. Contrôler et transmettre

Exécuter les contrôles adaptés :

```bash
git diff --check
find docs/assets/bandaa-mobile/app-store-generator/public/screenshots \
  -type f -name '*.png' | sort
sips -g pixelWidth -g pixelHeight <fichier.png>
shasum -a 256 <fichier.png>
bun run scripts/validate-showcase.ts <manifest.json>
cd docs/assets/bandaa-mobile/app-store-generator
bun run typecheck
bun run build
```

Pour une landing, ouvrir le rendu sur desktop et mobile et contrôler le
débordement, les alt texts, la lisibilité et la hiérarchie. Relire les claims
contre `docs/PRD.md` : événement privé par invitation/QR, Missions, photos
partagées dans la Party, Book, Reveal, retrait/signalement ciblé, suppression
d'identité et règle 13+. Maintenir les frontières produit : pas de feed public,
profils ou réseau social, reconnaissance faciale, IA produit, promesse de
stockage permanent des bruts, prix non validé ou disponibilité non confirmée.

Le handoff doit lister les fichiers exacts, la matrice locale/device/frame, les
commandes exécutées, les preuves visuelles, les claims utilisés et les
décisions qui restent au propriétaire. Signaler les captures manquantes plutôt
que les renommer pour remplir une matrice.

Critère de fin : le handoff permet à un autre agent de régénérer ou de recapturer
chaque artefact, les checks listés passent, les risques sont nommés et aucune
décision humaine ouverte n'est présentée comme validée.

## Branches de sortie

- **Landing examples** : artwork d'ambiance facultatif + captures iPhone réelles
  qui prouvent le parcours. Le set standard est `party` (privé), `mission`
  (rythme), `book` (transformation) et `reveal` (découverte) ; réduire à
  `mission`, `book`, `reveal` seulement si la section ne revendique pas l'accès
  privé. Commencer par des briefs séparés par modèle et locale, puis demander
  la validation humaine du titre et du claim avant copie dans
  `web/public/landing/`.
- **Apple Store** : iPhone par défaut, iPad si le listing Apple le requiert ;
  overlays et coque sont une composition, jamais une modification du build.
- **Google Play** : captures Android natives et dimensions du device ; aucune
  coque Apple ni caption marketing ne doit se glisser dans cette sortie.
- **Design review** : conserver les placeholders explicites tant qu'une capture
  de build n'existe pas.

## Résolution des blocages

- Modèle déclaré dans une spec mais absent du code : livrer le brief et le
  catalogue, statut `brief-only`, sans créer une fausse Party.
- Titre, locale ou Mission incorrects : arrêter, corriger la fixture et
  recapturer ; ne pas retoucher le PNG.
- Capture manquante ou mauvaise dimension : garder
  `CAPTURE DU BUILD RÉEL REQUISE` et bloquer l'export concerné.
- Artwork incohérent ou visage non naturel : retourner au prompt et au provider
  approuvés ; ne pas le présenter comme preuve produit.
- Claim sans source livrée : retirer le claim ou le marquer `à valider` dans le
  handoff.

Le skill ne porte aucun code d'atelier dans l'application mobile, `web/` ou les
pages légales. Il orchestre les scripts et le workbench existants.

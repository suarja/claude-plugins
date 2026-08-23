# Atelier de création des assets Bandaa

Ce document est la référence de travail du skill `bandaa-showcase-assets`.
Il décrit la chaîne complète : brief → artwork → fixture → capture réelle →
composition → export. Les fichiers exécutables du dépôt restent la vérité de
l'exécution ; ce document fixe leur rôle et les contrôles qui les entourent.

## 1. Les quatre familles d'assets

| Famille | Rôle | Source actuelle | Traitement |
| --- | --- | --- | --- |
| Artwork généré | hero, ambiance ou décor de landing | `scripts/` et `tools/demo-assets/` | prompt + provenance + revue humaine |
| Images de fixture | photos seedées dans une Party de démonstration | `tools/demo-assets/collections/` | collection nommée, scénario réel |
| Capture du build | preuve de l'interface et du parcours | build Expo sur iPhone/iPad/Android | aucune interface dessinée par-dessus |
| Composition | caption, coque Apple, format Store ou section landing | workbench local et `web/public/landing/` après validation | manifest export + contrôle visuel |

Une illustration générée peut vendre une atmosphère. Elle ne peut pas prouver
qu'une route mobile existe. Une capture du build peut prouver une fonctionnalité.
Elle ne doit pas être retouchée pour corriger une locale, un titre ou une
fixture.

## 2. Direction visuelle

La structure commune est le journal d'expédition : route, chapitres,
snapshots, notes et découverte. Le modèle d'événement change l'émotion et la
palette ; il ne crée pas une fonctionnalité que l'app ne possède pas.

### `flash-nuit`

| Token | Valeur de référence | Usage |
| --- | --- | --- |
| canvas | `#0f0e12` | fond noir bleuté |
| panel | `#1a181f` | surface et panneau |
| heading | `#f4efe4` | titre crème |
| body | `#c9c2b4` | texte courant |
| muted | `#8f8a94` | information secondaire |
| accent | `#ff5c47` | action ou tampon |
| gold | `#ffd166` | repère et lumière flash |
| neon | `#ef5da8` | pic d'activité, avec parcimonie |

### `heritage`

| Token | Valeur de référence | Usage |
| --- | --- | --- |
| canvas | `#f2e9d5` | papier clair |
| heading | `#382b26` | encre |
| muted | `#8a6d4f` | sépia |
| accent | `#b7472e` | rouge tampon |

Pour l'interface et les overlays, utiliser les fontes déjà présentes dans le
projet : Newsreader pour l'éditorial, Hanken Grotesk pour l'UI, JetBrains Mono
pour les métadonnées et Caveat pour le manuscrit Polaroid. Dans une image
générée, laisser la typographie vide : les mots seront ajoutés au workbench ou
par la landing avec une fonte contrôlée.

## 3. Brief d'image

Écrire chaque prompt dans cet ordre :

```text
sujet unique → contexte du modèle → palette/style → cadrage et lumière
→ matière et mouvement → exclusions → orientation et ratio
```

Garder une seule intention visuelle, un sujet principal et un ou deux éléments
secondaires. Décrire les matières (papier, bois, lin, verre fumé, métal), la
lumière et le grain plutôt qu'une liste d'objets. Ajouter systématiquement les
exclusions : texte lisible, lettres, logo, UI, QR, watermark et fausse capture.

Pour le catalogue initial :

- Soirée entre amis : appareil photo, détails partagés, mouvement et lumière
  flash ; rester ouvert et éviter de réduire Bandaa à une soirée alcoolisée.
- Mariage : bouquet, papier, tissu et lumière dorée ; ne pas promettre une
  fonction dédiée au mariage.
- Anniversaire : gâteau, bougies, confettis et accent corail ; ne pas générer
  de prénom réel ou de texte dans le gâteau.
- Baptême : linge clair, fleurs et table familiale ; ne pas générer d'enfant
  identifiable ni de document religieux lisible.

Pour les exemples généralistes, l'absence d'alcool est la valeur par défaut.
Une scène de fête doit suggérer la joie par la lumière, la pose et le mouvement,
pas par des bouteilles ou des verres.

## 4. Providers et scripts existants

Choisir le provider dans le manifeste avant de lancer une génération. Ne jamais
copier une clé dans un prompt, un JSON ou un commit.

| Usage | Script | Variable | Sortie |
| --- | --- | --- | --- |
| Visages et scènes humaines de qualité | `scripts/generate-replicate-images.ts` | `REPLICATE_API_TOKEN` | `tools/demo-assets/collections/book-cover/hero-replicate.jpg` |
| Artwork marketing OpenAI direct | `scripts/generate-openai-images.ts` | `OPENAI_API_KEY` | `tools/demo-assets/collections/book-cover/hero-openai.jpg` |
| Artwork via gateway | `scripts/generate-images.ts` | `AI_GATEWAY_API_KEY` | collections déclarées dans le script |
| Flux gateway historique | `scripts/generate-gateway-images.ts` | `AI_API_GATEWAY` | `tools/demo-assets/collections/book-cover/hero-gateway.jpg` |
| Ambiance sans visage, prototype | `tools/demo-assets/generate-images.ts` | aucune | `tools/demo-assets/collections/` |
| Collection de photos de Party | `tools/demo-assets/generate-full-party-images.ts` | Replicate optionnel | `tools/demo-assets/collections/full-party/` |
| Trois images de base | `tools/demo-assets/generate-base-images.ts` | `REPLICATE_API_TOKEN` | `tools/demo-assets/collections/base-images/` |

Les scripts historiques ont des briefs et des noms de fichiers spécialisés.
Les réutiliser tels quels seulement si leur sortie correspond au manifeste.
Pour une nouvelle série, commencer par un brief, une copie du script ou une
extension explicitement relue ; ne pas multiplier les générateurs ad hoc.

Commandes de référence :

```bash
REPLICATE_API_TOKEN=... bun run scripts/generate-replicate-images.ts
OPENAI_API_KEY=... bun run scripts/generate-openai-images.ts
AI_GATEWAY_API_KEY=... bun run scripts/generate-images.ts
bun run tools/demo-assets/generate-images.ts --dry-run
bun run tools/demo-assets/generate-full-party-images.ts
```

Un run sans clé ou en `--dry-run` est une préparation. Une génération réussie
reste `draft` jusqu'au contrôle visuel et à la provenance.

## 5. Fixture et locale

La fixture Store stable est créée par :

```bash
bun run tools/demo-assets/scenarios/store-capture.ts \
  create --collection full-party-v3 --locale <fr|en|es>
```

Elle utilise aujourd'hui le modèle `freeform`, une Mission active et les titres
`Les potes`, `The Crew`, `El coro`. Les modèles Mariage, Anniversaire et Baptême
sont documentés dans `docs/specs/shipaton/e-event-templates-scheduling.md`, mais
leurs runners, textes et versions publiées doivent être vérifiés avant toute
capture dédiée.

La locale doit être réglée dans Bandaa, puis vérifiée dans les labels de l'écran,
le titre de la Party, la Mission, les pseudonymes synthétiques et les textes du
Book. Un titre de groupe est écrit directement dans chaque langue ; ce n'est
pas une traduction littérale obligatoire.

### Mission spécifique au scénario

Le runner Store conserve actuellement `unnoticed-detail` comme Mission de
secours de la fixture `freeform`. Son texte (« Le détail que personne ne
remarque » et ses variantes) ne doit pas devenir le titre par défaut des
showcases Mariage, Anniversaire, Baptême ou Vacances.

Pour un nouveau scénario, préparer deux champs éditoriaux distincts :

| Champ | Exigence |
| --- | --- |
| `missionTitle` | court, idiomatique, propre au contexte et à la locale |
| `missionInstruction` | verbe d'action + sujet photographiable + contrainte utile |

Exemple de brouillon Mariage, uniquement pour expliquer la séparation :
`Le détail du grand jour` / `Photographiez un ruban, un bouquet ou une lumière
de la cérémonie.` Cette proposition n'est pas une copie validée. Une Mission
reste `draft` tant que son adéquation au modèle, au programme temporel, aux
images et au Book n'a pas été relue par un humain natif.

## 6. Capture et composition

Le set landing standard est : `party`, `mission`, `book`, `reveal`. Il met en
scène privé → rythme → transformation → découverte. Ajouter `route` ou `table`
uniquement si la composition a besoin de prouver cette vue précise.

Les captures Store complètes suivent : `party`, `mission`, `book`, `route`,
`table`, `reveal`.

| Cible | Source native | Export workbench courant | Présentation |
| --- | ---: | ---: | --- |
| iPhone | 1206 × 2622 | 1320 × 2868 | coque et overlay Apple |
| iPad Air 13 pouces | 2048 × 2732 | 2048 × 2732 | coque et overlay Apple si requis |
| Android phone | 1080 × 2400 | 1080 × 1920 | capture native Google |
| Android tablet | 1600 × 2560 | 1600 × 2560 | capture native Google, sans crop |

Le workbench ne fabrique aucune interface de remplacement. Les captures
manquantes restent `CAPTURE DU BUILD RÉEL REQUISE`. La landing utilise d'abord
l'iPhone ; l'iPad est une preuve responsive ou Store, pas une obligation pour
chaque section.

## 7. Provenance et versionnage

Créer un manifeste par `showcaseId` et locale avec ces champs :

```text
schemaVersion, showcaseId, surface, eventTemplate, locale, appLanguage,
title, claim, frames, artwork, fixture, outputs, review, ownerDecision
```

Pour chaque artwork, conserver provider, modèle, prompt final, seed si présent,
dimensions, date, source/licence et SHA-256. Pour chaque capture, conserver
device, route, locale, dimension native, chemin source et statut de relecture.
Les exports ZIP, IDs de Party, QR, tokens, secrets et fichiers temporaires
restent hors du dépôt.

Chemins versionnés :

```text
docs/assets/bandaa-mobile/app-store-generator/public/screenshots/<store>/<device>/<locale>/<frame>.png
web/public/landing/<locale>/<showcaseId>/        # après validation humaine
```

## 8. Contrôles

```bash
bun run scripts/validate-showcase.ts <manifest.json>
sips -g pixelWidth -g pixelHeight <asset>
shasum -a 256 <asset>
git diff --check
```

Contrôler l'image à sa taille réelle, la lisibilité des overlays, le ratio du
texte, l'absence de débordement sur mobile et l'absence de données personnelles.
Relire chaque claim contre le PRD et chaque titre par un humain natif avant de
marquer `approved`.

## 9. Use cases détaillés

### A. Capture Store complète — cas réellement utilisé

Objectif : obtenir les preuves Apple/Google du parcours produit réel, dans une
locale et sur un device à la fois.

```text
full-party-v3
  → tools/demo-assets/scenarios/store-capture.ts create
  → Party live + Mission active + 21 Shots seedés
  → build réel : party / mission
  → store-capture.ts finish
  → Book prêt : book / route / table / reveal
  → app-store-generator
  → PNG/ZIP + manifest.json
```

Étapes effectives :

1. Utiliser `full-party-v3`, jamais une ancienne collection sans comparaison.
2. Créer la Party avec `--locale fr|en|es`, puis régler la langue Bandaa dans
   l'appareil et contrôler le titre (`Les potes`, `The Crew`, `El coro`).
3. Capturer `app/party/[id].tsx` et `app/party/[id]/camera.tsx` depuis le build.
4. Terminer avec `finish --party-id <id-local>`, attendre `book.status=ready` et
   capturer `app/book/[bookId].tsx` et `app/reveal/[sessionId].tsx`.
5. Copier les PNG dans le chemin Apple/Google correspondant et les précharger
   dans le workbench.

Sortie : six captures réelles par locale et device. Les identifiants de Party,
codes, tokens et URLs signées restent temporaires.

### B. Démo Book minimale

Objectif : tester rapidement une couverture ou un état de Book sans recréer une
soirée complète.

- Script : `tools/demo-assets/scenarios/simple-party.ts`.
- Assets : `tools/demo-assets/collections/base-images/`.
- Sortie : un Chapter et un hero pour vérifier le pipeline de couverture.
- Usage : diagnostic ou prototype ; pas une preuve Store complète.

### C. Book multi-chapitres

Objectif : vérifier la chronologie, la Route et la structure narrative.

- Script : `tools/demo-assets/scenarios/three-chapters.ts`.
- Assets : `tools/demo-assets/collections/base-images/`.
- Sortie : Book à trois Chapters, utile pour Route/Chapter/Book.
- Usage : support de développement ; recapturer depuis le build avant toute
  utilisation marketing.

### D. Moment multi-angle

Objectif : montrer la valeur différenciante des Missions et des prises
synchronisées.

- Script : `tools/demo-assets/scenarios/sync-moment.ts`.
- Assets : `tools/demo-assets/collections/book-cover/`.
- Sortie : un Moment multi-angle issu de plusieurs auteurs.
- Claim : les Missions donnent une raison de capturer au même moment ; ne pas
  le transformer en score, classement ou jeu.

### E. Tests de propagation et de données

Objectif : vérifier les transitions de hero, métadonnées et R2 sans produire un
asset marketing.

- Script : `tools/demo-assets/scenarios/t3-propagation.ts`.
- Référence : `docs/testing/demo-pipeline-architecture.md`.
- Sortie : cas technique de propagation/remplacement ; aucun screenshot Store.

### F. Design Chart

Objectif : valider la direction visuelle et le fil narratif avant une capture.

- Fichier : `docs/mockups/design-chart.html`.
- Source visuelle actuelle : captures réelles du workbench et placeholders
  `CAPTURE DU BUILD RÉEL REQUISE` quand une source manque.
- Règle : le HTML montre la composition et les claims, jamais une fausse
  interface mobile.
- Validation : ouvrir desktop et mobile ; vérifier typographie, débordement,
  hiérarchie et séparation artwork/capture.

`docs/mockups/store-creative-workbench.html` est l'ancien prototype HTML de
composition. Il est conservé pour l'historique et le localStorage, mais le
workbench Next.js sous `docs/assets/bandaa-mobile/app-store-generator/` est la
sortie opératoire actuelle.

### G. Workbench Store

Objectif : transformer les sources réelles en exports Apple/Google sans toucher
au mobile.

- Frames : `src/app/_data/frames.ts` — hero + `party`, `mission`, `book`,
  `route`, `table`, `reveal`.
- Devices : `src/app/_data/devices.ts` — iPhone, iPad, Android phone, Android
  tablet et leur mode `marketing-frame` ou `native-capture`.
- Copy : `src/app/_data/copy.ts` — captions candidates séparées de la capture.
- Listings : `src/app/_data/listings.ts` — champs Apple/Google en draft.
- Export : `src/app/_lib/export-bundle.ts` — PNG/JPEG/ZIP et manifest de
  provenance.
- Placement : `src/app/_components/caption-layout-controls.tsx` et
  `src/app/_lib/use-caption-layout.ts` — réglages locaux de caption Apple.

La coque, la caption et l'artwork sont appliqués uniquement à la composition
Apple. Google reçoit les captures Android natives sans coque Apple ni caption
marketing. Les téléchargements ZIP sont des exports ; les sources restent les
PNG versionnés sous `public/screenshots/`.

### H. Landing locale

Objectif : démontrer la promesse avec des preuves produit réelles, sans
prétendre que les captures proviennent du rendu web.

- Source : `docs/assets/bandaa-mobile/app-store-generator/public/screenshots/apple/iphone/<locale>/`.
- Destination après validation : `web/public/landing/<locale>/`.
- Set hero : `party`, `mission`, `book`.
- Set preuve : `mission`, `book`, `reveal`.
- Copy : événement privé → Missions → Book → Reveal, avec revue par locale.

Le hero généré peut donner le ton, mais les cartes qui décrivent l'application
doivent utiliser une capture du build réel et un `alt` exact.

### I. Modèles d'événements et B2B

Objectif : préparer les futurs examples Mariage, Anniversaire et Baptême sans
les présenter comme des fonctions déjà capturées.

- Source de modèle : `docs/specs/shipaton/e-event-templates-scheduling.md`.
- Catalogue de titres et briefs : `references/showcase-catalog.md`.
- Statut actuel : `brief-only` pour ces trois modèles.
- Preuve visée : `party → mission → book → reveal`, seulement après vérification
  du runner, de la version du modèle, des Quests et des textes localisés.
- B2B : réservé à une phase future avec audience, droits de marque et claims
  validés.

Le PRD garde les soirées entre amis comme use case cible. Un exemple de modèle
sur la landing est donc une démonstration éditoriale de la structure Bandaa,
pas une nouvelle promesse produit.

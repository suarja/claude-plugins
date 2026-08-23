# Protocole de capture Store Bandaa

> Ce document est l’adaptateur Bandaa du pipeline générique
> [app-showcase-pipeline](https://github.com/suarja/claude-plugins/tree/main/plugins/mobile-visual-validation/skills/app-showcase-pipeline).
> Il conserve uniquement la matrice actuelle, les fixtures, les chemins et les
> preuves propres au dépôt. Le workflow réutilisable reste dans le skill
> marketplace et les règles de provenance dans le skill
> bandaa-showcase-assets.

Date de mise à jour : 23 août 2026

Statut : storyboard validé ; captures du build de livraison et revue humaine
encore requises.

## Périmètre actuel

Cette passe couvre la locale française, quatre familles de devices et deux
sorties Store. Les locales anglaise et espagnole sont différées jusqu’à la
validation du parcours français.

| Sortie | Frames | Statut |
| --- | ---: | --- |
| Apple App Store | 10 | requises, à capturer |
| Google Play | 8 | requises, à capturer |
| Variantes internes | book-cover, host-participants | hors série publiée |

| Store | Device | Capture native attendue | Export de travail |
| --- | --- | ---: | ---: |
| Apple | iPhone 17 Pro | 1206 × 2622 | 1320 × 2868 |
| Apple | iPad Air 13 pouces | 2048 × 2732 | 2048 × 2732 |
| Google Play | Medium_Phone | 1080 × 2400 | 1080 × 1920 |
| Google Play | pixel_tablet | 1600 × 2560 | 1440 × 2560 |

Les limites et dimensions officielles doivent être revérifiées au moment de la
soumission : [Apple screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)
et [Google Play preview assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en).

## Frames et sources réelles

La série Apple française suit cet ordre :

1. home-hub — app/(tabs)/index.tsx
2. event-types — app/party/type.tsx
3. scheduled-countdown — app/party/[id].tsx
4. host-hub — app/party/[id]/host.tsx
5. host-missions — app/party/[id]/host/missions.tsx
6. party-board — annonce réelle dans app/party/[id].tsx
7. live-mission — app/party/[id]/camera.tsx
8. vertical-feed — Fil vertical dans app/party/[id].tsx
9. book-moments — app/book/[bookId].tsx
10. reveal — app/reveal/[sessionId].tsx

Google Play reprend event-types, scheduled-countdown, host-hub,
host-missions, live-mission, vertical-feed, book-moments et reveal.

party-board et vertical-feed restent deux preuves différentes. Le Tableau
organise la soirée ; le Fil montre les moments capturés. Le composant Table
historique ne doit pas être utilisé comme preuve de vertical-feed.

## Run Bandaa

Un seul checkout actif, un seul Metro et un seul device sont utilisés à la
fois. La capture part d’un development build réel, jamais d’Expo Go.

~~~sh
just start-capture
just serve-sim
bun run tools/demo-assets/scenarios/wedding-capture.ts create --locale fr
~~~

La fixture française est Le grand jour. Les textes et membres sont synthétiques
et doivent être créés par le runner réel. Ne jamais versionner partyId, code,
token, QR, nom de build temporaire ou chemin temporaire.

Après les frames live, terminer la fixture avec l’identifiant local conservé
uniquement dans le terminal :

~~~sh
bun run tools/demo-assets/scenarios/wedding-capture.ts finish --party-id <id-local>
~~~

Une capture absente reste CAPTURE DU BUILD RÉEL REQUISE. Une capture correcte
reste draft ou à relire jusqu’à la revue propriétaire.

## Chemins canoniques

~~~text
docs/assets/bandaa-mobile/app-store-generator/public/screenshots/
├── apple/iphone/<locale>/<frame>.png
├── apple/ipad/<locale>/<frame>.png
├── google/android-phone/<locale>/<frame>.png
└── google/android-tablet/<locale>/<frame>.png
~~~

Les captures réelles restent immuables. Une coque, une caption, un artwork ou
un overlay est une composition séparée et ne remplace jamais les pixels du
build.

## Preuves de fermeture

Pour chaque source et chaque export, conserver la locale, le device, la route ou
l’état, les dimensions natives et exportées, le chemin, l’empreinte, le statut
de revue et la commande exacte.

Contrôles locaux :

~~~sh
git diff --check
cd docs/assets/bandaa-mobile/app-store-generator
bun run typecheck
bun run build
~~~

Le compte rendu sépare PASS, FAIL, NOT RUN et BLOCKED pour la source, le
préflight, le rendu, le device, la locale et la revue propriétaire. Un test
automatisé ou un aperçu navigateur ne prouve pas une capture native ni
l’acceptation par un Store.

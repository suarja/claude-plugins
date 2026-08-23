# Deep links Bandaa

Les conventions génériques de navigation Expo Router sont couvertes par le
skill marketplace officiel
[`expo-router`](https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-router).
Ce document conserve uniquement le contrat Bandaa : formats publics et natifs,
admission Reveal, associations de domaine et preuves attendues.

## Contrat canonique

Le domaine public de Bandaa est `<PUBLIC_DOMAIN>`.

Les liens destinés au partage externe utilisent HTTPS :

- `https://<PUBLIC_DOMAIN>/j/CODE` — invitation à rejoindre une Party ;
- `https://<PUBLIC_DOMAIN>/reveal/SESSION_ID?code=CODE&inviteToken=TOKEN` — invitation Reveal, lorsque ce parcours est partagé hors de l'app.

Le scheme `<APP_SCHEME>://` reste nécessaire pour les tests locaux et les development
builds, mais n'est pas le format public canonique :

- `<APP_SCHEME>://j/CODE` ;
- `<APP_SCHEME>://reveal/SESSION_ID?code=CODE&inviteToken=TOKEN`.

Les deux formats doivent converger vers les mêmes routes Expo Router et les
mêmes contrôles d'accès. Un lien seul ne remplace jamais la session appareil ni
le Membership.

## Rôle de chaque couche

### App mobile

Expo Router fournit le routage des pages. Le scheme `bandaa` est déclaré dans
`app.json` pour les development builds et les builds distribués.

Les notifications Mission et Reveal concernent des appareils où l'app est déjà
installée : elles peuvent transporter une route ou des paramètres applicatifs
directs et ne dépendent pas d'un App Link HTTPS.

### Site Next.js

Le projet `web/` héberge la landing et les pages publiques. Les routes de
fallback à prévoir sont :

- `/j/[code]` ;
- `/reveal/[sessionId]`.

Si l'app installée est associée au domaine, le système ouvre l'app et ces pages
ne sont pas affichées. Sinon, elles expliquent le parcours et proposent le
fallback public validé. Les liens de store ne doivent pas être inventés avant
la publication des fiches.

Le deferred deep linking reste hors périmètre : après une installation depuis
le store, la reprise automatique d'un code ou d'un `inviteToken` n'est pas
garantie par ce contrat.

### Association de domaine

Android App Links :

- `expo.android.intentFilters` pour `https://<PUBLIC_DOMAIN>/j/*` et
  `https://<PUBLIC_DOMAIN>/reveal/*` ;
- `https://<PUBLIC_DOMAIN>/.well-known/assetlinks.json` ;
- package `<APP_PACKAGE_OR_BUNDLE_ID>` ;
- empreinte SHA-256 de la signature Play App Signing, jamais une valeur inventée.

iOS Universal Links :

- `expo.ios.associatedDomains: ["applinks:<PUBLIC_DOMAIN>"]` ;
- `https://<PUBLIC_DOMAIN>/.well-known/apple-app-site-association` ;
- Team ID Apple réel et bundle `<APP_PACKAGE_OR_BUNDLE_ID>`.

Ces fichiers doivent être servis en HTTPS, sans redirection et avec un contenu
valide. Toute modification de `app.json` impose une reconstruction native.

## Données privées Reveal

`inviteToken` est un secret d'admission. Une page web de fallback ne doit pas
l'afficher, l'envoyer à des analytics, ni charger de ressources tierces avec ce
paramètre. Le comportement quand l'app n'est pas installée doit être validé
avant d'exposer le lien Reveal HTTPS au partage externe.

## État actuel

- `app.json` déclare `scheme: "bandaa"`, `associatedDomains` et les filtres
  Android HTTPS pour `<APP_PACKAGE_OR_BUNDLE_ID>` ;
- les routes web `/j/[code]`, `/reveal/[sessionId]` et les handlers
  `/.well-known/` existent dans `web/` et disposent de tests ;
- le handler AASA iOS déclare l’App ID Bandaa, tandis qu’Android reste
  volontairement non associé (`[]`) tant que
  `BANDAA_ANDROID_PLAY_APP_SIGNING_SHA256` n’est pas présent et valide ;
- le déploiement public de `<PUBLIC_DOMAIN>`, le DNS, l’empreinte Play réelle et la
  preuve sur builds signés restent `NOT RUN` ; le scheme `<APP_SCHEME>://` peut être
  testé localement indépendamment.

## Validation attendue

1. `bun run build` depuis `web/` ;
2. vérifier les routes publiques en navigateur mobile et desktop ;
3. vérifier les deux fichiers `.well-known` avec `curl` ;
4. tester `<APP_SCHEME>://` sur development build Android et iOS ;
5. tester HTTPS à froid et à chaud sur des builds signés correspondant aux
   associations publiées.

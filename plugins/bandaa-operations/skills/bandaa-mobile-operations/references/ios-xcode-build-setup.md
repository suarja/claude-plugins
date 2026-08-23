# Build iOS local avec Xcode — Bandaa

Ce guide décrit le premier flux iOS local pour Bandaa : compiler et lancer le
development build avec Xcode, puis préparer une archive TestFlight. Expo reste
le socle du projet et génère le projet natif ; Xcode prend en charge la
compilation, la signature et l’installation locale.

Pour les procédures génériques EAS de build, soumission, TestFlight et
workflows CI/CD, utiliser les skills marketplace officiels
[`eas-app-stores`](https://github.com/expo/skills/tree/main/plugins/expo/skills/eas-app-stores)
et
[`eas-workflows`](https://github.com/expo/skills/tree/main/plugins/expo/skills/eas-workflows).
Le protocole Bandaa de contenu PROD et de publication reste dans
[`testflight-production-publication.md`](testflight-production-publication.md).

Pour le premier test de bout en bout paiement + notification, utiliser un vrai
iPhone dès que possible. Le simulateur est utile pour le lancement et
l’interface, mais ne constitue pas la preuve finale d’un achat StoreKit ou de
la réception d’un push APNs.

## Décision de workflow

| Besoin | Flux retenu |
|---|---|
| Développement local rapide | Xcode + development build + Metro |
| Paiement synthétique | RevenueCat Test Store dans une build Debug |
| Paiement Apple sandbox | Clé iOS RevenueCat + appareil Apple de test |
| Notification réelle | `expo-notifications` + Expo Push Service + APNs |
| Archive / TestFlight | Xcode, configuration `Release` |
| Build reproductible CI plus tard | EAS Build, sans changer le code produit |

Le cloud EAS n’est donc pas nécessaire pour cette première compilation locale.
Il reste utile plus tard pour partager des builds signés et reproduire la
chaîne de release.

## État actuel du dépôt

- Nom affiché : `Bandaa`
- Bundle identifier iOS : `<IOS_BUNDLE_ID>`
- Schéma Xcode : `Bandaa`
- Workspace à ouvrir : `ios/Bandaa.xcworkspace`
- Projet EAS : `<EAS_PROJECT_ID>`
- Déploiement iOS minimum : `16.4`
- Entitlement push présent : `ios/Bandaa/Bandaa.entitlements`

Le dossier `ios/` est généré et ignoré par Git dans l’état actuel du projet.
Sur un checkout neuf, il faut donc régénérer le projet natif avant d’ouvrir
Xcode. Ouvrir le workspace `.xcworkspace`, jamais le `.xcodeproj`, car les
Pods doivent être chargés.

## 1. Préparer la machine

Installer ou vérifier :

- macOS avec Xcode et les Command Line Tools ;
- un compte Apple Developer pour signer un appareil et utiliser APNs/TestFlight ;
- Bun et CocoaPods ;
- un iPhone enregistré et déverrouillé pour la preuve physique.

Depuis la racine du dépôt :

```bash
cd <REPO_ROOT>
bun install
```

Si `ios/` n’existe pas encore :

```bash
bunx expo prebuild --platform ios
```

Puis installer ou remettre à jour les Pods :

```bash
pod install --project-directory=ios
```

Après une dépendance native ajoutée ou mise à jour, refaire `bun install`, les
Pods et le build Xcode. Ne pas utiliser `expo prebuild --clean` sans vérifier
les changements natifs locaux : cette option peut régénérer le dossier iOS.

## 2. Variables d’environnement

Expo charge automatiquement les fichiers `.env` standards et remplace les
références `process.env.EXPO_PUBLIC_*` dans le bundle JavaScript. Ces valeurs
sont donc visibles dans l’application compilée : elles ne doivent jamais être
des secrets.

### Variables du client iOS

À mettre dans le fichier local ignoré `.env.local` :

| Variable | Usage | Debug Test Store | Release Apple sandbox / production |
|---|---|---:|---:|
| `EXPO_PUBLIC_CONVEX_URL` | URL Convex utilisée par l’app | requise | requise |
| `EXPO_PUBLIC_CONVEX_SITE_URL` | URL HTTP Convex, notamment le webhook | recommandée | requise côté configuration |
| `EXPO_PUBLIC_REVENUECAT_TEST_STORE_KEY` | Clé publique RevenueCat Test Store | requise | vide ou ignorée |
| `EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE` | Sélection explicite du Test Store | `true` | `false` |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | Clé publique de l’app iOS RevenueCat | vide possible | requise |

Exemple Debug synthétique :

```dotenv
EXPO_PUBLIC_CONVEX_URL=https://<CONVEX_DEPLOYMENT>.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://<CONVEX_DEPLOYMENT>.convex.site
EXPO_PUBLIC_REVENUECAT_TEST_STORE_KEY=test_<PUBLIC_KEY>
EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE=true
EXPO_PUBLIC_REVENUECAT_IOS_KEY=
```

Exemple Apple sandbox ou production :

```dotenv
EXPO_PUBLIC_CONVEX_URL=https://<CONVEX_DEPLOYMENT>.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://<CONVEX_DEPLOYMENT>.convex.site
EXPO_PUBLIC_REVENUECAT_TEST_STORE_KEY=
EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE=false
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_<PUBLIC_KEY>
```

Le code impose deux garde-fous : le Test Store n’est sélectionné qu’en
`__DEV__`, et une build `Release` utilise la clé iOS réelle. Après changement
d’une variable, arrêter puis relancer Metro avec un cache propre et recharger
l’app.

### Secrets serveur

Ces variables ne vont ni dans Xcode, ni dans `.env.local`, ni dans une variable
`EXPO_PUBLIC_*` :

```bash
npx convex env set REVENUECAT_WEBHOOK_AUTH "<WEBHOOK_SECRET>"
```

Le secret webhook doit être défini dans le même déploiement Convex que celui
référencé par `EXPO_PUBLIC_CONVEX_URL` et l’URL du webhook RevenueCat. Les clés
privées Apple (`.p8`), les comptes de service Firebase et les autres secrets de
fournisseurs restent hors du dépôt.

## 3. Premier lancement dans Xcode

1. Ouvrir le workspace :

   ```bash
   open ios/Bandaa.xcworkspace
   ```

2. Sélectionner le scheme `Bandaa` et une destination iPhone ou simulateur.
3. Dans **Target Bandaa → Signing & Capabilities** :
   - activer **Automatically manage signing** ;
   - sélectionner la bonne **Team** Apple ;
   - conserver `<IOS_BUNDLE_ID>` ;
   - vérifier que la capability **Push Notifications** est présente.
4. Pour une build Debug, démarrer Metro depuis la racine du dépôt :

   ```bash
   lsof -nP -iTCP:8081 -sTCP:LISTEN
   bunx expo start --dev-client --clear
   ```

   Il ne doit y avoir qu’un seul Metro actif pour le checkout utilisé.
5. Lancer avec **Run** dans Xcode.

Sur un iPhone physique, activer le Developer Mode, déverrouiller l’appareil,
accepter la relation de confiance et utiliser le même Wi-Fi que le Mac. Si le
réseau local n’est pas possible, utiliser le
[skill marketplace expo-metro-tunneling](https://github.com/suarja/claude-plugins/tree/main/plugins/mobile-visual-validation/skills/expo-metro-tunneling).

Pour ce flux, ne pas utiliser Expo Go : RevenueCat et le reste des modules
natifs doivent être présents dans le development build Bandaa.

## 4. Validation paiement

### Test Store local

Dans RevenueCat, vérifier avant de lancer l’app :

- le produit lifetime de test existe ;
- l’entitlement s’appelle exactement `organizer_pass` ;
- l’offering courante s’appelle `default` ;
- un package lifetime est disponible dans cette offering.

Dans l’app Debug :

- l’offering et le prix chargé par le SDK sont visibles ;
- achat réussi, annulation et erreur sont récupérables ;
- la Party est créée après activation de l’entitlement, sans double appui ;
- **Restaurer** fonctionne sans achat actif et avec un achat actif ;
- une Party existante, son Book et son Reveal restent accessibles.

Le Test Store valide le câblage natif et le parcours UI. Il ne valide pas le
paiement Apple réel ni la soumission App Store.

### Apple sandbox / production

Mettre `EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE=false`, renseigner
`EXPO_PUBLIC_REVENUECAT_IOS_KEY`, puis refaire un build natif. Vérifier ensuite
le produit et le compte de test dans App Store Connect / StoreKit. Ne jamais
mettre une clé `test_…` dans une archive Release.

Après le premier achat, vérifier séparément :

1. le store confirme l’achat ;
2. RevenueCat reçoit l’événement ;
3. le webhook Convex est accepté ;
4. l’entitlement local est matérialisé ;
5. l’écran de création reflète la capacité autorisée.

Un achat confirmé par le store sans webhook Convex accepté ne suffit pas à
prouver que le Pass est actif côté serveur.

## 5. Validation notification

La chaîne attendue est :

```text
permission iOS → ExpoPushToken → enregistrement dans la Party
→ ticket Expo → receipt Expo → notification affichée sur l’iPhone
```

Préparer :

- l’App ID Apple explicite `<IOS_BUNDLE_ID>` ;
- la capability **Push Notifications** activée pour cet App ID ;
- le credential APNs correspondant à `<IOS_BUNDLE_ID>`, pas celui de
  l’ancien bundle <LEGACY_PRODUCT_NAME> ;
- le `projectId` Expo déjà présent dans `app.json` ;
- un vrai iPhone pour la preuve finale.

Le build local Xcode ne supprime pas le besoin de configurer le credential APNs
du service d’envoi. La gestion documentée du credential est dans
[ios-push-setup.md](ios-push-setup.md).

Parcours de preuve :

1. installer le development build ;
2. rejoindre une Party avec **Missions de la soirée** activé ;
3. accepter la permission iOS ;
4. observer `permission-granted`, `token-obtained` puis `registered` dans les
   diagnostics de développement ;
5. mettre l’app en arrière-plan ;
6. lancer une Quête depuis le Host ;
7. vérifier la notification sur l’écran verrouillé ;
8. consulter le ticket et le receipt Expo si le message n’arrive pas.

Un token créé ou enregistré, et même un receipt Expo `ok`, ne prouvent pas à
eux seuls l’affichage sur l’appareil.

## 6. Archive Xcode et TestFlight

Avant l’archive :

- passer `EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE` à `false` ;
- renseigner la clé iOS RevenueCat de l’environnement visé ;
- vérifier l’URL Convex de l’environnement visé ;
- confirmer la version marketing et le numéro de build dans la configuration
  native / `app.json` ;
- refaire le smoke test paiement et notification sur une build signée.

Dans Xcode :

1. sélectionner le scheme `Bandaa` ;
2. choisir **Any iOS Device (arm64)** comme destination ;
3. sélectionner la configuration `Release` ;
4. lancer **Product → Archive** ;
5. dans Organizer, utiliser **Distribute App → TestFlight & App Store**.

L’archive doit être vérifiée avec les valeurs Release : le fait que le Debug
fonctionne avec le Test Store ne garantit pas que le bundle Release contient la
bonne clé iOS, le bon backend ou les bons entitlements.

## Checklist de fermeture

### Machine et binaire

- [ ] Xcode, Command Line Tools, Bun et CocoaPods disponibles
- [ ] `bun install` terminé
- [ ] `ios/Bandaa.xcworkspace` ouvert, pas `Bandaa.xcodeproj`
- [ ] Team Apple et signature automatique configurées
- [ ] Bundle ID `<IOS_BUNDLE_ID>` conservé
- [ ] Build Debug installé sur le simulateur ou l’iPhone
- [ ] Un seul Metro lancé depuis le checkout courant

### Variables et paiement

- [ ] `.env.local` présent et ignoré par Git
- [ ] `EXPO_PUBLIC_CONVEX_URL` pointe vers le déploiement voulu
- [ ] Test Store activé uniquement pour le Debug local
- [ ] Clé iOS réelle prévue pour Release
- [ ] `REVENUECAT_WEBHOOK_AUTH` défini dans Convex
- [ ] offering `default` et entitlement `organizer_pass` vérifiés
- [ ] achat, annulation, erreur et restauration testés
- [ ] webhook reçu et entitlement Convex vérifié

### Notifications

- [ ] App ID Apple exact et capability Push Notifications activée
- [ ] credential APNs Bandaa configuré
- [ ] permission iOS acceptée
- [ ] token obtenu puis enregistré dans la Party
- [ ] ticket/receipt Expo vérifié en cas d’échec
- [ ] notification réelle reçue sur un iPhone en arrière-plan

### Release

- [ ] version marketing et build number décidés
- [ ] Test Store désactivé dans l’environnement Release
- [ ] archive `Release` créée dans Xcode
- [ ] smoke test refait sur le build signé
- [ ] TestFlight utilisé avant toute soumission App Store

## Références

- [Configuration RevenueCat](revenuecat-setup.md)
- [Configuration push iOS / APNs](ios-push-setup.md)
- [Skill marketplace expo-metro-tunneling](https://github.com/suarja/claude-plugins/tree/main/plugins/mobile-visual-validation/skills/expo-metro-tunneling)
  pour le development build hors réseau
- [Expo — compilation locale iOS](https://docs.expo.dev/guides/local-app-development/)
- [Expo — variables d’environnement](https://docs.expo.dev/guides/environment-variables/)
- [Expo — configuration des push](https://docs.expo.dev/push-notifications/push-notifications-setup/)

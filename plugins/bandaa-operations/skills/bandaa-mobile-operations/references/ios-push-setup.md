# Config push iOS (APNs) — development, preview et production

> Objectif : recevoir les notifications de Missions sur un vrai iPhone avec
> le development build, puis dans les builds preview et production.

Les procédures génériques de development build et de release EAS sont
couvertes par les skills marketplace officiels
[`expo-dev-client`](https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-dev-client)
et
[`eas-app-stores`](https://github.com/expo/skills/tree/main/plugins/expo/skills/eas-app-stores).
Ce guide conserve seulement l’adaptation Bandaa : App ID, APNs, entitlement et
preuve de réception sur appareil.

## Réponse courte : faut-il créer une autre application ?

Non, pas avec la configuration actuelle. Bandaa utilise un seul identifiant
iOS : `<IOS_BUNDLE_ID>`, déclaré dans `app.json`. Il faut donc un seul
App ID explicite Apple pour cet identifiant, avec la capacité **Push
Notifications** activée.

Une deuxième App ID ne devient nécessaire que si l’on décide de donner au build
de développement un autre bundle identifier, par exemple
`<IOS_DEV_BUNDLE_ID>`. Ce n’est pas le modèle actuel et cela demanderait
une configuration EAS et un build distincts.

Références officielles : [créer un App ID Apple](https://developer.apple.com/help/account/identifiers/register-an-app-id),
[configurer les push Expo pour le développement et la production](https://docs.expo.dev/push-notifications/push-notifications-setup/).

Pour le parcours Android correspondant, voir [la configuration FCM Android](android-push-setup.md).

## Identité actuelle de Bandaa

- Bundle identifier : `<IOS_BUNDLE_ID>`
- Schéma : `<APP_SCHEME>://`
- Projet EAS : celui référencé par `extra.eas.projectId` dans `app.json`
- Entitlement local présent : `ios/Bandaa/Bandaa.entitlements` → `aps-environment`

Le renommage historique a laissé le projet EAS distant sous le slug `<LEGACY_EAS_SLUG>`
alors que le slug local est `bandaa`. Ne pas lancer `eas init` pour recréer un
projet ou remplacer l’UUID sans décision explicite : il faut conserver le
projet EAS existant et corriger ses credentials pour le nouvel App ID.

## Étape 1 — vérifier l’App ID Apple

Dans [Apple Developer](https://developer.apple.com/account/) :

1. Ouvrir **Certificates, Identifiers & Profiles** → **Identifiers**.
2. Rechercher l’App ID explicite `<IOS_BUNDLE_ID>`.
3. S’il existe, vérifier que **Push Notifications** est activé.
4. S’il n’existe pas, créer un App ID explicite avec exactement ce bundle
   identifier, puis activer **Push Notifications**.

Ne pas utiliser l’ancien App ID `<LEGACY_BUNDLE_ID>` pour un build Bandaa.
Apple associe le device token à l’app et à l’appareil ; un token d’une autre
app ne peut pas être réutilisé pour Bandaa. Voir [la documentation APNs
Apple](https://developer.apple.com/documentation/usernotifications/registering-your-app-with-apns).

## Étape 2 — vérifier le credential APNs dans EAS

Dans EAS, vérifier qu’une Push Notification Key est associée à
`<IOS_BUNDLE_ID>` avant chaque nouveau build ; ne pas la recréer par défaut.

Depuis le dépôt :

```bash
bunx eas-cli credentials -p ios
```

Puis :

1. Vérifier que l’application affichée est `<IOS_BUNDLE_ID>`.
2. Ouvrir **Push Notifications: Manage your Apple Push Notifications Key**.
3. Vérifier ou associer la clé au nouvel App ID uniquement si elle est absente.
4. Vérifier que l’Apple Team et le bundle identifier correspondent à Bandaa.

La clé `.p8` est un credential privé : ne pas la committer, ne pas la mettre
dans `google-services.json`, et ne pas la coller dans GitHub. Garder l’ancien
credential <LEGACY_PRODUCT_NAME> jusqu’à validation complète du nouveau build.

## Étape 3 — development build sur iPhone physique

Un simulateur peut aider à vérifier l’interface, mais la preuve de réception
pour cette correction doit être faite sur un vrai iPhone.

1. Enregistrer l’appareil si nécessaire :

   ```bash
   bunx eas-cli device:create
   ```

2. Vérifier que `build.development` contient bien `developmentClient: true`.
3. Construire le development build :

   ```bash
   bunx eas-cli build --platform ios --profile development
   ```

4. Installer le `.ipa` sur l’iPhone et activer le **Developer Mode** si iOS le
   demande.
5. Lancer Metro depuis le dépôt Bandaa :

   ```bash
   bunx expo start --dev-client --clear
   ```

6. Rejoindre ou créer une Party avec **Missions de la soirée** activé.
7. Accepter la permission iOS.
8. Vérifier dans le diagnostic local que les étapes `permission-granted`,
   `token-obtained` et `registered` apparaissent.
9. Mettre l’app en arrière-plan, lancer une Quête depuis le Host et vérifier
   la notification sur l’écran verrouillé.

Le token obtenu et l’activation de la Quête ne prouvent pas la réception. Il
faut observer la notification réelle et, si disponible, le ticket/receipt Expo.

## Étape 4 — preview et production

Les profils actuels utilisent le même bundle identifier. Ils ne demandent donc
pas une deuxième App ID Apple.

### Preview / distribution interne

Pour tester un build signé partagé à quelques appareils :

```bash
bunx eas-cli build --platform ios --profile preview
```

Les appareils doivent être enregistrés pour une distribution interne iOS. Un
nouvel appareil ajouté après le build nécessite un nouveau build ou une mise à
jour du profil de provisioning.

### Production / App Store

Pour le build destiné à TestFlight ou à l’App Store :

```bash
bunx eas-cli build --platform ios --profile production
bunx eas-cli submit --platform ios --profile production
```

Avant la première soumission :

- l’app doit exister dans App Store Connect ;
- son Bundle ID doit être `<IOS_BUNDLE_ID>` ;
- le credential APNs EAS doit être associé au même App ID ;
- le test doit être refait sur une version production/TestFlight, pas seulement
  sur le development build.

Les credentials de signature et de push sont gérés séparément du code source.
Une réussite de build ne prouve pas la livraison d’une notification.

## Dépannage iOS

| Symptôme | Vérification |
|---|---|
| Ancien <LEGACY_PRODUCT_NAME> reçoit, Bandaa ne reçoit pas | App ID et credential APNs : `<IOS_BUNDLE_ID>` doit être configuré séparément |
| Credential absent ou lié à l’ancien bundle | Vérifier l’App ID et associer le credential APNs à `<IOS_BUNDLE_ID>` |
| Permission acceptée mais aucun token | Rebuild development avec `expo-notifications` et entitlement push présents |
| Token enregistré mais aucune notification | Vérifier le ticket/receipt Expo, le credential APNs et le provisioning profile, puis rebuild |
| Test dans Expo Go | Non probant pour les push distantes ; utiliser le development build Bandaa |

# Config push Android (FCM) — development, preview et production

> Objectif : recevoir les push de Missions sur Android avec le development
> build, puis dans les builds preview et production.

## Réponse courte : faut-il créer une autre app Firebase ?

Non, pas avec la configuration actuelle. Bandaa utilise un seul package Android
(`<ANDROID_PACKAGE>`) dans `app.json` et dans `google-services.json`. Les
profils EAS `development`, `preview` et `production` réutilisent donc la
même app Android Firebase.

Il faut créer une deuxième app Android Firebase uniquement si l’on introduit un
autre package, par exemple `<ANDROID_DEV_PACKAGE>`. Firebase indique que le
package est sensible à la casse et ne peut pas être modifié pour une app
Android Firebase existante. Voir [la procédure Firebase officielle](https://firebase.google.com/docs/android/setup).

Une deuxième app Firebase n’est donc pas le correctif du problème actuel : il
faut compléter la configuration de `<ANDROID_PACKAGE>`.

Pour le parcours Apple correspondant, voir [la configuration APNs iOS](ios-push-setup.md).

## Identité actuelle de Bandaa

- Package Android : `<ANDROID_PACKAGE>`
- Fichier client : `google-services.json`
- Projet Firebase présent dans le fichier : `<FIREBASE_PROJECT_ID>`
- EAS project : celui référencé par `extra.eas.projectId` dans `app.json`
- Permission Android 13+ : `android.permission.POST_NOTIFICATIONS`

Le projet EAS distant est encore associé au slug historique `<LEGACY_EAS_SLUG>`, tandis
que le slug local est `bandaa`. Ne pas lancer `eas init` pour créer un nouveau
projet sans décision explicite : vérifier et compléter l’application
`<ANDROID_PACKAGE>` dans le projet EAS existant.

## Étape 1 — vérifier l’app Android Firebase existante

Dans [Firebase Console](https://console.firebase.google.com/) :

1. Ouvrir le projet Firebase Bandaa existant.
2. Dans **Project settings** → **Your apps**, rechercher l’app Android dont le
   package est exactement `<ANDROID_PACKAGE>`.
3. Si elle existe, télécharger à nouveau son `google-services.json` et vérifier
   que `client.android_client_info.package_name` vaut bien
   `<ANDROID_PACKAGE>`.
4. Si elle n’existe pas, ajouter une app Android dans ce projet avec exactement
   ce package, puis télécharger le fichier.
5. Remplacer le fichier racine uniquement par ce fichier client :

   ```
   <REPO_ROOT>/google-services.json
   ```

`google-services.json` contient des identifiants de configuration non secrets.
La clé privée de compte de service utilisée pour envoyer les push est un autre
fichier et ne doit jamais être committée.

## Étape 2 — configurer FCM v1 dans EAS

Dans Firebase :

1. **Project settings** → **Service accounts**.
2. Cliquer **Generate new private key**.
3. Télécharger le JSON privé et le conserver hors du dépôt.

Dans EAS, pour l’application Android `<ANDROID_PACKAGE>` :

```bash
bunx eas-cli credentials -p android
```

Puis sélectionner la gestion du **Google Service Account Key for Push
Notifications (FCM v1)** et téléverser ce JSON.

Si une clé FCM Legacy existe sans credential FCM v1 pour l’application, traiter
FCM v1 comme le chemin à valider et ne jamais publier la clé privée. Le chemin à valider est donc FCM v1 ; ne pas publier la clé
privée dans GitHub. Voir [la procédure FCM v1 d’Expo](https://docs.expo.dev/push-notifications/fcm-credentials/).

## Étape 3 — development build Android

### Appareil physique

1. Activer les options développeur et le débogage USB.
2. Vérifier l’appareil :

   ```bash
   adb devices
   ```

3. Construire et installer le development build :

   ```bash
   bunx eas-cli build --platform android --profile development
   ```

   Pour un build local déjà configuré :

   ```bash
   bunx expo run:android --device
   ```

4. Lancer Metro depuis le dépôt Bandaa :

   ```bash
   bunx expo start --dev-client --clear
   ```

### Émulateur

Un émulateur Android avec Google Play Services peut recevoir les push FCM.
Utiliser une image **Play Store**, pas une image AOSP sans Google Play Services.

## Étape 4 — tester le parcours réel

1. Créer ou rejoindre une Party avec **Missions de la soirée** activé.
2. Sur Android 13+, accepter la permission **Autoriser Bandaa à envoyer des
   notifications**.
3. Vérifier les diagnostics `permission-granted`, `token-obtained` et
   `registered`.
4. Mettre l’app en arrière-plan.
5. Depuis le Host, lancer une Quête **Maintenant**.
6. Vérifier la notification système dans la minute et, si disponible, le
   ticket/receipt Expo.

Un token obtenu ou enregistré ne prouve pas la réception. Même un receipt Expo
`ok` confirme seulement que le service APNs/FCM a accepté le message, pas que
le téléphone l’a affiché. Voir [la documentation d’envoi Expo](https://docs.expo.dev/push-notifications/sending-notifications/).

## Étape 5 — preview et production

Avec le package actuel, les trois profils réutilisent la même app Firebase :

| Profil | Usage | Commande | Preuve attendue |
|---|---|---|---|
| `development` | dev client, appareil physique ou émulateur Play Store | `bunx eas-cli build --platform android --profile development` | permission, token, notification réelle |
| `preview` | distribution interne | `bunx eas-cli build --platform android --profile preview` | notification sur l’APK/AAB interne |
| `production` | Google Play | `bunx eas-cli build --platform android --profile production` | notification sur la version Play/Test interne |

Avant la production :

- conserver `package: <ANDROID_PACKAGE>` ;
- inclure le `google-services.json` correspondant à ce package ;
- avoir le credential FCM v1 configuré dans EAS pour cette application ;
- refaire le test sur le build signé de production, pas seulement sur le dev
  client ;
- publier le build via le circuit Google Play prévu par l’équipe.

Pour construire puis soumettre le build configuré pour Google Play :

```bash
bunx eas-cli build --platform android --profile production
bunx eas-cli submit --platform android --profile production
```

La soumission EAS demande également les credentials Google Play de publication;
ils sont distincts du credential FCM v1.

Il n’est pas nécessaire de créer une Firebase Android app séparée pour
`preview` ou `production` tant que le package ne change pas. Si un jour un
package `.dev` est introduit, il faudra alors une deuxième app Firebase, un
deuxième `google-services.json` et une configuration EAS distincte.

## Dépannage

| Symptôme | Vérification |
|---|---|
| Build échoue : `google-services.json not found` | Le fichier doit être à la racine et `app.json` doit pointer vers `./google-services.json` |
| `package_name` différent | Télécharger le fichier de l’app Firebase `<ANDROID_PACKAGE>`, puis rebuild |
| Token jamais enregistré | Development build installé, permission accordée, package et Google Play Services vérifiés |
| Token enregistré mais aucune push | Vérifier FCM v1 EAS, le projet Firebase et le receipt Expo |
| `MismatchSenderId` / `InvalidCredentials` | Le credential EAS FCM v1 et le `project_number` du `google-services.json` ne correspondent pas |
| Test dans Expo Go | Non probant pour les push distantes ; utiliser le development build Bandaa |
| Icône de notification incorrecte | Corriger plus tard l’asset monochrome Android ; ce n’est pas le blocage de livraison |

## Checklist de fermeture

- [ ] App Firebase Android `<ANDROID_PACKAGE>` vérifiée
- [ ] `google-services.json` vérifié et rebuild effectué
- [ ] FCM v1 configuré dans EAS sans publier la clé privée
- [ ] Development build testé sur Android avec notification réelle
- [ ] Preview testé sur distribution interne
- [ ] Production/Test interne testé sur le build signé
- [ ] Receipts Expo consultés sans confondre acceptation fournisseur et affichage appareil

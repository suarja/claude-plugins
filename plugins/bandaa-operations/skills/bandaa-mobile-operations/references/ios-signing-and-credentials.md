# Signature iOS et stockage des credentials

Ce document décrit la préparation iOS de Bandaa. Il ne contient aucun
certificat, profil, clé privée, mot de passe ou credential App Store Connect.

## État à vérifier avant chaque release

- Application iOS : `<IOS_BUNDLE_ID>`.
- Équipe Apple : `<APPLE_TEAM_ID>`.
- Projet EAS : `<EAS_PROJECT>`.
- Vérifier dans EAS que le credential de distribution et le provisioning profile
  de production sont présents et non expirés.
- Vérifier dans EAS la Push Notification Key et la clé API App Store Connect.
- Aucun credential Apple ne doit être téléchargé dans le dépôt ou dans un chemin
  local partagé.

Les credentials iOS sont gérés à distance par EAS. Ils ne doivent pas être
copiés dans Git ni transformés en fichiers locaux sans besoin précis.

## Build de production

Depuis la racine du projet :

```bash
eas build --platform ios --profile production
```

Cette commande crée un archive iOS signé, mais ne le soumet pas à l’App Store.
La soumission est une étape séparée avec `eas submit`.

Le profil `production` incrémente automatiquement le `buildNumber`. Le build
lancé le 23 août 2026 utilise le numéro `5`, le profil `production` et l’archive
EAS optimisée de 22,5 Mo.

## Validation et limites

Sans connexion interactive au compte Apple, EAS peut utiliser les credentials
distants mais ne valide pas le certificat et le provisioning profile directement
auprès des serveurs Apple avant le build. Si le build échoue sur une
incohérence de certificat, lancer :

```bash
eas credentials -p ios
```

Puis choisir `production` et se connecter au compte Apple uniquement pour
régénérer ou resynchroniser les credentials nécessaires.

Le build local Xcode ne remplace pas la preuve EAS : il peut manquer une identité
de signature Apple locale ou un workspace exploitable. Pour l’archive iOS de
production, vérifier le build EAS effectivement généré et validé.

## TestFlight et App Store

Avant une soumission, vérifier que l’application `<IOS_BUNDLE_ID>` existe
dans App Store Connect et relever son `ascAppId`. Le profil `submit.production`
actuel ne contient pas encore de configuration iOS avec cet identifiant ; ne
pas en inventer un.

Une fois l’archive iOS validée et l’application App Store Connect prête :

```bash
eas submit --platform ios --profile production
```

Cette commande reste volontairement séparée du build et de la publication
finale. Aucun envoi TestFlight ou App Store n’est autorisé par ce document.

## Stockage et rotation

- Les certificats de distribution, profiles et clés API restent dans EAS.
- Ne jamais committèr un fichier `.p12`, `.mobileprovision`, `.pem` ou une clé
  API App Store Connect.
- Une rotation passe par `eas credentials -p ios`, après vérification de
  l’équipe Apple et du bundle identifier exact.
- Après rotation, relancer un build iOS et vérifier son statut avant toute
  soumission.

Références :

- Expo — credentials : https://docs.expo.dev/app-signing/app-credentials/
- Expo — soumission App Store : https://docs.expo.dev/submit/ios/

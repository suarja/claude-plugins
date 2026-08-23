# Signature Android et stockage des credentials

Ce document décrit la signature Android de Bandaa, le stockage de la clé
d’upload et la procédure de récupération. Il ne contient aucun mot de passe,
keystore ou credential Google.

## État à vérifier avant chaque release

- Application Android : `<ANDROID_PACKAGE>`.
- Profil de production : `eas.json`, bundle Android (`app-bundle`).
- Projet EAS : `<EAS_PROJECT>`.
- Un keystore de production existe déjà dans EAS. Il ne faut pas le remplacer
  pour corriger le build local signé avec la clé debug.
- Alias du keystore EAS :
  `<KEYSTORE_ALIAS>`.
- Empreinte SHA-256 vérifiée :
  `<PLAY_SIGNING_SHA256>`.

Le keystore EAS est la clé utilisée pour signer le bundle avant son envoi à
Google Play. Lorsque Play App Signing est activé, Google conserve la clé de
signature de l’application et le keystore EAS devient la clé d’upload.

## Stockage local actuel

Une copie de récupération a été téléchargée depuis EAS et déplacée hors du
dépôt :

```text
<PRIVATE_CREDENTIALS_DIR>/credentials.json
<PRIVATE_CREDENTIALS_DIR>/android/keystore.jks
```

Permissions vérifiées :

- dossiers : `0700` ;
- `credentials.json` et `keystore.jks` : `0600`.

Ce répertoire est une sauvegarde locale privée. Il ne doit pas être synchronisé
dans Git, envoyé dans une issue, copié dans Slack ou ajouté à un stockage cloud
non chiffré. Une seconde copie chiffrée doit être conservée dans le gestionnaire
de secrets de l’équipe ou sur un support chiffré séparé.

Le fichier `credentials.json` contient les mots de passe du keystore. Les deux
motifs suivants empêchent leur ajout accidentel au dépôt :

```text
/credentials.json
/credentials/
```

## Utilisation normale

Pour un build de production EAS, utiliser le profil existant :

```bash
eas build --platform android --profile production
```

EAS utilise alors le keystore de production déjà associé au projet. Cette
commande envoie le code source au service EAS ; elle doit être lancée depuis un
environnement autorisé à effectuer cet envoi.

### Taille de l’archive EAS

Le dépôt contient aussi le workbench web, les captures Store, les vidéos, les
caches Next et l’historique Git. Ils ne sont pas des entrées du build mobile.
Le fichier `.easignore` les exclut ainsi que les credentials et caches locaux.

Avant une build EAS, vérifier que `.easignore` exclut `docs/`, `web/`, `.git`,
`node_modules`, `.env.local`, les caches et les credentials, tout en conservant
les sources et les fichiers de configuration nécessaires au build mobile.
Après toute modification de `.easignore`, relancer la build pour vérifier
l’archive effectivement produite.

Le bundle local généré précédemment avec `./gradlew bundleRelease` était signé
avec `Android Debug`. Il est utile pour vérifier la compilation, mais ne doit
pas être envoyé à Google Play.

## Vérifier une clé sans révéler son secret

La vérification doit comparer l’empreinte publique, jamais afficher ou partager
le keystore ni ses mots de passe :

```bash
KEYSTORE_PASSWORD="$(jq -r '.android.keystore.keystorePassword' \
  <PRIVATE_CREDENTIALS_DIR>/credentials.json)"
KEY_ALIAS="$(jq -r '.android.keystore.keyAlias' \
  <PRIVATE_CREDENTIALS_DIR>/credentials.json)"

keytool -list -v \
  -keystore <PRIVATE_CREDENTIALS_DIR>/android/keystore.jks \
  -storepass "$KEYSTORE_PASSWORD" \
  -alias "$KEY_ALIAS" | rg 'SHA 256|SHA256|Alias|Entry type'
```

Avant un envoi, vérifier aussi la signature du bundle :

```bash
jarsigner -verify -verbose android/app/build/outputs/bundle/release/app-release.aab
```

La signature doit correspondre à l’empreinte d’upload enregistrée dans Play
Console. L’empreinte de la clé de signature détenue par Google peut être
différente.

## Rotation et récupération

### L’application n’est pas encore publiée

Conserver le keystore EAS actuel et activer Play App Signing lors de la
première release. Ne pas créer une nouvelle clé simplement parce que le dossier
`android/` local utilise encore `debug.keystore` : ce dossier est généré et
ignoré par Git.

### La clé d’upload est perdue ou compromise

1. Générer un nouveau keystore RSA 2048 bits ou plus.
2. Exporter uniquement son certificat public en PEM :

   ```bash
   keytool -export -rfc \
     -keystore <UPLOAD_KEYSTORE>.jks \
     -alias <UPLOAD_ALIAS> \
     -file <UPLOAD_CERTIFICATE>.pem
   ```

3. Dans Play Console, ouvrir la gestion de la signature de l’application et
   demander une réinitialisation de la clé d’upload avec le fichier `.pem`.
4. Attendre la confirmation de Google Play.
5. Mettre à jour le credential EAS seulement après cette confirmation.

Ne pas remplacer la clé de signature de l’application Google Play dans Gradle.
La rotation de cette clé est une opération Play Console distincte et peut
affecter les mises à jour ou les intégrations qui utilisent ses empreintes.

## Sources de référence

- Android : https://developer.android.com/studio/publish/app-signing
- Google Play : https://support.google.com/googleplay/android-developer/answer/9842756
- Expo — credentials locaux : https://docs.expo.dev/app-signing/local-credentials/
- Expo — credentials Android : https://docs.expo.dev/app-signing/app-credentials/

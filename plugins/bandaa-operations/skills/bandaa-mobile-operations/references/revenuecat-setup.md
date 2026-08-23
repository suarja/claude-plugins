# RevenueCat — configuration et mise en production du Pass Organisateur

Ce guide décrit le contrat de paiement de Bandaa et les contrôles à effectuer
avant un build TestFlight puis une mise en production. Les procédures EAS
génériques sont maintenues dans le skill marketplace officiel
[`eas-app-stores`](https://github.com/expo/skills/tree/main/plugins/expo/skills/eas-app-stores) ;
ce document conserve uniquement les décisions RevenueCat, Apple et Convex
propres à Bandaa.

Revalider les références officielles Apple et RevenueCat avant chaque release.

## Recommandation de mise en production

Je recommande de séparer trois choses :

1. le développement local, avec le Test Store RevenueCat et un déploiement
   Convex de développement ;
2. le build TestFlight, avec le vrai App Store Connect et son environnement
   sandbox Apple ;
3. la release publique, avec le même produit Apple validé, l’environnement
   production et le déploiement Convex de production.

Le TestFlight n'est pas un paiement réel : Apple exécute les achats TestFlight
dans le sandbox. Il doit valider le câblage Apple → RevenueCat → Convex, mais
pas un encaissement en production.

Point important pour l'autre chantier d'environnement : TestFlight doit utiliser
la clé publique iOS de l'application RevenueCat, avec
EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE=false. Il ne doit jamais embarquer la clé
test_… du Test Store. Lorsque TestFlight et la release utilisent la même
application iOS RevenueCat, la clé publique iOS peut être la même ; le sandbox
est déterminé par le reçu Apple, pas par une seconde clé RevenueCat. Une clé
différente n'est nécessaire que si l'on a volontairement créé une autre app ou
un autre projet RevenueCat.

## Contrat immuable

Le contrat partagé entre le code, Apple, RevenueCat et Convex est :

| Couche | Valeur |
|---|---|
| Produit Bandaa | Pass Organisateur, achat unique non consommable/lifetime |
| Bundle iOS | <IOS_BUNDLE_ID> |
| Product ID Apple | l'identifiant réellement créé dans App Store Connect |
| Entitlement RevenueCat | organizer_pass |
| Offering courante | default |
| Package sélectionné | LIFETIME |
| Identité RevenueCat | deviceToken de la Device Identity |
| Autorité d'accès | Entitlement matérialisé par le webhook RevenueCat dans Convex |

Le Product ID Apple est immuable après sa création. Il faut donc recopier
exactement l'identifiant déjà créé dans App Store Connect lorsque le produit
est ajouté à RevenueCat. Le prix et la devise viennent du Store/RevenueCat ;
ils ne doivent pas être recopiés dans le code ou dans une traduction.

Le Pass donne au Host les capacités approuvées dans le contrat produit :
Parties futures sans limite de nombre, jusqu'à 100 membres et 800 photos par
Party, avec 5 Go de médias retenus globaux. Il ne débloque ni le Book ni le
Reveal, qui restent gratuits.

## Matrice des environnements

| Usage | Store | Clé mobile | Convex | Attendu |
|---|---|---|---|---|
| Développement local | RevenueCat Test Store | EXPO_PUBLIC_REVENUECAT_TEST_STORE_KEY + flag true | dev | smoke UI/SDK, aucune validation Apple |
| TestFlight | Apple App Store sandbox | EXPO_PUBLIC_REVENUECAT_IOS_KEY + flag false | déploiement choisi pour la QA | achat, restauration et webhook réels en sandbox |
| Production | Apple App Store production | EXPO_PUBLIC_REVENUECAT_IOS_KEY + flag false | production | encaissement et entitlement réels |

Le code applique deux garde-fous : le Test Store n'est sélectionné qu'avec le
flag explicite et dans une build __DEV__, et une build release utilise la clé
plateforme. Voir
[purchases.ts](../../src/features/billing/purchases.ts) et
[.env.example](../../.env.example).

## 1. App Store Connect

Dans App Store Connect, vérifier l'application iOS et son bundle
<IOS_BUNDLE_ID> avant de relier RevenueCat.

### Produit

Créer ou vérifier un In-App Purchase de type **Non-Consumable** :

- Product ID exact et définitif ;
- prix de base et territoires disponibles ;
- au moins une localisation ;
- nom d'affichage de 2 à 30 caractères ;
- description de 45 caractères maximum ;
- capture destinée à l'équipe de vérification ;
- informations destinées à l'équipe de vérification expliquant le bénéfice
  unique du Pass et le chemin pour ouvrir l'écran d'achat.

La capture de revue est destinée à Apple et n'est pas affichée comme une
capture de la fiche App Store. Elle doit montrer clairement ce qui est acheté.
Une image promotionnelle carrée de 1024 × 1024 est une exigence distincte,
utile seulement si l'on choisit de promouvoir l'achat sur la fiche.

Le premier In-App Purchase non consommable doit être envoyé à la revue avec une
nouvelle version de l'application. Un état « Prêt pour examen » signifie que
le produit est préparé ou inclus dans une soumission ; il ne signifie pas
qu'il est déjà disponible à la vente. Pour la disponibilité publique, vérifier
la revue Apple, le statut Approved et au moins un territoire en vente.

### Texte de revue recommandé

Décrire simplement :

~~~text
Le Pass Organisateur est un achat unique non consommable qui permet au Host
d'organiser des Parties futures avec des limites supérieures. Il ne s'agit pas
d'un abonnement et il n'y a pas de renouvellement.

Pour le tester : ouvrir Bandaa, créer ou ouvrir le parcours Host, puis ouvrir
la feuille Pass Organisateur et choisir l'achat. Le bouton Restaurer mes achats
est disponible dans la même feuille.
~~~

Adapter le chemin exact à l'écran présent dans le build soumis. Ne pas fournir
de secret ou de clé RevenueCat dans ces notes.

## 2. RevenueCat

### Projet et application

Utiliser un projet RevenueCat dédié à Bandaa, distinct de MediumShip. Dans ce
projet :

1. ajouter l'application iOS avec le bundle
   <IOS_BUNDLE_ID> ;
2. vérifier que la clé publique iOS correspond à cette application, et non à
   une autre app ;
3. créer ou importer le produit Apple avec son Product ID exact ;
4. rattacher le produit à l'Entitlement organizer_pass ;
5. rendre l'Offering default courante et ne laisser qu'un package lifetime ;
6. conserver la politique de restauration Transfer to new App User ID.

La politique de transfert est importante pour Bandaa : le reçu Apple peut
rattacher le Pass à une nouvelle Device Identity, mais il ne restaure pas les
Memberships, les Parties, les Books ou l'identité historique Bandaa.

### Clé d'achat Apple à ne pas confondre avec la clé SDK

Pour React Native Purchases 9.x, configurer dans RevenueCat la clé
**In-App Purchase** Apple :

1. dans App Store Connect, ouvrir Users and Access → Integrations → In-App
   Purchase ;
2. générer puis télécharger le fichier .p8 ; Apple ne permet de le télécharger
   qu'une fois ;
3. téléverser ce fichier dans la configuration de l'application iOS RevenueCat ;
4. renseigner l'Issuer ID et vérifier que RevenueCat affiche les credentials
   valides.

Cette clé .p8 est un credential de serveur. Elle ne va ni dans le dépôt, ni
dans EAS, ni dans EXPO_PUBLIC_*. RevenueCat indique que cette clé est requise
pour les configurations App Store Apple avec les versions récentes du SDK.

À distinguer :

- clé publique SDK iOS : embarquée dans l'application, sans valeur secrète ;
- clé In-App Purchase Apple .p8 + Issuer ID : stockée dans RevenueCat ;
- clé API secrète RevenueCat : stockée uniquement dans Convex ;
- secret d'authentification du webhook : partagé uniquement entre RevenueCat
  et le déploiement Convex concerné.

### Webhook de production

Configurer une intégration webhook vers :

~~~text
https://<CONVEX_PROD_SITE>/webhooks/revenuecat
~~~

Configurer l'en-tête Authorization avec le secret choisi, typiquement :

~~~text
Bearer <REVENUECAT_WEBHOOK_AUTH>
~~~

Le même secret doit exister dans le déploiement Convex ciblé. Ne pas réutiliser
une URL ou un secret de développement pour la production. Si TestFlight pointe
vers un autre déploiement Convex, son webhook doit être routé explicitement
vers ce déploiement ; un événement sandbox ne doit pas activer par accident la
base de production.

Utiliser ensuite **Send Test Event** dans RevenueCat et vérifier :

- réponse HTTP 200 ;
- absence de 401 ou 503 ;
- présence de l'événement dans les données sandbox ou production attendues ;
- matérialisation d'un Entitlement cohérent côté Convex.

Le handler Bandaa renvoie 401 pour un secret incorrect, 503 si le secret n'est
pas configuré, 400 pour un payload invalide et laisse remonter les erreurs
inattendues afin que RevenueCat puisse retenter. Ne jamais considérer un
webhook « envoyé » comme un webhook « traité » sans vérifier sa réponse et le
read model local.

## 3. Déploiement Convex

Sur le déploiement Convex ciblé, définir le secret webhook sans l'afficher :

~~~bash
npx convex env set REVENUECAT_WEBHOOK_AUTH "<WEBHOOK_SECRET>" --prod
~~~

`syncAfterPurchase({ token })` relit et matérialise l'état déjà traité par le
composant RevenueCat ; il ne dépend pas d'un second appel REST avec une clé API.
Le webhook RevenueCat reste l'autorité durable et Convex applique ensuite les
limites côté serveur.

Déployer le code Convex vers le bon déploiement de production, puis vérifier
avant le premier achat que :

- le endpoint /webhooks/revenuecat répond sur l'URL de production ;
- les deux Capacity Policies free et organizer existent ;
- les nouvelles Parties peuvent lire la policy organizer ;
- les contrôles de capacité sont actifs à la création de Party, au join et à
  la confirmation d'un Shot ;
- une Party déjà existante reste accessible même lorsqu'un nouvel achat est
  en attente.

La fonction de seed des Capacity Policies est interne. Elle doit être exécutée
par une opération de déploiement contrôlée, puis vérifiée par une query ou le
dashboard ; elle ne doit pas être exposée comme une action mobile.

### Autorité et délai d'activation

Le parcours est volontairement asynchrone :

1. Apple confirme l'achat ;
2. RevenueCat enregistre le reçu ;
3. RevenueCat envoie le webhook ;
4. Convex matérialise organizer_pass ;
5. l'interface relit la capacité.

CustomerInfo côté mobile et le sync post-achat peuvent réduire le délai, mais
ne sont pas une autorisation. Si le webhook est en retard, il faut diagnostiquer
RevenueCat et Convex, pas écrire manuellement un entitlement local.

## 4. Variables EAS et build TestFlight

Dans l'environnement EAS utilisé pour le build TestFlight :

~~~dotenv
EXPO_PUBLIC_CONVEX_URL=https://<CONVEX_DEPLOYMENT>.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://<CONVEX_DEPLOYMENT>.convex.site
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_<IOS_PUBLIC_KEY>
EXPO_PUBLIC_REVENUECAT_USE_TEST_STORE=false
~~~

Laisser EXPO_PUBLIC_REVENUECAT_TEST_STORE_KEY vide dans un environnement de
release. Toutes les valeurs EXPO_PUBLIC_* sont visibles dans le bundle ; elles
ne doivent contenir aucun secret.

Avant de construire :

- vérifier que l'URL Convex du bundle correspond à l'URL recevant le webhook ;
- vérifier que le bundle iOS est <IOS_BUNDLE_ID> ;
- vérifier que le profil EAS sélectionné est celui prévu pour TestFlight ;
- reconstruire le development build ou l'archive dès qu'une dépendance native
  ou le bundle iOS change ;
- ne jamais tester TestFlight avec Expo Go.

## 5. TestFlight et Apple Sandbox

Les builds téléchargés depuis TestFlight utilisent le sandbox Apple pour les
achats. Créer un Sandbox Apple Account dans App Store Connect et activer les
contrôles sandbox sur l'appareil si Apple le demande. Dans RevenueCat, afficher
les données sandbox avant d'interpréter un achat.

Le sandbox peut être lent et les prix ou métadonnées affichés peuvent ne pas
refléter exactement le prix de production. Pour un achat unique, une même
identité Apple ne permet généralement pas de refaire un achat comme si elle
était neuve : utiliser un compte sandbox distinct pour un nouveau parcours et
le bouton Restore Purchases pour le parcours de restauration. Supprimer le
client dans RevenueCat ne supprime pas l'historique du reçu Apple.

### Matrice de preuve minimale

| Scénario | Preuve attendue |
|---|---|
| Offering | default est chargée, package lifetime et prix Store visibles |
| Annulation | la feuille reste utilisable, aucun écran d'erreur système |
| Achat réussi | transaction visible dans RevenueCat sandbox, puis webhook reçu |
| Activation | organizer_pass actif dans Convex et capacité organizer appliquée |
| Restore actif | nouvelle Device Identity récupère le Pass selon Transfer |
| Restore sans achat | alerte explicite, aucun entitlement local créé |
| Achat déjà possédé | message récupérable, pas de double création de Party |
| Erreur réseau/store | message localisé, retry possible, pas de rejet Expo non capturé |
| Rejeu webhook | état idempotent, une seule entitlement locale cohérente |
| Révocation/remboursement | l'état RevenueCat devient inactif et Convex le reflète |

Pour chaque achat réussi, conserver séparément :

1. la preuve écran Apple/StoreKit ;
2. la preuve de transaction dans RevenueCat, avec le filtre sandbox ou
   production explicite ;
3. la preuve du webhook HTTP ;
4. la preuve de l'Entitlement et de la Capacity Policy dans Convex.

Un achat affiché comme réussi dans l'application, sans transaction RevenueCat
et sans webhook Convex traité, n'est pas une preuve de release complète.

## 6. Checklist go/no-go production

### Apple

- [ ] Bundle ID et Product ID correspondent exactement à RevenueCat.
- [ ] Produit non consommable, prix et territoires vérifiés.
- [ ] Nom, description, langue, capture de revue et notes complétés.
- [ ] Première soumission de l'IAP jointe à la nouvelle version de l'app.
- [ ] Produit approuvé et disponible dans au moins un territoire pour le go-live.
- [ ] Compte bancaire, fiscalité et contrats Apple finalisés côté App Store Connect.

### RevenueCat

- [ ] Projet Bandaa dédié, sans dépendance au projet MediumShip.
- [ ] Application iOS RevenueCat avec le bundle ID exact.
- [ ] Clé In-App Purchase .p8, Issuer ID et statut credentials valides.
- [ ] Product ID rattaché à organizer_pass.
- [ ] Offering default courante avec le seul package LIFETIME.
- [ ] Restore behavior Transfer to new App User ID.
- [ ] Webhook de production configuré avec un secret distinct.
- [ ] Send Test Event reçu en HTTP 200.
- [ ] Données sandbox et production correctement distinguées dans le dashboard.

### Convex et mobile

- [ ] REVENUECAT_WEBHOOK_AUTH défini sur le bon déploiement.
- [ ] Capacity Policies free et organizer présentes.
- [ ] EAS TestFlight utilise la clé publique iOS et le flag Test Store à false.
- [ ] Aucun test_… dans l'archive ou l'environnement de release.
- [ ] Achat, annulation, restauration active et restauration vide testés.
- [ ] Webhook, Entitlement et enforcement Convex prouvés sur le même build.
- [ ] Procédure de diagnostic documentée avant ouverture au public.

## 7. Ce qu'il ne faut pas faire

- Ne jamais soumettre une app avec une clé Test Store.
- Ne jamais mettre une clé RevenueCat secrète, un .p8 ou un secret webhook dans
  EXPO_PUBLIC_* ou dans Git.
- Ne jamais renommer ou recréer le Product ID après sa mise en vente.
- Ne jamais utiliser CustomerInfo seul pour autoriser une capacité serveur.
- Ne jamais connecter simultanément le webhook de production à un déploiement
  Convex de développement.
- Ne pas supprimer un produit Apple pour « annuler » les achats existants :
  les clients qui l'ont déjà acheté conservent leurs droits selon Apple.
- Ne pas ajouter un menu Manage Subscriptions pour ce Pass : c'est un achat
  unique, pas un abonnement.

## Références officielles

- [RevenueCat — configuration du SDK et séparation Test Store / stores réels](https://www.revenuecat.com/docs/getting-started/configuring-sdk)
- [RevenueCat — Apple App Store et TestFlight sandbox](https://www.revenuecat.com/docs/test-and-launch/sandbox/apple-app-store)
- [RevenueCat — clé In-App Purchase Apple](https://www.revenuecat.com/docs/service-credentials/itunesconnect-app-specific-shared-secret/in-app-purchase-key-configuration)
- [RevenueCat — webhooks](https://www.revenuecat.com/docs/integrations/webhooks)
- [Apple — informations d'un In-App Purchase](https://developer.apple.com/help/app-store-connect/reference/in-app-purchases-and-subscriptions/in-app-purchase-information/)
- [Apple — soumettre un In-App Purchase](https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase/)
- [Apple — tester les achats dans TestFlight](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testing-subscriptions-and-in-app-purchases-in-testflight)

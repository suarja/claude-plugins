# Publication TestFlight — contenu V1 et PROD

Ce guide est le protocole opérateur durable de la V1. Il ne construit pas de
CMS, ne publie pas de contenu éditorial dynamique et ne déplace aucune donnée
utilisateur de DEV vers PROD.

La cible mobile est le profil EAS `production`, avec une URL Convex PROD et des
médias Books conservés dans R2 PROD. Les commandes ci-dessous sont des modèles :
remplacer les valeurs entre chevrons, ne jamais copier un secret dans un ticket,
un rapport, EAS ou Git.

Les procédures génériques EAS de build, soumission et workflows sont déportées
vers les skills marketplace officiels
[`eas-app-stores`](https://github.com/expo/skills/tree/main/plugins/expo/skills/eas-app-stores)
et
[`eas-workflows`](https://github.com/expo/skills/tree/main/plugins/expo/skills/eas-workflows).
La préparation générique Cloudflare R2 est déportée vers le skill marketplace
[`cloudflare`](https://github.com/cloudflare/skills/tree/main/skills/cloudflare) ;
la règle Bandaa de stockage privé reste : stocker uniquement les clés média et
résoudre les URLs signées à la lecture.
Dans ce dépôt, `eas.json`, `.env.example` et `.github/workflows/` sont les
sources de vérité de la configuration ; ce runbook ne conserve que les gates
Bandaa de contenu, de PROD et de validation propriétaire.

## Sources et destinations

| Élément | Source de vérité | Destination |
|---|---|---|
| configuration mobile | `app.json`, `eas.json` | build EAS |
| variables publiques | environnement EAS `production` | bundle mobile |
| code backend | `convex/` | Convex PROD |
| Capacity Policies | `convex/lib/capacity.ts` | Convex PROD |
| types/Missions/slots | `convex/lib/testflightContentCatalog.ts` | Convex PROD |
| affiches/placeholders | `assets/illustrations/` + masters documentaires | bundle mobile |
| sources Books démo | `tools/demo-assets/collections/` | opérateur local |
| médias Books démo | manifests approuvés | R2 PROD |
| pointeurs Books | `convex/demoBooks.ts` | Convex PROD |
| secrets R2 | dashboard Convex PROD | jamais EAS/mobile/Git |
| URL Convex publique | EAS `production` | `EXPO_PUBLIC_CONVEX_URL` |
| credentials iOS/APNs | EAS/Apple | build et push |
| TestFlight | App Store Connect | groupe interne |

## État des packs

Le plan lit et vérifie les 21 médias de chaque manifest avant tout réseau :
fichiers, MIME, dimensions et SHA-256. Un pack non approuvé reste absent de
PROD ; aucun fichier n’est inventé pour remplir les cinq types.

| Pack | Statut courant | Action |
|---|---|---|
| Libre | `NOT READY` — checkpoint propriétaire B absent | ne pas publier |
| Mariage | `READY` — `owner-approved` / `PASS` | publiable après les gates |
| Baptême | `READY` — `owner-approved` / `PASS` | publiable après les gates |
| Anniversaire | `NOT READY` — checkpoint propriétaire B absent | ne pas publier |
| Vacances | `READY` — `owner-approved` / `PASS` | publiable après les gates |

Les opérations de Book sont idempotentes par `templateKey + releaseId` avec
`releaseId=testflight-content-v1`. Une publication identique est un no-op ; un
autre Book, label ou release pour le même type est refusé.

## Ordre opérateur

Chaque bloc est une autorisation distincte. Une autorisation de planification ne
vaut pas autorisation de mutation Convex, d’upload R2, de build ou de submit.

### A — Identifier Convex PROD et R2 PROD

1. Dans le dashboard Convex, identifier le déploiement PROD :
   `<CONVEX_PROD_DEPLOYMENT>`.
2. Dans le dashboard R2, identifier le bucket PROD : `<R2_PROD_BUCKET>`.
3. Préparer localement le target opérateur sans l’imprimer :

```bash
export CONVEX_DEPLOYMENT="<CONVEX_PROD_DEPLOYMENT>"
export CONVEX_URL="https://<CONVEX_PROD>.convex.cloud"
```

`CONVEX_DEPLOYMENT` prend le nom du déploiement, sans le préfixe `prod:`. Cette même valeur est utilisée par le runner des Books démo.

Le secret d’administration nécessaire aux fonctions internal-only est injecté
par le gestionnaire de secrets de l’opérateur dans `CONVEX_ADMIN_KEY`. Sa valeur
n’est jamais copiée dans ce guide ou un rapport.

### B — Vérifier les noms de variables, sans copier leurs valeurs

Vérifier dans Convex PROD les noms attendus par l’ADR-0004 et dans EAS les
variables déclarées par `.env.example` et le profil `production` de `eas.json`.
Consigner uniquement `présente` / `absente` :

```bash
bunx convex env list --deployment "<CONVEX_PROD_DEPLOYMENT>" --names-only
bunx convex env get EVENT_TEMPLATE_CATALOG_MODE --deployment "<CONVEX_PROD_DEPLOYMENT>"
bunx eas-cli@latest env:list --environment production
```

La valeur de `EVENT_TEMPLATE_CATALOG_MODE` doit être exactement `production`.
Si elle est absente ou différente, après le déploiement du code et avec une
autorisation PROD distincte, exécuter :

```bash
bunx convex env set --deployment "<CONVEX_PROD_DEPLOYMENT>" EVENT_TEMPLATE_CATALOG_MODE production
```

Les autres valeurs affichées restent dans le dashboard ou le terminal de l’opérateur.
Ne pas les coller dans le rapport et ne pas créer de `.env` PROD dans le dépôt.

### C — Déployer le code Convex PROD

Après l’autorisation de déploiement séparée :

```bash
bunx convex deploy
```

La commande utilise `CONVEX_DEPLOYMENT` défini en A et ne seed aucune donnée.

Ce déploiement ne seed aucune donnée. `seedE2Fixtures` reste strictement DEV et
ne doit pas être appelé avec un target PROD.

### D — Exécuter le plan contenu sur PROD

La commande est locale et en lecture seule pour les manifests ; elle classe la
cible et affiche les opérations à venir :

```bash
bun run tools/testflight-content.ts plan --scope production
```

Le plan doit afficher le release exact, les cinq types, les 16 Missions, les
slots et les packs `READY` / `NOT READY`. Il ne doit contenir aucun secret, URL
signée, token ou identifiant utilisateur.

### E — Obtenir la confirmation propriétaire du plan exact

Le propriétaire compare la sortie complète du plan, notamment les packs
approuvés et les packs absents. Il donne une autorisation fraîche pour ce plan
précis. Une nouvelle divergence de manifest invalide cette autorisation.

### F — Appliquer puis vérifier

Après cette autorisation seulement :

```bash
bun run tools/testflight-content.ts apply \
  --scope production \
  --confirm-release-id testflight-content-v1

bun run tools/testflight-content.ts verify --scope production
```

`apply` exécute dans cet ordre, dans une même commande opérateur mais dans des
chemins séparés et idempotents :

1. `internal.capacityPolicies.seedDefaults` pour les deux politiques existantes ;
2. `internal.testflightContent.install` pour les familles, cinq types, versions,
   Missions et slots de production ;
3. le runner de chaque pack `READY`, qui vérifie encore les 21 médias, crée
   uniquement des fixtures synthétiques, upload via le chemin R2 autorisé,
   reconstruit le Book puis appelle `internal.demoBooks.publish` ;
4. aucun runner n’est lancé pour un pack `NOT READY`.

`verify` ne modifie rien. Il renvoie seulement les clés et compteurs du
catalogue, ainsi que l’état `READY` / `NOT READY` des pointeurs de Books. Si une
collision ou divergence apparaît, arrêter l’opération ; ne pas supprimer ni
réparer silencieusement une ligne.

### G — Vérifier EAS `production` et l’URL Convex PROD

Après le gate de mutation, vérifier les noms de variables et la configuration
du bundle :

```bash
bunx eas-cli@latest env:list --environment production
rg -n 'production|EXPO_PUBLIC_CONVEX_URL|<IOS_BUNDLE_ID>' app.json eas.json .env.example
```

La valeur injectée dans `EXPO_PUBLIC_CONVEX_URL` doit être l’URL Convex PROD
identifiée en A. Les secrets R2 restent dans Convex PROD.

### H — Construire le profil iOS `production`

Après une autorisation de build distincte :

```bash
bunx eas-cli@latest build --platform ios --profile production
```

Identifier le build retourné par son identifiant App Store Connect/EAS. Le
build doit être vérifié avant toute soumission : bundle id, signature Release,
`aps-environment=production`, URL Convex PROD et configuration APNs.

### I — Obtenir une nouvelle autorisation avant submit

L’autorisation de build ne vaut pas autorisation de publication Apple. Le
propriétaire valide le build identifié et autorise explicitement le submit.

### J — Soumettre dans TestFlight puis smoke sur le build identifié

Après l’autorisation I :

```bash
bunx eas-cli@latest submit --platform ios --profile production
```

Le propriétaire réalise ensuite le smoke sur l’iPhone physique et rapporte le
numéro de build testé. Le push réel n’est jamais déduit des tests locaux ou du
simulateur.

## Parcours propriétaire TestFlight

1. Installer le build identifié sur l’iPhone physique et vérifier l’ouverture.
2. Créer une Party pour chacun des cinq types et vérifier la couverture
   thématique ; le fallback neutre ne doit apparaître qu’en absence de type.
3. Vérifier l’écran Mission puis recevoir une notification collective et, pour
   une Mission distribuée, la notification personnalisée correspondante.
4. Prendre une photo, vérifier que la Mission affichée et la notification
   viennent du même contenu résolu, puis ouvrir le Book démo approuvé.
5. Vérifier que les packs non approuvés Libre et Anniversaire n’ont aucun Book
   publié et qu’aucun contenu utilisateur n’est visible.
6. Tester une couverture réelle, le clair/sombre et l’iPhone/iPad si disponible.

Rapporter `PASS`, `FAIL` ou `BLOCKED` avec le numéro de build et l’écran exact.

## Interdictions permanentes

Pendant cette slice, ne pas exécuter `apply` PROD, déploiement Convex, `env set`
PROD, upload R2 PROD, build EAS ou submit TestFlight sans les autorisations
fraîches correspondantes. Ne pas pousser, merger, changer de branche, stasher,
resetter ou supprimer le travail concurrent.

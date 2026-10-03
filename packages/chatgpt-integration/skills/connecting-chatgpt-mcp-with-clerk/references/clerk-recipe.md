# Recette Clerk, de la préparation à la réception

Cette méthode provient de l'essai privé Be Viral AI du 3 octobre 2026. Elle couvre un diagnostic autorisé sans compte Convex, droit Pro, vidéo, facturation ou inférence. Adapter les noms et ports au projet ; les valeurs du test ne sont pas des identités à réutiliser.

## État réellement acquis

| Étape | Preuve acquise |
| --- | --- |
| Serveur et découverte | HTTPS, metadata JSON, challenge canonique, découverte publique |
| OAuth direct | Login/consentement standard terminés, diagnostics FR/EN et événements serveur concordants |
| Refus | Client neuf, bouton Deny, fiche non connectée, aucun nouveau succès |
| Retrait fournisseur | Procédure préparée, essai réel encore ouvert |
| Package combiné | Réception distincte, différée dans cet essai |
| CIMD | Annonce visible après une découverte fraîche ; aucun flux CIMD reçu |

Le refus standard retourne silencieusement au catalogue dans la surface observée. Ne pas inventer un message utilisateur affiché ou considérer cette limite comme un succès UX complet.

## Prérequis et versions reçues

- Un projet Clerk TEST existant, son issuer exact et les clés TEST déjà disponibles côté serveur.
- Les permissions explicites pour le client et les réglages OAuth TEST nécessaires. Le test n'autorise pas une modification PROD.
- Un serveur MCP accessible depuis ChatGPT, une URL HTTPS et une surface offrant la création d'une connexion MCP personnalisée.
- La version reçue utilise Next.js 16.2.3, Bun, mcp-handler 2.2.0 et @clerk/nextjs 6.39.1. Lire les types installés avant de reprendre un exemple.
- Un worktree web conservé et des ports propres à l'essai. Un lancement Next avec `NODE_ENV=production` décrit le mode du build ; le fournisseur reste TEST grâce aux clés et à l'issuer vérifiés.

Les paramètres serveur sont explicites : `BEVIRAL_MCP_OAUTH_ISSUER`, `BEVIRAL_MCP_OAUTH_RESOURCE`, `BEVIRAL_MCP_OAUTH_CLIENT_ID`, `BEVIRAL_MCP_ALLOWED_ORIGINS`, plus les clés Clerk existantes. Aucun secret ajouté aux preuves, au ZIP ou au mapping. Préserver un fichier d'environnement partagé ou lié par symlink.

## Mettre en place le diagnostic

L'essai garde S1 anonyme à `/api/mcp` et ajoute S2 protégé à `/api/mcp-oauth`. Cette séparation a permis de recevoir OAuth sans attendre le package installé. Un autre projet peut choisir son chemin, en gardant la même cohérence entre ressource, metadata, audience et challenge.

Sortie stricte de S2, avec arguments strictement vides :

```json
{
  "service": "beviral-ai",
  "slice": "S2",
  "status": "authorized",
  "requestId": "un UUID neuf généré par le serveur",
  "serverTime": "une date ISO générée par le serveur",
  "authorizationConfirmed": true,
  "accountAccess": false
}
```

Les deux chaînes explicatives sont un exemple de forme ; le serveur émet un UUID et une date valides. `structuredContent` et le JSON textuel contiennent le même résultat. L'événement minimal contient le nom de l'événement, l'UUID, l'heure et l'issue `authorized`.

## Découverte et transport

Servir la metadata à `/.well-known/oauth-protected-resource/api/mcp-oauth`, accessible sans session :

```json
{
  "resource": "https://mcp.example.com/api/mcp-oauth",
  "authorization_servers": ["https://issuer-test.example.com"],
  "scopes_supported": ["beviral:connection:read"],
  "bearer_methods_supported": ["header"]
}
```

Ces domaines sont illustratifs. Configurer les valeurs réelles, sans les reconstruire depuis les headers.

Le test utilise `generateProtectedResourceMetadata` et le handler OPTIONS fourni par mcp-handler. Vérifier GET/OPTIONS, CORS, absence de cookie, absence de redirection HTML/i18n et `Cache-Control:no-store`.

La découverte et la liste des outils restent publiques. Toute exécution protégée passe par la vérification. Déclarer le scope OAuth du diagnostic dans le descripteur d'outil selon le SDK installé ; la version reçue utilise `_meta.securitySchemes`.

Pour l'appel sans token, retourner HTTP 401 et un `WWW-Authenticate` Bearer indiquant `resource_metadata` et le scope. L'essai retourne 401 pour un token invalide, 403 `insufficient_scope`, 503 pour une vérification indisponible. Aucun de ces chemins n'exécute le diagnostic.

Le relais local de test transmet Authorization et les headers MCP nécessaires. Il n'expose que le MCP et sa metadata, sans cookie ni pages applicatives. L'inspection ngrok est désactivée pour les échanges OAuth.

## Configurer Clerk et ChatGPT

1. Lire les réglages et les domaines de l'instance. Faire correspondre la clé TEST, l'issuer et la clé publique TEST ; une variable déclarative seule ne prouve pas ce lien.
2. Dans l'essai reçu, activer `aud_claim_enabled` et `pkce_required`, garder les tokens opaques. Créer le scope `beviral:connection:read` avec une description indiquant diagnostic uniquement.
3. Garder DCR désactivé et limiter CIMD aux clients pré-enregistrés dans cette configuration. Ce sont les choix du test, pas un besoin universel pour toute intégration.
4. Dans ChatGPT, le canal reçu est Plugins, Ajouter, Créer un serveur MCP personnalisé. Attendre la découverte et ouvrir les paramètres OAuth avancés.
5. Copier le callback affiché. Le test utilisait `https://chatgpt.com/connector_platform_oauth_redirect`. D'autres configurations ont un callback spécifique ; ne pas déduire son URL d'une ancienne capture.
6. Créer un client OAuth public dédié, avec ce callback, PKCE requis, consentement actif et le seul scope de diagnostic.
7. Sélectionner le client défini par l'utilisateur et son ID public. Méthode d'authentification `none`, secret vide. Scope diagnostic demandé, portées de base vides et OIDC désactivé pour cet essai sans email/profile.
8. Vérifier la requête OAuth réelle : `response_type:code`, `code_challenge_method:S256`, challenge présent, callback, resource et scope exacts. Ne conserver ni state, code, challenge complet ni token.
9. Continuer vers le login/consentement Clerk standard. Le propriétaire a effectué le login dans l'essai reçu.

Clerk ajoute `offline_access` aux scopes permis du client observé, même lors d'une création limitée au diagnostic. Le scope permis n'est pas la portée effectivement demandée. Dans les deux requêtes reçues, seul `beviral:connection:read` est demandé. Le test ne stocke aucun refresh token.

CIMD est d'abord apparu indisponible, puis disponible après une découverte fraîche. La découverte peut modifier la méthode sélectionnée automatiquement. Relire le client, les scopes et OIDC après chargement. L'annonce de CIMD ne prouve pas son admission ni un consentement réussi.

## Vérifier le token opaque

La version SDK observée ne conserve pas `aud` dans son objet normalisé OAuth. L'adaptateur utilise donc le REST Clerk documenté, avec version API 2026-05-12, un timeout et aucune mise en cache :

- GET `/v1/domains` pour lier la clé TEST à l'issuer.
- POST `/v1/oauth_applications/access_tokens/verify` avec le token reçu, en mémoire uniquement.

Vérifier le format actuel de la réponse dans l'OpenAPI. L'essai exige `object:clerk_idp_oauth_access_token`, un ID de ce type, le client dédié, `aud:string[]` contenant la resource, `scopes:string[]` contenant le scope, un sujet non vide, `revoked:false`, `expired:false` et une expiration numérique future en secondes. La politique utilise l'heure après la vérification réseau.

La tranche reçue refuse les JWT et les tokens de session. Pour une autre tranche JWT, utiliser une vérification signature/issuer/audience/expiration documentée ; un décodage de claims n'est pas une vérification. Sa stratégie de retrait devra être mesurée séparément.

## Tests utiles et réception réelle

Tester le contrat, la découverte publique, les erreurs de transport et les refus de politique. Inclure expiration pendant la requête, retrait entre deux vérifications et contextes A/B simultanés. Les fixtures ne prouvent pas le consentement réel.

Après les contrôles locaux adaptés au dépôt, lancer deux chats indépendants depuis la bonne connexion. Demander `check_authorization({})`, le résultat exact et la limite d'accès. Chaque UUID/heure doit correspondre au journal serveur ; ne pas prendre un texte du modèle pour une preuve du backend.

Pour le refus, utiliser un client/grant neuf pour éviter une acceptation antérieure. Cliquer Deny dans le consentement standard, vérifier la fiche non connectée et l'absence d'événement autorisé.

## Retrait à vérifier

La méthode documentée pour les tokens opaques utilise POST `/v1/oauth_applications/{oauth_application_id}/revoke_token` avec le token. Vérifier la version fournisseur avant usage.

Le protocole préparé est : succès initial, retrait chez Clerk, vérification du même ancien token, nouvel appel MCP refusé, absence de succès serveur, puis reconnexion de test. Retenir seulement les statuts et booléens. Le token reste temporairement en mémoire et n'est ni enregistré ni affiché.

Dans l'essai d'origine, le contrôle automatique a refusé l'accès au profil privé et l'arrêt temporaire du relais actif. Une sonde limitée à l'API OAuth a été préparée, mais l'interruption attend l'accord du propriétaire. Ne pas présenter cette procédure comme un retrait réel déjà reçu. Préserver les processus hors périmètre et rétablir le relais après un essai autorisé.

## Pièges opérationnels reçus

- Une URL de tunnel gratuite peut changer. Vérifier l'URL et l'identité mappée. Remplacer seulement la connexion de test autorisée ; conserver la fiche produit.
- Le bouton de mise à jour du plugin n'était pas disponible sur la fiche du propriétaire. Ne pas lui demander une option absente. La connexion directe constitue un essai indépendant.
- Le login terminé, le compte connecté, le build réussi et l'outil présent dans Codex sont des preuves différentes.
- Un résultat `accountAccess:false` ne prouve aucune lecture métier, reconnaissance Pro ou intégration Convex.
- Une déconnexion ChatGPT ne prouve pas que Clerk a révoqué l'ancien token.

## Provenance et sources

Exemple EditIA : commit web `443dfa0350f61b0749d03e3962a881ba9be53e6f`. Reçu local `docs/Intégration ChatGPT/10-reception-s2-oauth.md`, preuves de consentement/FR/EN/refus au commit documentaire `6400db8`. Ce reçu fait foi pour le statut du test ; cette recette conserve l'état reçu au 4 octobre 2026.

- [OpenAI, authentification MCP](https://developers.openai.com/plugins/build/auth), consulté le 4 octobre 2026.
- [Clerk, vérification OAuth](https://clerk.com/docs/guides/configure/auth-strategies/oauth/verify-oauth-tokens), consulté le 4 octobre 2026.
- [OpenAPI Clerk 2026-05-12](https://raw.githubusercontent.com/clerk/openapi-specs/main/bapi/2026-05-12.yml), schémas utilisés pendant l'essai.

Lire ces sources au moment de reprendre les réglages. Une recette d'un test reçu ne remplace pas la vérification des versions et capacités de la nouvelle instance.

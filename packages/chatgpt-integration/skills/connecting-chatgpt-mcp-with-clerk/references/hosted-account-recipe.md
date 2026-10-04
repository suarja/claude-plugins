# Héberger un MCP de compte avec Clerk et Convex

Recette reçue sur Be Viral AI le 4 octobre 2026. S3/S3b lisent le compte existant, ses droits canoniques et le créateur lié. Le serveur tourne dans un Vercel preview isolé avec Clerk TEST et Convex DEV. Une lecture réussie ne prouve ni propriété TikTok, ni accès aux vidéos, ni disponibilité du plugin sur un autre compte.

## Prérequis et périmètre

- Identifier les dépôts, commits, worktrees et processus de la tranche ; garder les modifications et services concurrents.
- Disposer d'une instance Clerk TEST, d'un backend Convex DEV et d'un projet Vercel autorisé. Vérifier leurs identités réelles avant toute mutation.
- Vérifier la création de connexions personnalisées sur la surface ChatGPT utilisée ; ne pas supposer cette option accessible sur tous les comptes.
- Définir le scope minimal, l'URL canonique exacte, le client public, le callback observé et l'opération backend. Les IDs de l'exemple ne sont pas universels.
- Déploiement, transfert de secrets et exception de protection sont des actions distinctes. Réutiliser les autorisations déjà reçues pour le même payload et destinataire ; sinon préparer le résultat concret avant de demander l'accord.
- Les versions reçues sont Bun, Next 16.2.3, mcp-handler 2.2.0 et Zod 4.3.6. Relire les versions/types avant adaptation.

## Lier le compte sans sélecteur modèle

La chaîne reçue est ChatGPT → token OAuth vérifié par Clerk → preuve de service HMAC → façade HTTP Convex → query interne.
Le sujet vérifié par le serveur détermine le compte. L'entrée de get_account est un objet vide strict : aucun email, userId, clerkId, handle ou sélection d'une autre identité.

Vérifier issuer, client, audience/resource, scope, expiration et révocation à chaque appel. Les contrôles réseau sont bornés ; ne pas mettre une autorisation positive en cache global.
Signer une preuve de service limitée à une audience backend exacte, une opération et un scope, pour au plus 30 secondes et jamais au-delà de l'expiration du grant. Le secret reste côté serveur.

La façade vérifie la preuve et le body avant la seule query interne prévue. N'exposer ni getByClerkId public, dispatcher générique, clé admin, mutation ou auto-create de compte. Le résultat ne doit contenir que les champs autorisés.
Le compte est recherché avec l'issuer et le sujet Clerk ; les doublons, comptes supprimés ou désactivés ne deviennent pas arbitrairement un compte actif. Les droits viennent du resolver canonique Convex.
Un handle lié reste ownershipVerified:false. TEST et PROD ne sont jamais rapprochés par email.

## Isoler le projet hébergé

Auditer les noms et périmètres des variables sans afficher leurs valeurs. Le projet web partagé de l'exemple héritait de secrets admin/Supabase/Resend : créer un projet MCP TEST dédié sans Git a évité de les copier.
Ne déployer que les routes MCP et metadata. Générer un artefact à partir d'une liste explicite de fichiers commités, avec hashes et versions ; exclure .env, pages produit, assets, SDK inutiles et credentials.
Un mode d'hôte explicite permet les chemins/méthodes nécessaires et refuse tout le reste ; valeur inconnue = fermé. Tester pages, anciens MCP, Stripe/builder, assets, slash/casse/encodage et méthodes.

Dans l'exemple, onze variables étaient uniquement en preview. Deux étaient sensibles : Clerk server TEST et la nouvelle clé HMAC 256 bits. NEXT_PUBLIC ne contenait que la publishable key TEST.
Avant publication Convex sur un DEV partagé, comparer le backend effectif à la référence commitée : modules, imports, définitions, auth/composants et indexes. Un rebuild local réussi ne prouve pas la préservation.
Ajouter une binding client/resource par key ID distinct et garder les clés, audiences et clients historiques. Les combinaisons croisées doivent être refusées.

## Recevoir Vercel et HTTPS

Choisir un alias fixe et relire son attribution. Un tunnel gratuit qui change d'URL invalide la cohérence de resource/connexion ; l'hébergement fixe retire cette dépendance au Mac.
Attention : une exception Vercel porte sur un domaine entier. Préparer l'hôte fermé avant l'exception du seul alias autorisé ; ne pas désactiver globalement la protection du projet.

La CLI 62.2.0 a classé un bootstrap en production malgré --target=preview. Ce projet TEST n'avait aucun secret production. Le vrai preview a été créé par l'API officielle avec target omis, puis relu et reçu ; l'alias lui a été attribué. Ne pas déduire la cible du seul argument CLI.
Conserver séparément le build effectif, la cible relue et la source. Aucun promote, push ou merge implicite.

Tester depuis une requête publique sans cookie Vercel, login, bypass secret ou lien partagé :
- metadata GET/OPTIONS JSON, initialize et tools/list ;
- exécution sans token/invalide refusée, mauvais scope/client/audience refusés ;
- pages et assets hors périmètre fermés ;
- domaine brut du preview toujours protégé si seule l'exception alias était autorisée.

## Client et consentement

Créer ou réutiliser un client public TEST pré-enregistré, PKCE S256, consentement standard et le seul scope de la lecture.
Dans S3b : méthode none, secret vide, OIDC désactivé, scopes de base vides ; beviral:account:read demandé.
Le plafond Clerk contenant offline_access ne signifie pas que cette permission est demandée. Ne pas annoncer une reconnexion automatique sans refresh reçu.
Relire le formulaire après découverte : CIMD peut apparaître et devenir sélectionné automatiquement. L'exemple garde explicitement le client exigé par le vérificateur.
Copier le callback réellement affiché ; le callback final reçu était https://chatgpt.com/connector_platform_oauth_redirect. Ne conserver ni state, challenge complet, code, token ni identité personnelle dans les captures.
Respecter les confirmations à l'action imposées par l'outil. Le propriétaire a cliqué Allow lui-même dans S3b ; ne pas reposer un accord déjà obtenu.

## Preuve de réception hébergée

Créer deux chats indépendants FR/EN, mentionner la bonne connexion et appeler get_account({}). Obtenir statut, droits, état du créateur, UUID et heure serveur ; masquer l'identifiant de compte et le handle réel dans les preuves publiques.
Retrouver chaque UUID et heure dans les logs Next du déploiement Vercel exact puis chaque UUID dans Convex. Vérifier leur absence dans l'ancien log local ; préserver les processus concurrents.
Un 403 du connecteur de logs n'est pas une absence de logs. L'exemple a utilisé la CLI officielle authentifiée, avec filtrage en mémoire par événement/UUID et sans persister les journaux bruts.
Archiver uniquement événement, UUID, heure et issue, et une capture sans données personnelles. READY, login et phrase du modèle ne suffisent pas.

## Distribution et essais multi-utilisateurs

Une connexion directe peut tester le serveur sans installer le plugin complet. Un plugin Personnel et un ID de connexion propriétaire ne sont pas accessibles automatiquement à un autre compte. Un partage workspace reste dans son organisation.
Ne pas demander un test externe avant d'avoir reçu sa surface et son parcours d'installation. Deux profils de navigateur sur un même ordinateur suffisent à séparer deux sessions ; un deuxième ordinateur n'est pas requis.
Un autre compte Be Viral AI est distinct d'un autre compte ChatGPT. Tester une deuxième identité avec une connexion dédiée dans le même ChatGPT est un montage à vérifier, pas une réception externe acquise.
Séparer isolation A/B automatisée, compte propriétaire réel, nouveau signup réel, installation par un tiers et package combiné. Le test externe est utile avant une bêta ; il ne bloque pas l'implémentation du prochain outil autorisé.

## Nouveau compte et exploitation

Le webhook Clerk existant vérifie Svix et upsert le compte canonique. get_account ne crée aucun utilisateur.
Vérifier endpoint TEST, destination DEV, événements actifs et historique sans ouvrir les payloads ou secrets. Tester localement created/updated/deleted et mauvaise signature avec effets secondaires simulés.
Dans l'exemple, user.created programmait bienvenue et alerte admin. Une nouvelle inscription réelle doit identifier et autoriser ses destinataires ; ne pas injecter une fixture dans le DEV partagé pour contourner cela.
Un compte absent ou créateur non lié est une réponse explicite, pas une raison de collecter TikTok ou déclencher Apify.
Timeouts reçus : Clerk 10 s, Convex 10 s, fonction MCP 30 s. Aucun quota MCP durable reçu. Un compteur mémoire ne remplace pas un quota partagé serverless ; recevoir le comportement 429 et la supervision avant élargissement.

## Sources et provenance

Code S3 : bbe18a2a ; hébergement S3b : 110805eb ; reçu final local : 41469ad.
Dans EditIA, lire docs/Intégration ChatGPT/11-reception-s3-compte-convex.md et 13-reception-s3b-hebergement.md ; ils conservent les UUIDs et gates.
État reçu : propriétaire FR/EN hébergé PASS ; webhook configuré/local PASS ; nouveau signup réel, testeur externe et package combiné NOT RUN.

Sources officielles à réactualiser :
- [OpenAI, connexion et tests](https://developers.openai.com/plugins/deploy/connect-chatgpt)
- [OpenAI, package et partage](https://developers.openai.com/plugins/build/plugins)
- [Clerk, OAuth](https://clerk.com/docs/guides/configure/auth-strategies/oauth/verify-oauth-tokens)
- [Vercel, exceptions de protection](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/deployment-protection-exceptions)

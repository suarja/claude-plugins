---
name: "connecting-chatgpt-mcp-with-clerk"
description: "Use when connecting or receiving a private ChatGPT MCP server with Clerk OAuth, including metadata, PKCE, minimal scopes and real consent tests. Utiliser pour reproduire la connexion MCP + Clerk et ses preuves, sans confondre diagnostic autorisé, accès métier et installation du package."
---

# Connecter un MCP ChatGPT avec Clerk

Livrer une connexion directe vérifiable. ChatGPT est le client OAuth, Clerk délivre les autorisations et le serveur MCP les vérifie. Un diagnostic réussi confirme cette autorisation ; les lectures de compte ou de contenu demandent une tranche distincte.

Lire [la recette Clerk reçue](references/clerk-recipe.md) pour la configuration, les contrôles serveur, les pièges observés et le protocole de réception. Réactualiser les sources officielles et les capacités des versions installées avant une nouvelle intégration.

## Préparer un essai borné

Identifier le dépôt, le serveur MCP, l'instance Clerk TEST, la surface ChatGPT et les permissions demandées. Relever les processus et connexions existants pour conserver les autres essais. Réutiliser un checkout approprié ou isoler le travail selon les règles du projet.

Commencer avec un diagnostic sans données métier. Dans l'exemple reçu, `check_authorization({})` retourne un UUID neuf, une heure serveur, `authorizationConfirmed:true` et `accountAccess:false`. Refuser les arguments d'identité et les champs inconnus. Répondre dans la langue de l'utilisateur.

Établir la découverte HTTPS publique et le challenge OAuth avant de lancer le login. La ressource annoncée doit venir d'une configuration explicite ; un Host reçu ne la redéfinit pas. Limiter le tunnel aux routes MCP et metadata nécessaires.

## Configurer le consentement standard

Créer ou réutiliser le client TEST autorisé avec PKCE S256, consentement standard et le seul scope utile. Copier le callback affiché par la connexion ChatGPT. Le parcours reçu utilise un client public pré-enregistré et la méthode `none`, sans secret client saisi dans ChatGPT.

La disponibilité CIMD et DCR dépend de la découverte effective. Vérifier le formulaire après chargement. Conserver le repli manuel reçu lorsque CIMD n'est pas prouvé ; ne pas élargir les admissions pour faire apparaître une option.

Vérifier que la requête réelle porte le scope minimal, la ressource exacte et PKCE S256. Conserver seulement une preuve expurgée. Le login ou un compte affiché comme connecté ne prouvent pas encore un appel MCP protégé.

## Vérifier chaque appel côté serveur

Avec un token opaque, utiliser la vérification Clerk documentée. Exiger le type OAuth attendu, l'issuer lié à l'instance, l'audience exacte, le client dédié, un sujet non vide, le scope, une expiration future et l'absence de révocation. Vérifier l'heure après le retour réseau. Refuser une vérification indisponible ou une réponse malformée.

Les types normalisés d'un SDK peuvent supprimer l'audience. Lire le format réellement vérifié avant de choisir l'adaptateur. Une identité ou un client ID reconnu ne remplace pas la preuve d'audience.

Garder le contexte attaché à l'appel. Aucun utilisateur courant global, aucun cache positif partagé, aucun jeton ou identifiant de compte dans les arguments, sorties ou journaux du diagnostic.

## Recevoir la connexion

- Tester FR puis EN dans deux chats indépendants, avec mention de la bonne connexion et arguments vides. Comparer chaque UUID et heure avec l'événement serveur.
- Refuser le consentement depuis un client ou grant neuf. Vérifier l'absence de compte connecté et de nouvel événement autorisé.
- Vérifier les refus sans token, token invalide, scope absent, mauvaise audience, expiration et panne de vérification avec des tests adaptés.
- Pour le retrait réel, révoquer chez le fournisseur et rejouer l'ancien token. La déconnexion visible du client est une autre preuve. Ne promettre une révocation immédiate qu'après mesure.
- Prévoir une reconnexion de test après le retrait. Si une interruption ou un accès supplémentaire exige une décision, préparer la sonde et demander uniquement cette décision. Ne pas contourner un refus automatique.

## Consigner les résultats

Séparer code/tests, disponibilité HTTPS, OAuth direct et installation du package. Un succès direct ne prouve pas le mapping d'un plugin installé. Conserver la fiche produit et ses IDs ; remplacer une identité de connexion seulement dans le périmètre autorisé.

Le reçu indique les versions, champs publics, captures sans identité, UUID concordants, refus, contrôles encore ouverts et processus conservés. Terminer par l'action humaine précise restante, ou par la confirmation qu'aucune intervention n'est nécessaire.

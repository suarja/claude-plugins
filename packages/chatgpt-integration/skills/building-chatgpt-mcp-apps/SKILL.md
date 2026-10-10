---
name: "building-chatgpt-mcp-apps"
description: "Use when building, updating or receiving an interactive MCP Apps interface in ChatGPT, including data/render separation, widget actions, explicit saving, stale tool resources and cross-chat recovery. Compose with the separate Clerk connection and private plugin packaging skills."
---

# Construire et recevoir une interface MCP Apps dans ChatGPT

Livrer des preuves distinctes : contrat source, serveur public, catalogue découvert,
rendu dans le vrai host, action utilisateur et relecture durable. Une maquette,
une sortie structurée ou un test local ne prouve pas le rendu dans ChatGPT.

## 1. Partir du parcours et des preuves

Lire la maquette acceptée, les outils réellement découverts, les types persistés
et les captures du parcours. Séparer ce que ChatGPT rédige, ce que le serveur
collecte/vérifie/conserve et ce que le composant affiche. Un skill ne crée pas
un outil, un grant OAuth ni une recherche absente du client.

Reproduire le défaut avant de modifier : cartes ChatGPT doublant l'app, texte
illisible, outil obsolète, sauvegarde incertaine ou reprise différente. Garder
l'état avant et la porte de sortie. Ne pas confondre couleur/thème du host avec
une consigne produit et ne pas réécrire une maquette déjà acceptée.

## 2. Contrat de données et rendu

Réutiliser le stockage métier ; pas de bibliothèque parallèle au widget.
La lecture et le rendu ne collectent ni ne sauvegardent implicitement.
Lier la ressource au seul outil qui affiche le résultat avec
`_meta.ui.resourceUri`, MIME `text/html;profile=mcp-app`.
Le modèle exploite d'abord les données, puis demande le rendu approprié.
L'interface reste utilisable avec les autorisations effectivement accordées.

Utiliser le bridge JSON-RPC MCP Apps : `ui/initialize`, notifications de
résultats, `tools/call`, `ui/message`, `ui/update-model-context`,
`ui/open-link`, selon les capacités disponibles. Le clic qui rédige demande
une continuation ChatGPT ; le clic qui garde un texte appelle l'écriture
explicite. Projeter le résultat validé côté serveur et vérifier les schémas stricts.

Lire la version du SDK installée avant de copier un exemple : les exemples
MCP 1.x et les handlers 2.x ne sont pas interchangeables.

## 3. Hiérarchie et langage utilisateur

Respecter la largeur et le thème du host, sa police, la langue, la taille
réellement lisible et le compositeur natif. Carte compacte pour sélectionner ;
surface plus ample seulement pour les tâches riches. Glass discret,
contraste suffisant ; aucune marge qui rétrécit artificiellement le contenu.

Dans un script, placer le texte à dire en premier. Séparer les indications de
tournage. Replier les inspirations et le contexte après les actions.
Légende, transcription, interprétation et script sont des objets différents.
Une miniature de source n'est pas la couverture d'une future vidéo.
Afficher un titre humain ; les IDs servent aux outils. Une absence reste absente.

Après le rendu app, les instructions du skill ET les descriptions d'outils ET
les messages des boutons doivent demander le même prochain rendu. Ne pas
ajouter un autre jeu de cartes ou un questionnaire ChatGPT qui duplique l'app.
Une question simple reste une réponse conversationnelle. Ne pas annoncer
« le widget n'est pas apparu » sans preuve : le modèle n'observe pas ses pixels.

Les quotas concernent les actions concernées. Masquer coûts fournisseur,
réservations et plafonds de test dans les réponses créatives. Un refus réel
est expliqué une fois ; distinguer limite utilisateur et service indisponible.
Un lien d'information sur l'abonnement ne prouve pas un achat ni un déblocage.

## 4. Écriture, réessai et reprise

Figer intention, contenu et UUID avant l'écriture. Après timeout, reprendre
avec la même clé et le même corps. Un conflit se réconcilie ; une nouvelle clé
ne doit pas masquer une issue inconnue. Conserver les préférences confirmées,
mode, direction, sources et références d'exemples de voix du contenu historique.

Lire l'objet canonique après sauvegarde avant de confirmer. Tester une nouvelle
conversation sans lui fournir le texte ni les IDs : découvrir par liste/titre,
relire puis rendre saved. Comparer le texte exact et les métadonnées ; vérifier
que la reprise n'ajoute pas de doublon ou de consommation.

La collecte serveur peut continuer après fermeture du chat. La rédaction par
ChatGPT nécessite une conversation active ; ne pas promettre un rapport
autonome. Relecture, nouvelle interprétation du même snapshot et nouvelle
collecte sont trois intentions différentes. Ne pas inventer une capacité refresh.

## 5. Livraison UI et cache

Chaque URI versionnée est une clé de cache. Après un changement incompatible,
mettre à jour toutes ses références. Déclarer précisément les domaines CSP.
Backend, outils/ressources et package de skills ont des livraisons distinctes.

Vérifier le catalogue reçu. Sur le client Be Viral reçu le 10 octobre 2026,
OAuth reconnecté gardait les anciennes ressources ; Actualiser les outils
dans la connexion puis ouvrir un nouveau chat a reçu les nouvelles versions.
Chercher ce contrôle dans le client courant ; ce libellé n'est pas universel.
Conserver la fiche et les grants existants.

## 6. Réception

- Tests source : frontières de lecture/écriture, comptes distincts, conflits,
  reprise incertaine, sources manquantes et quota sans collecte implicite.
- Hébergement : HTTPS public, metadata accessibles, MCP non authentifié refusé,
  cohérence du serveur et du backend ; aucun tunnel/localhost dans la réception.
- Host : rendu et vrais clics FR/EN, clair/sombre, format étroit et CSP active.
- Durabilité : texte exact et métadonnées relus dans un nouveau chat ;
  effets sur le nombre d'objets et l'usage vérifiés séparément.
- Livrer la matrice PASS/FAIL/NOT RUN et les preuves. Ne pas convertir les
  anciens tests ni une réception propriétaire en bêta multi-compte.

## Sources et exemple reçu

[Documentation officielle UI MCP Apps](https://developers.openai.com/plugins/build/chatgpt-ui),
vérifiée le 10 octobre 2026 : ressource/bridge, séparation données/rendu,
URI comme cache et CSP. Adapter ses exemples aux conventions du projet.

Exemple reproductible dans EditIA : `docs/captures/chatgpt-adapter-inspirer-20261010/`
et `docs/captures/chatgpt-script-recovery-20261010/`. Deux scripts de modes
différents, texte parlé et tournage séparés, banque de transcriptions,
sauvegarde par boutons puis reprise exacte dans une autre conversation.
Ces captures prouvent ce parcours sur TEST/DEV ; elles ne prouvent pas un
refresh de données, la production ni les autres comptes.

---
name: creating-private-chatgpt-plugin
description: Use when creating, privately installing, or verifying a skills-only plugin in ChatGPT, including reproducing a personal ZIP import from a supplied method. Utiliser pour créer et recevoir un plugin privé dans ChatGPT sans connexion backend.
---

# Créer et installer un plugin privé dans ChatGPT

Livrer trois preuves distinctes : **package prêt**, **installation ChatGPT
vérifiée**, **skill réellement chargé et exécuté**. Cette méthode couvre S0 ;
MCP, OAuth et données métier sont des étapes séparées du plugin d'intégration.

## Préparer le package

Lire le [guide d'installation privée](references/private-installation.md)
pour les formats, le ZIP et le parcours d'interface reçus. Conserver
l'identifiant demandé en kebab-case et le nom affiché. Vérifier les sources
officielles et la surface accessible avant une nouvelle installation.

Créer un manifeste portable `plugin.json` à la racine, la présentation sous
`extensions.com.openai.interface`, puis un skill autonome dans
`skills/<nom>/SKILL.md`. Le skill travaille sur les éléments fournis et
respecte la langue demandée. Ne pas inventer d'auteur, d'URL ou de capacité.

Valider JSON, frontmatter, chemins, références et archive. Le ZIP contient
`plugin.json` et `skills/` **à sa racine**, sans dossier enveloppant. N'ajouter
ni configuration MCP, référence d'app, hook, secret ni code backend pour
obtenir une installation composée uniquement de skills.

## Installer dans la surface autorisée

Privilégier les outils de gestion disponibles. À défaut, le canal reçu est
**ChatGPT web → Plugins → Personnel → Ajouter → Importer une archive de
plugin**, puis **Ajouter un plugin → Installer le plug-in**.

Confirmer **Installés**, la version et **Gérer → Utiliser <skill>** activé.
Le catalogue Personnel affiche le package dans **Créés par vous**. Ne pas
inférer une publication workspace depuis le libellé générique du développeur
« Workspace upload ». Ne publier ni au workspace ni au catalogue public sans
une demande distincte.

Une marketplace Codex en erreur n'empêche pas ce canal web ; préserver sa
configuration. Si le contrôle desktop est refusé, essayer la surface web
autorisée. Si aucun canal compatible n'est disponible, terminer le package,
documenter la restriction et l'intervention minimum. Ne pas ajouter un serveur
factice ni annoncer une preuve Codex comme preuve ChatGPT.

## Vérifier le chargement et l'usage

Utiliser **Essayer dans le chat** pour une conversation neuve avec la mention
du plugin. Tester un message FR puis EN dans deux conversations indépendantes.
Conserver les messages source, sorties, liens, version, modèle observé et
captures des résultats.

Ouvrir le skill dans la fiche du plugin et comparer son corps avec la source.
Après chaque essai, demander son nom exact et une instruction distinctive du
skill **absente du message source**, sans fournir la réponse. Combiner cette
restitution avec l'activation visible et le respect de la méthode ; une
simple déclaration du modèle « j'utilise ce skill » ne suffit pas seule.
Décrire les limites si le client n'expose aucun journal de chargement interne.

## Mettre à jour et consigner

Une édition locale ne modifie pas le package cloud. Incrémenter sa version,
reconstruire le ZIP et utiliser **Autres actions → Importer une nouvelle
version** sur **la fiche existante** ; vérifier contenu/version et rejouer
les essais dans de nouveaux chats. Distinguer menu observé et mise à jour
effectivement exécutée. Éviter de créer un doublon par **Ajouter**.

Livrer un reçu avec les trois états, les fichiers sources, l'archive et ses
empreintes, les preuves FR/EN, le canal de distribution, la procédure de mise
à jour et les contrôles non exécutés. Conserver les configurations et travaux
préexistants ; commiter seulement le périmètre demandé.

---
name: creating-private-chatgpt-plugin
description: Use when creating, privately installing, updating, or verifying a ChatGPT plugin, including same-identity updates through Plugin Creator or ZIP import and composition of already-authorized apps. Utiliser pour créer, mettre à jour et recevoir un plugin privé ; la configuration MCP/OAuth reste une recette distincte.
---

# Créer, installer et mettre à jour un plugin privé dans ChatGPT

Livrer trois preuves distinctes : **package prêt**, **installation ChatGPT
vérifiée**, **skill réellement chargé et exécuté**. La création initiale peut rester
composée uniquement de skills. Une mise à jour peut réunir des apps déjà
autorisées ; configurer leur MCP, OAuth ou hébergement reste une étape
distincte, couverte par la recette `connecting-chatgpt-mcp-with-clerk`.

## Préparer le package

Lire le [guide d'installation privée](references/private-installation.md)
pour les formats, le ZIP et le parcours d'interface reçus. Conserver
l'identifiant demandé en kebab-case et le nom affiché. Vérifier les sources
officielles et la surface accessible avant une nouvelle installation.

Créer un manifeste portable plugin.json à la racine, la présentation sous
`extensions.com.openai.interface`, puis un skill autonome dans
skills/<nom>/SKILL.md. Le skill travaille sur les éléments fournis et
respecte la langue demandée. Ne pas inventer d'auteur, d'URL ou de capacité.

Valider JSON, frontmatter, chemins, références et archive. Le ZIP contient
plugin.json et `skills/` **à sa racine**, sans dossier enveloppant. N'ajouter
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

Lire [la recette de mise à jour reçue](references/updating-existing-plugin.md)
pour le canal Plugin Creator, la conservation d'identité et les fichiers
hérités. Une édition locale ou une synchronisation Omni ne modifie pas le
package installé dans ChatGPT.

Incrémenter la version et préparer l'archive. Utiliser le canal observé :
**Importer une nouvelle version** sur la fiche existante, ou **Plugin Creator**
avec cette fiche et son ID explicite. L'absence du menu ZIP ne prouve pas
l'absence de tout canal ; essayer Creator dans le périmètre autorisé avant
de conclure à un blocage. **Ajouter → Créer un plug-in** ouvre aussi Creator ;
la demande doit préciser qu'il faut mettre à jour l'identité existante.

Avec Creator, inspecter l'inventaire après application : le mode de mise à
jour reçu conservait les fichiers omis. Ne pas croire qu'une ancienne
déclaration MCP disparaît avec son retrait du ZIP. Si la suppression ciblée
n'est pas disponible, neutraliser seulement les déclarations obsolètes
identifiées avec le format accepté, puis relire la compatibilité générée.
Conserver les références d'apps et grants existants ; une mise à jour du
package ne consent pas de nouveaux droits.

Recevoir la nouvelle version, le même ID privé, le contenu enregistré, les
activations et deux chats neufs FR/EN. Distinguer un menu observé, le reçu
d'application et l'usage réel. Ne pas créer un doublon ni désinstaller pour
contourner une absence de menu.

Livrer un reçu avec les trois états, les fichiers sources, l'archive et ses
empreintes, les preuves FR/EN, le canal de distribution, la procédure de mise
à jour et les contrôles non exécutés. Conserver les configurations et travaux
préexistants ; commiter seulement le périmètre demandé.

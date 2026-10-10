# Mettre à jour un plugin ChatGPT existant

Recette reçue le **4 octobre 2026** : Be Viral AI est passé de 0.2.0 à 0.3.2
sur sa fiche personnelle privée, via **Plugin Creator + ZIP**. Les quatre
apps déjà connectées et trois skills ont été conservés. Les comportements
ci-dessous sont observés sur ce client ; vérifier leur disponibilité avant
une nouvelle opération.

## Choisir le canal réellement accessible

La documentation OpenAI décrit deux voies :
- Sur la fiche d'un plugin importé, **Importer une nouvelle version** lorsque
  disponible.
- Dans une conversation, mentionner **Plugin Creator** et le plugin existant,
  puis décrire la modification.

L'absence du premier menu ne bloque pas nécessairement le second. Le point
d'entrée observé **Plugins → Ajouter → Créer un plug-in** ouvre un chat avec
Creator ; l'ouverture seule ne crée pas de nouvelle fiche. La demande doit
viser explicitement le plugin existant. Une marketplace locale ou sa copie
synchronisée est une source distincte du package cloud ChatGPT.

## Préparer et appliquer la version

1. Relever l'ID cloud original, le nom portable, la version et la visibilité.
   Garder les IDs des apps et leurs permissions. L'ID de la fiche, celui
   du package et ceux des connexions ne sont pas interchangeables.
2. Préparer un ZIP versionné, contrôlé et sans secrets. Garder son SHA256 et
   les octets exacts. Pour réunir des apps déjà enregistrées, utiliser le
   mapping documenté `extensions.com.openai.apps` vers `.app.json`.
   `required:false` conserve l'usage d'un skill autonome sans app ; choisir
   le caractère optionnel selon le besoin réel. Le mapping n'accorde aucun
   droit OAuth et ne déploie aucun serveur.
3. Joindre l'archive à Creator avec le plugin original et demander sa mise
   à jour, en conservant son ID et sa visibilité. Demander une lecture des
   fichiers enregistrés, un statut d'application réel et la release.
4. Comparer les contenus ou empreintes des fichiers importés et enregistrés.
   Inspecter aussi les fichiers supplémentaires et le manifeste de
   compatibilité généré ; ne pas attribuer toute l'exactitude du package
   à une affirmation textuelle du modèle.
5. Vérifier indépendamment la fiche : version, apps connectées, skills
   activés dans Gérer et parcours Essayer dans le chat.

Exemple de demande, en remplaçant les valeurs avant envoi :

> Mets à jour le plugin existant nommé dans cette conversation avec le ZIP
> joint. Conserve son ID cloud original indiqué, son nom portable et sa
> visibilité privée. Ne crée pas de doublon, ne désinstalle rien et ne publie
> pas au workspace ou au catalogue. Conserve les apps et grants existants.
> Relis les fichiers enregistrés, compare leurs empreintes avec l'archive
> et donne le reçu réel ainsi que la release et les fichiers supplémentaires.

Cette demande n'autorise ni un nouveau grant ni un remplacement de connexion.
Une intervention demandée au propriétaire doit nommer l'action concrète et
sa destination ; ne pas lui demander de retrouver un menu déjà constaté absent.

## Piège reçu : omettre un fichier ne le supprime pas

L'opération Creator reçue en 0.3.1 superposait les fichiers. Les anciens
`mcp.json` et `.mcp.json`, absents du ZIP, restaient enregistrés et
pointaient vers un tunnel temporaire historique. Le manifeste généré
référençait encore `.mcp.json`. Aucune suppression ciblée de fichier
n'était exposée par cet outil.

Après identification de ces seules déclarations obsolètes, la correction
0.3.2 a inclus les fichiers vides au format accepté :

`mcp.json` :
```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {}
}
```

`.mcp.json` :
```json
{
  "mcpServers": {}
}
```

La relecture confirmait l'absence de serveur historique dans ces fichiers
et le manifeste généré, tout en conservant `.app.json`. Cette correction
est adaptée à ce cas ; ne pas vider un MCP actuel ou un fichier inconnu.
Ne pas généraliser la superposition à un canal dont le comportement n'a pas
été observé. Vérifier les autres fichiers supplémentaires s'il y en a.

## Recevoir le package installé

Tester deux chats neufs **FR puis EN**, ouverts depuis la fiche avec sa
mention conservée. Choisir des parcours représentatifs de la modification ;
un diagnostic de compte ne prouve pas le droit de lire des vidéos.

Comparer le corps du skill installé avec la source, son activation visible,
le résultat obtenu et la restitution d'une instruction distinctive absente
du prompt initial. Le cas reçu utilisait la contrainte des accroches
« moins de 100 caractères » et la relance avec **même UUID / même payload**.
La seule déclaration « j'utilise ce skill » ne suffit pas.

Pour les parcours MCP, rapprocher UUID, opération, statut et heure affichés
des reçus serveur expurgés. Conserver séparément :
- contrôles locaux de l'archive ;
- reçu Creator et relecture du contenu ;
- fiche, version et activations réellement observées ;
- usage du plugin dans les chats, distinct des tests directs des apps.

Le cas reçu : compte et accroches en FR ; profil et deux vidéos en EN,
transcription disponible ou absente distinguée de la légende, déductions
du profil non présentées comme validées. Trois nouvelles lectures
concordaient entre ChatGPT, Next et Convex. Aucune écriture n'était nécessaire
pour recevoir cette mise à jour ; sauvegarde et relance avaient déjà été reçues.

Si le téléchargement ZIP cloud n'est pas récupéré, le signaler ; conserver
le ZIP envoyé et combiner relecture et preuves indépendantes. Ne pas
inventer une copie téléchargée. Le menu **Importer une nouvelle version**
est réapparu après cette correction sur le compte reçu ; cela n'est pas
une garantie pour les autres comptes ou une preuve que son import a été testé.

## Sources et exemple de réception

- [Modifier un plugin et importer un ZIP — OpenAI](https://help.openai.com/en/articles/20001256-plugins-in-chatgpt)
- [Packaging et apps enregistrées — OpenAI](https://developers.openai.com/plugins/build/plugins)

Sources revérifiées le 4 octobre 2026. Exemple Be Viral AI : version 0.3.2,
release `pluginrel_6ac29345d7c08191a1fbe1b56462b695`. Garder dans le reçu
du nouveau projet ses propres IDs, versions, archives et preuves ; aucun
identifiant d'exemple n'est une valeur de configuration à réutiliser.

## UI et catalogue : trois versions indépendantes — réception du 10 octobre 2026

Le backend, les outils/ressources MCP et les instructions du plugin ont chacun
leur livraison. Conserver leurs commits/releases/URI dans le reçu. Un package
actualisé ne change pas les ressources embarquées dans un ancien serveur.

Après une évolution de description, schéma ou URI UI, vérifier le catalogue
réel de la connexion. Sur le client reçu, la reconnexion OAuth seule n'a pas
rafraîchi les outils : **Paramètres → Apps → connexion concernée → Actualiser
les outils**, puis une **nouvelle conversation**, a fait apparaître la nouvelle
ressource. Les chats existants gardaient leur ancien contexte. Ce chemin est
une observation de ce client ; chercher le contrôle disponible avant de
généraliser son libellé. Ne pas désinstaller ni recréer une app pour vider son cache.

Recevoir séparément : l'URI publiée, l'outil découvert, le clic depuis le
composant, puis le texte sauvegardé relu dans une autre conversation. Une
réponse structurée ne prouve pas l'affichage. La publication d'un skill ne
prouve pas son usage FR/EN : garder cette porte ouverte si elle n'a pas été rejouée.

La méthode de construction et de réception du composant est portée par
`building-chatgpt-mcp-apps`. Elle ne remplace ni cette recette de package
ni la connexion OAuth.

# Guide S0 — création et installation privée

Procédure fondée sur la réception **Be Viral AI `0.1.0` dans ChatGPT web,
mode Work, le 3 octobre 2026**. Vérifier le canal et les formats sur le client
cible avant de les réutiliser. Le guide est autonome une fois le plugin
installé ; il ne dépend pas du dépôt EditIA ou d'un backend.

## 1. Structure minimale reçue

```text
beviral-ai/
├── plugin.json
├── README.md
└── skills/
    └── beviral-content-starter/
        └── SKILL.md
```

Manifeste réel reçu, à adapter avec l'identifiant et le nom du nouveau plugin :

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "beviral-ai",
  "version": "0.1.0",
  "description": "Préparer trois accroches avec la méthode Be Viral AI à partir d'un texte fourni.",
  "extensions": {
    "com.openai": {
      "interface": {
        "displayName": "Be Viral AI",
        "shortDescription": "Trois accroches à partir de votre texte / Three hooks from your text."
      }
    }
  }
}
```

`name` identifie le package ; `interface.displayName` est son nom visible.
Le format portable découvre `skills/` sans champ `skills` dans le manifeste.
Aucun auteur, site ou contact inventé. Le client a accepté ce manifeste sans
MCP, OAuth, configuration d'app ou overlay `.codex-plugin`.

## 2. Écrire la méthode

Chaque `SKILL.md` commence par un frontmatter avec `name` et `description`.
Le nom doit correspondre au dossier ; la description précise le déclencheur.
Le corps contient les étapes utiles, les entrées, la langue, le résultat et
les limites. Garder une méthode simple autonome ; placer les références
plus longues dans son dossier et les lier depuis le skill.

Le cas Be Viral AI demandait exactement trois accroches et une recommandation :
problème concret, contraste soutenu par le texte, promesse précise. La méthode
exigeait moins de 100 caractères par accroche, sans statistique inventée,
garantie de viralité ou prétention d'accès au compte.

## 3. Contrôler et fabriquer l'archive

Vérifier le JSON, le frontmatter, les chemins et l'existence des références.
Si le validateur de skills disponible ne fonctionne pas, relever l'erreur et
faire un contrôle léger explicite, sans prétendre avoir exécuté le validateur.
Dans la réception initiale, `quick_validate.py` était indisponible faute de
PyYAML ; JSON et frontmatter minimal ont été vérifiés indépendamment.

Exemple reproductible depuis un dépôt contenant `plugins/beviral-ai` :

```bash
python3 - plugins/beviral-ai /private/tmp/beviral-ai-0.1.0.zip <<'PY'
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib, json, sys

root = Path(sys.argv[1]).resolve()
output = Path(sys.argv[2]).resolve()
assert root.is_dir()
assert root != output and root not in output.parents
json.loads((root / 'plugin.json').read_text())
files = sorted(p for p in root.rglob('*') if p.is_file())
assert any(p.relative_to(root).as_posix().endswith('/SKILL.md') for p in files)
assert not output.exists(), 'Choisir un nouveau fichier de sortie'
with ZipFile(output, 'x', ZIP_DEFLATED) as archive:
    for path in files:
        assert not path.is_symlink(), 'Examiner les symlinks avant packaging'
        archive.write(path, path.relative_to(root))
with ZipFile(output) as archive:
    assert archive.testzip() is None
    print(archive.namelist())
print('SHA256', hashlib.sha256(output.read_bytes()).hexdigest())
PY
```

Adapter les deux arguments pour un autre package. Revoir les fichiers inclus
avant l'import : seuls le manifeste, les skills, leur documentation et leurs
ressources prévues ; aucun réglage personnel ou secret. L'archive doit avoir
**`plugin.json` à sa racine**, pas `beviral-ai/plugin.json`. Conserver une copie
des octets importés et son empreinte dans le reçu.

## 4. Importer et installer en privé

1. Ouvrir **ChatGPT web → Plugins → Personnel** sur le compte autorisé.
2. Ouvrir **Ajouter → Importer une archive de plugin**.
3. Choisir le ZIP et cliquer **Ajouter un plugin**. Le formulaire observé
   acceptait ZIP, TAR.GZ et TGZ, jusqu'à 100 Mo.
4. Sur la fiche créée, vérifier identité, version et skill ; cliquer
   **Installer le plug-in**.
5. Vérifier la présence sous **Installés**, **Essayer dans le chat**, et
   **Gérer → Utiliser <skill>** activé. Ouvrir le skill pour vérifier le corps
   réellement importé.
6. Vérifier le catalogue **Personnel → Créés par vous**. Aucun parcours
   de publication publique ou workspace n'est nécessaire pour cet essai.

Le nom « Workspace upload » observé dans le champ développeur ne suffit pas
à conclure à une publication au workspace. L'identifiant cloud attribué par
ChatGPT est distinct de l'identifiant portable ; le relever après import,
sans réutiliser celui d'un autre plugin.

## 5. Essais et preuve de chargement

Cliquer **Essayer dans le chat** ; le client reçu ouvrait **Work** et insérait
la mention Be Viral AI. Ne pas remplacer la mention en saisissant le texte.
Envoyer un message FR, puis démarrer une seconde conversation depuis la fiche
pour EN. Voici les deux entrées effectivement utilisées :

```text
FR — Utilise Be Viral AI pour proposer trois accroches de vidéo courte.
Texte : Je conseille aux créateurs débutants de filmer une seule idée par
vidéo. Je veux leur montrer comment clarifier leur message avant de filmer.
Public : créateurs débutants. Objectif : leur donner envie d'essayer.
```

```text
EN — Use Be Viral AI to draft three short-video hooks.
Source: I advise new creators to cover one idea per video. I want to show
them how to clarify their message before filming.
Audience: new creators. Goal: encourage them to try the method.
```

Adapter l'entrée à la méthode du nouveau plugin ; vérifier le nombre et la
forme des résultats, leur langue, les faits utilisés et l'absence de capacités
inventées. Le cas réel a produit trois accroches, leurs angles et une
recommandation en FR et EN, avec longueurs FR **69 / 56 / 69** et EN
**60 / 51 / 67** caractères.

Contrôle complémentaire de chargement, sans fournir les valeurs attendues :

> Quel est le nom exact du skill utilisé et quelle consigne de longueur des
> accroches figure dans ses instructions ? Cite cette seule consigne, sans
> inventer un accès à des fichiers.

Dans les deux essais, ChatGPT a restitué `beviral-content-starter` et la phrase
« Privilégier des mots concrets et moins de 100 caractères par accroche. »,
absents des messages source. Pour une autre méthode, choisir une instruction
interne tout aussi distinctive.

| État | Preuve utile | Ce qui ne suffit pas seul |
| --- | --- | --- |
| Package prêt | Formats, chemins et ZIP contrôlés | Existence du fichier |
| Installation ChatGPT | Installés, version et skill activé | Import terminé |
| Skill chargé et exécuté | Corps importé conforme, instruction interne restituée, sortie conforme | Déclaration du modèle |

Si aucun journal interne n'est exposé, le préciser : les preuves ci-dessus
portent sur le comportement et l'interface observables, pas sur un cache cloud
inspecté ou une trace interne inaccessible. Une installation Codex reste une
preuve séparée.

## 6. Mettre à jour la même installation

Après modification de la méthode : incrémenter la version, reconstruire le
ZIP, puis ouvrir **la fiche existante → Autres actions → Importer une nouvelle
version**. Vérifier la nouvelle version, le corps du skill et son activation,
puis refaire les essais dans des conversations neuves. Une édition locale ne
met pas à jour l'archive cloud ; **Ajouter** créerait une autre installation.

Dans le cas initial, **le menu a été observé mais aucune nouvelle version n'a
été importée**, puisque `0.1.0` chargeait déjà la bonne méthode. Ne pas
présenter ce menu comme une mise à jour effectivement testée.

## 7. Restrictions rencontrées

- Contrôle natif du client desktop refusé par Computer Use : le canal web
  accessible a permis l'installation et les essais, sans redémarrage.
- Marketplace Codex temporaire absente : configuration préservée, aucune
  réparation ou seconde marketplace nécessaire au canal web.
- Téléchargement de la copie ZIP cloud : aucun événement reçu dans le délai
  de 15 secondes. Ne pas annoncer de cache/copie récupéré ; conserver l'archive
  envoyée et vérifier le corps du skill dans la fiche.

Si le futur compte ne propose aucun canal privé compatible, consigner cette
restriction et livrer le package prêt. Ne pas fabriquer une connexion MCP
pour contourner une restriction de distribution.

## 8. Étendre l'intégration plus tard

S0 installe la méthode. S1 peut établir un MCP de diagnostic sans données
privées. S2 traite le consentement OAuth et la validation de l'autorisation.
S3 introduit l'identité backend et la lecture autorisée des données. Ajouter
ces méthodes au même plugin d'intégration **après leurs essais**, avec des
skills et reçus distincts ; conserver S0 utilisable seule.

## Sources officielles

- [Packaging OpenAI](https://developers.openai.com/plugins/build/plugins)
- [Création de skills](https://developers.openai.com/plugins/build/skills)
- [Connexion et test](https://developers.openai.com/plugins/deploy/connect-chatgpt)

Sources vérifiées le 3 octobre 2026. Le canal d'import d'archive Personnel
ci-dessus a été observé directement ; sa disponibilité future dépend du
client et du compte.

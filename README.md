# claude-plugins

Personal registry of Claude Code plugins.

## Install a plugin

```bash
# Clone the registry (first time)
git clone git@github.com:<your-username>/claude-plugins.git ~/claude-plugins

# Install a specific plugin
cd ~/claude-plugins && ./install.sh codebase-wiki

# Install all plugins
cd ~/claude-plugins && ./install.sh --all

# List available plugins
./install.sh --list
```

Then reload in Claude Code:
```
/reload-plugins
```

## Plugins

| Plugin | Description |
|--------|-------------|
| [`codebase-wiki`](./codebase-wiki/) | Karpathy-style `docs/index.md` wiki — `/doc-init`, `/doc-update`, `/doc-audit` |

## Adding a plugin

1. Create a directory: `<plugin-name>/`
2. Add `.claude-plugin/plugin.json` manifest (at minimum `{"name": "plugin-name"}`)
3. Add components in `commands/`, `skills/`, `agents/`, `hooks/` as needed
4. Run `./install.sh <plugin-name>` to install locally

Plugin structure follows the [Claude Code plugin spec](https://docs.claude.ai/code/plugins).

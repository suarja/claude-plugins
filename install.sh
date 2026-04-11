#!/bin/bash
# install.sh — Install a plugin from this registry into ~/.claude/plugins/local/
#
# Usage:
#   ./install.sh <plugin-name>          # Install a specific plugin
#   ./install.sh --all                  # Install all plugins
#
# After install, reload plugins in Claude Code:
#   /reload-plugins  (or restart Claude Code)

set -e

REGISTRY_DIR="$(cd "$(dirname "$0")" && pwd)"
DEST_DIR="$HOME/.claude/plugins/local"

install_plugin() {
  local name="$1"
  local src="$REGISTRY_DIR/$name"

  if [ ! -d "$src" ]; then
    echo "Plugin '$name' not found in registry."
    echo "Available plugins:"
    list_plugins
    exit 1
  fi

  mkdir -p "$DEST_DIR/$name"
  cp -r "$src/." "$DEST_DIR/$name/"
  echo "Installed: $name → $DEST_DIR/$name"
}

list_plugins() {
  for dir in "$REGISTRY_DIR"/*/; do
    plugin_name=$(basename "$dir")
    if [ -f "$dir/.claude-plugin/plugin.json" ]; then
      desc=$(python3 -c "import json,sys; d=json.load(open('$dir/.claude-plugin/plugin.json')); print(d.get('description','')[:60])" 2>/dev/null || echo "")
      printf "  %-20s %s\n" "$plugin_name" "$desc"
    fi
  done
}

if [ $# -eq 0 ]; then
  echo "Usage: ./install.sh <plugin-name> | --all | --list"
  echo ""
  echo "Available plugins:"
  list_plugins
  exit 0
fi

case "$1" in
  --list)
    echo "Available plugins:"
    list_plugins
    ;;
  --all)
    for dir in "$REGISTRY_DIR"/*/; do
      plugin_name=$(basename "$dir")
      if [ -f "$dir/.claude-plugin/plugin.json" ]; then
        install_plugin "$plugin_name"
      fi
    done
    echo "Done. Reload with /reload-plugins in Claude Code."
    ;;
  *)
    install_plugin "$1"
    echo "Done. Reload with /reload-plugins in Claude Code."
    ;;
esac

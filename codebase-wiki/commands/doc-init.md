Initialize the codebase wiki for the current project using the codebase-wiki skill.

Arguments: $ARGUMENTS (optional: --quick or --deep, default is balanced)

Parse the arguments:
- If "--quick": run the quick scan (file tree only, arborescence)
- If "--deep": run the deep scan (full file read, cross-references)
- Otherwise (no args): run the default balanced scan

Then follow the codebase-wiki skill instructions exactly for the chosen depth.

After completing the scan:
1. Create or update docs/index.md
2. Add @docs/index.md import to root CLAUDE.md if not present
3. Report what was created/updated

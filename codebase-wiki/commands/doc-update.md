Update the codebase wiki (docs/index.md) based on changes made in the current session.

Follow the codebase-wiki skill `/doc update` instructions:
1. Check what changed in this session (git diff --name-only HEAD, or session context)
2. Update affected entries in docs/index.md (description + last_updated)
3. Add entries for new files, remove/archive entries for deleted files
4. Update the "Last updated: YYYY-MM-DD" header in docs/index.md
5. Verify @docs/index.md import is still in root CLAUDE.md

Keep the update scoped — only touch what changed. Do not rescan the whole codebase.

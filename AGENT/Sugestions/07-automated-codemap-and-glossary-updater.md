# Automated CODEMAP and GLOSSARY Updater

Definition

- Add a script that scans files, reads front matter + exports, and regenerates Outputs/CODEMAP.md and Outputs/GLOSSARY.md.
- Run locally and in CI to keep docs synchronized with code.

Why this helps optimization

- Agents depend on accurate topology and definitions to plan edits; stale docs cause misnavigation.
- Automation eliminates manual drift and speeds onboarding of new tools.

Example: before vs after

- Before
  - CODEMAP lists endpoints/components that were renamed last week; agent patches wrong files.
- After
  - Script updates maps on each PR; agent follows the fresh graph and edits correct symbols.

Implementation notes

- Parse front matter keys (role, purpose, dependencies) + TypeScript exports to build the graph.
- Commit updated docs on PR or publish as a CI artifact for review.

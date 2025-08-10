# Repository Index and Semantic Search Seeds

Definition

- Maintain a small repo_index.json: key files, purposes, and anchors.
- Curate AGENT/Outputs/SEARCH_SEEDS.md with high-signal terms and paths to speed semantic search.

Why this helps optimization

- Agents start from a curated set of anchors, reducing cold-start wandering.
- Improves recall/precision for code navigation and impact analysis.

Example: before vs after

- Before
  - Agent runs broad semantic search and sifts many irrelevant matches.
- After
  - Agent consults repo_index.json and SEARCH_SEEDS.md to target the right folders and symbols first.

Implementation notes

- Update seeds after major refactors; keep index tiny and accurate.

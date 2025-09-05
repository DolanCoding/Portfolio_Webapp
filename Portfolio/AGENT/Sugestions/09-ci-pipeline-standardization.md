# CI Pipeline Standardization and Signals

Definition

- Provide a reusable CI workflow (GitHub Actions) with jobs: lint, typecheck, test, build, docs-update.
- Emit machine-readable status artifacts (JSON summaries) that agents can read post-run.

Why this helps optimization

- Agents can quickly identify failing stage and fetch the exact logs/artifacts to act on.
- Consistency across PRs reduces setup ambiguity and improves reliability of automated fixes.

Example: before vs after

- Before
  - Agent parses raw CI logs to guess which step failed.
- After
  - Agent downloads ci-summary.json -> { failed: "typecheck", file: "db/init_db.ts", message: "unused" } and patches accurately.

Implementation notes

- Keep workflow under .github/workflows/ with a composite action to share across repos.

# Refactor Playbooks (machine-readable)

Definition

- Provide small YAML/JSON playbooks that describe step-by-step refactors: file targets, edits, tests to run, and acceptance checks.

Why this helps optimization

- Reduces trial-and-error by giving agents deterministic procedures for recurring tasks (e.g., add endpoint, rename DTO, split component).
- Encodes guardrails and success criteria, increasing reliability of automated changes.

Example: before vs after

- Before
  - Agent infers steps ad hoc, may miss cascading usages or tests.
- After
  - Agent loads playbook "rename-shared-type": updates shared-types, adjusts imports in FE/BE, runs typecheck and tests, verifies zero errors.

Sample steps

- locate: shared-types/index.ts -> symbol: Project
- edit: rename Project -> PortfolioProject
- propagate: update imports in frontend and backend
- run: backend typecheck, frontend typecheck, all tests
- accept: no TS errors, tests green

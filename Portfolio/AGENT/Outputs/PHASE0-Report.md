# Phase 0 Report

Last Updated: 2025-08-10

Repo Summary (<300 words)

- Monorepo with Express/TypeScript backend (SQLite DB), React/Vite frontend, and shared TypeScript DTOs. Backend exposes two GET routes (projects, certificates) and serves static images. Frontend consumes API via axios, uses React Router with lazy-loaded pages, and constructs image URLs from API base URL. CI existed for frontend only. AGENT scaffolding added for future agents (CODEMAP, GLOSSARY, SEARCH_SEEDS, README.AI), session notes, and ADR.

Risk Register (top 5)

1. TS version drift (FE TS 4.9 vs BE TS 5.5) — unify to 5.x.
2. CI only covered FE; tests/linters missing — risk of undetected regressions.
3. No contract tests for API payloads — risk of breaking FE.
4. Backend imports shared-types as value — risk in CJS bundling (addressed with type-only import).
5. Environment drift (VITE_API_BASE_URL / DB_PATH) — misconfig can break image URLs and DB access.

Affordance Gaps

- Incomplete CI coverage; missing test runners/configs.
- No single runbook for agents (added README.AI).
- Lack of code anchors (added in entrypoints and shared-types).

Proposed Architecture Improvements

- Maintain shared DTOs in shared-types and enforce via contract tests.
- Keep per-package tooling (ESLint/Prettier/Typecheck) with unified Node/TS.
- Split CI into FE/BE jobs for fast feedback; add caching.

Change Plan by Phase

- Phase 1: Add ESLint/Prettier, typecheck scripts, minimal passing tests (FE: Vitest+RTL, BE: Jest), update CI to run both.
- Phase 2: Introduce boundaries (e.g., extract DB access module), enforce dependencies.
- Phase 3: Add API invariants docs, version adapters if needed.
- Phase 4: Add scripts in /tools, lockfiles, structured logs, health checks.

Minimal Safe Diff Pack

- Anchors added to entrypoints and shared-types.
- Initial CI split and scripts; TS unified target to 5.x (FE).
- No behavioral changes to runtime.

Verification Plan

- Lint/typecheck pass in both packages.
- FE vitest smoke test passes.
- BE jest smoke test passes.
- Manual check: Frontend loads; API endpoints return JSON; images load via getImageUrl.

# Health and Readiness Probes

Definition

- Add /health (liveness) and /ready (readiness) endpoints with small JSON payloads and dependency checks (DB, external APIs).

Why this helps optimization

- Agents can orchestrate services deterministically: wait for ready=true before running tests or data seeding.
- Reduces flakes due to race conditions on startup.

Example: before vs after

- Before
  - Agent starts backend and immediately runs tests; intermittent failures because DB not ready.
- After
  - Agent polls /ready until { ready: true, checks: { db: "ok" } } then proceeds.

Implementation notes

- Return HTTP 200 with detailed components; ensure fast and side-effect-free.

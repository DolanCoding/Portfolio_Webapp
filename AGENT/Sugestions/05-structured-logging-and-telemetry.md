# Structured Logging and Lightweight Telemetry

Definition

- Adopt structured JSON logging (level, msg, ctx) in backend and a minimal client logger in frontend.
- Emit key spans/events (server start, DB init, API call timings) to a local log file or console.

Why this helps optimization

- Agents can parse logs deterministically to diagnose failures and measure performance.
- Enables automatic regression detection and selective test reruns.

Example: before vs after

- Before
  - Free-form console.log scattered; agent scrapes strings and may miss errors.
- After
  - { level: "info", event: "db.init", duration_ms: 125, ok: true } entries enable precise queries.

Sample fields

- ts, level, event, msg, duration_ms, error.code, ctx: { route, user, file }.

Implementation notes

- Backend: wrap console with a tiny logger util; replace ad-hoc logs incrementally.
- Frontend: gate debug logs by NODE_ENV to avoid noise in prod.

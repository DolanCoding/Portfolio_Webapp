# Environment Variables Contract and Typed Accessors

Definition

- Provide .env.example and a schema (e.g., zod) validating required/optional env vars for FE/BE.
- Export a typed config module so agents and code do not guess names or defaults.

Why this helps optimization

- Agents can reliably set up and run services with correct envs.
- Prevents runtime surprises due to missing or mistyped variables.

Example: before vs after

- Before
  - Agent scans config.ts and server.ts to infer API_BASE_URL; risk of mismatch.
- After
  - Agent reads .env.example + config schema; sets API_BASE_URL appropriately and proceeds.

Sample

- backend/config/env.ts validates: PORT, NODE_ENV, DB_PATH
- frontend/src/config.ts reads VITE_API_BASE_URL from import.meta.env

Implementation notes

- Fail-fast on invalid env in dev/test; document defaults in .env.example.

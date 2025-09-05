# Copilot Project Instructions

Concise, project-specific guidance for AI coding agents working in this monorepo. Focus on THESE patterns; avoid generic boilerplate.

## 1. Repository Topography & Purpose
- Monorepo with 3 active packages:
  - `Backend/` Express + SQLite API serving project & certificate data and static images.
  - `frontend/` React (Vite) SPA consuming the API, GitHub Pages friendly (note `/Portfolio` base route + `homepage` in package.json).
  - `shared-types/` TypeScript interfaces (`Project`, `Certificate`) imported by both backend (`../shared-types`) and frontend (`../../../shared-types`). Maintain these as the single source of API shape truth.
- `.github/workflows/ci.yml` runs separate frontend + backend pipelines (Node 22). Keep script names stable (`typecheck`, `lint`, `test:ci`, `build`).

## 2. Runtime Architecture & Data Flow
1. Server boot (`Backend/server.ts`): loads env (`dotenv`), initializes SQLite (`db/init_db.ts` → `db_schema.ts` + optional seed in `db_temp_pop.ts` if tables empty), opens a long‑lived connection, then exposes:
   - `GET /api/projects` returns rows mapped to `Project[]` with `id` coerced to string.
   - `GET /api/certificates` returns `Certificate[]`.
   - Serves static images under `/images/project_images` and `/images/Certificates` (physical paths under `Backend/db/Data/images/...`).
2. Frontend config (`frontend/src/config.ts`): reads `VITE_API_BASE_URL` to compose fetch URLs; page routing includes both `/` and `/Portfolio` (deploy base) plus explicit paths.
3. API consumption via thin abstraction (`frontend/src/api/apiClient.ts` → `fetchSomething<T>`). Always prefer this wrapper for new HTTP calls (consistent error normalization to `ApiError`).
4. Images: use `getImageUrl()` helper; never hardcode backend host.

## 3. Conventions & Patterns (Follow / Extend)
- AI/Agent markers: Files embed structured comments (`AI-AGENT CONTEXT`, `AI-LOGICAL-REGION`, `AI-NAVIGATION`, TODO(ai)) – preserve and extend using the same tags; do NOT strip them.
- Shared types: Add fields in `shared-types/index.ts` first, then reflect in DB schema (backend) and any consuming UI. Keep field names identical; backend route mappers should coerce numeric IDs to string.
- DB seeding: Only occurs if table row count is zero. If adding a new table: update `db_schema.ts`, create matching JSON seed file under `Backend/db/Data/init_pop/<table>.json` with arrays of objects having ALL defined columns.
- Static image exposure: New image folders must be added via additional `express.static` mounts in `server.ts`.
- Error handling: Backend currently returns `{ error: "Internal server error" }` for 500. Maintain sanitized errors (no stack traces). Frontend normalizes errors to `ApiError` (shape in `frontend/src/types/index.ts`).
- Performance: Prefer lazy loading (React `lazy()` + `Suspense`) for new pages/components; follow `App.tsx` pattern. Use `LazyImage` for any image that is not above the fold.
- Branded IDs: Use `ProjectId` / `CertificateId` (branded string types) in new frontend logic to avoid mixing identifiers.
- Environment & Routing: Respect `/Portfolio` base for GitHub Pages. When adding links or `Route`s include both base & root if necessary to keep direct URL compatibility.

## 4. Development Workflows
Backend:
- Dev: `npm run dev` (nodemon) inside `Backend/` (watch + ts-node via config) OR `dev:raw` for direct ts-node run.
- Build: `npm run build` emits to `dist/` (entry `dist/server.js`).
- Tests: Jest + Supertest placeholder; add route tests under `Backend/tests/`. Use `test:ci` for CI reporter.
Frontend:
- Dev: `npm run dev` (Vite) inside `frontend/`.
- Typecheck only: `npm run typecheck` (both packages).
- Unit tests: `npm test` (Vitest in watch) / `npm run test:ci` (dot reporter) – keep tests colocated (see `App.test.tsx`).
- Build: `npm run build` → `dist/` (Vite). Deployment expects correct `homepage` path.
Repo-wide: No root package.json; run scripts from the respective package folder. CI expects folder names `my-portfolio-frontend` and `my-portfolio-backend`; if you rename local dirs, update workflow.

## 5. Adding Features (Concrete Examples)
- New API route (e.g., `/api/tags`):
  1. Add table definition to `db_schema.ts` + seed JSON.
  2. Extend `shared-types/index.ts` with interface (e.g., `Tag`).
  3. Create route in `server.ts` after DB open (mirror existing route structure; map numeric IDs to string).
  4. Consume via `fetchSomething<Tag[]>("get", API_BASE_URL + "/api/tags")` in frontend.
- New frontend page: create under `frontend/src/pages/<Name>/<Name>.tsx`, lazy import + `<Route path="/<lower>" element={<Name/>} />` pattern in `App.tsx`.
- New image asset path: Place file under appropriate `Backend/db/Data/images/...`; reference via `getImageUrl("project_images/filename.png")`.

## 6. Gotchas & Invariants
- `VITE_API_BASE_URL` must include scheme + host (and port in dev) with NO trailing slash (config code concatenates `/images/...`).
- Database path resolution: `DB_PATH` env overrides default; ensure seeding still points to the same file or you'll see empty data.
- Case sensitivity: Static image route for certificates uses capital `Certificates` matching folder name.
- Keep Node version compatibility (CI uses 22.x). Avoid APIs not available in Node 22 LTS line.
- Ensure new exports in `shared-types` remain type-only imports in backend runtime code to prevent circular runtime deps.

## 7. Extensibility & Quality
- When expanding tests: prefer contract tests ensuring route shapes match shared types; snapshot entire JSON arrays sparingly (focus on schema / required fields).
- Maintain existing ESLint + Prettier zero-warning posture (`--max-warnings=0`). Run `format:check` in CI if adding formatting enforcement.

## 8. Security & Safety Notes
- No raw user SQL; all current queries are static. If adding dynamic queries, use parameter binding (`?` placeholders with values array) via `db.run`/`db.get`.
- Sanitize and validate any new external input before DB insertion (currently none exposed publicly beyond GETs).

## 9. AI Tagging (When You Touch Files)
- Preserve existing `AI-AGENT CONTEXT`, `AI-LOGICAL-REGION`, `AI-NAVIGATION` blocks.
- When creating new files, add a concise header mirroring style:
  `// AI-AGENT CONTEXT: FILE=<name> | ROLE=<Short_Role> | PURPOSE=<Concise_Purpose>`.

## 10. Quick Reference
- Projects route: `GET /api/projects` (returns `Project[]`).
- Certificates route: `GET /api/certificates` (returns `Certificate[]`).
- Image helper: `getImageUrl("project_images/foo.png")`.
- API wrapper: `fetchSomething<Project[]>("get", API_BASE_URL + PROJECTS_ENDPOINT)`.

(End of instructions — request clarifications or missing areas as needed.)

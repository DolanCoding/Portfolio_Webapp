# Workspace Manifest (workspace.json)

Definition

- A small manifest (workspace.json) declaring services, scripts, ports, envs, paths, and dependencies across FE/BE.
- Acts as a single source of truth for agents to resolve locations and runtime context.

Why this helps optimization

- Eliminates path guessing; agents can programmatically find backend, frontend, shared-types, and DB assets.
- Encodes service endpoints and ports so scripts/tests don’t need hardcoded values.
- Improves cross-tool orchestration and reduces setup friction.
- Agents orchestrate tasks deterministically (start backend, wait on port, then run FE tests).

Example: before vs after

- Before
  - Agent heuristically searches for package.json files and infers which folder is the backend.
  - Agent hunts package.json files to find start scripts and ports.
- After
  - Agent reads workspace.json -> packages.backend.cwd = my-portfolio-backend -> runs the right commands immediately.
  - Agent reads workspace.json: backend: { start: npm run dev, port: 3000, health: /health }, frontend: { port: 5173 }.

Sample
{
"packages": {
"frontend": { "cwd": "my-portfolio-frontend", "scripts": ["dev", "build", "test"] },
"backend": { "cwd": "my-portfolio-backend", "scripts": ["dev", "build", "test"] },
"shared": { "cwd": "shared-types" }
},
"services": {
"api": { "url": "http://localhost:3000", "health": "/health" }
},
"datasets": {
"db": { "path": "my-portfolio-backend/db/portfolio.db" }
},
"env": ["API_BASE_URL"],
"owners": { "backend": ["@you"], "frontend": ["@you"] }
}

Implementation notes

- Keep under version control; update when ports/paths change.
- Optionally validate with a JSON Schema to prevent drift.
- Generate from existing package.json and keep in AGENT/.

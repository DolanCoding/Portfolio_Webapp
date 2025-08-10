# Commands Catalog (machine-readable)

Definition

- Maintain a commands.json|yaml listing safe operations (e.g., seed-db, run-tests, add-endpoint) with args, preconditions, and side effects.

Why this helps optimization

- Agents call standardized workflows instead of ad hoc shell/guesswork.
- Prevents dangerous or environment-specific commands.

Example: before vs after

- Before
  - Agent invents a script to seed DB; may miss required envs or paths.
- After
  - Agent invokes "seed-db --data=init_pop" from catalog; validated and idempotent.

Command spec fields

- name, description, args schema, run (script), preconditions, produces (artifacts), rollback.

Implementation notes

- Back commands with npm scripts and document outputs for downstream steps.

# Commands Catalog (commands.json)

Definition

- Introduce a repository-level commands.json that catalogs routine operations: build, test, typecheck, lint, seed-db, start-dev, start-prod, e2e, etc.
- Each command entry includes: description, cwd, script, env, inputs, outputs, prerequisites.

Why this helps optimization

- Agents can reliably locate the exact command and working directory without guessing package.json scripts.
- Encodes dependencies between steps (e.g., seed-db requires build) to avoid flaky runs.
- Enables UI surfaces to offer one-click actions consistently.

Example: before vs after

- Before
  - Agent scans multiple package.json files, infers which script to run and in what order; fragile across workspaces.
- After
  - Agent queries commands.json: tasks.backend.typecheck -> runs from my-portfolio-backend with TypeScript env; no guesswork.

Sample entry
{
"backend": {
"typecheck": {
"description": "Type-check backend",
"cwd": "my-portfolio-backend",
"script": "npm run typecheck",
"prerequisites": []
},
"seed": {
"description": "Initialize SQLite schema and seed data",
"cwd": "my-portfolio-backend",
"script": "npm run dev -- init-db",
"prerequisites": ["build"]
}
}
}

Implementation notes

- Place commands.json at repo root; add a small TS helper for agents/CI to resolve and run commands accurately.

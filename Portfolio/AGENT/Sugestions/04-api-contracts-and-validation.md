# API Contracts and Runtime Validation

Definition

- Define backend API with OpenAPI (YAML/JSON) and/or Zod schemas.
- Generate shared types, client bindings, and contract tests.

Why this helps optimization

- Agents get a single source of truth for request/response shapes.
- Prevents drift between backend and frontend; safer automated refactors.
- Enables schema-aware mocking and test generation.

Example: before vs after

- Before
  - Agent infers Project shape by scanning code and JSON seed files.
- After
  - Agent reads openapi.yaml or zod schemas, autogenerates DTOs, and validates responses at runtime.

Sample

- Backend uses zod:
  - ProjectSchema = z.object({ id: z.string(), title: z.string(), ... })
  - Validate responses and fail-fast in tests.

Implementation notes

- Place openapi.yaml at repo root or backend/. Generate types to shared-types/ via script.
- Add CI step: validate schemas + contract tests.

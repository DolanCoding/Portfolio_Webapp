# Search Seeds

Last Updated: 2025-08-10

## Canonical Terms & Synonyms

- portfolio, projects, certificates
- backend, server, API, express
- frontend, react, vite, router
- shared types, DTO, contract, schema
- entrypoint, bootstrap
- env, configuration, DB_PATH, VITE_API_BASE_URL

## Code Anchors & Patterns

- // ⛳ AGENT-ENTRYPOINT
- // 🔒 INVARIANTS
- // 🧪 CONTRACT
- // 📎 CONTEXT
- // TODO(ai):
- export interface Project | Certificate
- app.get("/api/projects") | app.get("/api/certificates")
- React.lazy(() => import("./pages/\*"))

## File/Path Seeds

- my-portfolio-backend/server.ts
- my-portfolio-backend/db/\*\*
- my-portfolio-frontend/src/config.ts
- my-portfolio-frontend/src/pages/\*\*
- my-portfolio-frontend/src/api/apiClient.ts
- shared-types/index.ts
- .github/workflows/\*\*

## Useful ripgrep snippets

- rg "TODO\(ai\)" -n
- rg "AGENT-ENTRYPOINT|INVARIANTS|CONTRACT|CONTEXT" -n
- rg "GET \/api\/(projects|certificates)" -n my-portfolio-backend
- rg "VITE_API_BASE_URL|getImageUrl" -n my-portfolio-frontend

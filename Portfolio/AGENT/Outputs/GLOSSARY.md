# Glossary

Last Updated: 2025-08-10

| Term              | Definition                                                | Notes/Links |
| ----------------- | --------------------------------------------------------- | ---------------------------------------------- |
| Entrypoint        | Primary file that boots an app/service.                   | Backend: my-portfolio-backend/server.ts; Frontend: my-portfolio-frontend/src/main.tsx |
| Contract Test     | Test that fixes expectations for public interfaces.       | Applied to API responses for Project and Certificate |
| Project (DTO)     | Portfolio project data shape delivered by API.            | shared-types/index.ts |
| Certificate (DTO) | Certificate data shape delivered by API.                  | shared-types/index.ts |
| VITE_API_BASE_URL | Frontend base URL for API calls.                          | my-portfolio-frontend/src/config.ts |
| PORT              | Backend server port environment variable.                 | Defaults to 3001 |
| DB_PATH           | Filesystem path to SQLite database.                       | Defaults to my-portfolio-backend/db/portfolio.db |
| Anchors           | Code comments to guide agents (⛳, 🔒, 🧪, 📎, TODO(ai)). | See SystemInstructions.md |
| Render.com        | Target platform for backend deployment.                   | Provide service that runs Node/Express |
| SQLite            | File-based relational database used by backend.           | my-portfolio-backend/db/portfolio.db |
| Workspace Manifest | JSON file mapping packages, services, and env vars.       | AGENT/workspace.json |
| Repo Index        | JSON listing of key files, purposes, and anchors.         | repo_index.json |

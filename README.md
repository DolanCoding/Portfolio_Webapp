
# Portfolio AI Driven

This repository contains the backend and frontend for an AI-optimized portfolio project.

- `my-portfolio-backend` – Express/TypeScript API.
- `my-portfolio-frontend` – React/Vite front-end.

For workspace conventions, see [AGENTS.md](AGENTS.md).

## Environment Setup

The frontend is configured through [Vite](https://vitejs.dev/) environment variables.

1. Copy `my-portfolio-frontend/.env.example` to `my-portfolio-frontend/.env`.
2. Set `VITE_API_BASE_URL` to the base URL of the backend API.

```
VITE_API_BASE_URL=http://localhost:3001
```

3. Run the frontend build to verify the configuration:

```
npm --prefix my-portfolio-frontend run build
```

This variable is consumed in `my-portfolio-frontend/src/config.ts` to avoid hard-coded API URLs.

This repository contains a front-end and an Express-based backend for showcasing portfolio data.

### Backend configuration

The backend reads its SQLite database from the path specified in the `DB_PATH` environment variable. If `DB_PATH` is not set, the server defaults to `my-portfolio-backend/db/portfolio.db`.

You can override the default by setting `DB_PATH` (for example in a `.env` file) before starting the server:

```
DB_PATH=/absolute/path/to/portfolio.db npm run dev
```


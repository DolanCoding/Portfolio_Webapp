# Portfolio AI Driven

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

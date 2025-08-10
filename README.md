## Portfolio AI Driven

This repository contains a front-end and an Express-based backend for showcasing portfolio data.

### Backend configuration

The backend reads its SQLite database from the path specified in the `DB_PATH` environment variable. If `DB_PATH` is not set, the server defaults to `my-portfolio-backend/db/portfolio.db`.

You can override the default by setting `DB_PATH` (for example in a `.env` file) before starting the server:

```
DB_PATH=/absolute/path/to/portfolio.db npm run dev
```


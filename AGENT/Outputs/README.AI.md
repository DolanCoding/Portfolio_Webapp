# README.AI — Runbook for Single Agents

Last Updated: 2025-08-10

Purpose

- Orientation, quickstart, and ops notes so a single agent can work safely and fast.

Quickstart

- Prereqs: Node 22.x, npm 10+
- Install:
  - npm --prefix my-portfolio-backend ci
  - npm --prefix my-portfolio-frontend ci
- Dev:
  - Backend: npm --prefix my-portfolio-backend run dev
  - Frontend: npm --prefix my-portfolio-frontend run dev
- URLs:
  - API default: http://localhost:3001
  - Frontend default: http://localhost:5173

Environment

- Backend
  - PORT: default 3001 // 🔒 INVARIANTS
  - DB_PATH: defaults to my-portfolio-backend/db/portfolio.db
- Frontend
  - VITE_API_BASE_URL: must point to backend base URL // 🔒 INVARIANTS

Contracts

- GET /api/projects -> Project[] (shared-types)
- GET /api/certificates -> Certificate[] (shared-types) // 🧪 CONTRACT

Tasks (Phase 1 targets)

- Typecheck: tsc -b (per package) // planned
- Lint/Format: eslint . && prettier -c . // planned
- Test Frontend: Vitest + RTL // planned
- Test Backend: Jest + supertest // planned

CI Overview (target)

- Separate jobs for frontend and backend on Node 22.x
- Steps: install -> typecheck -> lint -> test -> build
- Fast-fail on typecheck/test; cache npm

Render.com Deployment (backend)

- Service: Web Service (Node)
- Build: npm ci && npm run build (dir: my-portfolio-backend)
- Start: npm run start (dir: my-portfolio-backend)
- Env: PORT, DB_PATH (absolute path or repo-relative)

Static Hosting (frontend)

- Option A: GitHub Pages (current homepage set)
- Option B: Render Static Site
  - Build Command: npm ci && npm run build (dir: my-portfolio-frontend)
  - Publish Directory: my-portfolio-frontend/dist

Agent Anchors

- ⛳ AGENT-ENTRYPOINT: my-portfolio-backend/server.ts, my-portfolio-frontend/src/main.tsx
- 🔒 INVARIANTS: ENV handling (PORT, DB_PATH, VITE_API_BASE_URL)
- 🧪 CONTRACT: shared-types DTOs; API response shapes
- 📎 CONTEXT: place file-level operational notes here
- TODO(ai): [type=doc|test|refactor|perf|fix] [impact=low|med|high] [rationale=...] [plan=...]

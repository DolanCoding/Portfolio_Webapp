# Agent Guidelines

This repository uses machine-readable metadata in the `AGENT/` directory to help both humans and AI agents work efficiently.

## AGENT Directory
Each JSON file in `AGENT/` serves a distinct purpose:

- **AGENT_TODO.json** – Machine-executable task list for tracking workspace improvements.
- **AI_AGENT_BEHAVIOR_OPTIMIZATION.json** – Behavioral rules for AI agents so they navigate and modify the codebase effectively.
- **AI_AGENT_WORKFLOW.json** – Prescribed step-by-step workflow that agents should follow when making changes.
- **AI_NAMING_CONVENTIONS.json** – Canonical naming patterns for files, directories, variables, and AI tags.
- **AI_WORKSPACE_ARCHITECTURE.json** – Description of the overall repository structure and design principles.
- **COMPONENT_PATTERNS.json** – Catalogue of common component patterns with template structures.
- **DEPENDENCY_CACHE.json** – Pre-computed dependency map for rapid import resolution.

## Naming Conventions
- Components and pages use `PascalCase.tsx` in predictable `src/components/{Name}/{Name}.tsx` and `src/pages/{Name}/{Name}.tsx` paths.
- Utilities, types, and API files use `camelCase.ts` and live under `src/utils/`, `src/types/`, and `src/api/` respectively.
- Props interfaces follow `{ComponentName}Props`; functions are `camelCase`; constants use `SCREAMING_SNAKE_CASE`; CSS classes are `kebab-case` with component prefixes.
- Every file begins with an `AI-AGENT CONTEXT` line and uses `AI-LOGICAL-REGION` and `AI-DEPENDENCY` tags for structure and dependency tracking.

## Workflow Expectations
- Read context and dependency tags before editing.
- Validate the workspace with TypeScript compilation and analysis tools prior to committing.
- Organize new code into logical regions and maintain existing patterns and naming rules.
- After changes, rerun TypeScript checks and ensure AI tags remain consistent.

## Standard Commands
### Backend (`my-portfolio-backend`)
- **Build:** `npm run build`
- **Test:** _none defined_
- **Lint:** _none defined_

### Frontend (`my-portfolio-frontend`)
- **Build:** `npm run build`
- **Test:** _none defined_
- **Lint:** _none defined_


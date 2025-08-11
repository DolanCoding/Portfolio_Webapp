# Suggestion Review Tasks

## Implemented
- [x] Workspace manifest (`AGENT/workspace.json`)
- [x] Repository index (`repo_index.json`)

## Pending
- [ ] Commands catalog for common scripts
- [ ] Environment variables contract and typed accessors
- [ ] Structured logging for backend/frontend
- [ ] Refactor playbooks for recurring changes
- [ ] Automated CODEMAP and GLOSSARY updater

## Deemed Unnecessary or Already Covered
- API contracts and validation (covered by shared types for now)
- CI pipeline standardization (current workflow handles front and back)
- Health and readiness probes (deferred until deployment context requires)
- Agent sandbox and safety rails (Git workflow already requires PRs)
- Agent metadata standard (front matter already present in key files)

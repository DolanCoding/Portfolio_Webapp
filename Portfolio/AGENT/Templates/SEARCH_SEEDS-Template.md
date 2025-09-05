# Search Seeds

_Last Updated:_ YYYY-MM-DD

## Canonical Terms & Synonyms

- agent, optimizer, implementer
- entrypoint, bootstrap, main
- invariant, precondition, postcondition

## Code Anchors & Patterns

- `// ⛳ AGENT-ENTRYPOINT`
- `// 🔒 INVARIANTS`
- `// 🧪 CONTRACT`
- `// TODO(ai):`
- `export interface` | `type` (TS)
- `def` (Python) with docstrings including "contract"

## File/Path Seeds

- `src/domain/`, `src/application/`, `src/adapters/`, `src/packages/`
- `.github/workflows/`, `infra/`, `tools/`, `tests/`

## Useful Grep/Ripgrep Snippets

- `rg "TODO\\(ai\\)" -n`
- `rg "AGENT-ENTRYPOINT|INVARIANTS|CONTRACT" -n`
- `rg "(FIXME|TODO|HACK)" -n`
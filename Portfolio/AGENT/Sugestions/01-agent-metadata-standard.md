# Standardize AI-Agent Metadata as YAML Front Matter

# Agent Metadata Standard

Definition

- Replace/augment current AI-AGENT CONTEXT banner comments with a small YAML front matter block at the top of key files.
- Add minimal front matter blocks (YAML) to key files and folders with purpose, owner, stability, and dependencies.

Why this helps optimization

- Front matter is trivial for agents to parse uniformly (one location, one format), avoiding brittle text scraping of varied comments.
- Enables building automated maps of capabilities and cross-file relationships to guide refactors and impact analysis.
- Improves semantic search precision by giving structured signals.
- Agents quickly understand file intent and risk level, choose safe edit strategies, and find related modules.
- Reduces exploratory search and incorrect edits.

Example: before vs after

- Before
  - Agent scans the whole file to find scattered comments like "AI-AGENT CONTEXT" and infer roles/dependencies heuristically.
  - Agent scans src/ and guesses which file renders the Home page.
- After
  - Agent reads the first block, builds a dependency map fast, and only dives into code if needed.
  - Home component has front matter: role: page, route: "/", dependencies: [Header, Footer]. Agent jumps directly.

## Sample header

role: Certificate_Display_Component
purpose: Professional_Certifications_Gallery
entry_points: [default export]
dependencies:

- ../../api/apiClient
- ../../utils/aiValidationHelpers
  related_files:
- ../../../../shared-types
- ../../config
  side_effects: [network, console]
  tags: [react, page, fetch]

---

## Sample front matter

role: component
purpose: Renders the site header with navigation
owner: web
stability: stable
exports:

- Header

---

Implementation notes

- Adopt in: src/pages/_, backend server.ts and db/_.ts, shared-types.
- Keep existing human-readable comments; the front matter is the machine-readable source of truth.
- Keep blocks tiny; place on entry files (pages, services, db init, server).

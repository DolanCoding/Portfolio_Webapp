# Agent Sandbox and Safety Rails

Definition

- Add a protected branch policy and a sandbox folder where agents can stage changes behind feature flags.
- Use CODEOWNERS and PR templates to require review and automated checks.

Why this helps optimization

- Encourages rapid experimentation without risking stable code.
- Clear review gates allow agents to iterate safely and get fast feedback.

Example: before vs after

- Before
  - Agent pushes directly to main and risks breaking prod.
- After
  - Agent opens PR from sandbox branch; CI runs, reviewers check, and flags control rollout.

Implementation notes

- Pair with refactor playbooks and CI signals for end-to-end safe automation.

---
mode: full-continuous
allowed-actions:
  - merge-pr
  - deploy-staging
  - add-dependency
  - handle-secrets
task-sources:
  - github-issues-label: agent-ready
  - github-projects
  - todo-file: TODO.md
  - inline-comments: TODO(agent):
trigger: any
owner: Admin
---

# Autonomy Configuration

Full continuous operation is enabled for this repository. The agent may:
- Merge its own PRs after internal review passes.
- Deploy to staging if configured.
- Add dependencies after verification.
- Handle repository-local secrets/credentials files as required.

Absolute guardrails remain in effect:
- No deletion of the repository or working directory.
- No exposure of secrets outside the repository.
- No financial-loss or irreversible data-loss commands.
- No destructive operations on protected branches without recovery capability.

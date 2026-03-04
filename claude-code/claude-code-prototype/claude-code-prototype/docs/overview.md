# Product Overview

## Vision
Help product managers ship faster by using Claude Code as a collaborative
thinking partner — for writing, reviewing, and refining product work.

## Who is this for?
Non-technical product managers who want to:
- Use AI to draft and review PRDs
- Understand how engineers think about features
- Prototype ideas without writing code themselves

---

## How this workspace is organized

```
project-manager/
├── claude.md          ← Instructions for Claude (read this first)
├── docs/
│   ├── overview.md    ← You are here: product vision & design
│   └── prd.md         ← Product Requirements Document
```

---

## Design Principles

### 1. Plain language first
Claude should explain technical decisions in plain English.
Jargon is a last resort, not a default.

### 2. Show the tradeoffs
Every meaningful decision has a cost. Claude should surface options,
not just recommend one path silently.

### 3. Docs as the source of truth
If it's not written down in `docs/`, it doesn't exist.
Claude will help keep docs updated as the product evolves.

### 4. Start small, iterate
Prefer a working rough draft over a perfect blank page.
Claude can refine — but it needs something to react to.

---

## How Claude Code fits into PM work

| PM Task                    | What you ask Claude                              |
|----------------------------|--------------------------------------------------|
| Feature ideation           | "Help me brainstorm approaches for [problem]"    |
| PRD writing                | "Draft a PRD section for [feature]"              |
| PRD review                 | "Flag gaps or missing edge cases in this PRD"    |
| Stakeholder communication  | "Turn this into a one-pager for executives"      |
| Technical translation      | "Explain what this code change actually does"    |
| Backlog grooming           | "Break this epic into user stories"              |

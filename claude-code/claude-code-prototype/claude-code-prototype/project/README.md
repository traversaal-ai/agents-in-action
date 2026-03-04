# Build This: PRD Builder — Powered by Claude

A single-file web app that takes your product idea and generates a complete,
structured PRD in seconds. Built with the Claude API and streaming.

Open `project/index.html` in your browser — no install, no server required.

---

## What it does

1. You fill in a short form: product name, problem, users, features
2. Claude streams back a full PRD — live, word by word
3. You get a formatted doc with all standard PM sections
4. Download as `.md` or copy to paste into Notion, Confluence, or email

---

## Before you start

You need an **Anthropic API key**.

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Paste it into the **API Key** field at the top right of the app

Your key is saved in your browser — you won't need to enter it again.

---

## How to use it

1. Open `project/index.html` in your browser (double-click the file)
2. Paste your API key in the top right
3. Fill in the form on the left:
   - **Product Name** — what are you building?
   - **Problem Statement** — what pain does it solve, and for whom?
   - **Target Users** — who specifically has this problem?
   - **Key Features** — one per line, what does the product do?
   - **Success Metrics** *(optional)* — how will you know it worked?
   - **What it is NOT** *(optional)* — explicit non-goals
   - **Style** — choose professional, concise, or detailed
4. Click **Generate PRD**
5. Watch Claude write your PRD in real time

---

## What Claude generates

| Section | What it contains |
|---------|-----------------|
| Overview | One-paragraph executive summary |
| Problem Statement | Pain point, affected users, urgency |
| Goals | 3–5 measurable outcomes |
| Non-Goals | What you're explicitly not building |
| Target Users | Persona descriptions |
| User Stories | Must Have (v1) + Nice to Have (v1.1+) |
| Key Flows | Step-by-step user journeys |
| Edge Cases | Table of open questions with owners |
| Success Metrics | Post-launch measurement plan |
| Out of Scope | v1 exclusions |
| Backlog | Future ideas to revisit |

---

## What this exercise teaches you

| Concept | Where you see it |
|---------|-----------------|
| API key authentication | Top-right key input |
| Prompt engineering | The hidden system prompt Claude uses |
| Streaming responses | Text appears word-by-word in real time |
| Structured output | Claude follows a format from your instructions |
| Model selection | App uses `claude-opus-4-6` — the most capable model |

---

## Want to go deeper?

Ask Claude Code to modify the app:

- `"Add a field for competitor analysis and include it in the PRD"`
- `"Add a button that regenerates just the User Stories section"`
- `"Make the PRD output exportable as a PDF"`
- `"Add a second panel showing the raw Markdown alongside the preview"`
- `"Let me choose which PRD sections to include before generating"`

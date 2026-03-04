# Claude Code for Product Managers
### Part of [Agentic AI System Design for PMs](https://maven.com/boring-bot/ml-system-design) — taught by Hamza Farooq

---

## What this is

A hands-on workspace for learning Claude Code — Anthropic's AI coding tool — without writing a single line of code yourself.

By the end of this session you will have:
- Used Claude to read, review, and improve a real PRD
- Seen Claude edit files directly inside your project
- Built and extended a live AI-powered web app using nothing but conversation

---

## Who this is for

Product managers, business leaders, and anyone who wants to work *alongside* engineers more effectively — and understand how AI fits into the product development workflow.

No coding experience required.

---

## What's in this folder

```
claude-code-prototype/
├── README.md            ← You are here
├── START_HERE.md        ← Start here for the step-by-step class walkthrough
├── claude.md            ← Instructions Claude reads automatically for this project
├── docs/
│   ├── overview.md      ← Product vision and design principles
│   └── prd.md           ← Sample PRD (NoteToTicket — AI meeting notes to Jira)
└── project/
    ├── README.md        ← How to use the PRD Builder app
    └── index.html       ← PRD Builder — open in your browser, no install needed
```

---

## How to get started

**1. Install Claude Code**
```
npm install -g @anthropic/claude-code
```

**2. Open this folder in your terminal**
```
cd path/to/project-manager
claude
```

**3. Follow the walkthrough**

Open `START_HERE.md` — it walks you through 7 steps, from reading your first PRD to building a working AI app.

---

## The PRD Builder app

`project/index.html` is a single-file web app that calls the Claude API directly from your browser.

- Fill in a product idea → Claude streams back a full, structured PRD
- Click **▶ Start Building** → Claude writes an engineering brief and creates a project folder on your computer with both files inside
- Copy the prompt → drop it into Claude Code to start building

Open it by double-clicking `project/index.html`. No server, no install.

You'll need a free Anthropic API key from [console.anthropic.com](https://console.anthropic.com).

---

## How Claude Code is different from ChatGPT

| ChatGPT | Claude Code |
|---|---|
| Works on text you paste in | Works directly inside your files |
| No memory of your project | Reads your whole project as context |
| You copy-paste results manually | Edits files for you in real time |
| Starts fresh every chat | `claude.md` gives it standing instructions |
| General purpose | Configured for how your team works |

---

## About the course

This workspace is part of **Agentic AI System Design for PMs** on Maven — a 7-week hands-on program for product managers and business leaders who want to build and deploy real AI agents.

**Instructor:** Hamza Farooq — Ex-Google, UCLA & UMN Professor, Founder

Topics covered in the full program:
- Identifying high-value AI use cases with real ROI
- Designing and deploying production-ready AI agents (no coding required)
- Building no-code and low-code agent workflows
- Enterprise RAG systems and safety controls
- Stakeholder communication and implementation roadmaps

[View the full course →](https://maven.com/boring-bot/ml-system-design)

---

## Need help?

Ask Claude directly:
```
claude
```
Then type: *"I'm new to Claude Code. What else can you help me with as a product manager?"*

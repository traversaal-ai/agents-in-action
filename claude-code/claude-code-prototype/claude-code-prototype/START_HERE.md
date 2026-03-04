# Start Here — Claude Code for Product Managers

Welcome! This guide walks you through your first Claude Code session.
No coding experience required. Just follow the steps in order.

---

## Before You Begin

Make sure you have:
- [ ] Claude Code installed (`npm install -g @anthropic/claude-code`)
- [ ] This folder open in your terminal
- [ ] An Anthropic API key set up (your instructor will help with this)

To start Claude Code, open your terminal in this folder and run:
```
claude
```

That's it. You're now talking to Claude inside your project.

---

## Step 1 — Get oriented (2 min)

Ask Claude:
> "What files are in this project and what is each one for?"

Claude will read the project and explain it to you in plain English.
Notice it automatically understands `claude.md` and uses it as context.

**What to look for:** Claude should mention `claude.md`, `docs/overview.md`,
and `docs/prd.md` and explain what each one does.

---

## Step 2 — Read the PRD together (3 min)

Ask Claude:
> "Summarize the PRD for me like I'm explaining it to an engineer for the first time."

Then follow up with:
> "What are the three riskiest assumptions in this PRD?"

**What to look for:** Claude should give you a crisp summary, then push back
thoughtfully on assumptions — just like a good colleague would.

---

## Step 3 — Review and improve the PRD (5 min)

Ask Claude:
> "Review the PRD and tell me what's missing or unclear."

Then pick one gap it surfaces and ask:
> "Write a first draft for that section."

Accept it, edit it, or ask Claude to try again with more specific instructions.

**What to look for:** Claude edits the actual file — you can see the change
happen in real time. This is the core loop: ask, review, refine.

---

## Step 4 — Add your own feature idea (5 min)

Think of a feature you've been wanting to build at your company
(keep it simple — one sentence is enough).

Ask Claude:
> "Add a new user story to the PRD for this idea: [your idea in one sentence]"

Then ask:
> "What edge cases should I think about for this feature?"

**What to look for:** Claude adds the user story directly to `docs/prd.md`
and surfaces edge cases you probably hadn't considered yet.

---

## Step 5 — Turn the PRD into a one-pager (3 min)

Ask Claude:
> "Write a one-paragraph executive summary of this PRD I can paste into a Slack message."

Then try:
> "Now rewrite it as three bullet points for a CEO who has 10 seconds."

**What to look for:** Claude adjusts tone and length on demand.
This is one of the highest-value things PMs can use Claude for every day.

---

## Step 6 — Make it your own (open-ended)

You now know the core loop. Here are more things to try:

- `"Break the must-have user stories into a two-week sprint plan"`
- `"Write acceptance criteria for the export to Jira flow"`
- `"What questions would an engineer ask me about this PRD in sprint planning?"`
- `"Rewrite the problem statement to be more customer-centric"`
- `"Create a new PRD from scratch for [your product idea]"`

---

## Step 7 — Use the PRD Builder (15 min)

Now you'll use a real AI-powered app — built with the Claude API.

1. Open `project/index.html` in your browser (double-click the file)
2. Paste your Anthropic API key in the top-right field
3. Fill in the form with a product idea — use your own, or make one up
4. Click **Generate PRD** and watch Claude write it live, word by word
5. Click **▶ Start Building** — Claude turns the PRD into a sprint-ready engineering handoff
6. Edit the pre-filled prompt or send it as-is, then download the result

**What to look for:** Claude carries the full PRD as context into the next
step — you don't re-explain anything. The output lands directly on your screen,
ready to paste into Jira or hand to an engineer.

Then try asking Claude Code to extend the app:
> "Add a field for competitor context and include it in the generated PRD"

See `project/README.md` for a full walkthrough and tips.

> This is the moment where it clicks. The browser app generates the PRD,
> you save it into the project, and Claude Code picks up right where the
> app left off — all in the same folder.

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

## Quick Reference — Useful prompts for PMs

| What you want | What to ask |
|---|---|
| Summarize a file | "Summarize docs/prd.md in plain English" |
| Review for gaps | "What's missing from this PRD?" |
| Write a section | "Draft the acceptance criteria for Flow 1" |
| Simplify for execs | "Rewrite this as a 3-bullet Slack message" |
| Generate user stories | "Turn this idea into 3 user stories: [idea]" |
| Spot risks | "What are the top 3 risks in this plan?" |
| Prep for eng handoff | "What questions will engineers ask about this?" |

---

## Files in this project

```
claude-code-prototype/
├── START_HERE.md        ← You are here
├── README.md            ← Project overview and setup instructions
├── claude.md            ← Claude's instructions for this project
├── docs/
│   ├── overview.md      ← Product vision and design principles
│   └── prd.md           ← Product Requirements Document (sample feature)
└── project/
    ├── README.md        ← Walkthrough and tips for the PRD Builder
    └── index.html       ← PRD Builder app (open in browser, no install needed)
```

---

## Need help?

Ask Claude directly:
> "I'm new to Claude Code. What else can you help me with as a product manager?"

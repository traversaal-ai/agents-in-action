# ✍️ LinkedIn Post Human-in-the-Loop Agent
## 🔀 Workflow: [LinkedIn Post](https://github.com/traversaal-ai/agents-in-action/tree/main/linkedpost-human-in-the-loop)
This blog contains workflows and configurations for **semi-automated LinkedIn post generation and publishing** using n8n and AI.

---

## ✨ Overview
The LinkedIn Post Human-in-the-Loop Agent automates the creation of high-quality, technically-focused LinkedIn posts. Unlike fully automated agents, this workflow introduces a human approval and editing loop to ensure that the tone, accuracy, and style match your brand and professional standards.

It continuously gathers articles from AI news feeds, selects the most relevant deep technical content, drafts LinkedIn posts targeted at AI practitioners and developers, and then requests manual review/approval before posting.

---

## 🚀 Key Features
- 📰 Automated ingestion of AI-related articles via RSS
- 🧠 AI-powered article selection focusing on **advanced AI, GenAI, and LLM research**
- ✍️ Post generation optimized for a **technical LinkedIn audience**
- 🎨 Style-matching with your **preferred writing style**
- 📨 Human-in-the-loop workflow with **approval via email**
- 🔄 Edit cycle where change requests are applied automatically
- 📤 Seamless LinkedIn publishing after approval

---

## 🧩 Workflow Structure
The workflow is composed of several connected steps:
1. **Article Gathering**
Fetches the latest articles from a chosen RSS feed.
2. **Article Selection**
AI filters for highly technical, practitioner-focused content (avoiding hype/introductory pieces).
3. **Content Extraction**
Downloads and parses article details for deeper insights.
4. **Post Drafting**
Generates a structured LinkedIn draft optimized for AI developers.
5. **Style Matching**
Rewrites the draft to align with your personal writing style.
6. **Approval Process**
- Sends the draft to your email for approval or revision requests.
- If approved → posts directly to LinkedIn.
- If rejected → applies requested changes and resends for approval.

---

## ⚙️ Setup
1. 📥 Import `linkedin-post-v2.json` into your **n8n instance**.
2. 🔑 Configure required credentials:
- OpenAI (for content generation)
- Gmail (for approval workflow)
- LinkedIn (for publishing)
3. 🛠️ Customize the RSS feed sources to match your preferred AI news outlets.
4. 🎨 Adjust the "Writing style" node with an example LinkedIn post in your tone.
5. ✏️ Modify the prompts to suit your **voice and technical depth**.

---

## 🚦 Usage
1. ▶️ Trigger the workflow manually or set up a schedule.
2. 🔄 Workflow will:
- Fetch new AI articles
- Pick one technical piece
- Generate a LinkedIn post draft
- Rewrite in your personal style
- Send for approval via email
3. ✅ Approve → Auto-published on LinkedIn
❌ Request changes → AI applies edits, resends for approval

---

## 📁 Files
- `linkedin-post-v2.json` — Main workflow for LinkedIn post creation, approval, and publishing

---

Don’t forget to check out my **Agentic AI System Design for PMs** course on Maven if you are interested to be a part of something bigger.

[![AI Bootcamp](images/ai-bootcamp.png)](https://maven.com/boring-bot/ml-system-design?promoCode=201OFF)

---

## [➡️ Next](https://traversaal-ai.github.io/agents-in-action/the-ultimate-ai-blog-post-agent/)

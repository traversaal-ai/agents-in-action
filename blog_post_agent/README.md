<img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzB5cjY4YTY4MGs2ZDQxNWdsM3RxMjVwYm42bHpscnVwbnN4NjVqeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VzHq1HMblXXQRIRNJf/giphy.gif" alt="AI Blog Writing" style="width:100%;height:600px;object-fit:cover;border-radius:12px;" />

# ✍️ Blog Post Agent

This folder contains workflows and configurations for automated blog post generation using n8n and AI.

---

## ✨ Overview
The Blog Post Agent automates the process of generating high-quality blog posts. It leverages 🤖 AI to create content based on your prompts and can be extended with additional research and enrichment steps.

### 🚀 Key Features
- 📝 Automated blog post generation using AI
- 🗂️ Configurable prompts and topics
- 🔗 Can be integrated with other tools (Google Sheets, Notion, etc.)

---

## 🏛️ Architecture
The architecture of **Blog Post Agent** consists of a main *orchestrator* and two *sub-workflows* within the main workflow.

### Blog Post Generator - The Main Orchestrator
![Blog Post Generator](images/blog-post-generator.png)

### Scraper
![Scrape Link](images/scrape-link.png)

### Deep Researcher
![Deep Researcher](images/deep-researcher.png)

---

## 🧩 Sub-Workflow Requirement
**To enable deep research and richer content, you should also add the `scrape link` and `deep research` workflows as sub-workflows.**
- 🛠️ The `scrape_link.json` file extracts and summarizes the content from a link. 
- 🧠 The `blog_deep_research.json` file provides a research pipeline that can be called from the main blog post generator workflow.
- 📚 This allows the agent to gather and synthesize information before drafting the post.

---

## ⚙️ Setup
1. 📥 Import `blog_post_generator.json` into your n8n instance as the main workflow.
2. 🧠 Import `blog_deep_research.json` as a sub-workflow.
3. 🛠️ Import `scrape_link.json` as a sub-workflow.
4. 🔑 Configure any required credentials (OpenAI, Google, etc.) in n8n.
5. 🛠️ Adjust prompts and workflow logic as needed for your use case.

---

## 🚦 Usage
- ▶️ Trigger the main workflow with your desired topic or prompt.
- 🔄 The workflow will call the scrape link and deep research sub-workflows, then generate a blog post draft.
- 📤 Output can be sent to your preferred platform (Google Docs, Notion, etc.).

---

## 📁 Files
- `blog_post_generator.json` — Main workflow for blog post generation
- `scrape_link.json` — Sub-workflow for content extraction
- `blog_deep_research.json` — Sub-workflow for deep research

## 🎓 Ready to Level-Up?
Join our courses on Maven and never stop learning:
- 🤖 [Agentic AI System Design for PMs — _For Leaders, Managers & Career Builders_](https://maven.com/boring-bot/ml-system-design?promoCode=201OFF)
- 💻 [Agent Engineering Bootcamp: Developers Edition — _For Developers, Engineers & Researchers_](https://maven.com/boring-bot/advanced-llm?promoCode=200OFF)

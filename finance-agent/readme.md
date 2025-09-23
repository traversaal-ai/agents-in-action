# 🤖 AI Financial Analyst — No-Code n8n Workflow

## Overview

This n8n workflow turns your automation platform into a **real-time AI-powered financial analyst** — capable of prospecting, researching, and delivering professional investment insights without writing a single line of code.

It combines:

* **Webhook input** for external triggers
* **OpenAI GPT-4o Mini** for financial reasoning
* **Memory system** for context persistence
* **Live internet research** using Traversaal ARES API
* **Professional analysis framework** for clean, actionable outputs

---

## ✨ What It Can Do

* **Answer Financial Questions**: Stocks, ETFs, sectors, commodities, and macroeconomic trends
* **Perform Real-Time Research**: Pulls latest market data, news, and reports
* **Maintain Conversation Context**: Remembers who’s asking and previous messages
* **Deliver Professional Insights**: Executive summaries, risk assessments, and recommendations

---

## 📋 Workflow Components

### 1. **Webhook Input**

* Accepts `username` and `query`
* Trigger via a `POST` request from chatbots, CRMs, or web apps

### 2. **AI Agent**

* Acts as an expert financial analyst
* Breaks down queries into focused research steps
* Uses live data + financial reasoning to produce high-quality analysis

### 3. **Language Model**

* **Model:** `gpt-4o-mini` (fast, affordable, and capable)
* Handles complex reasoning and finance-specific terminology

### 4. **Memory System**

* Keeps track of user sessions and context
* Uses `username` as session key

### 5. **Real-Time Research Tool**

* Integrates Traversaal ARES API
* Searches authoritative sources like Bloomberg, Reuters, SEC filings

### 6. **Response Output**

* Returns markdown-formatted professional insights
* Includes data points, ratios, risk factors, and recommendations

---

## 🚀 Setup Instructions

1. **Install n8n**

   * [n8n Installation Docs](https://docs.n8n.io/)

2. **Import Workflow**

   * Open n8n
   * Click **Import from File**
   * Select the provided `.json` file

3. **Add Credentials**

   * **OpenAI API Key** for GPT-4o Mini
   * **ARES API Key** from [Traversaal](https://api.traversaal.ai)

4. **Deploy Webhook**

   * Copy the webhook URL from the **Webhook** node
   * Integrate it with your chatbot, CRM, or custom frontend

---

## 🔍 Example Usage

**POST Request:**

```bash
curl -X POST "https://<your-n8n-domain>/webhook/d82c3854-146b-4212-b94e-5b0ca8d7075b" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "query": "What is the 2025 outlook for Tesla stock?"
  }'
```

**Response:**

```markdown
## Executive Summary
Tesla shows strong Q4 2024 performance with record deliveries...

## Current Market Position
Price: $XXX as of Jan 2025...

## Risk Assessment
Upside from energy division growth; downside from interest rate environment...

## Actionable Insights
Consider holding with a 12-month target of $YYY...
```

---

## 🎓 Learn More
Want to build and customize more AI agents like this?\
🤖 [AI Bootcamp: Generative AI Beyond the Hype](https://maven.com/boring-bot/ml-system-design)\
💻 [Agent Engineering Bootcamp: Developers Edition](https://maven.com/boring-bot/advanced-llm)\
📂 [GitHub: Agents in Action](https://github.com/traversaal-ai/agents-in-action)

# 🤖 AI Assistant Webhook back and forth + Ares Internet Search

A fully integrated **n8n** chatbot that accepts user queries via **webhook**, uses **OpenAI GPT-4o-mini** for reasoning, optionally fetches real-time data via **Traversaal Ares Internet Search API**, and maintains memory using a **custom session-based buffer**.

You can use this to converse with Lovable frontend back and forth

---

## 🚀 Entry Point – Webhook

This workflow starts with a **Webhook Trigger** node.

* **Path:** `/webhook/ce08af64-8da6-4297-9eef-5efe7a9b972e`
* **Method:** POST
* **Response Mode:** Waits for output from downstream node

### 📨 Expected Input

```json
{
  "query": "What is Retrieval-Augmented Generation?",
  "username": "user_123"
}
```

---

## 🧠 Core Logic – AI Agent Orchestration

The agent receives the input and decides what tools to use.

### Responsibilities:

* Processes incoming `query` and `username`
* Routes the query through:

  * OpenAI GPT-4o-mini for generation
  * Internet Search via Ares API if needed
  * Memory buffer for context
* Returns the answer as **plain text**

---

## 🛠️ Components

### 🧠 Language Model

* **Model:** `gpt-4o-mini`
* **Provider:** OpenAI (via n8n credentials)
* **Used by:** AI Agent for reasoning and response generation

### 🌐 Internet Search Tool

* **Tool:** HTTP Request to [Ares API](https://api-ares.traversaal.ai/live/predict)
* **Header Auth:** `x-api-key: --your-key--`
* **JSON Body:**

  ```json
  {
    "query": ["{{ $('Webhook').item.json.body.query }}"]
  }
  ```

Used when additional web context is needed.

### 💾 Conversation Memory

* **Type:** Memory buffer window
* **Session Key:** Based on `username` field
* **Benefit:** Retains conversation across multiple messages per user

---

## 🔄 Data Flow Overview

1. 🧭 Webhook receives user input
2. 🧠 AI Agent triggers with:

   * GPT-4o-mini
   * Simple Memory
   * Ares Search Tool (optional)
3. 🧾 Responds to user via webhook with AI output

---

## 📤 Output

The response is sent back to the original HTTP request using:

```json
{
  "responseBody": "{{ $json.output }}"
}
```

Plain text including context and URLs (if search used).

---

## 📎 Sample Use Case

### User Request:

```json
{
  "query": "Latest research on federated learning",
  "username": "nina_98"
}
```

### AI Agent Flow:

* Checks memory for prior context
* Detects it's a current topic → triggers Ares search
* Fetches real-time links
* Synthesizes response via GPT-4o-mini
* Responds with summarized insight + citations

---

## 🔐 Setup Instructions

### Prerequisites

* n8n instance (local or cloud)
* OpenAI API Key with GPT-4o-mini access
* Traversaal Ares API Key

### Configuration

1. Replace `--key--` in the Internet Search node with your actual Ares API Key
2. Configure OpenAI credentials in n8n settings
3. Deploy and activate webhook endpoint
4. Test using tools like Postman or CURL

---

## 🧪 Test the Endpoint

```bash
curl -X POST https://your-n8n-domain/webhook/ce08af64-8da6-4297-9eef-5efe7a9b972e \
  -H 'Content-Type: application/json' \
  -d '{"query": "What is Retrieval-Augmented Generation?", "username": "demo_user"}'
```

---

## 📚 Notes

* ✅ Add more tools via `ai_tool` connections
* ✅ Memory is user-specific and context-aware
* ✅ Internet search is used **intelligently**, not by default
* 📌 Works great for customer support, research assistants, or RAG demos

---

## 🎓 Learn More
Want to build and customize more AI agents like this?\
🤖 [AI Bootcamp: Generative AI Beyond the Hype](https://maven.com/boring-bot/ml-system-design)\
💻 [Agent Engineering Bootcamp: Developers Edition](https://maven.com/boring-bot/advanced-llm)\
📂 [GitHub: Agents in Action](https://github.com/traversaal-ai/agents-in-action)

## Contribute
Open to contributions! Fork, modify, and raise issues.

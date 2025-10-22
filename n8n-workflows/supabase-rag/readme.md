# 🧠 RAG Agent with Memory — n8n Workflow

A powerful Retrieval-Augmented Generation (RAG) chatbot built using **n8n**, combining document knowledge with conversational AI and persistent memory.

---

## 🌟 Features

- 🤖 **Intelligent Chat Agent**: Powered by OpenAI GPT-4o-mini for natural conversations
- 💾 **Persistent Memory**: Remembers conversation history using PostgreSQL
- 🔍 **Document Search**: Semantic search through your knowledge base
- 📚 **Document Processing**: Automated PDF ingestion and vectorization
- 🎯 **Real-time Chat**: Webhook-based chat interface for instant responses

---

## 🏗️ Architecture

This workflow has two main pipelines:

### 1. Document Processing (Setup)
Manual Trigger → Google Drive Download → Text Splitter → Document Loader → Embeddings → Vector Store


### 2. Chat Interface (Runtime)
Chat Trigger → RAG Agent → [Memory + LLM + Vector Search] → Response


---

## 🚀 Quick Start

### ✅ Prerequisites

- An `n8n` instance (cloud or self-hosted)
- OpenAI API Key with GPT-4o-mini access
- PostgreSQL database (for memory)
- Supabase account (for vector storage)
- Google Drive API access

---

### 🔑 Required Credentials in n8n

| Service         | Purpose                          |
|-----------------|----------------------------------|
| OpenAI          | Chat model + embeddings          |
| PostgreSQL      | Stores persistent chat memory    |
| Supabase        | Hosts vector embeddings          |
| Google Drive    | Downloads source PDFs            |

---

## 📋 Setup Instructions

### Step 1: Document Processing (Run Once)
1. Upload PDF to Google Drive
2. Replace the file ID in the `Download File` node
3. Trigger the workflow manually
4. Check Supabase to confirm vector storage

### Step 2: Chat Interface (Always Running)
1. Activate the webhook trigger
2. Copy the webhook URL for your chat frontend
3. POST messages to the URL
4. Receive smart document-grounded responses

---

## 🔧 Configuration

### Document Settings
- Text Splitter: Recursive character splitter
- Embedding Model: `text-embedding-ada-002`
- Vector Store Table: `documents` (Supabase)

### Agent Settings
- System Message: `"You are a helpful assistant."`
- Model: `gpt-4o-mini`
- Tools: `aws_knowledge_base` (vector search tool)

### Memory Configuration
- Type: PostgreSQL memory
- Persistence: Across sessions
- Context: Previous messages included in prompts

---

## 🛠️ Customization

### Add New Docs
- Upload to Drive → Update file ID → Run processing

### Modify Behavior
- Edit system message
- Change model (e.g. `gpt-4`)
- Tune chunk size, retrieval count

### Extend Functionality
- Add web scraping
- Use different loaders (e.g., DOCX, CSV)
- Add API integrations or custom tools

---

## 📊 Example Use Cases

**User:** "What is AWS Lambda?"
**Agent:** Searches + answers from docs

**User:** "How do I deploy it?"
**Agent:** Uses memory + relevant info

**User:** "What about pricing?"
**Agent:** Infers Lambda pricing context

---

## 🧪 Troubleshooting

### 🛑 No Document Results?
- Ensure vectors are stored
- Validate embeddings format

### ❌ Memory Not Saving?
- Verify DB connection & tables
- Check credentials & permissions

### ⚠️ Chat Issues?
- Confirm webhook URL and request shape
- Test with Postman or simple client

---

## 📈 Optimization

### 💸 Cost
- Use GPT-4o-mini
- Optimize chunking strategy
- Cache frequent responses

### ⚡ Speed
- Tune similarity thresholds
- Run async document processing
- Use indexed vector search

---

## 🔐 Security

- Store credentials securely in n8n
- Use read-only DB access
- Add webhook authentication
- Define data retention policies

---

## 📚 Resources

- 📹 [Original Tutorial by Nate Herk](https://www.youtube.com/watch?v=nVvHy-gTg8Y)
- 📖 [n8n Docs](https://docs.n8n.io/)
- 🧠 [LangChain Node Integration](https://docs.n8n.io/integrations/langchain/)

---

## 🤝 Contributing

We welcome:
- Bug reports & PRs
- New document types
- Code improvements & tooling

---

## 🎓 Learn More
Want to build and customize more AI agents like this?\
🤖 [AI Bootcamp: Generative AI Beyond the Hype](https://maven.com/boring-bot/ml-system-design)\
💻 [Agent Engineering Bootcamp: Developers Edition](https://maven.com/boring-bot/advanced-llm)\
📂 [GitHub: Agents in Action](https://github.com/traversaal-ai/agents-in-action)

---

## 📄 License

Provided for educational & practical use. Please comply with TOS of APIs used.

---

🎓 Special thanks to [Nate Herk](https://www.linkedin.com/in/nateherk/) for the original workflow inspiration.

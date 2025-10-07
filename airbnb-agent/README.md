# 🏠 Airbnb n8n Workflow

This folder contains the **Airbnb Search Automation Workflow** for n8n.

---

## ✨ Overview
This workflow automates the process of searching Airbnb listings based on user queries submitted from the frontend app. It leverages 🤖 AI and the 🛠️ MCP Client to fetch, process, and email personalized Airbnb recommendations.

### 🚀 Key Features
- 📥 Receives search requests via webhook from the frontend
- 🤖 Uses AI (OpenAI) to interpret and enrich user queries
- 🌐 Connects to the Airbnb MCP tool for real-time listing data
- 📨 Parses and formats results for email delivery
- 💌 Sends a detailed, styled email with recommendations to the user

---

## 🔄 How It Works
1. 📝 **User submits a search** (location, dates, guests, etc.) via the frontend form.
2. 🌐 **Frontend calls the n8n webhook** (`/webhook/2586fd7a-0113-4719-8038-9b59cbcea6e0`) with the query, email, and name.
3. ⚙️ **Workflow processes the request:**
   - 🤖 AI agent interprets the query and fetches listings using the MCP Client.
   - 🗂️ Results are parsed and formatted.
   - 📧 An email is sent to the user with the best Airbnb options.

---

## 🛂 Inputs
- 🏖️ `query`: Description of the desired Airbnb stay (location, features, dates, etc.)
- 📧 `email`: User's email address (for results delivery)
- 🙋‍♂️ `name`: User's name

## 📤 Outputs
- 💌 Sends a personalized email with Airbnb listings and recommendations to the user.

---

## ⚙️ Setup
1. 🗃️ Import `airbnb_agent.json` into your n8n instance.
2. 🔑 Configure credentials for:
   - 🤖 OpenAI (for AI agent)
   - 🛠️ MCP Client (STDIO)
   - 📧 Gmail (for email delivery)
3. 🚀 Deploy the workflow and copy the webhook URL to your frontend.

---

## 🔗 Integration with Frontend
- The frontend app in `chrono-voyage-ai` is pre-configured to send requests to this workflow's webhook.
- Make sure the webhook URL matches in both places.

---

## 📚 References
- 🎥 [YouTube Setup Tutorial](https://youtu.be/C_FSNLCPx_Q)

## 🎓 Learn More
Want to build and customize more AI agents like this?\
🤖 [AI Bootcamp: Generative AI Beyond the Hype](https://maven.com/boring-bot/ml-system-design)\
💻 [Agent Engineering Bootcamp: Developers Edition](https://maven.com/boring-bot/advanced-llm)\
📂 [GitHub: Agents in Action](https://github.com/traversaal-ai/agents-in-action)

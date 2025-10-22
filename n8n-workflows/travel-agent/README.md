# AI Travel Assistant with MCP - n8n Workflow Setup

This n8n workflow creates an intelligent travel planning assistant that helps users find flights, hotels, and activities, then automatically generates email summaries and calendar events. It uses Model Context Protocol (MCP) for enhanced functionality.

## 🌟 Features

- **Interactive Chat Interface:** Natural conversation for trip planning
- **Multi-Service Search:** Flights, hotels, and activities via SerpAPI
- **Email Generation:** Automated HTML email summaries
- **Calendar Integration:** Automatic event creation with conflict detection
- **Budget Awareness:** Helps users stay within budget constraints
- **Memory:** Remembers conversation context

## 📋 Prerequisites

Before setting up this workflow, you'll need:

- n8n Instance (self-hosted or cloud)
- **API Keys & Credentials:**
  - OpenAI API key
  - SerpAPI key

## 🛠️ Required Credentials Setup

### 1. OpenAI API
- Go to OpenAI Platform
- Create an API key
- In n8n, add OpenAI credentials with your API key

### 2. SerpAPI
- Sign up at SerpAPI
- Get your API key from the dashboard
- Add SerpAPI credentials in n8n

## 🚀 Installation Steps

### Step 1: Import the Workflow
- Copy the provided JSON workflow
- In n8n, go to Workflows > Import from JSON
- Paste the JSON and click Import

### Step 2: Configure Credentials
Update the following credential references in the workflow:
- **OpenAI Chat Model node:** Link your OpenAI API credentials
- **Search Flights/Hotels/Activities nodes:** Link your SerpAPI credentials
- **SendEmail node:** Link your Gmail OAuth2 credentials
- **CreateEvent/GetEvent/DeleteEvent nodes:** Link your Google Calendar OAuth2 credentials

### Step 3: Update MCP Server Endpoints
The workflow uses three MCP (Model Context Protocol) servers. You'll need to update the SSE endpoints in the MCP Client nodes:
- **Search MCP Client:** Update the `sseEndpoint` URL
- **Email MCP Client:** Update the `sseEndpoint` URL
- **Calendar MCP Client:** Update the `sseEndpoint` URL

> **Note:** These endpoints should point to your n8n instance's MCP server URLs. The format is typically:  
> `https://your-n8n-instance.com/mcp/[webhook-id]/sse`

### Step 4: Configure MCP Server Tools
The workflow includes three MCP server sections:

- **Search MCP Server:**
  - Search Flights: Uses SerpAPI Google Flights engine
  - Search Hotels: Uses SerpAPI Google Hotels engine
  - Search Activities: Uses SerpAPI general search

- **Email MCP Server:**
  - SendEmail: Gmail tool for sending HTML travel summaries

- **Calendar MCP Server:**
  - CreateEvent: Creates calendar events for travel items
  - GetEvent: Retrieves existing events to check for conflicts
  - DeleteEvent: Removes outdated events when itinerary changes

## 🎯 Usage Instructions

### Starting a Conversation
- Activate the workflow
- Use the chat interface to start planning your trip
- The assistant will guide you through collecting trip details:
  - Departure and destination cities
  - Travel dates
  - Budget (optional but recommended)
  - Preferences for activities

### Example Conversation Flow

**User:** "I want to plan a trip to Paris"  
**Assistant:** "Great! I'd love to help you plan your Paris trip. Could you tell me:
- Where will you be traveling from?
- What are your travel dates?
- Do you have a budget in mind?
- How many travelers?"

### Search Process
- **Flight Search:** Assistant finds flights based on your criteria
- **Hotel Search:** Searches for accommodations (sorted by price if budget provided, otherwise by rating)
- **Activity Search:** Finds activities based on your interests and budget

### Final Deliverables
Once your itinerary is complete, the assistant will:
- **Generate HTML Email:** Beautiful travel summary with:
  - Flight details
  - Hotel recommendations with images
  - Activity suggestions
  - All formatted as clickable links

- **Create Calendar Events:** Automatically adds to your Google Calendar:
  - Flight departures/arrivals
  - Hotel check-in/check-out
  - Activity bookings

- **Conflict Detection:** Checks for existing calendar conflicts and asks for resolution

## 🔄 Workflow Architecture

### Main Components
- **Chat Trigger:** Handles user input
- **Travel Agent:** Core AI agent with detailed travel planning prompt
- **OpenAI Chat Model:** GPT-4o for intelligent responses
- **Simple Memory:** Maintains conversation context
- **MCP Clients:** Connect to MCP servers for specialized tools
- **HTTP Request Tools:** Direct API calls to SerpAPI
- **Gmail/Calendar Tools:** Google service integrations

### MCP Server Structure
The workflow uses a hub-and-spoke model where:
- **MCP Clients** in the main workflow connect to  
- **MCP Servers** that host specialized tools  
Each server handles a specific domain (Search, Email, Calendar)

## 🛡️ Security & Privacy

- All API keys are stored securely in n8n credentials
- OAuth2 tokens are handled by n8n's credential system
- No sensitive data is logged or stored permanently
- Email and calendar access requires explicit user permission
  
---

Happy Travels! 🧳✈️ This AI assistant will help make your trip planning seamless and enjoyable.

## 🎓 Learn More
Want to build and customize more AI agents like this?\
🤖 [AI Bootcamp: Generative AI Beyond the Hype](https://maven.com/boring-bot/ml-system-design)\
💻 [Agent Engineering Bootcamp: Developers Edition](https://maven.com/boring-bot/advanced-llm)\
📂 [GitHub: Agents in Action](https://github.com/traversaal-ai/agents-in-action)

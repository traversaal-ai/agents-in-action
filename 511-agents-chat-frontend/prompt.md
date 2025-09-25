## Core Functionality

Build a React TypeScript app with two main screens:

1. **Workflow Selection Screen:**

   - Title: "Agents in Action" with subtitle "Select your workflow and start chatting"
   - Dropdown to select from 3 predefined AI workflows
   - Username input field (required for session management)
   - Continue button (disabled until both fields filled)
   - Beautiful card-based design with glass morphism effects

2. **Chat Interface:**
   - Real-time chat with AI agents
   - Message history with user/assistant bubbles
   - Send messages via Enter key or button
   - Back button to return to workflow selection
   - Display current workflow and webhook URL info

## Workflow Configurations

Create exactly these 3 workflows with descriptions:

**201-basic: "Basic Webhook → OpenAI (with Memory)"**

- Icon: Webhook
- Description: "Simple AI agent with session memory"
- Features: ["POST JSON to n8n Webhook", "GPT-4o-mini responses", "Username-based session memory", "Plain text replies"]
- Webhook: "https://your-n8n-instance.com/webhook/basic-workflow-id"

**301-rag: "Webhook + RAG (AWS Agent)"**

- Icon: Database
- Description: "AWS knowledge base with vector search"
- Features: ["S3 queries use Vector Store", "Other AWS uses model knowledge", "Drive File → Embeddings", "Intelligent routing"]
- Webhook: "https://your-n8n-instance.com/webhook/rag-workflow-id"

**401-rag+search: "Webhook + RAG + Internet Search"**

- Icon: Search
- Description: "Complete AWS knowledge agent"
- Features: ["S3 topics → Vector search", "Other AWS → Internet search", "Multi-tool routing", "Comprehensive responses"]
- Webhook: "https://your-n8n-instance.com/webhook/rag-search-workflow-id"

## Technical Requirements

- Use localStorage to persist workflow selection, username, and chat history
- Send POST requests to webhook URLs with JSON: `{query: "user message", username: "username"}`
- Handle both text and JSON responses from webhooks
- Implement proper error handling with toast notifications
- Add loading states during API calls
- Use React Router for navigation
- Include proper TypeScript types

## UI/UX Design

- Modern glassmorphism design with subtle animations
- Responsive layout that works on mobile and desktop
- Use semantic color tokens and design system
- Spring animations for interactions
- Professional gradient backgrounds
- Card-based layouts with proper spacing
- Lucide React icons throughout

## State Management

- Persist all user data in localStorage with proper keys
- Manage workflow selection, username, and chat messages
- Handle loading states and error conditions
- Implement proper form validation

Make the app production-ready with proper error handling, loading states, and a polished user experience. Focus on clean code architecture with reusable components.

RAG Agent with Memory - n8n Workflow
A powerful Retrieval-Augmented Generation (RAG) chatbot built with n8n that combines document knowledge with conversational AI and persistent memory.
🌟 Features

🤖 Intelligent Chat Agent: Powered by OpenAI GPT-4o-mini for natural conversations
💾 Persistent Memory: Remembers conversation history using PostgreSQL
🔍 Document Search: Semantic search through your knowledge base
📚 Document Processing: Automated PDF ingestion and vectorization
🎯 Real-time Chat: Webhook-based chat interface for instant responses

🏗️ Architecture
This workflow consists of two main components:
1. Document Processing Pipeline (Setup)
CopyManual Trigger → Google Drive Download → Text Splitter → Document Loader → Embeddings → Vector Store
2. Chat Interface (Runtime)
CopyChat Trigger → RAG Agent → [Memory + LLM + Vector Search] → Response
🚀 Quick Start
Prerequisites
Before setting up this workflow, ensure you have:

n8n instance (cloud or self-hosted)
OpenAI API key with GPT-4o-mini access
PostgreSQL database for conversation memory
Supabase account for vector storage
Google Drive API access for document downloads

Required Credentials
Set up the following credentials in n8n:

OpenAI API

API Key from OpenAI platform
Used for: Chat model and embeddings


PostgreSQL

Database connection for chat memory
Creates tables automatically


Supabase

Project URL and API key
Used for vector storage


Google Drive OAuth2

For downloading documents
Requires OAuth2 setup



Installation Steps

Import the Workflow
bashCopy# Copy the JSON and import into your n8n instance

Configure Credentials

Set up all required API credentials
Test each connection


Prepare Your Knowledge Base

Upload your PDF document to Google Drive
Update the Google Drive file ID in the workflow
Run the document processing pipeline once


Start Chatting

Activate the chat trigger
Send messages to your RAG agent



📋 Setup Instructions
Step 1: Document Processing (Run Once)

Upload Document: Place your PDF in Google Drive
Update File ID: Replace the file ID in the "Download File" node
Run Processing: Click "Test workflow" on the manual trigger
Verify Storage: Check that vectors are stored in Supabase

Step 2: Chat Interface (Always Running)

Activate Trigger: Enable the "When chat message received" trigger
Get Webhook URL: Copy the webhook URL for your chat interface
Send Messages: POST messages to the webhook endpoint
Enjoy Conversations: The agent will respond with document knowledge

🔧 Configuration
Document Settings

Text Splitter: Recursive character splitting for optimal chunks
Embedding Model: OpenAI text-embedding-ada-002
Vector Store: Supabase with 'documents' table

Agent Settings

System Message: "You are a helpful assistant"
Model: GPT-4o-mini for cost-effective performance
Memory: PostgreSQL chat history storage
Tools: Vector search tool named 'aws_knowledge_base'

Memory Configuration

Type: PostgreSQL chat memory
Persistence: Conversation history maintained across sessions
Context: Previous messages inform current responses

🛠️ Customization
Adding New Documents

Upload new PDF to Google Drive
Update file ID in workflow
Run document processing pipeline
Documents will be added to existing knowledge base

Modifying System Behavior

System Message: Edit the RAG Agent's system message
Model Selection: Change to different OpenAI models
Chunk Size: Adjust text splitter settings
Search Results: Modify vector store retrieval count

Extending Functionality

Multi-format Support: Add different document loaders
Web Scraping: Replace Google Drive with web scrapers
API Integration: Add external data sources as tools
Custom Tools: Create specialized search tools

📊 Usage Examples
Basic Chat
CopyUser: "What is AWS Lambda?"
Agent: [Searches knowledge base + generates response with document context]
Follow-up Questions
CopyUser: "How do I deploy a Lambda function?"
Agent: [Uses conversation memory + searches for deployment info]
Context Awareness
CopyUser: "What about pricing?"
Agent: [Understands context refers to Lambda pricing from previous conversation]
🔍 Troubleshooting
Common Issues

No Document Responses

Check if vector store has data
Verify embedding model compatibility
Test vector search functionality


Memory Not Working

Confirm PostgreSQL connection
Check database permissions
Verify table creation


Chat Trigger Issues

Validate webhook URL
Check request format
Test with simple HTTP client



Debug Steps

Test Document Processing

Run manual trigger
Check each node output
Verify Supabase storage


Test Chat Flow

Send test message
Check agent response
Verify memory storage


Check Logs

Review n8n execution logs
Monitor API usage
Check error messages



📈 Performance Optimization
Cost Optimization

Model Selection: Use GPT-4o-mini for cost efficiency
Chunking Strategy: Optimize chunk sizes for relevance
Caching: Implement response caching for common queries

Speed Improvements

Vector Search: Tune similarity thresholds
Parallel Processing: Process multiple documents simultaneously
Index Optimization: Optimize Supabase vector indices

🔐 Security Considerations

API Keys: Store securely in n8n credentials
Database Access: Use read-only credentials where possible
Webhook Security: Implement authentication for chat endpoint
Data Privacy: Consider data retention policies

📚 Additional Resources

Original Tutorial: Nate Herk | AI Automation
n8n Documentation: n8n.io/docs
LangChain Integration: n8n LangChain Nodes

🤝 Contributing
Feel free to:

Report issues
Suggest improvements
Share your modifications
Add new document types

📄 License
This workflow is provided as-is for educational and practical use. Please respect the terms of service for all integrated APIs and services.

Credits: Based on the excellent tutorial by Nate Herk | AI Automation
Need Help? Check the troubleshooting section or refer to the original YouTube tutorial for detailed setup guidance.
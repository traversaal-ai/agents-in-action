**Build a Perplexity-style AI Chat App**

Create a simple AI chat interface that connects to your n8n webhook.

**What you'll build:**

- Setup page: User enters their name
- Chat page: Send messages to n8n and display AI responses

**n8n Webhook Setup:**

Your webhook URL: `>>YOUR_PRODUCTION_WEBHOOK_URL<<`

**Request format (what you send to n8n):**

```json
{
  "query": "user's question",
  "username": "username"
}
```

**Response format (what n8n sends back):**
n8n returns either an object or array with an `output` field:

```json
{
  "output": "AI assistant's answer"
}
```

or

```json
[
  {
    "output": "AI assistant's answer"
  }
]
```

**Important:** Handle both response formats. Also check for empty responses and parse text before JSON to catch errors early.

**Features:**

- Save chat history locally
- Clear chat button
- "Thinking..." loading indicator
- Error handling with toast messages
- Robust response parsing (handles object/array, checks for empty responses)

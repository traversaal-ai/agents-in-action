Here’s a **friendly, simple README** in the same “loveable” style and tone — ready for your repo 👇

---

# 💬 Build a Perplexity-Style AI Chat App

A beautiful, minimal chat interface that connects directly to your **n8n workflow**.
Every message you send goes straight to your AI workflow — and comes back as an instant, smart reply 🤖✨

---

## 🚀 What You’ll Build

- 🏠 **Setup Page:** User enters their name
- 💬 **Chat Page:** Type messages → get AI responses from n8n
- 💾 **Local History:** Messages stay even after refresh
- 🧹 **Clear Chat:** Start fresh anytime
- ⏳ **“Thinking…” Loader:** See when AI is working
- ⚡ **Error Handling:** Friendly toasts if something goes wrong

---

## 🔗 Connect Your n8n Workflow

1. **Activate** your n8n workflow
2. Copy the **Production Webhook URL** (⚠️ _not the test one!_)
3. Open the project → go to `src/config.ts`
4. Replace the placeholder:

   ```ts
   export const WEBHOOK_URL = ">>YOUR_PRODUCTION_WEBHOOK_URL<<";
   ```

5. Run the app — that’s it 🎉

---

## 📦 Data Flow

### 📨 Request (sent to n8n)

```json
{
  "query": "user's question",
  "username": "username"
}
```

### 📬 Response (from n8n)

n8n can reply with either:

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

💡 Make sure your app handles both — and ignores empty or invalid replies gracefully.

---

## ❤️ Built-in Goodness

- Smart response parsing 🧠
- Local storage for chats 💾
- Auto-refresh themes 🎨
- No extra setup — just plug in your webhook and go 🚀

---

### 🧠 Tips

If you see “thinking…” for too long, check:

- Your n8n workflow is active ✅
- You’re using the **Production Webhook URL** 🌐
- The workflow actually returns `output` in its JSON 🧾

---

Would you like me to add a short **PR description** (for your `frontend/build-your-agent-chat` branch) to go with this README — matching the repo’s tone and emoji style?

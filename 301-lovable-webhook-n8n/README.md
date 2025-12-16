# 💬 301 — Lovable - Webhook - n8n → Build a Perplexity-Style AI Chat App

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

## 💗 Lovable Chat Interface

Use the prompt in _prompt.md_ to build the interface of your chat application. 

Here is what your interface would look like!

![Lovable Chat Interface](images/lovable-webhook-n8n-speed.gif)

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

## 🎓 Learn More

Ready to go deeper?  
Check out these courses:

- [Agentic AI System Design for PMs — _For Leaders, Managers & Career Builders_](https://maven.com/boring-bot/ml-system-design?promoCode=201OFF)
- [Agent Engineering Bootcamp: Developers Edition — _For Developers, Engineers & Researchers_](https://maven.com/boring-bot/advanced-llm?promoCode=200OFF)

👉 These resources expand on the workflows here and show how to apply AI + n8n in real projects.


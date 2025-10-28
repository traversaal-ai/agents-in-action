# 🪩 Agents In Action — AI Webhook Chat App

A beautiful, ready-to-use **React + TypeScript** chat interface that connects directly to your **n8n workflow webhook**.
Every time you reload, the app automatically generates a fresh, modern color theme — no setup required.

---

## 🎨 Recreate in Lovable

Copy the complete prompt from **[prompt.md](prompt.md)** and paste it into [Lovable](https://lovable.dev).
It will generate the full project structure and code instantly.

---

## ✨ Features

- 🌈 **Auto-Generated Theme** — new color palette on every load
- 💬 **Chat UI** — smooth animations, timestamps, and “thinking…” loader
- 🧠 **n8n Integration** — connects to any **Production Webhook URL** (no auth needed)
- 💾 **Local Storage** — remembers your display name between sessions
- 🧹 **Clear Chat** — one click to start fresh anytime
- 📱 **Responsive Design** — works beautifully on desktop and mobile

---

## 🚀 Quick Start

### 1️⃣ Activate Your Workflow

Make sure your **n8n workflow** is active and ready to receive messages.

---

### 2️⃣ Copy the Production Webhook URL

In n8n, open your workflow → click on the **Webhook node** → copy the **Production URL**
(example: `https://n8n.yourdomain.com/webhook/ai-chat`)

---

### 3️⃣ Paste It into the Config in [prompt.md](/build-your-agent-chat/prompt.md)

Open `src/config.ts` and replace the placeholder with your webhook:

```typescript
export const WEBHOOK_URL = "https://n8n.yourdomain.com/webhook/ai-chat";
```

---

### 4️⃣ Paste it into 💖 Loveable!

Paste the entire updated prompt to your Loveable and enjoy the magic!

---

✨ **Every reload = a new color theme!**
No other setup required.

---

## 🧭 How It Works

1. You enter your **name** → saved in browser storage.
2. You type a message → sent via `POST` to your n8n webhook.
3. n8n returns the response → shown as the assistant’s reply.
4. All chat history stays local until cleared.

---

## 🪄 Tips

If you don’t see a response:

- Double-check that your **workflow is active**
- Make sure you used the **Production**, not Test, webhook URL
- Check your browser console for errors

---

## 💡 Built With

- React + TypeScript
- Tailwind CSS + shadcn/ui
- lucide-react icons
- sonner toasts
- Vite dev server

---

## 🧑‍💻 Learn More

Want to learn how this was built step-by-step?
Join the **AI Agents Bootcamp** → [maven.com/boring-bot](https://maven.com/boring-bot)

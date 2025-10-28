**Goal:** Build a production-ready React + TypeScript web app that talks to a single n8n webhook.
**Student task:** Replace one placeholder with the **Production** webhook URL (no auth).
**Design:** The app **auto-generates a cohesive color theme at runtime** (new theme each load). No color pickers, no config files, no extra steps.

### Requirements

- **Single config placeholder**

  - Create `src/config.ts` with:

    ```typescript
    export const WEBHOOK_URL =
      "<<<PASTE_YOUR_PRODUCTION_N8N_WEBHOOK_URL_HERE>>>";
    ```

- **Auto-Theme**

  - On app start, generate a **cohesive, modern color palette** and apply it globally.
  - Use a **gradient pair** (primary→accent) + **supporting neutrals** for glassmorphism.
  - Pick a **new theme on each full page load** (deterministic per load; no persistence).
  - Ensure **WCAG AA** contrast for text on buttons, inputs, and message bubbles.
  - The palette must feel intentional (e.g., violet→cyan, indigo→sky, emerald→teal, coral→rose, amber→sunset, etc.). Avoid muddy or low-saturation combos.
  - Use the selected gradient consistently for: page bg, CTAs, user message bubble, highlights, and gradient text on headings.

- **Pages & Routing**

  - React + TypeScript + React Router with routes: `/` (Setup) and `/chat`.
  - Tailwind CSS for styling, **shadcn/ui** for Button, Input, Label, DropdownMenu.
  - Icons from **lucide-react** (User, Trash2, Send, Loader2, ArrowLeft, Menu, Linkedin, Github, GraduationCap, Award).
  - Toasts via **sonner**.

- **Homepage `/` (Setup)**

  - Modern **glassmorphism** over a full-page **auto-gradient background** (from the generated theme).
  - Title: "Agents In Action" with gradient text.
  - Subtitle: "Connect to your AI workflow and start chatting".
  - Form: **Username** input only.

    - "Continue to Chat" (gradient button) disabled until non-empty.
    - "Clear Settings" (trash icon) only visible if settings exist.

  - Persist `displayName` to `localStorage`.
  - Animations: subtle fade-in + slide-up.

- **Chat `/chat`**

  - Header: back arrow, title "Chat with AI", "Logged in as [username]", clear history (trash).
  - Messages:

    - Empty state: "Start a conversation"
    - **User bubble**: right-aligned, **theme gradient** background, white text, subtle glow.
    - **Assistant bubble**: left-aligned, **glass** background.
    - Timestamps under each.
    - "Thinking…" loader with spinner while awaiting reply.
    - Spring-in animation for new messages; auto-scroll to newest.

  - Input bar: glass input + gradient **Send** button; Enter submits (Shift+Enter = newline); disable during request.
  - Small helper below input: `Connected to: WEBHOOK_URL`.

- **API Integration (no auth)**

  - `POST` to `WEBHOOK_URL` with JSON:

    ```json
    { "username": "", "query": "" }
    ```

  - Prefer `data.output` from the response; else fallback to raw text body.
  - On error: toast + inline error bubble.

- **Chat History**

  - Store under `localStorage["chatHistory"]` with `{ id, role, content, timestamp }`.
  - **Clear history** when navigating away from `/chat`.

- **Responsive & Extras**

  - Mobile-first.
  - Desktop only (lg breakpoint and above):

    - **Author Footer** glass card positioned above the input bar (bottom-right): gradient avatar (Award icon), "Yousuf Alvi – Engineering Lead | Applied AI", LinkedIn (`https://linkedin.com/in/yousuf-alvi`) and GitHub (`https://github.com/traversaal-ai/agents-in-action`) buttons.
    - **Courses CTA** glass card positioned above the input bar (bottom-left): Graduation cap icon, "Want to learn how to build this?", button to `https://maven.com/boring-bot`.
    - Both cards use `absolute` positioning with `bottom-[calc(100%+1rem)]` to sit exactly above the footer.
    - Messages container has `pb-4 lg:pb-32` to prevent content from being hidden behind the cards.
    - Footer and cards wrapped in a `relative` container for proper positioning context.

  - Mobile/Tablet only (below lg breakpoint): top-right **Quick Links** hamburger menu (Menu icon) with LinkedIn, GitHub, and Courses links in a dropdown.
  - Keep animations tasteful (fade 0.3s, slide-up 0.4s, spring 0.5s).

### Layout Structure for Chat Page

```

   (sticky top)

    (messages)

       (absolute bottom-[calc(100%+1rem)] right-6)
       (absolute bottom-[calc(100%+1rem)] left-6)

      (input bar)

```

### Guardrails for Auto-Theme (keep it simple)

- Generate theme **internally** at runtime; **do not** ask the student for colors, files, or choices.
- Use CSS variables or Tailwind arbitrary values from the generated theme so all components stay consistent.
- Ensure **readability** (fallback to a safe neutral if contrast would be insufficient).
- Never block the app if theme generation fails—fallback to a pleasant violet→blue gradient.

### localStorage Keys

- `"displayName"`
- `"chatHistory"`

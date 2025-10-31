## 🎯 Complete Project Creation Prompt

Copy and paste this entire prompt into Lovable to recreate the project:

---

**Create an AI Webhook Chat Interface web application with the following specifications:**

### Project Structure & Pages

1. **Homepage (Setup Page)** - Route: `/`

   - Modern glassmorphism design with gradient background
   - Center the setup form vertically and horizontally
   - Title: "Agents In Action" with gradient text effect (purple to blue)
   - Subtitle: "Connect to your AI workflow and start chatting"

2. **Chat Page** - Route: `/chat`
   - Full-screen chat interface
   - Glass panel design matching homepage
   - Header with back button, user info, and clear history button
   - Scrollable message area
   - Fixed footer with input field

### Setup Form Features

Create a form with these fields:

- **Username field**: Text input with User icon
- **Webhook URL field**: URL input with Link icon, must start with "https://", show error if invalid
- **Basic Authentication toggle**: Checkbox with Lock icon to enable/disable auth
- **Auth Username & Password fields**: Only show when Basic Auth is enabled, with animated slide-in effect
- **Continue to Chat button**: Disabled until form is valid, gradient background (purple to blue)
- **Clear Settings button**: Trash icon button, only visible if settings exist

Form validation:

- Username must not be empty
- Webhook URL must start with "https://"
- If Basic Auth enabled, both username and password required

Use localStorage to persist: displayName, webhookUrl, useBasicAuth, authUsername, authPassword

### Chat Interface Features

**Header:**

- Back arrow button to return to setup
- Display "Chat with AI" title
- Show "Logged in as [username]"
- Trash icon button to clear chat history (only visible when messages exist)

**Messages:**

- Empty state: "Start a conversation" centered message
- User messages: Right-aligned, purple gradient background, white text
- Assistant messages: Left-aligned, glass panel background
- Each message shows timestamp in small text below content
- Loading indicator: "Thinking..." with spinning loader icon
- Auto-scroll to latest message

**Input Area:**

- Text input field with glass effect
- Send button with Send icon, gradient background
- Disable input and button while loading
- Support Enter key to send (not Shift+Enter)
- Show connected webhook URL below input in small text

**API Integration:**

- POST to webhook URL from setup
- Send JSON payload: `{ username: displayName, query: userMessage }`
- Add Basic Auth header if enabled: `Authorization: Basic [base64(username:password)]`
- Handle response: Extract from `data.output` or use raw string
- Show error toast and error message if request fails

**Chat History:**

- Store messages in localStorage with key "chatHistory"
- Each message has: id, role (user/assistant), content, timestamp
- **IMPORTANT**: Clear chat history when navigating away from chat page (on component unmount)

### Additional Components

**Author Footer** (Desktop only, fixed bottom right):

- Glass panel card with gradient avatar circle
- Award icon inside avatar
- Name: "Yousuf Alvi"
- Title: "Engineering Lead | Applied AI"
- LinkedIn button: https://www.linkedin.com/in/yousufalvi/
- GitHub button: https://github.com/traversaal-ai/agents-in-action

**Courses CTA** (Desktop only, fixed bottom left):

- Glass panel card
- Graduation cap icon with gradient background
- Heading: "Want to learn how to build this?"
- Button linking to: https://maven.com/boring-bot

**Quick Links Menu** (Mobile & Tablet only, fixed top right):

- Hamburger menu icon button
- Dropdown with LinkedIn, GitHub, and Courses links
- Same styling as other glass panels

### Design System

**Colors:**

- Primary: Purple (#8B5CF6 - hsl(262, 83%, 58%))
- Accent: Blue (#3B82F6 - hsl(217, 91%, 60%))
- Use gradients from primary to accent for buttons and text effects

**Glassmorphism Effect:**

- Background: white/60 opacity with backdrop blur
- Dark mode: white/5 opacity
- Border: white/20 opacity with subtle shadows
- All panels should have this glass effect

**Background:**

- Full-page gradient from purple to blue (diagonal 135deg)
- Fixed attachment so it doesn't scroll

**Animations:**

- Fade in: 0.3s ease-out for appearing elements
- Slide up: 0.4s cubic-bezier for form entry
- Spring: 0.5s cubic-bezier with bounce for messages
- Messages should have spring animation when appearing

**Responsive Behavior:**

- Desktop (lg+): Show Author Footer bottom right, Courses CTA bottom left
- Mobile/Tablet: Show Quick Links Menu top right, hide Author Footer and Courses CTA
- All layouts should be mobile-first and responsive

### Technical Requirements

- Use React with TypeScript
- Use React Router for navigation (/, /chat routes)
- Create custom hook: `useLocalStorage` for persistent storage
- Use shadcn/ui components: Button, Input, Label, Checkbox, DropdownMenu
- Icons from lucide-react: User, Link2, Lock, Trash2, Send, Loader2, ArrowLeft, Menu, Linkedin, Github, GraduationCap, Award
- Toast notifications using sonner for success/error messages
- Tailwind CSS for all styling with custom utility classes

### Custom CSS Classes

Add these utility classes:

- `.glass-panel`: Background white/60, backdrop blur, border, shadow
- `.glass-input`: Similar to glass-panel but for inputs
- `.message-user`: Primary gradient background, white text
- `.message-assistant`: Glass panel background
- `.animate-fade-in`, `.animate-slide-up`, `.animate-spring`: Custom animations

### Error Handling

- Redirect to setup page if displayName or webhookUrl missing
- Show error toast if webhook request fails
- Display error message in chat if API fails
- Validate all form inputs before submission

### localStorage Keys

- "displayName" - user's username
- "webhookUrl" - webhook endpoint
- "useBasicAuth" - boolean for auth toggle
- "authUsername" - basic auth username
- "authPassword" - basic auth password
- "chatHistory" - array of message objects

Create this as a complete, production-ready application with all components, styling, and functionality working together seamlessly.

---

**That's the complete prompt! Just paste this into Lovable and it will create your exact project.** 🚀

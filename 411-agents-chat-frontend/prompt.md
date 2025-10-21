Here's a comprehensive prompt students can use to recreate this website:

Create an "Agents in Action" chat application with the following specifications:

## Core Functionality

- Build a React app that lets users select from 3 AI workflows and chat with them via webhooks
- Implement workflow selection page and chat interface
- Use local storage to save user preferences (username, selected workflow, webhook URLs)
- Add proper error handling and loading states for API calls

## Workflow Selection Page

- Create 3 workflow options: "Basic AI Assistant", "RAG-Enhanced Assistant", and "RAG + Web Search Assistant"
- Each workflow should have an icon, description, and feature list
- Include username input field with validation
- Add webhook URL configuration for each workflow (use placeholder URLs like "https://your-n8n-instance.com/webhook/basic-workflow-id")
- Only enable "Continue to Chat" when both workflow and username are provided

## Chat Interface

- Build a modern chat UI with user and assistant message bubbles
- Implement real-time messaging with proper timestamp display
- Add typing indicators with animated dots during loading
- Include back button to return to workflow selection
- Show current workflow name in header
- Display webhook URL information at bottom

## Design System & Styling

- Use glassmorphism aesthetic with blur effects and transparency
- Implement bento card design patterns
- Create a cohesive color scheme with CSS variables for theming
- Use semantic color tokens (avoid hardcoded colors like text-white)
- Ensure proper contrast for accessibility
- Add smooth animations and transitions throughout

## Responsive Design

- Make fully responsive for mobile, tablet, and desktop
- On mobile/tablet: hide large course CTAs and author footer
- Add a quick links dropdown menu for smaller screens containing:
  - LinkedIn profile link
  - GitHub repository link
  - Course links with external link icons
- Optimize header spacing for mobile devices
- Move workflow labels below header on mobile

## Components to Create

- WorkflowSelection component with dropdown and user input
- ChatInterface with message history and composer
- QuickLinksMenu dropdown for mobile navigation
- CoursesCTA component (hidden on mobile)
- AuthorFooter component (hidden on mobile)
- ThemeToggle for dark/light mode
- Proper UI components using shadcn/ui patterns

## Technical Requirements

- Use TypeScript for type safety
- Implement proper state management with useState and useLocalStorage hooks
- Add form validation and user feedback with toast notifications
- Handle both JSON and plain text webhook responses
- Include proper error boundaries and loading states
- Use Lucide React icons throughout the interface

## API Integration

- Send POST requests to webhook URLs with username and query
- Handle various response formats (plain text and JSON with "output" field)
- Display meaningful error messages when requests fail
- Show webhook URL and workflow name for transparency

## Additional Features

- Auto-scroll to bottom of chat on new messages
- Support Enter key to send messages (Shift+Enter for new lines)
- Persist all user data in localStorage
- Add smooth page transitions and hover effects
- Include proper ARIA labels for accessibility

## Styling Details

- Use Tailwind CSS with custom design tokens
- Implement glass panel effects for header and footer
- Create message bubble animations with spring effects
- Add gradient backgrounds and subtle shadows
- Ensure dropdown menus have proper backgrounds (not transparent)
- Use consistent spacing and typography scale

Make the interface polished, professional, and suitable for educational demonstrations of AI agent workflows.
This prompt provides all the necessary details for students to recreate the exact functionality and design without exposing any sensitive information.

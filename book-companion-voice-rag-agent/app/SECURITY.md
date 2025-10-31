# Security Information

## Public Supabase Credentials

This repository contains **public/publishable** Supabase credentials in:
- `src/integrations/supabase/client.ts` 
- `.env.example` (as examples)

These credentials are **safe to be public** because they are:
- **Publishable keys**: Designed to be used in client-side applications
- **Protected by Row Level Security (RLS)**: Database access is controlled by RLS policies

## Private Credentials (NOT in repository)

Sensitive credentials are stored securely as **Supabase Edge Function secrets**:
- `OPENAI_API_KEY`: OpenAI API key for AI completions
- `N8N_RAG_URL`: Private n8n webhook URL for RAG queries

These are never exposed in the codebase and are only accessible to Supabase Edge Functions.

## Database Security

The application uses Supabase Row Level Security (RLS) to protect data:
- Users can only access their own chat history via session-based policies
- All database operations are secured through RLS policies
- **Note**: The `documents` table currently lacks RLS policies and should be secured before production use

## Environment Setup

1. **Public credentials**: Already included in the codebase
2. **Private credentials**: Must be added via Supabase dashboard as Edge Function secrets
3. **No `.env` file needed**: All configuration is handled through Supabase

## Security Best Practices

- Never commit actual `.env` files with sensitive data
- Always use RLS policies for database tables containing user data
- Store API keys and webhooks as Supabase Edge Function secrets
- Regularly audit RLS policies and database permissions

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly by contacting the project maintainers directly rather than creating a public issue.
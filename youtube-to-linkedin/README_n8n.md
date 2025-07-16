![YouTube to LinkedIn Automation](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnhxcHZkNXVrbmk4Y3Fxazk0aHFqbHplbDZueWRtMXUxNGFxNXF2bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ASH5ovgLK95jIKRSYy/giphy.gif)

# YouTube to LinkedIn n8n Workflow

This folder contains the **YouTube Link to LinkedIn Post Automation Workflow** for n8n.

## Overview
This workflow automates the process of turning YouTube videos into LinkedIn posts, with human review and status tracking.

### Key Features
- Scheduled or webhook-triggered intake of YouTube links (from Google Sheets)
- Extracts video transcripts using external APIs
- Uses AI to generate LinkedIn-optimized post drafts
- Human-in-the-loop review via Slack
- Auto-publishes approved posts to LinkedIn
- Tracks status and results in Google Sheets

## How It Works
1. **Trigger:** Scheduled or manual trigger checks for new YouTube links in Google Sheets.
2. **Transcript:** Fetches and stores video transcripts.
3. **AI Generation:** Uses OpenAI/LLM to draft LinkedIn posts.
4. **Review:** Sends drafts to Slack for human approval and feedback.
5. **Publish:** Posts approved content to LinkedIn.
6. **Track:** Updates Google Sheets with status and post details.

## Inputs
- YouTube video link (from Google Sheets or webhook)
- Audience/targeting info (optional)

## Outputs
- LinkedIn post published to the specified account
- Status and post details updated in Google Sheets

## Setup
1. Import `youtube_link_to_post_n8n.json` into your n8n instance.
2. Set up credentials for:
   - Google Sheets
   - OpenAI (or other LLM provider)
   - Slack (for review/approval)
   - LinkedIn (for publishing)
3. Configure Google Sheet structure as expected by the workflow.
4. Adjust Slack and LinkedIn nodes for your workspace/account.

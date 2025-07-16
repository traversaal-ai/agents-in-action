# Blog Post Agent

This folder contains workflows and configurations for automated blog post generation using n8n and AI.

## Overview
The Blog Post Agent automates the process of generating high-quality blog posts. It leverages AI to create content based on your prompts and can be extended with additional research and enrichment steps.

### Key Features
- Automated blog post generation using AI
- Configurable prompts and topics
- Can be integrated with other tools (Google Sheets, Notion, etc.)

## Sub-Workflow Requirement
**To enable deep research and richer content, you should also add the `deep research n8n` workflow as a sub-workflow.**
- The `blog_deep_research.json` file provides a research pipeline that can be called from the main blog post generator workflow.
- This allows the agent to gather and synthesize information before drafting the post.

## Setup
1. Import `blog_post_generator.json` into your n8n instance as the main workflow.
2. Import `blog_deep_research.json` as a sub-workflow.
3. Configure any required credentials (OpenAI, Google, etc.) in n8n.
4. Adjust prompts and workflow logic as needed for your use case.

## Usage
- Trigger the main workflow with your desired topic or prompt.
- The workflow will optionally call the deep research sub-workflow, then generate a blog post draft.
- Output can be sent to your preferred platform (Google Docs, Notion, etc.).

## Files
- `blog_post_generator.json` — Main workflow for blog post generation
- `blog_deep_research.json` — Sub-workflow for deep research 
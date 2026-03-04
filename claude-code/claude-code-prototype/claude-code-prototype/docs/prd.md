# Product Requirements Document (PRD)

**Product:** NoteToTicket — AI Meeting Notes to Feature Request Converter
**Author:** Demo PM
**Last updated:** 2026-02-20
**Status:** Draft

---

## Problem Statement

Product managers spend 2-4 hours per week manually converting raw customer call notes
into structured feature requests in Jira or Linear. The process is inconsistent across
PMs, key details get lost in translation, and the delay slows down sprint planning.

This feature gives PMs a way to paste unstructured call notes and receive a ready-to-edit
feature request — formatted, categorized, and prioritized — in under 30 seconds.

---

## Goals

- [ ] Reduce time from customer call to filed ticket from ~90 minutes to under 5 minutes
- [ ] 75% of generated tickets require fewer than 3 manual edits before filing
- [ ] Adopted by at least 80% of PMs within 60 days of launch
- [ ] Zero sensitive customer data stored beyond the active session

## Non-Goals

- We are not replacing Jira, Linear, or any existing ticketing system
- We are not building a full call recording or transcription pipeline in v1
- We are not auto-filing tickets — a human always reviews before submission

---

## User Stories

### Must Have (v1)
- As a **PM**, I want to paste raw meeting notes and receive a structured feature request so that I don't spend time reformatting.
- As a **PM**, I want the output to include a suggested priority (High / Medium / Low) so that I have a starting point for triage.
- As a **PM**, I want to edit the generated ticket inline before exporting so that I can correct anything Claude got wrong.
- As a **PM**, I want to export the ticket as a Jira-formatted payload so that I can file it in one click.

### Nice to Have (v1.1+)
- As a **PM**, I want Claude to flag if a feature request duplicates an existing open ticket.
- As a **PM**, I want to tag the output with a customer name or account so that tickets are traceable to source calls.
- As a **team lead**, I want a weekly digest of all AI-generated tickets for review so that I can spot patterns across PMs.

---

## Key Flows

### Flow 1: Generate a feature request from notes
1. PM finishes a customer call and opens NoteToTicket in the browser
2. PM pastes raw notes into the input field (free text, no format required)
3. Claude processes the notes and returns a structured ticket draft:
   - Title
   - Problem summary (1-2 sentences)
   - Proposed solution
   - Acceptance criteria (bulleted)
   - Suggested priority
4. PM reviews, edits inline, and clicks "Export to Jira"
5. Ticket is created in Jira as a draft; PM gets a confirmation link

### Flow 2: Regenerate or refine a section
1. PM highlights a section of the generated output (e.g., acceptance criteria)
2. PM types a refinement prompt (e.g., "make these more testable")
3. Claude updates only that section without changing the rest
4. PM accepts or rejects the update

---

## Edge Cases & Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Notes are in another language — do we translate or reject? | PM | Open |
| 2 | Notes are extremely short (< 3 sentences) — do we proceed or prompt for more? | Eng | Open |
| 3 | Customer mentions a competitor — do we redact before storing logs? | Legal | Open |
| 4 | PM pastes a transcript instead of notes — max input length? | Eng | Proposed: 8,000 words |
| 5 | What if Claude misclassifies priority? Who is accountable? | PM | Open |

---

## Out of Scope

- Auto-filing tickets without human review
- Voice-to-text or call recording integration (planned for v2)
- Support for project management tools outside Jira (Linear, Asana, etc.) — v1.1
- Analytics dashboard on ticket quality or PM usage patterns

---

## Backlog
> Ideas that don't fit v1 but shouldn't be forgotten.

- [ ] "Similar tickets" panel — surface related open tickets while the PM is drafting
- [ ] Confidence score on the generated output so PMs know when to scrutinize more
- [ ] Slack integration: paste notes directly in a channel, get a ticket back as a thread
- [ ] Template library: different ticket formats for bugs vs. feature requests vs. research spikes

---

## Appendix

- [Internal research: PM time audit Q4 2025] — available on Notion
- [Jira API docs for ticket creation] — developer reference
- [Customer interview recordings] — restricted access, ask PM lead

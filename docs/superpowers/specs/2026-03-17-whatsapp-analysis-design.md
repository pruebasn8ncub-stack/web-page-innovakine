# WhatsApp Conversation Analysis — Design Spec

## Objective

Extract, analyze, and structure all WhatsApp conversations from Evolution API (Innovakine instance) to build a comprehensive knowledge base for the AI chatbot "Kini" and improve clinic communication.

## Data Source

- **Evolution API v2.3.7** — Instance "Innovakine" (56930186496)
- **Volume**: 6,980 messages across 1,418 chats (604 individual)
- **Date range**: Dec 14, 2025 → Mar 17, 2026 (~3 months)
- **Note**: `syncFullHistory: false` — partial sync only

## Pipeline

### Phase 1: Extraction (Script)

TypeScript script (`scripts/extract-conversations.ts`) that:

1. Fetches all individual chats (excluding groups) via `POST /chat/findChats/Innovakine`
2. For each chat, fetches all messages via `POST /chat/findMessages/Innovakine` with pagination
3. Groups messages into conversations with metadata
4. Merges consecutive messages from same sender into blocks
5. Filters noise (empty messages, system messages, single-emoji-only)
6. Computes raw metrics (response times, message counts, timestamps)
7. Outputs:
   - `scripts/output/conversations.json` — Structured conversation data
   - `scripts/output/metrics-raw.json` — Raw metrics for analysis

### Phase 2: Analysis (Claude reads JSON directly)

Read conversation data in batches (~50 conversations per batch) and analyze:

- Categorize topics and intents
- Identify FAQ patterns and frequency
- Analyze admin communication style and tone
- Detect communication gaps and failures
- Map conversation flows
- Extract clinic-specific terminology
- Identify escalation-worthy scenarios
- Compute service metrics

### Phase 3: Deliverables

| ID | Deliverable | Format | Location |
|----|-------------|--------|----------|
| A | Categorized FAQs | JSON | `docs/whatsapp-analysis/faq-categorized.json` |
| B | Analysis Report | MD | `docs/whatsapp-analysis/analysis-report.md` |
| C | Landing FAQs | TSX update | `src/components/FAQ.tsx` |
| D | Admin Response Playbook | MD | `docs/whatsapp-analysis/admin-playbook.md` |
| E | Intent & Flow Map | MD | `docs/whatsapp-analysis/intent-map.md` |
| F | Clinic Dictionary | JSON | `docs/whatsapp-analysis/clinic-dictionary.json` |
| G | Escalation Rules | MD | `docs/whatsapp-analysis/escalation-rules.md` |
| H | Service Metrics | MD | `docs/whatsapp-analysis/service-metrics.md` |
| **Final** | **Kini Prompt** | MD | `docs/whatsapp-analysis/kini-prompt.md` |

## Script Design

### extract-conversations.ts

```
Input: Evolution API (6,980 messages)
Output: conversations.json + metrics-raw.json

Steps:
1. Fetch all individual chats (filter @g.us)
2. For each chat (with 200ms delay between):
   a. Paginate all messages (50 per page)
   b. Extract text from message objects
   c. Group into sender blocks (merge consecutive same-sender)
   d. Create Q&A pairs (client→admin, admin→client)
3. Filter conversations with < 2 messages
4. Compute per-conversation metrics:
   - First/last message timestamps
   - Average admin response time
   - Message count by sender type
   - Media types used
5. Export structured JSON
```

### Conversation JSON Structure

```json
{
  "metadata": {
    "extraction_date": "2026-03-17",
    "total_conversations": 400,
    "total_messages": 6980,
    "date_range": { "from": "2025-12-14", "to": "2026-03-17" }
  },
  "conversations": [
    {
      "jid": "...",
      "contact_name": "...",
      "phone": "...",
      "message_count": 24,
      "first_message": "2026-01-15T10:00:00Z",
      "last_message": "2026-01-15T12:30:00Z",
      "blocks": [
        {
          "sender": "client" | "admin",
          "text": "merged text...",
          "timestamp": 1234567890,
          "message_types": ["conversation", "imageMessage"]
        }
      ],
      "qa_pairs": [
        {
          "question": "...",
          "answer": "...",
          "q_timestamp": 1234567890,
          "a_timestamp": 1234567891,
          "response_time_seconds": 120
        }
      ],
      "metrics": {
        "avg_response_time_seconds": 180,
        "client_messages": 10,
        "admin_messages": 14,
        "has_media": true
      }
    }
  ]
}
```

## Noise Filtering Rules

- Skip messages with empty text content
- Skip system messages (messageType: protocolMessage, reactionMessage, stickerMessage)
- Skip single-character messages
- Merge consecutive messages from same sender (within 5 min window)
- Flag but don't skip media-only messages (note as "[imagen]", "[audio]", "[video]", "[documento]")

## File Handling

- `scripts/output/` is gitignored (raw data, potentially large)
- `docs/whatsapp-analysis/` is committed (analysis results)
- No patient PII in committed files (phone numbers anonymized in reports)

## Security

- No patient names, RUTs, or phone numbers in committed deliverables
- Raw extraction data stays in gitignored output directory
- Environment variables used for all API credentials

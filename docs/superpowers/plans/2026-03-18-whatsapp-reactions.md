# WhatsApp Reactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Handle WhatsApp reaction messages so they appear in the admin panel with context, trigger the bot, and stop showing as misleading `[media]`.

**Architecture:** Reactions are processed as normal messages with constructed content referencing the original message. No DB schema changes. The webhook extracts the emoji + referenced message ID, builds a content string, and inserts it like any other message. The UI renders a special compact bubble for `message_type === "reactionMessage"`.

**Tech Stack:** Next.js 14, TypeScript, Supabase, Evolution API, Vitest

**Spec:** `docs/superpowers/specs/2026-03-18-whatsapp-reactions-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `src/lib/evolution-api.ts` | Add `extractReactionInfo` function + `ReactionInfo` interface |
| Modify | `src/app/api/whatsapp/webhook/route.ts` | Handle `reactionMessage` in `handleMessagesUpsert` |
| Modify | `src/components/whatsapp/MessageBubble.tsx` | Render reaction bubbles with emoji + reference |
| Create | `src/tests/extract-reaction-info.test.ts` | Unit tests for `extractReactionInfo` |

---

### Task 1: Add `extractReactionInfo` to evolution-api.ts

**Files:**
- Modify: `src/lib/evolution-api.ts:26-37` (add interface + function after existing types)
- Create: `src/tests/extract-reaction-info.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/tests/extract-reaction-info.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { extractReactionInfo } from '@/lib/evolution-api';

describe('extractReactionInfo', () => {
  it('extracts emoji and referenced message ID from a reaction', () => {
    const message = {
      reactionMessage: {
        key: { id: 'ABC123', fromMe: true, remoteJid: '123@lid' },
        text: '👍',
        senderTimestampMs: { low: 123, high: 0 },
      },
      messageContextInfo: {},
    };
    const result = extractReactionInfo(message);
    expect(result).toEqual({ emoji: '👍', reactedMessageId: 'ABC123' });
  });

  it('returns null for reaction removal (empty text)', () => {
    const message = {
      reactionMessage: {
        key: { id: 'ABC123', fromMe: true, remoteJid: '123@lid' },
        text: '',
      },
    };
    expect(extractReactionInfo(message)).toBeNull();
  });

  it('returns null for non-reaction messages', () => {
    const message = { conversation: 'hello' };
    expect(extractReactionInfo(message)).toBeNull();
  });

  it('handles missing key gracefully', () => {
    const message = {
      reactionMessage: { text: '❤️' },
    };
    const result = extractReactionInfo(message);
    expect(result).toEqual({ emoji: '❤️', reactedMessageId: '' });
  });

  it('handles skin tone emoji variants', () => {
    const message = {
      reactionMessage: {
        key: { id: 'DEF456' },
        text: '👍🏻',
      },
    };
    const result = extractReactionInfo(message);
    expect(result).toEqual({ emoji: '👍🏻', reactedMessageId: 'DEF456' });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/tests/extract-reaction-info.test.ts`
Expected: FAIL — `extractReactionInfo` does not exist yet.

- [ ] **Step 3: Implement `extractReactionInfo`**

In `src/lib/evolution-api.ts`, add after the `MediaInfo` interface (around line 37):

```typescript
export interface ReactionInfo {
  emoji: string;
  reactedMessageId: string;
}

/**
 * Extract reaction data from a raw WhatsApp message.
 * Returns null for non-reactions or reaction removals (empty emoji).
 *
 * Format sync: the content string built from this data in webhook/route.ts
 * is parsed by MessageBubble.tsx — keep both in sync.
 */
export function extractReactionInfo(
  message: Record<string, unknown>
): ReactionInfo | null {
  const reaction = message.reactionMessage;
  if (!reaction || typeof reaction !== 'object') return null;

  const r = reaction as Record<string, unknown>;
  const emoji = typeof r.text === 'string' ? r.text : '';
  if (!emoji) return null; // Empty = reaction removed, ignore

  const key = r.key as Record<string, unknown> | undefined;
  const reactedMessageId = typeof key?.id === 'string' ? key.id : '';

  return { emoji, reactedMessageId };
}
```

Also add `extractReactionInfo` to the import in `webhook/route.ts` (line 18 area):

```typescript
import {
  extractTextContent,
  extractMediaInfo,
  extractReactionInfo,
  parseJidToPhone,
  sendTextMessage,
  fetchProfilePicture,
  downloadAndStoreMedia,
} from '@/lib/evolution-api';
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/tests/extract-reaction-info.test.ts`
Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/evolution-api.ts src/tests/extract-reaction-info.test.ts src/app/api/whatsapp/webhook/route.ts
git commit -m "feat(whatsapp): add extractReactionInfo for WhatsApp reaction messages"
```

---

### Task 2: Handle reactions in webhook

**Files:**
- Modify: `src/app/api/whatsapp/webhook/route.ts:243-467` (inside `handleMessagesUpsert`)

- [ ] **Step 1: Restructure `handleMessagesUpsert` and add reaction handling**

The restructuring is needed because `setPendingAndFireDebounce` captures `conversation`, `debounceSeconds`, and `debounceUrl` from its closure. These must be initialized **before** the reaction check so the helper works in both paths.

**Restructure order** (replace lines 271-337 of the current code):

1. Move `conversation`, `debounceSeconds`, `debounceUrl`, `botActive`, and `setPendingAndFireDebounce` **before** the reaction check
2. Add `extractReactionInfo` check with early return
3. Keep existing text/media extraction for non-reaction messages

```typescript
  // ── Shared setup (used by both reaction and normal paths) ──
  // Only use pushName for incoming messages — for outgoing, pushName is our own name
  const conversation = await findOrCreateConversation(jid, phone, fromMe ? undefined : pushName);

  const hasMedia = !!(extractMediaInfo(rawMessage).mediaType && waMessageId && jid);
  const botActive = !fromMe && !conversation.is_bot_paused;
  const debounceSeconds = parseInt(process.env.WHATSAPP_DEBOUNCE_SECONDS ?? '10', 10);
  const debounceUrl = process.env.N8N_DEBOUNCE_WEBHOOK_URL;

  // Helper: set pending timestamp and fire debounce timer
  async function setPendingAndFireDebounce(): Promise<string> {
    const ts = new Date().toISOString();
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({ bot_pending_since: ts })
      .eq('id', conversation.id);
    if (debounceUrl) {
      try {
        await fetch(debounceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: conversation.id,
            pendingTimestamp: ts,
            debounceSeconds,
          }),
          signal: AbortSignal.timeout(5000),
        });
      } catch { /* N8N unavailable */ }
    }
    return ts;
  }

  // ── Check for reaction BEFORE text/media extraction ──
  const reactionInfo = extractReactionInfo(rawMessage);

  if (reactionInfo) {
    // Format sync: MessageBubble.tsx parses this format — keep both in sync.

    // Idempotency check
    if (waMessageId) {
      const { data: existingMsg } = await supabaseAdmin
        .from('whatsapp_messages')
        .select('id')
        .eq('wa_message_id', waMessageId)
        .single();
      if (existingMsg) return;
    }

    // Look up the referenced message to provide context
    let reactionContent = `Reaccionó ${reactionInfo.emoji}`;
    if (reactionInfo.reactedMessageId) {
      const { data: refMsg } = await supabaseAdmin
        .from('whatsapp_messages')
        .select('content')
        .eq('wa_message_id', reactionInfo.reactedMessageId)
        .single();
      const refText = refMsg?.content?.trim();
      if (refText) {
        const truncated = refText.length > 50 ? refText.slice(0, 50) + '...' : refText;
        reactionContent = `Reaccionó ${reactionInfo.emoji} a: "${truncated}"`;
      }
    }

    // Insert reaction message
    await supabaseAdmin.from('whatsapp_messages').insert({
      conversation_id: conversation.id,
      wa_message_id: waMessageId,
      sender_type: fromMe ? 'admin' : 'client',
      sender_id: null,
      content: reactionContent,
      media_type: null,
      media_url: null,
      media_mime_type: null,
      message_type: 'reactionMessage',
      status: fromMe ? 'sent' : 'delivered',
      from_me: fromMe,
    });

    // Update conversation metadata
    const conversationUpdate: Record<string, unknown> = {
      last_message: reactionInfo.emoji,
      last_message_at: new Date().toISOString(),
      last_message_from_me: fromMe,
      last_message_sender_type: fromMe ? 'admin' : 'client',
    };
    if (!fromMe && pushName && pushName !== conversation.contact_name) {
      conversationUpdate.contact_name = pushName;
    }
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update(conversationUpdate)
      .eq('id', conversation.id);

    if (!fromMe) {
      // Increment unread
      await supabaseAdmin.rpc('increment_unread', { conv_id: conversation.id });

      // Mark outgoing 'sent' messages as 'delivered' (client is online)
      await supabaseAdmin
        .from('whatsapp_messages')
        .update({ status: 'delivered' })
        .eq('conversation_id', conversation.id)
        .eq('from_me', true)
        .eq('status', 'sent');

      // Bot debounce
      if (botActive) {
        await setPendingAndFireDebounce();
      }

      // Save to N8N memory when bot is paused
      if (!botActive) {
        const sessionId = `wa_${conversation.id}`;
        await saveN8nChatHistory(sessionId, 'human', `[Cliente]: ${reactionContent}`);
      }
    } else {
      // Outgoing reaction: auto-pause bot + save to N8N
      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          is_bot_paused: true,
          paused_by: null,
          paused_at: new Date().toISOString(),
          bot_pending_since: null,
        })
        .eq('id', conversation.id);

      const sessionId = `wa_${conversation.id}`;
      await saveN8nChatHistory(sessionId, 'human', `[Agente Humano]: ${reactionContent}`);
    }

    return; // Done — skip normal text/media flow
  }

  // ── Normal message flow (non-reaction) ──
  // extractTextContent/extractMediaInfo only run for non-reactions
  let content = extractTextContent(rawMessage);
  const mediaInfo = extractMediaInfo(rawMessage);
  const messageType =
    mediaInfo.messageType ?? (rawMessage.conversation !== undefined ? 'conversation' : 'unknown');

  // NOTE: Remove the duplicate declarations of conversation, hasMedia, botActive,
  // debounceSeconds, debounceUrl, and setPendingAndFireDebounce that were here before
  // — they are now hoisted above the reaction check.
  // The idempotency check (lines 308-316) and early debounce (lines 318-323) remain here.
  // The rest of the existing code (lines 308 onward) continues unchanged.
```

**Summary of what moves:**
- Lines 277-306 (conversation, debounce vars, setPendingAndFireDebounce) → moved before reaction check
- Lines 271-274 (content, mediaInfo, messageType) → stay after reaction check (only for non-reactions)
- Line 279 (`hasMedia`) → computed early with a quick `extractMediaInfo` peek for the debounce logic, but `mediaInfo` is fully used only in the non-reaction path

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | head -20`
Expected: Build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/whatsapp/webhook/route.ts
git commit -m "feat(whatsapp): handle reactionMessage in webhook with bot trigger and context"
```

---

### Task 3: Render reaction bubbles in MessageBubble

**Files:**
- Modify: `src/components/whatsapp/MessageBubble.tsx:373-456` (main component)

- [ ] **Step 1: Add reaction parser and component**

Add this helper function before the main `MessageBubble` component (before line 373):

```typescript
// ---------------------------------------------------------------------------
// Reaction message display
// Format sync: webhook/route.ts builds this format — keep both in sync.
// ---------------------------------------------------------------------------

function parseReactionContent(content: string): { emoji: string; reference: string | null } {
  // Format: "Reaccionó {emoji} a: "{text}"" or "Reaccionó {emoji}"
  const match = content.match(/^Reaccionó\s(.+?)\sa:\s"(.+)"$/s);
  if (match) {
    return { emoji: match[1], reference: match[2] };
  }
  // Fallback: extract emoji after "Reaccionó "
  const simple = content.match(/^Reaccionó\s(.+)$/);
  return { emoji: simple?.[1] ?? content, reference: null };
}

function ReactionBubble({ message }: { message: WhatsAppMessage }) {
  const config = senderConfig[message.sender_type];
  const { emoji, reference } = parseReactionContent(message.content);

  return (
    <div className={cn("flex my-1", config.align)}>
      <div className={cn("px-3 py-2", config.bubble, config.roundedClass)}>
        <span className="text-2xl leading-none">{emoji}</span>
        {reference && (
          <p className="text-[0.65rem] text-[var(--text-muted)]/60 mt-1 max-w-[200px] truncate italic">
            {reference}
          </p>
        )}
        <div className="flex items-center justify-end mt-0.5">
          <span className="text-[0.6rem] text-[var(--text-muted)]/60">
            {formatTimestamp(message.created_at)}
          </span>
          {message.from_me && <DeliveryTicks status={message.status} />}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add early return in main component**

In the `MessageBubble` component, add this check right after the system message check (after line 388):

```typescript
  // Reaction messages
  if (message.message_type === "reactionMessage") {
    return <ReactionBubble message={message} />;
  }
```

- [ ] **Step 3: Verify build passes**

Run: `npx next build 2>&1 | head -20`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/whatsapp/MessageBubble.tsx
git commit -m "feat(whatsapp): render reaction messages with emoji and reference text"
```

---

### Task 4: Fix existing broken reaction messages in DB

**Files:**
- No file changes — database cleanup via script

- [ ] **Step 1: Check and fix existing `unknown` type messages that are actually reactions**

We identified 5 specific reaction messages stored as `message_type: "unknown"`. We verified via Evolution API that these are `reactionMessage` with 👍/👍🏻. Fix only those specific messages by their known `wa_message_id`, plus their parent conversations.

```bash
node -e "
require('dotenv').config({ path: '.env.local' });
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };

// Known reaction message IDs (verified via Evolution API findMessages)
const knownReactionIds = [
  'AC35E84F28BD482F06AB63796C5DDFDF', // ANYELA 👍
  'AC285E6F04D3E62884925088230B5929', // Gabi 👍🏻
  'AC7FDF6B0826E603D61C1D52A064B9E5',
  'ACAA7416A01DD264018F866C29157B07',
  'AC998760A500BD3012F21664FBE7A921',
];

async function fix() {
  for (const waId of knownReactionIds) {
    // Get the message and its conversation
    const res = await fetch(url + '/rest/v1/whatsapp_messages?wa_message_id=eq.' + waId + '&select=id,conversation_id', {
      headers
    });
    const [msg] = await res.json();
    if (!msg) { console.log('Not found:', waId); continue; }

    // Fix the message
    await fetch(url + '/rest/v1/whatsapp_messages?id=eq.' + msg.id, {
      method: 'PATCH', headers,
      body: JSON.stringify({ message_type: 'reactionMessage', content: 'Reaccionó 👍' })
    });
    console.log('Fixed message:', waId);

    // Fix the conversation last_message only if it still shows [media]
    await fetch(url + '/rest/v1/whatsapp_conversations?id=eq.' + msg.conversation_id + '&last_message=eq.%5Bmedia%5D', {
      method: 'PATCH', headers,
      body: JSON.stringify({ last_message: '👍' })
    });
  }
  console.log('Done');
}
fix().catch(e => console.error(e));
"
```

- [ ] **Step 2: Verify the fix**

Query the DB to confirm no more `unknown` empty messages:

```bash
node -e "
require('dotenv').config({ path: '.env.local' });
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
async function check() {
  const res = await fetch(url + '/rest/v1/whatsapp_messages?message_type=eq.unknown&content=eq.&select=id', {
    headers: { 'apikey': key, 'Authorization': 'Bearer ' + key }
  });
  const msgs = await res.json();
  console.log('Remaining unknown empty messages:', msgs.length);
}
check();
"
```

Expected: `Remaining unknown empty messages: 0`

---

### Task 5: Build verification and final commit

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: All tests pass.

- [ ] **Step 2: Run full build**

Run: `npx next build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Final commit with spec update**

```bash
git add docs/superpowers/specs/2026-03-18-whatsapp-reactions-design.md
git commit -m "docs: update reactions spec after review feedback"
```

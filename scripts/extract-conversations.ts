/**
 * Extract all WhatsApp conversations from Evolution API (Innovakine instance)
 * and structure them for analysis.
 *
 * Usage: npx tsx scripts/extract-conversations.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL?.replace(/\/$/, '') ?? '';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY ?? '';
const EVOLUTION_INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME ?? '';
const MESSAGES_PER_PAGE = 50;
const DELAY_MS = 150;
const OUTPUT_DIR = path.resolve(__dirname, 'output');

// Message types to skip entirely
const SKIP_MESSAGE_TYPES = new Set([
  'protocolMessage',
  'reactionMessage',
  'stickerMessage',
  'ephemeralMessage',
  'viewOnceMessageV2',
  'editedMessage',
  'pollCreationMessage',
  'pollUpdateMessage',
]);

// Media message types
const MEDIA_TYPES: Record<string, string> = {
  imageMessage: 'imagen',
  videoMessage: 'video',
  audioMessage: 'audio',
  documentMessage: 'documento',
  documentWithCaptionMessage: 'documento',
  ptvMessage: 'video-nota',
};

// Merge window: consecutive messages from same sender within this window get merged
const MERGE_WINDOW_SECONDS = 300; // 5 minutes

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EvolutionChat {
  id: string;
  remoteJid: string;
  pushName: string | null;
  updatedAt: string;
}

interface EvolutionMessageKey {
  id: string;
  fromMe: boolean;
  remoteJid: string;
}

interface EvolutionMessage {
  id: string;
  key: EvolutionMessageKey;
  pushName: string | null;
  messageType: string;
  message: Record<string, unknown>;
  messageTimestamp: number;
  source: string;
}

interface FindMessagesResponse {
  messages: {
    total: number;
    pages: number;
    currentPage: number;
    records: EvolutionMessage[];
  };
}

interface MessageBlock {
  sender: 'client' | 'admin';
  text: string;
  timestamp: number;
  timestamp_end: number;
  message_types: string[];
  raw_count: number;
}

interface QAPair {
  question: string;
  answer: string;
  q_timestamp: number;
  a_timestamp: number;
  response_time_seconds: number;
}

interface ConversationMetrics {
  avg_response_time_seconds: number | null;
  median_response_time_seconds: number | null;
  client_messages: number;
  admin_messages: number;
  has_media: boolean;
  media_types: string[];
  first_message_hour: number;
  conversation_duration_minutes: number;
}

interface Conversation {
  jid: string;
  contact_name: string;
  phone: string;
  message_count: number;
  first_message: string;
  last_message: string;
  blocks: MessageBlock[];
  qa_pairs: QAPair[];
  metrics: ConversationMetrics;
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

async function evolutionFetch<T>(urlPath: string, body: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`${EVOLUTION_API_URL}${urlPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: EVOLUTION_API_KEY,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    throw new Error(`Evolution API ${urlPath} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Text extraction
// ---------------------------------------------------------------------------

function extractText(message: Record<string, unknown> | null | undefined, messageType: string): string {
  if (!message) return '';
  // Direct conversation text
  if (typeof message.conversation === 'string' && message.conversation) {
    return message.conversation;
  }

  // Extended text message
  const extended = message.extendedTextMessage;
  if (extended && typeof extended === 'object') {
    const text = (extended as Record<string, unknown>).text;
    if (typeof text === 'string' && text) return text;
  }

  // Media with caption
  for (const [mediaKey, label] of Object.entries(MEDIA_TYPES)) {
    const mediaMsg = message[mediaKey];
    if (mediaMsg && typeof mediaMsg === 'object') {
      const caption = (mediaMsg as Record<string, unknown>).caption;
      if (typeof caption === 'string' && caption) {
        return `[${label}] ${caption}`;
      }
      // Media without caption
      if (messageType === mediaKey || messageType.includes(mediaKey.replace('Message', ''))) {
        return `[${label}]`;
      }
    }
  }

  // Check if it's a known media type by messageType
  for (const [mediaKey, label] of Object.entries(MEDIA_TYPES)) {
    if (messageType === mediaKey) {
      return `[${label}]`;
    }
  }

  return '';
}

// ---------------------------------------------------------------------------
// JID to phone
// ---------------------------------------------------------------------------

function jidToPhone(jid: string): string {
  // Handle LID format (newer WhatsApp)
  if (jid.includes('@lid')) {
    return jid.split('@')[0];
  }
  // Standard format: 56930186496@s.whatsapp.net
  return jid.split('@')[0];
}

// ---------------------------------------------------------------------------
// Metrics helpers
// ---------------------------------------------------------------------------

function median(arr: number[]): number | null {
  if (arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== WhatsApp Conversation Extractor ===\n');
  console.log(`API: ${EVOLUTION_API_URL}`);
  console.log(`Instance: ${EVOLUTION_INSTANCE_NAME}\n`);

  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE_NAME) {
    console.error('Missing environment variables. Check .env.local');
    process.exit(1);
  }

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Step 1: Fetch all chats
  console.log('Fetching chats...');
  const allChats = await evolutionFetch<EvolutionChat[]>(
    '/chat/findChats/' + EVOLUTION_INSTANCE_NAME
  );
  console.log(`Total chats: ${allChats.length}`);

  // Filter: only individual chats (not groups)
  const individualChats = allChats.filter(c => !c.remoteJid.includes('@g.us'));
  console.log(`Individual chats: ${individualChats.length}\n`);

  // Step 2: Fetch messages for each chat
  const conversations: Conversation[] = [];
  let totalMessages = 0;
  let skippedEmpty = 0;

  for (let i = 0; i < individualChats.length; i++) {
    const chat = individualChats[i];
    const contactName = chat.pushName ?? 'Sin nombre';
    process.stdout.write(`[${i + 1}/${individualChats.length}] ${contactName.substring(0, 25).padEnd(25)} `);

    try {
      // Paginate all messages for this chat
      let allRecords: EvolutionMessage[] = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const response = await evolutionFetch<FindMessagesResponse>(
          '/chat/findMessages/' + EVOLUTION_INSTANCE_NAME,
          {
            where: { key: { remoteJid: chat.remoteJid } },
            limit: MESSAGES_PER_PAGE,
            page,
          }
        );
        allRecords = allRecords.concat(response.messages.records);
        totalPages = response.messages.pages;
        page++;
      }

      if (allRecords.length === 0) {
        skippedEmpty++;
        console.log('-> empty');
        continue;
      }

      // Filter out skippable message types
      const validMessages = allRecords.filter(m => !SKIP_MESSAGE_TYPES.has(m.messageType));

      if (validMessages.length < 2) {
        skippedEmpty++;
        console.log(`-> ${allRecords.length} msgs (${validMessages.length} valid, skipped)`);
        continue;
      }

      // Sort chronologically
      validMessages.sort((a, b) => a.messageTimestamp - b.messageTimestamp);

      // Build message blocks (merge consecutive same-sender)
      const blocks: MessageBlock[] = [];
      const mediaTypesFound: string[] = [];

      for (const msg of validMessages) {
        const text = extractText(msg.message, msg.messageType).trim();
        if (!text) continue;

        const sender: 'client' | 'admin' = msg.key.fromMe ? 'admin' : 'client';

        // Track media
        if (MEDIA_TYPES[msg.messageType]) {
          const mt = MEDIA_TYPES[msg.messageType];
          if (!mediaTypesFound.includes(mt)) mediaTypesFound.push(mt);
        }

        const lastBlock = blocks[blocks.length - 1];
        const timeDiff = lastBlock
          ? msg.messageTimestamp - lastBlock.timestamp_end
          : Infinity;

        if (lastBlock && lastBlock.sender === sender && timeDiff <= MERGE_WINDOW_SECONDS) {
          // Merge into existing block
          lastBlock.text += '\n' + text;
          lastBlock.timestamp_end = msg.messageTimestamp;
          lastBlock.raw_count++;
          if (!lastBlock.message_types.includes(msg.messageType)) {
            lastBlock.message_types.push(msg.messageType);
          }
        } else {
          // New block
          blocks.push({
            sender,
            text,
            timestamp: msg.messageTimestamp,
            timestamp_end: msg.messageTimestamp,
            message_types: [msg.messageType],
            raw_count: 1,
          });
        }
      }

      if (blocks.length < 2) {
        skippedEmpty++;
        console.log(`-> ${validMessages.length} msgs, ${blocks.length} blocks (skipped)`);
        continue;
      }

      // Build Q&A pairs (client -> admin)
      const qaPairs: QAPair[] = [];
      const responseTimes: number[] = [];

      for (let j = 0; j < blocks.length - 1; j++) {
        const clientBlock = blocks[j];
        const adminBlock = blocks[j + 1];

        if (clientBlock.sender !== 'client' || adminBlock.sender !== 'admin') continue;

        // Skip noise
        if (clientBlock.text.length < 2 || adminBlock.text.length < 2) continue;

        const responseTime = adminBlock.timestamp - clientBlock.timestamp_end;
        responseTimes.push(responseTime);

        qaPairs.push({
          question: clientBlock.text,
          answer: adminBlock.text,
          q_timestamp: clientBlock.timestamp,
          a_timestamp: adminBlock.timestamp,
          response_time_seconds: responseTime,
        });
      }

      // Compute metrics
      const clientMsgs = blocks.filter(b => b.sender === 'client').reduce((s, b) => s + b.raw_count, 0);
      const adminMsgs = blocks.filter(b => b.sender === 'admin').reduce((s, b) => s + b.raw_count, 0);
      const firstTs = validMessages[0].messageTimestamp;
      const lastTs = validMessages[validMessages.length - 1].messageTimestamp;
      const firstHour = new Date(firstTs * 1000).getHours();
      const durationMin = Math.round((lastTs - firstTs) / 60);

      const conversation: Conversation = {
        jid: chat.remoteJid,
        contact_name: contactName,
        phone: jidToPhone(chat.remoteJid),
        message_count: validMessages.length,
        first_message: new Date(firstTs * 1000).toISOString(),
        last_message: new Date(lastTs * 1000).toISOString(),
        blocks,
        qa_pairs: qaPairs,
        metrics: {
          avg_response_time_seconds: responseTimes.length > 0
            ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
            : null,
          median_response_time_seconds: median(responseTimes),
          client_messages: clientMsgs,
          admin_messages: adminMsgs,
          has_media: mediaTypesFound.length > 0,
          media_types: mediaTypesFound,
          first_message_hour: firstHour,
          conversation_duration_minutes: durationMin,
        },
      };

      conversations.push(conversation);
      totalMessages += validMessages.length;

      console.log(`-> ${validMessages.length} msgs, ${blocks.length} blocks, ${qaPairs.length} Q&A`);
    } catch (err) {
      console.log(`-> ERROR: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  // Step 3: Sort conversations by message count (most active first)
  conversations.sort((a, b) => b.message_count - a.message_count);

  // Step 4: Compute global metrics
  const allResponseTimes = conversations
    .flatMap(c => c.qa_pairs.map(q => q.response_time_seconds));

  const hourDistribution: Record<number, number> = {};
  for (let h = 0; h < 24; h++) hourDistribution[h] = 0;
  conversations.forEach(c => {
    c.blocks.forEach(b => {
      const hour = new Date(b.timestamp * 1000).getHours();
      hourDistribution[hour] = (hourDistribution[hour] || 0) + b.raw_count;
    });
  });

  const globalMetrics = {
    total_conversations: conversations.length,
    total_messages: totalMessages,
    skipped_empty_chats: skippedEmpty,
    total_qa_pairs: conversations.reduce((s, c) => s + c.qa_pairs.length, 0),
    avg_response_time_seconds: allResponseTimes.length > 0
      ? Math.round(allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length)
      : null,
    median_response_time_seconds: median(allResponseTimes),
    avg_messages_per_conversation: conversations.length > 0
      ? Math.round(totalMessages / conversations.length)
      : 0,
    hour_distribution: hourDistribution,
    busiest_hours: Object.entries(hourDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([h, count]) => ({ hour: parseInt(h), messages: count })),
    date_range: {
      from: conversations.length > 0
        ? conversations.reduce((min, c) => c.first_message < min ? c.first_message : min, conversations[0].first_message)
        : null,
      to: conversations.length > 0
        ? conversations.reduce((max, c) => c.last_message > max ? c.last_message : max, conversations[0].last_message)
        : null,
    },
  };

  // Step 5: Save outputs
  const conversationsOutput = {
    metadata: {
      extraction_date: new Date().toISOString(),
      instance: EVOLUTION_INSTANCE_NAME,
      ...globalMetrics,
    },
    conversations,
  };

  const conversationsPath = path.join(OUTPUT_DIR, 'conversations.json');
  fs.writeFileSync(conversationsPath, JSON.stringify(conversationsOutput, null, 2), 'utf-8');

  const metricsPath = path.join(OUTPUT_DIR, 'metrics-raw.json');
  fs.writeFileSync(metricsPath, JSON.stringify(globalMetrics, null, 2), 'utf-8');

  // Summary
  console.log('\n=== EXTRACTION COMPLETE ===');
  console.log(`Conversations with data: ${conversations.length}`);
  console.log(`Empty/skipped chats: ${skippedEmpty}`);
  console.log(`Total messages processed: ${totalMessages}`);
  console.log(`Total Q&A pairs: ${globalMetrics.total_qa_pairs}`);
  console.log(`Avg response time: ${globalMetrics.avg_response_time_seconds}s`);
  console.log(`Median response time: ${globalMetrics.median_response_time_seconds}s`);
  console.log(`\nOutput saved to: ${OUTPUT_DIR}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

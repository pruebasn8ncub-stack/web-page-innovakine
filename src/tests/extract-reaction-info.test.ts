import { describe, it, expect, vi } from 'vitest';

// Mock supabase-admin to avoid env var requirements at module load time
vi.mock('@/lib/supabase-admin', () => ({ supabaseAdmin: {} }));

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

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/db/auth';
import { db } from '@/lib/db/db';
import { runAgent, parseReceipt } from '@/lib/ai/router';
import type { ChatMessage, ProviderMode } from '@/lib/ai/types';

// Max messages to send as context (keeps token usage reasonable)
const MAX_HISTORY = 12;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user name for system prompt
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });
    const userName = user?.name ?? 'User';

    const body = await req.json();
    const {
      messages,
      provider = 'auto',
      image,
      action,
    }: {
      messages: ChatMessage[];
      provider?: ProviderMode;
      image?: string;
      action?: 'parse_receipt' | 'chat';
    } = body;

    // ── Receipt parsing (vision-only, no agentic loop needed) ──
    if (action === 'parse_receipt' && image) {
      const receiptData = await parseReceipt(image);
      return NextResponse.json({ receiptData, provider: 'gemini' });
    }

    // ── Regular chat / agentic ──
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages array required' }, { status: 400 });
    }

    // Trim history to keep token usage under control
    const trimmedHistory = messages.slice(-MAX_HISTORY) as ChatMessage[];

    const response = await runAgent(trimmedHistory, userId, userName, provider, image);

    return NextResponse.json(response);
  } catch (err) {
    console.error('[/api/ai/chat]', err);
    return NextResponse.json(
      { error: 'Internal server error', content: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
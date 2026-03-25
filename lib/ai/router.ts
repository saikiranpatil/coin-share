import type { ChatMessage, ProviderMode, ProviderType, AgentResponse } from './types';
import { runGroqAgent } from './groq';
import { runGeminiAgent, parseReceipt } from './gemini';

// ─── Provider Selection ───────────────────────────────────────────────────────

export function resolveProvider(mode: ProviderMode, hasImage: boolean): ProviderType {
  if (mode === 'groq') return 'groq';
  if (mode === 'gemini') return 'gemini';
  // auto: Gemini for vision tasks, Groq for everything else (faster)
  return hasImage ? 'gemini' : 'groq';
}

// ─── System Prompt Builder ────────────────────────────────────────────────────

function buildSystemPrompt(userName: string): string {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `You are a smart financial assistant for CoinShare, an expense-splitting app.
The current user's name is ${userName}. Today is ${today}.

You can help users:
- Check their balances across groups
- View recent transactions
- Add new expenses (call create_expense)
- Settle debts with other members (call settle_debt)
- Find other users (call search_users)
- Browse their groups and members

Guidelines:
- Always use tools to fetch real data before answering balance/transaction questions
- For create_expense: first call list_groups and search_users if you need IDs, then create
- Format amounts with ₹ symbol (Indian Rupees)
- Be concise and direct — this is a chat interface
- When an expense is created or settled, confirm what was done
- If you cannot find a group or user, say so clearly
- Never make up balances or transaction data — always fetch from tools`;
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export async function runAgent(
  history: ChatMessage[],
  userId: string,
  userName: string,
  providerMode: ProviderMode = 'auto',
  image?: string,
): Promise<AgentResponse> {
  const provider = resolveProvider(providerMode, !!image);
  const systemPrompt = buildSystemPrompt(userName);

  try {
    const result =
      provider === 'groq'
        ? await runGroqAgent(systemPrompt, history, userId)
        : await runGeminiAgent(systemPrompt, history, userId, image);

    return { content: result.content, provider, toolsUsed: result.toolsUsed };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[AI Router] ${provider} failed:`, msg);

    // Auto-fallback: if Groq fails, try Gemini (and vice versa)
    if (providerMode === 'auto') {
      const fallback: ProviderType = provider === 'groq' ? 'gemini' : 'groq';
      console.log(`[AI Router] Falling back to ${fallback}`);
      try {
        const result =
          fallback === 'groq'
            ? await runGroqAgent(systemPrompt, history, userId)
            : await runGeminiAgent(systemPrompt, history, userId, image);
        return { content: result.content, provider: fallback, toolsUsed: result.toolsUsed };
      } catch (fallbackErr) {
        console.error(`[AI Router] Fallback ${fallback} also failed:`, fallbackErr);
      }
    }

    return {
      content: 'Sorry, I ran into an error. Please try again in a moment.',
      provider,
      toolsUsed: [],
      error: msg,
    };
  }
}

export { parseReceipt };
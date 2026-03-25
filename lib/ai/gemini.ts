import type { ChatMessage, ReceiptData } from './types';
import { toGeminiTools, executeTool } from './tools';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_FLASH = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';
const MAX_ITERATIONS = 5;

function geminiUrl(model: string) {
  return `${GEMINI_BASE}/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
}

function toGeminiHistory(history: ChatMessage[]) {
  return history.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}

// ─── Agentic loop ─────────────────────────────────────────────────────────────

export async function runGeminiAgent(
  systemPrompt: string,
  history: ChatMessage[],
  userId: string,
  image?: string, // base64 data URL
): Promise<{ content: string; toolsUsed: string[] }> {
  const toolsUsed: string[] = [];
  const geminiTools = toGeminiTools();

  // Build mutable contents array in Gemini format
  const contents: any[] = toGeminiHistory(history);

  // Attach image to last user turn if provided
  if (image && contents.length > 0) {
    const lastTurn = contents[contents.length - 1];
    if (lastTurn.role === 'user') {
      const base64 = image.includes(',') ? image.split(',')[1] : image;
      const mime = image.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
      lastTurn.parts.push({ inlineData: { mimeType: mime, data: base64 } });
    }
  }

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const body: any = {
      contents,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      tools: geminiTools,
      generationConfig: { maxOutputTokens: 1024, temperature: 0.3 },
    };

    const res = await fetch(geminiUrl(GEMINI_FLASH), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    if (!candidate) throw new Error('No candidate from Gemini');

    const parts: any[] = candidate.content?.parts ?? [];
    const textPart = parts.find((p: any) => p.text);
    const fnCallParts = parts.filter((p: any) => p.functionCall);

    // No function calls → final text answer
    if (fnCallParts.length === 0) {
      return { content: textPart?.text ?? 'No response generated.', toolsUsed };
    }

    // Add model turn (with function calls)
    contents.push({ role: 'model', parts });

    // Execute tools, collect functionResponse parts
    const responseParts: any[] = [];
    for (const part of fnCallParts) {
      const { name, args } = part.functionCall;
      toolsUsed.push(name);
      const result = await executeTool(name, args ?? {}, userId);
      responseParts.push({
        functionResponse: { name, response: result },
      });
    }

    // Add user turn with function responses
    contents.push({ role: 'user', parts: responseParts });
  }

  return {
    content: 'I reached the maximum number of steps. Please try a simpler request.',
    toolsUsed,
  };
}

// ─── Receipt Vision Parser ────────────────────────────────────────────────────

export async function parseReceipt(imageBase64: string): Promise<ReceiptData> {
  const base64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
  const mime = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';

  const body = {
    contents: [
      {
        parts: [
          { inlineData: { mimeType: mime, data: base64 } },
          {
            text: `Analyze this receipt image and extract expense details. 
Return ONLY a valid JSON object with exactly these fields (no markdown, no backticks):
{
  "description": "brief merchant or item description",
  "amount": <total amount as a number, no currency symbols>,
  "merchant": "store or restaurant name or null",
  "date": "YYYY-MM-DD format or null",
  "items": [{"name": "item name", "price": <number>}]
}
If you cannot determine a value, use null. The amount must be a number.`,
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  };

  const res = await fetch(geminiUrl(GEMINI_FLASH), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return { description: null, amount: null, merchant: null, date: null, items: [], error: 'Receipt parsing failed' };
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';

  try {
    // Strip potential markdown fences
    const clean = text.replace(/```json\n?|```\n?/g, '').trim();
    return JSON.parse(clean) as ReceiptData;
  } catch {
    return { description: null, amount: null, merchant: null, date: null, items: [], error: 'Could not parse receipt data' };
  }
}
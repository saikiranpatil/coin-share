import type { ChatMessage } from './types';
import { toGroqTools, executeTool } from './tools';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
// Configurable via env; fallback to proven tool-calling model
const GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';
const MAX_ITERATIONS = 5;

export async function runGroqAgent(
  systemPrompt: string,
  history: ChatMessage[],
  userId: string,
): Promise<{ content: string; toolsUsed: string[] }> {
  const toolsUsed: string[] = [];

  // Build initial messages array in OpenAI format
  // We use `any[]` because tool-role messages don't fit the ChatMessage shape
  const messages: any[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
  ];

  const groqTools = toGroqTools();

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        tools: groqTools,
        tool_choice: 'auto',
        max_tokens: 1024,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    const choice = data.choices?.[0];
    if (!choice) throw new Error('No response from Groq');

    const assistantMsg = choice.message;

    // No tool calls → final answer
    if (!assistantMsg.tool_calls || assistantMsg.tool_calls.length === 0) {
      return { content: assistantMsg.content ?? 'No response generated.', toolsUsed };
    }

    // Add assistant message (with tool_calls) to history
    messages.push(assistantMsg);

    // Execute each tool call and add results
    for (const tc of assistantMsg.tool_calls) {
      const fnName: string = tc.function.name;
      let fnArgs: Record<string, unknown> = {};
      try {
        fnArgs = JSON.parse(tc.function.arguments ?? '{}');
      } catch {
        fnArgs = {};
      }

      toolsUsed.push(fnName);
      const result = await executeTool(fnName, fnArgs, userId);

      messages.push({
        role: 'tool',
        tool_call_id: tc.id,
        content: JSON.stringify(result),
      });
    }
    // Loop: next iteration sends updated messages to get final response
  }

  return {
    content: 'I reached the maximum number of steps. Please try a simpler request.',
    toolsUsed,
  };
}
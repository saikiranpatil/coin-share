export type ProviderType = 'groq' | 'gemini';
export type ProviderMode = 'auto' | ProviderType;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AgentResponse {
  content: string;
  provider: ProviderType;
  toolsUsed: string[];
  error?: string;
}

export interface ReceiptData {
  description: string | null;
  amount: number | null;
  merchant: string | null;
  date: string | null;
  items: { name: string; price: number }[];
  error?: string;
}

// Neutral tool definition format – converted per provider
export interface ToolParam {
  type: 'string' | 'number' | 'integer' | 'boolean';
  description: string;
  enum?: string[];
}

export interface ToolDef {
  name: string;
  description: string;
  params: Record<string, ToolParam>;
  required: string[];
}
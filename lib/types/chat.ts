type Role = 'user' | 'assistant';

interface Message {
    id: string;
    role: Role;
    content: string;
    provider?: 'groq' | 'gemini';
    toolsUsed?: string[];
    image?: string;
    isReceipt?: boolean;
    receiptData?: Record<string, unknown>;
    isError?: boolean;
}
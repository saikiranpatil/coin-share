'use client';

import { useState, useRef, useEffect, useCallback, useTransition } from 'react';
import { Bot, X, Send, ChevronDown, Loader2, Sparkles, Receipt, RotateCcw } from 'lucide-react';
import { cn, uid } from '@/lib/utils';
import type { ProviderMode } from '@/lib/ai/types';
import { PROVIDER_LABELS } from '@/lib/constants';
import MessageBubble from './MessageBubble';


function TypingDots() {
    return (
        <div className="flex gap-1 items-center px-3 py-2">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    );
}

export default function AIChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: uid(),
            role: 'assistant',
            content: "Hi! I'm your CoinShare assistant. I can help you check balances, add expenses, settle debts, and more. Try asking me something like \"What do I owe?\" or upload a receipt 📸",
        },
    ]);
    const [input, setInput] = useState('');
    const [provider, setProvider] = useState<ProviderMode>('auto');
    const [showProviderMenu, setShowProviderMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pendingImage, setPendingImage] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Auto-scroll on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Auto-resize textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    };

    const handleImageFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setPendingImage(result);
        };
        reader.readAsDataURL(file);
    }, []);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageFile(file);
        e.target.value = ''; // reset so same file can be re-selected
    };

    const sendMessage = useCallback(async () => {
        const text = input.trim();
        if (!text && !pendingImage) return;
        if (loading) return;

        const userMsg: Message = {
            id: uid(),
            role: 'user',
            content: text || (pendingImage ? 'Here is a receipt 📄' : ''),
            image: pendingImage ?? undefined,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setPendingImage(null);
        if (inputRef.current) inputRef.current.style.height = 'auto';

        setLoading(true);

        startTransition(async () => {
            try {
                // Build history for the API (exclude the welcome message)
                const allMsgs = [...messages, userMsg];
                const history = allMsgs
                    .filter((m) => !m.isReceipt) // don't send receipt meta-messages
                    .map((m) => ({ role: m.role, content: m.content }));

                let url = '/api/ai/chat';
                let body: Record<string, unknown> = { messages: history, provider };

                // If there's an image, first parse the receipt
                if (userMsg.image) {
                    // Parse receipt first
                    const parseRes = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'parse_receipt',
                            image: userMsg.image,
                            messages: history,
                            provider: 'gemini', // always Gemini for vision
                        }),
                    });
                    const parseData = await parseRes.json();

                    if (parseData.receiptData && !parseData.receiptData.error) {
                        const rd = parseData.receiptData;
                        // Add receipt info message
                        const receiptMsg: Message = {
                            id: uid(),
                            role: 'assistant',
                            content: `I can see a receipt${rd.merchant ? ` from **${rd.merchant}**` : ''}${rd.amount ? ` for ₹${rd.amount}` : ''}. ${rd.description ? `It looks like: ${rd.description}.` : ''} Which group should I add this expense to? I'll split it equally.`,
                            provider: 'gemini',
                            receiptData: rd,
                            toolsUsed: [],
                        };
                        setMessages((prev) => [...prev, receiptMsg]);
                        setLoading(false);
                        return;
                    }

                    // Receipt parse failed — fall through to normal chat with image
                    body = { messages: history, provider, image: userMsg.image };
                }

                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });

                const data = await res.json();

                const assistantMsg: Message = {
                    id: uid(),
                    role: 'assistant',
                    content: data.content ?? 'Sorry, something went wrong.',
                    provider: data.provider,
                    toolsUsed: data.toolsUsed ?? [],
                    isError: !!data.error && !data.content,
                };

                setMessages((prev) => [...prev, assistantMsg]);
            } catch {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: uid(),
                        role: 'assistant',
                        content: 'Network error. Please check your connection and try again.',
                        isError: true,
                    },
                ]);
            } finally {
                setLoading(false);
            }
        });
    }, [input, pendingImage, loading, messages, provider]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: uid(),
                role: 'assistant',
                content: "Chat cleared! How can I help you?",
            },
        ]);
    };

    // ── Render ──────────────────────────────────────────────────────────────────

    return (
        <>
            {/* ── Floating Action Button ── */}
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Open AI assistant"
                className={cn(
                    'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl',
                    'flex items-center justify-center transition-all duration-300',
                    'bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600',
                    'hover:scale-110 hover:shadow-indigo-500/40',
                    open && 'rotate-90 scale-95',
                )}
            >
                {open ? (
                    <X className="w-5 h-5 text-white" />
                ) : (
                    <Sparkles className="w-5 h-5 text-white" />
                )}
                {/* Pulse ring when closed */}
                {!open && (
                    <span className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-20" />
                )}
            </button>

            {/* ── Chat Panel ── */}
            <div
                className={cn(
                    'fixed z-40 transition-all duration-300 ease-out',
                    // Desktop: bottom-right panel
                    'bottom-24 right-6 w-[380px]',
                    // Mobile: full screen
                    'max-sm:inset-0 max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:rounded-none',
                    // Visibility
                    open
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-4 pointer-events-none',
                    // Shape
                    'rounded-2xl overflow-hidden',
                    // Dark glass background
                    'bg-[#0f0f17] border border-white/10 shadow-2xl shadow-black/60',
                    // Height
                    'flex flex-col h-[600px] max-sm:h-screen',
                )}
            >
                {/* ── Header ── */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-white/3 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">CoinShare AI</p>
                        <p className="text-[11px] text-white/40">Expense assistant</p>
                    </div>

                    {/* Provider selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProviderMenu((v) => !v)}
                            className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors px-2 py-1 rounded-lg hover:bg-white/5 border border-white/10"
                        >
                            <span
                                className={cn(
                                    'w-1.5 h-1.5 rounded-full',
                                    provider === 'groq'
                                        ? 'bg-emerald-400'
                                        : provider === 'gemini'
                                            ? 'bg-blue-400'
                                            : 'bg-amber-400',
                                )}
                            />
                            {PROVIDER_LABELS[provider]}
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {showProviderMenu && (
                            <div className="absolute right-0 top-full mt-1 w-32 rounded-xl border border-white/10 bg-[#1a1a2e] shadow-xl z-10 overflow-hidden">
                                {(['auto', 'groq', 'gemini'] as ProviderMode[]).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => {
                                            setProvider(p);
                                            setShowProviderMenu(false);
                                        }}
                                        className={cn(
                                            'w-full text-left px-3 py-2 text-xs transition-colors',
                                            provider === p
                                                ? 'bg-indigo-500/20 text-indigo-300'
                                                : 'text-white/60 hover:bg-white/5 hover:text-white',
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    'w-1.5 h-1.5 rounded-full',
                                                    p === 'groq'
                                                        ? 'bg-emerald-400'
                                                        : p === 'gemini'
                                                            ? 'bg-blue-400'
                                                            : 'bg-amber-400',
                                                )}
                                            />
                                            {PROVIDER_LABELS[p]}
                                            {p === 'auto' && (
                                                <span className="text-white/30 text-[9px]">(smart)</span>
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear chat */}
                    <button
                        onClick={clearChat}
                        className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
                        title="Clear chat"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} />
                    ))}

                    {loading && (
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Bot className="w-3 h-3 text-white" />
                            </div>
                            <div className="bg-white/8 border border-white/10 rounded-2xl rounded-bl-sm">
                                <TypingDots />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* ── Pending image preview ── */}
                {pendingImage && (
                    <div className="px-4 pb-2 flex-shrink-0">
                        <div className="relative inline-block">
                            <img
                                src={pendingImage}
                                alt="Receipt to send"
                                className="h-16 w-auto rounded-lg border border-white/20 object-cover"
                            />
                            <button
                                onClick={() => setPendingImage(null)}
                                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
                            >
                                <X className="w-2.5 h-2.5" />
                            </button>
                            <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1 rounded">
                                Receipt
                            </span>
                        </div>
                    </div>
                )}

                {/* ── Input area ── */}
                <div className="flex-shrink-0 border-t border-white/8 bg-white/2 px-3 py-3">
                    <div className="flex items-end gap-2">
                        {/* Receipt upload button */}
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="flex-shrink-0 p-2 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/8 transition-colors mb-0.5"
                            title="Upload receipt"
                        >
                            <Receipt className="w-4.5 h-4.5" />
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onFileChange}
                        />

                        {/* Text input */}
                        <textarea
                            ref={inputRef}
                            rows={1}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={onKeyDown}
                            placeholder="Ask anything or upload a receipt…"
                            disabled={loading}
                            className={cn(
                                'flex-1 resize-none rounded-xl px-3 py-2 text-sm',
                                'bg-white/6 border border-white/12 placeholder:text-white/30',
                                'focus:outline-none focus:border-indigo-500/50 focus:bg-white/8',
                                'transition-colors disabled:opacity-40 max-h-[120px] overflow-y-auto',
                                'leading-relaxed',
                            )}
                        />

                        {/* Send button */}
                        <button
                            onClick={sendMessage}
                            disabled={loading || (!input.trim() && !pendingImage)}
                            className={cn(
                                'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all mb-0.5',
                                loading || (!input.trim() && !pendingImage)
                                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                    : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30',
                            )}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-white/20 mt-2">
                        Auto-routes between Groq &amp; Gemini · Shift+Enter for new line
                    </p>
                </div>
            </div>

            {/* Backdrop (mobile) */}
            {open && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm sm:hidden"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
}
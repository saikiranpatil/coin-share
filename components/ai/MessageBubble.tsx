import { PROVIDER_COLORS, TOOL_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import React from 'react'

function ToolChip({ tool }: { tool: string }) {
    return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {TOOL_LABELS[tool] ?? tool}
        </span>
    );
}

function MessageBubble({ msg }: { msg: Message }) {
    const isUser = msg.role === 'user';

    return (
        <div className={cn('flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
            {/* Tool indicators (assistant only) */}
            {!isUser && msg.toolsUsed && msg.toolsUsed.length > 0 && (
                <div className="flex flex-wrap gap-1 max-w-[85%]">
                    {Array.from(new Set(msg.toolsUsed)).map((t) => (
                        <ToolChip key={t} tool={t} />
                    ))}
                </div>
            )}

            {/* Image preview (user uploaded) */}
            {msg.image && (
                <div className="max-w-[70%] rounded-xl overflow-hidden border border-white/10">
                    <img src={msg.image} alt="Uploaded receipt" className="w-full object-cover max-h-40" />
                </div>
            )}

            {/* Bubble */}
            <div
                className={cn(
                    'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                    isUser
                        ? 'bg-indigo-500 text-white rounded-br-sm'
                        : msg.isError
                            ? 'bg-red-500/15 border border-red-500/30 text-red-300 rounded-bl-sm'
                            : 'bg-white/8 border border-white/10 text-white/90 rounded-bl-sm',
                )}
            >
                {/* Whitespace-preserve for multi-line responses */}
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>

            {/* Receipt parsed data preview */}
            {msg.receiptData && (
                <div className="max-w-[85%] rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 space-y-1">
                    <p className="font-semibold text-amber-300">📄 Receipt parsed</p>
                    {(msg.receiptData.merchant as string) && (
                        <p>🏪 {msg.receiptData.merchant as string}</p>
                    )}
                    {(msg.receiptData.amount as number) && (
                        <p>💰 ₹{msg.receiptData.amount as number}</p>
                    )}
                    {(msg.receiptData.description as string) && (
                        <p>📝 {msg.receiptData.description as string}</p>
                    )}
                </div>
            )}

            {/* Provider badge (assistant only) */}
            {!isUser && msg.provider && (
                <span className={cn('text-[10px] px-1', PROVIDER_COLORS[msg.provider])}>
                    via {msg.provider}
                </span>
            )}
        </div>
    );
}

export default MessageBubble
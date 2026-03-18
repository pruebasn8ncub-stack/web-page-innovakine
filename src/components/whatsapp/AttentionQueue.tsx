"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import type { WhatsAppConversation } from "@/types/whatsapp";

interface AttentionQueueProps {
    conversations: WhatsAppConversation[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onClose: () => void;
}

function formatWaitTime(since: string | null): string {
    if (!since) return "";
    const diff = Date.now() - new Date(since).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "ahora";
    if (mins < 60) return `${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
}

function getUrgencyColor(since: string | null): string {
    if (!since) return "text-slate-400";
    const mins = (Date.now() - new Date(since).getTime()) / 60000;
    if (mins < 5) return "text-emerald-500";
    if (mins < 15) return "text-amber-500";
    return "text-red-500";
}

function extractSubject(reason: string | null): string {
    if (!reason) return "Solicitud de atención";
    const match = reason.match(/Asunto:\s*(.+?)(?:\n|$)/i);
    if (match) return match[1].trim();
    return reason.length > 60 ? reason.substring(0, 57) + "..." : reason;
}

export default function AttentionQueue({
    conversations,
    selectedId,
    onSelect,
    onClose,
}: AttentionQueueProps) {
    const pending = conversations
        .filter((c) => c.needs_human && c.needs_human_status !== "resolved")
        .sort((a, b) => {
            const aTime = a.needs_human_since ? new Date(a.needs_human_since).getTime() : 0;
            const bTime = b.needs_human_since ? new Date(b.needs_human_since).getTime() : 0;
            return aTime - bTime;
        });

    const resolvedToday = conversations.filter((c) => {
        if (c.needs_human_status !== "resolved" || !c.needs_human_resolved_at) return false;
        const resolved = new Date(c.needs_human_resolved_at);
        const now = new Date();
        return resolved.getDate() === now.getDate() &&
            resolved.getMonth() === now.getMonth() &&
            resolved.getFullYear() === now.getFullYear();
    });

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Queue header */}
            <div className="px-5 py-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="font-semibold text-sm text-navy">
                            Cola de Atencion
                        </span>
                        {pending.length > 0 && (
                            <span className="min-w-[20px] h-5 rounded-full bg-amber-500 text-white text-[0.6rem] font-bold flex items-center justify-center px-1.5">
                                {pending.length}
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[0.68rem] text-[#5e7a9a] hover:text-navy transition-colors"
                    >
                        Ver todas
                    </button>
                </div>
            </div>

            {/* Queue items */}
            <div className="flex-1 overflow-y-auto">
                {pending.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-300 mb-3" />
                        <p className="text-sm font-medium text-navy">Todo al dia</p>
                        <p className="text-xs text-[#5e7a9a] mt-1">
                            No hay solicitudes pendientes
                        </p>
                    </div>
                ) : (
                    pending.map((conv) => {
                        const waitTime = formatWaitTime(conv.needs_human_since);
                        const urgencyColor = getUrgencyColor(conv.needs_human_since);
                        const subject = extractSubject(conv.needs_human_reason);
                        const isSelected = selectedId === conv.id;

                        return (
                            <button
                                key={conv.id}
                                type="button"
                                onClick={() => onSelect(conv.id)}
                                className={cn(
                                    "w-full text-left px-5 py-4 border-b border-slate-100/80 transition-all duration-200",
                                    isSelected
                                        ? "bg-amber-50/50 border-l-[3px] border-l-amber-400"
                                        : "bg-white hover:bg-[#f5f8fc] border-l-[3px] border-l-transparent"
                                )}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm text-navy truncate">
                                                {conv.contact_name}
                                            </span>
                                            <span className={cn(
                                                "text-[0.6rem] leading-none px-1.5 py-0.5 rounded-md font-medium flex-shrink-0",
                                                conv.needs_human_status === "in_progress"
                                                    ? "bg-blue-50 text-blue-500"
                                                    : "bg-amber-50 text-amber-600"
                                            )}>
                                                {conv.needs_human_status === "in_progress" ? "En curso" : "Pendiente"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-navy/80 mt-1 line-clamp-2">
                                            {subject}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <div className={cn("flex items-center gap-1", urgencyColor)}>
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[0.65rem] font-medium">{waitTime}</span>
                                        </div>
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}

                {/* Resolved today summary */}
                {resolvedToday.length > 0 && (
                    <div className="px-5 py-3 bg-slate-50/50">
                        <p className="text-[0.65rem] text-[#5e7a9a] text-center">
                            Resueltas hoy: {resolvedToday.length}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
    id: "welcome",
    text: "¡Hola! 👋 Soy el asistente virtual de Innovakine. Puedo ayudarte a agendar una hora, resolver dudas sobre nuestros servicios o darte información de la clínica. ¿En qué te puedo ayudar?",
    sender: "bot",
    timestamp: new Date(),
};

const ERROR_MESSAGE =
    "Lo siento, estoy teniendo dificultades para responder en este momento. Por favor intenta de nuevo o contáctanos directamente al +56 9 3018 6496.";

// Generate a persistent session ID per browser tab
function getSessionId(): string {
    if (typeof window === "undefined") return "server";
    let id = sessionStorage.getItem("innovakine-chat-session");
    if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem("innovakine-chat-session", id);
    }
    return id;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);
    const [tooltipDismissed, setTooltipDismissed] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const sessionId = useRef<string>(getSessionId());

    // Show widget after scroll
    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 200);
        };
        // Show after a brief delay even without scroll
        const timer = setTimeout(() => setIsVisible(true), 3000);
        window.addEventListener("scroll", toggleVisibility);
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
            clearTimeout(timer);
        };
    }, []);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
            setHasUnread(false);
            setTooltipDismissed(true);
        }
    }, [isOpen]);

    const sendMessage = async () => {
        const text = inputValue.trim();
        if (!text || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    sessionId: sessionId.current,
                }),
            });

            const data = await res.json();

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: res.ok ? data.response : (data.error || ERROR_MESSAGE),
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMsg]);
        } catch {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: ERROR_MESSAGE,
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100]">
                    {/* ============ CHAT PANEL ============ */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="absolute bottom-20 right-0 w-[360px] md:w-[400px] h-[520px] md:h-[560px] bg-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col border border-gray-100/50"
                                style={{ maxHeight: "calc(100vh - 120px)" }}
                            >
                                {/* Chat Header */}
                                <div className="relative bg-gradient-to-r from-[#0a2540] via-[#0d3b66] to-[#1a6b6a] px-5 py-4 flex items-center gap-3.5 shrink-0">
                                    {/* Glassmorphism overlay */}
                                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

                                    {/* Avatar */}
                                    <div className="relative z-10 shrink-0">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-lg">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        {/* Online dot */}
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0d3b66]" />
                                    </div>

                                    {/* Info */}
                                    <div className="relative z-10 flex-1 min-w-0">
                                        <h3 className="text-white font-bold text-sm tracking-wide">
                                            Asistente Innovakine
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                                            </span>
                                            <span className="text-green-300 text-xs font-medium">
                                                Online 24/7
                                            </span>
                                        </div>
                                    </div>

                                    {/* Close Button */}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
                                        aria-label="Cerrar chat"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-slate-50 to-white scrollbar-thin">
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i === 0 ? 0.3 : 0, duration: 0.3 }}
                                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                                                {/* Bot avatar */}
                                                {msg.sender === "bot" && (
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shrink-0 mt-1 shadow-md">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div>
                                                    <div
                                                        className={`px-4 py-2.5 text-sm leading-relaxed ${msg.sender === "user"
                                                            ? "bg-gradient-to-r from-[#0d3b66] to-[#1a6b6a] text-white rounded-2xl rounded-br-md shadow-md"
                                                            : "bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100"
                                                            }`}
                                                    >
                                                        {msg.text}
                                                    </div>
                                                    <p className={`text-[10px] text-gray-400 mt-1 ${msg.sender === "user" ? "text-right" : "text-left"} px-1`}>
                                                        {formatTime(msg.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Typing indicator */}
                                    <AnimatePresence>
                                        {isTyping && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shrink-0 shadow-md">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                                    </svg>
                                                </div>
                                                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                                                    <div className="flex items-center gap-1">
                                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3">
                                    <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Escribe tu mensaje..."
                                            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!inputValue.trim()}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0d3b66] to-[#1a6b6a] text-white shadow-md hover:shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none shrink-0"
                                            aria-label="Enviar mensaje"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="22" y1="2" x2="11" y2="13" />
                                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-center text-[10px] text-gray-300 mt-2 font-medium tracking-wide">
                                        Innovakine · Asistente Virtual
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ============ FLOATING BUTTON + TOOLTIP ============ */}
                    <div className="flex items-center justify-end gap-3">
                        {/* Glassmorphism tooltip */}
                        <AnimatePresence>
                            {!isOpen && !tooltipDismissed && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                    transition={{ duration: 0.4, delay: 0.5 }}
                                    className="pointer-events-none"
                                >
                                    <div className="relative bg-gray-900/75 backdrop-blur-xl text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 max-w-[220px]">
                                        {/* Online badge */}
                                        <div className="flex items-center justify-end gap-1.5 mb-1">
                                            <span className="text-green-400 text-xs font-semibold tracking-wide">online</span>
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium leading-snug">
                                            ¿Necesitas ayuda? Habla con nuestro Asistente Virtual 24/7
                                        </p>
                                        {/* Arrow pointing right */}
                                        <div className="absolute top-1/2 -translate-y-1/2 -right-[10px] border-[6px] border-transparent border-l-gray-900/75" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Main floating button */}
                        <motion.button
                            onClick={() => setIsOpen(!isOpen)}
                            initial={{ opacity: 0, scale: 0, rotate: -90 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            className="relative w-16 h-16 md:w-[72px] md:h-[72px] rounded-full bg-gradient-to-br from-[#2196F3] via-[#00BCD4] to-[#26A69A] shadow-[0_8px_32px_rgba(0,188,212,0.45)] flex items-center justify-center group"
                            aria-label={isOpen ? "Cerrar chat" : "Abrir chat con asistente virtual"}
                        >
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2196F3] via-[#00BCD4] to-[#26A69A] opacity-60 blur-lg group-hover:opacity-80 transition-opacity" />

                            {/* Icon */}
                            <div className="relative z-10">
                                <AnimatePresence mode="wait">
                                    {isOpen ? (
                                        <motion.svg
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </motion.svg>
                                    ) : (
                                        <motion.div
                                            key="chat-icon"
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                        >
                                            {/* Person with chat bubble + heartbeat icon */}
                                            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                                                {/* Person silhouette */}
                                                <circle cx="16" cy="12" r="5" fill="white" />
                                                <path d="M8 30c0-4.42 3.58-8 8-8s8 3.58 8 8" fill="white" opacity="0.9" />
                                                {/* Chat bubble with heartbeat */}
                                                <rect x="22" y="4" width="16" height="12" rx="6" fill="white" opacity="0.95" />
                                                <path d="M26 10h8" stroke="#00BCD4" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M28 10l1-3 1.5 6 1.5-6 1 3" stroke="#00BCD4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                                {/* Smile on person */}
                                                <path d="M13.5 13.5c0 0 1 1.5 2.5 1.5s2.5-1.5 2.5-1.5" stroke="#00BCD4" strokeWidth="1" strokeLinecap="round" fill="none" />
                                            </svg>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Notification badge */}
                            {hasUnread && !isOpen && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-[#0a2540] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20"
                                >
                                    1
                                </motion.div>
                            )}
                        </motion.button>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Building2 } from "lucide-react";
import Image from "next/image";

type Message = {
    id: string;
    sender: "assistant" | "user";
    content: string;
    timestamp: Date;
    propertyContext?: {
        title: string;
        price: string;
        image: string;
        id: string;
    }
};

const INITIAL_MESSAGE: Message = {
    id: "init",
    sender: "assistant",
    content: "Olá! Sou o assistente virtual da Lorena Lorenzo. Estou aqui para ajudar você a encontrar o imóvel perfeito. Como posso ajudar hoje?",
    timestamp: new Date()
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll para a última mensagem
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        // Adiciona mensagem do usuário
        const newUserMsg: Message = {
            id: Date.now().toString(),
            sender: "user",
            content: inputText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newUserMsg]);
        setInputText("");
        setIsTyping(true);

        // Simula resposta (posteriormente será integrado com o backend de IA)
        // Call backend API
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: inputText })
        })
            .then(res => res.json())
            .then(data => {
                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: "assistant",
                    content: data.reply || "Desculpe, tive um problema de conexão.",
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiResponse]);
            })
            .catch(err => {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    sender: "assistant",
                    content: "Ocorreu um erro ao conectar aos nossos servidores.",
                    timestamp: new Date()
                }]);
            })
            .finally(() => {
                setIsTyping(false);
            });
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 z-[100] w-14 h-14 bg-primary text-background rounded-full shadow-[0_0_20px_rgba(236,164,19,0.4)] flex items-center justify-center transition-all group ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <div className="relative flex items-center justify-center w-full h-full">
                    <span className="material-symbols-outlined text-2xl group-hover:hidden transition-all">support_agent</span>
                    <span className="material-symbols-outlined text-2xl hidden group-hover:block transition-all">smart_toy</span>

                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                    </span>
                </div>

                <div className="absolute -top-12 right-0 bg-background/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-primary border border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    CONCIERGE IA
                </div>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed bottom-8 right-8 w-[380px] h-[600px] max-h-[85vh] bg-background border border-primary/20 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-[110] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surface shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary relative overflow-hidden">
                                    <Sparkles size={18} />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-serif tracking-wide text-sm font-bold">Concierge Inteligente</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span>
                                        <span className="text-slate-400 text-xs font-light tracking-widest uppercase">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors p-2"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar bg-[#1a160f]/50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`
                                        max-w-[85%] rounded-2xl p-4 text-sm font-light leading-relaxed
                                        ${msg.sender === 'user'
                                            ? 'bg-primary text-background rounded-br-sm font-medium'
                                            : 'bg-surface text-white rounded-bl-sm border border-primary/10'}
                                    `}>
                                        {msg.content}
                                    </div>
                                    <span className="text-white/30 text-[10px] mt-1 px-1">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-start">
                                    <div className="bg-white/10 rounded-2xl rounded-bl-sm border border-white/5 p-4 flex items-center gap-2">
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-border bg-surface shrink-0">
                            <form onSubmit={handleSendMessage} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Descreva o imóvel dos seus sonhos..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors font-light"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isTyping}
                                    className="absolute right-2 px-2 py-2 text-white/50 hover:text-white disabled:opacity-50 transition-colors"
                                >
                                    <Send size={18} className={inputText.trim() && !isTyping ? 'text-accent' : ''} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

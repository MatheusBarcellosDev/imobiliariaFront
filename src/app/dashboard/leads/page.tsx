"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, Phone, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getLeads, Lead } from "@/lib/api";

const COLUMNS = [
    { id: "NOVO", title: "Novos Leads", color: "bg-blue-500" },
    { id: "CONTATO_INICIAL", title: "Contato Feito", color: "bg-sky-500" },
    { id: "VISITA_AGENDADA", title: "Visita Agendada", color: "bg-yellow-500" },
    { id: "PROPOSTA", title: "Proposta", color: "bg-orange-500" },
    { id: "FECHADO", title: "Ganho", color: "bg-green-500" },
    { id: "PERDIDO", title: "Perdido", color: "bg-red-500" }
];

export default function GestaoLeads() {
    const { token } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            getLeads(token).then(data => {
                setLeads(data);
                setLoading(false);
            });
        }
    }, [token]);

    const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="max-w-[1400px] mx-auto h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Canal de Vendas</h1>
                    <p className="text-white/50 font-light text-sm">Gerencie o pipeline de negociações e potenciais clientes (Leads).</p>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 border border-white/10 rounded-lg bg-white/5 md:w-80">
                    <Search className="text-white/50" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar lead..."
                        className="bg-transparent border-none outline-none text-white w-full text-sm font-light"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x">
                {COLUMNS.map(column => (
                    <div key={column.id} className="min-w-[320px] max-w-[320px] flex flex-col gap-4 snap-center">
                        {/* Column Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                                <h3 className="text-white font-medium uppercase tracking-widest text-sm">{column.title}</h3>
                            </div>
                            <span className="text-white/40 text-xs font-medium bg-white/5 px-2 py-1 rounded-md">
                                {filteredLeads.filter(l => l.status === column.id).length}
                            </span>
                        </div>

                        {/* Cards Container */}
                        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-white/50 text-sm">Carregando...</div>
                            ) : (
                                <>
                                    {filteredLeads.filter(l => l.status === column.id).map(lead => (
                                        <div key={lead.id} className="glass p-5 rounded-xl border border-white/10 flex flex-col gap-4 cursor-grab active:cursor-grabbing hover:border-white/20 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="text-white font-medium mb-1">{lead.name}</div>
                                                    <div className="text-white/50 text-xs font-light">{new Date(lead.createdAt).toLocaleDateString()}</div>
                                                </div>
                                                <button className="text-white/30 hover:text-white transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>

                                            <div className="text-accent text-sm font-medium">
                                                {lead.source || "Interesse Geral"}
                                            </div>

                                            {lead.message && (
                                                <div className="text-sm text-white/70 italic line-clamp-2">
                                                    "{lead.message}"
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                                {lead.phone && (
                                                    <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-colors" title={lead.phone}>
                                                        <Phone size={14} />
                                                    </a>
                                                )}
                                                <a href={`mailto:${lead.email}`} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-colors" title={lead.email}>
                                                    <Mail size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Empty state for column */}
                                    {filteredLeads.filter(l => l.status === column.id).length === 0 && (
                                        <div className="p-8 text-center text-white/30 text-sm border border-dashed border-white/10 rounded-xl">
                                            Nenhum lead nesta etapa.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

"use client";

import { Building, Users, TrendingUp, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getProperties, getLeads, Property, Lead } from "@/lib/api";

export default function DashboardIndex() {
    const { token } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const [props, lds] = await Promise.all([
                    getProperties(),
                    getLeads(token)
                ]);
                setProperties(props);
                setLeads(lds);
            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const activeProperties = properties.length;
    const totalLeads = leads.length;
    const vgv = properties.reduce((acc, curr) => acc + curr.price, 0);

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 block">
                <h1 className="text-3xl font-display text-slate-100 mb-2">Visão Geral</h1>
                <p className="text-slate-400 font-light">Acompanhe as métricas do seu portfólio de imóveis e captação de leads.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

                {/* Stat Card 1 */}
                <div className="glass-bronze p-6 rounded-2xl flex flex-col gap-4 border border-white/5">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/5 rounded-xl text-primary">
                            <Building size={24} />
                        </div>
                        <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">+2 esta semana</span>
                    </div>
                    <div>
                        <div className="text-sm tracking-widest uppercase text-slate-500 mb-1">Imóveis Ativos</div>
                        <div className="text-3xl font-display text-slate-100">{activeProperties}</div>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="glass-bronze p-6 rounded-2xl flex flex-col gap-4 border border-white/5">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/5 rounded-xl text-primary">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">+12 novos</span>
                    </div>
                    <div>
                        <div className="text-sm tracking-widest uppercase text-slate-500 mb-1">Total de Leads</div>
                        <div className="text-3xl font-display text-slate-100">{totalLeads}</div>
                    </div>
                </div>

                {/* Stat Card 3 */}
                <div className="glass-bronze p-6 rounded-2xl flex flex-col gap-4 border border-white/5">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/5 rounded-xl text-primary">
                            <Eye size={24} />
                        </div>
                    </div>
                    <div>
                        <div className="text-sm tracking-widest uppercase text-slate-500 mb-1">Visualizações do Portfólio</div>
                        <div className="text-3xl font-display text-slate-100">12.4K</div>
                    </div>
                </div>

                {/* Stat Card 4 */}
                <div className="glass-bronze p-6 rounded-2xl flex flex-col gap-4 border border-white/5">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/5 rounded-xl text-primary">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div>
                        <div className="text-sm tracking-widest uppercase text-slate-500 mb-1">VGV Potencial</div>
                        <div className="text-3xl font-display text-slate-100">{formatPrice(vgv)}</div>
                    </div>
                </div>

            </div>

            {/* Recentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-bronze p-6 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-display text-slate-100">Leads Recentes</h2>
                        <button className="text-xs uppercase tracking-widest text-primary hover:text-slate-100 transition-colors">Ver todos</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        {leads.slice(0, 3).map((lead, i) => (
                            <div key={lead.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                <div>
                                    <div className="text-slate-100 font-medium">{lead.name}</div>
                                    <div className="text-slate-400 text-sm font-light">Interesse: {lead.source || "Geral"}</div>
                                </div>
                                <div className="text-xs px-3 py-1 bg-white/10 rounded-full text-slate-300">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-bronze p-6 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-display text-slate-100">Imóveis mais visados</h2>
                        <button className="text-xs uppercase tracking-widest text-primary hover:text-slate-100 transition-colors">Ver Relatório</button>
                    </div>
                    <div className="flex flex-col gap-4">
                        {properties.slice(0, 3).map((property, i) => (
                            <div key={property.id} className="flex gap-4 items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="w-16 h-16 bg-white/10 rounded-lg shrink-0 overflow-hidden relative">
                                    {property.images && property.images.length > 0 && (
                                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="text-slate-100 font-medium">{property.title}</div>
                                    <div className="text-slate-400 text-sm font-light">{formatPrice(property.price)}</div>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Eye size={14} /> {Math.floor(Math.random() * 500) + 50}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

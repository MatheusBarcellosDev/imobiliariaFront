"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Building, MessageSquare, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-background flex font-inter">
            {/* Sidebar - Dashboard Navigation */}
            <aside className="w-64 border-r border-white/10 flex flex-col glass z-40 sticky top-0 h-screen">
                <div className="p-6 border-b border-white/10">
                    <Link href="/" className="text-xl font-serif text-white tracking-widest font-light">
                        Lorena <span className="font-bold">Lorenzo</span>
                    </Link>
                    <div className="mt-2 text-xs uppercase tracking-widest text-accent font-semibold">
                        Broker Portal
                    </div>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white font-medium">
                        <LayoutDashboard size={18} /> Resumo
                    </Link>
                    <Link href="/dashboard/imoveis" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors">
                        <Building size={18} /> Imóveis
                    </Link>
                    <Link href="/dashboard/leads" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors">
                        <Users size={18} /> Leads
                    </Link>
                    <Link href="/dashboard/chat" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors">
                        <MessageSquare size={18} /> Conversas
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/10 flex flex-col gap-2">
                    <Link href="/dashboard/configuracoes" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors">
                        <Settings size={18} /> Ajustes
                    </Link>
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-white/70 hover:text-red-400 transition-colors text-left w-full">
                        <LogOut size={18} /> Sair
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

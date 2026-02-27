"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, ExternalLink, ImageIcon, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { getProperties, Property } from "@/lib/api";

export default function GestaoImoveis() {
    const [searchTerm, setSearchTerm] = useState("");
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProperties().then(data => {
            setProperties(data);
            setLoading(false);
        });
    }, []);

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
    };

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const token = typeof window !== 'undefined' ? localStorage.getItem('@Imobiliaria:token') : '';

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja realmente excluir este imóvel permanentemente? Essa ação não pode ser desfeita.')) return;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
            const res = await fetch(`${apiUrl}/properties/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setProperties(prev => prev.filter(p => p.id !== id));
            } else {
                alert('Erro ao excluir imóvel. Verifique suas permissões.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro fatal ao conectar com o servidor.');
        }
    };

    const handleTogglePublish = async (id: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.preventDefault(); // Evita navegar ao clicar
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
            const res = await fetch(`${apiUrl}/properties/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ published: !currentStatus })
            });
            if (res.ok) {
                setProperties(prev => prev.map(p => p.id === id ? { ...p, published: !currentStatus } : p));
            } else {
                alert('Erro ao alterar status do imóvel.');
            }
        } catch (error) {
            console.error(error);
            alert('Erro fatal ao conectar com o servidor.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Imóveis</h1>
                    <p className="text-white/50 font-light text-sm">Gerencie seu portfólio de propriedades exclusivas.</p>
                </div>
                <Link href="/dashboard/imoveis/novo">
                    <Button variant="primary" className="flex items-center gap-2">
                        <Plus size={18} /> Novo Imóvel
                    </Button>
                </Link>
            </div>

            {/* Toolbar */}
            <div className="glass p-4 rounded-xl flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 flex items-center gap-3 px-4 py-2 border border-white/10 rounded-lg bg-black/20">
                    <Search className="text-white/50" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por título ou ID..."
                        className="bg-transparent border-none outline-none text-white w-full text-sm font-light"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select className="bg-black/20 border border-white/10 text-white text-sm rounded-lg px-4 py-2 outline-none">
                    <option value="">Todos os Status</option>
                    <option value="active">Ativos</option>
                    <option value="negotiation">Em Negociação</option>
                    <option value="inactive">Inativos</option>
                </select>
            </div>

            {/* Tabela/Lista */}
            <div className="glass rounded-xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-white/50 bg-white/5">
                                <th className="p-4 font-medium">Imóvel</th>
                                <th className="p-4 font-medium">Valor</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Visualizações</th>
                                <th className="p-4 font-medium text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-white/50">Carregando imóveis...</td>
                                </tr>
                            ) : filteredProperties.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-white/50">Nenhum imóvel encontrado.</td>
                                </tr>
                            ) : (
                                filteredProperties.map(property => (
                                    <tr key={property.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 flex items-center gap-4">
                                            <div className="relative w-16 h-12 rounded overflow-hidden shrink-0 bg-white/5">
                                                {property.images && property.images.length > 0 && (
                                                    <Image src={property.images[0]} alt={property.title} fill className="object-cover" />
                                                )}
                                            </div>
                                            <div className="max-w-[200px] md:max-w-[300px]">
                                                <div className="text-white font-medium text-sm truncate">{property.title}</div>
                                                <div className="text-white/40 text-xs font-light tracking-wide uppercase mt-1 truncate">ID: {property.id.substring(0, 8)}</div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-white text-sm font-light whitespace-nowrap">{formatPrice(property.price)}</td>
                                        <td className="p-4">
                                            {property.published ? (
                                                <span className="text-xs px-2 py-1 rounded-md font-medium bg-green-500/10 text-green-400">
                                                    Ativo no Site
                                                </span>
                                            ) : (
                                                <span className="text-xs px-2 py-1 rounded-md font-medium bg-yellow-500/10 text-yellow-500">
                                                    Rascunho Oculto
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-white/70 text-sm font-light">
                                            {property.featured ? '⭐ Destaque' : '-'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => handleTogglePublish(property.id, property.published ?? false, e)} className={`${property.published ? "text-yellow-500 hover:text-yellow-400" : "text-green-400 hover:text-green-300"} transition-colors p-1`} title={property.published ? "Ocultar / Rascunho" : "Publicar no Site"}>
                                                    {property.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                                <Link href={`/imoveis/${property.id}`} target="_blank" className="text-white/50 hover:text-white transition-colors p-1" title="Ver Site">
                                                    <ExternalLink size={16} />
                                                </Link>
                                                <Link href={`/dashboard/imoveis/${property.id}`} className="text-accent hover:text-accent/80 transition-colors p-1" title="Editar">
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(property.id)} className="text-red-400 hover:text-red-300 transition-colors p-1" title="Excluir">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

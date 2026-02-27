"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/PropertyCard";
import { Search, Filter } from "lucide-react";
import { getProperties, Property } from "@/lib/api";
import { useSearchParams } from "next/navigation";

function ImoveisContent() {
    const searchParams = useSearchParams();
    const initSearch = searchParams.get("search") || "";
    const initType = searchParams.get("type") || "";
    const initBeds = searchParams.get("beds") || "";

    const [searchTerm, setSearchTerm] = useState(initSearch);
    const [propertyType, setPropertyType] = useState(initType);
    const [beds, setBeds] = useState(initBeds);

    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProperties().then((data) => {
            setProperties(data);
            setLoading(false);
        });
    }, []);

    const filtered = properties.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.neighborhood?.name || p.address || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = propertyType ? p.type?.toLowerCase() === propertyType.toLowerCase() : true;
        const matchBeds = beds ? p.bedrooms >= parseInt(beds) : true;

        return matchSearch && matchType && matchBeds;
    });

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
    };

    return (
        <div className="pt-32 pb-24 min-h-screen bg-[#2a2419]/30">
            <div className="max-w-7xl mx-auto px-6 md:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <span className="text-primary tracking-[0.3em] uppercase text-xs font-bold block mb-4">Selecionados para Você</span>
                    <h1 className="text-5xl md:text-6xl font-display text-slate-100 font-bold mb-6">Nossos <i className="font-light text-primary/70">Imóveis</i></h1>
                    <p className="text-slate-400 text-lg max-w-2xl font-light">Explore a coleção de imóveis mais exclusiva. Refine sua busca para encontrar o lar perfeito para a sua família.</p>
                </motion.div>

                {/* Barra de Busca e Filtros */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass-bronze p-4 rounded-full flex flex-col md:flex-row gap-4 mb-16 items-center border border-white/10 shadow-xl"
                >
                    <div className="flex-1 flex items-center gap-3 px-6 py-2 border-b md:border-b-0 md:border-r border-white/10 w-full">
                        <Search className="text-primary/70" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por bairro, condomínio ou referência..."
                            className="bg-transparent border-none outline-none text-slate-100 w-full placeholder:text-slate-500 font-light"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button className="flex items-center justify-center gap-2 px-8 py-3 hover:bg-white/5 rounded-full transition-colors shrink-0 text-sm tracking-widest uppercase text-slate-300 w-full md:w-auto font-medium">
                        <Filter size={16} /> Filtros Avançados
                    </button>
                </motion.div>

                {/* Grid de Imóveis */}
                {loading ? (
                    <div className="text-center py-20 text-slate-400 font-light flex justify-center items-center h-48">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
                        >
                            {filtered.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    id={property.id}
                                    title={property.title}
                                    price={formatPrice(property.price)}
                                    neighborhood={property.neighborhood?.name || property.address || "Localização não informada"}
                                    beds={property.bedrooms}
                                    baths={property.bathrooms}
                                    area={property.privateArea || property.area}
                                    image={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80'}
                                    featured={property.superFeatured}
                                />
                            ))}
                        </motion.div>

                        {filtered.length === 0 && (
                            <div className="text-center py-20 text-slate-400 font-light">
                                Nenhum imóvel encontrado com estes critérios.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function ImoveisPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#2a2419]/30 pt-32 pb-24 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <ImoveisContent />
        </Suspense>
    );
}

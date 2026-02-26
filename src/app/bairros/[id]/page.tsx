"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import PropertyCard from "@/components/PropertyCard";
import { useEffect, useState, use } from "react";
import { getNeighborhoodById, Neighborhood } from "@/lib/api";

export default function NeighborhoodPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [neighborhoodInfo, setNeighborhoodInfo] = useState<{ neighborhood: Neighborhood, avgPrice: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNeighborhoodById(id).then(res => {
            setNeighborhoodInfo(res);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#2a2419]/30 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!neighborhoodInfo || !neighborhoodInfo.neighborhood) {
        return (
            <div className="min-h-screen bg-[#2a2419]/30 flex justify-center items-center text-slate-300">
                Bairro não encontrado ou sem informações.
            </div>
        );
    }

    const { neighborhood, avgPrice } = neighborhoodInfo;

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
    };

    return (
        <article className="min-h-screen pb-32 bg-[#2a2419]/30">
            {/* Immersive Header */}
            <section className="relative h-[80vh] flex items-center justify-center">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="w-full h-full relative"
                    >
                        <Image
                            src={neighborhood.image || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80"}
                            alt={neighborhood.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-background-dark/60" />
                    </motion.div>
                </div>

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        <div className="text-primary tracking-[0.3em] uppercase text-xs font-bold mb-6">Guia de Bairros</div>
                        <h1 className="text-6xl md:text-8xl font-display text-slate-100 mb-6 uppercase leading-tight font-black">{neighborhood.name}</h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-light italic">Localização Privilegiada</p>
                    </motion.div>
                </div>
            </section>

            {/* Editorial Content */}
            <section className="max-w-7xl mx-auto px-6 md:px-20 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="prose prose-invert prose-xl font-light text-slate-400 leading-relaxed"
                    >
                        <p>{neighborhood.description || `Um dos bairros mais arborizados e valorizados. Oferece infraestrutura completa, escolas renomadas, segurança e ruas tranquilas, ideais para o conforto e bem-estar em ${neighborhood.name}.`}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-bronze p-12 grid grid-cols-2 gap-8 rounded-xl"
                    >
                        <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2 font-bold">Imóveis</div>
                            <div className="text-4xl font-display text-slate-100 font-bold">{neighborhood._count?.properties || 0}</div>
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2 font-bold">Ticket Médio</div>
                            <div className="text-4xl font-display text-primary font-bold">{formatPrice(avgPrice)}</div>
                        </div>
                        <div className="col-span-2 border-t border-white/10 pt-8 mt-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2 font-bold">Estilo de Vida</div>
                            <div className="text-2xl font-display text-slate-100 italic">Tranquilo e Familiar</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Listings in Neighborhood */}
            <section className="max-w-7xl mx-auto px-6 md:px-20">
                <h2 className="text-4xl md:text-5xl font-display text-slate-100 font-bold mb-16 pb-6 border-b border-primary/20">
                    Propriedades Exclusivas em <i className="text-primary font-light">{neighborhood.name}</i>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {neighborhood.properties?.length ? neighborhood.properties.map(property => (
                        <PropertyCard
                            key={property.id}
                            id={property.id}
                            title={property.title}
                            price={formatPrice(property.price)}
                            neighborhood={neighborhood.name}
                            beds={property.bedrooms}
                            baths={property.bathrooms}
                            area={property.area}
                            image={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80'}
                        />
                    )) : (
                        <p className="text-slate-400 font-light">Ainda não há imóveis em destaque cadastrados neste bairro.</p>
                    )}
                </div>
            </section>
        </article>
    );
}

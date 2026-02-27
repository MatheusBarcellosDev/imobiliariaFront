"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getNeighborhoods, Neighborhood } from "@/lib/api";
import { ArrowRight, MapPin } from "lucide-react";

export default function BairrosPage() {
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNeighborhoods().then((data) => {
            setNeighborhoods(data);
            setLoading(false);
        });
    }, []);

    return (
        <article className="min-h-screen pt-32 pb-24 bg-background-dark text-slate-100">
            <div className="max-w-7xl mx-auto px-6 md:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 text-center"
                >
                    <span className="text-primary tracking-[0.3em] uppercase text-xs font-bold block mb-4">Mapeamento de Luxo</span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-6">
                        Endereços <i className="font-light text-primary/80">Exclusivos</i>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
                        Explore as regiões mais cobiçadas e valorizadas. Nossa curadoria de bairros garante proximidade ao mar principal e alta valorização imobiliária.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                        {neighborhoods.map((neighborhood, idx) => (
                            <motion.div
                                key={neighborhood.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                            >
                                <Link href={`/bairros/${neighborhood.id}`} className="group block relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl border border-white/10">
                                    <Image
                                        src={neighborhood.image || "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                                        alt={neighborhood.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/80" />

                                    {/* Content inside Box */}
                                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                                        <div className="flex flex-col gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin size={18} className="text-primary" />
                                                <span className="text-primary text-xs uppercase tracking-[0.2em] font-bold">Litoral SC</span>
                                            </div>
                                            <h3 className="text-4xl md:text-5xl font-display font-medium text-white mb-2">{neighborhood.name}</h3>

                                            <div className="flex items-center justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                <p className="text-slate-300 font-light max-w-sm line-clamp-2 text-sm leading-relaxed">
                                                    {neighborhood.description || "Descubra os melhores imóveis de luxo disponíveis nesta região valorizada."}
                                                </p>
                                                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary group-hover:text-background-dark transition-all duration-300 ml-4">
                                                    <ArrowRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}

"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import Button from "./Button";
import Link from "next/link";
import { Property } from "@/lib/api";

const mockProperties = [
    {
        id: "1",
        title: "Casa Alto Padrão",
        price: "R$ 15.000.000",
        neighborhood: "Jardins, São Paulo",
        beds: 5,
        baths: 6,
        area: 850,
        image: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80"
    },
    {
        id: "2",
        title: "Apartamento Duplex Leblon",
        price: "R$ 22.500.000",
        neighborhood: "Leblon, Rj",
        beds: 4,
        baths: 5,
        area: 420,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80"
    },
    {
        id: "3",
        title: "Casa em Alphaville",
        price: "R$ 8.900.000",
        neighborhood: "Alphaville, SP",
        beds: 4,
        baths: 6,
        area: 600,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80"
    }
];

export default function FeaturedProperties({ initialProperties = [] }: { initialProperties?: Property[] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Usa dados reais se disponíveis, caso contrário usa o mock
    const displayProperties = initialProperties && initialProperties.length > 0
        ? initialProperties.slice(0, 3).map(p => ({
            id: p.id,
            title: p.title,
            price: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(p.price),
            neighborhood: p.neighborhood?.name || p.address || "Localização não informada",
            beds: p.bedrooms,
            baths: p.bathrooms,
            area: p.area,
            image: p.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80'
        }))
        : mockProperties;

    return (
        <section ref={containerRef} className="py-24 px-6 md:px-20 max-w-7xl mx-auto relative z-20">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6"
            >
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif font-medium text-slate-100 mb-3 tracking-tight">Imóveis em Destaque</h2>
                    <div className="h-1 w-24 bg-primary"></div>
                </div>
                <Link href="/imoveis" className="text-primary font-bold hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity">
                    VER TODOS OS IMÓVEIS <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayProperties.map((prop, idx) => (
                    <motion.div
                        key={prop.id}
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                    >
                        <PropertyCard {...prop} />
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 flex justify-center md:hidden">
                <Link href="/imoveis" className="text-primary font-bold flex items-center gap-2 hover:opacity-80 transition-opacity uppercase text-sm">
                    Ver Todos os Imóveis <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
            </div>
        </section>
    );
}

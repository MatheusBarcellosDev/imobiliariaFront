"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BedDouble, Bath, SquareDashedBottom, CarFront, Check } from "lucide-react";
import Button from "@/components/Button";
import { useEffect, useState, use } from "react";
import { getPropertyById, Property } from "@/lib/api";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPropertyById(id).then(res => {
            setProperty(res);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black/90 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-black/90 flex justify-center items-center text-white/50">
                Imóvel não encontrado.
            </div>
        );
    }

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
    };

    const mainImage = property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2800&q=80";
    const galleryImages = property.images && property.images.length > 1 ? property.images.slice(1) : [];
    const features: string[] = property.amenities && property.amenities.length > 0 ? property.amenities : [];

    return (
        <article className="min-h-screen pb-32">
            {/* Hero Section of the Property */}
            <section className="relative h-[80vh] flex items-end pb-16">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={mainImage}
                        alt={property.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col md:flex-row justify-between items-end gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="text-accent uppercase tracking-widest text-sm font-semibold mb-4">{property.neighborhood?.name || property.address || "Localização Privilegiada"}</div>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 max-w-4xl leading-tight">
                            {property.title}
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="glass p-8 flex flex-col gap-4 text-center md:text-left shrink-0 min-w-[300px]"
                    >
                        <div className="text-sm uppercase tracking-widest text-white/50">Valor de Venda</div>
                        <div className="text-4xl font-serif text-white">{formatPrice(property.price)}</div>
                        <Button variant="primary" className="mt-4 w-full">Agendar Visita</Button>
                    </motion.div>
                </div>
            </section>

            {/* Specifications & Description */}
            <section className="container mx-auto px-6 md:px-12 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 flex flex-col gap-16">
                        {/* Status Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-wrap items-center gap-8 md:gap-16 py-8 border-y border-white/10"
                        >
                            <div className="flex items-center gap-3 text-white/80">
                                <BedDouble size={24} className="text-accent" />
                                <div>
                                    <div className="text-2xl font-serif">{property.bedrooms}</div>
                                    <div className="text-xs uppercase tracking-widest text-white/50">Suítes</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <Bath size={24} className="text-accent" />
                                <div>
                                    <div className="text-2xl font-serif">{property.bathrooms}</div>
                                    <div className="text-xs uppercase tracking-widest text-white/50">Banhos</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <CarFront size={24} className="text-accent" />
                                <div>
                                    <div className="text-2xl font-serif">{property.garages}</div>
                                    <div className="text-xs uppercase tracking-widest text-white/50">Vagas</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <SquareDashedBottom size={24} className="text-accent" />
                                <div>
                                    <div className="text-2xl font-serif">{property.area}m²</div>
                                    <div className="text-xs uppercase tracking-widest text-white/50">Área Útil</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Concept */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="prose prose-invert prose-lg max-w-none font-light text-white/70 leading-relaxed"
                        >
                            <h3 className="text-3xl font-serif text-white mb-6">O Conceito</h3>
                            <p>{property.description}</p>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 p-8"
                        >
                            <h4 className="text-xl font-serif text-white mb-6 pb-4 border-b border-white/10">Características</h4>
                            {features.length > 0 ? (
                                <ul className="flex flex-col gap-4">
                                    {features.map((f: string) => (
                                        <li key={f} className="flex items-start gap-3 text-white/70 font-light text-sm">
                                            <Check size={18} className="text-accent shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-white/50 text-sm font-light">Nenhuma característica cadastrada.</p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Gallery */}
            <section className="container mx-auto px-6 md:px-12">
                <h3 className="text-3xl font-serif text-white mb-10 pb-4 border-b border-white/10">Galeria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.length > 0 ? galleryImages.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="relative aspect-square cursor-pointer overflow-hidden group"
                        >
                            <Image src={img} alt="Galeria" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        </motion.div>
                    )) : (
                        <p className="text-white/50 col-span-3">Nenhuma imagem adicional disponível na galeria.</p>
                    )}
                </div>
            </section>
        </article>
    );
}

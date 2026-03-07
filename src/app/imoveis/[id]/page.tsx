"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Button from "@/components/Button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, use } from "react";
import { getPropertyById, Property } from "@/lib/api";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    const galleryImages = property.images && property.images.length > 0 ? property.images : [mainImage];
    const features: string[] = property.amenities && property.amenities.length > 0 ? property.amenities : [];

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = "auto";
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    };

    return (
        <article className="min-h-screen pb-32">
            {/* Hero Section of the Property */}
            <section className="relative h-[85vh] flex items-end pb-16">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={mainImage}
                        alt={property.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent" />
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col md:flex-row justify-between items-end gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col gap-2"
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                            <span className="text-primary uppercase tracking-[0.2em] text-sm font-bold">{property.neighborhood?.name || property.address || "Localização Privilegiada"}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-display font-medium text-white max-w-4xl flex-wrap break-words leading-tight capitalize">
                            {property.title}
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="glass-bronze p-8 md:p-10 rounded-2xl lg:hidden flex flex-col gap-3 text-center md:text-left shrink-0 min-w-[320px] shadow-2xl border border-white/10"
                    >
                        <div className="text-sm uppercase tracking-[0.15em] text-white/70 font-medium">Valor de Venda</div>
                        <div className="text-4xl md:text-5xl font-display font-medium text-white mb-2">{formatPrice(property.price)}</div>
                        <button className="bg-primary hover:bg-primary/90 text-background-dark py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors mt-2 w-full">
                            <span>AGENDAR VISITA</span>
                            <span className="material-symbols-outlined text-lg">calendar_today</span>
                        </button>
                    </motion.div>
                </div>
            </section>

            <div className="flex flex-col">
                {/* Gallery */}
                <section className="order-1 lg:order-2 container mx-auto px-6 md:px-12 py-12">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-[1px] w-12 bg-primary" />
                        <h3 className="text-3xl font-display font-medium text-white tracking-widest">Galeria</h3>
                    </div>
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 -mx-6 px-6 md:-mx-12 md:px-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {galleryImages.length > 0 ? galleryImages.map((img, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="relative aspect-[4/3] md:aspect-[3/2] xl:aspect-[16/10] cursor-pointer overflow-hidden rounded-2xl group flex-none w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[40vw] snap-center"
                                onClick={() => openLightbox(idx)}
                            >
                                <Image src={img} alt="Galeria" fill sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 40vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                            </motion.div>
                        )) : (
                            <p className="text-white/50 w-full text-center">Nenhuma imagem adicional disponível na galeria.</p>
                        )}
                    </div>
                </section>

                {/* Specifications & Description */}
                <section className="order-2 lg:order-1 container mx-auto px-6 md:px-12 pt-8 lg:pt-24 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-8 flex flex-col gap-16">
                            {/* Status Bar */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10"
                            >
                                <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 rounded-2xl gap-3 hover:bg-white/10 transition-colors">
                                    <span className="material-symbols-outlined text-primary text-4xl mb-2">bed</span>
                                    <div className="text-3xl font-display text-white">{property.bedrooms}</div>
                                    <div className="text-xs uppercase tracking-widest text-white/50 font-bold">Suítes</div>
                                </div>
                                <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 rounded-2xl gap-3 hover:bg-white/10 transition-colors">
                                    <span className="material-symbols-outlined text-primary text-4xl mb-2">shower</span>
                                    <div className="text-3xl font-display text-white">{property.bathrooms}</div>
                                    <div className="text-xs uppercase tracking-widest text-white/50 font-bold">Banheiros</div>
                                </div>
                                <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 rounded-2xl gap-3 hover:bg-white/10 transition-colors">
                                    <span className="material-symbols-outlined text-primary text-4xl mb-2">directions_car</span>
                                    <div className="text-3xl font-display text-white">{property.garages}</div>
                                    <div className="text-xs uppercase tracking-widest text-white/50 font-bold">Vagas</div>
                                </div>
                            </motion.div>

                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="prose prose-invert prose-lg max-w-none font-light text-white/80 leading-relaxed bg-white/5 p-8 md:p-12 rounded-3xl border border-white/5"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-[1px] w-12 bg-primary" />
                                    <span className="text-primary tracking-[0.3em] uppercase text-xs font-bold">Descrição do Imóvel</span>
                                </div>
                                <p className="whitespace-pre-line leading-loose text-slate-300">{property.description}</p>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="sticky top-32 flex flex-col gap-8 z-10 w-full mb-16">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="glass-bronze p-8 md:p-10 rounded-3xl hidden lg:flex flex-col gap-3 shadow-2xl border border-white/10"
                                >
                                    <div className="text-sm uppercase tracking-[0.15em] text-white/70 font-medium">Valor de Venda</div>
                                    <div className="text-4xl md:text-5xl font-display font-medium text-white mb-2">{formatPrice(property.price)}</div>
                                    <button className="bg-primary hover:bg-primary/90 text-background-dark py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors mt-2 w-full">
                                        <span>AGENDAR VISITA</span>
                                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                                    </button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white/5 border border-white/10 p-10 rounded-3xl"
                                >
                                    <h4 className="text-2xl font-display font-medium text-white mb-8 pb-4 border-b border-white/10">Características</h4>
                                    {features.length > 0 ? (
                                        <ul className="flex flex-col gap-6">
                                            {features.map((f: string) => (
                                                <li key={f} className="flex items-center gap-4 text-white/80 font-light text-base">
                                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
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
                    </div>
                </section>
            </div>


            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        <button onClick={closeLightbox} className="absolute top-6 right-6 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors z-[110] bg-black/40 backdrop-blur-md p-2 rounded-full">
                            <X size={28} className="md:w-10 md:h-10" />
                        </button>

                        <button onClick={prevImage} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-primary transition-colors z-[110] bg-black/40 backdrop-blur-md p-2 rounded-full">
                            <ChevronLeft size={36} className="md:w-[60px] md:h-[60px]" />
                        </button>

                        <button onClick={nextImage} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-primary transition-colors z-[110] bg-black/40 backdrop-blur-md p-2 rounded-full">
                            <ChevronRight size={36} className="md:w-[60px] md:h-[60px]" />
                        </button>

                        <div className="relative w-full h-[70vh] md:h-[85vh] max-w-6xl mx-auto px-4 md:px-0" onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={galleryImages[currentImageIndex]}
                                alt="Imagem em Destaque"
                                fill
                                className="object-contain"
                            />
                            <div className="absolute -bottom-14 left-0 right-0 text-center text-white/50 text-sm tracking-widest uppercase">
                                {currentImageIndex + 1} / {galleryImages.length}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
    );
}

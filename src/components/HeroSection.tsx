"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "./Button";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [beds, setBeds] = useState("");

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0vh", "40vh"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

    const handleSearch = () => {
        const queryParams = new URLSearchParams();
        if (searchTerm) {
            queryParams.append("search", searchTerm);
        }
        if (propertyType) {
            queryParams.append("type", propertyType);
        }
        if (beds) {
            queryParams.append("beds", beds);
        }
        router.push(`/imoveis?${queryParams.toString()}`);
    };

    return (
        <section ref={containerRef} className="relative h-[85vh] w-full flex items-center justify-center px-6 overflow-hidden bg-background-dark">
            <motion.div
                style={{ y, scale }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isMounted ? 1 : 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-x-0 -top-10 h-[140vh] z-0 bg-background-dark"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    className="h-full w-full object-cover"
                    src="/heroVideo.mp4"
                />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-background-dark/40 to-background-dark z-10 pointer-events-none" />

            <motion.div
                style={{ opacity }}
                className="relative z-20 max-w-4xl text-center flex flex-col items-center gap-8 mt-20"
            >
                <div className="space-y-4">
                    <motion.span
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-primary tracking-[0.3em] uppercase text-xs font-bold block"
                    >
                        Imóveis Selecionados
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-slate-100 leading-tight tracking-tight"
                    >
                        O Imóvel dos Seus Sonhos, <br /> Aguarda
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                        className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Especialistas em encontrar o lar perfeito para você e sua família nos melhores bairros.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-4xl glass-bronze p-2 rounded-xl flex flex-col md:flex-row gap-2 items-center"
                >
                    <div className="flex flex-1 items-center px-4 py-2 md:py-0 w-full md:w-auto gap-3">
                        <span className="material-symbols-outlined text-primary/70">location_on</span>
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-transparent border-none text-slate-100 placeholder:text-slate-400 focus:ring-0 text-base outline-none" placeholder="Buscar bairro ou cidade..." type="text" />
                    </div>

                    <div className="h-px md:h-8 w-full md:w-px bg-white/10"></div>

                    <div className="flex flex-1 items-center px-4 py-2 md:py-0 w-full md:w-auto gap-3">
                        <span className="material-symbols-outlined text-primary/70">home_work</span>
                        <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className="w-full bg-transparent border-none text-slate-100 focus:ring-0 text-base appearance-none cursor-pointer outline-none">
                            <option className="text-background-dark" value="">Tipo de Imóvel</option>
                            <option className="text-background-dark" value="casa">Casa</option>
                            <option className="text-background-dark" value="apartamento">Apartamento</option>
                            <option className="text-background-dark" value="cobertura">Cobertura</option>
                        </select>
                    </div>

                    <div className="h-px md:h-8 w-full md:w-px bg-white/10"></div>

                    <div className="flex items-center px-4 py-2 md:py-0 w-full md:w-auto gap-3">
                        <span className="material-symbols-outlined text-primary/70">bed</span>
                        <select value={beds} onChange={e => setBeds(e.target.value)} className="bg-transparent border-none text-slate-100 focus:ring-0 text-base appearance-none cursor-pointer outline-none">
                            <option className="text-background-dark" value="">Quartos</option>
                            <option className="text-background-dark" value="1">1+ Quartos</option>
                            <option className="text-background-dark" value="2">2+ Quartos</option>
                            <option className="text-background-dark" value="3">3+ Quartos</option>
                            <option className="text-background-dark" value="4">4+ Quartos</option>
                        </select>
                    </div>

                    <button onClick={handleSearch} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-background-dark px-8 py-4 md:py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                        <span className="material-symbols-outlined">search</span>
                        <span>Buscar</span>
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
}

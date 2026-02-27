"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const neighborhoods = [
    {
        id: "campinas",
        name: "Campinas, São José",
        description: "Mais do que um bairro, Campinas é o coração comercial e residencial que conecta a tradição com o alto luxo. Conhecido pela sua imponente Beira-Mar, oferece ciclovias, praças impecáveis e uma gastronomia de excelência.",
        mainImage: "/bairros/campinas.webp",
        subImage: "/bairros/beiramarcampinasminiatura.png",
        position: "left"
    },
    {
        id: "kobrasol",
        name: "Kobrasol, São José",
        description: "A essência da vida urbana dinâmica. O Kobrasol é um polo vibrante que combina a praticidade do desenvolvimento empresarial com uma infraestrutura completa de lazer, clínicas e os melhores serviços a poucos passos.",
        mainImage: "/bairros/kobrasol.webp",
        position: "right"
    }
];

export default function Neighborhoods() {
    return (
        <section className="py-24 bg-[#2a2419]/30 relative">
            <div className="max-w-7xl mx-auto px-6 md:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <span className="text-primary tracking-[0.3em] uppercase text-xs font-bold">Regiões Privilegiadas</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 mt-2">Editoriais de Bairros</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
                    {neighborhoods.map((ns, idx) => (
                        <motion.div
                            key={ns.id}
                            initial={{ opacity: 0, y: 80 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
                            className={`relative group ${ns.position === 'right' ? 'md:pt-24' : ''}`}
                        >
                            <div className="aspect-[3/4] overflow-hidden rounded-xl">
                                <Image
                                    src={ns.mainImage}
                                    alt={ns.name}
                                    width={800}
                                    height={1000}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            {ns.subImage && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: 0.4 + (idx * 0.2) }}
                                    className={`absolute hidden lg:block w-72 aspect-square overflow-hidden rounded-xl border-8 border-background shadow-2xl ${ns.position === 'left' ? '-bottom-10 -right-10' : '-top-10 -left-10'}`}
                                >
                                    <Image
                                        src={ns.subImage}
                                        alt={`${ns.name} detail`}
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            )}

                            <div className={`mt-8 space-y-4 max-w-lg ${ns.position === 'right' ? 'md:ml-auto' : ''}`}>
                                <h3 className="text-3xl font-serif font-bold text-slate-100">{ns.name}</h3>
                                <p className="text-slate-400 leading-relaxed font-light">
                                    {ns.description}
                                </p>
                                <Link href={`/bairros/${ns.id}`} className="text-primary font-bold flex items-center gap-2 border-b-2 border-primary/20 pb-1 w-max hover:border-primary transition-all">
                                    Explorar o Guia <span className="material-symbols-outlined">north_east</span>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

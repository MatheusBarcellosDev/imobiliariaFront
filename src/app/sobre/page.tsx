"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SobrePage() {
    return (
        <article className="min-h-screen pt-32 pb-24 dark bg-background-dark text-slate-100">
            <div className="max-w-7xl mx-auto px-6 md:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                >
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[1px] w-12 bg-primary" />
                            <span className="text-primary tracking-[0.3em] uppercase text-xs font-bold">Nossa História</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-8 leading-tight">
                            Referência em <i className="font-light text-primary/80">Alto Padrão</i>
                        </h1>
                        <p className="text-slate-300 text-lg leading-relaxed mb-6 font-light">
                            Com mais de 15 anos de atuação no mercado imobiliário de luxo, a Lorena Lorenzo tornou-se sinônimo de exclusividade, discrição e excelência.
                        </p>
                        <p className="text-slate-300 text-lg leading-relaxed font-light mb-10">
                            Nossa curadoria é minuciosa. Selecionamos apenas as propriedades mais extraordinárias para clientes que não abrem mão de arquitetura autoral e localizações privilegiadas.
                        </p>
                        <div className="flex gap-12">
                            <div>
                                <div className="text-4xl font-display text-primary mb-2">15+</div>
                                <div className="text-xs tracking-widest uppercase text-slate-500 font-bold">Anos de Mercado</div>
                            </div>
                            <div>
                                <div className="text-4xl font-display text-primary mb-2">R$ 2B</div>
                                <div className="text-xs tracking-widest uppercase text-slate-500 font-bold">VGV Gerado</div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                            alt="Lorena Lorenzo - CEO"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </article>
    );
}

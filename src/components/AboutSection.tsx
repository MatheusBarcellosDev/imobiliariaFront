"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./Button";

export default function AboutSection() {
    return (
        <section className="py-32 bg-background-dark relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex flex-col gap-8"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-[1px] w-12 bg-primary" />
                            <span className="text-primary tracking-[0.3em] uppercase text-xs font-bold">Sobre a Lorena Lorenzo</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-display text-slate-100 font-medium leading-tight">
                            Sua Parceira de Confiança no <br /> <i className="font-light text-primary/70">Mercado Imobiliário</i>
                        </h2>

                        <p className="text-slate-400 font-light text-lg leading-relaxed">
                            Há anos, Lorena Lorenzo tem ajudado diversas famílias a encontrarem seus lares ideais com dedicação, transparência e profissionalismo.
                            <br /><br />
                            Minha abordagem foca em entender suas necessidades reais e estilo de vida, garantindo um processo seguro e um atendimento próximo para realizar o seu melhor negócio.
                        </p>

                        <div>
                            <button className="text-primary font-bold flex items-center gap-2 border-b-2 border-primary/20 pb-1 hover:border-primary transition-all">
                                Conheça Minha História <span className="material-symbols-outlined">north_east</span>
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative aspect-square md:aspect-[3/4] lg:aspect-[4/5] w-full"
                    >
                        <Image
                            src="/lorenalorenzo.jpg"
                            alt="Interior de luxo Lorena Lorenzo"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover object-top rounded-xl"
                        />
                        {/* Decorational Frame */}
                        <div className="absolute -inset-4 border border-white/10 z-0 pointer-events-none rounded-xl" />
                        <div className="absolute -bottom-8 -left-8 bg-background-dark/80 p-8 glass-bronze hidden md:block z-10 rounded-xl">
                            <div className="text-3xl font-display font-bold text-primary mb-2 whitespace-nowrap">Mais de 4</div>
                            <div className="text-xs tracking-[0.2em] uppercase text-slate-400 font-bold whitespace-nowrap">Anos de Experiência</div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

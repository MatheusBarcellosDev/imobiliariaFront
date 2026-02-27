"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Button from "@/components/Button";

export default function ContatoPage() {
    return (
        <article className="min-h-screen pt-32 pb-24 bg-[#2a2419]/30 text-slate-100">
            <div className="max-w-7xl mx-auto px-6 md:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <span className="text-primary tracking-[0.3em] uppercase text-xs font-bold block mb-4">Fale com um Especialista</span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-6">
                        Exclusividade no <i className="font-light text-primary/80">Atendimento</i>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
                        Agende uma visita privativa, tire dúvidas sobre financiamentos VIP ou solicite a busca de uma propriedade "Off-Market".
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="glass-bronze p-10 md:p-14 rounded-3xl border border-white/10"
                    >
                        <h3 className="text-2xl font-display text-white mb-8">Envie uma Mensagem</h3>
                        <form className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm tracking-widest uppercase text-slate-400 font-medium">Seu Nome</label>
                                <input type="text" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-light" placeholder="Ex: Roberto Justos" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm tracking-widest uppercase text-slate-400 font-medium">E-mail</label>
                                    <input type="email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-light" placeholder="voce@email.com" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm tracking-widest uppercase text-slate-400 font-medium">Telefone / WhatsApp</label>
                                    <input type="tel" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-light" placeholder="(11) 99999-9999" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm tracking-widest uppercase text-slate-400 font-medium">Assunto / Imóvel de Interesse</label>
                                <textarea className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-light min-h-[120px] resize-none" placeholder="Estou buscando um lançamento na planta em Meia Praia..."></textarea>
                            </div>
                            <Button variant="primary" className="mt-4 flex items-center justify-center gap-2">
                                Enviar Solicitação <Send size={18} />
                            </Button>
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col justify-center gap-12"
                    >
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Phone className="text-primary" />
                            </div>
                            <div>
                                <h4 className="text-xl font-display text-white mb-2">Private Broker</h4>
                                <p className="text-slate-400 font-light leading-relaxed mb-2">Atendimento Imediato via WhatsApp ou Ligação.</p>
                                <a href="tel:+5511999999999" className="text-2xl font-light text-primary hover:text-white transition-colors">+55 (11) 99999-9999</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <Mail className="text-primary" />
                            </div>
                            <div>
                                <h4 className="text-xl font-display text-white mb-2">Contato Eletrônico</h4>
                                <p className="text-slate-400 font-light leading-relaxed mb-2">Dúvidas gerais, parcerias ou captações.</p>
                                <a href="mailto:contato@lorenalorenzo.com.br" className="text-xl font-light text-primary hover:text-white transition-colors">contato@lorenalorenzo.com.br</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <MapPin className="text-primary" />
                            </div>
                            <div>
                                <h4 className="text-xl font-display text-white mb-2">Office Boutique</h4>
                                <p className="text-slate-400 font-light leading-relaxed">
                                    Av. Atlântica, 3300 - Sala Exclusive<br />
                                    Balneário Camboriú, SC - Brasil
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </article>
    );
}

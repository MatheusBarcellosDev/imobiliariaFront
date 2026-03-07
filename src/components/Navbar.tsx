"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-white/10 ${scrolled ? "bg-background-dark/90 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-4"}`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-20 flex justify-between items-center text-slate-100">
                    <Link href="/" className="relative w-48 md:w-80 h-10 md:h-16 flex items-center justify-start overflow-hidden shrink-0">
                        <Image
                            src="/logo-v4.png"
                            alt="Lorena Lorenzo Logo"
                            fill
                            sizes="(max-width: 768px) 150px, 300px"
                            className="object-contain object-left"
                            priority
                        />
                    </Link>

                    <div className="hidden md:flex gap-10 items-center text-sm font-medium tracking-wide">
                        <Link href="/imoveis" className="text-slate-300 hover:text-primary transition-colors duration-300">Imóveis</Link>
                        <Link href="/bairros" className="text-slate-300 hover:text-primary transition-colors duration-300">Bairros</Link>
                        <Link href="/sobre" className="text-slate-300 hover:text-primary transition-colors duration-300">Sobre nós</Link>
                        <Link href="/contato" className="text-slate-300 hover:text-primary transition-colors duration-300">Contato</Link>
                    </div>

                    <div className="hidden md:flex gap-6 items-center">
                        <Link href="/login" className="bg-primary hover:bg-primary/90 text-background-dark px-6 py-2 rounded-lg text-sm font-bold transition-all inline-block text-center">
                            Acesso Membro
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-100">
                            {menuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Fullscreen Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-40 bg-background-dark flex flex-col items-center justify-center gap-8"
                    >
                        <Link href="/imoveis" onClick={() => setMenuOpen(false)} className="text-4xl font-display text-slate-100 hover:text-primary transition-colors">Imóveis</Link>
                        <Link href="/bairros" onClick={() => setMenuOpen(false)} className="text-4xl font-display text-slate-100 hover:text-primary transition-colors">Bairros</Link>
                        <Link href="/sobre" onClick={() => setMenuOpen(false)} className="text-4xl font-display text-slate-100 hover:text-primary transition-colors">Sobre nós</Link>
                        <Link href="/contato" onClick={() => setMenuOpen(false)} className="text-4xl font-display text-slate-100 hover:text-primary transition-colors">Contato</Link>
                        <Link href="/login" onClick={() => setMenuOpen(false)} className="text-xl font-display text-primary hover:text-white transition-colors mt-8">Acesso Membro</Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

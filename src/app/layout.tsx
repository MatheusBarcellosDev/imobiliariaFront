import type { Metadata } from "next";
import Image from "next/image";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lorena Lorenzo | Imóveis Extraordinários",
  description: "Encontre seu próximo lar na plataforma imobiliária mais premium do Brasil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} antialiased bg-background-dark text-slate-100 font-sans selection:bg-primary/30 min-h-screen overflow-x-hidden w-full max-w-[100vw]`}>
        <AuthProvider>
          <SmoothScrollProvider>
            <LayoutWrapper
              footer={
                <footer className="bg-background border-t border-white/10 py-20 px-6 md:px-20">
                  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6 col-span-1 md:col-span-1">
                      <div className="relative w-64 md:w-72 h-14 flex items-center justify-start">
                        <Image
                          src="/logo-v2.png"
                          alt="Lorena Lorenzo Logo"
                          fill
                          className="object-contain object-left"
                        />
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Especializados em encontrar o imóvel perfeito para você, com foco em atendimento personalizado e transparência.
                      </p>
                      <div className="flex gap-4">
                        <a className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                          <span className="material-symbols-outlined text-lg">public</span>
                        </a>
                        <a className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                          <span className="material-symbols-outlined text-lg">mail</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-slate-100 font-bold mb-6">Descobrir</h4>
                      <ul className="space-y-4 text-sm text-slate-400">
                        <li><a className="hover:text-primary transition-colors cursor-pointer">Casas & Sobrados</a></li>
                        <li><a className="hover:text-primary transition-colors cursor-pointer">Apartamentos</a></li>
                        <li><a className="hover:text-primary transition-colors cursor-pointer">Lançamentos</a></li>
                        <li><a className="hover:text-primary transition-colors cursor-pointer">Oportunidades</a></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-slate-100 font-bold mb-6">Serviços</h4>
                      <ul className="space-y-4 text-sm text-slate-400">
                        <li><a className="hover:text-primary transition-colors cursor-pointer">Compra e Venda</a></li>
                        <li><a className="hover:text-primary transition-colors cursor-pointer">Avaliação de Imóveis</a></li>
                        <li><a className="hover:text-primary transition-colors cursor-pointer">Assessoria Jurídica</a></li>
                        <li><a className="hover:text-primary transition-colors cursor-pointer">Financiamento</a></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-slate-100 font-bold mb-6">Newsletter</h4>
                      <p className="text-sm text-slate-400 mb-4">Receba as melhores oportunidades de imóveis no seu e-mail.</p>
                      <div className="flex gap-2">
                        <input className="bg-white/5 border border-white/10 rounded-lg text-sm px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-white" placeholder="Seu e-mail" type="email" />
                        <button className="bg-primary hover:bg-primary/80 text-background p-2 rounded-lg transition-colors">
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-xs">© 2026 Lorena Lorenzo Imóveis. Todos os direitos reservados.</p>
                    <div className="flex gap-8 text-xs text-slate-500">
                      <a className="hover:text-slate-300 cursor-pointer">Política de Privacidade</a>
                      <a className="hover:text-slate-300 cursor-pointer">Termos de Serviço</a>
                    </div>
                  </div>
                </footer>
              }
            >
              {children}
            </LayoutWrapper>
          </SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

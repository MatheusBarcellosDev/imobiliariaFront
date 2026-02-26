"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const neighborhoods = [
    {
        id: "jardins",
        name: "Jardins, São Paulo",
        description: "Um dos bairros mais arborizados e valorizados de São Paulo. Oferece infraestrutura completa, escolas renomadas, segurança e ruas tranquilas, ideais para o conforto e bem-estar da sua família.",
        mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQg9jQKSSLLC5wq7nTOovqVInhXQZTZf_0rgfukaLUiWNyWSSmxzrmij6aFT4Cav7n_67HqdLaV4ndkxRTHzQ96G_bMxXrc4-_E8TFsenVFsASsxHPrm1H1pFZsm9XwptC8QnbzZmQWiH_NZgJQT9aWei0VePce-_0RjRWkurPLQu_VxEXnTCd4OLeCyMWJU1vOY96QUxw8Xf0sGTTMF64Lh0xxDE0hHo2cE4KzEE5oF0yQmt_p2t9KkmquExgS7Kdd3QJw9Y394s",
        subImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFhgG6usvN6oWUOeknf8UT26JixkWfqVqc2YBrxADyORmiirtx14GNNy22N19QypjKQrpwiHpgauLPVJC7rjqa2iSWqu0ZBTHkAH7y5Vj78LeEzrbaPnQP423hcsBFiHW9FViIIdLpmvNNCSizBusNV6sYGnwUunlLyz9J_2ntQqTG7Slhdb45ROwPH9gYnSHf7IaotB5YXzu7WKHujZB4xo9jmnH0A_ygBltToOkp69Q-RhrH7iog_tNlk0qmNZhFHW6DPmgMG_s",
        position: "left"
    },
    {
        id: "leblon",
        name: "Leblon, Rio de Janeiro",
        description: "Qualidade de vida à beira-mar com o charme carioca. O Leblon oferece o cenário perfeito para famílias que buscam praticidade, excelentes opções de lazer ao ar livre e muita tranquilidade.",
        mainImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp8cnENdJ1drtHGRoSwW3lDSpgbBcSo2mJRFpruyWcQ3Vv-xwitXIhjiXVT8nU_tcyw55BcDjrsgC9o_keX1AGeMfIrXMXq0Bj60QFTOyKqx0T6BpO8r-_0Cm-CdBpgDM4PNW_-zcMoGRJrt1LT4cCRjR0l2YquAG6lKq_YPa2Pc1vvnpDD2h5XCXkDKdeiQgHGZSPuYylt0axlOOU9GNFT3RUNnNoXlFwh8fd7xNfymqBzPIbDzf_aQRr_0ZaEguuJ14Z3fPVQBU",
        subImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ9JZ_nq0Dt181PCvAXzw_rkP7k696kKlRcJebgxqVlHh8X35uD-HzGzOs6XVMuJ6qtJ-r3isboQ7-A8JIQt1IJJtYxGSApEg7zksbkWx8a6tQdi9l-WNGY-DpXrfs-HgfgGESKB3xlt_gWP77vZ7NJUC0dnnp44GGETGMq7x81e2mbsg9GqovD_im_uHgJugEffajaHeBVq6uzVV96euQqNseRACfaE5_rfi_J2Iajy789d-8oDsZikUJc0DNGQFOlOqFEnhGOSY",
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

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bath, BedDouble, SquareDashedBottom } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyCardProps {
    id?: string;
    title: string;
    price: string;
    neighborhood: string;
    beds: number;
    baths: number;
    area: number;
    image: string;
    featured?: boolean;
}

export default function PropertyCard({ id = "1", title, price, neighborhood, beds, baths, area, image, featured }: PropertyCardProps) {
    return (
        <Link href={`/imoveis/${id}`} className="block">
            <div className="group flex flex-col gap-5 cursor-pointer h-full">
                <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                    {featured && (
                        <div className="absolute top-4 left-4 bg-background-dark/60 backdrop-blur-md px-3 py-1 rounded text-primary text-xs font-bold uppercase tracking-widest">
                            Destaque
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-serif font-bold text-slate-100 group-hover:text-primary transition-colors">{title}</h3>
                            <p className="text-slate-400 text-sm mt-1">{neighborhood}</p>
                        </div>
                        <span className="text-primary font-bold text-[1rem] whitespace-nowrap">{price}</span>
                    </div>

                    <div className="flex gap-4 border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                            <span className="material-symbols-outlined text-xs text-primary/60">bed</span> {beds} Quartos
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                            <span className="material-symbols-outlined text-xs text-primary/60">bathtub</span> {baths} Banheiros
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                            <span className="material-symbols-outlined text-xs text-primary/60">square_foot</span> {area}m²
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

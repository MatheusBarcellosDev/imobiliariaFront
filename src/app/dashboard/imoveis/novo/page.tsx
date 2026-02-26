"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function NovoImovel() {
    const router = useRouter();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        area: "",
        bedrooms: "",
        bathrooms: "",
        garages: "",
        type: "Apartamento",
        status: "AVAILABLE",
        address: "",
        iptu: "",
        condoFee: "",
        yearBuilt: "",
    });

    const [amenities, setAmenities] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAmenityToggle = (amenity: string) => {
        setAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

            // 1. Montar payload do Imóvel (Apenas Dados - Upload será na próxima etapa)
            const payload = {
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price) || 0,
                area: parseFloat(formData.area) || 0,
                bedrooms: parseInt(formData.bedrooms) || 0,
                bathrooms: parseInt(formData.bathrooms) || 0,
                garages: parseInt(formData.garages) || 0,
                type: formData.type,
                status: formData.status,
                address: formData.address,
                iptu: formData.iptu ? parseFloat(formData.iptu) : undefined,
                condoFee: formData.condoFee ? parseFloat(formData.condoFee) : undefined,
                yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
                amenities: amenities,
                images: [],
                documents: [],
                featured: false
            };

            const postRes = await fetch(`${apiUrl}/properties`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (postRes.ok) {
                const responseData = await postRes.json();
                // Redireciona para o Gerenciador de Mídia do imóvel criado
                router.push(`/dashboard/imoveis/${responseData.id || responseData.property?.id}/midia`);
            } else {
                const err = await postRes.json();
                alert("Erro ao criar imóvel: " + (err.error || "Tente novamente."));
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro fatal ao salvar o imóvel.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-32">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/imoveis" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-colors">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">1. Dados do Imóvel</h1>
                    <p className="text-white/50 font-light text-sm">Preencha os detalhes técnicos. O envio de fotos de alta resolução e plantas será feito no próximo passo.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informações Básicas */}
                <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                    <h3 className="text-xl font-medium text-white mb-4 border-b border-white/10 pb-4">Informações Básicas</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm text-white/70">Título do Anúncio *</label>
                            <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Ex: Mansão Suspensa Leopoldo" />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm text-white/70">Descrição Curada *</label>
                            <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Conte a história e os diferenciais deste imóvel..." />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Valor (R$) *</label>
                            <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="35000000" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Endereço Privativo</label>
                            <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Rua Amauri, Itaim Bibi" />
                        </div>
                    </div>
                </div>

                {/* Especificações Técnicas */}
                <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                    <h3 className="text-xl font-medium text-white mb-4 border-b border-white/10 pb-4">Ficha Técnica e Financeira</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Área (m²)</label>
                            <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Quartos</label>
                            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Banheiros</label>
                            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Vagas</label>
                            <input type="number" name="garages" value={formData.garages} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Condomínio (Mensal)</label>
                            <input type="number" name="condoFee" value={formData.condoFee} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="R$ 15.000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/70">IPTU (Anual)</label>
                            <input type="number" name="iptu" value={formData.iptu} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="R$ 120.000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Ano de Construção</label>
                            <input type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="2024" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Tipo de Imóvel</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-[#1a160f] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
                                <option value="Apartamento">Apartamento de Luxo</option>
                                <option value="Casa">Casa Térrea / Mansão</option>
                                <option value="Cobertura">Cobertura Penthouse</option>
                                <option value="Terreno">Terreno Prêmium</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/70">Status do Negócio</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#1a160f] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
                                <option value="AVAILABLE">Disponível para Venda</option>
                                <option value="OFF_MARKET">Disponível (Off-Market)</option>
                                <option value="SOLD">Vendido</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Comodidades & Facilities */}
                <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                    <div>
                        <label className="text-xl font-medium text-white block mb-2">Comodidades Prêmium</label>
                        <p className="text-sm text-white/50 mb-6">Selecione as características principais deste imóvel.</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                "Piscina de Borda Infinita", "Home Theater", "Acabamentos Premium",
                                "Academia", "Adega Climatizada", "Varanda Gourmet", "Automação Residencial",
                                "Gerador", "Heliponto", "Sauna", "Vista Panorâmica", "Elevador Privativo"
                            ].map(amenit => (
                                <label key={amenit} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${amenities.includes(amenit) ? 'bg-primary border-primary' : 'border-white/20'}`}>
                                        {amenities.includes(amenit) && <Check size={14} className="text-black" />}
                                    </div>
                                    <span className="text-sm text-white/80">{amenit}</span>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={amenities.includes(amenit)}
                                        onChange={() => handleAmenityToggle(amenit)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-8">
                    <button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-background-dark px-10 py-4 rounded-xl font-bold transition-all flex items-center gap-3 disabled:opacity-50">
                        {loading ? <><Loader2 className="animate-spin" size={20} /> Salvando base...</> : "Continuar para Mídia & Fotos"}
                    </button>
                </div>
            </form>
        </div>
    );
}

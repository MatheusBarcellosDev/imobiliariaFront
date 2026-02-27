"use client";

import { useState, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2, Info, UploadCloud, GripVertical, Trash2, Star, FileText } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

type Tab = 'basic' | 'location' | 'features' | 'finance' | 'condo' | 'internal' | 'media';

export default function NovoImovelTabs() {
    const router = useRouter();
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('basic');

    // Estado Gigante Consolidado
    const [formData, setFormData] = useState({
        // Básico
        title: "", referenceCode: "", shortDescription: "", description: "", type: "Apartamento", status: "AVAILABLE", condition: "Usado",
        // Localização
        country: "Brasil", state: "", city: "", neighborhoodId: "", street: "", number: "", complement: "", zipCode: "",
        lat: "", lng: "", address: "",
        // Estrutura
        area: "", usefulArea: "", privateArea: "", landArea: "",
        bedrooms: "", suites: "", bathrooms: "", garages: "",
        floors: "", buildingFloors: "", aptsPerFloor: "",
        // Detalhes Técnicos
        sunOrientation: "", sunExposure: "", viewType: "", windowType: "", floorType: "", yearBuilt: "",
        // Valores Financeiros
        price: "", rentPrice: "", condoFee: "", iptu: "", maintenanceFee: "", debtBalance: "", remainingInstallments: "", commission: "",
        priceNegotiable: false, acceptsFinancing: false, acceptsExchange: false,
        // Condomínio e Comercial
        condoName: "", condoAdmin: "", condoBuilder: "", constructionProfile: "", totalUnits: "", totalElevators: "", zoning: "",
        // SEO
        seoTitle: "", seoDescription: "", seoKeywords: "",
        // Gestão Interna
        published: true, superFeatured: false, newRelease: false, hasBoard: false, exclusive: false,
        keyLocation: "", keyManager: "", managerName: "", managerPhone: "", internalNotes: "", visitInstructions: ""
    });

    const [amenities, setAmenities] = useState<string[]>([]);
    const [condoAmenities, setCondoAmenities] = useState<string[]>([]);
    const [exchangeOptions, setExchangeOptions] = useState<string[]>([]);

    // Estados de Mídia
    const [images, setImages] = useState<string[]>([]);
    const [documents, setDocuments] = useState<string[]>([]);
    const [uploadingInfo, setUploadingInfo] = useState<{ active: boolean; text: string }>({ active: false, text: "" });
    const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

    // Estado da Ação (Rascunho ou Publicar)
    const [submitType, setSubmitType] = useState<'DRAFT' | 'PUBLISH'>('DRAFT');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
        setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    // Lógicas de Upload
    const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>, isImage: boolean) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingInfo({ active: true, text: `Fazendo upload de ${e.target.files.length} arquivo(s)...` });
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
            const formData = new FormData();
            Array.from(e.target.files).forEach(f => formData.append("files", f));

            const res = await fetch(`${apiUrl}/upload`, { method: "POST", body: formData });
            const data = await res.json();

            if (data.urls) {
                if (isImage) setImages(prev => [...prev, ...data.urls]);
                else setDocuments(prev => [...prev, ...data.urls]);
            }
        } catch (error) {
            console.error(error);
            alert("Erro durante o upload.");
        } finally {
            setUploadingInfo({ active: false, text: "" });
        }
    };

    const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => setDraggedImageIndex(index);
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: DragEvent<HTMLDivElement>, targetIndex: number) => {
        e.preventDefault();
        if (draggedImageIndex === null || draggedImageIndex === targetIndex) return;
        const newImages = [...images];
        const [draggedItem] = newImages.splice(draggedImageIndex, 1);
        newImages.splice(targetIndex, 0, draggedItem);
        setDraggedImageIndex(null);
        setImages(newImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

            // Se for rascunho, bypassamos os fields vazios com fallbacks.
            const isDraft = submitType === 'DRAFT';

            const payload = {
                ...formData,
                title: formData.title || (isDraft ? "Rascunho de Imóvel" : ""),
                description: formData.description || (isDraft ? "Descrição pendente..." : ""),
                published: !isDraft,

                // Conversões Numéricas vitais
                price: parseFloat(formData.price) || 0,
                area: parseFloat(formData.area) || 0,
                bedrooms: parseInt(formData.bedrooms) || 0,
                bathrooms: parseInt(formData.bathrooms) || 0,
                garages: parseInt(formData.garages) || 0,
                // Arrays
                amenities,
                condoAmenities,
                exchangeOptions,
                images,
                documents
            };

            const postRes = await fetch(`${apiUrl}/properties`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (postRes.ok) {
                // Ao criar com sucesso, volta para a lista de imóveis.
                router.push(`/dashboard/imoveis`);
            } else {
                const err = await postRes.json();
                alert("Erro ao criar imóvel: " + (err.error || "Tente novamente."));
            }
        } catch (error) {
            console.error(error);
            alert("Erro fatal ao salvar o imóvel.");
        } finally {
            setLoading(false);
        }
    };

    // Navegação customizada rápida de tabs
    const TabButton = ({ id, label }: { id: Tab, label: string }) => (
        <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto pb-40">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/imoveis" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-colors shrink-0">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-3xl font-serif text-white mb-1">Cadastrar Mega Imóvel</h1>
                    <p className="text-white/50 font-light text-sm">Painel avançado de atributos operacionais, comerciais e de SEO.</p>
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex overflow-x-auto border-b border-white/10 mb-8 pb-px no-scrollbar">
                <TabButton id="basic" label="Informações Básicas" />
                <TabButton id="media" label="Fotos e Documentos" />
                <TabButton id="location" label="Localização" />
                <TabButton id="features" label="Estrutura e Técnicos" />
                <TabButton id="finance" label="Valores e Permuta" />
                <TabButton id="condo" label="Condomínio" />
                <TabButton id="internal" label="SEO e Gestão" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-40">

                {/* 1. BASIC INFO */}
                <div className={activeTab === 'basic' ? 'block space-y-6' : 'hidden'}>
                    <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Código de Referência (ID)</label>
                                <input name="referenceCode" value={formData.referenceCode} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary" placeholder="IMO-2024-001" />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm text-white/70">Título do Anúncio * (H1)</label>
                                <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary" placeholder="Apartamento 3 quartos com vista..." />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm text-white/70">Descrição Resumida (Cards)</label>
                                <input name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary" placeholder="Resumo ágil de 1 linha..." />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm text-white/70">Descrição Completa *</label>
                                <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary resize-none" placeholder="Descreva os diferenciais únicos..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Tipo de Imóvel *</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-[#1a160f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary">
                                    <option value="Apartamento">Apartamento</option>
                                    <option value="Casa">Casa</option>
                                    <option value="Cobertura">Cobertura Penthouse</option>
                                    <option value="Comercial">Sala Comercial</option>
                                    <option value="Terreno">Terreno Prêmium</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Finalidade (Status) *</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#1a160f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary">
                                    <option value="AVAILABLE">Venda</option>
                                    <option value="RENT">Locação</option>
                                    <option value="BOTH">Venda e Locação</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Condição / Etapa</label>
                                <select name="condition" value={formData.condition} onChange={handleChange} className="w-full bg-[#1a160f] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary">
                                    <option value="Usado">Usado</option>
                                    <option value="Novo">Novo</option>
                                    <option value="Em construção">Em construção</option>
                                    <option value="Na planta">Na planta</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. LOCATION */}
                <div className={activeTab === 'location' ? 'block space-y-6' : 'hidden'}>
                    <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">CEP</label>
                                <input name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" placeholder="00000-000" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Cidade</label>
                                <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" placeholder="Ex: Florianópolis" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Estado (UF)</label>
                                <input name="state" value={formData.state} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" placeholder="SC" />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm text-white/70">Rua / Endereço Completo</label>
                                <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" placeholder="Beira mar norte..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Número</label>
                                <input name="number" value={formData.number} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Complemento</label>
                                <input name="complement" value={formData.complement} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" placeholder="Apto 401, Bloco B" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. ESTRUTURA E TÉCNICO */}
                <div className={activeTab === 'features' ? 'block space-y-6' : 'hidden'}>
                    <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                        <h4 className="text-lg font-medium text-white mb-2">Cômodos e Áreas</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: "Área Total (m²)", name: "area" },
                                { label: "Área Útil", name: "usefulArea" },
                                { label: "Área Privativa", name: "privateArea" },
                                { label: "Área Terreno", name: "landArea" },
                                { label: "Quartos", name: "bedrooms" },
                                { label: "Suítes", name: "suites" },
                                { label: "Banheiros", name: "bathrooms" },
                                { label: "Vagas", name: "garages" },
                                { label: "Ano Construção", name: "yearBuilt" },
                                { label: "Andar (Imóvel)", name: "floors" },
                                { label: "Andares Prédio", name: "buildingFloors" },
                                { label: "Aptos/Andar", name: "aptsPerFloor" }
                            ].map(field => (
                                <div key={field.name} className="space-y-2">
                                    <label className="text-xs text-white/70 uppercase tracking-wider">{field.label}</label>
                                    <input type="number" name={field.name} value={(formData as any)[field.name]} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" />
                                </div>
                            ))}
                        </div>

                        <h4 className="text-lg font-medium text-white mb-2 pt-4 border-t border-white/10">Detalhes Técnicos</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {/* Selects Livres de Orientação */}
                            <div className="space-y-2">
                                <label className="text-xs text-white/70 uppercase">Posição Solar</label>
                                <select name="sunOrientation" value={formData.sunOrientation} onChange={handleChange} className="w-full bg-[#1a160f] border border-white/10 rounded-lg px-3 py-2 text-white">
                                    <option value="">Selecione...</option>
                                    <option value="Norte">Norte (Sol o dia todo)</option>
                                    <option value="Leste">Leste (Sol da Manhã)</option>
                                    <option value="Oeste">Oeste (Sol da Tarde)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-white/70 uppercase">Tipo de Piso</label>
                                <input name="floorType" value={formData.floorType} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" placeholder="Porcelanato, Madeira..." />
                            </div>
                        </div>

                        <h4 className="text-lg font-medium text-white mb-2 pt-8">Comodidades Internas do Imóvel</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                "Mobiliado", "Semi-mobiliado", "Aceita Pet", "Elevador Bivolt", "Piscina Privativa",
                                "Academia", "Varanda Gourmet", "Energia Solar", "Gerador Próprio", "Portaria 24h"
                            ].map(amenity => (
                                <label key={amenity} className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer">
                                    <input type="checkbox" checked={amenities.includes(amenity)} onChange={() => toggleArrayItem(setAmenities, amenity)} className="accent-primary w-4 h-4" />
                                    <span className="text-sm text-white/80">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. VALORES E PERMUTA */}
                <div className={activeTab === 'finance' ? 'block space-y-6' : 'hidden'}>
                    <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-sm text-white/70 font-medium">Preço de Venda (R$) *</label>
                                <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-white/5 border border-primary/50 rounded-lg px-4 py-3 text-white shadow-[0_0_15px_rgba(255,215,0,0.1)]" placeholder="Ex: 1500000" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Preço de Locação (R$)</label>
                                <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">IPTU Anual (R$)</label>
                                <input type="number" name="iptu" value={formData.iptu} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                            </div>
                        </div>

                        <div className="flex gap-8 border-t border-b border-white/10 py-6 my-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="priceNegotiable" checked={formData.priceNegotiable} onChange={handleChange} className="w-5 h-5 accent-primary" />
                                <span className="text-white">Preço Negociável</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="acceptsFinancing" checked={formData.acceptsFinancing} onChange={handleChange} className="w-5 h-5 accent-primary" />
                                <span className="text-white">Aceita Financiamento</span>
                            </label>
                        </div>

                        <h4 className="text-lg font-medium text-white mb-4">Condições Comerciais e Permuta</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Comissão Imobiliária (%)</label>
                                <input type="number" step="0.1" name="commission" value={formData.commission} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Saldo Devedor (R$)</label>
                                <input type="number" name="debtBalance" value={formData.debtBalance} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-3">
                            <label className="text-sm text-white/70 mb-2 block">Opções Extras de Permuta (Aceitação):</label>
                            {[
                                "Veículo como parte de pagamento",
                                "Imóvel menor valor como parte",
                                "Dação em pagamento (entrega bens)"
                            ].map((opt) => (
                                <label key={opt} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 w-fit">
                                    <input type="checkbox" checked={exchangeOptions.includes(opt)} onChange={() => toggleArrayItem(setExchangeOptions, opt)} className="w-5 h-5 accent-primary" />
                                    <span className="text-white/80">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. CONDOMINIO */}
                <div className={activeTab === 'condo' ? 'block space-y-6' : 'hidden'}>
                    <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Nome do Condomínio</label>
                                <input name="condoName" value={formData.condoName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Taxa Mensal (R$)</label>
                                <input type="number" name="condoFee" value={formData.condoFee} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Construtora Originária</label>
                                <input name="condoBuilder" value={formData.condoBuilder} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Total de Unidades no Condomínio</label>
                                <input type="number" name="totalUnits" value={formData.totalUnits} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" />
                            </div>
                        </div>

                        <h4 className="text-lg font-medium text-white mb-2 pt-6 border-t border-white/10">Infraestrutura Coletiva e Lazer</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                "Bicicletário", "Churrasqueira Coletiva", "Circuito de TV", "Condomínio Fechado",
                                "Playground", "Portaria Remota", "Quadra de Esportes", "Sala de Jogos", "Sauna",
                                "Spa", "Cinema", "Academia Equipada", "Piscina Aquecida", "Piscina Infantil",
                                "Coworking", "Pet Place", "Car Wash", "Vestiários"
                            ].map(feat => (
                                <label key={feat} className="flex items-center gap-2 p-2 rounded cursor-pointer group">
                                    <input type="checkbox" checked={condoAmenities.includes(feat)} onChange={() => toggleArrayItem(setCondoAmenities, feat)} className="accent-primary w-4 h-4 cursor-pointer" />
                                    <span className="text-xs text-white/60 group-hover:text-white transition-colors">{feat}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 6. SEO E GESTÃO INTERNA */}
                <div className={activeTab === 'internal' ? 'block space-y-6' : 'hidden'}>
                    <div className="glass p-8 rounded-2xl border border-white/10 space-y-6 mb-8">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                            <Info className="text-primary" size={20} />
                            <h3 className="text-xl font-medium text-white">SEO (Otimização Google)</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Meta Title (Título no Buscador)</label>
                                <input name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" placeholder="Apartamento de Alto Padrão em Jurerê - 4 Suítes" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Meta Description</label>
                                <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" placeholder="..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Palavras-chave (Vírgulas)</label>
                                <input name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white" placeholder="luxo, floripa, vista mar, cobertura" />
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-2xl border border-[#ff3333]/20 space-y-6 bg-[#ff3333]/5">
                        <h3 className="text-xl font-medium text-white mb-2 pb-4 border-b border-white/10">Controle Interno (Imobiliária)</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <label className="flex items-center gap-2 cursor-pointer p-3 bg-black/20 rounded">
                                <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="w-5 h-5 accent-emerald-500" />
                                <span className="text-white text-sm">Visível no Site</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-3 bg-black/20 rounded">
                                <input type="checkbox" name="exclusive" checked={formData.exclusive} onChange={handleChange} className="w-5 h-5 accent-primary" />
                                <span className="text-white text-sm">Exclusividade</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-3 bg-black/20 rounded">
                                <input type="checkbox" name="hasBoard" checked={formData.hasBoard} onChange={handleChange} className="w-5 h-5 accent-primary" />
                                <span className="text-white text-sm">Possui Placa Física</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                                <input type="checkbox" name="superFeatured" checked={formData.superFeatured} onChange={handleChange} className="w-5 h-5 accent-yellow-500" />
                                <span className="text-yellow-500 text-sm font-bold">Super Destaque</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Localização das Chaves</label>
                                <input name="keyLocation" value={formData.keyLocation} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white" placeholder="Cofre 2, Gancho 15" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-white/70">Zelador / Porteiro (Contato)</label>
                                <input name="managerName" value={formData.managerName} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white" placeholder="Sr. João - (11) 9999-9999" />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm text-white/70">Notas Privadas / Instruções de Visita</label>
                                <textarea name="internalNotes" value={formData.internalNotes} rows={3} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white/80 font-mono text-sm" placeholder="O proprietário só permite visitas após as 14h..." />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. MEDIA (FOTOS E DOCS) */}
                <div className={activeTab === 'media' ? 'block space-y-6' : 'hidden'}>
                    {uploadingInfo.active && (
                        <div className="w-full bg-primary/20 border border-primary text-primary px-4 py-3 rounded-lg flex items-center gap-3 animate-pulse">
                            <Loader2 size={18} className="animate-spin" />
                            <span className="font-medium text-sm">{uploadingInfo.text}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* IMAGENS */}
                        <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <h3 className="text-xl font-medium text-white">Galeria de Fotos</h3>
                                <label className="bg-primary hover:bg-primary/90 text-background-dark px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2">
                                    <UploadCloud size={16} /> Adicionar Fotos
                                    <input type="file" multiple accept="image/*" onChange={(e) => handleUploadFiles(e, true)} className="hidden" />
                                </label>
                            </div>
                            <p className="text-xs text-white/50">A primeira foto com a estrela (<Star size={12} className="inline" />) aparecerá na vitrine como destaque. Arraste as fotos para ordernar.</p>
                            <div className="space-y-3">
                                {images.length === 0 ? (
                                    <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-black/20 text-white/40 text-sm">Nenhuma foto anexada.</div>
                                ) : (
                                    images.map((url, idx) => (
                                        <div
                                            key={url + idx} draggable onDragStart={(e) => handleDragStart(e, idx)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, idx)}
                                            className={`flex items-center gap-4 bg-[#1a160f] border border-white/10 rounded-xl p-3 shadow-lg group transition-all cursor-grab active:cursor-grabbing ${draggedImageIndex === idx ? 'opacity-50 scale-95' : 'opacity-100'}`}
                                        >
                                            <div className="text-white/30 group-hover:text-white/70 px-2 cursor-grab"><GripVertical size={20} /></div>
                                            <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 bg-black/50">
                                                <Image src={url} alt="Thb" fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm truncate">{url.split('/').pop()}</p>
                                                {idx === 0 && <span className="text-xs text-primary font-bold flex items-center gap-1 w-fit mt-1"><Star size={12} fill="currentColor" /> Destaque Oficial</span>}
                                            </div>
                                            <button type="button" onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))} className="p-2 text-white/30 hover:text-red-400 rounded-lg">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* DOCUMENTOS */}
                        <div className="glass p-8 rounded-2xl border border-white/10 space-y-6 self-start">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <h3 className="text-xl font-medium text-white">Documentos Ocultos</h3>
                                <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2">
                                    <FileText size={16} /> Anexar DOCs
                                    <input type="file" multiple accept=".pdf,.doc,.docx" onChange={(e) => handleUploadFiles(e, false)} className="hidden" />
                                </label>
                            </div>
                            <p className="text-xs text-white/50">Plantas baixas, IPTU, escrituras. Visíveis somente para a administração e clientes aprovados.</p>
                            <div className="space-y-3">
                                {documents.length === 0 ? (
                                    <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-black/20 text-white/40 text-sm">Nenhum documento salvo.</div>
                                ) : (
                                    documents.map((url, idx) => (
                                        <div key={url + idx} className="flex items-center gap-4 bg-[#1a160f] border border-white/10 rounded-xl p-3 shadow-lg">
                                            <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center text-white/50 shrink-0"><FileText size={20} /></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm truncate">{url.split('/').pop()}</p>
                                            </div>
                                            <button type="button" onClick={() => setDocuments(prev => prev.filter((_, i) => i !== idx))} className="p-2 text-white/30 hover:text-red-400 rounded-lg">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SUBMIT FIXO NO RODAPÉ */}
                <div className="fixed bottom-0 left-0 w-full bg-background-dark/95 backdrop-blur-xl border-t border-white/10 p-6 z-40 flex justify-end gap-4 px-10 md:px-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-all">

                    <div className="flex-1 max-w-6xl mx-auto flex justify-end items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            formNoValidate
                            onClick={() => setSubmitType('DRAFT')}
                            className="bg-transparent hover:bg-white/5 border border-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50 min-w-[220px]"
                        >
                            {loading && submitType === 'DRAFT' ? <Loader2 className="animate-spin" size={20} /> : "Salvar como Rascunho"}
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            onClick={() => setSubmitType('PUBLISH')}
                            className="bg-primary hover:bg-primary/90 text-background-dark px-10 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-lg tracking-wide min-w-[240px] shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]"
                        >
                            {loading && submitType === 'PUBLISH' ? <Loader2 className="animate-spin" size={24} /> : "Publicar Oficialmente"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

"use client";

import { useState, useEffect, DragEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, UploadCloud, FileText, Check, Loader2, GripVertical, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

interface Property {
    id: string;
    title: string;
    images: string[];
    documents: string[];
}

export default function GerenciadorMidia() {
    const router = useRouter();
    const params = useParams();
    const { id } = params as { id: string };
    const { token } = useAuth();

    const [property, setProperty] = useState<Property | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [documents, setDocuments] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);
    const [uploadingInfo, setUploadingInfo] = useState<{ active: boolean; text: string }>({ active: false, text: "" });

    // Drag and Drop state para index da imagem arrastada
    const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!token) return;
        fetchProperty();
    }, [token, id]);

    const fetchProperty = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
            const res = await fetch(`${apiUrl}/properties/${id}`);
            if (res.ok) {
                const data = await res.json();
                setProperty(data.property);
                setImages(data.property.images || []);
                setDocuments(data.property.documents || []);
            } else {
                alert("Não foi possível carregar o imóvel.");
                router.push("/dashboard/imoveis");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const saveMediaToDatabase = async (newImages: string[], newDocuments: string[]) => {
        setUploadingInfo({ active: true, text: "Salvando alterações no banco..." });
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
            await fetch(`${apiUrl}/properties/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    images: newImages,
                    documents: newDocuments
                })
            });
            setImages(newImages);
            setDocuments(newDocuments);
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar ordem no banco de dados.");
        } finally {
            setUploadingInfo({ active: false, text: "" });
        }
    };

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
                if (isImage) {
                    await saveMediaToDatabase([...images, ...data.urls], documents);
                } else {
                    await saveMediaToDatabase(images, [...documents, ...data.urls]);
                }
            }
        } catch (error) {
            console.error(error);
            alert("Erro durante o upload de arquivos.");
        } finally {
            setUploadingInfo({ active: false, text: "" });
        }
    };

    const removeImage = async (indexToRemove: number) => {
        if (!confirm("Tem certeza que deseja remover esta foto?")) return;
        const newImages = images.filter((_, i) => i !== indexToRemove);
        await saveMediaToDatabase(newImages, documents);
    };

    const removeDocument = async (indexToRemove: number) => {
        if (!confirm("Tem certeza que deseja remover este documento?")) return;
        const newDocs = documents.filter((_, i) => i !== indexToRemove);
        await saveMediaToDatabase(images, newDocs);
    };

    // --- Lógica Drag and Drop de Imagens ---
    const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        setDraggedImageIndex(index);
        // e.dataTransfer.setData("text/plain", index.toString()); // Opcional, o React state segura bem
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessário para permitir o drop
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>, targetIndex: number) => {
        e.preventDefault();
        if (draggedImageIndex === null || draggedImageIndex === targetIndex) return;

        // Reordenar o array
        const newImages = [...images];
        const [draggedItem] = newImages.splice(draggedImageIndex, 1);
        newImages.splice(targetIndex, 0, draggedItem);

        // Limpar visual
        setDraggedImageIndex(null);

        // Salvar imediatamente a nova ordem
        await saveMediaToDatabase(newImages, documents);
    };

    const setAsFeatured = async (index: number) => {
        if (index === 0) return; // Se já é a primeira, já é destaque.
        const newImages = [...images];
        const [item] = newImages.splice(index, 1);
        newImages.unshift(item); // Coloca na posição 0
        await saveMediaToDatabase(newImages, documents);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white"><Loader2 className="animate-spin w-10 h-10 text-primary" /></div>;
    if (!property) return null;

    return (
        <div className="max-w-5xl mx-auto pb-32">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/imoveis" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-colors">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <div className="text-primary text-xs uppercase tracking-widest font-bold mb-1">Passo 2 de 2</div>
                    <h1 className="text-3xl font-serif text-white mb-2">Acervo Digital: {property.title}</h1>
                    <p className="text-white/50 font-light text-sm">Gerencie fotos e documentos. Arraste (Drag & Drop) para reordenar a galeria.</p>
                </div>
            </div>

            {uploadingInfo.active && (
                <div className="w-full bg-primary/20 border border-primary text-primary px-4 py-3 rounded-lg flex items-center gap-3 mb-6 animate-pulse">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="font-medium text-sm">{uploadingInfo.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* BLOKO IMAGENS */}
                <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <h3 className="text-xl font-medium text-white">Galeria de Fotos</h3>
                        <label className="bg-primary hover:bg-primary/90 text-background-dark px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2">
                            <UploadCloud size={16} /> Adicionar Fotos
                            <input type="file" multiple accept="image/*" onChange={(e) => handleUploadFiles(e, true)} className="hidden" />
                        </label>
                    </div>

                    <p className="text-xs text-white/50">A primeira foto com a estrela (<Star size={12} className="inline" />) aparecerá na vitrine como destaque principal. Arraste as fotos para mudar a ordem.</p>

                    <div className="space-y-3">
                        {images.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-black/20 text-white/40 text-sm">Nenhuma foto cadastrada ainda.</div>
                        ) : (
                            images.map((url, idx) => (
                                <div
                                    key={url + idx}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, idx)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, idx)}
                                    className={`flex items-center gap-4 bg-[#1a160f] border border-white/10 rounded-xl p-3 shadow-lg group transition-all cursor-grab active:cursor-grabbing ${draggedImageIndex === idx ? 'opacity-50 scale-95' : 'opacity-100 hover:border-white/30'}`}
                                >
                                    <div className="text-white/30 group-hover:text-white/70 px-2 cursor-grab">
                                        <GripVertical size={20} />
                                    </div>
                                    <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 bg-black/50">
                                        <Image src={url} alt="Thumbnail" fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm truncate">{url.split('/').pop()}</p>
                                        <div className="flex gap-2 mt-1">
                                            {idx === 0 ? (
                                                <span className="text-xs text-primary font-bold flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full"><Star size={12} fill="currentColor" /> Destaque Oficial</span>
                                            ) : (
                                                <button onClick={() => setAsFeatured(idx)} className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors"><Star size={12} /> Definir Destaque</button>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => removeImage(idx)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* BLOKO DOCUMENTOS */}
                <div className="glass p-8 rounded-2xl border border-white/10 space-y-6 self-start">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <h3 className="text-xl font-medium text-white">Documentação</h3>
                        <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2">
                            <FileText size={16} /> Anexar DOCs
                            <input type="file" multiple accept=".pdf,.doc,.docx" onChange={(e) => handleUploadFiles(e, false)} className="hidden" />
                        </label>
                    </div>

                    <p className="text-xs text-white/50">Faça o upload de plantas baixas, matrículas e laudos do imóvel. Apenas a planta baixa e afins serão visíveis aos clientes, mediante liberação.</p>

                    <div className="space-y-3">
                        {documents.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-black/20 text-white/40 text-sm">Nenhum documento salvo.</div>
                        ) : (
                            documents.map((url, idx) => (
                                <div key={url + idx} className="flex items-center gap-4 bg-[#1a160f] border border-white/10 rounded-xl p-3 shadow-lg">
                                    <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center text-white/50 shrink-0">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm truncate">{url.split('/').pop()}</p>
                                        <a href={url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">Baixar Arquivo</a>
                                    </div>
                                    <button onClick={() => removeDocument(idx)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-12">
                <Link href="/dashboard/imoveis" className="text-white hover:text-primary transition-colors flex items-center gap-2 font-medium">
                    <Check size={18} /> Acervo concluído, voltar à listagem
                </Link>
            </div>
        </div>
    );
}

export interface Neighborhood {
    id: string;
    name: string;
    description?: string;
    image?: string;
    _count?: {
        properties: number;
    };
    properties?: Property[];
    avgPrice?: number;
}


// Interfaces (Typings) baseadas nos modelos do Prisma
export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    area: number;
    bedrooms: number;
    bathrooms: number;
    garages: number;
    type: string;
    status: string;
    images?: string[];
    featured?: boolean;
    amenities?: string[];
    documents?: string[];
    iptu?: number | null;
    condoFee?: number | null;
    yearBuilt?: number | null;
    floorPlan?: string | null;

    // Informações Básicas Adicionais
    referenceCode?: string | null;
    shortDescription?: string | null;
    condition?: string | null;

    // Preços e Valores Financeiros Adicionais
    rentPrice?: number | null;
    maintenanceFee?: number | null;
    priceNegotiable?: boolean;
    acceptsFinancing?: boolean;
    acceptsExchange?: boolean;

    // Localização Completa Adicional
    country?: string;
    state?: string | null;
    city?: string | null;
    street?: string | null;
    number?: string | null;
    complement?: string | null;
    zipCode?: string | null;

    // Cômodos e Estrutura Adicionais
    suites?: number;
    usefulArea?: number | null;
    privateArea?: number | null;
    landArea?: number | null;
    floors?: number | null;
    buildingFloors?: number | null;
    aptsPerFloor?: number | null;

    // Detalhes Técnicos
    sunOrientation?: string | null;
    sunExposure?: string | null;
    viewType?: string | null;
    windowType?: string | null;
    floorType?: string | null;

    // Informações do Condomínio
    condoName?: string | null;
    condoAdmin?: string | null;
    condoBuilder?: string | null;
    constructionProfile?: string | null;
    totalUnits?: number | null;
    totalElevators?: number | null;
    condoAmenities?: string[];

    // Informações Comerciais e Permuta
    zoning?: string | null;
    commission?: number | null;
    debtBalance?: number | null;
    remainingInstallments?: number | null;
    exchangeOptions?: string[];

    // SEO
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string | null;

    // Status e Gestão Interna
    published?: boolean;
    superFeatured?: boolean;
    newRelease?: boolean;
    hasBoard?: boolean;
    exclusive?: boolean;

    keyLocation?: string | null;
    keyManager?: string | null;
    managerName?: string | null;
    managerPhone?: string | null;
    internalNotes?: string | null;
    visitInstructions?: string | null;

    neighborhoodId?: string | null;
    neighborhood?: Neighborhood | null;

    address?: string | null;
    lat?: number | null;
    lng?: number | null;
    createdAt?: string; // Added based on original Property interface
    updatedAt?: string; // Added based on original Property interface
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://imobiliariaback.onrender.com/api';

export const getProperties = async (): Promise<Property[]> => {
    try {
        const response = await fetch(`${API_URL}/properties`, {
            next: { revalidate: 60 } // Next.js standard caching: revalidate every minute
        });

        if (!response.ok) {
            throw new Error('Falha ao buscar imóveis');
        }

        const data = await response.json();
        return data.properties;
    } catch (error) {
        console.error("Erro em getProperties:", error);
        return [];
    }
};

export const getPropertyById = async (id: string): Promise<Property | null> => {
    try {
        const response = await fetch(`${API_URL}/properties/${id}`, {
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.property;
    } catch (error) {
        console.error("Erro em getPropertyById:", error);
        return null;
    }
};

export const getNeighborhoods = async (): Promise<Neighborhood[]> => {
    try {
        const response = await fetch(`${API_URL}/neighborhoods`, {
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.neighborhoods;
    } catch (error) {
        console.error("Erro em getNeighborhoods:", error);
        return [];
    }
};

export const getNeighborhoodById = async (id: string): Promise<{ neighborhood: Neighborhood, avgPrice: number } | null> => {
    try {
        const response = await fetch(`${API_URL}/neighborhoods/${id}`, {
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const neighborhoodWithPrice = data.neighborhood;
        neighborhoodWithPrice.avgPrice = data.avgPrice;
        return { neighborhood: neighborhoodWithPrice, avgPrice: data.avgPrice };
    } catch (error) {
        console.error("Erro em getNeighborhoodById:", error);
        return null;
    }
};

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    source: string;
    status: string;
    message?: string;
    createdAt: string;
    updatedAt: string;
}

export const getLeads = async (token: string): Promise<Lead[]> => {
    try {
        const response = await fetch(`${API_URL}/leads`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.leads;
    } catch (error) {
        console.error("Erro em getLeads:", error);
        return [];
    }
};

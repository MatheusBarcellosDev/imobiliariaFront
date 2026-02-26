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
    address: string;
    images: string[];
    neighborhoodId?: string;
    neighborhood?: {
        name: string;
    };
    featured: boolean;
    amenities?: string[];
    createdAt: string;
    updatedAt: string;
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

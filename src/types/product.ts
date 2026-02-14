export interface IProduct {
    id?: number;
    name: string;
    description?: string;
    price: number;
    category: string;
    rating?: number;
    image_url?: string;
    template_id?: string | null;
    created_at?: Date;
}

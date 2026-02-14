export interface IProductClient {
  id: string;
  name: string;
  price: number;
  category: string;
  rating?: number;
  image_url?: string;
}
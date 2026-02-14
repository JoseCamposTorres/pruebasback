import { ProductClient } from "../models/productClientModel";
import { IProductClient } from "../types/productClient";

export const ProductClientService = {
  getAllProducts: async (): Promise<IProductClient[]> => {
    const products = await ProductClient.findAll();

    if (products.length === 0) {
      const error: any = new Error("No hay productos disponibles en la tienda");
      error.statusCode = 404;
      throw error;
    }

    return products;
  },

  searchProducts: async (name: string, category: string): Promise<IProductClient[]> => {
    const products = await ProductClient.search(name, category);

    if (products.length === 0) {
      const error: any = new Error("No se encontraron productos con esos criterios");
      error.statusCode = 404;
      throw error;
    }

    return products;
  },

  getCategories: async (): Promise<string[]> => {
    const categories = await ProductClient.getCategories();
    return categories;
  }
};

import { Product } from "../models/productModel";
import { IProduct } from "../types/product";

export const ProductAdminService = {
    createProduct: async (productData: IProduct): Promise<IProduct> => {
        const id = await Product.create(productData);
        const newProduct = await Product.findById(id);
        if (!newProduct) {
            const error: any = new Error("Error al crear el producto");
            error.statusCode = 500;
            throw error;
        }
        return newProduct;
    },

    updateProduct: async (id: number, productData: Partial<IProduct>): Promise<IProduct> => {
        const exists = await Product.findById(id);
        if (!exists) {
            const error: any = new Error("Producto no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const updated = await Product.update(id, productData);
        if (!updated) {
            const error: any = new Error("No se realizaron cambios en el producto");
            error.statusCode = 400;
            throw error;
        }

        const updatedProduct = await Product.findById(id);
        return updatedProduct!;
    },

    deleteProduct: async (id: number): Promise<void> => {
        const exists = await Product.findById(id);
        if (!exists) {
            const error: any = new Error("Producto no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const deleted = await Product.delete(id);
        if (!deleted) {
            const error: any = new Error("Error al eliminar el producto");
            error.statusCode = 500;
            throw error;
        }
    }
};

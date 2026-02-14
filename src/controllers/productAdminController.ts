import { Request, Response } from "express";
import { ProductAdminService } from "../services/productAdminService";

export const createProduct = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const product = await ProductAdminService.createProduct(req.body);
        res.status(201).json({
            status: "success",
            message: "Producto creado exitosamente",
            data: product,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });
    }
};

export const updateProduct = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await ProductAdminService.updateProduct(
            Number(id),
            req.body,
        );
        res.status(200).json({
            status: "success",
            message: "Producto actualizado exitosamente",
            data: product,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });
    }
};

export const deleteProduct = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        await ProductAdminService.deleteProduct(Number(id));
        res.status(200).json({
            status: "success",
            message: "Producto eliminado exitosamente",
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message,
        });
    }
};

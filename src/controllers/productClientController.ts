import { Request, Response } from 'express';
import { ProductClientService } from '../services/productClientService';

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await ProductClientService.getAllProducts();
    res.status(200).json({
      status: "success",
      results: data.length,
      data
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message
    });
  }
};

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category } = req.query;

    const data = await ProductClientService.searchProducts(
      name as string,
      category as string
    );

    res.status(200).json({
      status: "success",
      results: data.length,
      data
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message
    });
  }
};

export const listCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await ProductClientService.getCategories();
    res.status(200).json({
      status: "success",
      results: data.length,
      data
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message
    });
  }
};

import db from "../config/db";
import { IProductClient } from "../types/productClient";

export const ProductClient = {
  findAll: async (): Promise<IProductClient[]> => {
    const [rows] = await db.query("SELECT * FROM products");
    return rows as IProductClient[];
  },

  search: async (
    name?: string,
    category?: string
  ): Promise<IProductClient[]> => {
    let query = "SELECT * FROM products WHERE 1=1";
    const params: any[] = [];

    if (name) {
      query += " AND name LIKE ?";
      params.push(`%${name}%`);
    }

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    const [rows] = await db.query(query, params);
    return rows as IProductClient[];
  },

  getCategories: async (): Promise<string[]> => {
    const [rows]: any = await db.query("SELECT DISTINCT category FROM products WHERE category IS NOT NULL");
    return rows.map((row: any) => row.category);
  }
};

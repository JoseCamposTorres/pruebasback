import db from "../config/db";
import { IProduct } from "../types/product";
import { ResultSetHeader } from "mysql2";

export const Product = {
    create: async (product: IProduct): Promise<number> => {
        const { name, description, price, category, image_url } = product;
        const [result] = await db.query<ResultSetHeader>(
            "INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)",
            [name, description, price, category, image_url]
        );
        return result.insertId;
    },

    update: async (id: number, product: Partial<IProduct>): Promise<boolean> => {
        const fields = Object.keys(product).filter(key => key !== 'id' && key !== 'created_at');
        if (fields.length === 0) return false;

        const setClause = fields.map(field => `${field} = ?`).join(", ");
        const values = fields.map(field => (product as any)[field]);
        values.push(id);

        const [result] = await db.query<ResultSetHeader>(
            `UPDATE products SET ${setClause} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    },

    delete: async (id: number): Promise<boolean> => {
        const [result] = await db.query<ResultSetHeader>(
            "DELETE FROM products WHERE id = ?",
            [id]
        );
        return result.affectedRows > 0;
    },

    findById: async (id: number): Promise<IProduct | null> => {
        const [rows] = await db.query<any[]>("SELECT * FROM products WHERE id = ?", [id]);
        return rows.length > 0 ? (rows[0] as IProduct) : null;
    }
};

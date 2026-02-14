import db from "../config/db";
import { IUser } from "../types/user";

export const User = {
  findAll: async (): Promise<IUser[]> => {
    const [rows]: any = await db.query(
      "SELECT * FROM user ORDER BY dateCreate DESC"
    );
    return rows as IUser[];
  },

  findById: async (id: number): Promise<IUser | null> => {
    const [rows]: any = await db.query("SELECT * FROM user WHERE id = ?", [id]);
    if (!rows || rows.length === 0) return null;
    return rows[0] as IUser;
  },

  findByEmail: async (email: string): Promise<IUser | null> => {
    const [rows]: any = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    if (!rows || rows.length === 0) return null;
    return rows[0] as IUser;
  },

  findByUsername: async (username: string): Promise<IUser | null> => {
    const [rows]: any = await db.query("SELECT * FROM user WHERE username = ?", [username]);
    if (!rows || rows.length === 0) return null;
    return rows[0] as IUser;
  },

  create: async (user: Omit<IUser, "id" | "dateCreate">): Promise<number> => {
    const [result]: any = await db.query(
      "INSERT INTO user (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)",
      [user.username, user.email, user.password, user.role, user.status]
    );
    return result.insertId;
  },

  update: async (id: number, fields: Partial<Omit<IUser, "id" | "dateCreate">>): Promise<void> => {
    const keys = Object.keys(fields) as (keyof typeof fields)[];
    if (keys.length === 0) return;

    const setClauses = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => fields[k]);

    await db.query(`UPDATE user SET ${setClauses} WHERE id = ?`, [...values, id]);
  },

  delete: async (id: number): Promise<void> => {
    await db.query("DELETE FROM user WHERE id = ?", [id]);
  },
};

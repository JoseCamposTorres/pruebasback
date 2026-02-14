import bcrypt from "bcryptjs";
import { User } from "../models/userModel";
import { IUser } from "../types/user";

const createError = (message: string, statusCode: number) => {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const omitPassword = (user: IUser): Omit<IUser, "password"> => {
  const { password, ...rest } = user;
  return rest;
};

export const UserService = {
  getAllUsers: async () => {
    const users = await User.findAll();
    return users.map(omitPassword);
  },

  getUserById: async (id: number) => {
    const user = await User.findById(id);
    if (!user) throw createError("Usuario no encontrado", 404);
    return omitPassword(user);
  },

  createUser: async (data: {
    username: string;
    email: string;
    password: string;
    role: IUser["role"];
    status: IUser["status"];
  }) => {
    const { username, email, password, role, status } = data;

    if (!username || !email || !password) {
      throw createError("Username, email y password son requeridos", 400);
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      throw createError("Ya existe un usuario con ese email", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      status: status || "activo",
    });

    return { id, username, email, role: role || "user", status: status || "activo" };
  },

  updateUser: async (id: number, data: Partial<Omit<IUser, "id" | "dateCreate">>) => {
    const user = await User.findById(id);
    if (!user) throw createError("Usuario no encontrado", 404);

    const fields: Partial<Omit<IUser, "id" | "dateCreate">> = {};

    if (data.username) fields.username = data.username;
    if (data.email) {
      if (data.email !== user.email) {
        const existing = await User.findByEmail(data.email);
        if (existing) throw createError("Ya existe un usuario con ese email", 409);
      }
      fields.email = data.email;
    }
    if (data.password) {
      fields.password = await bcrypt.hash(data.password, 10);
    }
    if (data.role) fields.role = data.role;
    if (data.status) fields.status = data.status;

    await User.update(id, fields);
    return { message: "Usuario actualizado correctamente" };
  },

  deleteUser: async (id: number, requestingUserId: number) => {
    if (id === requestingUserId) {
      throw createError("No puedes eliminar tu propia cuenta", 400);
    }

    const user = await User.findById(id);
    if (!user) throw createError("Usuario no encontrado", 404);

    await User.delete(id);
    return { message: "Usuario eliminado correctamente" };
  },
};

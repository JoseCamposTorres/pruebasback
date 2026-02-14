import { Request, Response } from "express";
import { UserService } from "../services/userService";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({
      status: "success",
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error al listar usuarios",
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const user = await UserService.getUserById(id);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error al obtener usuario",
    });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await UserService.createUser(req.body);
    res.status(201).json({
      status: "success",
      message: "Usuario creado exitosamente",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error al crear usuario",
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const result = await UserService.updateUser(id, req.body);
    res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error al actualizar usuario",
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const requestingUserId = (req as any).user?.id;
    const result = await UserService.deleteUser(id, requestingUserId);
    res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error al eliminar usuario",
    });
  }
};

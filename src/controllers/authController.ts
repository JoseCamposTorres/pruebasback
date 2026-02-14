import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/userModel";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username y password son requeridos" });
    }

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    if (user.status !== "activo") {
      return res
        .status(403)
        .json({ message: "Tu cuenta esta inactiva o bloqueada" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" },
    );

    return res.json({
      status: "success",
      token,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error?.message || "Error interno en login",
    });
  }
};

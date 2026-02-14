import { Request, Response } from "express";
import { EmailVerificationService } from "../services/emailVerificationService";

export const sendVerificationCode = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;
    await EmailVerificationService.sendCode(email);

    res.status(200).json({
      status: "success",
      message: "Codigo de verificacion enviado",
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error al enviar el codigo de verificacion",
    });
  }
};

export const verifyEmailCode = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400).json({
        status: "error",
        message: "Email y codigo son requeridos",
      });
      return;
    }

    const isValid = EmailVerificationService.verifyCode(email, code);

    if (!isValid) {
      res.status(400).json({
        status: "error",
        message: "Codigo incorrecto o expirado",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Email verificado correctamente",
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error al verificar el codigo",
    });
  }
};

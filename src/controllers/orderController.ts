import { Request, Response } from "express";
import { OrderService } from "../services/orderService";

export const uploadPhotos = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      res
        .status(400)
        .json({ status: "error", message: "No se enviaron fotos" });
      return;
    }

    const urls = files.map((f) => `/uploads/${f.filename}`);

    res.status(200).json({ status: "success", urls });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message || "Error al subir fotos",
    });
  }
};

export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        status: "error",
        message: "Archivo de comprobante no enviado",
      });
      return;
    }

    const result = await OrderService.createOrder({
      customer_name: req.body.customer_name,
      phone_number: req.body.phone_number,
      email: req.body.email,
      notification_preference: req.body.notification_preference,
      message: req.body.message,
      file_url: `/uploads/${req.file.filename}`,
      items: req.body.items,
      total_amount: req.body.total_amount,
      template_id: req.body.template_id,
    });

    res.status(201).json({
      status: "success",
      message: "Pedido registrado exitosamente",
      tracking_code: result.tracking_code,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error interno del servidor",
    });
  }
};

export const trackOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const code = req.params.code as string;
    const result = await OrderService.getOrderByTrackingCode(code);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error al consultar el pedido",
    });
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orders = await OrderService.getAllOrders();

    res.status(200).json({
      status: "success",
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error al listar los pedidos",
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        status: "error",
        message: "El estado es requerido",
      });
      return;
    }

    const result = await OrderService.updateOrderStatus(id, status);

    res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error al actualizar el estado",
    });
  }
};

export const customizeTemplate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const code = req.params.code as string;
    const { template_data, template_id } = req.body;

    if (!template_data) {
      res.status(400).json({
        status: "error",
        message: "Los datos de personalización son requeridos",
      });
      return;
    }

    const result = await OrderService.saveTemplateCustomization(
      code,
      typeof template_data === "string"
        ? template_data
        : JSON.stringify(template_data),
      template_id,
    );

    res.status(200).json({
      status: "success",
      message: result.message,
      template_url: result.template_url,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Error al guardar la personalización",
    });
  }
};

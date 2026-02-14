import { Order } from "../models/orderModel";
import { IOrderItem, OrderStatus } from "../types/order";
import { EmailService } from "./emailService";
import { EmailVerificationService } from "./emailVerificationService";

const createError = (message: string, statusCode: number) => {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const generateTrackingCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LS-${code}`;
};

export const OrderService = {
  createOrder: async (data: {
    customer_name: string;
    phone_number: string;
    email: string;
    notification_preference?: 'email' | 'whatsapp';
    message?: string;
    file_url: string;
    items: string;
    total_amount: string;
    template_id?: string;
  }): Promise<{ tracking_code: string }> => {
    const { customer_name, phone_number, email, notification_preference, message, file_url, items, total_amount, template_id } = data;

    if (!customer_name || !email || !file_url) {
      throw createError("Nombre, email y comprobante son requeridos", 400);
    }

    // Telefono solo requerido para productos fisicos (sin template_id)
    if (!template_id && !phone_number) {
      throw createError("El telefono es requerido para productos fisicos", 400);
    }

    if (phone_number && phone_number.length > 9) {
      throw createError("El telefono no puede tener mas de 9 digitos", 400);
    }

    const allowedDomains = ["@gmail.com", "@hotmail.com", "@outlook.com"];
    const isDomainValid = allowedDomains.some((d) =>
      email.toLowerCase().endsWith(d)
    );
    if (!isDomainValid) {
      throw createError("Solo se permiten correos Gmail, Hotmail u Outlook", 400);
    }

    if (!EmailVerificationService.isVerified(email)) {
      throw createError("El email no ha sido verificado", 400);
    }

    let parsedItems: IOrderItem[];
    try {
      parsedItems = JSON.parse(items);
    } catch {
      throw createError("Formato de items invalido", 400);
    }

    if (!parsedItems || parsedItems.length === 0) {
      throw createError("El pedido debe contener al menos un producto", 400);
    }

    const trackingCode = generateTrackingCode();
    const total = parseFloat(total_amount);

    const templateId = template_id || null;

    await Order.create(
      {
        tracking_code: trackingCode,
        customer_name,
        phone_number,
        email,
        notification_preference: notification_preference || 'email',
        message: message || "",
        file_url,
        total_amount: total,
        status: "pendiente",
        template_id: templateId,
      },
      parsedItems
    );

    EmailService.sendOrderConfirmation(email, trackingCode, customer_name, parsedItems, total, !!templateId).catch(
      (err) => console.error("Error enviando email de confirmacion:", err)
    );

    return { tracking_code: trackingCode };
  },

  getOrderByTrackingCode: async (code: string) => {
    if (!code) {
      throw createError("Codigo de seguimiento requerido", 400);
    }

    const result = await Order.findByTrackingCode(code.toUpperCase());
    if (!result) {
      throw createError("Pedido no encontrado", 404);
    }

    return result;
  },

  getAllOrders: async () => {
    const orders = await Order.findAll();
    return orders;
  },

  updateOrderStatus: async (
    id: number,
    status: OrderStatus,
  ) => {
    const order = await Order.findById(id);
    if (!order) {
      throw createError("Pedido no encontrado", 404);
    }

    await Order.updateStatus(id, status);

    if (status === "pago_verificado") {
      EmailService.sendPaymentVerified(
        order.email,
        order.tracking_code,
        order.customer_name,
        !!order.template_id
      ).catch((err) =>
        console.error("Error enviando email de pago verificado:", err)
      );
    }

    return { message: "Estado actualizado correctamente" };
  },

  saveTemplateCustomization: async (code: string, templateData: string, templateId?: string) => {
    if (!code) {
      throw createError("Codigo de seguimiento requerido", 400);
    }

    const result = await Order.findByTrackingCode(code.toUpperCase());
    if (!result) {
      throw createError("Pedido no encontrado", 404);
    }

    if (result.order.status !== "pago_verificado") {
      throw createError(
        "Solo se puede personalizar cuando el pago esta verificado",
        400
      );
    }

    // Auto-generate template URL
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const templateUrl = `${clientUrl}/?plantilla=${code.toUpperCase()}`;

    await Order.saveTemplateData(code.toUpperCase(), templateData, templateUrl, templateId);

    // Send email with template link
    EmailService.sendTemplateReady(
      result.order.email,
      result.order.tracking_code,
      templateUrl
    ).catch((err) => console.error("Error enviando email de plantilla lista:", err));

    return { message: "Plantilla personalizada guardada", template_url: templateUrl };
  },
};

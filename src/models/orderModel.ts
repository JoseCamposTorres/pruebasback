import db from "../config/db";
import { IOrder, IOrderItem, OrderStatus } from "../types/order";

export const Order = {
  create: async (
    order: Omit<IOrder, "id" | "created_at" | "updated_at">,
    items: IOrderItem[]
  ): Promise<string> => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result]: any = await connection.query(
        `INSERT INTO orders (tracking_code, customer_name, phone_number, email, notification_preference, message, file_url, total_amount, status, template_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.tracking_code,
          order.customer_name,
          order.phone_number,
          order.email,
          order.notification_preference || 'email',
          order.message || null,
          order.file_url,
          order.total_amount,
          order.status || "pendiente",
          order.template_id || null,
        ]
      );

      const orderId = result.insertId;

      if (items.length > 0) {
        const values = items.map((item) => [
          orderId,
          item.product_id,
          item.product_name,
          item.product_price,
          item.quantity,
        ]);

        await connection.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
           VALUES ?`,
          [values]
        );
      }

      await connection.commit();
      return order.tracking_code;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  findByTrackingCode: async (
    trackingCode: string
  ): Promise<{ order: IOrder; items: IOrderItem[] } | null> => {
    const [orders]: any = await db.query(
      "SELECT * FROM orders WHERE tracking_code = ?",
      [trackingCode]
    );

    if (!orders || orders.length === 0) return null;

    const order = orders[0] as IOrder;

    const [items]: any = await db.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [order.id]
    );

    return { order, items: items as IOrderItem[] };
  },

  findAll: async (): Promise<IOrder[]> => {
    const [rows]: any = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    return rows as IOrder[];
  },

  updateStatus: async (
    id: number,
    status: OrderStatus,
    templateUrl?: string
  ): Promise<void> => {
    if (templateUrl) {
      await db.query(
        "UPDATE orders SET status = ?, template_url = ? WHERE id = ?",
        [status, templateUrl, id]
      );
    } else {
      await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    }
  },

  findById: async (id: number): Promise<IOrder | null> => {
    const [rows]: any = await db.query("SELECT * FROM orders WHERE id = ?", [
      id,
    ]);
    if (!rows || rows.length === 0) return null;
    return rows[0] as IOrder;
  },

  saveTemplateData: async (
    trackingCode: string,
    templateData: string,
    templateUrl: string,
    templateId?: string
  ): Promise<void> => {
    if (templateId) {
      await db.query(
        "UPDATE orders SET template_data = ?, template_url = ?, template_id = ?, status = 'listo' WHERE tracking_code = ? AND status = 'pago_verificado'",
        [templateData, templateUrl, templateId, trackingCode]
      );
    } else {
      await db.query(
        "UPDATE orders SET template_data = ?, template_url = ?, status = 'listo' WHERE tracking_code = ? AND status = 'pago_verificado'",
        [templateData, templateUrl, trackingCode]
      );
    }
  },
};

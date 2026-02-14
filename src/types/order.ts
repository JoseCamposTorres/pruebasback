export type OrderStatus = 'pendiente' | 'pago_verificado' | 'listo' | 'anulado';

export interface IOrder {
  id?: number;
  tracking_code: string;
  customer_name: string;
  phone_number: string;
  email: string;
  notification_preference?: 'email' | 'whatsapp';
  message?: string;
  file_url: string;
  total_amount: number;
  status: OrderStatus;
  template_url?: string | null;
  template_data?: string | null;
  template_id?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface IOrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

export interface ICreateOrderRequest {
  customer_name: string;
  phone_number: string;
  email: string;
  message?: string;
  items: string;
  total_amount: string;
}

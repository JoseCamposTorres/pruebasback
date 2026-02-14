import transporter from "../config/email";
import { IOrderItem } from "../types/order";

const FROM_NAME = "LoveSend";
const FROM_EMAIL = process.env.EMAIL_USER || "noreply@lovesend.com";

export const EmailService = {
  sendOrderConfirmation: async (
    email: string,
    trackingCode: string,
    customerName: string,
    items: IOrderItem[],
    total: number,
    hasTemplate: boolean
  ): Promise<void> => {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const trackUrl = `${clientUrl}/?track=${trackingCode}`;

    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #2a2a3e;">${item.product_name}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #2a2a3e; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #2a2a3e; text-align: right;">S/ ${(item.product_price * item.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    const stepsHtml = hasTemplate
      ? `<ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #a0a0b8; line-height: 1.8;">
            <li>Verificaremos tu comprobante de pago.</li>
            <li>Una vez verificado, podras personalizar tu plantilla.</li>
            <li>Recibiras tu plantilla personalizada por este mismo medio.</li>
          </ol>`
      : `<ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #a0a0b8; line-height: 1.8;">
            <li>Verificaremos tu comprobante de pago.</li>
            <li>Prepararemos tu pedido con mucho carino.</li>
            <li>Te notificaremos cuando este listo.</li>
          </ol>`;

    const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6c2bd9, #d946ef); padding: 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; color: white;">LoveSend</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Tu pedido ha sido registrado</p>
      </div>

      <div style="padding: 32px;">
        <p style="font-size: 16px; margin-bottom: 24px;">Hola <strong>${customerName}</strong>,</p>

        <div style="background: #16162a; border: 2px solid #6c2bd9; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #a78bfa;">Codigo de Seguimiento</p>
          <p style="margin: 0; font-size: 32px; font-weight: bold; color: #d946ef; letter-spacing: 3px;">${trackingCode}</p>
        </div>

        <p style="font-size: 14px; color: #a0a0b8; margin-bottom: 16px;">Resumen de tu pedido:</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <thead>
            <tr style="background: #16162a;">
              <th style="padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #a78bfa;">Producto</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #a78bfa;">Cant.</th>
              <th style="padding: 10px 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #a78bfa;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; font-size: 18px; font-weight: bold; color: #d946ef; margin-bottom: 24px;">
          Total: S/ ${total.toFixed(2)}
        </div>

        <div style="background: #16162a; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-weight: bold; font-size: 14px;">Proximos pasos:</p>
          ${stepsHtml}
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${trackUrl}" style="display: inline-block; background: linear-gradient(135deg, #6c2bd9, #d946ef); color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: bold; font-size: 15px;">
            Consultar estado de mi pedido
          </a>
        </div>

        <p style="font-size: 13px; color: #a0a0b8; text-align: center;">
          Puedes consultar el estado de tu pedido en cualquier momento desde el boton de arriba o ingresando tu codigo en nuestra pagina.
        </p>
      </div>

      <div style="background: #16162a; padding: 16px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">LoveSend - Regalos con amor</p>
      </div>
    </div>
    `;

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: `Pedido Confirmado - ${trackingCode} | LoveSend`,
      html,
    });
  },

  sendPaymentVerified: async (
    email: string,
    trackingCode: string,
    customerName: string,
    hasTemplate: boolean
  ): Promise<void> => {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const trackUrl = `${clientUrl}/?track=${trackingCode}`;

    const nextStepHtml = hasTemplate
      ? `
        <div style="background: #16162a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-weight: bold; font-size: 15px; color: #a78bfa;">Ya puedes personalizar tu plantilla</p>
          <p style="margin: 0 0 16px; font-size: 13px; color: #a0a0b8; line-height: 1.6;">
            Tu pago fue verificado. Ahora puedes disenar tu plantilla personalizada desde nuestra pagina de seguimiento.
          </p>
          <div style="text-align: center;">
            <a href="${trackUrl}" style="display: inline-block; background: linear-gradient(135deg, #6c2bd9, #d946ef); color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: bold; font-size: 15px;">
              Personalizar mi plantilla
            </a>
          </div>
        </div>`
      : `
        <div style="background: #16162a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-weight: bold; font-size: 15px; color: #a78bfa;">Tu pedido se esta preparando</p>
          <p style="margin: 0 0 16px; font-size: 13px; color: #a0a0b8; line-height: 1.6;">
            Estamos alistando tu pedido con mucho carino. Te notificaremos cuando este listo para que puedas recogerlo.
          </p>
          <div style="text-align: center;">
            <a href="${trackUrl}" style="display: inline-block; background: linear-gradient(135deg, #6c2bd9, #d946ef); color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: bold; font-size: 15px;">
              Consultar estado de mi pedido
            </a>
          </div>
        </div>`;

    const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6c2bd9, #d946ef); padding: 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; color: white;">LoveSend</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Pago Verificado</p>
      </div>

      <div style="padding: 32px;">
        <p style="font-size: 16px; margin-bottom: 24px;">Hola <strong>${customerName}</strong>,</p>

        <div style="background: #16162a; border: 2px solid #10b981; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #10b981;">Codigo de Seguimiento</p>
          <p style="margin: 0 0 16px; font-size: 32px; font-weight: bold; color: #d946ef; letter-spacing: 3px;">${trackingCode}</p>
          <p style="margin: 0; font-size: 14px; color: #10b981; font-weight: bold;">Hemos verificado tu comprobante de pago exitosamente</p>
        </div>

        ${nextStepHtml}

        <p style="font-size: 13px; color: #a0a0b8; text-align: center;">
          Si tienes alguna duda, puedes consultar el estado de tu pedido en cualquier momento desde nuestra pagina.
        </p>
      </div>

      <div style="background: #16162a; padding: 16px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">LoveSend - Regalos con amor</p>
      </div>
    </div>
    `;

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: `Pago Verificado - ${trackingCode} | LoveSend`,
      html,
    });
  },

  sendTemplateReady: async (
    email: string,
    trackingCode: string,
    templateUrl: string
  ): Promise<void> => {
    const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #6c2bd9, #d946ef); padding: 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; color: white;">LoveSend</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Tu pedido esta listo!</p>
      </div>

      <div style="padding: 32px;">
        <p style="font-size: 16px; margin-bottom: 24px;">Tu pedido <strong style="color: #d946ef;">${trackingCode}</strong> esta listo.</p>

        <div style="background: #16162a; border: 2px solid #10b981; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="margin: 0 0 12px; font-size: 14px; color: #10b981; font-weight: bold;">Tu plantilla personalizada:</p>
          <a href="${templateUrl}" style="display: inline-block; background: linear-gradient(135deg, #6c2bd9, #d946ef); color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Ver mi plantilla
          </a>
        </div>

        <p style="font-size: 13px; color: #a0a0b8; text-align: center;">
          Gracias por confiar en LoveSend. Esperamos que disfrutes tu regalo!
        </p>
      </div>

      <div style="background: #16162a; padding: 16px; text-align: center; font-size: 12px; color: #666;">
        <p style="margin: 0;">LoveSend - Regalos con amor</p>
      </div>
    </div>
    `;

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: `Tu pedido ${trackingCode} esta listo! | LoveSend`,
      html,
    });
  },
};

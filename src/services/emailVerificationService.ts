import transporter from "../config/email";

const FROM_NAME = "LoveSend";
const FROM_EMAIL = process.env.EMAIL_USER || "noreply@lovesend.com";

const CODE_TTL = 10 * 60 * 1000;
const VERIFIED_TTL = 30 * 60 * 1000;

const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

const verifiedEmails = new Map<string, number>();

const allowedDomains = ["@gmail.com", "@hotmail.com", "@outlook.com"];

const generateCode = (): string => {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
};

const sendVerificationEmail = async (
  email: string,
  code: string
): Promise<void> => {
  const html = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #6c2bd9, #d946ef); padding: 32px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; color: white;">LoveSend</h1>
      <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Verificacion de correo</p>
    </div>

    <div style="padding: 32px;">
      <p style="font-size: 16px; margin-bottom: 24px;">Tu codigo de verificacion es:</p>

      <div style="background: #16162a; border: 2px solid #6c2bd9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #a78bfa;">Codigo de Verificacion</p>
        <p style="margin: 0; font-size: 40px; font-weight: bold; color: #d946ef; letter-spacing: 8px;">${code}</p>
      </div>

      <p style="font-size: 13px; color: #a0a0b8; text-align: center;">
        Este codigo expira en 10 minutos. Si no solicitaste esta verificacion, puedes ignorar este mensaje.
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
    subject: `Codigo de Verificacion | LoveSend`,
    html,
  });
};

export const EmailVerificationService = {
  sendCode: async (email: string): Promise<void> => {
    if (!email) {
      throw Object.assign(new Error("El email es requerido"), {
        statusCode: 400,
      });
    }

    const isDomainValid = allowedDomains.some((d) =>
      email.toLowerCase().endsWith(d)
    );
    if (!isDomainValid) {
      throw Object.assign(
        new Error("Solo se permiten correos Gmail, Hotmail u Outlook"),
        { statusCode: 400 }
      );
    }

    const code = generateCode();
    verificationCodes.set(email.toLowerCase(), {
      code,
      expiresAt: Date.now() + CODE_TTL,
    });

    await sendVerificationEmail(email, code);
  },

  verifyCode: (email: string, code: string): boolean => {
    if (!email || !code) return false;

    const entry = verificationCodes.get(email.toLowerCase());
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      verificationCodes.delete(email.toLowerCase());
      return false;
    }

    if (entry.code !== code) return false;

    verificationCodes.delete(email.toLowerCase());
    verifiedEmails.set(email.toLowerCase(), Date.now() + VERIFIED_TTL);
    return true;
  },

  isVerified: (email: string): boolean => {
    const expiresAt = verifiedEmails.get(email.toLowerCase());
    if (!expiresAt) return false;

    if (Date.now() > expiresAt) {
      verifiedEmails.delete(email.toLowerCase());
      return false;
    }

    return true;
  },
};

import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "error",
    message: "Has superado el límite de peticiones. Intenta en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

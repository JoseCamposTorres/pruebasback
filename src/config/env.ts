import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const port = Number(process.env.PORT) || 3000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const db = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lovesend_db",
  port: Number(process.env.DB_PORT) || 3306,
};

const email = {
  user: process.env.EMAIL_USER || "",
  pass: process.env.EMAIL_PASS || "",
};

const baseUrl =
  nodeEnv === "production"
    ? process.env.BASE_URL || "https://wolfcodetechback.com"
    : `http://localhost:${port}`;

export const env = {
  nodeEnv,
  port,
  allowedOrigins,
  db,
  email,
  baseUrl,
};

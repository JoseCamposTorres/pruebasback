import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lovesend_db",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testDbConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    console.log("✅ Conexión MySQL OK");
  } catch (err) {
    console.error("❌ Error al conectar MySQL:", err);
  }
}

export default pool;

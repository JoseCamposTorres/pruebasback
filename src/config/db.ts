import mysql from "mysql2/promise";
import { env } from "./env";

const pool = mysql.createPool({
  host: env.db.host,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  port: env.db.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testDbConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    if (rows) {}
  } catch (err) {
    console.error("❌ Error al conectar MySQL:", err);
  }
}

export default pool;

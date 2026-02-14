import db from '../src/config/db';

const run = async () => {
  try {
    const connection = await db.getConnection();
    console.log('🔌 Conectado a la base de datos.');

    // Check if column exists
    const [columns]: any = await connection.query(
      "SHOW COLUMNS FROM orders LIKE 'notification_preference'"
    );

    if (columns.length === 0) {
      console.log('⚠️ Columna no existe. Agregando...');
      await connection.query(
        "ALTER TABLE orders ADD COLUMN notification_preference ENUM('email', 'whatsapp') DEFAULT 'email' AFTER email"
      );
      console.log('✅ Columna notification_preference agregada exitosamente.');
    } else {
      console.log('ℹ️ La columna notification_preference ya existe.');
    }

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

run();

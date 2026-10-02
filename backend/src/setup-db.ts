import { db } from "./config/database";

async function iniciarBaseDeDatos() {
  try {
    console.log("Conectando con la nube de Clever Cloud...");

    // 1. Crear tabla de Horarios
    await db.query(`
      CREATE TABLE IF NOT EXISTS horarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        hora VARCHAR(10) NOT NULL,
        descripcion VARCHAR(255),
        activo BOOLEAN DEFAULT TRUE,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabla 'horarios' verificada.");

    // 2. Crear tabla de Eventos
    await db.query(`
      CREATE TABLE IF NOT EXISTS eventos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL,
        descripcion VARCHAR(255),
        fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabla 'eventos' verificada.");

    // 3. Crear tabla de Configuración
    await db.query(`
      CREATE TABLE IF NOT EXISTS configuracion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre_institucion VARCHAR(255) NOT NULL,
        duracion_timbre INT NOT NULL DEFAULT 3,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabla 'configuracion' verificada.");

    // 4. Inyectar configuración de fábrica
    await db.query(`
      INSERT INTO configuracion (id, nombre_institucion, duracion_timbre) 
      VALUES (1, 'Centro Escolar S.O.N.O.R.', 3) 
      ON DUPLICATE KEY UPDATE id=id
    `);
    console.log("✅ Datos de fábrica inyectados.");

    console.log("🎉 ¡BASE DE DATOS EN LA NUBE LISTA AL 100%!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error grave al inyectar las tablas:", error);
    process.exit(1);
  }
}

iniciarBaseDeDatos();
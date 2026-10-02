import cron from "node-cron";
import { db } from "../config/database";

// Memoria en RAM para evitar el doble disparo del contactor
let ultimaEjecucion = "";

export const iniciarAutomatizacion = () => {
  console.log("Motor de automatización iniciado (Zona Horaria Protegida: El Salvador).");

  // Los 5 asteriscos garantizan que se ejecute en el segundo 0 de cada minuto exacto
  // Los 5 asteriscos garantizan que se ejecute en el segundo 0 de cada minuto exacto
  cron.schedule("* * * * *", async () => {
    try {
      // 1. BLINDAJE DE ZONA HORARIA
      // Obligamos al servidor a calcular la hora exacta de El Salvador
      const options = { timeZone: "America/El_Salvador", hour12: false };
      const fechaHoraElSalvador = new Date().toLocaleString("en-US", options);
      
      const fechaObj = new Date(fechaHoraElSalvador);
      
      const horas = fechaObj.getHours().toString().padStart(2, "0");
      const minutos = fechaObj.getMinutes().toString().padStart(2, "0");
      const horaActual = `${horas}:${minutos}`;

      const mes = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
      const dia = fechaObj.getDate().toString().padStart(2, "0");
      const fechaActual = `${fechaObj.getFullYear()}-${mes}-${dia}`;

      const claveEjecucion = `${fechaActual}_${horaActual}`;

      // 2. BLINDAJE ANTI-DUPLICACIÓN
      // Si el reloj interno procesa este minuto dos veces, abortamos el segundo intento
      if (ultimaEjecucion === claveEjecucion) {
        return; 
      }

      // 3. CONSULTA A LA BASE DE DATOS
      const [horarios]: any = await db.query(
        `SELECT id, nombre, hora, descripcion
         FROM horarios
         WHERE activo = TRUE
         AND TIME_FORMAT(hora, '%H:%i') = ?`,
        [horaActual]
      );

      if (horarios.length === 0) {
        return; // No hay nada programado para este minuto exacto
      }

      // 4. EJECUCIÓN DE LA ORDEN Y REGISTRO
      for (const horario of horarios) {
        console.log(`🔔 ¡TIMBRE ACTIVADO! Programación: ${horario.nombre} a las ${horaActual}`);

        // A. Guardamos el evento en el historial
        await db.execute(
          `INSERT INTO eventos (tipo, descripcion) VALUES (?, ?)`,
          [
            "programado",
            horario.descripcion || `Timbre programado: ${horario.nombre}`
          ]
        );

        // B. ---> (FUTURO: Aquí enviaremos la señal MQTT al ESP32 para activar el contactor) <---
      }

      // 5. BLOQUEO DEL MINUTO ACTUAL
      // Registramos que ya se procesó este minuto para asegurar que no vuelva a sonar
      ultimaEjecucion = claveEjecucion;

    } catch (error) {
      console.error("🔴 Error crítico en el motor de automatización:", error);
    }
  });
};
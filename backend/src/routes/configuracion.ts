import { Router, Request, Response } from "express";
import { db } from "../config/database";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      `SELECT id, nombre_institucion, duracion_timbre, actualizado_en
       FROM configuracion
       ORDER BY id ASC
       LIMIT 1`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo configuración:", error);

    res.status(500).json({
      mensaje: "Error obteniendo la configuración"
    });
  }
});

router.put("/", async (req: Request, res: Response) => {
  try {
    const {
      nombre_institucion,
      duracion_timbre
    } = req.body;

    if (!nombre_institucion || !duracion_timbre) {
      return res.status(400).json({
        mensaje: "El nombre de la institución y la duración son obligatorios"
      });
    }

    const [rows]: any = await db.query(
      `SELECT id FROM configuracion
       ORDER BY id ASC
       LIMIT 1`
    );

    if (rows.length === 0) {
      await db.execute(
        `INSERT INTO configuracion
         (nombre_institucion, duracion_timbre)
         VALUES (?, ?)`,
        [nombre_institucion, duracion_timbre]
      );
    } else {
      await db.execute(
        `UPDATE configuracion
         SET nombre_institucion = ?,
             duracion_timbre = ?
         WHERE id = ?`,
        [
          nombre_institucion,
          duracion_timbre,
          rows[0].id
        ]
      );
    }

    res.json({
      mensaje: "Configuración guardada correctamente"
    });

  } catch (error) {
    console.error("Error guardando configuración:", error);

    res.status(500).json({
      mensaje: "Error guardando la configuración"
    });
  }
});

export default router;

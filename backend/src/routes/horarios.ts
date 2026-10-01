import { Router, Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/database";

const router = Router();

interface Horario extends RowDataPacket {
  id: number;
  nombre: string;
  hora: string;
  descripcion: string | null;
  activo: boolean;
  creado_en: Date;
}

/*
  GET /api/horarios
  Obtener todos los horarios
*/
router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<Horario[]>(
      `SELECT id, nombre, hora, descripcion, activo, creado_en
       FROM horarios
       ORDER BY hora ASC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo horarios:", error);

    res.status(500).json({
      mensaje: "Error obteniendo los horarios"
    });
  }
});

/*
  POST /api/horarios
  Crear un nuevo horario
*/
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      hora,
      descripcion,
      activo = true
    } = req.body;

    if (!nombre || !hora) {
      return res.status(400).json({
        mensaje: "El nombre y la hora son obligatorios"
      });
    }

    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO horarios
       (nombre, hora, descripcion, activo)
       VALUES (?, ?, ?, ?)`,
      [
        nombre,
        hora,
        descripcion || null,
        activo
      ]
    );

    res.status(201).json({
      mensaje: "Horario creado correctamente",
      id: result.insertId
    });

  } catch (error) {
    console.error("Error creando horario:", error);

    res.status(500).json({
      mensaje: "Error creando el horario"
    });
  }
});

/*
  PUT /api/horarios/:id
  Actualizar un horario
*/
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      hora,
      descripcion,
      activo
    } = req.body;

    if (!nombre || !hora) {
      return res.status(400).json({
        mensaje: "El nombre y la hora son obligatorios"
      });
    }

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE horarios
       SET nombre = ?,
           hora = ?,
           descripcion = ?,
           activo = ?
       WHERE id = ?`,
      [
        nombre,
        hora,
        descripcion || null,
        activo,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Horario no encontrado"
      });
    }

    res.json({
      mensaje: "Horario actualizado correctamente"
    });

  } catch (error) {
    console.error("Error actualizando horario:", error);

    res.status(500).json({
      mensaje: "Error actualizando el horario"
    });
  }
});

/*
  DELETE /api/horarios/:id
  Eliminar un horario
*/
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM horarios
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: "Horario no encontrado"
      });
    }

    res.json({
      mensaje: "Horario eliminado correctamente"
    });

  } catch (error) {
    console.error("Error eliminando horario:", error);

    res.status(500).json({
      mensaje: "Error eliminando el horario"
    });
  }
});

export default router;
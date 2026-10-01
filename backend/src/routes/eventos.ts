import { Router, Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { db } from "../config/database";

const router = Router();

interface Evento extends RowDataPacket {
  id: number;
  tipo: "manual" | "programado";
  descripcion: string | null;
  fecha_hora: Date;
}

router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query<Evento[]>(
      `SELECT id, tipo, descripcion, fecha_hora
       FROM eventos
       ORDER BY fecha_hora DESC`
    );

    res.json(rows);

  } catch (error) {
    console.error("Error obteniendo eventos:", error);

    res.status(500).json({
      mensaje: "Error obteniendo el historial"
    });
  }
});

export default router;
import { Router, Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import { db } from "./config/database";


const router = Router();

router.post("/sonar", async (_req: Request, res: Response) => {
  try {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO eventos (tipo, descripcion)
       VALUES (?, ?)`,
      [
        "manual",
        "Timbre activado manualmente"
      ]
    );

    res.json({
      success: true,
      mensaje: "Orden de timbre enviada correctamente",
      eventoId: result.insertId
    });

  } catch (error) {
    console.error("Error activando timbre:", error);

    res.status(500).json({
      success: false,
      mensaje: "No se pudo activar el timbre"
    });
  }
});

export default router;
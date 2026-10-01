import express from "express";
import cors from "cors";
import { db } from "./config/database";
import horariosRoutes from "./routes/horarios";
import timbreRoutes from "./routes/timbre";
import eventosRoutes from "./routes/eventos"; // ¡Línea corregida!
import configuracionRoutes from "./routes/configuracion";
import { iniciarAutomatizacion } from "./services/automatizacion";
import authRoutes from "./routes/auth";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/horarios", horariosRoutes);
app.use("/api/timbre", timbreRoutes);
app.use("/api/eventos", eventosRoutes);
app.use("/api/configuracion", configuracionRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({
    mensaje: "Servidor del Timbre Institucional funcionando correctamente"
  });
});

app.get("/api/test-db", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS conectado");
    res.json({
      mensaje: "Conexión con MySQL exitosa",
      resultado: rows
    });
  } catch (error) {
    console.error("Error de MySQL:", error);
    res.status(500).json({
      mensaje: "Error conectando con MySQL"
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

iniciarAutomatizacion();
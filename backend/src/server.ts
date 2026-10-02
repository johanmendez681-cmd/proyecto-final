import express from "express";
import cors from "cors";
import { db } from "./config/database";
import horariosRoutes from "./routes/horarios";
import timbreRoutes from "./routes/timbre";
import eventosRoutes from "./routes/eventos";
import configuracionRoutes from "./routes/configuracion";
import { iniciarAutomatizacion } from "./services/automatizacion";
import authRoutes from "./routes/auth";
import "dotenv/config"; // <- Añadimos soporte para secretos de la nube

const app = express();

// Configuramos CORS para permitir conexiones desde cualquier origen (útil para la nube)
app.use(cors());
app.use(express.json());

app.use("/api/horarios", horariosRoutes);
app.use("/api/timbre", timbreRoutes);
app.use("/api/eventos", eventosRoutes);
app.use("/api/configuracion", configuracionRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({
    mensaje: "Servidor S.O.N.O.R. funcionando correctamente en la nube ☁️"
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

// ¡LA REGLA DE ORO DE RENDER!
// Intenta usar el puerto de la nube, si no hay nube (desarrollo local), usa el 5000.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

iniciarAutomatizacion();
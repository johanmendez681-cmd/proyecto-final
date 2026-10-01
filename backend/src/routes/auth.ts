import { Router, Request, Response } from "express";
import { db } from "../config/database";
import bcrypt from "bcrypt";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
    }

    // Buscamos al usuario en la base de datos
    const [rows]: any = await db.query(
      `SELECT * FROM usuarios WHERE correo = ?`,
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const usuario = rows[0];
    let passwordValido = false;

    // Transición inteligente: Si la contraseña no está encriptada aún (ej. "123456")
    if (!usuario.password.startsWith("$2b$") && !usuario.password.startsWith("$2a$")) {
      if (password === usuario.password) {
        passwordValido = true;
        
        // Encriptamos la contraseña para el futuro y actualizamos la base de datos
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptado = await bcrypt.hash(password, salt);
        
        await db.execute(
          `UPDATE usuarios SET password = ? WHERE id = ?`,
          [passwordEncriptado, usuario.id]
        );
        console.log("🔒 Sistema de seguridad actualizado: Contraseña de texto plano detectada y encriptada con éxito.");
      }
    } else {
      // Si la contraseña ya fue encriptada antes, la comparamos con la llave de bcrypt
      passwordValido = await bcrypt.compare(password, usuario.password);
    }

    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    // Login exitoso (Jamás enviamos la contraseña de vuelta al frontend)
    res.json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error("Error en el sistema de autenticación:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

export default router;
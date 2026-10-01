import { useState } from "react";
import { LockKeyhole, Mail, Bell } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!correo || !password) {
      alert("Completá todos los campos.");
      return;
    }

    if (
      correo === "admin@timbre.com" &&
      password === "123456"
    ) {
      onLogin();
    } else {
      alert("Credenciales incorrectas.");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          <Bell size={38} />
        </div>

        <h1>S.O.N.O.R.</h1>

        <p className="login-subtitle">
          Sistema Orgánico de Notificaciones
          <br />
          y Operación del Receso
        </p>

        <div className="login-welcome">
          <h2>Bienvenido</h2>
          <p>Ingresá con las credenciales del director.</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Correo electrónico</label>

            <div className="input-wrapper">
              <Mail size={19} />

              <input
                type="email"
                placeholder="admin@timbre.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Contraseña</label>

            <div className="input-wrapper">
              <LockKeyhole size={19} />

              <input
                type="password"
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="login-button" type="submit">
            Iniciar sesión
          </button>

        </form>

        <small className="login-footer">
          Acceso exclusivo para el director
        </small>

      </div>

    </div>
  );
}

export default Login;
import { useState } from "react";
import axios from "axios";
import { Bell, Lock, Mail, BookOpen, GraduationCap, Clock } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCargando(true);
      setError("");

      const response = await axios.post("[https://proyecto-final-f061.onrender.com](https://proyecto-final-f061.onrender.com)/api/auth/login", {
        correo,
        password
      });

      if (response.data.mensaje === "Login exitoso") {
        onLogin();
      }
    } catch (err: any) {
      setError(err.response?.data?.mensaje || "Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0EA5E9', // Azul vibrante estilo App
      backgroundImage: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
      padding: '20px'
    }}>
      
      {/* Motor de Animaciones CSS */}
      <style>{`
        @keyframes ring-animation {
          0% { transform: rotate(0); }
          10% { transform: rotate(15deg); }
          20% { transform: rotate(-10deg); }
          30% { transform: rotate(5deg); }
          40% { transform: rotate(-5deg); }
          50% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0) rotate(-10deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0) rotate(10deg); }
          50% { transform: translateY(-10px) rotate(15deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .vibrating-bell {
          animation: ring-animation 2s ease-in-out infinite;
          transform-origin: top center; 
        }
        .anim-float-1 { animation: float-1 4s ease-in-out infinite; }
        .anim-float-2 { animation: float-2 5s ease-in-out infinite; }
        .anim-float-3 { animation: float-3 3.5s ease-in-out infinite; }
        
        input::placeholder { color: #9CA3AF; }
        input:focus { border-color: #0EA5E9 !important; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2) !important; }
      `}</style>

      {/* Tarjeta Blanca Principal */}
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '40px', // Bordes súper redondeados como en la imagen
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        paddingBottom: '120px' // Espacio para las decoraciones del fondo
      }}>
        
        <div style={{ padding: '40px 32px 0 32px' }}>
          
          {/* Encabezado y Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#0EA5E9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)'
            }}>
              <Bell size={40} color="#FFFFFF" strokeWidth={2} className="vibrating-bell" />
            </div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#1E293B', fontWeight: '800' }}>
              S.O.N.O.R.
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '500' }}>
              Control de Timbre Escolar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 10 }}>
            
            {/* Input Correo */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 52px',
                  borderRadius: '50px', // Forma de píldora
                  border: '1px solid #E5E7EB',
                  fontSize: '15px',
                  color: '#1E293B',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>

            {/* Input Contraseña */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                <Lock size={20} />
              </div>
              <input
                type="password"
                required
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px 16px 52px',
                  borderRadius: '50px', // Forma de píldora
                  border: '1px solid #E5E7EB',
                  fontSize: '15px',
                  color: '#1E293B',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>

            {error && (
              <div style={{ color: '#EF4444', fontSize: '13px', textAlign: 'center', fontWeight: '500', marginTop: '-10px' }}>
                {error}
              </div>
            )}

            {/* Botón LOGIN */}
            <button
              type="submit"
              disabled={cargando}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '16px',
                backgroundColor: '#0EA5E9',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50px', // Forma de píldora
                fontSize: '16px',
                fontWeight: '700',
                letterSpacing: '1px',
                cursor: cargando ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s ease',
                boxShadow: '0 8px 15px rgba(14, 165, 233, 0.3)'
              }}
            >
              {cargando ? "CARGANDO..." : "LOGIN"}
            </button>
          </form>
        </div>

        {/* Decoración Inferior: Tema Escolar Animado */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '140px', zIndex: 0 }}>
          {/* Ola de diseño en SVG */}
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, width: '100%', height: '100%' }}>
            <path fill="#E0F2FE" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,144C672,149,768,203,864,224C960,245,1056,235,1152,213.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>

          {/* Íconos Escolares Flotantes */}
          <div style={{ position: 'absolute', bottom: '20px', left: '30px', color: '#7DD3FC' }} className="anim-float-1">
            <GraduationCap size={40} />
          </div>
          <div style={{ position: 'absolute', bottom: '40px', right: '40px', color: '#38BDF8' }} className="anim-float-2">
            <BookOpen size={30} />
          </div>
          <div style={{ position: 'absolute', bottom: '15px', right: '110px', color: '#BAE6FD' }} className="anim-float-3">
            <Clock size={24} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
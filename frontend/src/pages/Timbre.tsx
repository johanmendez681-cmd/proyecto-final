import { useState } from "react";
import axios from "axios";
import { Bell, CheckCircle, Zap } from "lucide-react";

function Timbre() {
  const [activando, setActivando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const sonarTimbre = async () => {
    try {
      setActivando(true);
      setMensaje("");

      const response = await axios.post("[https://proyecto-final-f061.onrender.com](https://proyecto-final-f061.onrender.com)/api/timbre/sonar");
      setMensaje(response.data.mensaje);

      // Limpiamos el mensaje después de 5 segundos
      setTimeout(() => setMensaje(""), 5000);

    } catch (error) {
      console.error("Error activando el timbre:", error);
      setMensaje("Error de conexión. No se pudo accionar.");
      setTimeout(() => setMensaje(""), 5000);
    } finally {
      setActivando(false);
    }
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Motor de Animaciones CSS */}
      <style>{`
        @keyframes ripple-effect {
          0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4); }
          100% { box-shadow: 0 0 0 40px rgba(14, 165, 233, 0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .btn-smart {
          animation: ripple-effect 2s infinite;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-smart:hover {
          transform: scale(1.05);
          animation: none; /* Pausa las ondas al pasar el ratón */
          box-shadow: 0 25px 50px rgba(14, 165, 233, 0.4) !important;
        }
        .btn-smart:active {
          transform: scale(0.95);
        }
        .anim-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      {/* Cabecera */}
      <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', color: '#1E293B', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Control Manual
        </h2>
        <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '15px', fontWeight: '500' }}>
          Accionamiento directo del hardware.
        </p>
      </div>

      {/* Tarjeta Central de la App */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '40px',
        padding: '60px 20px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(14, 165, 233, 0.08)',
        maxWidth: '500px',
        margin: '0 auto',
        marginTop: '20px',
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Decoración de fondo suave */}
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', backgroundColor: '#F0F9FF', borderRadius: '50%', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '150px', height: '150px', backgroundColor: '#F0F9FF', borderRadius: '50%', zIndex: 0 }}></div>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
            <Zap size={24} color="#0EA5E9" />
            <h3 style={{ margin: 0, fontSize: '22px', color: '#1E293B', fontWeight: '800' }}>
              Toque Instantáneo
            </h3>
          </div>

          {/* EL BOTÓN GIGANTE SMART */}
          <button
            onClick={sonarTimbre}
            disabled={activando}
            className={activando ? "" : "btn-smart"}
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%', // Círculo perfecto
              backgroundColor: activando ? '#E0F2FE' : '#0EA5E9',
              backgroundImage: activando ? 'none' : 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)',
              color: activando ? '#0EA5E9' : '#FFFFFF',
              border: 'none',
              cursor: activando ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              margin: '0 auto',
              boxShadow: activando ? 'none' : '0 15px 35px rgba(14, 165, 233, 0.3)',
            }}
          >
            <Bell size={64} strokeWidth={activando ? 2 : 2.5} className={activando ? "" : "vibrating-bell"} style={activando ? { animation: 'none' } : {}} />
            <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '1px' }}>
              {activando ? "ENVIANDO..." : "TOCAR AHORA"}
            </span>
          </button>

          <p style={{ margin: '40px auto 0', color: '#94A3B8', fontSize: '14px', maxWidth: '300px', fontWeight: '500', lineHeight: '1.5' }}>
            Pulsa el botón central para hacer sonar la campana inmediatamente.
          </p>

          {/* Feedback Visual Animado (Píldora Flotante) */}
          <div style={{ minHeight: '60px', marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
            {mensaje && (
              <div className="anim-slide-up" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: mensaje.includes("Error") ? '#FEF2F2' : '#F0FDF4',
                color: mensaje.includes("Error") ? '#EF4444' : '#10B981',
                padding: '14px 24px',
                borderRadius: '50px', // Forma de píldora
                fontSize: '15px',
                fontWeight: '700',
                boxShadow: mensaje.includes("Error") ? '0 10px 25px rgba(239, 68, 68, 0.15)' : '0 10px 25px rgba(16, 185, 129, 0.15)'
              }}>
                <CheckCircle size={20} strokeWidth={2.5} />
                <span>{mensaje}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Timbre;
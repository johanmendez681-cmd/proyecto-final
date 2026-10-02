import { useEffect, useState } from "react";
import { Bell, User } from "lucide-react";

function Header() {
  const [horaExacta, setHoraExacta] = useState("--:--:--");
  const [fechaActual, setFechaActual] = useState("Cargando...");

  useEffect(() => {
    const actualizarReloj = () => {
      const ahora = new Date();
      setHoraExacta(ahora.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      let fechaStr = ahora.toLocaleDateString('es-SV', { weekday: 'long', day: 'numeric', month: 'long' });
      setFechaActual(fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1));
    };

    actualizarReloj();
    const intervalo = setInterval(actualizarReloj, 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px 40px",
      backgroundColor: "transparent", // Dejamos ver el fondo de la app
      height: "100px",
      flexShrink: 0
    }}>
      
      {/* Reloj Flotante (Forma de píldora) */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        padding: "12px 24px",
        borderRadius: "50px",
        boxShadow: "0 10px 25px rgba(14, 165, 233, 0.08)"
      }}>
        <span style={{ fontSize: "20px", fontWeight: "800", color: "#0EA5E9", letterSpacing: "-0.5px", fontVariantNumeric: "tabular-nums" }}>
          {horaExacta}
        </span>
        <span style={{ fontSize: "12px", color: "#64748B", fontWeight: "600" }}>
          {fechaActual}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        
        {/* Notificaciones (Círculo perfecto) */}
        <button style={{ 
          position: "relative",
          backgroundColor: "#FFFFFF", 
          border: "none", 
          color: "#0EA5E9", 
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 25px rgba(14, 165, 233, 0.08)",
          transition: "transform 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <Bell size={22} strokeWidth={2.5} />
          <span style={{
            position: "absolute",
            top: "10px",
            right: "12px",
            width: "10px",
            height: "10px",
            backgroundColor: "#EF4444", 
            borderRadius: "50%",
            border: "2px solid #FFFFFF"
          }}></span>
        </button>

        {/* Perfil en Píldora */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px", 
          cursor: "pointer",
          backgroundColor: "#FFFFFF",
          padding: "8px 20px 8px 8px",
          borderRadius: "50px",
          boxShadow: "0 10px 25px rgba(14, 165, 233, 0.08)"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#E0F2FE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0EA5E9"
          }}>
            <User size={20} strokeWidth={2.5} />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#1E293B" }}>Dirección</p>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748B", fontWeight: "600", textTransform: "uppercase" }}>Admin</p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;
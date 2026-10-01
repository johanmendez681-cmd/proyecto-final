import { useEffect, useState } from "react";
import axios from "axios";
import { Activity, Clock, Calendar, BellRing } from "lucide-react";

interface Horario {
  id: number;
  nombre: string;
  hora: string;
  activo: number | boolean;
}

function Home() {
  const [proximoTimbre, setProximoTimbre] = useState<Horario | null>(null);
  const [horariosActivos, setHorariosActivos] = useState(0);
  const [estadoSistema, setEstadoSistema] = useState<"Conectado" | "Desconectado" | "Cargando">("Cargando");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Pedimos los horarios al backend
        const response = await axios.get("http://localhost:5000/api/horarios");
        const horarios: Horario[] = response.data;
        
        setEstadoSistema("Conectado");

        // Filtramos solo los que están encendidos
        const activos = horarios.filter(h => h.activo === 1 || h.activo === true);
        setHorariosActivos(activos.length);

        // Calculamos cuál es el próximo en sonar
        calcularProximoTimbre(activos);
      } catch (error) {
        console.error("Error conectando con el servidor:", error);
        setEstadoSistema("Desconectado");
      }
    };

    cargarDatos();
    
    // Actualizamos el cálculo cada minuto para que el dashboard esté siempre al día
    const intervalo = setInterval(cargarDatos, 60000);
    return () => clearInterval(intervalo);
  }, []);

  const calcularProximoTimbre = (horarios: Horario[]) => {
    if (horarios.length === 0) {
      setProximoTimbre(null);
      return;
    }

    const ahora = new Date();
    // Convertimos la hora actual a minutos totales (ej. 14:30 = 870 minutos)
    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes(); 

    // Ordenamos los horarios desde la mañana hasta la noche
    const horariosOrdenados = [...horarios].sort((a, b) => a.hora.localeCompare(b.hora));

    // Buscamos el primero que ocurra DESPUÉS de la hora actual
    let proximo = horariosOrdenados.find(h => {
      const [hHora, hMinuto] = h.hora.split(":");
      const minutosHorario = parseInt(hHora) * 60 + parseInt(hMinuto);
      return minutosHorario > minutosActuales;
    });

    // Si ya sonaron todos los de hoy, el próximo es el primero de mañana
    if (!proximo) {
      proximo = horariosOrdenados[0];
    }

    setProximoTimbre(proximo);
  };

  const formatearHoraAmPm = (horaString: string) => {
    if (!horaString) return "--:--";
    const [h, m] = horaString.split(":");
    let horas = parseInt(h);
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12;
    horas = horas ? horas : 12; 
    return `${horas}:${m} ${ampm}`;
  };

  return (
    <div className="home-page">
      <div className="page-header">
        <div>
          <h2>Panel de control</h2>
          <p>Visión general del Sistema Orgánico de Notificaciones y Operación del Receso.</p>
        </div>
      </div>

      {/* Usamos estilos en línea temporalmente para garantizar la estructura de cuadrícula */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "20px" }}>
        
        {/* Tarjeta 1: Estado del Sistema */}
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ padding: "10px", backgroundColor: estadoSistema === "Conectado" ? "#dcfce7" : "#fee2e2", borderRadius: "8px" }}>
              <Activity color={estadoSistema === "Conectado" ? "#16a34a" : "#ef4444"} size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#4b5563" }}>Estado del Servidor</h3>
          </div>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0, color: estadoSistema === "Conectado" ? "#16a34a" : "#ef4444" }}>
            {estadoSistema === "Conectado" ? "🟢 En línea" : estadoSistema === "Desconectado" ? "🔴 Desconectado" : "Cargando..."}
          </p>
          <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
            Conexión con base de datos estable
          </p>
        </div>

        {/* Tarjeta 2: Próximo Timbre */}
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ padding: "10px", backgroundColor: "#dbeafe", borderRadius: "8px" }}>
              <Clock color="#2563eb" size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#4b5563" }}>Próximo Timbre</h3>
          </div>
          {proximoTimbre ? (
            <>
              <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#111827" }}>
                {formatearHoraAmPm(proximoTimbre.hora)}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                <BellRing size={14} color="#6b7280" />
                <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                  {proximoTimbre.nombre}
                </p>
              </div>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: "16px", color: "#6b7280", marginTop: "10px" }}>
              No hay horarios activos
            </p>
          )}
        </div>

        {/* Tarjeta 3: Horarios Activos */}
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ padding: "10px", backgroundColor: "#f3e8ff", borderRadius: "8px" }}>
              <Calendar color="#9333ea" size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#4b5563" }}>Horarios Activos</h3>
          </div>
          <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#111827" }}>
            {horariosActivos}
          </p>
          <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
            Programaciones encendidas hoy
          </p>
        </div>

      </div>
    </div>
  );
}

export default Home;
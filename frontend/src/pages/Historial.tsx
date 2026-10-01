import { useEffect, useState } from "react";
import axios from "axios";
import { History, Bell, Clock } from "lucide-react";

interface Evento {
  id: number;
  tipo: "manual" | "programado";
  descripcion: string | null;
  fecha_hora: string;
}

function Historial() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarEventos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/eventos");
      setEventos(response.data);
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEventos();

    const intervalo = setInterval(() => {
      cargarEventos();
    }, 10000);

    return () => {
      clearInterval(intervalo);
    };
  }, []);

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "Fecha no disponible";
    
    // MySQL a veces envía la fecha con espacio en lugar de 'T', lo cual confunde a JavaScript
    const fechaSegura = fecha.includes('T') ? fecha : fecha.replace(' ', 'T');
    const fechaObj = new Date(fechaSegura);

    // Si la fecha sigue siendo inválida tras la conversión, devolvemos un texto seguro
    if (isNaN(fechaObj.getTime())) return "Fecha inválida";

    return fechaObj.toLocaleDateString("es-SV", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatearHora = (fecha: string) => {
    if (!fecha) return "--:--";

    const fechaSegura = fecha.includes('T') ? fecha : fecha.replace(' ', 'T');
    const fechaObj = new Date(fechaSegura);

    if (isNaN(fechaObj.getTime())) return "--:--";

    return fechaObj.toLocaleTimeString("es-SV", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true // Agregado formato AM/PM para mejor lectura
    });
  };

  return (
    <div className="historial-page">
      <div className="page-header">
        <div>
          <h2>Historial</h2>
          <p>Registro de todas las activaciones del timbre.</p>
        </div>
      </div>

      <div className="historial-card">
        <div className="card-title">
          <History size={22} />
          <h3>Actividad reciente</h3>
        </div>

        {cargando ? (
          <p className="empty-message">Cargando historial...</p>
        ) : eventos.length === 0 ? (
          <div className="empty-message">
            <History size={40} />
            <h3>No hay eventos registrados</h3>
            <p>Las activaciones del timbre aparecerán aquí.</p>
          </div>
        ) : (
          <div className="historial-list">
            {eventos.map((evento) => (
              <div className="historial-item" key={evento.id}>
                <div className="historial-icon">
                  {evento.tipo === "manual" ? (
                    <Bell size={22} />
                  ) : (
                    <Clock size={22} />
                  )}
                </div>

                <div className="historial-info">
                  <h4>
                    {evento.tipo === "manual"
                      ? "Timbre manual"
                      : "Timbre programado"}
                  </h4>
                  <p>{evento.descripcion || "Sin descripción"}</p>
                </div>

                <div className="historial-fecha">
                  <strong>{formatearHora(evento.fecha_hora)}</strong>
                  <span>{formatearFecha(evento.fecha_hora)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Historial;
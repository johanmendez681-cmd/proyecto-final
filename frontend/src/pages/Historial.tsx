import { useEffect, useState } from "react";
import axios from "axios";
import { History, Bell, Clock, Activity } from "lucide-react";

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
    const intervalo = setInterval(cargarEventos, 10000);
    return () => clearInterval(intervalo);
  }, []);

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "Fecha no disponible";
    const fechaSegura = fecha.includes('T') ? fecha : fecha.replace(' ', 'T');
    const fechaObj = new Date(fechaSegura);
    if (isNaN(fechaObj.getTime())) return "Fecha inválida";

    return fechaObj.toLocaleDateString("es-SV", { day: "2-digit", month: "long", year: "numeric" });
  };

  const formatearHora = (fecha: string) => {
    if (!fecha) return "--:--";
    const fechaSegura = fecha.includes('T') ? fecha : fecha.replace(' ', 'T');
    const fechaObj = new Date(fechaSegura);
    if (isNaN(fechaObj.getTime())) return "--:--";

    return fechaObj.toLocaleTimeString("es-SV", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      <style>{`
        .history-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .history-card:hover {
          transform: translateX(10px); /* Se desliza un poquito a la derecha */
          box-shadow: 0 15px 30px rgba(14, 165, 233, 0.08);
          border-color: #E0F2FE;
        }
      `}</style>

      {/* Cabecera */}
      <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', color: '#1E293B', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Registro de Eventos
        </h2>
        <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '15px', fontWeight: '500' }}>
          Bitácora inteligente de activaciones S.O.N.O.R.
        </p>
      </div>

      {/* Tarjeta Contenedora Principal */}
      <div style={{ 
        backgroundColor: '#FFFFFF', 
        borderRadius: '32px', 
        padding: '32px',
        boxShadow: '0 10px 25px rgba(14, 165, 233, 0.05)',
        border: 'none'
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ padding: '10px', backgroundColor: '#F0F9FF', borderRadius: '50%', color: '#0EA5E9' }}>
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#1E293B', fontWeight: '800' }}>
            Actividad Reciente
          </h3>
        </div>

        <div>
          {cargando ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontWeight: '600' }}>
              Cargando bitácora...
            </div>
          ) : eventos.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <History size={40} color="#CBD5E1" strokeWidth={1.5} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', color: '#1E293B', fontSize: '18px', fontWeight: '800' }}>
                Historial limpio
              </h3>
              <p style={{ margin: 0, color: '#64748B', fontSize: '15px', fontWeight: '500' }}>
                Aún no se ha registrado ninguna actividad en el hardware.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {eventos.map((evento) => (
                <div 
                  key={evento.id} 
                  className="history-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px', // Tarjetas muy redondeadas adentro de la principal
                    border: '1px solid #F1F5F9',
                    cursor: 'default'
                  }}
                >
                  
                  {/* Icono y Detalles */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px', // Icono redondeado estilo iOS
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: evento.tipo === 'manual' ? '#FEE2E2' : '#F0F9FF',
                      color: evento.tipo === 'manual' ? '#EF4444' : '#0EA5E9',
                      boxShadow: evento.tipo === 'manual' ? '0 4px 12px rgba(239, 68, 68, 0.15)' : '0 4px 12px rgba(14, 165, 233, 0.15)'
                    }}>
                      {evento.tipo === 'manual' ? <Bell size={28} strokeWidth={2.5} /> : <Clock size={28} strokeWidth={2.5} />}
                    </div>

                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '800', color: '#1E293B' }}>
                        {evento.tipo === "manual" ? "Activación Manual" : "Ejecución Automática"}
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '500' }}>
                        {evento.descripcion || "Disparo directo sin notas del sistema."}
                      </p>
                    </div>
                  </div>

                  {/* Hora y Fecha (Píldora a la derecha) */}
                  <div style={{ 
                    textAlign: 'right', 
                    backgroundColor: '#F8FAFC', 
                    padding: '12px 20px', 
                    borderRadius: '50px' 
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#0EA5E9', fontVariantNumeric: 'tabular-nums' }}>
                      {formatearHora(evento.fecha_hora)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px', fontWeight: '600', textTransform: 'uppercase' }}>
                      {formatearFecha(evento.fecha_hora)}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Historial;
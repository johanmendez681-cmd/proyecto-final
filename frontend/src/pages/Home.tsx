import { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Calendar, BellRing, Server } from "lucide-react";

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
        const response = await axios.get("[https://proyecto-final-f061.onrender.com](https://proyecto-final-f061.onrender.com)/api/horarios");
        const horarios: Horario[] = response.data;
        
        setEstadoSistema("Conectado");

        const activos = horarios.filter(h => h.activo === 1 || h.activo === true);
        setHorariosActivos(activos.length);
        calcularProximoTimbre(activos);
      } catch (error) {
        console.error("Error conectando con el servidor:", error);
        setEstadoSistema("Desconectado");
      }
    };

    cargarDatos();
    const intervalo = setInterval(cargarDatos, 60000);
    return () => clearInterval(intervalo);
  }, []);

  const calcularProximoTimbre = (horarios: Horario[]) => {
    if (horarios.length === 0) {
      setProximoTimbre(null);
      return;
    }

    const ahora = new Date();
    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes(); 

    const horariosOrdenados = [...horarios].sort((a, b) => a.hora.localeCompare(b.hora));

    let proximo = horariosOrdenados.find(h => {
      const [hHora, hMinuto] = h.hora.split(":");
      const minutosHorario = parseInt(hHora, 10) * 60 + parseInt(hMinuto, 10);
      return minutosHorario > minutosActuales;
    });

    if (!proximo) {
      proximo = horariosOrdenados[0];
    }

    setProximoTimbre(proximo || null);
  };

  const formatearHoraAmPm = (horaString: string) => {
    if (!horaString) return "--:--";
    const [h, m] = horaString.split(":");
    let horas = parseInt(h, 10);
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12;
    horas = horas ? horas : 12; 
    return `${horas}:${m} ${ampm}`;
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      <style>{`
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        @keyframes float-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .anim-float {
          animation: float-soft 3s ease-in-out infinite;
        }
        .anim-pulse {
          animation: pulse-green 2s infinite;
        }
        .app-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .app-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(14, 165, 233, 0.15) !important;
        }
      `}</style>

      <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', color: '#1E293B', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Panel de Control
        </h2>
        <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '15px', fontWeight: '500' }}>
          Resumen en tiempo real del ecosistema S.O.N.O.R.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        <div className="app-card" style={{ 
          backgroundColor: '#FFFFFF', borderRadius: '32px', padding: '32px', boxShadow: '0 10px 25px rgba(14, 165, 233, 0.05)', border: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Servidor
            </h3>
            <div className="anim-float" style={{ padding: '12px', backgroundColor: '#F0F9FF', borderRadius: '50%', color: '#0EA5E9' }}>
              <Server size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div className={estadoSistema === "Conectado" ? "anim-pulse" : ""} style={{
                width: '12px', height: '12px', borderRadius: '50%',
                backgroundColor: estadoSistema === "Conectado" ? '#22C55E' : estadoSistema === "Desconectado" ? '#EF4444' : '#CBD5E1'
              }}></div>
              <p style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#1E293B', letterSpacing: '-0.5px' }}>
                {estadoSistema === "Conectado" ? "En línea" : estadoSistema === "Desconectado" ? "Fallo" : "Leyendo..."}
              </p>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '500' }}>
              {estadoSistema === "Conectado" ? "Conexión estable y sincronizada" : "Pérdida de comunicación"}
            </p>
          </div>
        </div>

        <div className="app-card" style={{ 
          backgroundColor: '#0EA5E9', backgroundImage: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)', borderRadius: '32px', padding: '32px', boxShadow: '0 15px 30px rgba(14, 165, 233, 0.3)', border: 'none', color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#BAE6FD', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Próximo Disparo
            </h3>
            <div className="anim-float" style={{ padding: '12px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', color: '#FFFFFF' }}>
              <Clock size={24} strokeWidth={2.5} />
            </div>
          </div>
          {proximoTimbre ? (
            <div>
              <p style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 12px 0', color: '#FFFFFF', letterSpacing: '-1.5px', fontVariantNumeric: 'tabular-nums', lineHeight: '1' }}>
                {formatearHoraAmPm(proximoTimbre.hora)}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: '50px' }}>
                <BellRing size={16} color="#FFFFFF" strokeWidth={2.5} />
                <p style={{ margin: 0, fontSize: '14px', color: '#FFFFFF', fontWeight: '700' }}>
                  {proximoTimbre.nombre}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 'auto' }}>
              <p style={{ margin: 0, fontSize: '16px', color: '#E0F2FE', fontWeight: '600' }}>
                Sin eventos programados hoy
              </p>
            </div>
          )}
        </div>

        <div className="app-card" style={{ 
          backgroundColor: '#FFFFFF', borderRadius: '32px', padding: '32px', boxShadow: '0 10px 25px rgba(14, 165, 233, 0.05)', border: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Rutas Activas
            </h3>
            <div className="anim-float" style={{ padding: '12px', backgroundColor: '#F0F9FF', borderRadius: '50%', color: '#0EA5E9' }}>
              <Calendar size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 4px 0', color: '#1E293B', letterSpacing: '-1px', lineHeight: '1' }}>
              {horariosActivos}
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '500' }}>
              Programaciones encendidas
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
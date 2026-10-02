import { useEffect, useState } from "react";
import axios from "axios";
import { Settings, Save, School, Bell, CheckCircle, Cpu } from "lucide-react";

interface ConfiguracionData {
  id?: number;
  nombre_institucion: string;
  duracion_timbre: number;
  actualizado_en?: string;
}

function Configuracion() {
  const [nombreInstitucion, setNombreInstitucion] = useState("");
  const [duracionTimbre, setDuracionTimbre] = useState(3);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarConfiguracion = async () => {
    try {
      const response = await axios.get("[https://proyecto-final-f061.onrender.com](https://proyecto-final-f061.onrender.com)/api/configuracion");
      const datos: ConfiguracionData[] = response.data;

      if (datos.length > 0) {
        setNombreInstitucion(datos[0].nombre_institucion);
        setDuracionTimbre(datos[0].duracion_timbre);
      }
    } catch (error) {
      console.error("Error cargando configuración:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const guardarConfiguracion = async () => {
    if (!nombreInstitucion.trim()) {
      mostrarMensaje("El nombre de la institución es obligatorio.");
      return;
    }

    if (duracionTimbre < 1 || duracionTimbre > 30) {
      mostrarMensaje("La duración debe estar entre 1 y 30 segundos.");
      return;
    }

    try {
      setGuardando(true);
      setMensaje("");

      const response = await axios.put("[https://proyecto-final-f061.onrender.com](https://proyecto-final-f061.onrender.com)/api/configuracion", {
        nombre_institucion: nombreInstitucion.trim(),
        duracion_timbre: duracionTimbre
      });

      mostrarMensaje(response.data.mensaje);
    } catch (error) {
      console.error("Error guardando configuración:", error);
      mostrarMensaje("Error de red. No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 4000);
  };

  if (cargando) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8', fontWeight: '600', fontSize: '16px' }}>
        Cargando parámetros del sistema...
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* Motor de Animaciones CSS */}
      <style>{`
        .app-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .app-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(14, 165, 233, 0.12) !important;
        }
        .input-app {
          transition: all 0.2s ease;
        }
        .input-app:focus-within {
          border-color: #0EA5E9 !important;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15) !important;
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .anim-pop {
          animation: pop-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      {/* Cabecera */}
      <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', color: '#1E293B', fontWeight: '800', letterSpacing: '-0.5px' }}>
          Ajustes del Sistema
        </h2>
        <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '15px', fontWeight: '500' }}>
          Parámetros globales y configuración de hardware S.O.N.O.R.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Tarjeta 1: Institución */}
        <div className="app-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', padding: '32px', boxShadow: '0 10px 25px rgba(14, 165, 233, 0.05)', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{ padding: '10px', backgroundColor: '#F0F9FF', borderRadius: '50%', color: '#0EA5E9' }}>
              <School size={24} strokeWidth={2.5} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1E293B', fontWeight: '800' }}>
              Datos de la Institución
            </h3>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#64748B', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Nombre de la Escuela / Colegio
            </label>
            <div className="input-app" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#F8FAFC', 
              borderRadius: '50px', 
              border: '1px solid #E5E7EB',
              padding: '4px 8px'
            }}>
              <input
                type="text"
                value={nombreInstitucion}
                placeholder="Ej. Centro Escolar San José"
                onChange={(e) => setNombreInstitucion(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  fontSize: '15px',
                  color: '#1E293B',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontWeight: '600'
                }}
              />
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Hardware (Timbre) */}
        <div className="app-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', padding: '32px', boxShadow: '0 10px 25px rgba(14, 165, 233, 0.05)', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{ padding: '10px', backgroundColor: '#F0F9FF', borderRadius: '50%', color: '#0EA5E9' }}>
              <Cpu size={24} strokeWidth={2.5} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#1E293B', fontWeight: '800' }}>
              Parámetros de Hardware
            </h3>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#64748B', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Duración del toque (Relé)
            </label>
            
            {/* Contenedor tipo píldora dividida */}
            <div className="input-app" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#F8FAFC', 
              borderRadius: '50px', 
              border: '1px solid #E5E7EB',
              overflow: 'hidden'
            }}>
              <input
                type="number"
                min="1"
                max="30"
                value={duracionTimbre}
                onChange={(e) => setDuracionTimbre(Number(e.target.value))}
                style={{
                  width: '50%',
                  padding: '16px 24px',
                  border: 'none',
                  fontSize: '16px',
                  color: '#1E293B',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontWeight: '800',
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'center'
                }}
              />
              <div style={{
                width: '50%',
                padding: '16px',
                backgroundColor: '#F1F5F9',
                fontSize: '14px',
                color: '#64748B',
                fontWeight: '700',
                textAlign: 'center',
                borderLeft: '1px solid #E5E7EB'
              }}>
                segundos
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '12px 0 0 8px' }}>
              <Bell size={14} color="#94A3B8" />
              <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8', fontWeight: '500' }}>
                Límite seguro: 1s a 30s.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Zona Inferior: Botón y Notificaciones */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', paddingLeft: '8px' }}>
        
        <button
          onClick={guardarConfiguracion}
          disabled={guardando}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '16px 32px',
            backgroundColor: guardando ? '#BAE6FD' : '#0EA5E9',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50px', // Píldora
            fontSize: '15px',
            fontWeight: '800',
            cursor: guardando ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: guardando ? 'none' : '0 10px 20px rgba(14, 165, 233, 0.3)'
          }}
          onMouseEnter={(e) => { if (!guardando) e.currentTarget.style.backgroundColor = '#0284C7'; }}
          onMouseLeave={(e) => { if (!guardando) e.currentTarget.style.backgroundColor = '#0EA5E9'; }}
        >
          <Save size={20} strokeWidth={2.5} />
          {guardando ? "GUARDANDO..." : "GUARDAR AJUSTES"}
        </button>

        {/* Mensaje de Confirmación Animado */}
        {mensaje && (
          <div className="anim-pop" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            backgroundColor: mensaje.includes("obligatorio") || mensaje.includes("entre 1 y 30") || mensaje.includes("Error") ? '#FEF2F2' : '#F0FDF4',
            color: mensaje.includes("obligatorio") || mensaje.includes("entre 1 y 30") || mensaje.includes("Error") ? '#EF4444' : '#10B981',
            borderRadius: '50px',
            fontSize: '14px',
            fontWeight: '700',
            boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
          }}>
            {mensaje.includes("obligatorio") || mensaje.includes("entre 1 y 30") || mensaje.includes("Error") ? <Settings size={18} strokeWidth={2.5} /> : <CheckCircle size={18} strokeWidth={2.5} />}
            <span>{mensaje}</span>
          </div>
        )}
      </div>

    </div>
  );
}

export default Configuracion;
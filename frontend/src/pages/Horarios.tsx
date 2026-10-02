import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Pencil, Clock, Power, Bell, X, CalendarPlus } from "lucide-react";

interface Horario {
  id: number;
  nombre: string;
  hora: string;
  descripcion: string | null;
  activo: boolean;
  creado_en: string;
}

function Horarios() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [nombre, setNombre] = useState("");
  const [hora, setHora] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activo, setActivo] = useState(true);

  const cargarHorarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/horarios");
      setHorarios(response.data);
    } catch (error) {
      console.error("Error cargando horarios:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHorarios();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setHora("");
    setDescripcion("");
    setActivo(true);
    setEditandoId(null);
  };

  const guardarHorario = async () => {
    if (!nombre || !hora) {
      alert("El nombre y la hora son obligatorios.");
      return;
    }

    try {
      if (editandoId === null) {
        await axios.post("http://localhost:5000/api/horarios", {
          nombre,
          hora,
          descripcion,
          activo
        });
      } else {
        await axios.put(`http://localhost:5000/api/horarios/${editandoId}`, {
          nombre,
          hora,
          descripcion,
          activo
        });
      }

      limpiarFormulario();
      setMostrarFormulario(false);
      cargarHorarios();
    } catch (error) {
      console.error("Error guardando horario:", error);
      alert("No se pudo guardar el horario.");
    }
  };

  const editarHorario = (horario: Horario) => {
    setEditandoId(horario.id);
    setNombre(horario.nombre);
    setHora(horario.hora.substring(0, 5));
    setDescripcion(horario.descripcion || "");
    setActivo(Boolean(horario.activo));
    setMostrarFormulario(true);
  };

  const eliminarHorario = async (id: number) => {
    const confirmar = window.confirm("¿Confirmas la eliminación permanente de este bloque horario?");
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:5000/api/horarios/${id}`);
      cargarHorarios();
    } catch (error) {
      console.error("Error eliminando horario:", error);
      alert("No se pudo eliminar el horario.");
    }
  };

  const cambiarEstado = async (horario: Horario) => {
    try {
      await axios.put(`http://localhost:5000/api/horarios/${horario.id}`, {
        nombre: horario.nombre,
        hora: horario.hora.substring(0, 5),
        descripcion: horario.descripcion,
        activo: !horario.activo
      });
      cargarHorarios();
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert("No se pudo cambiar el estado del horario.");
    }
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
      
      {/* Motor de Animaciones CSS */}
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-slide-down {
          animation: slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .app-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .app-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(14, 165, 233, 0.12) !important;
        }
        .input-app:focus {
          border-color: #0EA5E9 !important;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15) !important;
        }
      `}</style>

      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingLeft: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '28px', color: '#1E293B', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Programación
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '15px', fontWeight: '500' }}>
            Gestiona los disparos automáticos del timbre.
          </p>
        </div>
        
        <button
          onClick={() => {
            limpiarFormulario();
            setMostrarFormulario(!mostrarFormulario);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            backgroundColor: mostrarFormulario ? '#FEF2F2' : '#0EA5E9',
            color: mostrarFormulario ? '#EF4444' : '#FFFFFF',
            border: 'none',
            borderRadius: '50px', // Píldora
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '700',
            transition: 'all 0.2s ease',
            boxShadow: mostrarFormulario ? 'none' : '0 8px 16px rgba(14, 165, 233, 0.3)'
          }}
          onMouseEnter={(e) => {
            if(!mostrarFormulario) e.currentTarget.style.backgroundColor = '#0284C7';
            else e.currentTarget.style.backgroundColor = '#FEE2E2';
          }}
          onMouseLeave={(e) => {
            if(!mostrarFormulario) e.currentTarget.style.backgroundColor = '#0EA5E9';
            else e.currentTarget.style.backgroundColor = '#FEF2F2';
          }}
        >
          {mostrarFormulario && editandoId === null ? (
            <><X size={20} strokeWidth={2.5} /> Cancelar</>
          ) : (
            <><Plus size={20} strokeWidth={2.5} /> Nuevo Bloque</>
          )}
        </button>
      </div>

      {/* Formulario Estilo Panel Flotante */}
      {mostrarFormulario && (
        <div className="anim-slide-down" style={{ 
          backgroundColor: '#FFFFFF', 
          padding: '36px', 
          borderRadius: '32px', 
          border: 'none', 
          marginBottom: '32px',
          boxShadow: '0 15px 35px rgba(14, 165, 233, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{ padding: '10px', backgroundColor: '#F0F9FF', borderRadius: '50%', color: '#0EA5E9' }}>
              <CalendarPlus size={24} strokeWidth={2.5} />
            </div>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#1E293B', fontWeight: '800' }}>
              {editandoId === null ? "Configurar nueva secuencia" : "Modificar secuencia existente"}
            </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#64748B', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Identificador (Nombre)
              </label>
              <input 
                className="input-app"
                type="text" 
                placeholder="Ej. Recreo Turno Mañana" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                style={{ width: '100%', padding: '16px 24px', borderRadius: '50px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '15px', backgroundColor: '#F8FAFC', color: '#1E293B', transition: 'all 0.2s ease' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#64748B', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Hora de ejecución
              </label>
              <input 
                className="input-app"
                type="time" 
                value={hora} 
                onChange={(e) => setHora(e.target.value)} 
                style={{ width: '100%', padding: '16px 24px', borderRadius: '50px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '15px', backgroundColor: '#F8FAFC', color: '#1E293B', fontVariantNumeric: 'tabular-nums', transition: 'all 0.2s ease' }} 
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: '#64748B', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Notas del sistema (Opcional)
              </label>
              <input 
                className="input-app"
                type="text" 
                placeholder="Ej. Toca 3 segundos para el cambio de clase" 
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
                style={{ width: '100%', padding: '16px 24px', borderRadius: '50px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '15px', backgroundColor: '#F8FAFC', color: '#1E293B', transition: 'all 0.2s ease' }} 
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => { limpiarFormulario(); setMostrarFormulario(false); }} 
              style={{ padding: '14px 28px', backgroundColor: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            >
              Descartar
            </button>
            <button 
              onClick={guardarHorario} 
              style={{ padding: '14px 32px', backgroundColor: '#0EA5E9', color: '#FFFFFF', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', boxShadow: '0 8px 16px rgba(14, 165, 233, 0.3)', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0284C7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0EA5E9'}
            >
              {editandoId === null ? "GUARDAR SECUENCIA" : "ACTUALIZAR SECUENCIA"}
            </button>
          </div>
        </div>
      )}

      {/* Rejilla de Horarios */}
      {cargando ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8', fontWeight: '600', fontSize: '16px' }}>Cargando datos de memoria...</div>
      ) : horarios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#FFFFFF', borderRadius: '32px', boxShadow: '0 10px 25px rgba(14, 165, 233, 0.05)' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#F0F9FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Clock size={40} color="#0EA5E9" strokeWidth={2} />
          </div>
          <h3 style={{ color: '#1E293B', margin: '0 0 8px 0', fontSize: '20px', fontWeight: '800' }}>Sin programaciones</h3>
          <p style={{ color: '#64748B', margin: 0, fontSize: '15px', fontWeight: '500' }}>Agrega tu primer bloque horario para automatizar el sistema.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {horarios.map((horario) => (
            <div 
              key={horario.id} 
              className="app-card"
              style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '32px', 
                padding: '28px', 
                border: 'none', 
                position: 'relative', 
                opacity: horario.activo ? 1 : 0.65,
                boxShadow: '0 10px 25px rgba(14, 165, 233, 0.05)'
              }}
            >
              
              {/* Badge Minimalista Estilo App */}
              <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: horario.activo ? '#F0F9FF' : '#F1F5F9',
                  color: horario.activo ? '#0EA5E9' : '#64748B',
                  borderRadius: '50px',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: horario.activo ? '#0EA5E9' : '#94A3B8' }}></span>
                  {horario.activo ? "Armado" : "Bypass"}
                </div>
              </div>

              {/* Información principal */}
              <div style={{ marginBottom: '28px', paddingRight: '90px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#94A3B8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                  {horario.nombre}
                </h4>
                <p style={{ margin: 0, fontSize: '46px', fontWeight: '800', color: '#1E293B', letterSpacing: '-1.5px', fontVariantNumeric: 'tabular-nums', lineHeight: '1' }}>
                  {formatearHoraAmPm(horario.hora.substring(0, 5))}
                </p>
                {horario.descripcion && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '12px' }}>
                    <Bell size={14} color="#64748B" /> 
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B', fontWeight: '500' }}>{horario.descripcion}</p>
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
                
                <button 
                  onClick={() => cambiarEstado(horario)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
                    backgroundColor: horario.activo ? '#FFFFFF' : '#0EA5E9', 
                    color: horario.activo ? '#64748B' : '#FFFFFF', 
                    border: horario.activo ? '1px solid #E5E7EB' : 'none', 
                    borderRadius: '50px', cursor: 'pointer', fontSize: '14px', fontWeight: '700',
                    transition: 'all 0.2s ease',
                    boxShadow: horario.activo ? 'none' : '0 4px 12px rgba(14, 165, 233, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (horario.activo) {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.color = '#1E293B';
                    } else {
                      e.currentTarget.style.backgroundColor = '#0284C7';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (horario.activo) {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.color = '#64748B';
                    } else {
                      e.currentTarget.style.backgroundColor = '#0EA5E9';
                    }
                  }}
                >
                  <Power size={16} strokeWidth={2.5} />
                  {horario.activo ? "DESARMAR" : "ARMAR"}
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => editarHorario(horario)} 
                    style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF', color: '#0EA5E9', border: 'none', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s ease' }} 
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E0F2FE'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F0F9FF'; e.currentTarget.style.transform = 'scale(1)'; }}
                    title="Modificar"
                  >
                    <Pencil size={18} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={() => eliminarHorario(horario.id)} 
                    style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s ease' }} 
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.transform = 'scale(1)'; }}
                    title="Eliminar registro"
                  >
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Horarios;
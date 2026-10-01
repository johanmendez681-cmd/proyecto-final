import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Pencil, Clock, Power, Bell } from "lucide-react";

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
      alert("No se pudieron cargar los horarios.");
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
        alert("Horario creado correctamente.");
      } else {
        await axios.put(`http://localhost:5000/api/horarios/${editandoId}`, {
          nombre,
          hora,
          descripcion,
          activo
        });
        alert("Horario actualizado correctamente.");
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
    const confirmar = window.confirm("¿Seguro que querés eliminar este horario?");
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
    let horas = parseInt(h);
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12;
    horas = horas ? horas : 12;
    return `${horas}:${m} ${ampm}`;
  };

  return (
    <div className="horarios-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>Horarios</h2>
          <p style={{ color: '#6b7280' }}>Administrá los horarios programados del timbre escolar.</p>
        </div>
        <button
          className="primary-button"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => {
            limpiarFormulario();
            setMostrarFormulario(!mostrarFormulario);
          }}
        >
          <Plus size={20} />
          {mostrarFormulario && editandoId === null ? "Cerrar" : "Nuevo horario"}
        </button>
      </div>

      {mostrarFormulario && (
        <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1e293b' }}>
            {editandoId === null ? "Crear nueva programación" : "Editar programación"}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#475569', fontSize: '14px' }}>Nombre del evento</label>
              <input type="text" placeholder="Ej. Entrada Principal" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#475569', fontSize: '14px' }}>Hora de activación</label>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#475569', fontSize: '14px' }}>Descripción (Opcional)</label>
              <input type="text" placeholder="Ej. Inicio de jornada escolar" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => { limpiarFormulario(); setMostrarFormulario(false); }} style={{ padding: '10px 16px', backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
              Cancelar
            </button>
            <button onClick={guardarHorario} style={{ padding: '10px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              {editandoId === null ? "Guardar horario" : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}

      {cargando ? (
        <p>Cargando horarios...</p>
      ) : horarios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <Clock size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: '#334155', margin: '0 0 8px 0' }}>No hay horarios registrados</h3>
          <p style={{ color: '#64748b', margin: 0 }}>Creá tu primer horario para automatizar el timbre.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {horarios.map((horario) => (
            <div key={horario.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', position: 'relative', opacity: horario.activo ? 1 : 0.6 }}>
              
              {/* Badge de estado */}
              <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: horario.activo ? '#dcfce7' : '#f1f5f9', color: horario.activo ? '#166534' : '#475569', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: horario.activo ? '#22c55e' : '#94a3b8' }}></span>
                {horario.activo ? "Activo" : "Inactivo"}
              </div>

              {/* Información principal */}
              <div style={{ marginBottom: '20px', marginTop: '10px' }}>
                <h4 style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {horario.nombre}
                </h4>
                <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {formatearHoraAmPm(horario.hora.substring(0, 5))}
                </p>
                {horario.descripcion && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bell size={14} /> {horario.descripcion}
                  </p>
                )}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

              {/* Botones de acción */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={() => cambiarEstado(horario)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: horario.activo ? '#fee2e2' : '#dcfce7', color: horario.activo ? '#991b1b' : '#166534', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  <Power size={14} />
                  {horario.activo ? "Apagar" : "Encender"}
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => editarHorario(horario)} style={{ padding: '8px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Editar">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => eliminarHorario(horario.id)} style={{ padding: '8px', backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }} title="Eliminar">
                    <Trash2 size={16} />
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
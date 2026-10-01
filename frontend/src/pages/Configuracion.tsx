import { useEffect, useState } from "react";
import axios from "axios";
import {
  Settings,
  Save,
  School,
  Bell
} from "lucide-react";

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
      const response = await axios.get(
        "http://localhost:5000/api/configuracion"
      );

      const datos: ConfiguracionData[] = response.data;

      if (datos.length > 0) {
        setNombreInstitucion(datos[0].nombre_institucion);
        setDuracionTimbre(datos[0].duracion_timbre);
      }

    } catch (error) {
      console.error(
        "Error cargando configuración:",
        error
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const guardarConfiguracion = async () => {
    if (!nombreInstitucion.trim()) {
      setMensaje(
        "El nombre de la institución es obligatorio."
      );
      return;
    }

    if (
      duracionTimbre < 1 ||
      duracionTimbre > 30
    ) {
      setMensaje(
        "La duración debe estar entre 1 y 30 segundos."
      );
      return;
    }

    try {
      setGuardando(true);
      setMensaje("");

      const response = await axios.put(
        "http://localhost:5000/api/configuracion",
        {
          nombre_institucion:
            nombreInstitucion.trim(),
          duracion_timbre: duracionTimbre
        }
      );

      setMensaje(response.data.mensaje);

    } catch (error) {
      console.error(
        "Error guardando configuración:",
        error
      );

      setMensaje(
        "No se pudo guardar la configuración."
      );

    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="configuracion-page">
        <p className="empty-message">
          Cargando configuración...
        </p>
      </div>
    );
  }

  return (
    <div className="configuracion-page">

      <div className="page-header">

        <div>
          <h2>Configuración</h2>

          <p>
            Administrá la configuración general
            de S.O.N.O.R.
          </p>
        </div>

      </div>

      <div className="configuracion-grid">

        <div className="configuracion-card">

          <div className="card-title">
            <School size={22} />
            <h3>Institución</h3>
          </div>

          <div className="form-group">

            <label>
              Nombre de la institución
            </label>

            <input
              type="text"
              value={nombreInstitucion}
              placeholder="Nombre de la institución"
              onChange={(e) =>
                setNombreInstitucion(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        <div className="configuracion-card">

          <div className="card-title">
            <Bell size={22} />
            <h3>Timbre</h3>
          </div>

          <div className="form-group">

            <label>
              Duración del timbre
            </label>

            <div className="input-with-unit">

              <input
                type="number"
                min="1"
                max="30"
                value={duracionTimbre}
                onChange={(e) =>
                  setDuracionTimbre(
                    Number(e.target.value)
                  )
                }
              />

              <span>segundos</span>

            </div>

            <small>
              Podés configurar una duración
              entre 1 y 30 segundos.
            </small>

          </div>

        </div>

      </div>

      <div className="configuracion-actions">

        <button
          className="primary-button"
          onClick={guardarConfiguracion}
          disabled={guardando}
        >

          <Save size={19} />

          {guardando
            ? "Guardando..."
            : "Guardar configuración"}

        </button>

      </div>

      {mensaje && (
        <div className="configuracion-message">
          <Settings size={19} />
          <span>{mensaje}</span>
        </div>
      )}

    </div>
  );
}

export default Configuracion;

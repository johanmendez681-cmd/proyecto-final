import { useState } from "react";
import axios from "axios";
import { Bell, CheckCircle } from "lucide-react";

function Timbre() {
  const [activando, setActivando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const sonarTimbre = async () => {
    try {
      setActivando(true);
      setMensaje("");

      const response = await axios.post(
        "http://localhost:5000/api/timbre/sonar"
      );

      setMensaje(response.data.mensaje);

    } catch (error) {
      console.error("Error activando el timbre:", error);
      setMensaje("No se pudo activar el timbre.");

    } finally {
      setActivando(false);
    }
  };

  return (
    <div className="timbre-page">

      <div className="page-header">
        <div>
          <h2>Timbre</h2>
          <p>
            Control manual del timbre institucional.
          </p>
        </div>
      </div>

      <div className="timbre-card">

        <div className="timbre-icon">
          <Bell size={70} />
        </div>

        <h3>Control manual</h3>

        <p>
          Presioná el botón para activar el timbre
          manualmente.
        </p>

        <button
          className="timbre-button"
          onClick={sonarTimbre}
          disabled={activando}
        >
          <Bell size={28} />

          {activando
            ? "Activando..."
            : "HACER SONAR EL TIMBRE"}
        </button>

        {mensaje && (
          <div className="timbre-message">
            <CheckCircle size={20} />
            <span>{mensaje}</span>
          </div>
        )}

      </div>

    </div>
  );
}

export default Timbre;
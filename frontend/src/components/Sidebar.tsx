import { Bell, CalendarClock, Home, Settings, LogOut, History } from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const menuItems = [
    { id: "inicio", label: "Panel de Control", icon: Home },
    { id: "horarios", label: "Programación", icon: CalendarClock },
    { id: "timbre", label: "Control Manual", icon: Bell },
    { id: "historial", label: "Historial", icon: History },
    { id: "configuracion", label: "Ajustes", icon: Settings }
  ];

  return (
    <aside style={{
      width: "280px",
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "32px 20px",
      height: "100vh",
      flexShrink: 0,
      borderRight: "1px solid #F0F9FF",
      boxShadow: "4px 0 24px rgba(14, 165, 233, 0.05)"
    }}>
      <div>
        {/* Logo estilo App */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "0 12px",
          marginBottom: "40px"
        }}>
          <div style={{
            backgroundColor: "#0EA5E9",
            color: "#FFFFFF",
            width: "48px",
            height: "48px",
            borderRadius: "16px", // Curva suave
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 16px rgba(14, 165, 233, 0.25)"
          }}>
            <Bell size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1E293B", letterSpacing: "-0.5px", margin: 0 }}>
              S.O.N.O.R.
            </h2>
            <span style={{ fontSize: "12px", color: "#0EA5E9", fontWeight: "700" }}>
              App Escolar
            </span>
          </div>
        </div>

        {/* Navegación en forma de píldoras */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  width: "100%",
                  padding: "14px 20px",
                  backgroundColor: isActive ? "#0EA5E9" : "transparent",
                  color: isActive ? "#FFFFFF" : "#64748B",
                  border: "none",
                  borderRadius: "50px", // Forma de píldora
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.3s ease",
                  boxShadow: isActive ? "0 8px 16px rgba(14, 165, 233, 0.3)" : "none",
                  fontWeight: isActive ? "700" : "600"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#F0F9FF";
                    e.currentTarget.style.color = "#0EA5E9";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#64748B";
                  }
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span style={{ fontSize: "15px" }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Botón de Salida */}
      <div>
        <button
          onClick={() => {
            if(window.confirm("¿Cerrar sesión en la App S.O.N.O.R.?")) {
              window.location.reload();
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "14px 20px",
            backgroundColor: "#FEF2F2",
            border: "none",
            borderRadius: "50px", // Píldora
            color: "#EF4444",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "700",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FEE2E2";
            e.currentTarget.style.color = "#DC2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FEF2F2";
            e.currentTarget.style.color = "#EF4444";
          }}
        >
          <LogOut size={18} strokeWidth={2.5} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
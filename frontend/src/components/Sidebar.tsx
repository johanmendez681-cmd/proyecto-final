import {
  Bell,
  CalendarClock,
  Home,
  Settings,
  LogOut,
  History
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

function Sidebar({ activePage, setActivePage }: SidebarProps) {
 const menuItems = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "horarios", label: "Horarios", icon: CalendarClock },
  { id: "timbre", label: "Timbre", icon: Bell },
  { id: "historial", label: "Historial", icon: History },
  { id: "configuracion", label: "Configuración", icon: Settings }
];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Bell size={26} />
        </div>

        <div>
         <h2>S.O.N.O.R.</h2>
          <span>Sistema Escolar</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`menu-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={21} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        className="menu-item logout"
        onClick={() => alert("Cerrar sesión próximamente")}
      >
        <LogOut size={21} />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  );
}

export default Sidebar;
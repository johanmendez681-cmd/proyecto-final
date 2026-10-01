import { Bell, User } from "lucide-react";

function Header() {
  return (
    <header className="header">
      <div>
        <h1>Panel de control</h1>
           <p>Sistema Orgánico de Notificaciones y Operación del Receso</p>
      </div>

      <div className="header-user">
        <div className="notification">
          <Bell size={20} />
        </div>

        <div className="user-avatar">
          <User size={20} />
        </div>

        <div className="user-info">
          <strong>Administrador</strong>
          <span>Administrador</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
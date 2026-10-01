import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Horarios from "./pages/Horarios";
import Timbre from "./pages/Timbre";
import Historial from "./pages/Historial";
import Configuracion from "./pages/Configuracion";

import "./index.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("inicio");

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() => setIsLoggedIn(true)}
      />
    );
  }

  return (
    <div className="app">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">

        <Header />

        <div className="content">

          {activePage === "inicio" && <Home />}

          {activePage === "horarios" && <Horarios />}

          {activePage === "timbre" && <Timbre />}

          {activePage === "historial" && <Historial />}

          {activePage === "configuracion" && (
            <Configuracion />
          )}

        </div>

      </main>

    </div>
  );
}

export default App;
import React, { useState } from "react"; // Importa useState desde React
import { Link, useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/api";
import "../styles/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // Ahora debería funcionar
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthToken(null); // Elimina el token
    navigate("/home"); // Redirige al login
  };

  return (
    
    <nav className="navbar">
    <div className="nav-left">
      <Link to="/dashboard" className="nav-link">Dashboard</Link>
      <Link to="/crear-cultivo" className="nav-link">Crear Cultivo</Link>
      <Link to="/grafica" className="nav-link">Gráfica</Link>
      <Link to="/estadisticas" className="nav-link">Estadisticas</Link>
      <button className="nav-link" onClick={handleLogout}>Cerrar Sesión</button>
    </div>
    <div className="nav-toggle" onClick={toggleMenu}>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
    <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
      <Link to="/dashboard" className="nav-link">Dashboard</Link>
      <Link to="/crear-cultivo" className="nav-link">Crear Cultivo</Link>
      <Link to="/grafica" className="nav-link">Gráfica</Link>
      <Link to="/estadisticas" className="nav-link">Estadisticas</Link>
      <button className="nav-link" onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  </nav>
  );
}

export default Navbar;

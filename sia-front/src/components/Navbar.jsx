import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom"; // Usar NavLink para estilos activos
import { setAuthToken } from "../api/api";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthToken(null);
    navigate("/home");
  };

  // Estilos para los enlaces, incluyendo el estado activo con NavLink
  const linkStyles = "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors";
  const activeLinkStyles = "bg-green-50 text-green-700";

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex-shrink-0">
            <span className="text-xl font-bold text-green-700">SIA</span>
          </Link>

          {/* Menú para desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/crear-cultivo"
              className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}
            >
              Crear Cultivo
            </NavLink>
            <NavLink
              to="/grafica"
              className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}
            >
              Gráfica
            </NavLink>
            <NavLink
              to="/asesor"
              className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}
            >
              Asesor de Cosecha
            </NavLink>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Botón de menú hamburguesa */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-green-50 focus:outline-none transition-colors"
            >
              <span className="sr-only">Abrir menú</span>
              <div className="space-y-1.5">
                <div className={`h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`h-0.5 w-6 bg-current transition duration-300 ease-in-out ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menú mobile */}
      <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
          {/* Se usan NavLinks aquí también para consistencia */}
          <NavLink to="/dashboard" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/crear-cultivo" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`} onClick={() => setMenuOpen(false)}>Crear Cultivo</NavLink>
          <NavLink to="/grafica" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`} onClick={() => setMenuOpen(false)}>Gráfica</NavLink>
          <NavLink to="/asesor" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`} onClick={() => setMenuOpen(false)}>Asesor de Cosecha</NavLink>
          <button
            onClick={() => { handleLogout(); setMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

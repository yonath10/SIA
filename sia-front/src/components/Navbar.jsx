import React, { useState } from "react"; // Importa useState desde React
import { Link, useNavigate } from "react-router-dom";
import { setAuthToken } from "../api/api";


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
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo o nombre de la app - opcional */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-indigo-600">SIA</span>
          </div>

          {/* Menú para desktop - oculto en mobile */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/crear-cultivo"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Crear Cultivo
            </Link>
            <Link
              to="/grafica"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Gráfica
            </Link>
            <Link
              to="/asesor"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Asesor de Cosecha
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Botón de menú hamburguesa - solo visible en mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú</span>
              {/* Icono de hamburguesa */}
              <div className="space-y-1.5">
                <div className={`h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`h-0.5 w-6 bg-current transition duration-300 ease-in-out ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menú mobile - solo visible cuando está abierto */}
      <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
          <Link
            to="/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/crear-cultivo"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Crear Cultivo
          </Link>
          <Link
            to="/grafica"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Gráfica
          </Link>
          <Link
            to="/estadisticas"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Estadísticas
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
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
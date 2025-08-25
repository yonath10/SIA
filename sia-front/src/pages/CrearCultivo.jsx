import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { jwtDecode } from "jwt-decode";

import Navbar from "../components/Navbar";


const cultivosDisponibles = ["Espinaca", "Cilantro", "Lechuga", "Apio", "Brócoli", "Papa", "Zanahoria", "Remolacha", "Maíz"];

const token = localStorage.getItem("token");
const userId = token ? jwtDecode(token).id : null;

function CrearCultivo() {
    const [form, setForm] = useState({
        nombre: cultivosDisponibles[0],
        localizacion: "",
        espacio_sembrado: "",
        cantidad_estimado: "",
        fecha_siembra: "",
        userId: userId || "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            if (!token) {
                setError("No estás autenticado");
                return;
            }
            if (!userId) {
                setError("No se encontró el usuario");
                return;
            }

            const fechaSiembra = new Date(form.fecha_siembra);
            const tiempoCosecha = obtenerTiempoCosecha(form.nombre); // Obtener tiempo de cosecha por defecto
            const fechaVencimiento = new Date(fechaSiembra);
            fechaVencimiento.setDate(fechaSiembra.getDate() + tiempoCosecha);

            const cultivoData = {
                ...form,
                userId,
                fecha_vencimiento: fechaVencimiento.toISOString().split("T")[0],
            };

            const { data } = await api.post("/cultivos/crearCultivo", cultivoData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess("Cultivo creado exitosamente");
            setTimeout(() => navigate("/dashboard"), 2000);
        } catch (error) {
            console.error("Error al crear el cultivo:", error);
            setError("Error al crear el cultivo");
        }
    };

    // Función para obtener el tiempo de cosecha por defecto para cada cultivo
    const obtenerTiempoCosecha = (nombreCultivo) => {
        switch (nombreCultivo) {
            case "Espinaca": return 60; // Días
            case "Cilantro": return 45; // Días
            case "Lechuga": return 50; // Días
            case "Apio": return 90; // Días
            case "Brócoli": return 75; // Días
            case "Papa": return 120; // Días
            case "Zanahoria": return 100; // Días
            case "Remolacha": return 60; // Días
            case "Maíz": return 90; // Días
            default: return 60; // Tiempo por defecto si no se encuentra el cultivo
        }
    };

 return (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Encabezado */}
        <div className="bg-indigo-600 py-4 px-6">
          <h2 className="text-2xl font-bold text-white">Crear Nuevo Cultivo</h2>
        </div>

        {/* Mensajes de estado */}
        <div className="px-6 pt-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <p>{success}</p>
            </div>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campo de selección de producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Producto
            </label>
            <select
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {cultivosDisponibles.map((cultivo, index) => (
                <option key={index} value={cultivo}>
                  {cultivo}
                </option>
              ))}
            </select>
          </div>

          {/* Campo de localización */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localización
            </label>
            <input
              type="text"
              name="localizacion"
              placeholder="Ej: Finca Las Acacias, Municipio X"
              value={form.localizacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Campos numéricos en grid responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Espacio sembrado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Espacio sembrado (m²)
              </label>
              <input
                type="number"
                name="espacio_sembrado"
                placeholder="Ej: 2500"
                value={form.espacio_sembrado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                min="0"
              />
            </div>

            {/* Cantidad estimada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad estimada (kg)
              </label>
              <input
                type="number"
                name="cantidad_estimado"
                placeholder="Ej: 500"
                value={form.cantidad_estimado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                min="0"
              />
            </div>
          </div>

          {/* Fecha de siembra */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Siembra
            </label>
            <input
              type="date"
              name="fecha_siembra"
              value={form.fecha_siembra}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Botón de submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Crear Cultivo
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}

export default CrearCultivo;